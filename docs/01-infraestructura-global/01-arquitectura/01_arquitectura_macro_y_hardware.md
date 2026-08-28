# Arquitectura Macro y Restricción de Hardware

Este documento detalla la arquitectura de alto nivel (macroarquitectura) del ecosistema completo de **Jorge Doicela** (`jorgedoicela.com` y sus subdominios asociados), la topología de red, el diseño del monorepo, la consolidación física de runtimes y los componentes transversales del sistema.

---

## 1. Visión Global y Filosofía Arquitectónica

El proyecto está diseñado como un ecosistema modular compuesto por **cuatro aplicaciones totalmente independientes**:
1. **Landing Page** (`jorgedoicela.com`): Portal de bienvenida y presentación general.
2. **Portafolio Profesional** (`portfolio.jorgedoicela.com`): Portafolio interactivo con terminal SSH virtual en tiempo real.
3. **Biblia Modular** (`bible.jorgedoicela.com`): Lector y suite exegética con análisis morfológico y multiversión.
4. **Software** (`software.jorgedoicela.com`): Plataforma de contenidos, noticias, blog, foros, IA, ciberseguridad, tutoriales y catálogo de proyectos.

### 1.1 La Regla de Oro: Aislamiento Lógico vs. Consolidación Física
> [!IMPORTANT]
> **Justificación de Hardware en Producción (VPS de 1 GB de RAM en AWS Lightsail):**
> Las 4 aplicaciones son **cajas negras conceptualmente aisladas que no deben conocerse entre sí**. 
> La única razón por la que el backend corre consolidado en un solo proceso NestJS (puerto `3000`) y el frontend web corre unificado en un solo proceso Next.js (puerto `3001`) es la restricción física de **1 GB de memoria RAM** en el servidor de producción. 
> Ejecutar 4 procesos de Node.js individuales agotaría la memoria de inmediato. Se unifican en tiempo de ejecución por optimización de recursos físicos, pero su arquitectura interna garantiza que cualquier subproyecto pueda ser extraído a un servidor o repositorio independiente de forma instantánea sin requerir refactorizaciones.

---

## 2. Topología de Red y Enrutamiento Perimetral

```text
                                [ Usuario en Internet ]
                                           │
                                           v (HTTPS / DNS Proxy Naranja)
                                   [ Cloudflare Edge ]
                                     - Anti-DDoS / WAF
                                     - Full (Strict) SSL/TLS
                                     - CDN Edge Caching
                                           │
                                           v (Túnel SSL / Authenticated Origin Pulls)
                           [ Nginx Reverse Proxy (Puerto 443) ]
                             - Debian 13 (AWS Lightsail)
                             - Compresión Gzip / Brotli
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                v                                                     v
     [ Next.js SSR (Puerto 3001) ]                           [ NestJS (Puerto 3000) ]
     (Enrutador de Subdominios)                                (Monolito Modular)
        ├── (landing)   -> jorgedoicela.com                       ├── /portfolio -> portfolio.sqlite
        ├── (portfolio) -> portfolio.*                            ├── /bible     -> bible.sqlite
        ├── (bible)     -> bible.*                                └── /software  -> software.sqlite
        └── (software)  -> software.*
```

### 2.1 Flujo de Peticiones y Seguridad Perimetral
1. **Cloudflare Edge (Proxy DNS):** Oculta la dirección IP pública real del VPS de AWS Lightsail. Administra la terminación SSL con modo *Full (Strict)* y mitiga ataques DDoS.
2. **Authenticated Origin Pulls (mTLS):** Nginx en el VPS solo acepta peticiones HTTPS firmadas criptográficamente por la CA de Cloudflare (`cloudflare.crt`), bloqueando cualquier conexión directa a la IP del servidor.
3. **Distribución Interna en Nginx:**
   * Rutas `/portfolio/*`, `/bible/*`, `/software/*` y `/socket.io/*` $\rightarrow$ Proxy inverso al backend NestJS (`http://127.0.0.1:3000`).
   * Rutas raíz y páginas de subdominios $\rightarrow$ Proxy inverso al frontend Next.js (`http://127.0.0.1:3001`).
   * Recursos estáticos clave (`/llms.txt`, `/manifest.json`, `/_next/static/`) $\rightarrow$ Servidos directamente por Nginx desde disco en < 1 ms con caché, garantizando 0 MB de consumo de RAM en Node.js frente a crawlers de IA (GEO / Generative Engine Optimization).

---

