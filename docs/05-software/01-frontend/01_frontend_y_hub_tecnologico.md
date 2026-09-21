# Software - Frontend y Plataforma Tecnológica (Next.js)

Este documento detalla la arquitectura macro y micro, componentes, categorías temáticas y diseño de **Software** (`software.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro y Enrutamiento Canónico Limpio:**
> * **Subdominio Canónico:** `software.jorgedoicela.com` (o `http://software.localhost:3001` en desarrollo local).
> * **URLs Limpias Canónicas de Primer Nivel:** La raíz del subdominio es `/` y las secciones son rutas directas (`/news`, `/blog`, `/forum`, `/ai`, `/cybersecurity`, `/tutorials`, `/projects`, `/infrastructure`).
> * **Redirección Canónica 308 Permanente:** En `src/middleware.ts`, cualquier solicitud en el subdominio con el prefijo redundante `/software` o `/software/*` se redirige automáticamente mediante HTTP 308 a la ruta limpia correspondiente (`/` o `/*`), eliminando URLs duplicadas en el navegador y protegiendo el SEO.
> * **Reescritura Interna Transparente:** Next.js reescribe internamente las rutas limpias al directorio físico `frontend/web/src/app/(software)/software/*` para evitar colisiones de rutas a nivel de compilación con `(landing)`, `(portfolio)` y `(bible)` bajo el runtime consolidado de 1 GB de RAM.
> * **Compatibilidad Localhost Directa:** Solicitudes directas sin subdominio a `localhost:3001/software` siguen respondiendo 200 OK directamente.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`, VPS 1 GB RAM).
> * **Aislamiento de Dominio:** Estilos independientes en `(software)/globals.css`. Cero importaciones de otros subdominios.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD Canónico en 6 Capas):**
>   * `providers/`: Envoltorios de montaje global en layout (`theme-provider`).
>   * `shared/`: UI Kit agnóstico (`SoftwareCard`, `BackToPortalButton`, `ScrollToTopButton`, `ArticleCover`), suite Markdown (`MarkdownRenderer`, bloques de código/Mermaid/tablas/callouts), SEO (`SoftwareJsonLd`), utilitarios de red (`api`, `serverFetch`, `fetchJson`) y tipos base.
>   * `entities/`: 8 dominios temáticos (`news`, `blog`, `forum`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`) y feed consolidado (`hub`), cada uno con sus modelos, tipos, hooks API y componentes de presentación (`NewsCard`, etc.).
>   * `features/`: Acciones e interactividad del usuario (`spotlight-search`, `forum-reply`, `language-toggle`, `theme-toggle`).
>   * `widgets/`: Bloques visuales complejos y layouts (`software-header`, `software-footer`, `category-nav`, `featured-carousel`, `article-layout`, `page-layout`).
> * **Internacionalización Integral (i18n):** Soporte bilingüe completo (`es` / `en`) mediante `next-intl` en `messages/{es,en}.json` para las 8 categorías, cabecera `SoftwareHeaderNav`, badges, metadatos, y consumo bilingüe dinámico hacia el backend vía `?lang=${locale}`.
> * **Jerarquía de Componentes:** Componentes encapsulados localmente con sus propios hooks y tipos.
> * **Estética Neumorphism UI + Glassmorphism:** Paneles táctiles cóncavos/convexos combinados con desenfoques vítreos translúcidos, reflejos esmerilados y sombras suaves superpuestas.

---

## 2. Estructura de Rutas y FSD Canónico

```text
frontend/web/src/app/(software)/
├── globals.css                       # Estilos aislados de Software (Neumorphism UI + Glassmorphism: Titanio Claro / Obsidiana Oscuro)
├── layout.tsx                        # Layout raíz del subdominio (ThemeProvider + NextIntlClientProvider)
├── messages/                         # Diccionarios i18n
│   ├── es.json
│   └── en.json
│
├── providers/                        # CAPA 1 (APP): Proveedores de Tema y Contexto Global
│   ├── theme-provider.tsx            # Wrapper local de next-themes
│   └── index.ts
│
├── shared/                           # CAPA 6: UI Kit, Markdown, SEO, Lib y Tipos Agnósticos
│   ├── ui/                           # SoftwareCard, BackToPortalButton, ScrollToTopButton, ArticleCover
│   ├── markdown/                     # MarkdownRenderer + CodeBlock, MermaidBlock, TableBlock, CalloutBlock
│   ├── seo/                          # SoftwareJsonLd (Schema JSON-LD)
│   ├── lib/                          # api, serverFetch, fetchJson
│   └── types/                        # spotlight.ts
│
├── entities/                         # CAPA 5: Modelos, Hooks API, Tarjetas de Entidad y Borradores Markdown (8 Categorías + Hub)
│   ├── news/                         # NewsCard, NewsGrid, useNews, drafts/, types.ts, index.ts
│   ├── blog/                         # BlogCard, BlogGrid, useBlog, drafts/, types.ts, index.ts
│   ├── forum/                        # TopicCard, useForum, drafts/, types.ts, index.ts
│   ├── ai/                           # AiCard, AiGrid, useAi, drafts/, types.ts, index.ts
│   ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, drafts/, types.ts, index.ts
│   ├── tutorials/                    # TutorialCard, TutorialGrid, TutorialStepWizard, useTutorials, drafts/, types.ts, index.ts
│   ├── projects/                     # ProjectCard, ProjectGrid, useProjects, drafts/, types.ts, index.ts
│   ├── infrastructure/               # InfrastructureCard, InfrastructureGrid, useInfrastructure, drafts/ (es/en .md), types.ts, index.ts
│   └── hub/                          # SoftwareHubFeed, useSoftwareHub, types.ts, index.ts
│
├── features/                         # CAPA 4: Acciones e Interactividad del Usuario
│   ├── spotlight-search/             # SpotlightModal (Cmd + K) y lógica omnisciente
│   ├── forum-reply/                  # ForumReplyForm, ForumSection
│   ├── language-toggle/              # LanguageToggle (ES / EN)
│   └── theme-toggle/                 # ThemeToggle (Titanio / Obsidiana)
│
├── widgets/                          # CAPA 3: Bloques Visuales Autónomos Complejos y Shells
│   ├── software-header/              # SoftwareHeaderNav
│   ├── software-footer/              # SoftwareFooter
│   ├── category-nav/                 # CategoryNav (Selector unificado de 8 categorías)
│   ├── featured-carousel/            # FeaturedCarousel (Autoplay + Neumorphic Controls)
│   ├── article-layout/               # SoftwareArticleLayout + Sidebars (AuthorSidebar, ExploreTopics, FeaturedPosts, StayInformed)
│   └── page-layout/                  # SoftwarePageLayout
│
└── software/                         # CAPAS 2 & 1: Enrutamiento y Páginas del App Router de Next.js
    ├── page.tsx                      # Vista principal de Software (Bento Grid + Feed Hub)
    ├── news/                         # Catálogo y lector de noticias (/news, /news/[slug])
    ├── blog/                         # Catálogo y lector de artículos (/blog, /blog/[slug])
    ├── forum/                        # Catálogo e hilo de discusión (/forum, /forum/[slug])
    ├── ai/                           # Directorio y fichas técnicas (/ai, /ai/[slug])
    ├── cybersecurity/                # Matriz de avisos y remediación (/cybersecurity, /cybersecurity/[slug])
    ├── tutorials/                    # Malla de tutoriales y asistente interactivo (/tutorials, /tutorials/[slug])
    ├── projects/                     # Showcase de proyectos (/projects, /projects/[slug])
    └── infrastructure/               # Guías y especificaciones de servidores (/infrastructure, /infrastructure/[slug])
```

