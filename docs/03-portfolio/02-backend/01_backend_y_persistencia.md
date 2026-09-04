# Portafolio Profesional - Backend y Persistencia (NestJS)

Este documento detalla la arquitectura macro y micro, gateways de WebSockets, controladores y persistencia del módulo de Portafolio.

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** El módulo vive en `backend/src/portfolio/` dentro del proceso único de NestJS 11 (puerto `3000`), optimizado para el VPS de **1 GB de RAM**.
> * **Aislamiento de Persistencia:** Base de datos física independiente `backend/data/portfolio.sqlite` registrada con la conexión de TypeORM `'portfolioConnection'`. Cero tablas compartidas.
> * **Aislamiento de Dominio:** Cero dependencias de `bible` o `software`.
>
> **Arquitectura Micro:**
> * **Arquitectura en Capas:**
>   1. *Presentación:* `PortfolioGateway` (WebSockets `/terminal`), `SandboxGateway` (WebSockets `/sandbox`) y `ContactController` + `PortfolioProjectsController` (REST).
>   2. *Lógica de Negocio:* `PortfolioService`, `SandboxService` y `ContactMessagesService`.
>   3. *Acceso a Datos:* Entidades `ContactMessage` y `PortfolioProject` en TypeORM con driver `better-sqlite3`.

---

## 2. Módulo del Backend (`PortfolioModule`)

```text
backend/src/portfolio/
├── portfolio.module.ts            # Registro del módulo, gateways, controladores y entidades
├── corpus/
│   └── projects.json              # Dataset JSON estructurado de proyectos (Fuente de Verdad)
├── cli/
│   └── seed-portfolio.ts          # Sembrado atómico CLI con better-sqlite3 en modo WAL
├── docker/
│   ├── Dockerfile                 # Imagen base Alpine 3.20 hardened (< 45 MB, usuario guest UID/GID 1000)
│   ├── sandbox_profile.sh         # Perfil de shell global con banner dinámico por modo, prompt ANSI y comandos nativos
│   └── welcome.txt                # Banner MOTD de la Live Linux Sandbox
├── gateways/
│   ├── portfolio.gateway.ts       # Gateway WebSocket para la terminal SSH simulada (/terminal)
│   └── sandbox.gateway.ts         # Gateway WebSocket para el Live Linux Sandbox (/sandbox)
├── controllers/
│   ├── contact.controller.ts      # Endpoint REST POST y GET para mensajes de contacto
│   ├── portfolio-projects.controller.ts # Endpoint REST GET /portfolio/projects y /:slug
│   └── sandbox.controller.ts      # Endpoint REST POST /portfolio/sandbox/wake-request
├── events/
│   ├── contact-message-created.event.ts # Evento de dominio de contacto
│   └── sandbox-wake-requested.event.ts  # Evento de dominio de solicitud de encendido
├── listeners/
│   └── telegram-notification.listener.ts # Listener asíncrono que procesa eventos y despacha a Telegram
├── guards/
│   └── contact-throttle.guard.ts  # Guard de Rate Limiting en memoria para mitigar spam/DDoS
├── services/
│   ├── portfolio.service.ts       # Intérprete y procesador de comandos Unix de la terminal guiada
│   ├── sandbox.service.ts         # Orquestador y hardening de contenedores Docker efímeros (dockerode)
│   ├── contact-messages.service.ts # Servicio de persistencia y emisión de eventos
│   ├── telegram-notification.service.ts # Servicio de comunicación HTTP con la API de Telegram
│   └── portfolio-projects.service.ts # Servicio de consulta bilingüe de proyectos (TypeORM simple-json)
├── entities/
│   ├── contact-message.entity.ts  # Entidad TypeORM para mensajes de contacto
│   └── portfolio-project.entity.ts # Entidad TypeORM con índice compuesto (slug, language)
└── dto/
    ├── create-contact-message.dto.ts # DTO blindado con @MaxLength y validaciones estrictas
    └── create-wake-request.dto.ts    # DTO validado para solicitudes de aviso de encendido del servidor físico propio
```

---

## 3. Gateways WebSocket

