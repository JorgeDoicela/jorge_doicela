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

### 3.6 Persistencia de PM2
```bash
pm2 save
# → [PM2] Successfully saved in /home/admin/.pm2/dump.pm2
```

---

## 4. Estado Final del Servidor Post-Auditoría

```text
ss -tlnp (resultado esperado tras CI/CD):
LISTEN  0.0.0.0:22       ← SSH (fail2ban + solo clave pública)
LISTEN  0.0.0.0:80       ← HTTP → Nginx → 301 HTTPS
LISTEN  0.0.0.0:443      ← HTTPS → Nginx → mTLS Cloudflare
LISTEN  127.0.0.1:3000   ← NestJS (solo loopback) ✅
LISTEN  127.0.0.1:3001   ← Next.js (solo loopback) ✅
```

| Vector | Antes | Después |
|---|---|---|
| Firewall | ❌ Inexistente | ✅ UFW (deny all por defecto) |
| Puerto 3000 desde internet | ❌ Accesible | ✅ UFW + 127.0.0.1 (CI/CD) |
| Puerto 3001 desde internet | ❌ Accesible | ✅ UFW + 127.0.0.1 inmediato |
| Fuerza bruta SSH | ❌ Sin protección | ✅ fail2ban (ban 1h tras 5 intentos) |
| IP atacante 222.91.124.34 | ❌ Activa | ✅ Baneada |
| IP atacante 102.219.227.90 | ❌ Activa | ✅ Baneada |
| PermitRootLogin | ⚠️ `without-password` | ✅ `no` |
| Contenedores Docker zombies | ❌ 5 containers / ~150 MB | ✅ Eliminados |
| mTLS Cloudflare en Nginx | ✅ Ya activo | ✅ Verificado |
| PM2 persistido | ✅ | ✅ |

---

## 5. Pendientes y Monitoreo Continuo

### 5.1 Verificar post-deploy CI/CD
```bash
ss -tlnp | grep -E "3000|3001"
# Debe mostrar 127.0.0.1 en ambos
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