---

## 3. Las 8 Categorías de Software

1. **Tutoriales y Guías (`tutorials`):** Manuales paso a paso con código reproducible y asistente StepWizard.
2. **Noticias (`news`):** Novedades y actualidad del desarrollo de software y tecnología con alertas breaking.
3. **Inteligencia Artificial (`ai`):** Modelos de razonamiento, agentes, servidores MCP y herramientas de IA.
4. **Ciberseguridad (`cybersecurity`):** Avisos con matriz de severidad (LOW a CRITICAL), guías de bastionado y remediación.
5. **Infraestructura (`infrastructure`):** Servidores Linux, topologías cloud (AWS Lightsail), arquitectura en 1 GB de RAM, seguridad perimetral mTLS, rate limiting en Nginx, sandboxing en Docker y CI/CD.
6. **Proyectos (`projects`):** Catálogo de sistemas, librerías y herramientas desarrolladas por Jorge con enlaces demo/repo.
7. **Blog (`blog`):** Ensayos profundos sobre arquitectura de software, patrones de diseño y buenas prácticas.
8. **Foros (`forum`):** Espacio comunitario para debates técnicos, preguntas y respuestas anidadas.

---

## 4. Internacionalización, SEO Dinámico y Dossier para IA (next-intl, Schema.org & GEO)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Software.Metadata` en `src/messages/es.json` y `src/messages/en.json`, con tarjetas completas Open Graph y Twitter.
* **Datos Estructurados Schema.org (`SoftwareJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `WebSite` con desglose de las 8 áreas tecnológicas (`hasPart`) para indexación en motores de búsqueda e IA.
* **Dossier Especializado para IA (`public/software/llms.txt`):** Desglose detallado de las 8 áreas de conocimiento, tutoriales StepWizard y proyectos servido en `software.jorgedoicela.com/llms.txt`.
* **Manifiesto PWA Independiente (`public/software/manifest.json`):** Configuración de aplicación web independiente con tema `#0b0f19`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://software.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(software)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.
* **Diccionarios UI Localizados:** Soporte para traducción de nombres de las 7 categorías, placeholders del buscador y etiquetas de estado.

---

## 5. Componentes de Interfaz y Estética Editorial Tech (Referencia MalwareTech + Neumorphism Pro)

* **Fusión Neumórfica y Vítrea Calibrada:** Contenedores y tarjetas construidos sobre `.glass-convex-panel` y `.glass-concave-panel` que combinan sombras cóncavas (efecto hendido) y convexas (relieve extruido) con fondos de cristal esmerilado translúcido (`backdrop-filter: blur(16px)`), gradientes lumínicos diagonales y bordes perimetrales vítreos.
* **Cabecera Editorial de Marca Centralizada:**
  * Imagotipo compuesto de alta nitidez y escala calibrada: icono [`logo_blanco.png`](/software/logo/logo_blanco.png) a la izquierda y bloque tipográfico [`nombre_rol.png`](/software/logo/nombre_rol.png) a la derecha, asegurando una proporción armónica y legibilidad impecable.
  * **Enrutamiento Determinístico del Logotipo:** El logotipo completo está enlazado a la raíz del subdominio de Software (`/` o `http://software.localhost:3001/` en desarrollo local y `https://software.jorgedoicela.com` en producción). Además, al hacer clic sobre el imagotipo mientras se está en la página principal, reinicia automáticamente la categoría a `'all'` (*Todo el Contenido*), restaurando la vista principal de destacados y últimas publicaciones.
  * Titular semántico accesible para SEO (`h1.sr-only`), eliminando el texto visual redundante para dar protagonismo absoluto al diseño del imagotipo.
  * Fila limpia de iconos de redes sociales libres sin contenedores invasivos (`w-6 h-6`, 24px) en color blanco nítido: LinkedIn, GitHub, YouTube, TikTok y Email de contacto, situados a proximidad inmediata bajo el logotipo (`text-white hover:text-zinc-300`).
  * **Barra de Navegación y Control Unificada a Ancho Completo (`w-full glass-concave-panel`):**
    * Encapsulada dentro de un único contenedor cóncavo continuo (`glass-concave-panel`) que abarca el 100% del ancho del layout, alineándose exactamente con los márgenes exteriores de las tarjetas de la grilla de publicaciones:
      * **Flanco Izquierdo:** Botón adaptativo de retorno ([`BackToPortalButton`](/software/shared/ui/BackToPortalButton.tsx)): enlaza al portal central `jorgedoicela.com` desde la raíz con etiqueta `Portal`, o a la raíz del subdominio (`/`) desde páginas de categoría con la etiqueta internacionalizada `Inicio` (ES) / `Home` (EN).
      * **Centro:** Menú de categorías ([`CategoryNav`](/software/widgets/category-nav/ui/CategoryNav.tsx)) con prop `bare` para integrarse limpiamente sin contenedores cóncavos redundantes, cubriendo las 8 áreas temáticas (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `forum`, `projects`, `infrastructure`). Funciona bajo **arquitectura canónica URL-driven**: cada pestaña enlaza directamente a su módulo dedicado (`/news`, `/blog`, `/infrastructure`, etc.), permitiendo que el usuario experimente el módulo completo con sus propios filtros, buscadores y controles avanzados sin estados efímeros en memoria que oculten las rutas.
      * **Flanco Derecho:** Utilidades integradas con el botón de lupa (buscador modal Spotlight `⌘K`) y el conmutador de idioma ([`LanguageToggle`](/software/features/language-toggle/ui/LanguageToggle.tsx) ES/EN).
* **Portadas Visuales de Alta Precisión e Inteligencia Temática (`ArticleCover.tsx` en 16:9):**
  * Soporta imágenes estáticas con `next/image` y fallback procedural dinámico por subcategoría técnica (`subCategory`):
    * **Servidores (`servers`):** Nodos bare-metal y topologías físicas en gradientes esmeralda (`from-emerald-950/70`).
    * **Redes y mTLS (`networking`):** Topologías de red mallada y perímetros en gradientes cian (`from-teal-950/70 via-slate-900 to-cyan-950`).
    * **Contenedores (`containers`):** Arquitectura de micro-contenedores y cgroups en gradientes índigo/azul cobalto.
    * **CI/CD (`ci_cd`):** Pipelines continuos, automatización y ramas en gradientes violeta/fucsia.
    * **Hardening (`hardening`):** Escudos de blindaje, mTLS y sockets seguros en gradientes ámbar/cobre con resplandor dorado.
    * **Cloud (`cloud`):** Topologías de nube híbrida y orquestación systemd en gradientes azul cielo.
  * Refracción vítrea, texturas de ingeniería (`.tech-grid-bg`) y badges animados de `★ DESTACADO` en artículos de alta prioridad editorial.
* **Motor de Relevancia y Ordenamiento Inteligente Enterprise (`sortBy`):**
  * Tanto la página de categoría `/infrastructure` como el Hub de Software integran un algoritmo de ponderación matemática en el backend:
    $$\text{SmartScore} = (\text{featured} \times 1000) + (\text{orderPriority} \times 20) + (\text{likes} \times 4) + (\text{views} \times 1.5)$$
  * Esto garantiza que los artículos insignia (como el análisis forense del incidente P1 y la arquitectura en 1 GB de RAM) encabecen la experiencia del usuario, evitando el desplazamiento errático de nuevas publicaciones al fondo.
  * El usuario dispone de una barra de control interactiva multi-criterio: *★ Relevancia Arquitectónica*, *Más Recientes*, *Más Populares* y *Mayor Complejidad*.
* **Portada General de Todo el Contenido: Podio Top 3 Global y Feed Cronológico Unificado:**
  * **Podio de Destacados (Top 3):** No está restringido artificialmente a categorías fijas; evalúa el `smartScore` consolidado entre todas las áreas para seleccionar las 3 publicaciones insignia de mayor impacto global de la plataforma.
  * **Feed de Últimas Publicaciones:** Unifica todas las publicaciones restantes en una lista polimórfica ordenada estrictamente por fecha de publicación descendente (`publishedAt DESC`), garantizando un flujo vivo, orgánico y fresco donde cada nueva publicación (sea tutorial, aviso de seguridad, servidor o noticia) aparece de inmediato en la parte superior.
* **Normalización Arquitectónica Universal de 3 Secciones (`SoftwareCard.tsx`):**
  * Para garantizar simetría visual absoluta, sobriedad y máxima elegancia entre todas las categorías (Noticias, Blog, IA, Ciberseguridad, Tutoriales, Proyectos, Infraestructura), todas las tarjetas especializadas (`NewsCard`, `BlogCard`, `AiCard`, `SecurityCard`, `TutorialCard`, `ProjectCard`, `InfrastructureCard`) delegan como componentes de presentación en la tarjeta atómica unificada `SoftwareCard`.
  * Toda tarjeta bajo la portada 16:9 (`<ArticleCover />`) implementa **única y estrictamente 3 secciones verticales limpias**:
    * **1. Metadatos / Contexto:** Una sola línea mono sobria (`text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate font-medium`).
    * **2. Titular Principal:** `text-base` (16px, `leading-snug`, `font-bold`), manteniendo altura uniforme sin saltos ni inflación visual.
    * **3. Extracto Descriptivo:** `text-xs` (12px, `text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5`).
  * **Cero Ruido Visual (Prohibición de Footers):** Se eliminaron los pies de tarjeta con líneas divisorias (`border-t`), listas secundarias de tecnologías apiladas y botones redundantes de acción (`Iniciar guía →`, `Leer más →`, `Ver proyecto →`), asegurando una experiencia visual limpia, consistente y simétrica en todas las cuadrículas y el carrusel.
* **Coherencia Editorial Total en las 8 Páginas de Categoría (`/[category]`):**
  * Las 8 páginas de listado (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`, `forum`) incorporan la misma estructura arquitectónica que el home `/`: cabecera editorial de marca [`SoftwareHeaderNav`](/software/widgets/software-header/ui/SoftwareHeaderNav.tsx) con la categoría activa resaltada en la cápsula, botón de retorno a la raíz (`/`) con la etiqueta localizada `Inicio` (ES) / `Home` (EN), barra de búsqueda integrada, contenedor unificado `glass-convex-panel` con sombra 2xl y el pie de página completo [`SoftwareFooter`](/software/widgets/software-footer/ui/SoftwareFooter.tsx).
  * **Motor Universal de Filtros Polimórficos (`CategoryFilterBar.tsx` en `shared/ui`):**
    * Erradicación total de categorías quemadas en cliente TSX. Todo el catálogo delega en el componente transversal reutilizable [`CategoryFilterBar`](/software/shared/ui/CategoryFilterBar.tsx) basado en el contrato único `FilterOption: { id: string, label: string, count?: number }`.
    * Consulta reactiva en tiempo real al backend NestJS (`GET /software/[modulo]/categories?lang=es|en`) con hooks desacoplados en la capa `entities/*` (`useNewsCategories`, `useBlogCategories`, `useForumCategories`, `useInfrastructureCategories`, `useCybersecurityCategories`, `useTutorialsCategories`, `useProjectsCategories`, `useAiCategories`).
    * **Identidad Neumórfica UI + Glassmorphic:** Pastillas con relieve extruido activo (`glass-btn-neumorphic`), skeletons pulsantes automáticos mientras SQLite calcula los conteos, badges numéricos discretos con la cantidad de publicaciones vivas, accesibilidad WCAG (`tablist`, `tab`, `aria-selected`) y paleta de acentos visuales por módulo (`cyan`, `blue`, `purple`, `emerald`, `amber`, `rose`).
    * **Arquitectura Adaptativa Responsive (Móvil vs Escritorio):** Para erradicar el desbordamiento horizontal en pantallas estrechas (`< 640px`), delega automáticamente en [`SoftwareSelect`](/software/shared/ui/SoftwareSelect.tsx) centrado con ancho uniforme `max-w-xs` (alineado simétricamente con el buscador), desplegando verticalmente todas las subcategorías con sus conteos; en pantallas de escritorio (`>= 640px`) despliega la fila horizontal de pastillas neumórficas completas. Esta mejora beneficia de forma unificada a las 8 páginas de catálogo de la plataforma.
  * **Selector Dropdown Táctil Neumórfico Reutilizable ([`SoftwareSelect.tsx`](/software/shared/ui/SoftwareSelect.tsx)):**
    * Componente atómico de presentación desacoplado en la Capa 6 (`shared/ui`) que sustituye de raíz los elementos `<select>` nativos del navegador por un popover flotante calibrado con **Neumorphism UI + Glassmorphism**.
    * **Gatillo Táctil (Trigger):** Botón con pastilla convexa (`glass-convex-panel`), micro-chevron `ChevronDown` animado que rota $180^\circ$ suavemente al desplegar, feedback táctil (`active:scale-[0.98]`) y borde vítreo fino.
    * **Panel Flotante Popover Inmune a Clipping (`createPortal`):** Se monta directamente en `document.body` mediante `createPortal` con posicionamiento flotante calculado dinámicamente (`getBoundingClientRect`) y `position: fixed` (`z-[999999]`), haciéndolo 100% inmune a ser recortado por cualquier contenedor padre con `overflow: hidden`, `overflow-x: auto` o restricciones de altura. Posee vidrio esmerilado denso (`backdrop-blur-2xl bg-white/95 dark:bg-[#12161f]/95 border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-1.5`), con micro-indicadores de selección (`Check`), badges opcionales, soporte para íconos y transiciones fluidas.
    * **Accesibilidad e Interactividad Completa (WCAG AA):** Cierre automático por clic exterior, cierre con tecla `Escape`, navegación completa por teclado (`ArrowDown`, `ArrowUp`, `Enter`, `Space`, `Home`, `End`) y roles ARIA (`role="combobox"`, `role="listbox"`, `role="option"`, `aria-expanded`). Se integra transversalmente en la navegación móvil de categorías ([`CategoryNav.tsx`](/software/widgets/category-nav/ui/CategoryNav.tsx)).
  * **Tarjetas con Banners de Portada (`ArticleCover` 16:9):** Todas las tarjetas de catálogo (`NewsCard`, `BlogCard`, `AiCard`, `SecurityCard`, `TutorialCard`, `ProjectCard`) integran en la parte superior el banner de portada en proporción 16:9 (`<ArticleCover />`), ya sea con su imagen real de alta resolución o con el banner procedural SVG temático neumórfico/glassmórfico de la categoría, estructuradas en grillas responsivas de 3 columnas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).

* **Lector Editorial Unificado y Migas de Pan Embebidas (`SoftwareArticleLayout.tsx`):**
  * Shell reutilizable para todos los artículos individuales con cabecera adaptada: el botón de retroceso de la barra superior apunta a su respectiva categoría de origen (`← Infraestructura`, `← Noticias`, etc.).
  * **Integración Editorial en el Encabezado del Artículo:** La ruta jerárquica (`[🏠 Inicio] › [Categoría]`) se encuentra integrada de forma limpia dentro del `<header>` de la propia tarjeta `<article>` (`glass-convex-panel`), unificada con la fecha y metadatos con micro-iconos de Lucide (`Home`, `ChevronRight`). Esto erradica el texto plano huérfano flotante, elimina la redundancia con el título H1 inferior y garantiza una jerarquía espacial sobria y estándar de la industria.
  * **Expansión de Lectura Inmersiva por Borde Interactivo Invisible (`cursor-col-resize`):** Para optimizar la concentración y ergonomía de lectura de artículos largos o con diagramas extensos, el borde derecho del cuadro de lectura incorpora un disparador sutil sin líneas invasivas (`hidden lg:block absolute top-0 -right-2 w-4 h-full cursor-col-resize`). Al pasar el cursor, adopta el puntero de ajuste de columna (`col-resize`); al hacer clic, colapsa la barra lateral (`aside`) y expande el artículo fluidamente de 8 a 12 columnas (`lg:col-span-12`). Al hacer clic nuevamente en el borde derecho del artículo expandido, restaura la barra lateral instantáneamente (`ArticleLayout.expandReading` / `ArticleLayout.restoreSidebar`).
* **Navegación Flotante Global "Scroll to Top" ([`ScrollToTopButton.tsx`](/software/shared/ui/ScrollToTopButton.tsx)):**
  * Botón flotante interactivo situado en la esquina inferior derecha (`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40`).
  * Detección reactiva de scroll con listener pasivo de alto rendimiento: permanece oculto en la cabecera y se revela con animación fluida de opacidad y elevación al desplazarse más de 300px hacia abajo.
  * Al activarlo, ejecuta un desplazamiento suave hasta la parte superior de la página (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  * Diseño Neumórfico UI + Glassmorphic (`.glass-convex-panel`), micro-interacciones táctiles al hover/active, icono `ArrowUp` de Lucide y soporte bilingüe (`Nav.scrollToTop`). Se integra a nivel global en el layout raíz `(software)/layout.tsx` para todas las páginas y subrutas de Software.
* **Barra Lateral de Recirculación Editorial ([`FeaturedPostsSidebarCard.tsx`](/software/widgets/article-layout/ui/FeaturedPostsSidebarCard.tsx)):**
  * Inspirado en la arquitectura editorial de **Marcus Hutchins (MalwareTech)** y alineado 100% con la estética **Neumorphism UI + Glassmorphism** de Software, sustituye las fichas estáticas de hardware por un widget dinámico de publicaciones destacadas de alta retención.
  * **Diseño Tipográfico Puro y Ultraligero:** Cada fila presenta metadatos contextuales ricos (`categoryMeta` o `tag`, ej. *95 estrellas GitHub*, *Anthropic — MCP_SERVER*, *Aviso HIGH — Ciberseguridad, Linux*) en tipografía mono (`text-[11px] font-mono text-slate-500 dark:text-zinc-400`) y titular en negrita con micro-transición cromática en hover, eliminando imágenes miniaturas pesadas o decorativas para priorizar la velocidad de lectura, el enfoque tipográfico y la sobriedad ejecutiva en todo el ancho del componente.
  * Integra filtrado contextual automático (`usePathname`) para nunca recomendar el artículo actualmente abierto y skeletons de carga fluidos integrados.
* **Directorio Tipográfico con Acordeón por Especialidad ([`ExploreTopicsSidebarCard.tsx`](/software/widgets/article-layout/ui/ExploreTopicsSidebarCard.tsx)):**
  * Inspirado en la navegación técnica de **Marcus Hutchins (MalwareTech)** y optimizado para la ergonomía del sidebar fijo (`sticky`), implementa un **árbol interactivo multi-apertura por cada especialidad**:
    * **Despliegue Multi-Apertura Concurrente (Sin Cierre Automático):** Al pulsar sobre cualquiera de las 8 especialidades (Ciberseguridad, Infraestructura, IA, Tutoriales, Proyectos, Blog, Noticias, Foros), la fila se expande suavemente revelando sus publicaciones sin colapsar ni cerrar automáticamente las demás especialidades previamente abiertas, permitiendo navegación y comparación simultánea fluida.
    * **Minimalismo Visual Sobrio:** Erradica iconos temáticos SVG innecesarios en la lista de categorías, conservando una presentación limpia y monocromática con el chevron indicador `ChevronRight` rotativo, el label de la categoría y la pastilla cóncava neumórfica (`glass-concave-panel px-2.5 py-0.5 rounded-md text-[11px] font-mono`) con conteo dinámico de artículos.
    * **Estética de Rama Técnica Centrada en Títulos (Tree / Branch View):** Al expandir una categoría, despliega un riel vertical con línea guía (`border-l-2 border-blue-500/25`) y **únicamente el título limpio de cada publicación** (alineado directamente sin puntos, viñetas ni metadatos intermedios para una lectura minimalista inmediata), finalizando con el enlace terminal limpio `Todo el Contenido ↗` (sin números redundantes, ya que el conteo vive exclusivamente en la pastilla cóncava superior).
  * Consolida la jerarquía editorial de 4 niveles en la barra lateral fija ([`SoftwareArticleLayout.tsx`](/software/widgets/article-layout/ui/SoftwareArticleLayout.tsx)): **1. Autor (`AuthorSidebarCard`) → 2. Publicaciones Destacadas (`FeaturedPostsSidebarCard`) → 3. Explorador de Especialidades (`ExploreTopicsSidebarCard`) → 4. Mantente Informado (`StayInformedCard`)**.

---

## 6. Eliminación de Datos Hardcodeados y Erradicación de Tiempos de Lectura

* **Cero Cadenas en Duro (100% i18n con `next-intl`):**
  * Todo texto de interfaz de usuario (etiquetas, placeholders, accesibilidad `aria-label`, títulos de tooltips, mensajes de error, estados de carga, empty states, botones de copia de código y diagramas, y badges de callout) se resuelve a través de `messages/es.json` y `messages/en.json`.
  * Namespaces dedicados y consistentes con paridad 1:1 estricta: `Metadata`, `Nav`, `Search`, `Common`, `Home`, `AuthorCard`, `Newsletter`, `Footer`, `Spotlight`, `CardActions`, `Filters`, `Detail`, `Markdown`, `News`, `Blog`, `Forum`, `Ai`, `Cybersecurity`, `Tutorials`, `Projects`, `Infrastructure`.
  * Datos estructurados `Schema.org` ([`SoftwareJsonLd.tsx`](/software/shared/seo/SoftwareJsonLd.tsx)) dinámicamente localizados según el `locale` activo.
* **Erradicación Total de "Tiempos de Lectura":**
  * Se eliminaron por completo las estimaciones de lectura ("5 min lectura", "readingTime") tanto en la base de datos `software.sqlite` (entidades TypeORM), en los esquemas y corpus JSON, como en todos los componentes de la interfaz (`NewsCard`, `BlogCard`, `TutorialCard`, etc.). La plataforma sigue una filosofía de ingeniería y referencia directa sin métricas artificiales.
* **Slugs Canónicos Bilingües:**
  * Cada recurso mantiene el mismo `slug` canónico para español e inglés en la base de datos (`IDX_<tabla>_slug_lang`), permitiendo alternar de idioma con `LanguageToggle` de manera instantánea sin redirecciones 404 ni roturas de navegación.
* **Autor 100% Dinámico desde Base de Datos y Micro-Avatar Editorial:**
  * Los 8 módulos temáticos (`infrastructure`, `tutorials`, `projects`, `cybersecurity`, `ai`, `blog`, `news`, `forum`) leen el autor estrictamente de la entidad devuelta por la base de datos (`author` en `software.sqlite`).
  * Erradicación total de fallbacks o valores por defecto hardcodeados tanto en las páginas `[slug]/page.tsx` como en el layout maestro ([`SoftwareArticleLayout.tsx`](/software/widgets/article-layout/ui/SoftwareArticleLayout.tsx)).
  * La cabecera editorial integra un micro-avatar circular de perfil ($20\times 20\text{px}$, `/software/logo/perfil.jpg`) a la izquierda del nombre del autor con borde suave y sombra neumórfica.
  * En el módulo de IA (`/ai`), el proveedor tecnológico (`provider`, ej. *Anthropic*) se aísla en una insignia técnica (`badge`) independiente, distinguiéndolo claramente del autor del artículo.

---

## 7. Suite Editorial y Renderizado de Contenido Técnico (Markdown Enriquecido)

* **Almacenamiento Desacoplado en Base de Datos (`software.sqlite`):**
  * El contenido técnico de todas las categorías se almacena como texto plano Markdown estándar (`contentMarkdown TEXT` o `content TEXT`).
  * **Cero Carga en el Servidor (VPS 1 GB RAM):** El backend en NestJS se limita a servir el texto crudo sin transformaciones pesadas ni manipulación de árboles sintácticos en el servidor.
  * **Seguridad (Inmunidad XSS):** No se almacena HTML crudo en base de datos. El parsing lo realiza el cliente de forma controlada y segura mediante componentes React.
* **Componentes Modulares Especializados (`shared/markdown/components/`):**
   1. **Diagramas Vectoriales Multidiagrama Adaptativos Estilo Mermaid Chart ([`MermaidBlock.tsx`](/software/shared/markdown/components/MermaidBlock.tsx)):**
      * **Detección Tipificada Robusta:** Analiza el bloque ignorando comentarios (`%%`) y frontmatter YAML (`---`) para identificar automáticamente la familia del diagrama (`sequenceDiagram`, `flowchart` / `graph`, `classDiagram`, `erDiagram`, `stateDiagram-v2`, `gitGraph`, `architecture-beta`, `c4Context`, `mindmap`, `pie`, etc.).
      * **Cabecera Técnica Minimalista (Acción Directa de Inspección):** Muestra el título específico del tipo de diagrama traducido vía `next-intl` con su icono temático de Lucide, y a la derecha el botón de acción minimalista con icono de alta precisión (`Maximize2` para expandir en visor inmersivo) con tooltip nativo accesible, manteniendo máxima sobriedad y elegancia sin saturar la cabecera ni incluir acciones redundantes como copiar en diagramas puramente visuales.
      * **Renderizado Universal en Cliente (Mermaid 12):** Motor configurado con `look: 'neo'`, temas oficiales nativos (`theme: 'dark'` en modo oscuro y `'neutral'` en claro) y `themeVariables` de alta definición calibradas para Neumorphism / Dark Luxury, curvas orgánicas `basis` en flowcharts y tipografía uniforme ($13\text{px}$ a $14\text{px}$).
      * **Arquitectura Híbrida de Primera Clase (Ajuste Fluido en Artículo + Visor de Inspección Forense a Pantalla Completa):**
        - *En el Artículo (Móvil y Escritorio):* El diagrama se muestra siempre **completo de inicio a fin** (`max-w-full mx-auto`), sin recortes a la izquierda ni barras de scroll forzadas que interrumpan el flujo de lectura. En escritorio respeta su ancho intrínseco 1:1 (`targetInlineWidth` hasta $1020\text{px}$) centrado simétricamente sin agigantarse.
        - *Visor Inmersivo Interactivo a Pantalla Completa (`createPortal` + Pan & Zoom):* Al pulsar el botón de expandir o hacer click en el diagrama (`cursor-zoom-in`), se monta un lienzo modal directamente en `document.body` mediante `createPortal`, cubriendo el $100\%$ de la pantalla (`z-[999999]`) con vidrio esmerilado de alta fidelidad (`backdrop-blur-2xl bg-slate-100/85 dark:bg-black/85`).
          * **Aislamiento Total de Scroll del Fondo:** Previene el *scroll chaining* capturando de forma activa los eventos de rueda (`wheel`) con `e.preventDefault()`, al tiempo que bloquea temporalmente el scroll en `document.body` y `document.documentElement` con `overflow: hidden` y `touchAction: none`.
          * **Zoom Infinito y Suave con Rueda del Ratón:** Permite ampliar diagramas complejos y extensos desde $30\%$ hasta $500\%$ de su escala natural sin pérdida de nitidez vectorial.
          * **Arrastre y Zoom Multitáctil de Alta Precisión (Pinch-to-Zoom & Touch Pan Nativo a 120 FPS):** Soporta arrastre directo con el ratón (`cursor-grab` $\rightarrow$ `cursor-grabbing`) y gestos multitáctiles en móviles mediante listeners nativos no pasivos (`passive: false`) con `touch-action: none` y blindaje de eventos en nodos internos del SVG (`pointer-events-none`). Permite pellizcar con dos dedos (*pinch-to-zoom*) de forma continua y orgánica, sin saltos discretos por redondeo ni transiciones CSS que interfieran durante el arrastre, con recálculo dinámico del centroide y transición transparente al levantar un dedo sin congelamientos.
          * **Barra Flotante Unificada Superior Derecha (Glassmorphic Toolbar):** En lugar de dispersar elementos por las esquinas y la parte inferior, consolida en una sola píldora elegante de vidrio esmerilado en la esquina superior derecha:
            - **Contexto del Diagrama:** Icono técnico específico y título localizado.
            - **Controles Simétricos de Zoom:** `ZoomOut`, indicador interactivo de porcentaje (clic para volver al $100\%$) y `ZoomIn`.
            - **Botón de Cierre:** Icono `X` accesible con highlight sutil en hover.
            - **Lienzo $100\%$ Libre:** Toda la pantalla queda completamente despejada sin barras inferiores ni elementos dispersos en la izquierda. Soporta atajos (`Escape` o clic en el fondo para cerrar, `+` / `-` para zoom, `0` o doble clic en el lienzo para centrar).
   2. **Bloques de Código de Alta Precisión con Cabecera Inteligente ([`CodeBlock.tsx`](/software/shared/markdown/components/CodeBlock.tsx)):**
     * Resaltado de sintaxis profesional con `prismjs` para 13 lenguajes esenciales (`TypeScript`, `TSX`, `JavaScript`, `JSX`, `Bash`, `JSON`, `YAML`, `SQL`, `Python`, `Nginx`, `Docker`, `Markdown`, `INI`).
     * **Cabecera Inteligente Contextual y 100% Localizada:** Erradica los semáforos de colores decorativos y las etiquetas toscas de "Texto Plano". Detecta automáticamente nombres de archivo y rutas en comentarios de la primera línea (ej. `pm2.config.js`, `nginx/jorgedoicela.com.conf`) para orientar didácticamente al lector; si se trata de scripts o comandos muestra `Bash` / `Shell`, y para logs de error o salida de comandos muestra `Terminal / Salida` (ES) / `Terminal / Output` (EN) vía `t('terminal')`.
     * **Botón Interactivo Minimalista (Solo Icono):** Muestra exclusivamente el micro-icono de Lucide (`Copy` / `Check`) con feedback mediante tooltip nativo accesible y micro-interacción táctil, eliminando etiquetas de texto redundantes y manteniendo simetría total con la cabecera de diagramas.
     * Paleta calibrada Obsidian / Dark Luxury integrada en `globals.css` (funciones en ámbar, cadenas en esmeralda, palabras clave en índigo, comentarios en cursiva).
     * Soporte para código en línea (`InlineCode`).
  3. **Tablas Técnicas de Ingeniería Enterprise Data-Grid Pro ([`TableBlock.tsx`](/software/shared/markdown/components/TableBlock.tsx)):**
      * Marco de cristal convexo (`glass-convex-panel`) con borde vítreo perimetral y sombra de elevación suave (`shadow-lg`).
     * Cabecera `thead` con sutil desenfoque (`backdrop-blur-md`), línea guía inferior `border-blue-500/30` y tipografía mono técnica en mayúsculas (`text-[11px] uppercase tracking-wider font-bold`).
     * **Diferenciación Estructural de Clave/Parámetro:** La primera columna (`td:first-child`, ancho fijo `28%`) posee tipografía mono seminegrita, fondo sutil contrastado (`bg-black/[0.015] dark:bg-white/[0.015]`) y borde divisorio vertical para identificar inmediatamente la clave del parámetro frente a los valores y detalles.
     * Filas con transición fluida de iluminación interactiva al pasar el cursor (`hover:bg-blue-500/[0.035] dark:hover:bg-blue-400/[0.04]`).
  4. **Paneles de Resumen Técnico y Callouts Blueprint Glass ([`CalloutBlock.tsx`](/software/shared/markdown/components/CalloutBlock.tsx)):**
     * **Diseño Simétrico Neumórfico / Glassmórfico Unificado:** Todos los paneles de resumen (`post.architectureOverview`, `post.remediation`), directivas de alerta de GitHub (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`) y citas se renderizan bajo la misma estructura arquitectónica limpia y simétrica: marco de cristal convexo (`glass-convex-panel`), esquinas simétricas (`rounded-2xl`), gradiente de color sutil por tipo, titular semántico en mayúsculas monospace (`text-[11px] font-mono font-bold tracking-wider uppercase`) y cuerpo de texto nítido sin forzar cursivas ni barras laterales asimétricas (`border-l-4`), erradicando cualquier inconsistencia visual en todo el subdominio.
  5. **Glosario Terminológico Interactivo ([`GlossaryTermPopover.tsx`](/software/shared/markdown/components/GlossaryTermPopover.tsx)):**
      * **Detección Léxica Desacoplada (100% Base de Datos):** Los artículos consumen dinámicamente los términos de `software.sqlite` (`glossary_terms`) mediante `serverGet<GlossaryTerm[]>('/software/glossary?lang=' + locale)`.
      * **Regla de la Primera Mención (Anti-Fatiga Visual):** Para evitar sobrecarga cognitiva (*efecto árbol de navidad*), cada concepto técnico se vuelve interactivo **únicamente en su primera aparición en el artículo**. Las siguientes ocurrencias permanecen como texto o código limpio regular.
      * **Soporte de Alias Bilingüe y Límites de Palabra (`\b`):** Reconoce variantes en inglés y español (ej. `DROP`, `REJECT`, `firewall`, `cortafuegos`, `Netfilter`) sin falsos positivos ni coincidencias parciales.
      * **Diseño Neumorphism UI + Glassmorphism y Accesibilidad WCAG 2.1 AA:** Presenta un subrayado punteado W3C (`border-b-2 border-dotted border-blue-500/70`) tanto en texto plano como en `InlineCode`. Al hacer clic o navegar con `Tab` + `Enter`, despliega un popover flotante de cristal con pastilla de categoría, definición didáctica concisa y claves de arquitectura, con cierre suave al pulsar afuera o mediante tecla `Escape`.
* **Orquestador Central ([`MarkdownRenderer.tsx`](/software/shared/markdown/MarkdownRenderer.tsx)):**
  * Conecta `react-markdown`, `remark-gfm` y el plugin AST nativo `createRemarkGlossary` con los componentes de la suite, garantizando una experiencia editorial homogénea en todas las subrutas `[slug]/page.tsx`.
  * **Arquitectura AST Determinista y Cero Hydration Mismatches:** El enriquecimiento de glosario y la regla de la primera mención operan a nivel de Abstract Syntax Tree (MDAST) mediante el plugin `createRemarkGlossary` antes del render de React. Esto erradica el uso de `useRef` mutables en la fase de renderizado, asegurando compatibilidad estricta con el modo concurrente y StrictMode de React 19 y garantizando una paridad 1:1 absoluta entre el HTML del servidor (SSR) y la hidratación del cliente.
  * **Defensa en Profundidad Semántica (WCAG 2.1 / SEO):** Dado que la cabecera editorial (`SoftwareArticleLayout`) es el único `<h1>` del documento, cualquier encabezado `h1` que provenga del cuerpo Markdown se degrada automáticamente a un `<h2>` semántico estilizado, blindando el DOM contra duplicaciones de H1.
  * **Protección Estricta de Código:** El enriquecimiento de glosario opera exclusivamente sobre nodos de texto editorial en párrafos (`p`), listas (`li`) e inline snippets (`InlineCode`), dejando 100% intactos los bloques de código fuente (`CodeBlock`) y diagramas vectoriales (`MermaidBlock`).

---

## 8. Arquitectura de Activos Estáticos e Imágenes (`public/software/images/`)

Para garantizar escalabilidad, trazabilidad y cero colisión de archivos a medida que crezca el catálogo editorial, los recursos visuales se organizan estrictamente bajo `frontend/web/public/software/images/`, alineados 100% con la directiva de caché estático de Nginx en Debian 13 (`location ^~ /software/images/`):

```text
public/software/images/
├── covers/                      # Portadas 16:9 oficiales (1 por publicación, nombrada con el slug)
│   ├── news/                    # ej: /software/images/covers/news/nextjs-16.jpg
│   ├── tutorials/               # ej: /software/images/covers/tutorials/terminal-ssh-websockets.jpg
│   ├── blog/                    # Portadas de ensayos de arquitectura
│   ├── cybersecurity/           # Portadas de avisos de seguridad
│   ├── ai/                      # Portadas de modelos y herramientas IA
│   ├── infrastructure/          # Portadas de guías y análisis forenses
│   └── projects/                # Portadas de proyectos showcase
│
├── content/                     # Imágenes internas de contenido embebidas en Markdown y StepWizard
│   ├── news/[slug]/             # Capturas e infografías del artículo
│   ├── tutorials/[slug]/        # Pasos ilustrados del StepWizard
│   ├── blog/[slug]/             # Diagramas arquitectónicos complementarios
│   ├── cybersecurity/[slug]/    # Diagramas de ataque/defensa, logs
│   ├── ai/[slug]/               # Benchmarks, topologías de modelos
│   ├── infrastructure/[slug]/   # Topologías de red, métricas htop/systemd
│   └── projects/[slug]/         # Capturas de la UI del proyecto
│
└── placeholders/                # Gráficos procedurales y SVGs de respaldo
    └── default-software-cover.svg
```

* **Nomenclatura basada en `slug`:** Las portadas coinciden exactamente con el `slug` del artículo (`covers/<categoría>/<slug>.<ext>`), garantizando rutas predecibles en base de datos SQLite y corpus JSON.
* **Encapsulación por Artículo:** Las imágenes internas de texto se almacenan en una carpeta propia por slug (`content/<categoría>/<slug>/`), facilitando la depuración o retiro limpio de archivos huérfanos cuando un artículo sea despublicado.
* **Compatibilidad de Infraestructura Nginx:** Al concentrar los recursos bajo `images/`, el servidor Nginx en AWS Lightsail cachea automáticamente todos los recursos visuales mediante el alias `alias /home/admin/jorge_doicela/frontend/web/public/software/images/;`, con encabezados `Cache-Control: "public, no-transform"` y expiración a 30 días sin sobrecargar el runtime Node.js.

---

## 7. Motor de Contenido Técnico Markdown y Popovers de Glosario

### 7.1 Arquitectura de Renderizado Markdown Determinista
El componente `MarkdownRenderer` (`shared/markdown/MarkdownRenderer.tsx`) procesa artículos técnicos enriquecidos mediante un pipeline Unified/Remark/Rehype:
1. **Transformación AST con Remark Plugin (`createRemarkGlossary`):**
   - Transforma nodos de texto en el Árbol de Sintaxis Abstracta (AST) antes de la serialización HTML.
   - Aplica detección de palabras clave del glosario técnico de forma estricta (una sola ocurrencia por término por documento) de manera 100% determinista entre SSR y el cliente.
   - Excluye títulos (`h1`-`h6`), enlaces (`a`) y bloques de código de ser enlazados a glosario para mantener limpieza visual.
2. **Cumplimiento Estricto HTML5 Phrasing Content:**
   - La palabra clave interactiva dentro de párrafos `<p>` se renderiza mediante un elemento `<button>` accesible (`aria-haspopup="dialog"`).
   - El contenido flotante del popover nunca se inyecta directamente dentro del árbol `<p>`, evitando advertencias de hidratación de React por anidación inválida de bloques.

### 7.2 Arquitectura Flotante Desacoplada (`GlossaryTermPopover`)
Para garantizar que los popovers explicativos nunca se corten por límites de pantalla o propiedades CSS ancestros (`overflow: hidden`, `clip-path` en callouts o tarjetas glassmórficas):
* **React Portal (`createPortal(..., document.body)`):**
  - Desacopla físicamente el contenedor del diálogo flotante (`role="dialog"`) del contenedor padre en el DOM, montándolo directamente en la raíz del documento.
* **Geometría Fija con Detección Bidireccional (Viewport Collision Detection):**
  - Calcula `triggerRect = triggerRef.current.getBoundingClientRect()` en tiempo real.
  - Compara el espacio disponible superior (`spaceAbove`) e inferior (`spaceBelow`) contra la altura del popover. Si el término está cerca de la parte superior del viewport, el popover realiza un *flip* automático a `placement="bottom"`.
  - Aplica un *clamp* defensivo en coordenadas verticales (`top`) y horizontales (`left`), manteniendo un margen mínimo de seguridad de 16px con respecto a los bordes de la pantalla.
* **Sincronización Reactiva:**
  - Se vincula a eventos de `scroll` (en fase de captura) y `resize` de la ventana para recalcular las coordenadas de manera fluida y continua mientras el popover esté abierto.