### 3.1 Gateway de la Terminal Guiada (`PortfolioGateway`)
* **Namespace:** `/terminal`
* **Configuración CORS (producción segura):**
  ```ts
  origin: [
    'https://portfolio.jorgedoicela.com',
    'https://jorgedoicela.com',
    // Solo en desarrollo:
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3001', 'http://localhost:3000'] : []),
  ]
  ```
  > [!WARNING]
  > **Nunca usar `origin: true`** en producción. El wildcard acepta conexiones WebSocket desde cualquier dominio y es un vector de CSRF / session hijacking.
* **Manejo de Conexión (`handleConnection`):** Al conectarse, el backend emite el banner SSH de bienvenida y el prompt `jorge@debian:~$`.
* **Intérprete de Comandos (`PortfolioService`):**
  `help`, `about`, `skills`, `contact`, `neofetch`, `date`, `uptime`, `echo`, `cat`, `ls`, `cd`, `whoami`, `matrix`, `clear`, `exit`.

### 3.2 Gateway del Live Linux Sandbox (`SandboxGateway`)
* **Namespace:** `/sandbox` (independiente de `/terminal`).
* **Configuración CORS:** Idéntica a `PortfolioGateway` — lista blanca explícita con condicional `NODE_ENV`.
* **Eventos WebSocket recibidos:**

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `start-session` | `{ cols, rows, targetMode }` | Crea el contenedor Docker y emite `session-ready` |
| `terminal-input` | `string` | Reenvía caracteres/teclas al PTY del contenedor |
| `terminal-resize` | `{ cols, rows }` | Redimensiona el TTY del contenedor en ejecución |

* **Eventos WebSocket emitidos:**

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `session-ready` | `{ sessionId, cols, rows, maxTtlSeconds: 300, mode }` | Notifica al cliente que el sandbox está listo |
| `terminal-output` | `string` | Stream de bytes del PTY hacia el cliente (xterm.js) |
| `session-warning` | `{ message, secondsRemaining: 30 }` | Advertencia a 4m 30s |
| `session-expired` | `{ reason }` | TTL de 5 minutos alcanzado |
| `session-ended` | `{ reason }` | Shell finalizado (`exit`) |
| `session-error` | `{ message }` | Error al crear el contenedor |

* **Validación de Modo en `start-session`:**
  ```ts
  const targetMode: 'vps' | 'tunnel' =
    payload?.targetMode === 'tunnel' ? 'tunnel' : 'vps';
  ```
  Cualquier valor arbitrario (ej. `"admin"`, `"root"`) cae silenciosamente a `'vps'`. No se propaga al contenedor sin validación.

* **Privacidad en Logs:** El evento `terminal-input` **no loguea** el contenido recibido para proteger la privacidad del visitante.

---

## 4. Orquestador de Contenedores (`SandboxService`)

### 4.1 Hardening por Capas

> [!IMPORTANT]
> Todas las capas de seguridad se aplican en **ambos modos** (`vps` y `tunnel`).
> **Protección del Host AWS (1 GB RAM):** La asignación física de hardware (256 MB vs 64 MB) se rige estrictamente por la variable `SANDBOX_MODE` del entorno donde corre el backend (`this.mode`). Si la instancia corre en AWS (`this.mode === 'vps'`), siempre aplica la cuota de **64 MB / 0.25 vCPU** sin importar el `targetMode` del cliente, blindando el VPS de 1 GB. La cuota expandida de **256 MB / 1.0 vCPU** solo se activa en la instancia que corre en el Servidor Casero (`pm2.home.config.js`).

| Capa | Mecanismo | VPS (AWS) | Tunnel (On-Premises) |
|------|-----------|-----------|----------------------|
| **cgroups — Memoria** | `Memory + MemorySwap` | 64 MB | 256 MB |
| **cgroups — CPU** | `NanoCpus` | 0.25 vCPU | 1.0 vCPU |
| **Anti-Forkbomb (kernel)** | `PidsLimit` | 50 | 100 |
| **Anti-Forkbomb (shell)** | `ulimit -u 50` | ✅ | ✅ |
| **Virtual Memory (shell)** | `ulimit -v 131072` (VPS) / `ulimit -v 524288` (Tunnel) | 128 MB | 512 MB |
| **CPU Time por proceso** | `ulimit -t 60` — 60 segundos máx/proceso | ✅ | ✅ |
| **Tamaño de archivo** | `ulimit -f 40960` — 20 MB máx | ✅ | ✅ |
| **File Descriptors** | `ulimit -n 256` — reduce desde 1048576 | ✅ | ✅ |
| **Permisos de archivo** | `umask 077` — ningún archivo es world-readable | ✅ | ✅ |
| **Zero-Root** | Usuario `guest` UID/GID 1000, `CapDrop: ['ALL']`, `no-new-privileges:true` | ✅ | ✅ |
| **Filesystem Inmutable** | `ReadonlyRootfs: true` | ✅ | ✅ |
| **Áreas Escribibles** | `/home/guest` tmpfs `noexec,nosuid,size=15M` | ✅ | ✅ |
| **Temp Aislado** | `/tmp` tmpfs `noexec,nosuid,size=10M` | ✅ | ✅ |
| **Aislamiento de Red** | `NetworkMode: 'none'` | ✅ | ✅ |
| **Auto-destrucción** | `AutoRemove: true` | ✅ | ✅ |
| **Rutas /proc enmascaradas** | `MaskedPaths` — monta `/dev/null` sobre rutas sensibles (OCI spec) | ✅ | ✅ |

