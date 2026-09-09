# Auditoría de Seguridad del Servidor — Septiembre 2026

Este documento es el registro oficial y completo de la auditoría de seguridad ejecutada el **8–9 de septiembre de 2026** sobre el servidor de producción **AWS Lightsail (Debian 13, 1 GB RAM)** que aloja el ecosistema `jorgedoicela.com`.

---

## 1. Contexto y Detonante

### 1.1 Evento Inicial
Se detectó que la **IP pública del VPS (`44.192.40.200`)** estaba registrada en el historial de commits de Git y visible públicamente en GitHub. La IP apareció en `docs/03-portfolio/01-frontend/01_frontend_y_terminal_ssh.md` en el commit `cde9dd3` (*feat (portafolio): semejante a AWS*, 2 sep 2026). La IP fue eliminada del texto en commits posteriores pero permanece en el historial de Git.

### 1.2 Protección Web Pre-Existente (Confirmada)
- **Cloudflare mTLS:** `ssl_verify_client on` en Nginx — conexiones directas a la IP devuelven `444` (TCP cerrado).
- **SSH clave pública únicamente:** `PasswordAuthentication no` ya configurado.
- **CORS lista blanca explícita** en NestJS.

---

## 2. Diagnóstico — Hallazgos

| Severidad | Hallazgo | Detalle |
|---|---|---|
| 🚨 Crítico | Puerto 3000 NestJS expuesto | `*:3000` accesible desde internet, bypassa Nginx y mTLS |
| 🚨 Crítico | Puerto 3001 Next.js expuesto | `0.0.0.0:3001` accesible desde internet, bypassa Nginx y mTLS |
| 🚨 Crítico | Sin firewall | `ufw` no instalado — cero bloqueo perimetral |
| ⚠️ Alto | Ataque SSH activo | IP `222.91.124.34` (China): cientos de intentos/minuto automatizados |
| ⚠️ Alto | PermitRootLogin permisivo | Directiva comentada en `sshd_config` — sshd usaba valor por defecto `without-password` |
| ⚠️ Medio | 5 contenedores Docker zombies | 2–6 días corriendo (TTL de 5 min no los eliminó por reinicios abruptos de PM2) |

### 2.1 Puertos al momento de la auditoría
```text
0.0.0.0:80    ← Nginx HTTP (correcto)
0.0.0.0:22    ← SSH (sin fail2ban = vulnerable a fuerza bruta)
0.0.0.0:5355  ← mDNS/LLMNR innecesario
0.0.0.0:3001  ← ¡CRÍTICO! Next.js público
0.0.0.0:443   ← Nginx HTTPS (correcto)
      *:3000  ← ¡CRÍTICO! NestJS público
```

### 2.2 Ataque SSH activo detectado
```text
Sep 08 11:29:45 sshd: Invalid user debian from 222.91.124.34
Sep 08 11:29:46 sshd: Invalid user debian from 222.91.124.34
... (cientos de intentos en minutos)
Sep 08 22:24:23 sshd: Invalid user wqmarlduiqkmgs from 102.219.227.90
```

### 2.3 Contenedores Docker zombies
```text
sandbox_vps_IkaHFOCznYlnyGtZAAAM_1788664619801  → 2 días
sandbox_vps_YKv8l3E5ShLjHorAAAr_1788399558409   → 6 días
sandbox_vps_d807bmVTDLvpMkhgAAAp_1788399557662   → 6 días
sandbox_vps_XOKUiPWuyB2LixLlAAAn_1788399555952   → 6 días
sandbox_vps_2AKHcpiiPLQxp6RnAAAR_1788318067742   → 6 días
```

---

## 3. Remediación — Acciones Aplicadas en Orden Cronológico

### 3.1 Firewall UFW (Bloqueo inmediato)
```bash
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP → Nginx'
sudo ufw allow 443/tcp comment 'HTTPS → Nginx mTLS'
sudo ufw enable
```
**Resultado:** UFW activo. Puertos 3000/3001/5355 bloqueados desde el exterior.

---

### 3.2 fail2ban — Protección anti-fuerza bruta SSH
```bash
sudo apt install -y fail2ban

sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled  = true
port     = ssh
logpath  = %(sshd_log)s
backend  = systemd
EOF

sudo systemctl enable fail2ban && sudo systemctl start fail2ban

# Baneo manual inmediato de atacantes activos:
sudo fail2ban-client set sshd banip 222.91.124.34   # → 1 (éxito)
sudo fail2ban-client set sshd banip 102.219.227.90  # → 1 (éxito)
```
**Resultado:** fail2ban activo. Atacantes baneados inmediatamente.

