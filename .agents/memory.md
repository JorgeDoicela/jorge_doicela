# Memoria del Proyecto — Jorge Doicela (Monorepo)

Este archivo almacena el contexto operativo, decisiones arquitectónicas consolidadas y lecciones aprendidas exclusivas del monorepo personal Jorge Doicela.

---

## 1. Decisiones Arquitectónicas Consolidadas

* **Infraestructura y Restricción de 1 GB RAM:**
  - Servidor VPS en AWS Lightsail limitado a 1 GB de RAM.
  - Runtime consolidado: Backend corre en un solo proceso NestJS (puerto `3000`), frontend corre consolidado en un solo proceso Next.js (puerto `3001`) con `middleware.ts` para resolución de subdominios.
  - Aislamiento de Cajas Negras: las 4 aplicaciones (`landing`, `portfolio`, `kartex`, `doiceladev`) son 100% independientes, prohibidas las importaciones cruzadas entre dominios.
* **Gestión de Paquetes y Tipos:**
  - Monorepo pnpm: instalación obligatoria con filtro (`pnpm --filter backend add ...`, `pnpm --filter web add ...`).
  - Cero paquetes `@shared`: cada subproyecto define sus propias interfaces y tipos localmente.
* **Persistencia Aislada (SQLite):**
  - Bases independientes en `backend/data/` (`kartex.sqlite`, `doiceladev.sqlite`, `portfolio.sqlite`).
  - Los archivos `.sqlite` están en `.gitignore`. Al cambiar de máquina o hacer `git pull` con cambios en corpus o entidades, es obligatorio ejecutar `pnpm seed:all`.
* **Protocolo de Diagnóstico 404:**
  - Ante errores 404 en rutas dinámicas (`/infrastructure/[slug]`, `/tutorials/[slug]`, etc.) en local, verificar primero si el registro existe en la base SQLite o ejecutar `pnpm seed:all` antes de tocar routing o middleware.

---

* **Auditoría Integral y Corrección de KARTEX post-refactorización:**
  - Sincronización de rutas canónicas en `sitemap.ts`: se actualizaron las URLs a la estructura canónica `/study/standard`, `/study/parallel`, `/study/interlinear`, `/study/word-study`, `/study/atlas`, `/study/timeline`, `/study/archaeology`, `/study/evangelism`, eliminando endpoints obsoletos (`/reader`, `/lexicon`, `/exegesis`).
  - Navegación reactiva en `KartexNavigationSidebar`: se corrigió el enlace al lector para enviar `book.id` en lugar de `book.abbreviation`, y en `KartexPassageContext` se sincronizó reactivamente el estado ante mutaciones de `searchParams` en cliente tanto para IDs numéricos como para abreviaturas canónicas.
  - Adaptabilidad de `studyUrl` en Landing de Kartex: resolución dinámica de rutas (`/study` en subdominio y `/kartex/study` en desarrollo local directo) para prevenir fallos 404 durante pruebas locales.
  - Conexión reactiva de `StudySidePanel`: se corrigió la causa raíz por la cual los paneles laterales izquierdo y derecho no aparecían en módulos como `word-study`, `atlas`, `timeline`, `archaeology`, etc. Los sidebars/inspectors no pasaban `isOpen` ni `onClose` explícitamente y `StudySidePanelRoot` caía en `isOpen = false` por defecto. Se dotó a `StudySidePanelRoot` de consumo reactivo automático de `useKartexPassageSafe()` (`isLeftSidebarOpen` / `isRightInspectorOpen`, ancho, redimensionamiento y colapso), e inicialización en `true` para pantallas de escritorio.
  - Validación de paridad REST backend: todos los endpoints bajo `/api/kartex/*` y TypeORM SQLite WAL (`kartex.sqlite`) verificados y certificados con `pnpm seed:kartex` y compilación de producción exitosa en Next.js (`pnpm --filter web build`).

* **Auditoría Integral de DOICELADEV (Backend, Base de Datos, i18n y Frontend):**
  - Corrección de `tutorials.json` (adición del campo obligatorio `category: "web"` en registros de corpus) y resolución de tipado estricto en `ForumReplyForm.tsx` (`ForumReply` retornado por la API en vez de `ForumTopic`).
  - Verificación y aprovisionamiento limpio de `doiceladev.sqlite` mediante `pnpm seed:doiceladev` ejecutado con éxito en 324 ms.
  - Validación REST exhaustiva: comprobación de disponibilidad HTTP 200 en los 10 endpoints de DoicelaDev (`/api/doiceladev/portal`, `/tutorials`, `/tutorials/categories`, `/blog`, `/news`, `/projects`, `/forum`, `/ai`, `/cybersecurity`, `/infrastructure`, `/glossary`) y verificación de resolución por slug individual (`/tutorials/[slug]`, `/cybersecurity/[slug]`, `/forum/[slug]`, `/glossary/[slug]`).
  - Auditoría i18n completa: 390 claves en español y 390 claves en inglés verificadas en paridad 1:1, y escaneo de 139 archivos `.tsx`/`.ts` en `frontend/web/src/app/(doiceladev)` con 0 errores de namespace o claves faltantes.
  - Compilación de producción Next.js 16 (`pnpm --filter web build`) finalizada con código 0 y las 31 rutas optimizadas correctamente.

* **Resolución Declarativa de Subproyectos en Localhost (`middleware.ts`):**
  - Causa raíz identificada: En desarrollo local (`localhost:3001` sin subdominios DNS virtuales), los componentes de UI generan enlaces canónicos de subdominio (ej. `/study/parallel`, `/tutorials`, `/news`, `/sandbox`). Al no haber subdominio en el host, Next.js interpretaba que pertenecían al grupo `(landing)` arrojando errores `404 Not Found`.
  - Solución arquitectónica: Se implementó `LOCALHOST_ROUTE_MAP` en `middleware.ts` para mapear limpiamente las rutas de cada proyecto hacia su carpeta física (`/study` -> `/kartex/study`, `/tutorials` -> `/doiceladev/tutorials`, `/sandbox` -> `/portfolio/sandbox`, etc.) cuando `matchedSubdomain` no está presente.
  - En producción (AWS Lightsail con subdominios `*.jorgedoicela.com`), el bloque opera de forma 100% transparente sin afectar el enrutamiento nativo por subdominio.
  - Verificación: 17 rutas canónicas y 8 rutas dinámicas `[slug]` probadas vía HTTP en `localhost:3001` con respuesta `200 OK` en todas.


## 2. Historial de Decisiones y Lecciones Aprendidas