## 3. Estructura del Monorepo (pnpm Workspaces)

```text
jorge_doicela/ (Monorepo)
├── package.json              # Configuración maestra de Workspaces
├── pnpm-workspace.yaml       # Declaración de paquetes locales
├── pm2.config.js             # Orquestación de procesos PM2 en producción
│
├── docs/                     # Documentación técnica modularizada por dominio
│   ├── 01-infraestructura-global/
│   ├── 02-landing/
│   ├── 03-portfolio/
│   ├── 04-bible/
│   └── 05-software/
│
├── backend/                  # Servidor consolidado NestJS 11 (Puerto 3000)
├── frontend/
│   ├── web/                  # Servidor consolidado Next.js 16 (Puerto 3001)
│   └── mobile/               # App móvil independiente Expo / React Native
```

### 3.1 El Comando de Oro (`pnpm --filter`)
Para asegurar que las dependencias pertenezcan estrictamente al subproyecto correspondiente y no ensucien la raíz:
```bash
pnpm --filter backend add <libreria>    # Dependencia del Backend
pnpm --filter web add <libreria>        # Dependencia del Frontend Web
pnpm --filter mobile add <libreria>     # Dependencia de la App Móvil
```

### 3.2 Cero Paquetes `@shared` y Contratos Duplicados
Las interfaces de datos de TypeScript se definen por duplicado tanto en el backend como en el frontend. Esto garantiza que cada subproyecto viaje con sus propios contratos completos cuando se extraiga a un nuevo repositorio.

---

## 4. Componentes y Middlewares Globales del Backend (`src/common/`)

El backend de NestJS estandariza el comportamiento transversal de todos los módulos:
* **Filtro de Excepciones Global (`GlobalExceptionFilter`):** Captura todas las excepciones estándar y devuelve respuestas JSON uniformes, eliminando bloques `try/catch` manuales en controladores.
* **Interceptor de Transformación (`TransformInterceptor`):** Unifica el payload de salida en `{ success: true, data: ... }`.
* **Pipe de Validación Global (`ValidationPipe`):** Configurado con `whitelist: true` y `transform: true` para sanear y transformar DTOs automáticamente.
* **Logging Asíncrono con Pino (`nestjs-pino`):** JSON estructurado a `stdout` sin bloquear el Event Loop. En local utiliza `pino-pretty`.
* **Compresión Gzip/Brotli:** Middleware `compression()` para reducir el tamaño de respuestas JSON en un 70%.
* **Comunicación Desacoplada por Eventos:** Si dos módulos requieren interactuar internamente, lo hacen mediante `@nestjs/event-emitter`.

---

## 5. Archivos Compartidos del Frontend (Diseño "Migration-Ready")

Aunque el frontend Next.js corre en un solo proceso consolidado, los 3 archivos que hoy son transversales han sido **estructurados para que la migración de cualquier proyecto sea una operación quirúrgica sin residuos**.

### 5.1 `src/app/sitemap.ts` — Bloques Aislados por Proyecto

Cada proyecto define sus propias rutas en una constante independiente (`landingRoutes`, `portfolioRoutes`, `softwareRoutes`, `bibleRoutes`). El `return` final las concatena. Al migrar un proyecto a servidor propio, **se copia solo su constante** al nuevo `sitemap.ts` y se borra del original.

### 5.2 `src/app/robots.ts` — Guía de Migración Inline

Las reglas de bots son universales y comparte configuración. El comentario inline documenta exactamente qué cambiar en la propiedad `sitemap` para apuntar al nuevo servidor (`https://software.jorgedoicela.com/sitemap.xml`).

### 5.3 `src/middleware.ts` — Bloques Etiquetados por Subdominio

Cada subdominio (`portfolio.`, `bible.`, `software.`) está en su propio bloque etiquetado. Al migrar un proyecto, se **elimina su bloque** de este archivo. La landing no necesita bloque porque es la ruta raíz por defecto.

```
// ── PORTFOLIO ── Al migrar: eliminar este bloque
// ── BIBLE ────── Al migrar: eliminar este bloque
// ── SOFTWARE ─── Al migrar: eliminar este bloque
// ── LANDING ──── No tiene bloque; es la raíz por defecto
```

> [!TIP]
> La estructura de **assets públicos** (`public/landing/`, `public/portfolio/`, etc.) y las **bases de datos SQLite** (`portfolio.sqlite`, `bible.sqlite`, `software.sqlite`) ya son 100% portables sin modificación alguna.