---

### 3.3 SSH Hardening — PermitRootLogin

**Causa raíz:** La directiva en `/etc/ssh/sshd_config` estaba comentada (`#PermitRootLogin prohibit-password`), por lo que sshd usaba el valor compilado `without-password`. El `sed` inicial falló porque buscaba una línea sin `#`.

```bash
# Corrección definitiva (descomenta y cambia al mismo tiempo):
sudo sed -i 's/^#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sshd -T | grep permitrootlogin   # → permitrootlogin no ✅
sudo systemctl reload ssh
```
**Resultado:** `permitrootlogin no`. Root completamente deshabilitado.

---

### 3.4 Eliminación de contenedores Docker zombies

**Causa probable:** NestJS se reinició 30 veces (↺ 30 en PM2) de forma abrupta sin ejecutar `OnModuleDestroy`, dejando contenedores huérfanos que consumían ~150 MB de RAM.

```bash
docker stop sandbox_vps_IkaHFOCznYlnyGtZAAAM_1788664619801 \
             sandbox_vps_YKv8l3E5ShLjHorAAAr_1788399558409 \
             sandbox_vps_d807bmVTDLvpMkhgAAAp_1788399557662 \
             sandbox_vps_XOKUiPWuyB2LixLlAAAn_1788399555952 \
             sandbox_vps_2AKHcpiiPLQxp6RnAAAR_1788318067742
docker rm -f $(docker ps -aq)
```
**Resultado:** `docker ps -a` vacío. RAM free: 123 MB (+~150 MB recuperados).

---

### 3.5 Bind de Node.js a 127.0.0.1 (Defensa en profundidad)

**Causa raíz:** `pm2.config.js` no especificaba `HOST`/`HOSTNAME` → Node.js usaba `0.0.0.0` por defecto.

#### 3.5.1 Cambios en el repositorio (git commit)

**`pm2.config.js`:**
```js
// backend-nest:  env: { HOST: '127.0.0.1', ... }
// frontend-next: env: { HOSTNAME: '127.0.0.1', PORT: 3001, ... }
```

**`backend/src/main.ts`:**
```ts
// Antes: await app.listen(port);
// Después:
const host = process.env.HOST ?? '0.0.0.0';
await app.listen(port, host);
```

#### 3.5.2 Aplicación inmediata en el servidor

```bash
# Editar pm2.config.js en el servidor con nano → agregar HOST y HOSTNAME
nano ~/jorge_doicela/pm2.config.js

# Recargar con la nueva configuración
pm2 reload ~/jorge_doicela/pm2.config.js --update-env
```

**Verificación:**
```text
LISTEN  127.0.0.1:3001  ← Next.js sellado ✅ (inmediato)
LISTEN        *:3000    ← NestJS sellado en próximo deploy CI/CD ✅
```

#### 3.5.3 CI/CD ejecutado inmediatamente
```bash
git add pm2.config.js backend/src/main.ts \
        docs/01-infraestructura-global/02-despliegue-y-servidor/01_despliegue_pm2_y_cicd.md
git commit -m "security: bind NestJS y Next.js a 127.0.0.1 en producción"
git push origin main
```
→ CI/CD compila `main.ts` → instala en VPS → NestJS queda en `127.0.0.1:3000`.

---

### 3.7 Auditoría Nivel 2 — Hallazgos y Correcciones Adicionales (Sep 2026)

#### 3.7.1 Permisos del `.env` del backend — CRÍTICO

**Hallazgo:** `backend/.env` tenía permisos `664` (world-readable) — cualquier usuario del sistema podía leer las credenciales/secrets del backend.

```bash
# Antes:
-rw-rw-r-- 1 admin admin 1042  backend/.env   ← cualquier usuario puede leer

# Fix aplicado:
chmod 600 ~/jorge_doicela/backend/.env

# Verificación:
-rw------- 1 admin admin 1042  backend/.env   ✅
```

**Causa raíz:** El archivo fue creado con `umask` permisivo por defecto. El `.gitignore` evita que se suba al repo, pero los permisos en servidor son responsabilidad del operador.

#### 3.7.2 Hardening del kernel con sysctl

**Hallazgo:** El servidor no tenía ningún parámetro de seguridad del kernel configurado explícitamente. `sysctl -a` no devolvió valores para los parámetros críticos de red.