**`MaskedPaths` — rutas bloqueadas a nivel de kernel:**
```
/proc/cpuinfo       → impide fingerprinting del hardware real del servidor
/proc/version       → impide identificar versión exacta del kernel del host
/proc/scsi          → impide enumerar dispositivos de almacenamiento
/proc/kcore         → impide volcado de memoria del kernel
/proc/sysrq-trigger → impide activar SysRq en el host
/proc/irq           → impide mapear interrupciones del hardware
/proc/bus           → impide enumerar bus PCI/USB
/sys/firmware       → impide acceso a datos de firmware del host
```

> [!NOTE]
> `MaskedPaths` es la solución correcta según la especificación OCI para containers. No depende de aliases de shell (que pueden eludirse con `bash script.sh` o `cat_real`) — actúa a nivel del kernel del host montando `/dev/null` sobre esas rutas en el namespace del contenedor.

### 4.2 Sanitización de Entradas

* **Dimensiones del TTY** (`cols` / `rows`): sanitizadas en **dos puntos** — `createSession` y `resizeTerminal`:
  ```ts
  const safeCols = Math.max(40, Math.min(300, Math.floor(Number(cols) || 80)));
  const safeRows = Math.max(10, Math.min(100, Math.floor(Number(rows) || 24)));
  ```
  Evita valores extremos que podrían corromper el TTY del contenedor.

* **Session ID:** Generado con regex `[^a-zA-Z0-9]` sobre el `socketId` para evitar inyección en el nombre del contenedor Docker:
  ```ts
  `sandbox_${isTunnel ? 'tunnel_' : 'vps_'}${socketId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}_${Date.now()}`
  ```

* **Logging de inputs:** El método `writeInput` usa `logger.debug` con solo la longitud en bytes — **nunca el contenido** — para proteger datos privados de los visitantes en los logs de PM2.

### 4.3 Ciclo de Vida y Limpieza

* Concurrencia limitada: `SANDBOX_MAX_SESSIONS=3` en VPS.
* Temporizador de advertencia: 4m 30s → evento `session-warning` al cliente.
* TTL forzado: 5m → `kill()` + `remove()` del contenedor, evento `session-expired` al cliente.
* Hook `OnModuleDestroy`: destruye todos los contenedores activos al reiniciar el proceso NestJS en PM2 (cero contenedores huérfanos).
* `destroySession`: elimina de `Map`, cancela timers, cierra el stream, ejecuta `kill()` y `remove()` con manejo de error seguro.

### 4.4 Variable de Entorno `SANDBOX_MODE` en el Contenedor

La variable es inyectada por `SandboxService` en el array `Env` al crear el contenedor:
```ts
Env: [
  `COLUMNS=${safeCols}`,
  `LINES=${safeRows}`,
  'TERM=xterm-256color',
  `SANDBOX_MODE=${effectiveMode}`,   // 'vps' | 'tunnel'
]
```

Dentro del shell del contenedor, `sandbox_profile.sh` la lee y la declara `readonly` inmediatamente:
```bash
readonly SANDBOX_MODE
```
Esto impide que un visitante la sobreescriba desde la terminal con `SANDBOX_MODE=hacked`.

---

## 5. Imagen Docker del Sandbox (`docker/`)