* **Tipografías Auto-Hospedadas y Portabilidad de Cajas Negras (Zero-External Network Fonts):**
  - Se eliminó la dependencia de Google Fonts en tiempo de compilación y ejecución (`next/font/google`).
  - Las tipografías residen 100% encapsuladas dentro de la carpeta de cada subproyecto en `frontend/web/src/app/(subproyecto)/fonts/`:
    - `src/app/(landing)/fonts/` (Geist Sans y Geist Mono)
    - `src/app/(portfolio)/fonts/` (Geist Sans y Geist Mono)
    - `src/app/(kartex)/fonts/` (Geist Sans, Geist Mono, Lora Regular/Itálico, Frank Ruhl Libre para hebreo y Cardo para griego)
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
  - Solución arquitectónica: se desacopló el control de visibilidad del estado de React y se delegó 100% al renderizador CSS del navegador mediante clases `hidden dark:block` y capas duales sincronizadas con `block dark:hidden` / `hidden dark:block`. De este modo, en modo claro la galaxia y las partículas tienen `display: none` instantáneo en 0 ms desde el primer frame de renderizado del navegador, sin destellos ni cambios tardíos de color.

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
* **Normalización Léxica Editorial y Arquitectónica (Erradicación Total de 'Motor' y 'Hub'):**
  - Término 'Motor': Erradicado en su totalidad de interfaces, manifiestos PWA, diccionarios de i18n, datasets de corpus y documentación técnica, sustituyéndolo según contexto por 'módulo', 'herramienta', 'suite' o 'aplicación' (ej. 'Módulo de Estudio Exegético', 'Módulo de Navegación').
  - Término 'Hub': Erradicado integralmente a nivel visual, editorial y de código fuente:
    - Frontend: Renombrada la entidad `entities/hub` a `entities/portal`, el hook `useDoiceladevHub` a `useDoiceladevPortal`, el componente `DoiceladevHubFeed` a `DoiceladevPortalFeed`, y actualizados todos los widgets consumidores (`PopularTagsSidebarCard`, `ExploreTopicsSidebarCard`, `FeaturedPostsSidebarCard`, `FeaturedCarousel`, `SpotlightContext` y `doiceladev/page.tsx`).
    - Backend: Renombrado el submódulo `src/doiceladev/hub` a `src/doiceladev/portal`, su controlador a `PortalController` con ruta `@Controller('doiceladev/portal')`, su servicio a `PortalService`, DTOs a `PortalResponseDto` / `GetPortalQueryDto`, y registrado en `DoiceladevModule` como `PortalModule`.
    - Documentación Técnica: Renombrado `docs/05-doiceladev/01-frontend/01_frontend_y_hub_tecnologico.md` a `01_frontend_y_portal_tecnologico.md` y actualizados árboles FSD y endpoints en `README.md` y `docs/`.
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
    - Actualizado dataset de proyectos en `backend/src/doiceladev/corpus/projects.json` con el slug canónico `doiceladev-plataforma-tecnologica` y ruta de portada `doiceladev-plataforma-tecnologica.jpg`.
    - Base de datos local `doiceladev.sqlite` re-sembrada y validada en 38 ms (`pnpm --filter backend seed:doiceladev`).
  - Assets Públicos e Imágenes:
    - Renombrada la imagen física de portada a `doiceladev-plataforma-tecnologica.jpg` en `frontend/web/public/doiceladev/images/covers/projects/`.
  - Reglas y Skills Maestras (`.agents/`):
    - `.agents/AGENTS.md`: homologadas las 4 aplicaciones (`landing`, `portfolio`, `bible`, `doiceladev`) y la regla de oro #5 con la skill `doiceladev-jorge-doicela`.
    - `.agents/skills/doiceladev-jorge-doicela/SKILL.md`: sincronización completa de rutas (`doiceladev.localhost`, `/doiceladev`), árbol de carpetas FSD, nombres de componentes (`DoiceladevCard`, `DoiceladevSelect`, `DoiceladevJsonLd`, `DoiceladevHubFeed`), orquestador `doiceladev.module.ts` y controladores `@Controller('doiceladev/...')`.
    - `.agents/skills/infraestructura-global-jorge-doicela/SKILL.md`: unificada la persistencia `'doiceladevConnection'`, comandos `pnpm seed:doiceladev` y referencias cruzadas.
    - `.agents/skills/landing-jorge-doicela/SKILL.md` y `portfolio-jorge-doicela`: erradicadas menciones de `(software)` y sustituidas por `(doiceladev)`.
  - Documentación Técnica (`docs/`):
    - Actualizados mapas Nginx, sitemaps y guías en `01_arquitectura_macro_y_hardware.md`, `02_patrones_microarquitectura_y_fsd.md`, `03_persistencia_local_y_sincronizacion_multiequipo.md`, `01_despliegue_pm2_y_cicd.md`, `01_arquitectura_y_diseno.md`, `01_frontend_y_terminal_ssh.md`, `01_backend_y_persistencia.md`.
  - Verificación Integral: `pnpm -r typecheck` validado con 0 errores en los 3 proyectos del monorepo (`backend`, `frontend/mobile`, `frontend/web`).
  - Auditoría y Limpieza en Producción (AWS Lightsail): ejecutado escaneo forense con `find`, eliminados los 6 directorios/archivos huérfanos residuales en el VPS (`docs/05-software`, `skills/software-*`, `public/software`, `(software)`, `SoftwareSlideVisual.tsx`, y carátula legacy); corroborado estado con 0 resultados residuales y servicios online en PM2.
  - Auditoría de Arquitectura FSD y Cajas Negras (DoicelaDev):
    - Aislamiento de dominio absoluto: 0 importaciones cruzadas (cross-imports) entre `(doiceladev)` y `(kartex)`, `(portfolio)` o `(landing)` en frontend y backend.
    - Jerarquía FSD unidireccional estricta: se eliminó la única violación en `shared/markdown` elevando la interfaz `GlossaryTerm` a `shared/types/glossary.ts` y re-exportando desde `entities/glossary`, alcanzando 0 violaciones de capa en las 6 capas de FSD.
    - Backend NestJS: 100% de servicios inyectan `@InjectRepository(Entity, 'doiceladevConnection')` y preservan las 3 capas canónicas (Controladores, Servicios de Dominio, Entidades TypeORM / DTOs).