**Fix aplicado:** Creación de `/etc/sysctl.d/99-hardening.conf` con parámetros de hardening:

```bash
sudo tee /etc/sysctl.d/99-hardening.conf << 'EOF'
# Protección contra SYN flood
net.ipv4.tcp_syncookies = 1
# No aceptar redirects ICMP (vector de MITM)
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
# No enviar redirects
net.ipv4.conf.all.send_redirects = 0
# No aceptar rutas fuente (source routing)
net.ipv4.conf.all.accept_source_route = 0
# Ignorar broadcasts ICMP (amplification attacks)
net.ipv4.icmp_echo_ignore_broadcasts = 1
# Reverse Path Filtering (anti-spoofing)
net.ipv4.conf.all.rp_filter = 1
# ASLR máximo (Address Space Layout Randomization)
kernel.randomize_va_space = 2
EOF

sudo sysctl -p /etc/sysctl.d/99-hardening.conf
```

**Confirmación de aplicación:**
```text
net.ipv4.tcp_syncookies = 1         ✅
net.ipv4.conf.all.accept_redirects = 0  ✅
net.ipv6.conf.all.accept_redirects = 0  ✅
net.ipv4.conf.all.send_redirects = 0    ✅
net.ipv4.conf.all.accept_source_route = 0  ✅
net.ipv4.icmp_echo_ignore_broadcasts = 1   ✅
net.ipv4.conf.all.rp_filter = 1     ✅
kernel.randomize_va_space = 2       ✅
```

El archivo persiste en `/etc/sysctl.d/` y se aplica automáticamente en cada arranque del VPS.

---



#### 3.6.1 Guardar la lista de procesos
```bash
pm2 save
# → [PM2] Successfully saved in /home/admin/.pm2/dump.pm2
```

#### 3.6.2 Generar y registrar la unidad systemd para reinicio automático
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u admin --hp /home/admin
```

Esto crea `/etc/systemd/system/pm2-admin.service` y ejecuta `systemctl enable pm2-admin`.

#### 3.6.3 Problema encontrado: `Type=forking` con daemon ya corriendo

El servicio generado por PM2 usa `Type=forking`. Al intentar iniciarlo con el daemon PM2 ya corriendo, systemd falla con `Result: protocol` porque no puede tomar el control de un proceso que no inició él. Causa: el daemon PM2 llevaba **1 semana + 22 horas** corriendo antes de que existiera la unidad systemd.

```text
× pm2-admin.service: Failed with result 'protocol'.
  Process: pm2 resurrect (code=exited, status=0/SUCCESS)
  pm2-admin.service: Start request repeated too quickly.
```

**Solución aplicada** (provoca ~10 segundos de downtime controlado):
```bash
# 1. Limpiar estado fallido
sudo systemctl reset-failed pm2-admin

# 2. Matar el daemon PM2 actual (procesos Node también se detienen)
pm2 kill
# → [PM2] Daemon Stopped

# 3. Iniciar PM2 bajo systemd (ejecuta pm2 resurrect y restaura el dump.pm2)
sudo systemctl start pm2-admin

# 4. Verificar
systemctl is-active pm2-admin
# → active ✅
```

**Resultado verificado:**
```text
backend-nest   online ↑ 0 (contador limpio desde cero)  pid=320236
frontend-next  online ↑ 0 (contador limpio desde cero)  pid=320237

