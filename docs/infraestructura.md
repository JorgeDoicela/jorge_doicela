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
