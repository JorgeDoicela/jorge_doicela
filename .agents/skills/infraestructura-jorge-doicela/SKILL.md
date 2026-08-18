---
name: infraestructura-jorge-doicela
description: Activa esta skill para tareas de despliegue, sysadmin en Debian 13, configuración de Nginx, PM2, Cloudflare, cortafuegos AWS Lightsail, SSL/TLS, pipeline de GitHub Actions y resolución de problemas (troubleshooting) en el proyecto jorge_doicela.
---
# Directrices de Infraestructura, Seguridad y Despliegue: Proyecto Jorge Doicela

Esta habilidad define los estándares técnicos de despliegue, configuración de red, seguridad en la nube, optimización de memoria y administración de servidores para el ecosistema **Jorge Doicela**.

---

## 1. Topología de Red y Arquitectura de Servidor

* **Proveedor Cloud:** AWS Lightsail (Instancia con **1 GB de RAM**, 1 vCPU, SSD de 40 GB, OS: **Debian 13 Trixie**).
* **DNS y Edge Perimetral:** Cloudflare con Proxy activado (Nube naranja) en todos los registros (`@`, `portfolio`, `bible`, `software`). **Nunca usar modo Solo DNS (Gris)** para no exponer la IP estática real del VPS.
* **Memoria de Intercambio (Swap Obligatoria):** 2 GB de Swap configurados en `/swapfile` para absorber picos de memoria durante `pnpm install` o tareas del sistema operativo:
  ```bash
  # Verificación rápida en VPS:
  swapon --show
  free -h
  ```

---

## 2. Seguridad Perimetral y SSL/TLS

### Cifrado de Extremo a Extremo (mTLS y Origin Pulls)
* **Cloudflare SSL:** Modo **Full (Strict)** con *Always Use HTTPS* y versión mínima **TLS 1.2**.
* **Certificado de Origen:** Certificado firmado por Cloudflare (`/etc/ssl/certs/origin.pem` y `/etc/ssl/private/private.key`) instalado en Nginx con validez de 15 años.
* **Authenticated Origin Pulls (mTLS):** Habilitado en Nginx mediante `ssl_client_certificate /etc/ssl/certs/cloudflare.crt;` y `ssl_verify_client on;`. Cualquier petición directa a la IP pública del VPS que no provenga de Cloudflare es rechazada inmediatamente con código HTTP `444` (`error_page 496 =444`).

### Cortafuegos y Blindaje SSH
* **Firewall Lightsail:** Solo puertos `443` (HTTPS) y `22` (SSH) abiertos. El puerto 80 permanece cerrado ya que Cloudflare fuerza la redirección HTTPS en el Edge.
* **SSH Blindado (Cero Contraseñas):** Autenticación por contraseña desactivada (`PasswordAuthentication no` en `/etc/ssh/sshd_config`). Acceso estrictamente mediante llaves criptográficas autorizadas (`~/.ssh/authorized_keys`).

---

## 3. Servidor Web Nginx (Proxy Inverso de Alto Rendimiento)

Ubicación: `/etc/nginx/sites-available/jorgedoicela.com` enlazado a `/etc/nginx/sites-enabled/`.

### Configuración Maestra de Nginx:
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

    # Certificados de Origen Cloudflare
    ssl_certificate /etc/ssl/certs/origin.pem;
    ssl_certificate_key /etc/ssl/private/private.key;

    # Cloudflare Authenticated Origin Pulls (mTLS)
    ssl_client_certificate /etc/ssl/certs/cloudflare.crt;
    ssl_verify_client on;
    error_page 496 =444 @cerrar_conexion;

    location @cerrar_conexion {
        return 444;
    }

    # Parámetros SSL y Cabeceras de Seguridad
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    server_tokens off;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compresión Gzip
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # 1. API REST Backend NestJS (Puerto 3000)
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

    # 2. WebSockets de la Terminal SSH (Socket.io)
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 3. Next.js Frontend Standalone (Puerto 3001)
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

---

## 4. Gestión de Procesos con PM2 (Modo Standalone)

* **Archivo de Configuración:** `pm2.config.js` en la raíz del monorepo.
* **Backend:** Ejecuta `./dist/main.js` desde `./backend` con límite de reinicio en `max_memory_restart: '300M'`.
* **Frontend:** Ejecuta `.next/standalone/frontend/web/server.js` desde `./frontend/web` con límite en `max_memory_restart: '450M'`.
* **Consumo Total de RAM en Producción:** Menos de 200 MB combinados (ahorrando más del 70% de memoria respecto al modo tradicional).

