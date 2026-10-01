# Memoria del Proyecto — Jorge Doicela (Monorepo)

Este archivo almacena el contexto operativo, decisiones arquitectónicas consolidadas y lecciones aprendidas exclusivas del monorepo personal Jorge Doicela.

---

## 1. Decisiones Arquitectónicas Consolidadas

* **Infraestructura y Restricción de 1 GB RAM:**
  - Servidor VPS en AWS Lightsail limitado a 1 GB de RAM.
  - Runtime consolidado: Backend corre en un solo proceso NestJS (puerto `3000`), frontend corre consolidado en un solo proceso Next.js (puerto `3001`) con `middleware.ts` para resolución de subdominios.
  - Aislamiento de Cajas Negras: las 4 aplicaciones (`landing`, `portfolio`, `bible`, `doiceladev`) son 100% independientes, prohibidas las importaciones cruzadas entre dominios.
* **Gestión de Paquetes y Tipos:**
  - Monorepo pnpm: instalación obligatoria con filtro (`pnpm --filter backend add ...`, `pnpm --filter web add ...`).
  - Cero paquetes `@shared`: cada subproyecto define sus propias interfaces y tipos localmente.
* **Persistencia Aislada (SQLite):**
  - Bases independientes en `backend/data/` (`bible.sqlite`, `doiceladev.sqlite`, `portfolio.sqlite`).
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
    - `src/app/(doiceladev)/fonts/` (Plus Jakarta Sans Regular/Itálico y Geist Mono para terminal y snippets)
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

* **Cabecera de Perfil y Botón de Compartir en `/links` (`LinksHeader.tsx` & `ShareProfileButton`):**
  - Se eliminó la etiqueta de texto de ubicación "Quito, Ecuador" para lograr un encabezado de presentación más limpio y minimalista.
  - Se sustituyó el botón píldora con texto por un botón de solo icono SVG (`size={22}`) idéntico a los iconos sociales.
  - Integración directa y continua en la fila de acciones de `LinksHeader` con el mismo espaciado `gap-2 sm:gap-3` sin separador.
  - Mantiene feedback accesible con Web Share API, fallback de copiado al portapapeles con icono `Check` esmeralda temporal y `aria-label`/`title` dinámicos.

* **Nivelación y Expansión Vertical en `/consulta` (`consulta/page.tsx` & `ConsultaForm.tsx`):**
  - Expansión vertical del formulario mediante `items-stretch` en el grid y `h-full flex flex-col justify-between` en `BentoCard`.
  - En `ConsultaForm`, se ampliaron los espaciados (`space-y-5 sm:space-y-6`), el área de texto (`rows={6}`, `min-h-[170px]`), padding en inputs (`py-3.5 sm:py-4`) y botón prominente (`py-4 sm:py-4.5`).
  - La tarjeta del formulario equipara la altura completa de la columna izquierda (~740 px), logrando simetría bilateral impecable sin huecos vacíos.
  - Corrección de transparencia en `CustomSelect.tsx`: se erradicó la translúcidez `bg-card` (48% alfa) del menú flotante, reemplazándola por fondo 100% sólido y opaco (`bg-white dark:bg-[#14151f]`) para que el listbox oculte completamente los campos inferiores al desplegarse.
  - Depuración de copys comerciales en `/consulta` (`messages/es.json` y `en.json`): se eliminaron las menciones de "1 GB de RAM" en subtítulos, selector de servicios y pilares técnicos, reemplazándolas por "optimización cloud de alto rendimiento" y estándares de infraestructura (AWS / Docker / CI/CD).
  - Corrección de espaciado en `ConsultaForm.tsx`: se eliminó el hueco artificial entre el textarea y el botón de envío; el textarea ahora absorbe el espacio elástico con `flex-grow` y el botón queda vinculado inmediatamente con una separación armónica de `gap-5 sm:gap-6`.

