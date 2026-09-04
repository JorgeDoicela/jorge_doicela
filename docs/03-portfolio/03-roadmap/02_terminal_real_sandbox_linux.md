# Terminal Linux Real en Vivo (Sandbox) — Arquitectura, Seguridad y Despliegue

Este documento define la arquitectura técnica completa, las capas de seguridad inviolables (*hardening*) y los manuales de despliegue paso a paso para implementar la **Terminal Linux Real en Vivo (Sandbox)** en el Portafolio Profesional (`portfolio.jorgedoicela.com`), tanto en el **VPS de AWS Lightsail** como en un **Servidor Dedicado Doméstico (PC en Casa)** conectado mediante Cloudflare Tunnel.

---

## 1. Visión General y Propósito

El objetivo es ofrecer a los visitantes, reclutadores e ingenieros una experiencia interactiva única: la posibilidad de interactuar con un **entorno Linux real (shell bash)** directamente desde el navegador web mediante `xterm.js`, demostrando maestría en virtualización ligera (Docker/cgroups), WebSockets de baja latencia y seguridad perimetral de sistemas.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               EXPERIENCIA EN EL PORTAFOLIO                             │
│                                                                                        │
│   [ Terminal Guiada (Simulada) ]             [ Live Linux Sandbox (Real) ]             │
│   - Ultrarrápida (0 ms latencia)             - Shell real Alpine/Debian                │
│   - Biografía, skills y proyectos            - Comandos reales: htop, nano, curl, etc. │
│   - Ideal para lectura rápida                - 100% aislado en contenedor efímero      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Comparativa de Entornos de Ejecución

| Dimensión | Opción 1: VPS AWS Lightsail (Docker) | Opción 2: Servidor en Casa (Cloudflare Tunnel) |
|---|---|---|
| **Disponibilidad** | 99.9% 24/7 en la nube | Sujeto a energía eléctrica y red doméstica |
| **Latencia** | < 30 ms (mismo servidor que el backend) | Variable según conexión residencial |
| **Consumo de RAM** | ~30-40 MB (para 3 sesiones simultáneas) | 0 MB de consumo en el VPS de Lightsail |
| **Herramientas Disponibles** | Alpine ligero (bash, htop, nano, curl, jq, neofetch) | Stack completo (GCC, Python, Node, Rust, Docker) |
| **Complejidad de Red** | Todo interno en `127.0.0.1` | Requiere túnel `cloudflared` |
| **Recomendación** | **Fase 1 (Producción Oficial)** | **Fase 2 (Playground Extendido de Alto Consumo)** |

---

## 3. Arquitectura de Seguridad Inviolable (Hardening para el Público)

Para exponer una terminal interactiva real a internet sin riesgo de intrusión, sobrecarga o fuga de datos, se implementan **5 capas de contención estricta**:

```text
[ Visitante Web ] ──(WSS)──► [ Nginx ] ──► [ NestJS Gateway ] ──(Docker Socket)──► [ Contenedor Efímero ]
                                                   │                                      │
                                           - Rate Limit (IP)                      - cgroups (64MB RAM)
                                           - Max 3 sesiones                       - CPU quota: 0.25
                                           - Timeout: 5 min                       - pids-limit: 50
                                                                                  - FS: read-only + tmpfs
                                                                                  - Net: isolated (no-host)
                                                                                  - User: guest (UID 1000)
```

### Capa 1: Aislamiento de Recursos del Sistema (cgroups)
* **Memoria Estricta:** `--memory=64m --memory-swap=64m`. Si un proceso intenta consumir más de 64 MB, el *OOM Killer* del kernel de Linux lo finaliza al instante sin afectar al host.
* **Cuota de CPU:** `--cpus=0.25` (limita el uso a un máximo del 25% de 1 núcleo).
* **Límite de Procesos (Inmunidad contra Fork-Bombs):** `--pids-limit=50`. Ataques como `:(){ :|:& };:` fallan de inmediato al superar los 50 procesos concurrentes.

### Capa 2: Sistema de Archivos Inmutable y Volátil
* **Raíz de Solo Lectura:** `--read-only`. El visitante no puede modificar archivos del sistema (`/bin`, `/etc`, `/usr`).
* **Directorio de Trabajo Volátil en RAM (sin ejecución de binarios):**
  * `--tmpfs /home/guest:size=10M,uid=1000,gid=1000,mode=700,noexec,nosuid` — El usuario puede crear archivos de texto y scripts con permisos de propietario correctos, **pero no compilar ni ejecutar binarios en memoria** (el flag `noexec` es crítico: impide ataques de ejecución de código arbitrario desde el espacio temporal).
  * `--tmpfs /tmp:size=5M,mode=1777,noexec,nosuid` — Directorio temporal del sistema también en modo no-ejecutable.