* **Auditoría Integral de Bilingüismo (i18n ES/EN) y Erradicación de Cadenas Hardcodeadas:**
  - Paridad de Diccionarios al 100%: verificado con script automatizado que las 4 aplicaciones del monorepo (`doiceladev`: 388/388, `landing`: 164/164, `portfolio`: 228/228, `kartex`: 845/845) poseen simetría idéntica y 0 claves huérfanas entre `messages/es.json` y `messages/en.json`.
  - Frontend DoicelaDev:
    - Los 76 componentes TSX fueron analizados exhaustivamente: 0 cadenas de texto literales quemadas en la interfaz de usuario.
    - Las 8 subrutas de catálogo (`page.tsx`) y los 8 lectores dinámicos (`[slug]/page.tsx`) delegan 100% sus textos en `useTranslations`/`getTranslations` y consumen el backend de forma localizada mediante `?lang=${locale}`.
    - Todos los hooks de datos y categorías en `entities/` (`useNews`, `useNewsCategories`, `useTutorials`, `useProjects`, `useInfrastructure`, `useForum`, `useCybersecurity`, `useBlog`, `useAi`, `useDoiceladevPortal`) consumen y reaccionan dinámicamente a `useLocale()`.
    - Homologado el imagotipo en `DoiceladevHeaderNav.tsx` para usar `alt={tNav('headerLogoAlt')}` en modo claro y oscuro.
  - Frontend Landing y Portfolio:
    - Enriquecido `LandingHeader.tsx` con `useLanguage()` para hacer bilingües los atributos accesibles `aria-label` y etiquetas de retorno a inicio según el idioma activo (`language === 'es' ? ... : ...`).
  - Backend NestJS (DoicelaDev):
    - Las 9 entidades TypeORM poseen columna `language` e índices compuestos (`['slug', 'language']`).
    - Los datasets semilla en `backend/src/doiceladev/corpus/*.json` cuentan con versiones simétricas completas `{ es: 1, en: 1 }` (y 34 términos en `glossary.json`: 17 ES / 17 EN).
  - Verificación de Tipos: `pnpm -r typecheck` validado con 0 errores en los 3 proyectos del monorepo (`backend`, `frontend/mobile`, `frontend/web`).
* **Auditoría Arquitectónica FSD, NestJS y Principio de Cajas Negras (DoicelaDev Post-Renombramiento):**
  - Principio de Cajas Negras (Domain Isolation):
    - Cero importaciones cruzadas (0 cross-imports) desde `(doiceladev)` hacia `(landing)`, `(portfolio)` o `(kartex)` tanto en frontend como en backend.
    - Cero importaciones de otros dominios hacia código interno de `(doiceladev)`.
  - Feature-Sliced Design (FSD Canónico en 6 Capas):
    - Escaneo automatizado de dependencias sobre los 139 archivos de `(doiceladev)`: **0 violaciones de jerarquía unidireccional de capas**. Ninguna capa inferior importa de una capa superior (`shared` -> `entities` -> `features` -> `widgets` -> `pages` -> `app`).
    - Cero acoplamiento cruzado en `features/` (0 cross-feature imports).
    - Tipado puro en `entities/portal/types.ts` mediante `import type` para todas las entidades agregadas.
  - Backend NestJS (3 Capas Canónicas):
    - Submódulos verticales estructurados con estricta separación: Controladores (`@Controller('doiceladev/...')`), Servicios de Dominio (`@Injectable()`) y Capa de Datos (Entidades TypeORM + DTOs).
    - 100% de los repositorios inyectados (11/11) utilizan `@InjectRepository(Entity, 'doiceladevConnection')`, garantizando aislamiento físico en `doiceladev.sqlite`.
    - Orquestador `DoiceladevModule` registra las 11 entidades y los 10 submódulos con optimizaciones SQLite para VPS 1 GB RAM (WAL, cache_size 20MB, pragmas de alto rendimiento).
  - Verificación de Calidad: `pnpm -r typecheck` y `pnpm run lint` superados con 0 errores.
* **Auditoría y Erradicación Total de Cadenas Hardcodeadas en los 4 Dominios (i18n /goal):**
  - Se realizó una auditoría forense integral sobre todo el monorepo para certificar que el software respeta el esquema de internacionalización Inglés/Español sin textos quemados (hardcoded).
  - Paridad de Diccionarios 1:1:
    - `(doiceladev)`: 390/390 claves simétricas. Se agregaron `Spotlight.commandPalette` y `ArticleLayout.breadcrumb`, erradicando los últimos atributos estáticos.
    - `(landing)`: 172/172 claves simétricas. Se internacionalizaron `AppleDetailExplorer.tsx` y `LinksAiAssistant.tsx`.
    - `(portfolio)`: 232/232 claves simétricas. Se internacionalizaron `ProjectDetailModal.tsx`, `ProjectShowcase.tsx` y `portfolio/page.tsx`.
    - `(kartex)`: 920/920 claves simétricas. Se incorporaron 75+ nuevas claves cubriendo la totalidad de inspectores, barras laterales, herramientas del lector, carruseles y secciones de landing.
  - Saneamiento Exhaustivo en `(kartex)`:
    - Inspectores y Paneles: `ArchaeologyInspector`, `ArchaeologySidebar`, `AtlasInspector`, `AtlasSidebar`, `InteractiveMapCanvas`, `EvangelismInspector`, `EvangelismSidebar`, `InterlinearInspector`, `InterlinearSidebar`, `WordStudyInspector`, `WordStudySidebar`, `ParallelDiffInspector`, `ParallelSidebar`, `ParallelViewGrid`, `TimelineInspector`, `TimelineSidebar`, `BibleNavigationSidebar`.
    - Lector y Navegación: `ChapterNavigator`, `ReaderToolbar`, `VerseList`, `ThemeToggle`.
    - Landing de la Biblia: `BibleCorpusVersionsSection`, `BibleEnginesCarousel`, `BibleMobileAppSection`, `BiblePurposeSection`.
  - Verificación de Calidad y Cero Textos Residuales:
    - Escaneo profundo con script automatizado: **0 atributos ni textos sospechosos con tildes/ñ quemados en los 4 dominios**.
    - Compilación estricta TypeScript: `pnpm --filter web typecheck` (código 0) y `pnpm --filter backend build` (código 0).
    - Principio de cajas negras y arquitectura de 1 GB RAM preservados al 100%.