LISTEN  127.0.0.1:3000  ← NestJS (loopback) ✅
LISTEN  127.0.0.1:3001  ← Next.js (loopback) ✅
```


---

---

## 4. Verificación Completa Final — Segunda Ronda (Post-Hardening)

Verificación completa de los 12 vectores ejecutada después de aplicar todos los cambios.

### [1] Puertos abiertos — Confirmado
```text
0.0.0.0:80     ← Nginx HTTP (correcto)
0.0.0.0:22     ← SSH (protegido por fail2ban + clave pública)
0.0.0.0:443    ← Nginx HTTPS (mTLS Cloudflare)
127.0.0.1:3000 ← NestJS solo loopback ✅ (CI/CD compiló main.ts con HOST)
127.0.0.1:3001 ← Next.js solo loopback ✅
0.0.0.0:5355   ← mDNS/LLMNR (bloqueado por UFW desde exterior, inofensivo)
```

### [2] UFW Status — Activo
```text
Status: active
Default: deny (incoming), allow (outgoing), deny (routed)
22/tcp   ALLOW IN  Anywhere  # SSH
80/tcp   ALLOW IN  Anywhere  # HTTP → Nginx redirect a HTTPS
443/tcp  ALLOW IN  Anywhere  # HTTPS → Nginx con mTLS
```

### [3] Fail2ban — Operativo
```text
Currently failed: 0     ← sin ataques activos (fail2ban los bloquea silenciosamente)
Currently banned: 2
Banned IP list: 222.91.124.34  102.219.227.90
```
> Los baneos son de 1 hora (bantime=3600). Expiran y se re-aplican automáticamente si el atacante
> reintenta. Se re-banearon manualmente después de la primera expiración.

### [4] SSH Config — Endurecido al máximo
```text
logingracetime 120
maxauthtries 6
permitRootLogin no          ← deshabilitado ✅
pubkeyauthentication yes    ← solo clave pública ✅
passwordauthentication no   ← contraseña deshabilitada ✅
```

### [5] Ataques SSH últimas 2 horas — Ninguno
```text
# Solo conexiones legítimas:
Accepted publickey for admin from 201.46.114.49   ← sesión SSH del desarrollador
Accepted publickey for admin from 20.168.109.82   ← GitHub Actions (Azure IP) - deploy CI/CD
# Zero entradas "Invalid user" o "Failed password"
```
> `20.168.109.82` = IP del runner de GitHub Actions (rango Azure). Confirmó que el CI/CD corrió correctamente durante la auditoría.

### [6] Docker Containers — Limpio
```text
CONTAINER ID  IMAGE  COMMAND  CREATED  STATUS  PORTS  NAMES
(vacío)
```

### [7] PM2 Status
```text
backend-nest   online  ↑ 0  126 MB  (estabilizado después del start via systemd)
frontend-next  online  ↑ 0  111 MB
RAM total: 52.5% (496 MB / 939 MB) — saludable
```

### [8] Nginx — Sintaxis OK
```text
nginx: configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### [9] Nginx mTLS — Verificado
```text
server_tokens off;                                  ← ocultamiento de versión ✅
ssl_client_certificate /etc/ssl/certs/cloudflare.crt  ← CA de Cloudflare ✅
ssl_verify_client on;                               ← mTLS activo ✅
```

### [10] RAM del Servidor
```text
Mem:   939Mi  total  |  496Mi used  |  124Mi free  |  443Mi available
Swap:  2.0Gi  total  |   45Mi used
```
> RAM al 52.5%. Saludable para el hardware de 1 GB.

### [11] Servicios Críticos — Notas Importantes
```text
nginx     → active   ✅
fail2ban  → active   ✅
ufw       → inactive ⚠️  (ver nota)
ssh       → active   ✅
pm2-admin → active   ✅  (tras fix con reset-failed + pm2 kill + systemctl start)
```

> [!NOTE]
> **UFW `inactive` en systemctl es un comportamiento normal en Debian 13 (Trixie).**
> UFW usa iptables como backend. El servicio systemd `ufw` tiene `Type=oneshot`: carga
> las reglas en iptables durante el arranque y luego **termina intencionalmente**. Por eso
> `systemctl is-active ufw` devuelve `inactive`, aunque las reglas estén completamente activas.
> Confirmado mediante: `sudo iptables -L INPUT -n` → `Chain INPUT (policy DROP)` = máxima protección.

### [12] Conexiones Externas Activas
```text
172.26.6.236:443  →  172.70.224.162:11573   ← Cloudflare (172.70.x.x) ✅
172.26.6.236:443  →  104.23.213.76:13528    ← Cloudflare (104.23.x.x) ✅
172.26.6.236:443  →  172.70.224.156:9884    ← Cloudflare (172.70.x.x) ✅
172.26.6.236:443  →  104.23.211.27:10830    ← Cloudflare (104.23.x.x) ✅
172.26.6.236:443  →  104.22.93.124:11803    ← Cloudflare (104.22.x.x) ✅
172.26.6.236:22   →  201.46.114.49:13593    ← SSH del desarrollador ✅
```
> Todas las conexiones al puerto 443 provienen exclusivamente de IPs de Cloudflare.
> No hay ninguna conexión directa a la IP del servidor desde fuera de Cloudflare.

---

## 5. Estado Final Consolidado

