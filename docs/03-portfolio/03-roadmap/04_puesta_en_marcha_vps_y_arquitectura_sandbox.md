# Puesta en Marcha en Producción y Operatividad del Live Linux Sandbox

Este documento registra técnicamente el aprovisionamiento de infraestructura, hardening de seguridad, resolución de permisos de sistema operativo y el estado operativo final del Live Linux Sandbox en el VPS de AWS Lightsail (Debian 13), así como la automatización del ciclo de vida para futuros despliegues continuos.

---

## 1. Resumen Ejecutivo de la Puesta en Marcha

Se completó la puesta a punto del entorno de ejecución aislado para la Terminal Interactiva Linux en producción. La arquitectura permite que los usuarios que visitan el Portafolio Profesional (`portfolio.jorgedoicela.com`) inicien sesiones interactivas de terminal en contenedores efímeros Docker sin comprometer los recursos de hardware ni la seguridad del servidor anfitrión.

---

## 2. Aprovisionamiento Inicial de Infraestructura (Servidor VPS)

Debido a que las instancias limpias de Debian 13 en AWS Lightsail no incluyen el motor Docker de forma predeterminada, se ejecutaron las siguientes tareas de aprovisionamiento a nivel de sistema operativo:

### 2.1 Instalación del Motor Docker Ligero
Se instaló el paquete nativo oficial de Debian:
```bash
sudo apt update && sudo apt install -y docker.io
sudo systemctl enable --now docker
```

### 2.2 Configuración de Seguridad y Permisos de Socket Unix
Para evitar que el proceso de Node.js se ejecute con privilegios de superusuario (`root`), se configuró el acceso estándar mediante grupos Unix:
```bash
# Adición del usuario de despliegue al grupo docker
sudo usermod -aG docker admin

# Asignación de permisos de lectura y escritura al socket
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
```

### 2.3 Compilación de la Imagen Base del Sandbox
Se compiló localmente en el VPS la imagen optimizada e inmutable basada en Alpine Linux 3.20:
```bash
cd /home/admin/jorge_doicela/backend/src/portfolio/docker
docker build -t portfolio-sandbox:latest .
```
Validación de ejecución con usuario sin privilegios:
```bash
docker run --rm portfolio-sandbox:latest whoami
# Salida verificada: guest
```

---

## 3. Resolución de Causa Raíz en PM2 y Entorno de Producción

Durante el despliegue inicial se identificaron y solucionaron dos causas raíz a nivel de entorno:

### 3.1 Sincronización de Dependencias con Filtro de Monorepo
* **Incidencia:** Error `MODULE_NOT_FOUND: dockerode` al iniciar el backend.
* **Causa Raíz:** Las dependencias añadidas en el monorepo no se habían instalado en el subárbol del backend en producción.
* **Solución:** Ejecución de `pnpm --filter backend install --prod --ignore-scripts` para instalar `dockerode` sin invocar scripts de ciclo de vida de desarrollo (`husky`), el cual no existe en entornos `--prod`.

### 3.2 Actualización de Grupos Suplementarios en el Daemon PM2
* **Incidencia:** Error `connect EACCES /var/run/docker.sock` emitido por el WebSocket al solicitar sesión.
* **Causa Raíz:** El daemon maestro de PM2 fue iniciado antes de añadir el usuario `admin` al grupo `docker`. En Linux, los procesos en ejecución conservan la tabla de identificadores de grupo (GIDs) con la que fueron lanzados, por lo que un `pm2 reload` no actualizaba los grupos suplementarios del proceso padre.
* **Solución:** Reinicio completo del daemon maestro de PM2:
  ```bash
  pm2 kill
  cd /home/admin/jorge_doicela
  pm2 start pm2.config.js
  pm2 save
  ```

---

## 4. Hardening y Arquitectura de Seguridad Implementada

El Sandbox opera bajo un modelo de aislamiento estricto de 5 capas gobernado por `SandboxService` en NestJS:

1. **Aislamiento Total de Red (`NetworkMode: 'none'`):**
   Los contenedores no disponen de interfaces de red externas ni acceso a la red local del VPS, impidiendo tráfico saliente o uso indebido.

2. **Sistema de Archivos Inmutable (`ReadonlyRootfs: true`):**
   La raíz del sistema operativo es de solo lectura. Únicamente `/home/guest` (15 MB) y `/tmp` (10 MB) se montan sobre memoria volátil (`tmpfs`), destruyéndose al finalizar la sesión.

3. **Restricción de Recursos de Hardware (Cgroups para VPS de 1 GB RAM):**
   * Límite de Memoria: 64 MB por contenedor (sin memoria swap).
   * Cuota de CPU: 0.25 vCPU (`NanoCpus: 250000000`).
   * Límite de Procesos: 50 PIDs (`PidsLimit: 50`) para prevenir ataques de denegación de servicio por bifurcación (*fork bombs*).
   * Concurrencia Máxima: 3 sesiones simultáneas en VPS (`SANDBOX_MAX_SESSIONS=3`).

4. **Principio de Mínimo Privilegio (Zero-Root):**
   * Supresión total de capacidades del kernel (`CapDrop: ['ALL']`).
   * Activación de `no-new-privileges: true`.
   * Usuario de ejecución `guest` (UID `1000`, GID `1000`) sin acceso a binarios administrativos ni `sudo`.

5. **Ciclo de Vida y Limpieza Automática:**
   * Auto-remoción inmediata (`AutoRemove: true`).
   * Advertencia visual al usuario a los 4 minutos y 30 segundos.
   * Expiración forzada por temporizador TTL a los 5 minutos, destruyendo el contenedor y cerrando el stream interactivo.
   * Limpieza de contenedores huérfanos mediante el hook `OnModuleDestroy` de NestJS ante reinicios del proceso.

---

## 5. Automatización Total de Despliegues Futuros (CI/CD)

A partir de la finalización de este aprovisionamiento, **no se requiere acceso manual por SSH al servidor VPS**. El pipeline de GitHub Actions (`.github/workflows/deploy.yml`) gestiona el ciclo completo en cada `git push origin main`:

1. Validación estricta de tipos TypeScript en GitHub Actions (`ubuntu-latest`).
2. Compilación de Next.js Standalone y NestJS fuera del VPS para preservar la memoria RAM.
3. Despliegue de binarios mediante `rsync`.
4. Instalación de dependencias de producción (`pnpm --filter backend install --prod --ignore-scripts`).
5. Sincronización automática de bases de datos SQLite (`seed-corpus.js`, `seed-software.js`, `seed-portfolio.js`).
6. Reconstrucción automatizada de la imagen `portfolio-sandbox:latest` si se modifican archivos en `backend/src/portfolio/docker/`.
7. Actualización y recarga de configuración de Nginx y certificados mTLS.
8. Recarga en caliente de procesos en PM2 (`pm2 reload pm2.config.js --update-env`).
9. Purga de caché perimetral en la API de Cloudflare.

---

## 6. Métricas de Rendimiento en Producción

Estado verificado en el servidor de producción tras la puesta en marcha:

| Parámetro | Valor Verificado | Estado |
|---|---|---|
| Uso Global de RAM del VPS | 45.9% (~470 MB de 1 GB total) | Óptimo |
| Proceso Backend NestJS | ~81.7 MB | Estable |
| Proceso Frontend Next.js | ~89.5 MB | Estable |
| Latencia de Creación de Contenedor | < 300 ms | Instantáneo |
| Estado de la Terminal Interactiva | Operativo en `/sandbox?mode=vps` | Verificado |