* **Transición Arquitectónica Integral a KARTEX (`kartex`):**
  - Renombramiento de marca e infraestructura del subproyecto bíblico:
    - Nombre de Marca: **KARTEX** (`kartex`).
    - Taglines: *KARTEX · Plataforma de Investigación y Estudio Bíblico* (ES) / *KARTEX · Biblical Research & Study Platform* (EN).
    - Módulos especializados bilingües: Kartex Interlineal, Kartex Atlas, Kartex Lexicón, Kartex Evangelismo, Kartex Exégesis, Kartex Cronología, Kartex Arqueología, Kartex Paralelo, Kartex Lector.
  - Frontend Web Next.js 16 (FSD):
    - Grupo de rutas renombrado a `frontend/web/src/app/(kartex)`.
    - Subrutas internas migradas a `/(kartex)/kartex` (`/study/standard`, `/study/parallel`, `/study/atlas`, etc.).
    - Diccionarios `(kartex)/messages/{es,en}.json` con paridad 1:1 (920 claves).
    - Componentes de SEO y UI: `KartexJsonLd.tsx`, `KartexLogo.tsx`, `BackToKartexButton.tsx`, `KartexNavigationSidebar`.
  - Backend NestJS 11 y Persistencia:
    - Módulo renombrado a `backend/src/kartex/` (`KartexModule`), registrado en `app.module.ts`.
    - Persistencia SQLite en `backend/data/kartex.sqlite` bajo la conexión `'kartexConnection'`.
    - Controladores canónicos exclusivos `@Controller('kartex/...')`.
    - Seeders CLI actualizados (`seed:kartex`, `seed:all`).
  - Enrutamiento por Subdominio (`middleware.ts`):
    - Subdominio canónico exclusivo `kartex: '/kartex'` (cero alias o fallbacks de retrocompatibilidad).
  - Eliminación Radical y Definitiva de Retrocompatibilidad (`/goal`):
    - Eliminado cualquier rastro, alias o compatibilidad con `bible.jorgedoicela.com`, `bible.sqlite`, `(bible)` o endpoints `/bible/*` en todo el repositorio.
    - Dominio canónico exclusivo: `kartex.jorgedoicela.com` / `kartex` / `KARTEX`.
    - Base de datos física exclusiva: `backend/data/kartex.sqlite` (conexión `'kartexConnection'`).
    - Nginx, PM2, GitHub Actions CI/CD, variables de entorno, documentación en `docs/` y componentes en los 4 proyectos del monorepo (`landing`, `portfolio`, `kartex`, `doiceladev`) sincronizados al 100% bajo KARTEX.
  - Sincronización Inter-Dominios y App Móvil:
    - Enlaces actualizados en `(landing)` (Bento, AI Assistant, `PersonJsonLd`), `(portfolio)` (`PortfolioJsonLd`) y `(doiceladev)` (`DoiceladevFooter`).
    - App móvil Expo (`frontend/mobile/app.json`): `name: "Kartex"`, `slug: "kartex-mobile"`.
    - Documentación técnica sincronizada en `docs/04-kartex/`.
  - Cajas Negras y Compilación: 0 violaciones de aislamiento y compilación limpia al 100% (`tsc --noEmit` código 0, `nest build` código 0).
* **Auditoría Automatizada Exhaustiva de Cero Residuos (Script en Raíz):**
  - Se crearon y ejecutaron scripts de escaneo profundo en Node.js sobre la totalidad del monorepo (`scan-residuals.js` y `scan-deep-bible.js`), analizando cada archivo de código fuente, configuraciones, variables de entorno y documentación técnica.
  - Saneamiento y correcciones aplicadas:
    - [backend/nest-cli.json](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/nest-cli.json): Actualizado el compilador de assets a `"kartex/corpus/**/*"`, verificando la generación correcta de `dist/kartex/corpus/` con `nest build`.
    - [backend/.env](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/.env): Actualizadas `DATABASE_KARTEX_PATH`, `DATABASE_DOICELADEV_PATH` y `CORS_ORIGINS` con los subdominios canónicos de desarrollo y producción.
    - [frontend/web/src/app/(doiceladev)](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(doiceladev)): Actualizada la clave `"exegesisKartex"` en `DoiceladevFooter.tsx` y diccionarios `messages/{es,en}.json`.
    - [frontend/web/src/app/(kartex)](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)): Actualizada la clave `"modularKartex"` en diccionarios `messages/{es,en}.json`.
    - Documentación técnica (`docs/`): Saneadas todas las referencias de arquitectura residuales en `02_patrones_microarquitectura_y_fsd.md`, `03_resolucion_incidente_subdominios_nextjs_loopback.md`, `01_arquitectura_y_diseno.md`, `01_frontend_y_terminal_ssh.md` y `01_backend_y_persistencia.md`.
  - Scripts de búsqueda temporales eliminados de la raíz.
  - Verificación Integral Exitosa:
    - `pnpm -r typecheck`: 3/3 proyectos pasaron con código 0.
    - `pnpm -r lint`: 3/3 proyectos pasaron con código 0.
    - `pnpm --filter backend build`: `nest build` completado con código 0.
* **Auditoría Arquitectónica Senior de KARTEX (FSD, 3 Capas y Cajas Negras):**
  - **Principio de Cajas Negras (Domain Isolation):** 0 importaciones cruzadas entre `(kartex)` y `(landing)`, `(portfolio)` o `(doiceladev)`.
  - **Feature-Sliced Design (FSD en 6 Capas):**
    - Se elevó el orquestador de pasajes a `entities/passage` (`KartexPassageContext.tsx`, `index.ts`).
    - Desacoplado `StudySidePanel.tsx` en `shared/ui` como componente puro.
    - Migrados los 34 componentes y widgets dependientes a la API pública de `entities/passage`.
    - Resultado: **0 violaciones de jerarquía de capas FSD**.
  - **Backend NestJS (3 Capas Canónicas):**
    - 8 submódulos verticales de estudio (`archaeology`, `atlas`, `books`, `evangelism`, `morphology`, `timeline`, `translations`, `verses`) implementan rigurosamente la separación de Controladores (`@Controller('kartex/...')`), Servicios de Dominio (`@Injectable()`) y Entidades TypeORM/DTOs bajo la conexión aislada `'kartexConnection'`.
  - **Verificación Técnica:** `pnpm -r typecheck` (código 0), `pnpm -r lint` (código 0) y `nest build` (código 0).
* **Auditoría Exhaustiva de Bilingüismo (i18n ES/EN) y Erradicación Total de Cadenas Hardcodeadas en KARTEX:**
  - **Paridad 1:1 de Diccionarios:** Verificada la simetría absoluta entre `frontend/web/src/app/(kartex)/messages/es.json` y `en.json` alcanzando 1053/1053 claves idénticas con 0 claves faltantes o huérfanas.
  - **Saneamiento de Componentes y Vistas:**
    - [TimelineCanvas.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/features/timeline/components/TimelineCanvas.tsx): Internacionalizadas las cabeceras SVG de pistas (`trackJudah`, `trackIsrael`, `trackProphets`, `trackEmpires`, `trackMilestones`), el badge de sincronización (`syncing`) y el formato de años dinámicos bilingües (`a.C.` / `d.C.` en ES vs `BC` / `AD` en EN).
    - [ReaderToolbar.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/features/verses/components/reader-toolbar/ReaderToolbar.tsx): Internacionalizada la indicación de teclas de navegación (`shortcutNavKeys`).
    - [KartexHeroSection.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/widgets/landing/ui/KartexHeroSection.tsx) y [KartexManuscriptsSection.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/widgets/landing/ui/KartexManuscriptsSection.tsx): Internacionalizados los atributos accesibles `alt` de las imágenes destacadas (`heroImageAlt`, `manuscriptImageAlt`).
    - [KartexPurposeSection.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/widgets/landing/ui/KartexPurposeSection.tsx): Erradicado el versículo comparativo hardcodeado y parametrizado con `purposeCompareCard2VersePre` y `purposeCompareCard2VerseHighlight`.
    - [KartexCorpusVersionsSection.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/widgets/landing/ui/KartexCorpusVersionsSection.tsx) y [KartexMobileAppSection.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(kartex)/widgets/landing/ui/KartexMobileAppSection.tsx): Localizadas las referencias bíblicas de muestra (`sampleReferencePsalms23_1`, `mobilePsalmTitle`).
    - [App.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/mobile/App.tsx): Actualizada la presentación de la app móvil a **KARTEX Mobile**.
  - **Backend NestJS y Corpus:** Verificado que los 14 datasets en `backend/src/kartex/corpus/` (evangelismo, arqueología, atlas, cronología) cuentan con esquema bilingüe simétrico `{ es, en }`.
  - **Verificación Técnica:** `pnpm -r typecheck` (código 0) y `pnpm --filter backend build` (código 0).