| Vector de ataque | Antes | Después |
|---|---|---|
| Firewall perimetral | ❌ Inexistente | ✅ UFW: policy DROP, solo 22/80/443 |
| Puerto 3000 NestJS desde internet | ❌ `*:3000` público | ✅ UFW bloqueado + `127.0.0.1` via CI/CD |
| Puerto 3001 Next.js desde internet | ❌ `0.0.0.0:3001` público | ✅ UFW bloqueado + `127.0.0.1` inmediato |
| Fuerza bruta SSH | ❌ Sin protección (cientos de intentos/min) | ✅ fail2ban: ban 1h tras 5 intentos |
| IP atacante 222.91.124.34 | ❌ Activa y sin ban | ✅ Baneada en fail2ban |
| IP atacante 102.219.227.90 | ❌ Activa y sin ban | ✅ Baneada en fail2ban |
| PermitRootLogin | ⚠️ `without-password` (valor compilado) | ✅ `no` (directiva explícita) |
| Contenedores Docker zombies | ❌ 5 containers / ~150 MB RAM | ✅ Eliminados |
| mTLS Cloudflare en Nginx | ✅ Ya activo | ✅ Verificado (scanner Palo Alto bloqueado con 444) |
| Node.js bind en 0.0.0.0 | ❌ Por defecto (sin HOST/HOSTNAME) | ✅ 127.0.0.1 vía pm2.config.js + main.ts |
| PM2 startup automático ante reinicios VPS | ❌ No configurado | ✅ pm2-admin.service habilitado y activo |
| PM2 reinicios (inestabilidad) | ⚠️ ↑ 30-34 reinicios acumulados | ✅ ↑ 0 (estado limpio tras restart bajo systemd) |
| Permisos de `backend/.env` | ❌ `664` (world-readable) | ✅ `600` (solo propietario) |
| Hardening del kernel (sysctl) | ❌ Sin configurar (valores por defecto) | ✅ 8 parámetros aplicados en `/etc/sysctl.d/99-hardening.conf` |
| Escáner externo (Palo Alto Networks) | — | ✅ Bloqueado con HTTP 444 por mTLS |



---

## 5. Pendientes y Monitoreo Continuo

### 5.1 ✅ Verificación post-deploy CI/CD — COMPLETADA DURANTE LA AUDITORÍA

El CI/CD corrió automáticamente durante la sesión. Confirmado por:
- IP `20.168.109.82` (rango Azure = GitHub Actions) aceptada vía SSH con la misma clave del deploy.
- `ss -tlnp` post-deploy muestra `127.0.0.1:3000` ← `main.ts` compilado con `app.listen(port, host)`.

```text
LISTEN  127.0.0.1:3000  users:(("node /home/admi",pid=320236,fd=32))  ✅
LISTEN  127.0.0.1:3001  users:(("next-server (v1",pid=320237,fd=23))  ✅
```

### 5.2 Monitoreo periódico recomendado
```bash
# Estado de fail2ban y IPs baneadas
sudo fail2ban-client status sshd

# Contenedores Docker activos (no debe haber > 6 minutos)
docker ps -a

# Intentos de ataque SSH recientes
sudo journalctl -u ssh --since "24 hours ago" | grep "Failed\|Invalid" | wc -l

# RAM del servidor
free -h
```

### 5.3 Acción de mediano plazo — Rotar IP pública
En AWS Lightsail > Networking:
1. Desasociar Static IP `44.192.40.200`.
2. Crear y asignar nueva Static IP.
3. Actualizar registro `A` en Cloudflare DNS.
4. Actualizar secreto `REMOTE_HOST` en GitHub Actions.

---

## 6. Lecciones Aprendidas

1. **Nunca incluir IPs de producción, IDs de host internos ni identificadores de infraestructura en documentación commiteada.** Usar `<IP_VPS>` o `<HOST_ID>` como placeholders.

2. **`check-secrets.js` no cubre IPs de servidor** — solo detecta tokens/credenciales de autenticación. Brecha de cobertura identificada.

3. **Node.js por defecto hace bind en `0.0.0.0`.** Siempre especificar `HOST`/`HOSTNAME` explícitamente en `pm2.config.js` y en `app.listen()`.

4. **Un VPS sin firewall expone cualquier puerto que un proceso abra**, independientemente del proxy inverso. UFW es obligatorio desde el día 1.

5. **Los reinicios abruptos de PM2 evitan que `OnModuleDestroy` limpie los contenedores Docker.** Implementar una tarea de limpieza de contenedores periódica en el servidor como salvaguarda adicional.

---

*Auditoría ejecutada: 8 de septiembre de 2026*
*Documentado: 9 de septiembre de 2026*
*Autor: Jorge Doicela*
