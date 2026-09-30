# Memoria del Proyecto — Jorge Doicela (Monorepo)

Este archivo almacena el contexto operativo, decisiones arquitectónicas consolidadas y lecciones aprendidas exclusivas del monorepo personal Jorge Doicela.

---

## 1. Decisiones Arquitectónicas Consolidadas

* **Infraestructura y Restricción de 1 GB RAM:**
  - Servidor VPS en AWS Lightsail limitado a 1 GB de RAM.
  - Runtime consolidado: Backend corre en un solo proceso NestJS (puerto `3000`), frontend corre consolidado en un solo proceso Next.js (puerto `3001`) con `middleware.ts` para resolución de subdominios.
  - Aislamiento de Cajas Negras: las 4 aplicaciones (`landing`, `portfolio`, `bible`, `software`) son 100% independientes, prohibidas las importaciones cruzadas entre dominios.
* **Gestión de Paquetes y Tipos:**
  - Monorepo pnpm: instalación obligatoria con filtro (`pnpm --filter backend add ...`, `pnpm --filter web add ...`).
  - Cero paquetes `@shared`: cada subproyecto define sus propias interfaces y tipos localmente.
* **Persistencia Aislada (SQLite):**
  - Bases independientes en `backend/data/` (`bible.sqlite`, `software.sqlite`, `portfolio.sqlite`).
  - Los archivos `.sqlite` están en `.gitignore`. Al cambiar de máquina o hacer `git pull` con cambios en corpus o entidades, es obligatorio ejecutar `pnpm seed:all`.
* **Protocolo de Diagnóstico 404:**
  - Ante errores 404 en rutas dinámicas (`/infrastructure/[slug]`, `/tutorials/[slug]`, etc.) en local, verificar primero si el registro existe en la base SQLite o ejecutar `pnpm seed:all` antes de tocar routing o middleware.

---

## 2. Historial de Decisiones y Lecciones Aprendidas

* **Tipografías Auto-Hospedadas y Portabilidad de Cajas Negras (Zero-External Network Fonts):**
  - Se eliminó la dependencia de Google Fonts en tiempo de compilación y ejecución (`next/font/google`).
  - Las tipografías residen 100% encapsuladas dentro de la carpeta de cada subproyecto en `frontend/web/src/app/(subproyecto)/fonts/`:
    - `src/app/(landing)/fonts/` (Geist Sans y Geist Mono)
    - `src/app/(portfolio)/fonts/` (Geist Sans y Geist Mono)
    - `src/app/(bible)/fonts/` (Geist Sans, Geist Mono, Lora Regular/Itálico, Frank Ruhl Libre para hebreo y Cardo para griego)
    - `src/app/(software)/fonts/` (Plus Jakarta Sans Regular/Itálico y Geist Mono para terminal y snippets)
  - Se cargan mediante `next/font/local` con ruta relativa `./fonts/...` en cada layout, inyectando las variables CSS (`--font-geist-sans`, `--font-geist-mono`, `--font-plus-jakarta-sans`, `--font-lora`, `--font-hebrew`, `--font-greek`).
  - Todas las fuentes operan bajo la **SIL Open Font License (OFL 1.1)**: 100% legal, código abierto, libre para uso comercial y auto-hospedaje sin pago de regalías ni telemetría de terceros.
  - Esto garantiza que si en el futuro se traslada cualquier subproyecto a su propio VPS o repositorio independiente, el subproyecto es 100% portable y autónomo sin requerir refactorizaciones.