* **Auditoría Arquitectónica Senior y Pureza FSD en KARTEX (Post-Renombramiento):**
  - **Principio de Cajas Negras (Domain Isolation):** **0 violaciones de importación cruzada** (cero cross-imports) entre `(kartex)` y `(landing)`, `(portfolio)` o `(doiceladev)` en frontend y backend.
  - **Feature-Sliced Design (FSD Canónico en 6 Capas):**
    - Se reubicaron los inspectores de entidades a sus dominios puros: `BookHistoricalProfile` en `entities/books/ui/`, `ParallelVerseInspector` en `entities/passage/ui/` y `StrongMorphologyInspector` en `entities/passage/ui/`.
    - Se erradicaron las dependencias ascendentes desde `features/` hacia `widgets/` en `AtlasInspector`, `InterlinearInspector`, `WordStudyInspector` y `ParallelDiffInspector`.
    - Resultado: **0 violaciones de jerarquía de capas FSD** y **0 violaciones cross-feature**.
  - **Backend NestJS (3 Capas Canónicas):**
    - 8 Controladores (`@Controller('kartex/...')`), 9 Servicios de Dominio (`@Injectable()`) y 11 Entidades TypeORM/DTOs operan 100% bajo la conexión aislada `'kartexConnection'` (`kartex.sqlite`).
* **Homologación de Terminales estilo AWS Lightsail (Clipboard & Host Identity):**
  - **Causa Raíz:** En terminales web basadas en navegador (`xterm.js` o emuladas), los atajos nativos del teclado (`Ctrl+C` / `Ctrl+V`) no operan como en el SO de escritorio porque `Ctrl+C` emite `SIGINT` (`\x03`) al PTY y `Ctrl+V` está restringido por las políticas de seguridad del navegador.
  - **Implementación Arquitectónica Senior:**
    - Se creó el componente reutilizable `TerminalClipboardFooter.tsx` en `(portfolio)/features/terminal/components/`.
    - **Identidad de Instancia:** Emite icono Debian, hostname (`jorge`), IP pública / local y estado de conexión en vivo.
    - **Popover Informativo `(i)`:** Despliega tooltip accesible explicando la razón por la cual los atajos de teclado difieren en el navegador y cómo usar los botones de acción.
    - **Botón "Copy from terminal":** Copia la selección activa o el buffer completo con `navigator.clipboard.writeText()` y feedback visual instantáneo.
    - **Botón "Paste into terminal":** Ejecuta `navigator.clipboard.readText()` bajo evento de usuario legítimo (disparando el diálogo de permisos nativo del navegador de forma segura) y envía el payload al PTY / comando.
    - **Integración Homogénea:** Incorporado en `SandboxTerminal.tsx` (Live Linux PTY) y `TerminalConsole.tsx` (Consola interactiva).
    - **i18n Paridad 1:1:** Diccionarios `es.json` y `en.json` sincronizados con claves `clipboardInfoTitle`, `clipboardTooltipP1` y `clipboardTooltipP2`.
  - **Verificación Técnica:** `pnpm -r typecheck` ejecutado con éxito (código 0 en los 3 workspaces).