* Al desconectarse, el contenedor se destruye automáticamente con `docker rm -f` y el estado desaparece sin dejar residuos en disco.

### Capa 3: Privilegios Mínimos (Zero Root + No-New-Privileges)
* **Usuario no privilegiado:** `guest` (UID `1000`, GID `1000`).
* **Binario `sudo` ausente:** No existe `sudo` ni elevación de privilegios en la imagen.
* **Caída total de Capabilities:** `--cap-drop=ALL`. Se eliminan todas las capacidades del kernel (`CAP_NET_RAW`, `CAP_SYS_ADMIN`, etc.), impidiendo escapes de contenedor o manipulación de interfaces de red.
* **Bloqueo de Escalada vía `setuid`:** `--security-opt no-new-privileges:true`. Garantiza que ningún proceso hijo pueda adquirir más privilegios que el proceso padre, neutralizando binarios `setuid` residuales en la imagen.

### Capa 4: Aislamiento de Red Perimetral (Absoluto)
* **Modo Red Completamente Desconectada:** `--network=none` (sin ambigüedad, sin subred alternativa). El contenedor no tiene ninguna interfaz de red disponible excepto `lo` (loopback local interno al contenedor mismo).
* El contenedor no puede alcanzar las APIs internas de NestJS (puerto `3000`), ni Next.js (puerto `3001`), ni las bases de datos `backend/data/*.sqlite`, ni Internet exterior, ni la red LAN del VPS.

### Capa 5: Control de Concurrencia y Temporizador de Sesión
* **Límite de Concurrencia:** Máximo 3 contenedores activos simultáneamente en todo el sistema (valor configurable por variable de entorno `SANDBOX_MAX_SESSIONS`).
* **Tiempo de Vida de Sesión (TTL):** 5 minutos continuos de inactividad. Al llegar al minuto 4:30 se emite una advertencia visual en la terminal y al minuto 5:00 la sesión se destruye liberando la memoria.

---

## 4. Componentes Técnicos

### 4.1 Imagen Docker Base del Sandbox (`backend/src/portfolio/docker/Dockerfile`)

```dockerfile
FROM alpine:3.20

# Instalación de utilidades esenciales para una experiencia interactiva completa (< 50 MB total)
RUN apk add --no-cache \
    bash \
    coreutils \
    procps \
    htop \
    nano \
    curl \
    jq \
    git \
    tree \
    file \
    neofetch \
    ncurses \
    util-linux

# Limpiar posible usuario 'guest' residual de Alpine y recrear con UID/GID 1000 explícito
RUN deluser guest 2>/dev/null || true && \
    delgroup guest 2>/dev/null || true && \
    addgroup -g 1000 guest && \
    adduser -u 1000 -G guest -s /bin/bash -D -h /home/guest guest && \
    mkdir -p /home/guest && \
    chown -R guest:guest /home/guest && \
    chmod 700 /home/guest

# Variables de entorno globales del shell
ENV HOME=/home/guest \
    TERM=xterm-256color \
    SHELL=/bin/bash \
    USER=guest \
    PAGER=cat \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Configuración global del shell en /etc/profile.d/ y /etc/bash.bashrc
# Inmunidad ante montaje de tmpfs volátil sobre /home/guest en tiempo de ejecución
COPY sandbox_profile.sh /etc/profile.d/sandbox.sh
COPY sandbox_profile.sh /etc/bash.bashrc
COPY welcome.txt /etc/motd

# Permisos de lectura pública para la configuración global del sistema
RUN chmod 644 /etc/profile.d/sandbox.sh /etc/bash.bashrc /etc/motd

WORKDIR /home/guest
USER guest

# Modo login shell: lee /etc/profile y ejecuta scripts en /etc/profile.d/
CMD ["/bin/bash", "--login"]
```

### 4.2 Backend NestJS: Gateway de WebSockets (`SandboxGateway`)