* **Depuración de Textos de Infraestructura y Homologación de Carrusel (`page.tsx`, `DoiceladevSlideVisual.tsx`, `AppleHighlightsCarousel.tsx`, `es.json`, `en.json`):**
  - Se eliminaron todas las menciones a nivel de interfaz de usuario de "1 GB de RAM" (en español e inglés) en los carruseles visuales, explorador Apple, vitrina de enlaces y mensajes del asistente, sustituyéndolas por una redacción sobria y técnica enfocada en *Optimización avanzada de recursos*, *Alto rendimiento* y *Baja latencia*.
  - Se homologó `DoiceladevSlideVisual.tsx` a una estructura de 3 columnas/pilares (*IA & Razonamiento*, *Ciberseguridad*, *Tutoriales & Comunidad*) idéntica al diseño y densidad de `PortfolioSlideVisual.tsx` y `BibleSlideVisual.tsx`, eliminando además las líneas divisorias horizontales apiladas en móvil (`divide-y`) para sustituirlas por espaciado limpio (`gap-3.5 sm:gap-0 sm:divide-x`), logrando un acabado minimalista sin sobrecarga de bordes.
  - En `AppleHighlightsCarousel.tsx`, todas las tarjetas mantienen visualización limpia y nítida con opacidad uniforme (`opacity-100`), se eliminó el resaltado en hover (`hover:border-card-hover-border`) y se anuló la proyección de sombras difusas (`!shadow-none`), erradicando las sombras cruzadas que oscurecían los contornos laterales de las tarjetas vecinas.
  - En la tarjeta Bento de Filosofía de `page.tsx`, se mantuvo estrictamente el contenido original (título, cita textual y pie), centrando y distribuyendo la cita tipográfica en el espacio vertical con `my-auto py-6 sm:py-10 text-base sm:text-lg md:text-xl font-light italic leading-relaxed` sin añadir bloques ni cajas adicionales.
  - En `AppleDetailExplorer`, el botón de cierre `✕` se condicionó para renderizarse únicamente cuando hay un elemento seleccionado (`isExpanded === true`), se fijó una altura constante (`h-[125px] sm:h-[135px]`) en controles móviles, se implementó un acabado de alto contraste en la carcasa de la MacBook (grafito/negro mate `#18181b` en modo claro y blanco neutro puro `#ffffff` con borde `#e4e4e7` en modo oscuro, erradicando cualquier tinte celeste/slate), y se aisló el lienzo de la pantalla con una capa base sólida (`bg-white dark:bg-[#090a0f]`) bajo el `bg-card` translúcido para evitar mezclas cromáticas indeseadas.

* **Alineación Inline del Cursor Typewriter (`TypewriterRole.tsx`):**
  - Se eliminó el `flex items-center justify-center` del elemento `<p>`, que convertía al cursor en un flex item hermano separado. Esto provocaba que en viewport móvil, cuando el texto saltaba de renglón, el cursor quedara flotando desfasado a la derecha en lugar de acompañar la última palabra.
  - Se configuró el cursor como elemento `inline-block align-middle` dentro del flujo tipográfico natural, garantizando que el cursor se mantenga siempre al final inmediato del texto mecanografiado, incluso con saltos de línea multirrenglón.
* **Homologación de Botón de Retorno en Navbar (`LandingHeader.tsx`, `es.json`, `en.json`):**
  - Se simplificó la etiqueta `backHome` en `/consulta` y `/links`: ahora muestra concisamente `← Volver` en español y `← Back` en inglés, eliminando el texto redundante "Volver a la página principal".

* **Erradicación del Destello (Flash/FOUC) en Efectos Cósmicos (`cosmic-canvas`):**
  - Causa raíz identificada: `CinematicSpiralGalaxy`, `InteractiveParticles` y `ParallaxBackground` inicializaban un estado de React `useState(false)` para `isLight`. Durante el render inicial y hasta que terminaba la hidratación de React (~1s), se montaba el canvas de la galaxia y los gradientes oscuros de nebulosas saturadas antes de que `useEffect` detectara el modo claro.
  - Solución arquitectónica: se desacopló el control de visibilidad del estado de React y se delegó 100% al motor CSS del navegador mediante clases `hidden dark:block` y capas duales sincronizadas con `block dark:hidden` / `hidden dark:block`. De este modo, en modo claro la galaxia y las partículas tienen `display: none` instantáneo en 0 ms desde el primer frame de renderizado del navegador, sin destellos ni cambios tardíos de color.

* **Alineación y Estilo de Botones en Carrusel (`AppleHighlightsCarousel.tsx`):**
  - Se eliminó el borde superior separador (`border-t border-card-border`) que dividía el cuerpo de las tarjetas del carrusel respecto a los botones de acción ("Abrir Biblia", "Entrar a DoicelaDev", "Explorar Portafolio").
  - Los botones de acción se alinean a la derecha (`justify-end pt-2 sm:pt-3`). En móvil operan con escala intermedia calibrada (`w-full max-w-[175px] px-5 py-2.5`), logrando presencia visual equilibrada sin dominar la tarjeta, mientras que en desktop (`sm:`) mantienen sus dimensiones completas (`sm:max-w-[250px] sm:px-8 sm:py-3`).

* **Prevención de Recorte Vertical en MacBook (`AppleDetailExplorer.tsx`):**
  - Causa raíz identificada: el contenedor del inspector usaba `justify-between` con `min-h-[560px]` y la columna de la MacBook usaba `items-center` con `py-4` y `max-w-[580px]`. En viewports más compactos (o con zoom de navegador), la altura de la laptop empujaba el borde superior hacia coordenadas negativas dentro de un contenedor con `overflow-hidden`, recortando la curvatura y el bisel superior del marco.
  - Solución: se incrementó la altura mínima base (`min-h-[580px]`), se ajustó la alineación a `my-auto` en el grid, se optimizó el padding (`py-2`) y se ajustó el ancho máximo a `max-w-[530px] xl:max-w-[560px]`, garantizando un margen de respiración superior continuo en cualquier resolución o escala.

