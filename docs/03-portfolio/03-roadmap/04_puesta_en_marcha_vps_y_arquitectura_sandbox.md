# Puesta en Marcha en Producción y Operatividad del Live Linux Sandbox

Este documento registra técnicamente el aprovisionamiento de infraestructura, hardening de seguridad, resolución de permisos de sistema operativo, correcciones de seguridad aplicadas en el código y el estado operativo final del Live Linux Sandbox en el VPS de AWS Lightsail (Debian 13), así como la automatización del ciclo de vida para futuros despliegues continuos.

---

## 1. Resumen Ejecutivo de la Puesta en Marcha

Se completó la puesta a punto del entorno de ejecución aislado para la Terminal Interactiva Linux en producción. La arquitectura permite que los usuarios que visitan el Portafolio Profesional (`portfolio.jorgedoicela.com`) inicien sesiones interactivas de terminal en contenedores efímeros Docker sin comprometer los recursos de hardware ni la seguridad del servidor anfitrión.

---

## 2. Aprovisionamiento Inicial de Infraestructura (Servidor VPS)

Debido a que las instancias limpias de Debian 13 en AWS Lightsail no incluyen el motor Docker de forma predeterminada, se ejecutaron las siguientes tareas de aprovisionamiento a nivel de sistema operativo. Estas tareas son de ejecución única y no se repiten en despliegues futuros.

### 2.1 Instalación del Motor Docker Ligero
Se instaló el paquete nativo oficial de Debian:
```bash
sudo apt update && sudo apt install -y docker.io
sudo systemctl enable --now docker
```

### 2.2 Configuración de Seguridad y Permisos de Socket Unix
Para evitar que el proceso de Node.js se ejecute con privilegios de superusuario (`root`), se configuró el acceso estándar mediante grupos Unix:
```bash
sudo usermod -aG docker admin
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
```

### 2.3 Compilación de la Imagen Base del Sandbox
Se compiló localmente en el VPS la imagen optimizada e inmutable basada en Alpine Linux 3.20:
```bash
cd /home/admin/jorge_doicela/backend/src/portfolio/docker
docker build -t portfolio-sandbox:latest .
docker run --rm portfolio-sandbox:latest whoami
# Salida verificada: guest
```

---

## 3. Resolución de Causas Raíz en el Despliegue Inicial

Durante el aprovisionamiento se identificaron y solucionaron tres causas raíz:

### 3.1 Error MODULE_NOT_FOUND: dockerode
* **Causa Raíz:** La nueva dependencia `dockerode` estaba declarada en `backend/package.json` pero no instalada en el entorno de producción del servidor.
* **Solución:** Instalación de dependencias de producción con la bandera `--ignore-scripts` para evitar que pnpm intente ejecutar el script `husky` (ausente en producción):
  ```bash
  pnpm --filter backend install --prod --ignore-scripts
  ```

### 3.2 Error EACCES: connect /var/run/docker.sock
* **Causa Raíz:** El daemon maestro de PM2 fue iniciado antes de añadir el usuario `admin` al grupo `docker`. En Linux, los procesos en ejecución conservan la tabla de identificadores de grupo (GIDs) con la que fueron lanzados. Un `pm2 reload` no actualiza los GIDs del proceso padre.
* **Solución:** Reinicio completo del daemon maestro de PM2 para que herede los grupos actualizados del sistema operativo:
  ```bash
  pm2 kill
  cd /home/admin/jorge_doicela
  pm2 start pm2.config.js
  pm2 save
  ```

### 3.3 Script prepare de Husky falla en instalaciones --prod
* **Causa Raíz:** El `package.json` raíz del monorepo define `"prepare": "husky"`. Al instalar solo dependencias de producción, Husky no está disponible en el entorno.
* **Solución:** Se actualizó el script en `package.json` para que sea resiliente:
  ```json
  "prepare": "husky || true"
  ```

---

## 4. Auditoría de Seguridad y Correcciones Aplicadas en el Código

Durante la revisión de seguridad posterior al despliegue se identificaron y corrigieron las siguientes vulnerabilidades:

### 4.1 CORS Abierto en el WebSocket del Sandbox (Gravedad Media-Alta)
* **Archivo:** `backend/src/portfolio/gateways/sandbox.gateway.ts`
* **Vulnerabilidad:** El decorador `@WebSocketGateway` tenía `origin: '*'`, lo que permitía que cualquier sitio web externo iniciara conexiones WebSocket al endpoint `/sandbox` y levantara contenedores Docker en el VPS.
* **Corrección:** Reemplazado por lista explícita de orígenes autorizados:
  ```typescript
  cors: {
    origin: [
      'https://portfolio.jorgedoicela.com',
      'https://jorgedoicela.com',
      'http://portfolio.localhost:3001',
      'http://localhost:3001',
    ],
    credentials: true,
  }
  ```

