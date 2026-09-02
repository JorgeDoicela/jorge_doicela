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
│   └── portfolio-projects.controller.ts # Endpoint REST GET /portfolio/projects y /:slug
├── events/
│   └── contact-message-created.event.ts # Evento de dominio desacoplado
├── listeners/
│   └── telegram-notification.listener.ts # Listener asíncrono que procesa el evento y despacha a Telegram
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
    └── create-contact-message.dto.ts # DTO blindado con @MaxLength y validaciones estrictas
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
> Todas las capas de seguridad se aplican en **ambos modos** (`vps` y `tunnel`). La única diferencia entre modos es la cuota de hardware.

| Capa | Mecanismo | VPS (AWS) | Tunnel (On-Premises) |
|------|-----------|-----------|----------------------|
| **cgroups — Memoria** | `Memory + MemorySwap` | 64 MB | 256 MB |
| **cgroups — CPU** | `NanoCpus` | 0.25 vCPU | 1.0 vCPU |
| **Anti-Forkbomb** | `PidsLimit` | 50 | 100 |
| **Zero-Root** | Usuario `guest` UID/GID 1000, `CapDrop: ['ALL']`, `no-new-privileges:true` | ✅ | ✅ |
| **Filesystem Inmutable** | `ReadonlyRootfs: true` | ✅ | ✅ |
| **Áreas Escribibles** | `/home/guest` tmpfs `noexec,nosuid` | 15 MB | 15 MB |
| **Temp Aislado** | `/tmp` tmpfs `noexec,nosuid` | 10 MB | 10 MB |
| **Aislamiento de Red** | `NetworkMode: 'none'` | ✅ | ✅ |
| **Auto-destrucción** | `AutoRemove: true` | ✅ | ✅ |

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
* **Terminadores de línea:** Archivo en **LF puro** (no CRLF). Alpine Linux / Bash rechaza scripts con CRLF con error de sintaxis. Verificar con `node -e "..." ` antes de reconstruir la imagen.
* **Banner dinámico por modo** — Se ramifica según `$SANDBOX_MODE`:

| Variable | Modo `vps` | Modo `tunnel` |
|----------|-----------|---------------|
| `NODE_SUBTITLE` | `Servidor Cloud en AWS (Amazon Web Services) • Entorno Aislado y Seguro` | `Servidor Físico On-Premises • Conexión Cifrada mediante Túnel` |
| `HOST_PROMPT` | `aws-cloud` | `servidor-local` |
| `PS1` | `guest@aws-cloud:~$` | `guest@servidor-local:~$` |
| Mensaje de bienvenida | Contexto de AWS Lightsail y aislamiento seguro | Contexto de hardware físico y túnel cifrado |

* **Historial desactivado** — Privacidad entre sesiones de visitantes distintos:
  ```bash
  export HISTFILE=/dev/null
  export HISTSIZE=0
  export HISTFILESIZE=0
  ```
* **Comandos nativos registrados en el perfil:**
  `about`, `projects`, `skills`, `architecture`, `benchmark`, `api-live`, `matrix`, `contact`, `help`.

---

## 6. Endpoints REST y Modelo de Datos

### 6.1 Endpoints REST

| Dominio | Método y Ruta | Parámetros Query | Descripción |
|---|---|---|---|
| **Proyectos** | `GET /portfolio/projects` | `lang` | Catálogo de proyectos filtrables por idioma (`?lang=es\|en`) |
| | `GET /portfolio/projects/:slug` | `lang` | Detalle del proyecto por slug con soporte bilingüe |
| **Contacto** | `POST /portfolio/contact` | - | Envío y validación de formulario (`CreateContactMessageDto`) |
| | `GET /portfolio/contact` | - | Historial de mensajes para auditoría interna |

### 6.2 `PortfolioProjectsService` — Deserialización Nativa

> [!IMPORTANT]
> Los campos `technologies`, `architectureHighlights` y `metrics` usan `@Column({ type: 'simple-json' })` en TypeORM. **TypeORM deserializa automáticamente** estos campos a sus tipos TypeScript correctos (`string[]` y `{ label: string; value: string }[]`).
>
> **No existe ni debe existir** lógica de parseo manual con `JSON.parse()` en el servicio. Cualquier intento de reimplementarlo introduciría asignaciones `any` que ESLint (`@typescript-eslint/no-unsafe-assignment`) rechaza en el pre-commit.

### 6.3 Modelo Relacional Bilingüe (`portfolio.sqlite`)

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