* **Homologación de Nomenclatura en Enlaces y Tarjetas (`es.json`, `en.json`, `AppleDetailExplorer.tsx`):**
  - Se simplificó la denominación del subdominio bíblico: sustituyendo "La Biblia" por "Biblia" en español y "The Bible" por "Bible" en inglés en botones de acción (`bibleTitle`), insignias de proyecto (`project1Badge`, `project1Title`) y en el explorador Apple.
  - Esto garantiza simetría y balance con las plataformas homólogas ("DoicelaDev" y "Portafolio" / "Portfolio"), eliminando artículos gramaticales superfluos.
  - En la lista de accesos directos (`actionCv`), se eliminó la sigla entre paréntesis `(CV)`, dejando limpiamente `"Descargar Currículum Vitae"` en español y `"Download Curriculum Vitae"` en inglés.

* **Calibración Visual y Espaciado en Carrusel (`BibleSlideVisual.tsx`, `PortfolioSlideVisual.tsx`, `DoiceladevSlideVisual.tsx`):**
  - Se eliminaron las líneas divisorias superiores (`border-t border-card-border`) en los bloques de columnas de las tres diapositivas del carrusel de destacados.
  - Se corrigió la causa raíz del exceso de espacio muerto en móvil ajustando la altura de las tarjetas en `AppleHighlightsCarousel.tsx` a una escala ergonómica progresiva (`h-[480px] sm:h-[500px] md:h-[520px]`), eliminando los 530 px heredados que inflaban artificialmente la tarjeta móvil.
  - En `DoiceladevSlideVisual.tsx` y `PortfolioSlideVisual.tsx`, se unificó la densidad visual y legibilidad en desktop adoptando tipografía editorial destacada en Title Case (`md:text-[17px] font-semibold sm:normal-case tracking-tight`) con separación de `sm:gap-2` y elevación simétrica (`-mt-0 sm:-mt-3 md:-mt-5`), equilibrando los espacios libres (~80 px arriba y ~80 px abajo) y logrando consistencia perceptual con `BibleSlideVisual.tsx` (desglose morfológico calibrado a `md:text-[15px]` / `md:text-[13px]`).
  - En `BibleSlideVisual.tsx`, se sincronizó el margen vertical (`-mt-3 sm:-mt-8 mb-6 sm:mb-10`) para armonizar equilibradamente con la nueva altura de 480 px.
* **Homologación Visual de Accesibilidad (`SkipToContent.tsx`):**
  - Se eliminaron las clases desfasadas y genéricas (`bg-indigo-600`, `font-mono`, `ring-white`), integrando el componente al sistema de diseño oficial de la landing.
  - Cuando recibe foco de teclado, ahora se presenta como una cápsula flotante elegante y pulida (`rounded-full bg-foreground text-background font-medium text-xs border border-card-border shadow-2xl`), manteniendo 100% el cumplimiento de accesibilidad WCAG 2.1 con estética de producto de alta gama.

* **Estandarización y Sobriedad Visual en Portadas de DoicelaDev (`frontend/web/public/doiceladev/images/covers/`):**
  - Se erradicaron los renders 3D con tipografía publicitaria gigante flotante.
  - Se homologó el estándar de sobriedad tomando la sencillez y el realismo de la portada de Infraestructura (`guia-firewall-linux-ufw.jpg`) como pauta conceptual, asignando a cada publicación un sujeto y entorno fotográfico único, tangible y directamente representativo de su temática.
