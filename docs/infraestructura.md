# Arquitectura de Despliegue, Infraestructura y Seguridad en la Nube

Este documento detalla la topología de red, la configuración DNS y el esquema de seguridad implementado para el despliegue del proyecto en producción, unificando los subproyectos del frontend y backend en un servidor de recursos optimizados.

---

## 1. Topología de Red y Flujo de Tráfico

Para asegurar que las aplicaciones funcionen de manera rápida y segura bajo un entorno de bajos recursos (**VPS de 1 GB de RAM** en **AWS Lightsail**), se ha diseñado el siguiente flujo de red perimetral:

```text
[ Usuario ] 
     │
     ▼ (Petición HTTPS segura)
[ Cloudflare Edge ] 
     │ (Proxy DNS activado - Oculta la IP real del servidor)
     ▼ (Tráfico cifrado a través de túnel SSL/TLS Estricto)
[ Cortafuegos de AWS Lightsail ] (Filtra y permite solo puertos HTTP 80 / HTTPS 443)
     │
     ▼ (Nginx / Servidor de Origen con Certificado SSL de Cloudflare)
[ Next.js Frontend (Puerto 3001) / NestJS Backend (Puerto 3000) ]
```

---

## 2. Configuración DNS y Mitigación DDoS (Cloudflare)

Toda la resolución de nombres del dominio principal `jorgedoicela.com` y sus subdominios asociados se delega en los servidores DNS de Cloudflare, activando el **Proxy** (nube naranja) en cada registro para prevenir ataques de denegación de servicio (DDoS) y ocultar la dirección IP pública real del VPS de AWS Lightsail.

### Registros DNS Requeridos:

| Tipo | Nombre | Destino / Dirección IP | Estado del Proxy | Propósito |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` (Raíz) | `<IP_PUBLICA_DEL_SERVIDOR>` | **Con proxy** (Naranja) | Landing Page principal |
| **CNAME** | `portfolio` | `jorgedoicela.com` | **Con proxy** (Naranja) | Subdominio del Portafolio |
| **CNAME** | `bible` | `jorgedoicela.com` | **Con proxy** (Naranja) | Subdominio de la Biblia |
| **CNAME** | `software` | `jorgedoicela.com` | **Con proxy** (Naranja) | Subdominio del Software |

> [!WARNING]
> **Ocultamiento de la IP del Servidor:**
> Ninguno de los registros DNS del proyecto debe configurarse en modo "Solo DNS" (nube gris). Revelar la dirección IP pública real del VPS permitiría a atacantes evadir por completo el Firewall de Aplicaciones Web (WAF) y las protecciones de Cloudflare mediante ataques directos de red.

---

## 3. Esquema de Cifrado y SSL/TLS de Extremo a Extremo

Para garantizar la confidencialidad de la información y la integridad de la sesión, se implementa una política de cifrado estricta en dos capas:

### Capa 1: Cloudflare Edge (Usuario -> Cloudflare)
* **Modo de SSL/TLS**: Configurado en **Full (Strict)** / **Completo (estricto)**. Esto obliga a que el servidor de origen cuente con un certificado digital de confianza emitido por una entidad autorizada.
* **Always Use HTTPS** / **Usar siempre HTTPS**: Activado en la configuración perimetral de Cloudflare para redirigir de manera forzada todo el tráfico HTTP convencional al puerto seguro HTTPS (443).
* **Versión Mínima de TLS**: Configurado en **TLS 1.2** o superior, inhabilitando suites de cifrado antiguas y vulnerables (como SSLv3, TLS 1.0 y TLS 1.1).

### Capa 2: Servidor de Origen (Cloudflare -> AWS Lightsail)
* **Certificado de Origen (Origin Certificate)**: Se emite un certificado SSL gratuito firmado por la entidad de certificación de origen de Cloudflare para los hosts `jorgedoicela.com` y `*.jorgedoicela.com` (con validez de hasta 15 años).
* **Instalación local**: Este certificado de origen (`origin.pem`) y su clave privada asociada (`private.key`) se instalan localmente en el servidor web (Nginx o Apache) del VPS.
* **Seguridad**: Esto asegura que el servidor AWS Lightsail solo responda ante conexiones que provengan legítimamente de los servidores perimetrales de Cloudflare, rechazando conexiones HTTPS directas externas al proxy.

---

## 4. WebSockets y Conexión de Terminal SSH Virtual

Dado que el subproyecto de Portfolio incluye una consola interactiva SSH simulada que utiliza WebSockets sobre Socket.io:
* Se debe verificar que en el apartado **Red** (Network) del panel de Cloudflare la opción **WebSockets** esté **Activada** (Enabled).
* El proxy de Cloudflare admite de manera nativa WebSockets sobre puertos estándar HTTPS (443) y redirige de forma transparente la conexión persistente hacia el backend en el puerto 3000.

---

## 5. Cortafuegos Perimetral (AWS Lightsail Firewall)

A nivel de infraestructura en la nube de AWS Lightsail, se implementa una política de cortafuegos de privilegios mínimos para mitigar vectores de intrusión externa:

### Reglas del Firewall de Lightsail:

| Aplicación / Protocolo | Puerto | Origen Autorizado | Propósito |
| :--- | :--- | :--- | :--- |
| **HTTP** | `80` | Cualquier origen (`0.0.0.0/0`) | Redirección inicial hacia HTTPS |
| **HTTPS** | `443` | Cualquier origen (`0.0.0.0/0`) | Tráfico web cifrado principal |
| **SSH** | `22` | **Restringido por IP** (`<TU_IP_ESTATICA_PERSONAL>`) | Acceso administrativo a consola segura |

> [!IMPORTANT]
> **Acceso SSH Restringido:**
> Para evitar ataques de fuerza bruta al servicio SSH de Linux, el puerto 22 **nunca** debe dejarse abierto a cualquier origen (`0.0.0.0/0`). Se debe configurar una regla de restricción por dirección IP estática en la consola de Lightsail para que únicamente el administrador pueda gestionar el sistema operativo del VPS.

---

## 6. Automatización de Procesos (PM2)

Para controlar la ejecución del backend y frontend de forma robusta en el VPS de 1 GB de RAM, se incluye el archivo de configuración [pm2.config.js](../pm2.config.js) en la raíz del monorepo. Este archivo define la administración individual de memoria y el directorio de trabajo (`cwd`) de cada aplicación para garantizar la correcta resolución de dependencias locales (`node_modules`) en la estructura del monorepo:

* **backend-nest**: Inicia el backend compilado (`./dist/main.js`) situando su directorio de trabajo en `./backend`. Limita el consumo a un máximo de 300 MB de RAM antes de forzar un reinicio preventivo (`max_memory_restart`).
* **frontend-next**: Ejecuta el servidor Next.js en producción (`next start`) situando su directorio de trabajo en `./frontend/web` sobre el puerto 3001. Limita su consumo a un máximo de 450 MB de RAM.

Ambas aplicaciones se ejecutan en modo `fork` optimizado para entornos de núcleo simple, asegurando la recuperación automática del servicio ante errores o caídas del sistema operativo.

---

## 7. Despliegue Continuo (GitHub Actions)

La integración y el despliegue automático del monorepo hacia AWS Lightsail se gestiona mediante el pipeline definido en [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

### Fases del Pipeline:
1. **Validación y Compilación**: Cada confirmación de cambios en la rama `main` dispara la instalación de dependencias mediante `pnpm`, realiza la validación de tipados con TypeScript (`typecheck`) y ejecuta la compilación de producción del monorepo.
2. **Transferencia de Código Segura**: Se transfieren únicamente los archivos fuente limpios hacia el servidor a través de SSH con rsync, previniendo la subida de dependencias temporales de node_modules o bases de datos locales.
3. **Arranque en Producción**: Se ejecutan las tareas de instalación limpia de dependencias de producción en el VPS y se recargan las aplicaciones en caliente usando PM2.

### Secretos requeridos en el repositorio de GitHub:
Para la operación del pipeline, se deben configurar las siguientes credenciales en la pestaña de secretos de GitHub (`Repository Secrets`):
* `SSH_PRIVATE_KEY`: Clave SSH privada asociada para acceder a la instancia del VPS en Lightsail.
* `REMOTE_HOST`: Dirección IP estática pública de la instancia de AWS Lightsail.
* `REMOTE_USER`: Nombre del usuario del sistema operativo para la conexión SSH (ej: `ubuntu`, `bitnami`).
* `TARGET_DIR`: Ruta absoluta en el VPS donde reside la raíz del proyecto.

---

## 8. Configuración de Variables de Entorno (.env)

El proyecto utiliza variables de entorno para modularizar la persistencia y configurar la seguridad en caliente:

* **Backend (`backend/` - plantilla [backend/.env.example](../backend/.env.example))**:
  - `PORT`: Define el puerto del backend (3000 por defecto).
  - `NODE_ENV`: Modo de ejecución (`production`).
  - `DATABASE_PORTFOLIO_PATH` / `DATABASE_BIBLE_PATH` / `DATABASE_SOFTWARE_PATH`: Rutas personalizables en disco para las bases de datos SQLite independientes, facilitando su almacenamiento persistente fuera de la carpeta temporal del código.
  - `CORS_ORIGINS`: Lista delimitada por comas de los subdominios habilitados para interactuar de forma segura con el API.
* **Frontend Web (`frontend/web/` - plantilla [frontend/web/.env.example](../frontend/web/.env.example))**:
  - `PORT`: Define el puerto del frontend (3001 por defecto).
  - `NEXT_PUBLIC_API_URL`: URL pública central de acceso a las APIs expuestas por el backend.

---

## 9. Preparación del Sistema Operativo (Debian 13 Trixie)

Dado que la instancia de AWS Lightsail opera bajo **Debian 13**, se requiere realizar la preparación del sistema para garantizar la compatibilidad con binarios nativos y la persistencia de procesos:

### 1. Herramientas de Compilación (Requerido para `better-sqlite3`)
El backend utiliza la base de datos física SQLite a través del driver `better-sqlite3`, el cual compila extensiones C++ nativas al instalar dependencias. Se debe asegurar la disponibilidad de las siguientes herramientas de desarrollo en el sistema:
```bash
sudo apt update
sudo apt install -y build-essential python3 g++ make rsync
```

### 2. Instalación de Node.js v22 y npm
Para garantizar la compatibilidad con las directivas del pipeline de CI/CD, se requiere actualizar Node.js a la versión 22 LTS:
1. **Configurar el Repositorio de NodeSource**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   ```
2. **Instalar Node.js y el gestor de paquetes npm**:
   ```bash
   sudo apt install -y nodejs npm
   ```