### 4.2 Inyección de Parámetros desde el Cliente WebSocket (Gravedad Media)
* **Archivo:** `backend/src/portfolio/services/sandbox.service.ts`
* **Vulnerabilidad:** Los parámetros `cols`, `rows` y `targetMode` se pasaban directamente del cliente al motor de Docker sin ninguna validación. Un atacante podía enviar `cols=999999999` para inyectar valores arbitrarios como variables de entorno del contenedor, o un `targetMode` distinto de los valores esperados.
* **Corrección:** Se añadieron tres guardas explícitas:
  1. `targetMode` — Validación de valor de enum: si no es exactamente `'tunnel'`, se fuerza a `'vps'`. Ningún valor arbitrario puede pasar.
  2. `safeCols` — Forzado al rango `[40, 300]` mediante `Math.clamp`.
  3. `safeRows` — Forzado al rango `[10, 100]` mediante `Math.clamp`.
  4. `socketId` en el nombre del contenedor — Truncado a 20 caracteres alfanuméricos para prevenir desbordamientos en el nombre del recurso Docker.

### 4.3 Mención de Herramientas de Red en el Perfil de Shell (Claridad)
* **Archivo:** `backend/src/portfolio/docker/sandbox_profile.sh`
* **Problema:** La función `help()` listaba `curl` y `jq` como herramientas disponibles. El contenedor opera con `NetworkMode: 'none'`, por lo que cualquier llamada de red falla. La mención podía inducir a error y crear ambigüedad respecto al nivel de acceso de red del contenedor.
* **Corrección:** Se reemplazó por `git` (disponible en modo offline para exploración de repositorios locales).

---

## 5. Hardening y Arquitectura de Seguridad Completa

El Sandbox opera bajo un modelo de aislamiento estricto de 5 capas gobernado por `SandboxService` en NestJS:

### 5.1 Aislamiento Total de Red
* `NetworkMode: 'none'` — El contenedor no tiene interfaz de red de ningún tipo. Ni acceso a internet, ni a la red interna del VPS, ni a los puertos 3000/3001 del backend/frontend.

### 5.2 Sistema de Archivos Inmutable
* `ReadonlyRootfs: true` — El sistema operativo del contenedor es de solo lectura.
* `/home/guest` (15 MB) y `/tmp` (10 MB) — Montados como `tmpfs` en memoria volátil. Al destruir el contenedor desaparecen sin dejar rastro en disco.
* Ambos `tmpfs` con flags `noexec,nosuid` — Impide la ejecución de binarios escritos en tiempo de ejecución.

### 5.3 Restricción de Recursos de Hardware
* Memoria: 64 MB por contenedor, sin swap (`MemorySwap: 64MB`).
* CPU: 0.25 vCPU (`NanoCpus: 250000000`).
* PIDs: 50 procesos máximos (`PidsLimit: 50`) — Previene fork bombs.
* Concurrencia: 3 sesiones simultáneas máximas en VPS (`SANDBOX_MAX_SESSIONS=3`).

### 5.4 Principio de Mínimo Privilegio
* `CapDrop: ['ALL']` — Supresión total de las 40 capacidades del kernel de Linux.
* `SecurityOpt: ['no-new-privileges:true']` — Ningún proceso hijo puede elevar privilegios.
* Usuario `guest` (UID 1000, GID 1000) sin acceso a `sudo` ni binarios administrativos.

### 5.5 Ciclo de Vida y Limpieza Automática
* `AutoRemove: true` — El contenedor se destruye automáticamente al finalizar el proceso.
* Advertencia visual al usuario a los 4 minutos y 30 segundos.
* TTL forzado a los 5 minutos: destrucción del contenedor, cierre del stream WebSocket y liberación de recursos.
* Hook `OnModuleDestroy` en NestJS — Destruye todos los contenedores activos al reiniciar el proceso backend en PM2.

---

## 6. Automatización Total de Despliegues Futuros (CI/CD)

A partir de la finalización de este aprovisionamiento, no se requiere acceso manual al servidor VPS para ningún despliegue o actualización futura. El pipeline de GitHub Actions (`.github/workflows/deploy.yml`) gestiona el ciclo completo en cada `git push origin main`:

1. Validación estricta de tipos TypeScript (`pnpm -r typecheck`).
2. Compilación de Next.js Standalone y NestJS en GitHub Actions (sin consumir RAM del VPS).
3. Despliegue de artefactos compilados mediante `rsync`.
4. Instalación de dependencias de producción (`pnpm --filter backend install --prod --ignore-scripts`).
5. Sincronización automática de bases de datos SQLite.
6. Reconstrucción automatizada de la imagen `portfolio-sandbox:latest` si se modifican archivos en `backend/src/portfolio/docker/`.
7. Aplicación de permisos de socket Docker (`chmod 660 /var/run/docker.sock`).
8. Actualización y recarga de Nginx.
9. Recarga en caliente de procesos en PM2 (`pm2 reload pm2.config.js --update-env`).
10. Purga de caché perimetral en Cloudflare.

---

## 7. Métricas de Rendimiento en Producción

Estado verificado en el servidor de producción tras la puesta en marcha completa:

| Parámetro | Valor Verificado | Estado |
|---|---|---|
| Uso Global de RAM del VPS | 45.9% (~470 MB de 1 GB total) | Óptimo |
| Proceso Backend NestJS | ~81.7 MB | Estable |
| Proceso Frontend Next.js | ~89.5 MB | Estable |
| Latencia de Creación de Contenedor | menos de 300 ms | Instantáneo |
| Estado de la Terminal Interactiva | Operativo en `/sandbox?mode=vps` | Verificado |
| CORS WebSocket Sandbox | Restringido a 4 dominios explícitos | Corregido |
| Validación de parámetros cliente | cols [40-300], rows [10-100], mode enum | Corregido |