* **Auditoría Exhaustiva y Erradicación de Residuos Legacy de Software:**
  - Se ejecutó una auditoría exhaustiva en la raíz con clasificación contextual por criticidad (CRITICO_ROUTING_CONFIG, ALTO_IDENTIFICADOR_CODIGO, RUTA_O_PATH, DOCS_O_CONTENIDO, OTROS_REVISAR y GENERICO_PROFESION), depurando el script buscador una vez completada la tarea para mantener limpio el repositorio.
  - Backend: corregida la ruta de corpus en `seed-doiceladev.ts` (`src/doiceladev/corpus`), identificadores de logs `[DoiceladevSeeder]`, variables en `backend/.env` local (`DATABASE_DOICELADEV_PATH`, `CORS_ORIGINS`) y `portfolio.service.ts` (comandos `open` de terminal SSH).
  - Corpus Backend: actualizados diagramas Mermaid y texto en `blog.json` (`DoiceladevMod`, `doiceladevConnection`, `doiceladev.sqlite`), `ai.json` (`doiceladev-sqlite-mcp`) y `news.json` (`revalidatePath('/doiceladev/news')`). Base `doiceladev.sqlite` re-sembrada limpiamente. Purgados binarios huérfanos `software.sqlite*` de `backend/data/`.
  - Frontend Web:
    - Tipos y constantes (`DoiceladevArticleCategory`, `DoiceladevSection`, `DOICELADEV_CATEGORY_KEYS`).
    - CSS: sustituida variable `--accent-software` por `--accent-doiceladev` en modo claro y oscuro (`globals.css`).
    - Assets públicos: `manifest.json` (`start_url: /doiceladev`, logos `/doiceladev/logo/`), `llms.txt` de doiceladev y portfolio.
    - Diccionarios i18n (`messages/{es,en}.json`): clave `"doiceladev": "DoicelaDev"` en portfolio, actualización de badges y eliminación de claves huérfanas en landing.
    - Metadatos 404 en las 8 subrutas de `(doiceladev)`, switch en `i18n/request.ts` y enlaces en footers.
  - Documentación Técnica (`docs/`): sincronizados `01_backend_y_persistencia.md`, `01_frontend_y_hub_tecnologico.md`, `01_roadmap_doiceladev.md`, `01_estandares_editoriales_y_publicaciones.md`, `01_arquitectura_macro_y_hardware.md`, `03_persistencia_local_y_sincronizacion_multiequipo.md` y `01_despliegue_pm2_y_cicd.md`.
* **Depuración Integral Definitiva de Nomenclatura DoicelaDev (Zero Legacy Residue):**
  - Se implementó en la raíz el script de auditoría exhaustiva `search-software.mjs` (posteriormente eliminado tras la verificación para mantener limpio el repositorio), corroborando cero rutas, archivos o módulos residuales con el nombre `software`.
  - Backend NestJS:
    - Corregido `backend/nest-cli.json` para compilar y observar los assets de corpus bajo `doiceladev/corpus/**/*` en lugar de la ruta legacy.
    - Actualizado dataset de proyectos en `backend/src/doiceladev/corpus/projects.json` con el slug canónico `doiceladev-hub-tecnologico` y ruta de portada `doiceladev-hub-tecnologico.jpg`.
    - Base de datos local `doiceladev.sqlite` re-sembrada y validada en 38 ms (`pnpm --filter backend seed:doiceladev`).
  - Assets Públicos e Imágenes:
    - Renombrada la única imagen física restante `software-hub-tecnologico.jpg` a `doiceladev-hub-tecnologico.jpg` en `frontend/web/public/doiceladev/images/covers/projects/`.
  - Reglas y Skills Maestras (`.agents/`):
    - `.agents/AGENTS.md`: homologadas las 4 aplicaciones (`landing`, `portfolio`, `bible`, `doiceladev`) y la regla de oro #5 con la skill `doiceladev-jorge-doicela`.
    - `.agents/skills/doiceladev-jorge-doicela/SKILL.md`: sincronización completa de rutas (`doiceladev.localhost`, `/doiceladev`), árbol de carpetas FSD, nombres de componentes (`DoiceladevCard`, `DoiceladevSelect`, `DoiceladevJsonLd`, `DoiceladevHubFeed`), orquestador `doiceladev.module.ts` y controladores `@Controller('doiceladev/...')`.
    - `.agents/skills/infraestructura-global-jorge-doicela/SKILL.md`: unificada la persistencia `'doiceladevConnection'`, comandos `pnpm seed:doiceladev` y referencias cruzadas.
    - `.agents/skills/landing-jorge-doicela/SKILL.md` y `portfolio-jorge-doicela`: erradicadas menciones de `(software)` y sustituidas por `(doiceladev)`.
  - Documentación Técnica (`docs/`):
    - Actualizados mapas Nginx, sitemaps y guías en `01_arquitectura_macro_y_hardware.md`, `02_patrones_microarquitectura_y_fsd.md`, `03_persistencia_local_y_sincronizacion_multiequipo.md`, `01_despliegue_pm2_y_cicd.md`, `01_arquitectura_y_diseno.md`, `01_frontend_y_terminal_ssh.md`, `01_backend_y_persistencia.md`.
  - Verificación Integral: `pnpm -r typecheck` validado con 0 errores en los 3 proyectos del monorepo (`backend`, `frontend/mobile`, `frontend/web`).
  - Auditoría y Limpieza en Producción (AWS Lightsail): ejecutado escaneo forense con `find`, eliminados los 6 directorios/archivos huérfanos residuales en el VPS (`docs/05-software`, `skills/software-*`, `public/software`, `(software)`, `SoftwareSlideVisual.tsx`, y carátula legacy); corroborado estado con 0 resultados residuales y servicios online en PM2.