### 5.1 Dockerfile
* **Base:** `alpine:3.20` — imagen mínima con firma verificada.
* **Paquetes instalados:** `bash`, `coreutils`, `procps`, `htop`, `nano`, `curl`, `jq`, `git`, `tree`, `file`, `neofetch`, `ncurses`, `util-linux`.
* **Usuario:** `guest` (UID/GID 1000) — sin acceso a root ni sudo.
* **Modo de inicio:** `/bin/bash --login` — carga `/etc/profile.d/sandbox.sh` en cada sesión.

> [!NOTE]
> `curl` y `git` están presentes en la imagen para fines demostrativos (`neofetch`, `git log`). El acceso a red está bloqueado a nivel de runtime mediante `NetworkMode: 'none'`, por lo que no suponen un vector de exfiltración.

### 5.2 Perfil de Shell (`sandbox_profile.sh`)
* **Terminadores de línea:** Archivo en **LF puro** (no CRLF). Alpine Linux / Bash rechaza scripts con CRLF con error de sintaxis. Verificar con `node -e "..."` antes de reconstruir la imagen.
* **Banner dinámico por modo** — Se ramifica según `$SANDBOX_MODE`:

| Variable | Modo `vps` | Modo `tunnel` |
|----------|-----------|---------------|
| `NODE_SUBTITLE` | `Servidor Cloud en AWS (Amazon Web Services) • Entorno Aislado y Seguro` | `Servidor Físico Propio • Conexión Cifrada mediante Túnel` |
| `HOST_PROMPT` | `aws-cloud` | `servidor-local` |
| `PS1` | `guest@aws-cloud:~$` | `guest@servidor-local:~$` |
| Mensaje de bienvenida | Contexto de AWS Lightsail y aislamiento seguro | Contexto de hardware físico y túnel cifrado |

* **`ulimit` — Defensa en profundidad sobre cgroups:**
  ```bash
  ulimit -n 256        # file descriptors (por defecto: 1048576)
  ulimit -v 131072     # virtual memory 128 MB VPS / 524288 = 512 MB Tunnel
  ulimit -t 60         # cpu time 60s/proceso (bloquea loops infinitos de CPU)
  ulimit -f 40960      # tamaño de archivo máximo 20 MB
  ```
  Los `ulimit` son una segunda barrera a nivel de shell, independiente de los cgroups del contenedor.

* **`umask 077`** — Todos los archivos creados en la sesión son privados del usuario `guest` (permisos `600`). Sin archivos world-readable accidentales.

* **Historial desactivado** — Privacidad entre sesiones de visitantes distintos:
  ```bash
  export HISTFILE=/dev/null
  export HISTSIZE=0
  export HISTFILESIZE=0
  ```

* **`readonly SANDBOX_MODE`** — Impide que el visitante sobreescriba la variable desde la shell. Bash rechaza la asignación con exit code 1.

* **Protección de `/proc` sensible:** Implementada mediante `MaskedPaths` en `HostConfig` de Docker (nivel kernel, OCI spec). **No** se usan aliases de shell para esto, ya que `bash script.sh` y otros métodos eluden los aliases. Ver Sección 4.1.

* **Comandos nativos registrados en el perfil:**
  `about`, `projects`, `skills`, `architecture`, `benchmark`, `api-live`, `matrix`, `contact`, `help`.

---

## 6. Seguridad Transversal (`main.ts`, Gateways y Servicios)