* **Ubicación:** `backend/src/portfolio/gateways/sandbox.gateway.ts`
* **Tecnología:** `@nestjs/websockets` + `dockerode` (cliente JS puro para Docker Engine API sobre `/var/run/docker.sock`).
* **Compatibilidad CI/CD:** Al usar `dockerode` (JavaScript puro) en lugar de `node-pty`, no se requieren compilaciones nativas C++ en el servidor, garantizando compatibilidad absoluta con la bandera `--ignore-scripts` del pipeline de despliegue.
* **Flujo de Ejecución:**
  1. Cliente emite evento `start-session` al conectar vía WebSocket.
  2. `SandboxService` valida la cuota de sesiones activas (< 3).
  3. Ejecuta el contenedor con **todos los flags de hardening** mediante `dockerode`:
     ```bash
     # Equivalente en CLI para referencia de documentación:
     docker run -d --rm -i \
       --name sandbox_<sessionId> \
       --memory=64m --memory-swap=64m \
       --cpus=0.25 \
       --pids-limit=50 \
       --read-only \
       --tmpfs /home/guest:size=10M,uid=1000,gid=1000,mode=700,noexec,nosuid \
       --tmpfs /tmp:size=5M,mode=1777,noexec,nosuid \
       --cap-drop=ALL \
       --security-opt no-new-privileges:true \
       --network=none \
       portfolio-sandbox:latest
     ```
  4. Conecta el stream interactivo bidireccional mediante `container.attach({ stream: true, stdin: true, stdout: true, stderr: true })` de `dockerode`.
  5. Maneja eventos `terminal-input`, `terminal-output` y `terminal-resize` (sincronizando columnas y filas dinámicamente con `container.resize({ h: rows, w: cols })`).
  6. Al desconectarse o expirar el TTL de 5 minutos, ejecuta `container.kill()` seguido de `container.remove()` para garantizar limpieza total aunque el flag `--rm` ya lo gestione.

---

## 5. Integración con el Pipeline CI/CD (`.github/workflows/deploy.yml`)

El pipeline de GitHub Actions desplegará y mantendrá actualizada la imagen del Sandbox de forma 100% automatizada sin intervención manual. Los comandos siguientes se añaden al step SSH `Ejecutar tareas de inicio y reiniciar PM2 por SSH`:

```bash
# ── SANDBOX ── Construir imagen Docker del sandbox (aprovecha el cache de capas: ~1s si no hay cambios)
if [ -d "backend/src/portfolio/docker" ]; then
  docker build -t portfolio-sandbox:latest backend/src/portfolio/docker/
  echo "Imagen portfolio-sandbox:latest actualizada correctamente."
fi

# ── DOCKER SOCKET ── Asegurar que el usuario 'admin' (proceso PM2) pertenece al grupo docker
# Este comando es idempotente: no falla si el usuario ya pertenece al grupo
id -nG admin | grep -q docker || sudo usermod -aG docker admin

# ── PERMISOS ── Garantizar acceso de lectura/escritura al socket para el proceso NestJS
sudo chmod 660 /var/run/docker.sock
```

> [!IMPORTANT]
> El permiso `660` en `/var/run/docker.sock` se resetea en cada reinicio del sistema. Para que sea permanente se debe configurar una regla `udev` en el VPS (paso único de configuración inicial, documentado en la Guía de Despliegue).

---

## 6. Guía de Despliegue en AWS Lightsail (Debian 13)

### Paso 1: Instalar Docker CE en el VPS
```bash
# 1. Instalar repositorios oficiales de Docker
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 2. Instalar motor Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 3. Agregar usuario admin al grupo docker para operar sin sudo
sudo usermod -aG docker admin
sudo systemctl enable --now docker
```

### Paso 2: Configurar Regla `udev` para Permisos Permanentes del Docker Socket
Esto asegura que el grupo `docker` siempre tenga acceso al socket incluso tras un reinicio del VPS:
```bash
# Crear regla udev permanente para el socket de Docker
echo 'SUBSYSTEM=="unix", GROUP="docker", MODE="0660"' | \
  sudo tee /etc/udev/rules.d/50-docker.rules
sudo udevadm control --reload-rules
```

### Paso 3: Configurar Nginx para el WebSocket del Sandbox
En `nginx/jorgedoicela.com.conf`, agregar dentro del bloque `server` HTTPS (junto al location `/socket.io/` existente):
```nginx
# WebSockets de la Terminal Sandbox (namespace /sandbox — no colisiona con /terminal de la terminal guiada)
# IMPORTANTE: Este location debe ir ANTES del location /socket.io/ genérico
location /socket.io/sandbox/ {
    limit_req zone=api_limit_zone burst=5 nodelay;  # Rate limit estricto: solo 5 conexiones simultáneas por IP
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;  # IP real de Cloudflare (para trazabilidad de logs)
    proxy_read_timeout 310s;  # Ligeramente mayor que el TTL de 5 minutos (300s) para evitar cortes prematuros
    proxy_send_timeout 310s;
}
```

---

## 7. Guía de Despliegue en Servidor Casero (PC en Casa + Cloudflare Tunnel)

