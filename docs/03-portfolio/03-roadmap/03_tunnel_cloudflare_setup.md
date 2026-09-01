# Guía Maestra: Servidor Casero en Debian 13 + Cloudflare Tunnel (Live Sandbox)

Esta guía documenta la instalación, configuración de seguridad y puesta en marcha del **Live Linux Sandbox** en tu **Servidor Físico Casero (Debian 13 Trixie)**, conectado de forma 100% segura mediante **Cloudflare Tunnel (Zero Port Forwarding)**.

---

## 1. Diagrama de Topología y Flujo de Red

```text
[ Visitante Web ] ──► [ Cloudflare Edge (WSS) ]
                               │
                (Túnel Saliente Cifrado)
                               │
                               ▼
            ┌──────────────────────────────────────────────┐
            │   PC CASERA (Debian 13 Headless / Sin GUI)   │
            ├──────────────────────────────────────────────┤
            │ 1. cloudflared.service (Daemon systemd)      │
            │    Recibe WebSocket en sandbox.jorgedoicela  │
            │    Reenvía a http://localhost:3000           │
            │                                              │
            │ 2. PM2 Daemon (portfolio-sandbox-home)       │
            │    Proceso NestJS Sandbox en puerto 3000     │
            │    Variable: SANDBOX_MODE=tunnel             │
            │    Variable: SANDBOX_MAX_SESSIONS=5          │
            │                                              │
            │ 3. Docker Engine (Hardening cgroups)         │
            │    /var/run/docker.sock                      │
            │    Imagen: portfolio-sandbox:latest          │
            └──────────────────────────────────────────────┘
```

---

## 2. Paso 1: Instalación de Docker CE en Debian 13

Ejecuta en tu terminal de Debian 13:

```bash
# 1. Actualizar repositorios e instalar paquetes base
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release

# 2. Agregar llave GPG oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Registrar repositorio oficial de Docker para Debian 13
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Instalar motor Docker y containerd
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin

# 5. Añadir tu usuario al grupo docker (para operar sin sudo)
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
```

---

## 3. Paso 2: Permisos Permanentes para el Socket de Docker (`udev`)

Crea una regla `udev` para garantizar que `/var/run/docker.sock` mantenga permisos `0660` incluso tras reiniciar el equipo:

```bash
echo 'SUBSYSTEM=="unix", GROUP="docker", MODE="0660"' | \
  sudo tee /etc/udev/rules.d/50-docker.rules

sudo udevadm control --reload-rules
sudo udevadm trigger
```

---

## 4. Paso 3: Instalación de Node.js, pnpm y PM2

```bash
# 1. Instalar Node.js 22 LTS vía NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs build-essential

# 2. Instalar pnpm y PM2 globalmente
sudo npm install -g pnpm pm2

# 3. Configurar PM2 para iniciar automáticamente al encender la PC
pm2 startup systemd
# (Ejecuta la línea sudo env PATH=... que PM2 te muestre en pantalla)
```

---

## 5. Paso 4: Clonar el Proyecto y Construir Artefactos

```bash
# 1. Clonar el repositorio en tu home
cd ~
git clone https://github.com/TU_USUARIO/jorge_doicela.git
cd jorge_doicela

# 2. Instalar dependencias del backend
pnpm --filter backend install

# 3. Compilar el backend NestJS
pnpm --filter backend build

# 4. Construir la imagen del sandbox Alpine 3.20
docker build -t portfolio-sandbox:latest backend/src/portfolio/docker/
```

---

## 6. Paso 5: Configuración de Cloudflare Tunnel (`cloudflared`)

### 5.1 Instalar el binario oficial de Cloudflare en Debian 13
```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
rm cloudflared.deb
```

### 5.2 Autenticar el túnel con tu cuenta de Cloudflare
```bash
cloudflared tunnel login
# Te dará un enlace URL para abrir en tu navegador y autorizar el dominio jorgedoicela.com
```

### 5.3 Crear el túnel dedicado
```bash
cloudflared tunnel create sandbox-home
# Esto generará un archivo de credenciales en /home/$USER/.cloudflared/<TUNNEL_ID>.json
```

### 5.4 Configurar el archivo de enrutamiento
Crea el archivo `/etc/cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /etc/cloudflared/<TUNNEL_ID>.json

ingress:
  # Enrutar el subdominio del sandbox al backend NestJS local
  - hostname: sandbox.jorgedoicela.com
    service: http://localhost:3000
  # Regla de captura general 404
  - service: http_status:404
```

> Copia el archivo `.json` de credenciales a `/etc/cloudflared/` con permisos de root:
> ```bash
> sudo mkdir -p /etc/cloudflared
> sudo cp ~/.cloudflared/<TUNNEL_ID>.json /etc/cloudflared/
> ```

### 5.5 Asociar el DNS en Cloudflare
```bash
cloudflared tunnel route dns sandbox-home sandbox.jorgedoicela.com
```

### 5.6 Instalar `cloudflared` como servicio systemd permanente
```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
sudo systemctl status cloudflared
```

---

## 7. Paso 6: Iniciar el Sandbox con PM2 en tu PC Casera

Desde la carpeta del proyecto en tu PC casera:

```bash
# Iniciar con el archivo de configuración dedicado para casa
pm2 start pm2.home.config.js

# Guardar estado para que se inicie solo si se reinicia la máquina
pm2 save
```

Para revisar los logs en tiempo real:
```bash
pm2 logs portfolio-sandbox-home
```

---

## 8. Verificación y Prueba de Funcionamiento

1. Abre tu navegador web en `https://portfolio.jorgedoicela.com`.
2. En la terminal, conmuta a `[ Live Linux Sandbox ]`.
3. Presiona **Lanzar Terminal Linux Real**.
4. Observa el badge superior: mostrará **`Servidor Casero (Debian 13) • Docker • No-Net`**.
5. Escribe `neofetch` y verás el modelo real de tu procesador físico y la memoria de tu equipo casero.
6. Al cerrar la pestaña, ejecuta `docker ps` en tu Debian 13 para verificar que el contenedor se destruyó en `< 1 segundo`.