### 6.1 Headers HTTP de Seguridad (`helmet`)
* **Paquete:** `helmet` instalado con `pnpm --filter backend add helmet`.
* **Configuración:** `app.use(helmet())` activado antes de cualquier ruta — emite automáticamente:
  `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `X-XSS-Protection`, `Content-Security-Policy`, `Referrer-Policy`.

### 6.2 CORS Global — Lista Blanca Explícita (`main.ts`)
* **Orígenes permitidos** (hardcodeados + env override):
  ```
  https://jorgedoicela.com
  https://portfolio.jorgedoicela.com
  https://bible.jorgedoicela.com
  https://software.jorgedoicela.com
  + localhost:3000/3001/3002 solo si NODE_ENV !== 'production'
  ```
* **Variable de entorno:** `CORS_ORIGINS` (CSV) permite override en producción sin redeploy.
* **`origin: true` eliminado** de main.ts, `portfolio.gateway.ts` y `sandbox.gateway.ts`.

### 6.3 `ValidationPipe` Global
```ts
new ValidationPipe({
  whitelist: true,             // Elimina props no declaradas en el DTO
  forbidNonWhitelisted: true,  // Rechaza petición si hay props extra → 400
  transform: true,
})
```
* Cualquier campo no declarado en el DTO devuelve `HTTP 400` en lugar de ser ignorado silenciosamente.

### 6.4 Privacidad en Logs de Gateways
* **`execute-command` (`PortfolioGateway`):** bajado a `logger.debug` — solo loguea longitud en caracteres, no el contenido del comando. Inactive en producción a menos que se configure `LOG_LEVEL=debug`.
* **`terminal-input` (`SandboxGateway`):** nunca loguea contenido — solo `logger.debug` con longitud en bytes.

### 6.5 Sanitización de `echo` contra Inyección de Terminal
* **Vector:** un visitante podía enviar `echo \x1b[2J` (clear screen), `\x1b]0;hacked\x07` (cambio de título de ventana), o secuencias de cursor repositioning.
* **Solución:** dos regexes en `portfolio.service.ts`:
  1. Elimina secuencias CSI arbitrarias (`\x1b[` + no-colores): `text.replace(/\x1b\[(?![0-9;]*m)[^a-zA-Z]*[a-zA-Z]/g, '')`.
  2. Elimina caracteres de control `[\x00-\x08\x0b\x0c\x0e-\x1a\x1c-\x1f\x7f]`.

### 6.6 Sanitización de `pty-resize` (`PortfolioGateway`)
* El evento `pty-resize` sanitiza `cols` y `rows` con los mismos rangos que `SandboxService`:
  ```ts
  Math.max(40, Math.min(300, Math.floor(Number(cols) || 80)))
  Math.max(10, Math.min(100, Math.floor(Number(rows) || 24)))
  ```

---

## 7. Endpoints REST y Modelo de Datos

### 7.1 Endpoints REST

| Dominio | Método y Ruta | Parámetros Query | Descripción |
|---|---|---|---|
| **Proyectos** | `GET /portfolio/projects` | `lang` | Catálogo de proyectos filtrables por idioma (`?lang=es\|en`) |
| | `GET /portfolio/projects/:slug` | `lang` | Detalle del proyecto por slug con soporte bilingüe |
| **Contacto** | `POST /portfolio/contact` | - | Envío y validación de formulario (`CreateContactMessageDto`) |
| | `GET /portfolio/contact` | - | Historial de mensajes para auditoría interna |
| **Sandbox** | `POST /portfolio/sandbox/wake-request` | - | Solicitud de aviso de encendido del servidor físico privado (`CreateWakeRequestDto`) con notificación a Telegram |

### 7.2 `PortfolioProjectsService` — Deserialización Nativa

> [!IMPORTANT]
> Los campos `technologies`, `architectureHighlights` y `metrics` usan `@Column({ type: 'simple-json' })` en TypeORM. **TypeORM deserializa automáticamente** estos campos a sus tipos TypeScript correctos (`string[]` y `{ label: string; value: string }[]`).
>
> **No existe ni debe existir** lógica de parseo manual con `JSON.parse()` en el servicio. Cualquier intento de reimplementarlo introduciría asignaciones `any` que ESLint (`@typescript-eslint/no-unsafe-assignment`) rechaza en el pre-commit.

### 7.3 Modelo Relacional Bilingüe (`portfolio.sqlite`)

* `portfolio_projects`:
  * `id`: PK autoincremental.
  * `slug`: Identificador URL (`string`).
  * `title`, `description`, `role`: Campos de texto estándar.
  * `technologies`: `simple-json` → `string[]`.
  * `language`: `'es'` o `'en'` (default `'es'`).
  * `repoUrl`, `demoUrl`: `string`, nullable.
  * `featured`: `boolean`.
  * `overview`, `challenge`: `text`, nullable.
  * `architectureHighlights`: `simple-json` → `string[]`, nullable.
  * `metrics`: `simple-json` → `{ label: string; value: string }[]`, nullable.
  * `orderIndex`: `integer`, default 0.
  * **Índice Único Compuesto:** `(slug, language)`.

* `contact_messages`:
  * `id`: PK autoincremental.
  * `name`, `email`, `subject`, `message`: Campos del formulario.
  * `createdAt`: Timestamp automático.
  * `read`: Estado de lectura (`boolean`).
