# Guia Maestra: Servidor Casero en Debian 13 + Cloudflare Tunnel (Live Sandbox)

Esta guia documenta la instalacion, configuracion de seguridad, arquitectura y puesta en marcha del **Live Linux Sandbox** en tu **Servidor Fisico Casero (Debian 13 Trixie)**, conectado de forma 100% segura mediante **Cloudflare Tunnel (Zero Port Forwarding)**.

---

## 1. Diagrama de Topologia y Flujo de Red

```text
[ Visitante Web en el Navegador ]
(Carga interfaz en https://portfolio.jorgedoicela.com/sandbox?mode=tunnel)
                    │
                    ▼ (Conexion WebSocket segura WSS sin pasar por AWS)
        [ Cloudflare Edge (tunnel.jorgedoicela.com) ]
                    │
                    ▼ (Tunel Cifrado Saliente QUIC / Token)
┌──────────────────────────────────────────────────────────────┐
│   SERVIDOR CASERO (Debian 13 / Hardware Fisico Dedicado)     │
├──────────────────────────────────────────────────────────────┤
│ 1. cloudflared.service (Daemon de Cloudflare en systemd)     │
│    - Recibe trafico de tunnel.jorgedoicela.com               │
│    - Reenvia por loopback a http://localhost:3000            │
│                                                              │
│ 2. PM2 Daemon (portfolio-sandbox-home)                       │
│    - Proceso NestJS iniciado con pm2.home.config.js          │
│    - Variables: SANDBOX_MODE=tunnel, SANDBOX_MAX_SESSIONS=5  │
│                                                              │
│ 3. Docker Engine (Aislamiento de Kernel y cgroups)           │
│    - Imagen: portfolio-sandbox:latest (Alpine 3.20)          │
│    - Cuota asignada: 256 MB RAM, 1.0 CPU, 100 PIDs           │
│    - Red: NetworkMode 'none' (100% desconectado de la LAN)   │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Paso 1: Verificacion de Docker en Debian 13

El sistema requiere el motor Docker y que el usuario pertenezca al grupo `docker`:

```bash
# 1. Comprobar version instalada
docker --version

# 2. Comprobar que el servicio este activo
sudo systemctl is-active docker

# 3. Comprobar permisos sin sudo
docker ps
```

Si el usuario no pertenece al grupo `docker`:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## 3. Paso 2: Instalacion y Servicio de Cloudflare Tunnel (`cloudflared`)

### 3.1 Instalacion del paquete oficial en Debian 13
```bash
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-public-v2.gpg | sudo tee /usr/share/keyrings/cloudflare-public-v2.gpg >/dev/null
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-public-v2.gpg] https://pkg.cloudflare.com/cloudflared any main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install -y cloudflared
```

### 3.2 Instalacion del servicio permanente con Token
Ejecuta el comando provisto por el panel de Cloudflare Zero Trust:
```bash
sudo cloudflared service install <TU_TOKEN_DE_CLOUDFLARE>
```

Verificar estado activo:
```bash
sudo systemctl status cloudflared
```

---

## 4. Paso 3: Instalacion de PM2

### Opcion A: Si usas Nix con Flakes y Home-Manager (Recomendada)
En tu archivo `home.nix`:
```nix
home.packages = with pkgs; [
  pm2
];
```
Y aplicar cambios:
```bash
home-manager switch --flake .
```

### Opcion B: Si usas npm tradicional
```bash
npm install -g pm2
```

Verificar instalacion:
```bash
pm2 --version
```

---

## 5. Paso 4: Clonar el Repositorio y Construir Artefactos

```bash
# 1. Clonar o actualizar el repositorio en el home
cd ~
git clone https://github.com/JorgeDoicela/jorge_doicela.git
cd jorge_doicela

# 2. Construir la imagen Docker local del sandbox
docker build -t portfolio-sandbox:latest backend/src/portfolio/docker/

# 3. Instalar dependencias del backend y compilar
pnpm --filter backend install
pnpm --filter backend build
```

---

## 6. Paso 5: Puesta en Marcha con PM2

Iniciar la aplicacion utilizando el archivo de configuracion dedicado para servidor casero:

```bash
# 1. Arrancar el proceso de backend en modo tunel
pm2 start pm2.home.config.js

# 2. Guardar el estado para auto-arranque en reinicios del sistema
pm2 save
```

Revisar logs en tiempo real:
```bash
pm2 logs portfolio-sandbox-home
```

---

## 7. Paso 6: Verificacion Empirica del Sistema

1. Abre tu navegador web en `https://portfolio.jorgedoicela.com`.
2. En la consola, haz clic en **Terminal en Servidor Propio**.
3. Presiona el boton de lanzamiento para abrir la ventana emergente.
4. Ejecuta los siguientes comandos de verificacion dentro de la terminal:
   * `free -m`: Comprueba la cuota de **256 MB de RAM**.
   * `benchmark`: Ejecuta una prueba de computo en tiempo real sobre tu procesador.
   * `neofetch`: Muestra la informacion del hardware y sistema.
5. En la terminal de tu Debian 13, ejecuta `docker ps` para ver el contenedor efimero `sandbox_tunnel_...` en ejecucion.
6. Al presionar **Finalizar** o cerrar la ventana, el contenedor se destruye automaticamente en menos de 1 segundo.

---

## 8. Consideraciones de Seguridad, Resiliencia y Servidor Apagado

* **Cero Carga en AWS:** Todo el trafico interactivo del sandbox casero viaja directamente entre Cloudflare y tu PC local, dejando 0 MB de consumo en el VPS de 1 GB de RAM.
* **Tolerancia a Fallos y Estado Offline Elegante:** Si tu maquina casera se apaga:
  - El sitio web principal y los demas modulos en AWS continuan operando con normalidad.
  - La interfaz de la terminal en modo Servidor Propio no realiza fallback a AWS; en su lugar, despliega la tarjeta Dark Luxury `ServerOfflineBanner.tsx` informando que el equipo esta en reposo para ahorro de energia.
  - El usuario puede enviar una solicitud con un clic (`POST /portfolio/sandbox/wake-request`), la cual emite `SandboxWakeRequestedEvent` y te notifica de forma instantanea a Telegram con la IP y datos del solicitante para que procedas a encenderlo.
* **Aislamiento Total de Red:** Los contenedores corren con `NetworkMode: 'none'`, impidiendo cualquier acceso a tu red local domestica o dispositivos Wi-Fi.

