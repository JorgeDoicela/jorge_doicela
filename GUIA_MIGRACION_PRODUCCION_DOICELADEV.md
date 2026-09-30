# Guia de Despliegue y Migracion a Produccion: DoicelaDev

Este documento detalla las acciones manuales y de verificacion requeridas en Cloudflare, el servidor VPS (Debian en AWS Lightsail), variables de entorno (.env), bases de datos SQLite y Nginx para consolidar la transicion del subdominio y modulo a DoicelaDev (`doiceladev.jorgedoicela.com`).

---

## 1. Configuracion en Cloudflare

### 1.1 Registros DNS
Acceder al panel de control de Cloudflare en la zona DNS de `jorgedoicela.com`:

1. **Nuevo registro para DoicelaDev:**
   - **Tipo:** `CNAME` (o `A` apuntando a la IP elastica del VPS).
   - **Nombre:** `doiceladev`
   - **Objetivo:** `jorgedoicela.com` (o la IP del servidor).
   - **Estado de Proxy:** `Proxied` (Nube Naranja activa).
   - **TTL:** Auto.

2. **Depuracion del registro legacy (software):**
   - Localizar el registro DNS `software.jorgedoicela.com`.
   - **Eliminar el registro** de forma definitiva para evitar resoluciones residuales hacia la infraestructura.

### 1.2 Reglas de Redireccion / Edge (Opcional)
Si se desea redirigir tráfico residual antiguo hacia la nueva URL:
- Crear una regla de redirección en Cloudflare (Page Rules o Redirect Rules):
  - **Patron:** `software.jorgedoicela.com/*`
  - **Destino:** `https://doiceladev.jorgedoicela.com/$1`
  - **Codigo de estado:** 301 (Permanent Redirect).
- Si no se desea mantener enlaces previos, omitir este paso; la eliminación del registro DNS responderá `NXDOMAIN` como es esperado.

### 1.3 Purga de Cache
- Dirigirse a **Caching** -> **Configuration** -> **Purge Everything** para limpiar cualquier respuesta cacheadas con encabezados antiguos.

---

## 2. Servidor VPS (AWS Lightsail - Debian 13)

Conectarse por SSH al servidor VPS:
```bash
ssh admin@<IP_DEL_SERVIDOR>
```

### 2.1 Actualizacion del Codigo Fuente
Ubicarse en el directorio del proyecto y obtener los ultimos cambios:
```bash
cd /home/admin/jorge_doicela
git pull origin main
```

### 2.2 Variables de Entorno (.env)
Revisar los archivos `.env` en backend y frontend para verificar que no existan variables obsoletas:

1. **Backend (`/home/admin/jorge_doicela/backend/.env`):**
   - Asegurarse de que la variable de persistencia sea:
     ```env
     DATABASE_DOICELADEV_PATH=./data/doiceladev.sqlite
     ```
   - Eliminar cualquier linea que contenga `DATABASE_SOFTWARE_PATH`.

2. **Frontend Web (`/home/admin/jorge_doicela/frontend/web/.env` o `.env.production`):**
   - Verificar si existen variables locales de API o subdominios que apunten a `software.`; deben apuntar a `doiceladev.`.

### 2.3 Depuracion y Sembrado de Bases de Datos SQLite
El monorepo utiliza bases de datos SQLite independientes en `backend/data/`.

1. **Eliminar base de datos legacy:**
   ```bash
   cd /home/admin/jorge_doicela/backend/data
   rm -f software.sqlite software.sqlite-wal software.sqlite-shm
   ```

2. **Generar y sembrar la nueva base de datos `doiceladev.sqlite`:**
   ```bash
   cd /home/admin/jorge_doicela
   pnpm seed:doiceladev
   ```
   *(Opcional: ejecutar `pnpm seed:all` para garantizar la consistencia en todas las bases del ecosistema: `bible.sqlite`, `portfolio.sqlite` y `doiceladev.sqlite`).*

3. **Verificar permisos de archivo:**
   ```bash
   ls -la /home/admin/jorge_doicela/backend/data/
   ```
   Asegurarse de que el usuario que ejecuta Node.js/PM2 (`admin`) tenga permisos de lectura y escritura (`-rw-r--r--`).

### 2.4 Actualizacion y Recarga de Nginx
El archivo de configuracion maestro de Nginx se encuentra versionado en `nginx/jorgedoicela.com.conf`.

1. **Copiar o verificar el enlace simbolico:**
   ```bash
   sudo cp /home/admin/jorge_doicela/nginx/jorgedoicela.com.conf /etc/nginx/sites-available/jorgedoicela.com.conf
   ```

2. **Validar la sintaxis de Nginx:**
   ```bash
   sudo nginx -t
   ```
   Debe devolver: `syntax is ok` y `test is successful`.

3. **Recargar Nginx sin tiempo de inactividad:**
   ```bash
   sudo systemctl reload nginx
   ```

### 2.5 Compilacion y Recarga de Procesos PM2
Debido a la restriccion de 1 GB de RAM, validar el estado de la memoria antes y despues del despliegue:

1. **Instalacion de dependencias:**
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Compilacion de produccion (Backend y Frontend):**
   ```bash
   pnpm run build
   ```

3. **Recarga de procesos consolidados en PM2:**
   ```bash
   pm2 reload pm2.config.js --update-env
   ```

4. **Verificar estado y memoria de los procesos:**
   ```bash
   pm2 status
   free -m
   ```

5. **Monitoreo de logs en tiempo real:**
   ```bash
   pm2 logs --lines 50
   ```
   Verificar que `DoiceladevModule` inicie correctamente en el backend y que el servidor Next.js atienda peticiones entrantes sin errores 500.

---

## 3. Lista de Verificacion Final (Checklist)

- [ ] Registro DNS `doiceladev` creado y proxeado en Cloudflare.
- [ ] Registro DNS `software` eliminado de Cloudflare.
- [ ] Base de datos `software.sqlite` eliminada de `backend/data/`.
- [ ] Base de datos `doiceladev.sqlite` creada y sembrada con 8 modulos.
- [ ] Archivo `backend/.env` actualizado con `DATABASE_DOICELADEV_PATH`.
- [ ] Nginx validado (`sudo nginx -t`) y recargado (`sudo systemctl reload nginx`).
- [ ] PM2 recargado con nuevos bundles (`pm2 reload pm2.config.js --update-env`).
- [ ] Navegacion exitosa a `https://doiceladev.jorgedoicela.com` con carga correcta de categorias y portadas fotográficas.
- [ ] Navegacion al portal principal `https://jorgedoicela.com` verificando enlaces hacia DoicelaDev.