### Comandos de Operación en el Servidor:
```bash
pm2 list                     # Ver procesos y uso de RAM en tiempo real
pm2 monit                    # Monitor interactivo en consola
pm2 reload pm2.config.js     # Recarga en caliente sin caída (Zero Downtime)
pm2 restart pm2.config.js    # Reinicio completo
pm2 logs --lines 100         # Ver últimas 100 líneas de logs
pm2 save                     # Persistir estado para inicio automático por systemd
```

---

## 5. Pipeline de CI/CD (GitHub Actions)

* **Estrategia Zero-Load en VPS:** La compilación (`typecheck`, `nest build`, `next build`) se ejecuta íntegramente en los servidores de GitHub Actions (`.github/workflows/deploy.yml`). El VPS no compila; solo recibe los artefactos listos (`backend/dist` y `frontend/web/.next/standalone`).
* **Transferencia:** Vía `rsync` sobre SSH excluyendo `node_modules` y bases de datos `.sqlite`.
* **Secretos de GitHub Requeridos:** `SSH_PRIVATE_KEY`, `REMOTE_HOST`, `REMOTE_USER`, `TARGET_DIR`.

---

## 6. Guía de Diagnóstico y Resolución de Problemas (Troubleshooting)

### 🔴 Error 502 Bad Gateway en el Navegador
1. Comprueba si los procesos de Node.js están activos:
   ```bash
   pm2 status
   ```
2. Revisa los logs de error del proceso caído:
   ```bash
   pm2 logs --err --lines 50
   ```
3. Verifica que los puertos locales `3000` y `3001` estén escuchando:
   ```bash
   sudo ss -tulpn | grep -E '3000|3001'
   ```

### 🔴 El Servidor se Congela o no Responde (OOM - Out of Memory)
1. Verifica el estado de la RAM y del Swap:
   ```bash
   free -m
   swapon --show
   ```
2. Si el Swap está inactivo, reactívalo de inmediato:
   ```bash
   sudo swapon /swapfile
   ```
3. Si un proceso consume demasiada memoria, reinícialo:
   ```bash
   pm2 restart all
   ```

### 🔴 Errores en Nginx
1. Valida la sintaxis de configuración:
   ```bash
   sudo nginx -t
   ```
2. Revisa los logs del servidor web:
   ```bash
   sudo tail -n 50 /var/log/nginx/error.log
   ```

### 🔴 Purgado de Caché en Cloudflare tras Despliegues
Si tras un despliegue los visitantes antiguos ven versiones desactualizadas de los assets:
1. Ir al panel de Cloudflare $\rightarrow$ `jorgedoicela.com` $\rightarrow$ **Caching** $\rightarrow$ **Configuration**.
2. Hacer clic en **Purge Everything**.

---

## 7. ❌ Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Poner un registro DNS de Cloudflare en modo "Solo DNS" (nube gris) | Revela la IP pública real del VPS, evadiendo el WAF y exponiéndolo a ataques DDoS directos. | Mantener siempre el modo "Proxied" (nube naranja). |
| Permitir autenticación por contraseña en SSH | Expone el servidor a ataques de fuerza bruta constantes en el puerto 22. | Usar `PasswordAuthentication no` y solo llaves en `authorized_keys`. |
| Abrir el puerto 80 en el Firewall de Lightsail | Innecesario; Cloudflare gestiona la redirección HTTP $\rightarrow$ HTTPS en su propio Edge. | Mantener abiertos únicamente los puertos 443 y 22. |
| Ejecutar `next start` convencional en producción | Consume más de 400 MB de RAM y depende de `node_modules` completos en el VPS. | Usar el modo `standalone` de Next.js (`node .next/standalone/.../server.js`). |
| Modificar directamente las bases de datos `.sqlite` en producción sin backup | Riesgo de corrupción o pérdida irrecuperable de datos. | Hacer copia de seguridad antes de cualquier migración o script SQL. |

---

## 8. 🔗 Combinar con
* **General:** `general-jorge-doicela` (para el control de comandos pnpm y compilación de dependencias nativas C++ con `better-sqlite3`).