> [!TIP]
> Consulta la **Guía Maestra Paso a Paso para Debian 13**: [`03_tunnel_cloudflare_setup.md`](./03_tunnel_cloudflare_setup.md) con los comandos exactos de `apt`, reglas `udev`, `cloudflared` como servicio systemd y arranque con `pm2.home.config.js`.

Si prefieres delegar la ejecución a una máquina dedicada en tu hogar con mayores recursos (GCC, Python, Node.js completos):

```text
[ Visitante Web ] ──► [ Cloudflare Edge ] ──(Túnel Seguro Saliente)──► [ cloudflared en PC Casa ]
                                                                               │
                                                                   [ Docker Daemon / Sandbox ]
```

### Paso 1: Preparar la PC en Casa
Instala Debian 13 o Ubuntu Server y Docker en tu máquina local.

### Paso 2: Instalar y Autenticar `cloudflared`
```bash
# Descargar binario de Cloudflare Tunnel
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Iniciar sesión en Cloudflare (abre navegador para asociar tu dominio jorgedoicela.com)
cloudflared tunnel login

# Crear el túnel dedicado para el sandbox
cloudflared tunnel create sandbox-jorgedoicela
```

### Paso 3: Configurar el Enrutamiento del Túnel
Crear `/etc/cloudflared/config.yml`:
```yaml
tunnel: <TUNNEL_ID>
credentials-file: /etc/cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: tunnel.jorgedoicela.com
    service: http://localhost:3000
  - service: http_status:404
```

### Paso 4: Iniciar el Servicio del Túnel
```bash
# Asociar subdominio en Cloudflare DNS
cloudflared tunnel route dns sandbox-home tunnel.jorgedoicela.com

# Instalar y arrancar como servicio del sistema
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```
* **Ventaja:** No necesitas abrir ningún puerto en el router de tu casa (NAT traversal automático de Cloudflare). La IP pública de tu hogar permanece 100% oculta.

### Paso 5: Manejo de Estado Apagado y Solicitud de Encendido vía Telegram
Cuando la máquina doméstica esté suspendida o apagada:
* El frontend detecta la falta de enlace con el túnel (`connect_error` en modo `tunnel`).
* **Cero Fallback Engañoso:** En lugar de redirigir silenciosamente a AWS, el sistema presenta la tarjeta Dark Luxury `ServerOfflineBanner.tsx` comunicando el estado de ahorro de energía.
* **Flujo Asíncrono de Telegram:** El visitante pulsa "Solicitar Encendido a Jorge", lo que envía un `POST /portfolio/sandbox/wake-request` a NestJS, emite `SandboxWakeRequestedEvent` y notifica instantáneamente al canal de Telegram de Jorge para que encienda el equipo físico y habilite el túnel.

---

## 8. Matriz de Pruebas de Estrés y Validación de Seguridad

Antes de habilitar el sandbox al público, se ejecutan las siguientes pruebas de penetración controladas:

| Prueba de Penetración | Comando Ejecutado | Resultado Esperado |
|---|---|---|
| **Fork-Bomb** | `:(){ :|:& };:` | [PASS] El shell rechaza crear más procesos al llegar a 50 (`Resource temporarily unavailable`). El servidor host no sufre ningún impacto de CPU. |
| **Agotamiento de Memoria** | `dd if=/dev/zero of=/tmp/fill bs=1M count=100` o `tail /dev/zero` | [PASS] El contenedor es finalizado por el *OOM Killer* al superar 64 MB de RAM sin tocar la memoria del host. Nota: `dd` está disponible vía `coreutils` instalado en la imagen. |
| **Escritura en Sistema** | `touch /bin/exploit` o `rm -rf /etc` | [PASS] Error inmediato: `Read-only file system`. |
| **Escaneo de Red Local** | `curl http://127.0.0.1:3000` | [PASS] Falla inmediata: red inaccesible (`Network is unreachable` o sin ruta). |
| **Abandono de Sesión** | Visitante cierra la pestaña | [PASS] El evento `disconnect` de Socket.io destruye el contenedor en `< 1 segundo`. |
| **Sesión Colgada** | Visitante deja la terminal abierta sin escribir | [PASS] Al cumplirse 5 minutos, el temporizador del backend envía `SIGTERM` y destruye el contenedor. |

---

## 9. Sincronización y Mantenimiento de la Documentación

* **Obligación de Registro:** Cualquier cambio en los límites de memoria, paquetes base del contenedor o configuración de red debe reflejarse en este archivo y en `docs/03-portfolio/01-frontend/01_frontend_y_terminal_ssh.md`.