* **Auditoría Exhaustiva de Refactorización y Disponibilidad Funcional en DoicelaDev (`/goal`):**
  - **Objetivo:** Verificar rigurosamente la integridad de tipos, rutas relativas, importaciones, contratos de API, bilingüismo i18n y consistencia de persistencia en SQLite tras la refactorización integral de DoicelaDev.
  - **Hallazgos y Soluciones de Causa Raíz:**
    1. **Sincronización de Categorías en Dataset de Tutoriales:**
       - En `backend/src/doiceladev/corpus/tutorials.json`, el tutorial en inglés (id: 2, `Building a Virtual SSH Terminal with WebSockets in React and NestJS`) carecía de la propiedad `"category": "web"`, lo que provocaba que en la base de datos se asignara el valor por defecto (`category: 'backend'`) desfasando los filtros de categoría y conteos entre ES y EN.
       - Corrección: se añadió `"category": "web"` al registro en inglés y se re-sembró la base limpia local (`pnpm --filter backend seed:doiceladev`), completando la recreación de `doiceladev.sqlite` en 214 ms.
    2. **Contrato de Tipado en `ForumReplyForm.tsx`:**
       - La interfaz `ForumReplyFormProps` tipaba el callback como `onReplySent?: (updated: ForumTopic) => void;` y parseaba `ForumTopic`, mientras que el endpoint del backend `@Post('doiceladev/forum/replies')` retorna la entidad `ForumReply`.
       - Corrección: se tipó formalmente con `ForumReply` tanto en la interfaz como en el manejo seguro de la respuesta JSON del formulario.
  - **Auditoría de Componentes y Funcionalidad:**
    - Se verificó la disponibilidad y corrección de las 6 capas FSD en los 8 dominios (`news`, `blog`, `forum`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`) junto con `portal` y `glossary`.
    - Componentes de UI comunes (`MarkdownRenderer`, `CodeBlock`, `MermaidBlock`, `TableBlock`, `CalloutBlock`, `GlossaryTermPopover`, `DoiceladevCard`, `CategoryFilterBar`, `DoiceladevSelect`, `ArticleCover`, `BackToPortalButton`, `ScrollToTopButton`, `FeaturedCarousel`, `SpotlightModal`, `DoiceladevArticleLayout`) revisados con imports 100% válidos.
  - **Bilingüismo e i18n (390/390 claves):**
    - Paridad absoluta entre `messages/es.json` y `messages/en.json`, con 0 claves huérfanas o faltantes en todas las vistas y widgets.
  - **Aislamiento y Principio de Cajas Negras:**
    - Cero importaciones cruzadas entre `(doiceladev)` y los dominios `(landing)`, `(portfolio)` o `(kartex)`.
  - **Verificación Técnica de Compilación:**
    - `pnpm -r typecheck`: Validación exitosa con 0 errores en los 3 proyectos (`backend`, `frontend/web`, `frontend/mobile`).
    - `pnpm --filter backend build`: `nest build` completado exitosamente con código 0.

* **Auditoría Arquitectónica Integral de DoicelaDev y Kartex (FSD Puro, Cajas Negras y 3 Capas NestJS):**
  - **Script Automatizado de Auditoría (`backend/audit-architecture.mjs`):**
    - Evalúa en tiempo real: (1) Cero importaciones cruzadas entre dominios en backend y frontend, (2) Cumplimiento riguroso de jerarquía FSD (`app` -> `widgets` -> `features` -> `entities` -> `shared`), (3) Arquitectura de 3 capas en NestJS (Controllers no inyectan TypeORM ni Repositorios; Services no importan Controllers; Entities no importan capas de aplicación).
  - **Resolución de Causa Raíz FSD en `StudySidePanel`:**
    - Se identificó violación FSD en `frontend/web/src/app/(kartex)/shared/ui/StudySidePanel.tsx` que importaba directamente `useKartexPassageSafe` de la capa superior `entities/passage`.
    - Solución arquitectónica (Inversión de Control / DIP): Se creó el contrato agnóstico `StudySidePanelContext.tsx` en `shared/ui`. `KartexPassageProvider` provee dicho contexto mediante `StudySidePanelContextProvider`, permitiendo que `StudySidePanel` consuma exclusivamente `useStudySidePanelState(side)` sin ninguna dependencia ascendente hacia `entities`.
  - **Resultados de Auditoría:**
    - Cero importaciones cruzadas en Backend y Frontend (DoicelaDev y Kartex).
    - Cero violaciones FSD en Frontend (DoicelaDev y Kartex).
    - Cero violaciones de 3 capas en Backend NestJS.
  - **Verificación Técnica:** `pnpm -r typecheck` (código 0), `pnpm --filter web build` (Next.js 16 - 31 rutas optimizadas con código 0) y `pnpm --filter backend build` (NestJS 11 con código 0).

* **Corrección de Causa Raíz en Despliegue CI/CD (`deploy.yml`):**
  - **Problema Detectado:** Los cambios subidos al repositorio en commits recientes no se reflejaban en producción en AWS Lightsail, incluso abriendo en modo incógnito y purgando la caché de Cloudflare.
  - **Causa Raíz:** En el commit `a8774128` se había eliminado inadvertidamente la clave `TARGET: ${{ secrets.TARGET_DIR }}` del step `easingthemes/ssh-deploy@v5.1.0`. Por ende, el rsync copiaba los archivos a la raíz del usuario SSH (`~/`) en lugar de sobreescribir la carpeta operativa del proyecto (`/home/admin/jorge_doicela`). Posteriormente, PM2 y los seeders se ejecutaban en `TARGET_DIR`, manteniendo intacta la versión previa en disco.
  - **Solución Implementada:** Se restauró `TARGET: ${{ secrets.TARGET_DIR }}` en `.github/workflows/deploy.yml`. Al confirmarse y subirse a `main`, el pipeline sincroniza los archivos compilados en la ruta exacta de ejecución de PM2.

* **Depuración Tipográfica y Erradicación de Redundancias de Nombre (`KARTEX` vs `Kartex` vs Omisión):**
  - **Criterio de Marca y Tipografía:**
    - `KARTEX` (todo mayúsculas): Se reserva estrictamente para la identidad gráfica corporativa, isotipo/logotipo (`<KartexLogo />`), encabezado macro de landing y manifiestos formales (`manifest.json`, `og:site_name`, copyright formal).
    - `Kartex` (capitalizado en mayúscula inicial / title case): Se utiliza en prosa corrida, descripciones, badges de ecosistema y botones de llamado a la acción (`Abrir Kartex`, `Open Kartex`) para mantener armonía visual con `Portafolio` y `DoicelaDev`, evitando el efecto estridente ("shouting") de mayúsculas sostenidas en botones y oraciones.
    - **Omisión Total (Erradicación de Redundancia):**
      - Pestañas de navegación interna de Kartex (`KartexHeaderNav.tsx`): Se eliminó el prefijo redundante "Kartex" en cada pestaña. Antes: *Kartex Lector*, *Kartex Paralelo*, *Kartex Interlineal*, etc. Ahora: *Lector*, *Paralelo*, *Interlineal*, *Lexicón*, *Atlas*, *Cronología*, *Arqueología*, *Evangelismo*. Esto reduce drásticamente la saturación visual, evita desbordamientos en pantallas medianas y se alinea con la estética minimalista Geist/Vercel.
      - Botón de retorno (`BackToKartexButton.tsx`): Se simplificó de *Volver a Inicio de KARTEX* a *Volver al inicio* (ES) / *Back to home* (EN).
      - Módulos en Landing Page (`engine1Title` a `engine10Title`): Se eliminó "Kartex" repetido en cada tarjeta, presentándolos concisamente (*Lector Bíblico*, *Paralelo*, *Interlineal*, *Exégesis*, *Lexicón*, etc.).
      - Datos estructurados (`KartexJsonLd.tsx`) y dossiers IA (`llms.txt`): Se limpiaron las listas de características evitando iterar el nombre de la plataforma en cada una.

* **Erradicación de Textos Quemados y Migración Integral a `next-intl` (`messages/es.json` y `messages/en.json`):**
  - **Causa Raíz Identificada:** Existían componentes de interfaz que empleaban ternarios en línea (`isEs ? '...' : '...'`, `isEn ? '...' : '...'`) o cadenas estáticas en español en lugar de consumir los diccionarios de internacionalización del framework (`next-intl`), generando acoplamiento innecesario y prop drilling (`isEs`).
  - **Refactorización Integral:**
    - **Landing (`frontend/web/src/app/(landing)/`):**
      - Se extrajeron a `messages/es.json` y `messages/en.json` todas las etiquetas de controles accesibles comunes (`home`, `homeAria`, `pause`, `play`, `slideAria` en namespace `Common`), pilares de diapositivas y glosas Strong en hebreo/griego (`kartexStrong1-3`, `portfolioPillar1-3`, `doiceladevPillar1-3` en namespace `Landing`), 30+ claves completas del inspector interactivo Apple (`Explorer`), y acciones rápidas del modal de IA (`AiAssistant`).
      - Se refactorizaron `AppleDetailExplorer.tsx`, `AppleHighlightsCarousel.tsx`, `LandingHeader.tsx`, `AiAssistantChatModal.tsx`, `KartexSlideVisual.tsx`, `PortfolioSlideVisual.tsx` y `DoiceladevSlideVisual.tsx` para consumir directamente `useTranslations()`, eliminando `useLanguage()`, ternarios `isEs ?` y el paso manual de props de idioma.
    - **KARTEX (`frontend/web/src/app/(kartex)/`):**
      - Se agregaron claves de HUD y mockups exegéticos a `(kartex)/messages/` (`nblaLabel`, `ntvLabel`, `bhsMasoretic`, `bdbThayerLexicon`, `otUses173`, `psalmsIsaiah`, `atlasRouteSample`, `synchronousChronology`, `exileYear`, `manuscriptRecord`, `qumranCave1`, `qumranDate`, `leningradDate`, `practicalApologetics`, `slideAria`).
      - Se refactorizó `KartexEnginesCarousel.tsx` para consumir `tLanding('...')` en todos los paneles, dot and slot HUDs, eliminando `isEn` y preservando intacta la morfología hebrea y griega original.
  - **Verificación Técnica:** `0` ocurrencias de `isEs ?` en `frontend/web/src`, `pnpm -r typecheck` con 0 errores (código 0 en backend, web y mobile), y `pnpm check-secrets` limpio.

* **Estandarización de Denominación de Portafolio (Cero "Profesional", Cero "Portafolio & Terminal SSH"):**
  - **Criterio de Marca y Nomenclatura:**
    - La plataforma se denomina simple y contundentemente **Portafolio** (ES) / **Portfolio** (EN) en todos los niveles (UI, diccionarios de internacionalización `messages/`, títulos de tarjetas, metadatos OpenGraph, PWA manifest, dossiers `llms.txt` y documentación técnica).
    - Se erradicó el calificativo redundante *"Profesional"* en títulos y etiquetas (`Portafolio Profesional` -> `Portafolio`), manteniendo un tono sobrio, elegante y libre de adjetivos marketeros.
    - Se desacopló la identidad del portafolio de la terminal SSH: la consola interactiva es solo una herramienta exploratoria secundaria dentro de la plataforma, no el núcleo ni el titular de la misma (`Portafolio & Terminal SSH` -> `Portafolio`).
    - Las descripciones editoriales priorizan la arquitectura de software, los proyectos destacados y el stack técnico, situando a la terminal como un complemento interactivo.
    - Se depuraron enlaces residuales de pie de página en DoicelaDev (`portfolioSSH`: *Portafolio SSH* / *SSH Portfolio* -> *Portafolio* / *Portfolio*), respuestas del asistente de IA en modal y API (`route.ts`), dossiers de IA (`llms.txt`), así como el sistema de archivos virtual emulado en el backend (`portfolio_ssh.txt` -> `portfolio.txt`). Cero ocurrencias de "profesional" / "professional" en todos los diccionarios de internacionalización del ecosistema.

* **Calibración Editorial de Presencia de Marca en Landing de Kartex (`messages/{es,en}.json`):**
  - **Criterio de Identidad sin Saturación:**
    - Se evitó el anonimato genérico ("Una Plataforma para el Estudio...", "La plataforma enlaza...", "accede a la plataforma...") sin caer en la sobrecarga publicitaria de repetir la marca en cada título de herramienta.
    - Puntos clave calibrados con **Kartex** (Title Case):
      1. *Hero Title (`heroTitle`)*: "Kartex: Plataforma para el Estudio de la Biblia" (ES) / "Kartex: A Scripture Study Platform" (EN), situando la identidad desde el primer impacto visual.
      2. *Sección Móvil (`mobileDesc`)*: "Kartex Móvil está diseñada para acompañarte..." (ES) / "Kartex Mobile is designed to go wherever you go..." (EN), identificando con claridad la app Expo offline.
      3. *Manuscritos y Códices (`manuscriptsDesc`)*: "Kartex enlaza directamente con los textos base..." (ES) / "Kartex connects directly with landmark archival sources..." (EN).
      4. *CTA Final (`ctaSubtitle`)*: "Accede de forma inmediata a Kartex sin necesidad de registrarte..." (ES) / "Get instant access to Kartex without any mandatory signup..." (EN).
      5. *Footer Copyright (`footerCopyright`)*: "Jorge Doicela © {year} • Kartex" en sustitución de la descripción genérica "Estudio de la biblia".
    - Los 10 módulos de estudio se mantienen limpios sin prefijos repetitivos (*Lector Bíblico*, *Paralelo*, *Interlineal*, *Lexicón*, *Atlas*, etc.).

* **Estandarización Integral de Nomenclatura Kartex (Cero Mayúsculas Sostenidas en Metadatos y OpenGraph):**
  - **Causa Raíz:** La pestaña del navegador y las vistas previas de enlaces compartidos (OpenGraph, WhatsApp, Twitter, Telegram) mostraban `KARTEX · Plataforma de Investigación...` en mayúsculas sostenidas, generando una apariencia estridente y desbalanceada respecto a las demás plataformas (`Portafolio`, `DoicelaDev`).
  - **Alineación Integral en Title Case (`Kartex`):**
    - Metadatos HTML (`Metadata.title` y `Metadata.description` en `es.json` y `en.json`): ahora inicia limpiamente como `Kartex · Plataforma de Investigación y Estudio Bíblico | Jorge Doicela`.
    - OpenGraph y Twitter Cards (`layout.tsx` de `(kartex)`): `siteName` actualizado a `Kartex | Jorge Doicela` y `alt` de imagen a `Kartex - Jorge Doicela`.
    - Datos estructurados Schema.org (`KartexJsonLd.tsx`): `name` y `description` actualizados a `Kartex`.
    - PWA Manifest (`public/kartex/manifest.json`): `name` a `Kartex | Jorge Doicela` y `short_name` a `Kartex`.
    - Accesibilidad gráfica (`KartexLogo.tsx`): atributos `alt` unificados a `Logo Kartex`.
    - OpenGraph de Portal (`opengraph-image.tsx`): badge de plataforma actualizado a `Kartex` para simetría con `DoicelaDev` y `Portafolio`.
* **Arquitectura de Inspector Exegético Unificado en Kartex (`VerseExegesisCard`):**
  - **Causa Raíz:** En la vista de lectura estándar (`/study/standard`), el panel lateral derecho (`KartexExegesisInspector`) dividía el espacio en dos pestañas mutuamente excluyentes (`[ Versiones Paralelas ] [ Morfología Strong ]`). Dado que el lector estándar presenta texto continuo, la pestaña de morfología permanecía desaprovechada y la de versiones estaba limitada, desperdiciando el espacio vertical del viewport.
  - **Solución Arquitectónica (Ficha Exegética Continua de Alta Densidad):**
    - Se eliminó la barra de pestañas excluyentes y se implementó un flujo vertical continuo mediante `VerseExegesisCard` en `(kartex)/entities/passage/ui/VerseExegesisCard.tsx`.
    - **5 Secciones Verticales Integradas:**
      1. *Cabecera del Versículo:* Cita bíblica localizada (`tBooks`), controles discretos de navegación versicular anterior/siguiente (`tStudio('prevVerse')` / `tStudio('nextVerse')`), selector interactivo con menú desplegable para activar/desactivar versiones (BHS, NA28, NBLA, NTV, RV1960...) y chips removibles.
      2. *Cotejo Multiversión Scrolleable:* 100% dinámico desde SQLite (`/api/kartex/verses?bookId=...&chapter=...&translationId=...`), renderizado tipográfico diferenciado (RTL para hebreo con fuente masorética, LTR para griego y español).
      3. *Términos Clave y Morfología Original:* 100% dinámico desde SQLite (`/api/kartex/morphology/passage`), filtrado por versículo con lemas, transliteración y claves Strong. Al tocar una clave, consulta en tiempo real el léxico BDB/Thayer (`/api/kartex/morphology/lexicon/:code`) con acordeón in-situ.
      4. *Referencias Cruzadas Canónicas Localizadas:* Módulo `crossReferencesData.ts` con pasajes correlativos enriquecidos con soporte bilingüe nativo (`relationLabel`, `relationLabelEn`, `snippetText`, `snippetTextEn`) según `useLocale()`, y nombres de libros traducidos mediante `tBooks`. Navegación instantánea en un solo clic invocando `setPassage(bookId, chapter, verseNumber)`.
      5. *Accesos Directos a Módulos Exegéticos:* Enlaces con parámetros de consulta para abrir el pasaje en `/study/interlinear`, `/study/parallel`, `/study/atlas` o `/study/timeline`.
    - **Cero Textos Quemados y Paridad i18n 1:1:** Todas las etiquetas de interfaz, tooltips, libros bíblicos y descripciones provienen estrictamente de `next-intl` (`messages/es.json` y `messages/en.json` bajo `Studio` y `Books`).
    - **Depuración de Barra Contextual Inferior Residual (`ContinuousReadingView`):** Se eliminó de raíz el menú flotante inferior redundante (`selectedVerseId && <div ...>`) y el estado asociado de timers/toasts. Al hacer clic sobre cualquier versículo, la acción activa directamente el Inspector Exegético en el panel lateral derecho con resaltado sutil en el texto, manteniendo el flujo de lectura 100% limpio y libre de distracciones.
    - **Selección y Deselección Fluida de Versículos (Toggle Reactivo):**
      - Se expuso `clearInspectedVerse()` en `KartexPassageContext`.
      - Tanto en lectura continua (`ContinuousReadingView`) como versículo a versículo (`LineByLineReadingView`), la interacción opera como un toggle limpio: un clic selecciona el versículo y abre/actualiza el inspector; un segundo clic sobre el mismo versículo lo deselecciona inmediatamente sin dejar resaltados residuales.
      - Se reemplazó el bloque negro invertido de alto contraste (`bg-zinc-900 text-white`) por un resaltado armónico adaptativo (`getSelectedVerseClass`) que respeta la paleta editorial según el tema (`sepia`, `dark`, `system`), mejorando sustancialmente la comodidad de lectura.
    - **Estado Inicial del Inspector Exegético sin Selección Forzada (Cero Versículo por Defecto):**
      - **Causa Raíz:** En `KartexPassageContext.tsx` (líneas 272-294), el estado `inspectedVerse` se inicializaba de forma estática con `{ bookId: 1, bookName: 'Génesis', chapter: 1, verseNumber: 1, text: '' }` y un `useEffect` lo restablecía a `verseNumber: 1` cada vez que cambiaba el libro o capítulo. Como resultado, al abrir el lector bíblico, el versículo 1 aparecía marcado con el fondo de selección activa en el texto y el panel lateral derecho abría inmediatamente los datos de Génesis 1:1 en lugar de esperar la interacción del usuario.
      - **Solución Implementada:**
        1. Se inicializó `inspectedVerse` como `null` por defecto en `KartexPassageContext.tsx`.
        2. Se ajustó el `useEffect` para que al cambiar de libro o capítulo únicamente limpie el versículo previo (`return null`) en lugar de forzar el versículo 1.
        3. En `KartexExegesisInspector.tsx` se eliminó el fallback sintético hacia Génesis 1:1.
        4. En `VerseExegesisCard.tsx` se configuraron cláusulas de guarda en las consultas de red (`parallelVerses` y `morphology`) y se implementó la presentación del estado vacío (`empty state`) minimalista sin bordes punteados ni cajas cerradas, con el icono `BookOpen` directamente visible sin recuadros o contenedores envolventes (al igual que en `ParallelVerseInspector` y `StrongMorphologyInspector`) y textos internacionalizados (`selectVerseToInspect` y `noVerseSelectedDesc`).
        5. Al abrir el lector, ningún versículo está resaltado ni seleccionado; el usuario tiene el control total para tocar cualquier versículo y activar el inspector cuando lo desee.

* **Estandarización Terminológica Universal (Adopción de «Módulo», «Herramienta», «Sistema» y «Algoritmo»):**
  - **Decisión de Arquitectura y Lenguaje:** Se estandarizó la terminología técnica en todo el monorepo (UI, i18n, APIs, documentación técnica y metadatos SEO), sustituyendo cualquier denominación genérica por vocablos técnicos precisos y contextualizados:
    - *Kartex:* «9 módulos de estudio especializados» / «módulos exegéticos» / «módulos de análisis morfológico».
    - *Diff y Cotejo Textual:* «algoritmo de diferencias textuales LCS» / «herramienta de resaltado léxico».
    - *Búsqueda y SEO:* «buscadores web» / «rastreadores y buscadores estándar».
    - *DoicelaDev:* «Sistema de Relevancia y Ordenamiento», «Sistema Universal de Filtros Polimórficos» y «Sistema de Contenido Técnico Markdown».
    - *Infraestructura:* «servicio Docker» / «daemon de Docker», «servidor de Socket.io», «sintetizador TTS».

* **Comportamiento Responsive de Paneles Laterales en Kartex (`KartexPassageContext.tsx`):**
  - **Requisito de UX:** En pantallas táctiles móviles (< 1024px) ningún panel debe abrirse automáticamente para no obstruir el texto de lectura con drawers flotantes ni backdrop oscuro; en PC (>= 1024px), ambos paneles laterales (navegación izquierda e inspector exegético derecho) deben abrirse automáticamente por defecto (o restaurar la preferencia guardada en PC) para brindar la suite de estudio completa de 3 columnas sin obstrucciones.
  - **Solución Arquitectónica:**
    1. En SSR, `isLeftSidebarOpen` e `isRightInspectorOpen` arrancan en `false` para prevenir desfases de hidratación (hydration mismatch).
    2. Durante el montaje en cliente (`useEffect`):
       - Si `window.innerWidth >= 1024` (PC): Ambos paneles se abren automáticamente (`true` por defecto o respetando `localStorage` si el usuario los alternó deliberadamente en PC).
       - Si `window.innerWidth < 1024` (Móvil): Ambos paneles se definen estrictamente en `false`, presentando el texto bíblico diáfano sin modales flotantes superpuestos.
    3. Al redimensionar la ventana (`handleResize`):
       - De PC a Móvil: Se colapsan ambos paneles a `false` inmediatamente.
       - De Móvil a PC: Se restauran ambos paneles a su estado de escritorio (`true` por defecto o según preferencia en PC).
    4. En Móvil, las escrituras en `localStorage` quedan bloqueadas (`window.innerWidth >= 1024`), evitando que interacciones táctiles temporales contaminen la configuración de escritorio.
    5. Al seleccionar un pasaje en móvil desde `KartexNavigationSidebar`, el drawer se cierra automáticamente tras la selección para focalizar el texto del capítulo.




