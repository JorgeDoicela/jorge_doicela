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

### 2. Instalación de Node.js, npm y pnpm
Dado que Debian 13 (Trixie) incluye Node.js v20 de forma nativa en sus repositorios oficiales, se puede instalar directamente junto al gestor de paquetes `npm`:
1. **Instalar Node.js y npm**:
   ```bash
   sudo apt install -y nodejs npm
   ```
2. **Instalar pnpm**:
   Se debe instalar globalmente para la gestión de dependencias del monorepo:
   ```bash
   sudo npm install -g pnpm
   ```

### 3. Persistencia de Procesos con systemd (PM2)
Debian utiliza **systemd** para gestionar el arranque y apagado de servicios de fondo. Para asegurar que PM2 y las aplicaciones (backend y frontend) se inicien automáticamente ante cualquier reinicio programado o caída inesperada del VPS:
1. **Generar el Script de Inicio**:
   Ejecutar el comando de configuración de inicio automático:
   ```bash
   pm2 startup systemd
   ```
   *(Este comando imprimirá en pantalla una directiva `sudo env PATH=...`. Se debe copiar y ejecutar dicha línea exacta en la terminal para registrar el servicio en systemd).*
2. **Guardar el Estado del Servidor**:
   Una vez levantados los procesos del monorepo (`backend-nest` y `frontend-next`) mediante PM2, se debe guardar la lista de tareas en ejecución:
   ```bash
   pm2 save
   ```
   Esto congela la lista de procesos activos y garantiza su restauración automática por parte de systemd en el arranque de la máquina.


