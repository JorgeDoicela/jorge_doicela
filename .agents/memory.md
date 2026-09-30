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

* **Cabecera Dinámica Auto-Hide en Landing (`useLandingHeaderScroll`):**
  - Implementación con aceleración de hardware en `frontend/web/src/app/(landing)/widgets/landing-header/hooks/useLandingHeaderScroll.ts`.
  - Cinemática de profundidad GPU: duración de 500 ms con curva elástica Apple/Geist (`cubic-bezier(0.16,1,0.3,1)`), micro-escala (`scale-[0.98]`) y desenfoque sutil (`blur-[4px]`) al ocultarse hacia `-translate-y-12 sm:-translate-y-14`.
  - Umbrales calibrados para experiencia natural: zona de reposo incondicional de 80 px en el tope, umbral descendente deliberado de 100 px para evitar desapariciones precipitadas, y umbral reactivo ascendente de 25 px.
  - Sincronización a 60/120 FPS con `{ passive: true }` y `requestAnimationFrame`, inmunidad contra iOS rubber-banding y desactivación de `pointer-events` en estado oculto para prevenir clics fantasma.

* **Ajuste Móvil en Inspector Apple (`AppleDetailExplorer`):**
  - Se eliminó el `justify-between` con `min-h-[520px]` forzado en viewport móvil que dispersaba la laptop al tope y enviaba las tarjetas descriptivas al fondo.
  - Centrado vertical armónico y aire visual calibrado con `gap-7 sm:gap-8` (28px a 32px) y `min-h-0 sm:min-h-[480px]`.
  - Integración de padding de seguridad (`px-5 sm:px-6` y flechas en `left-0` / `right-0`) en el bocadillo de texto para erradicar la superposición de los botones circulares táctiles sobre las palabras.

* **Homologación de Botón de Compartir Perfil en `/links` (`ShareProfileButton`):**
  - Se sustituyó el botón píldora con texto por un botón de solo icono SVG (`size={22}`) idéntico a los iconos sociales.
  - Integración directa y continua en la fila de acciones de `LinksHeader` con el mismo espaciado `gap-2 sm:gap-3` sin separador.
  - Mantiene feedback accesible con Web Share API, fallback de copiado al portapapeles con icono `Check` esmeralda temporal y `aria-label`/`title` dinámicos.