3. **Instalar pnpm y pm2 globalmente**:
   ```bash
   sudo npm install -g pnpm pm2
   ```

### 3. Configuración de Memoria de Intercambio (Swap)
Dado que la compilación de recursos y la instalación en monorepos requiere un consumo elevado de memoria que excede la RAM física disponible (1 GB), se debe habilitar un archivo de intercambio (Swap) de 2 GB para servir como RAM virtual en el disco de estado sólido (SSD):
1. **Crear el archivo de intercambio de 2 GB**:
   ```bash
   sudo fallocate -l 2G /swapfile
   ```
2. **Restringir los permisos del archivo por seguridad** (únicamente el superusuario root debe tener acceso de lectura y escritura):
   ```bash
   sudo chmod 600 /swapfile
   ```
3. **Formatear el archivo como espacio de swap**:
   ```bash
   sudo mkswap /swapfile
   ```
4. **Activar la memoria swap en el sistema**:
   ```bash
   sudo swapon /swapfile
   ```
5. **Hacer que el montaje sea persistente** ante reinicios del VPS añadiendo la entrada al archivo `/etc/fstab`:
   ```bash
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```
   *(Esto previene bloqueos del kernel de Linux y cancelaciones imprevistas por falta de memoria RAM durante la ejecución de `pnpm install` o tareas de compilación).*

### 4. Configuración del Servidor Web (Nginx como Proxy Inverso)
Nginx actúa como el punto de entrada HTTPS perimetral seguro en el servidor. Este intercepta el puerto 443, realiza la validación criptográfica de los certificados SSL de Cloudflare y distribuye las peticiones internamente:
1. **Instalar el servidor Nginx**:
   ```bash
   sudo apt install -y nginx
   ```
2. **Crear el archivo del bloque de servidor (Server Block)**:
   ```bash
   sudo nano /etc/nginx/sites-available/jorgedoicela.com
   ```
3. **Plantilla de Configuración Limpia (Optimizado para Debian 13)**:
   ```nginx
   # Servidor HTTP: Redirección forzada hacia HTTPS
   server {
       listen 80;
       listen [::]:80;
       server_name jorgedoicela.com *.jorgedoicela.com;
       return 301 https://$host$request_uri;
   }

   # Servidor HTTPS: Cifrado SSL y Proxy Inverso
   server {
       listen 443 ssl;
       listen [::]:443 ssl;
       http2 on;
       server_name jorgedoicela.com *.jorgedoicela.com;

       # Rutas de los Certificados de Origen de Cloudflare
       ssl_certificate /etc/ssl/certs/origin.pem;
       ssl_certificate_key /etc/ssl/private/private.key;

       # Parámetros recomendados de SSL
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;

       # 1. API Backend REST
       location ~ ^/(bible|software|portfolio)/ {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       # 2. Conexiones WebSocket de la Terminal (Socket.io)
       location /socket.io/ {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       # 3. Next.js Frontend (Landing Page y Subproyectos)
       location / {
           proxy_pass http://127.0.0.1:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```
4. **Habilitar el bloque y reiniciar Nginx**:
   ```bash
   # Enlazar la configuración para activarla
   sudo ln -s /etc/nginx/sites-available/jorgedoicela.com /etc/nginx/sites-enabled/

   # Validar la sintaxis técnica del archivo
   sudo nginx -t

   # Recargar el servicio web para aplicar los cambios
   sudo systemctl restart nginx
   ```

### 5. Persistencia de Procesos con systemd (PM2)
Para garantizar que los servicios de fondo se mantengan activos tras reinicios o mantenimientos:
1. **Generar y registrar el script en systemd**:
   ```bash
   pm2 startup systemd
   ```
   *(Se debe copiar y ejecutar en consola el comando de registro `sudo env PATH=...` impreso en pantalla por PM2).*
2. **Guardar el listado de procesos estables**:
   ```bash
   pm2 save
   ```
   Esto guarda el estado en `/home/admin/.pm2/dump.pm2` para su levantamiento automático por systemd en el booteo.


