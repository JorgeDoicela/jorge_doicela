# DoicelaDev - Frontend y Plataforma Tecnológica (Next.js)

Este documento detalla la arquitectura macro y micro, componentes, categorías temáticas y diseño de **DoicelaDev** (`doiceladev.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro y Enrutamiento Canónico Limpio:**
> * **Subdominio Canónico:** `doiceladev.jorgedoicela.com` (o `http://doiceladev.localhost:3001` en desarrollo local).
> * **URLs Limpias Canónicas de Primer Nivel:** La raíz del subdominio es `/` y las secciones son rutas directas (`/news`, `/blog`, `/forum`, `/ai`, `/cybersecurity`, `/tutorials`, `/projects`, `/infrastructure`).
> * **Redirección Canónica 308 Permanente:** En `src/middleware.ts`, cualquier solicitud en el subdominio con el prefijo redundante `/doiceladev` o `/doiceladev/*` se redirige automáticamente mediante HTTP 308 a la ruta limpia correspondiente (`/` o `/*`), eliminando URLs duplicadas en el navegador y protegiendo el SEO.
> * **Reescritura Interna Transparente:** Next.js reescribe internamente las rutas limpias al directorio físico `frontend/web/src/app/(doiceladev)/doiceladev/*` para evitar colisiones de rutas a nivel de compilación con `(landing)`, `(portfolio)` y `(kartex)` bajo el runtime consolidado de 1 GB de RAM.
> * **Compatibilidad Localhost Directa:** Solicitudes directas sin subdominio a `localhost:3001/doiceladev` siguen respondiendo 200 OK directamente.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`, VPS 1 GB RAM).
> * **Aislamiento de Dominio:** Estilos independientes en `(doiceladev)/globals.css`. Cero importaciones de otros subdominios.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD Canónico en 6 Capas):**
>   * `providers/`: Envoltorios de montaje global en layout (`theme-provider`).
>   * `shared/`: UI Kit agnóstico (`DoiceladevCard`, `BackToPortalButton`, `ScrollToTopButton`, `ArticleCover`), suite Markdown (`MarkdownRenderer`, bloques de código/Mermaid/tablas/callouts), SEO (`DoiceladevJsonLd`), utilitarios de red (`api`, `serverFetch`, `fetchJson`) y tipos base.
>   * `entities/`: 8 dominios temáticos (`news`, `blog`, `forum`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`) y feed consolidado (`portal`), cada uno con sus modelos, tipos, hooks API y componentes de presentación (`NewsCard`, etc.).
>   * `features/`: Acciones e interactividad del usuario (`spotlight-search`, `forum-reply`, `language-toggle`, `theme-toggle`).
>   * `widgets/`: Bloques visuales complejos y layouts (`doiceladev-header`, `doiceladev-footer`, `category-nav`, `featured-carousel`, `article-layout`, `page-layout`).
> * **Internacionalización Integral (i18n):** Soporte bilingüe completo (`es` / `en`) mediante `next-intl` en `messages/{es,en}.json` para las 8 categorías, cabecera `DoiceladevHeaderNav`, badges, metadatos, y consumo bilingüe dinámico hacia el backend vía `?lang=${locale}`.
> * **Jerarquía de Componentes:** Componentes encapsulados localmente con sus propios hooks y tipos.
> * **Estética Neumorphism UI + Glassmorphism y Tipografías Locales:** Paneles táctiles cóncavos/convexos combinados con desenfoques vítreos translúcidos, reflejos esmerilados y sombras suaves superpuestas. Utiliza exclusivamente sus tipografías locales auto-hospedadas bajo `(doiceladev)/fonts/` (`PlusJakartaSans-Variable.woff2`, `PlusJakartaSans-Italic-Variable.woff2`, `GeistMono-Variable.woff2`) cargadas mediante `next/font/local` bajo licencia **SIL OFL 1.1** (Zero-External Network Fonts). Cero consultas a Google Fonts o CDNs.

---

## 2. Estructura de Rutas y FSD Canónico

```text
frontend/web/src/app/(doiceladev)/
├── fonts/                            # Tipografías locales autocontenidas (Plus Jakarta Sans y Geist Mono)
├── globals.css                       # Estilos aislados de DoicelaDev (Neumorphism UI + Glassmorphism: Titanio Claro / Obsidiana Oscuro)
├── layout.tsx                        # Layout raíz del subdominio (localFont + ThemeProvider + NextIntlClientProvider)
├── messages/                         # Diccionarios i18n
│   ├── es.json
│   └── en.json
│
├── providers/                        # CAPA 1 (APP): Proveedores de Tema y Contexto Global
│   ├── theme-provider.tsx            # Wrapper local de next-themes
│   └── index.ts
│
├── shared/                           # CAPA 6: UI Kit, Markdown, SEO, Lib y Tipos Agnósticos
│   ├── ui/                           # DoiceladevCard, BackToPortalButton, ScrollToTopButton, ArticleCover
│   ├── markdown/                     # MarkdownRenderer + CodeBlock, MermaidBlock, TableBlock, CalloutBlock
│   ├── seo/                          # DoiceladevJsonLd (Schema JSON-LD)
│   ├── lib/                          # api, serverFetch, fetchJson
│   └── types/                        # spotlight.ts
│
├── entities/                         # CAPA 5: Modelos, Hooks API, Tarjetas de Entidad y Borradores Markdown
│   ├── news/                         # NewsCard, NewsGrid, useNews, drafts/, types.ts, index.ts
│   ├── blog/                         # BlogCard, BlogGrid, useBlog, drafts/, types.ts, index.ts
│   ├── forum/                        # TopicCard, useForum, drafts/, types.ts, index.ts
│   ├── ai/                           # AiCard, AiGrid, useAi, drafts/, types.ts, index.ts
│   ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, drafts/, types.ts, index.ts
│   ├── tutorials/                    # TutorialCard, TutorialGrid, TutorialStepWizard, useTutorials, drafts/, types.ts, index.ts
│   ├── projects/                     # ProjectCard, ProjectGrid, useProjects, drafts/, types.ts, index.ts
│   ├── infrastructure/               # InfrastructureCard, InfrastructureGrid, useInfrastructure, drafts/ (es/en .md), types.ts, index.ts
│   ├── portal/                       # DoiceladevPortalFeed, useDoiceladevPortal, types.ts, index.ts
│   ├── categories/                   # Hub de Categorías (Nivel 2): useCategoriesHub, useCategoryArticles, types.ts, index.ts
│   └── tags/                         # Hub de Etiquetas (Nivel 3): useTagsHub, useTagArticles, types.ts, index.ts
│
├── features/                         # CAPA 4: Acciones e Interactividad del Usuario
│   ├── spotlight-search/             # SpotlightProvider, useSpotlight, SpotlightModal (Cmd + K, indexación y búsqueda por tags)
│   ├── forum-reply/                  # ForumReplyForm, ForumSection
│   ├── language-toggle/              # LanguageToggle (ES / EN)
│   └── theme-toggle/                 # ThemeToggle (Titanio / Obsidiana)
│
├── widgets/                          # CAPA 3: Bloques Visuales Autónomos Complejos y Shells
│   ├── doiceladev-header/            # DoiceladevHeaderNav (Lupa conectada a useSpotlight)
│   ├── doiceladev-footer/            # DoiceladevFooter (Enlaces a /categories y /tags)
│   ├── category-nav/                 # CategoryNav (Selector unificado de 8 categorías)
│   ├── featured-carousel/            # FeaturedCarousel (Autoplay + Neumorphic Controls)
│   ├── article-layout/               # DoiceladevArticleLayout + Sidebars (Author, ExploreTopics, PopularTags, FeaturedPosts, StayInformed)
│   └── page-layout/                  # DoiceladevPageLayout
│
└── doiceladev/                       # CAPAS 2 & 1: Enrutamiento y Páginas del App Router de Next.js
    ├── page.tsx                      # Vista principal de DoicelaDev (Bento Grid + Feed Principal)
    ├── news/                         # Catálogo y lector de noticias (/news, /news/[slug])
    ├── blog/                         # Catálogo y lector de artículos (/blog, /blog/[slug])
    ├── forum/                        # Catálogo e hilo de discusión (/forum, /forum/[slug])
    ├── ai/                           # Directorio y fichas técnicas (/ai, /ai/[slug])
    ├── cybersecurity/                # Matriz de avisos y remediación (/cybersecurity, /cybersecurity/[slug])
    ├── tutorials/                    # Malla de tutoriales y asistente interactivo (/tutorials, /tutorials/[slug])
    ├── projects/                     # Showcase de proyectos (/projects, /projects/[slug])
    ├── infrastructure/               # Guías y especificaciones de servidores (/infrastructure, /infrastructure/[slug])
    ├── categories/                   # Directorio (/categories) y Hub de Categoría (/categories/[slug])
    └── tags/                         # Directorio (/tags) y Hub de Etiqueta (/tags/[slug])
```

---

## 3. Las 8 Especialidades de DoicelaDev (Nivel 1 de la Taxonomía)

Cada módulo físico corresponde al **Nivel 1** del modelo taxonómico del sistema. En tarjetas y catálogos, la línea superior de metadatos (`categoryMeta`) combina estrictamente el **Nivel 1 (Módulo)** con el **Nivel 2 (Categoría)**:

1. **Tutoriales y Guías (`tutorials`):** Manuales paso a paso con código reproducible y asistente StepWizard.
2. **Noticias (`news`):** Novedades y actualidad del desarrollo de software y tecnología con alertas breaking.
3. **Inteligencia Artificial (`ai`):** Modelos de razonamiento, agentes, servidores MCP y herramientas de IA.
4. **Ciberseguridad (`cybersecurity`):** Avisos con matriz de severidad (LOW a CRITICAL), guías de bastionado y remediación.
5. **Infraestructura (`infrastructure`):** Servidores Linux, topologías cloud (AWS Lightsail), arquitectura en 1 GB de RAM, seguridad perimetral mTLS, rate limiting en Nginx, sandboxing en Docker y CI/CD.
6. **Proyectos (`projects`):** Catálogo de sistemas, librerías y herramientas desarrolladas por Jorge con enlaces demo/repo.
7. **Blog (`blog`):** Ensayos profundos sobre arquitectura de software, patrones de diseño y buenas prácticas.
8. **Foros (`forum`):** Espacio comunitario para debates técnicos, preguntas y respuestas anidadas.

> **Regla Universal de Metadatos (`categoryMeta`):** Todas las tarjetas muestran exclusivamente `[MÓDULO] • [CATEGORÍA]` (ej. `TUTORIALES • WEB`, `PROYECTOS • WEB`, `INFRAESTRUCTURA • CONTAINERS`). La plataforma opera bajo una taxonomía canónica universal de 3 niveles (Nivel 1: Módulo, Nivel 2: Categoría, Nivel 3: Tags), habiendo erradicado por completo el concepto de Nivel 4 y atributos aislados de la jerarquía visual de tarjetas.

---

## 4. Internacionalización, SEO Dinámico y Dossier para IA (next-intl, Schema.org & GEO)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Doiceladev.Metadata` en `src/messages/es.json` y `src/messages/en.json`, con tarjetas completas Open Graph y Twitter.
* **Datos Estructurados Schema.org (`DoiceladevJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `WebSite` con desglose de las 8 áreas tecnológicas (`hasPart`) para indexación en buscadores web e IA.
* **Dossier Especializado para IA (`public/doiceladev/llms.txt`):** Desglose detallado de las 8 áreas de conocimiento, tutoriales StepWizard y proyectos servido en `doiceladev.jorgedoicela.com/llms.txt`.
* **Manifiesto PWA Independiente (`public/doiceladev/manifest.json`):** Configuración de aplicación web independiente con tema `#0b0f19`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://doiceladev.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(doiceladev)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.
* **Diccionarios UI Localizados:** Soporte para traducción de nombres de las 7 categorías, placeholders del buscador y etiquetas de estado.

---

## 5. Componentes de Interfaz y Estética Editorial Tech (Referencia MalwareTech + Neumorphism Pro)

* **Fusión Neumórfica y Vítrea Calibrada:** Contenedores y tarjetas construidos sobre `.glass-convex-panel` y `.glass-concave-panel` que combinan sombras cóncavas (efecto hendido) y convexas (relieve extruido) con fondos de cristal esmerilado translúcido (`backdrop-filter: blur(16px)`), gradientes lumínicos diagonales y bordes perimetrales vítreos.
* **Cabecera Editorial de Marca Centralizada:**
  * Imagotipo compuesto de alta nitidez y escala calibrada: icono [`logo_blanco.png`](/doiceladev/logo/logo_blanco.png) a la izquierda y bloque tipográfico [`doiceladev.png`](/doiceladev/logo/doiceladev.png) a la derecha, asegurando una proporción armónica y legibilidad impecable.
  * **Enrutamiento Determinístico del Logotipo:** El logotipo completo está enlazado a la raíz del subdominio de DoicelaDev (`/` o `http://doiceladev.localhost:3001/` en desarrollo local y `https://doiceladev.jorgedoicela.com` en producción). Además, al hacer clic sobre el imagotipo mientras se está en la página principal, reinicia automáticamente la categoría a `'all'` (*Todo el Contenido*), restaurando la vista principal de destacados y últimas publicaciones.
  * Titular semántico accesible para SEO (`h1.sr-only`), eliminando el texto visual redundante para dar protagonismo absoluto al diseño del imagotipo.
  * Fila limpia de iconos de redes sociales libres sin contenedores invasivos (`w-6 h-6`, 24px) en color blanco nítido: LinkedIn, GitHub, YouTube, TikTok y Email de contacto, situados a proximidad inmediata bajo el logotipo (`text-white hover:text-zinc-300`).
  * **Barra de Navegación y Control Unificada a Ancho Completo (`w-full glass-concave-panel`):**
    * Encapsulada dentro de un único contenedor cóncavo continuo (`glass-concave-panel`) que abarca el 100% del ancho del layout, alineándose exactamente con los márgenes exteriores de las tarjetas de la grilla de publicaciones:
      * **Flanco Izquierdo:** Botón adaptativo de retorno ([`BackToPortalButton`](/doiceladev/shared/ui/BackToPortalButton.tsx)): enlaza al portal central `jorgedoicela.com` desde la raíz con etiqueta `Portal`, o a la raíz del subdominio (`/`) desde páginas de categoría con la etiqueta internacionalizada `Inicio` (ES) / `Home` (EN).
      * **Centro:** Menú de categorías ([`CategoryNav`](/doiceladev/widgets/category-nav/ui/CategoryNav.tsx)) con prop `bare` para integrarse limpiamente sin contenedores cóncavos redundantes, cubriendo las 8 áreas temáticas (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `forum`, `projects`, `infrastructure`). Funciona bajo **arquitectura canónica URL-driven**: cada pestaña enlaza directamente a su módulo dedicado (`/news`, `/blog`, `/infrastructure`, etc.), permitiendo que el usuario experimente el módulo completo con sus propios filtros, buscadores y controles avanzados sin estados efímeros en memoria que oculten las rutas.
      * **Flanco Derecho:** Utilidades integradas con el botón de lupa (buscador modal Spotlight `⌘K`) y el conmutador de idioma ([`LanguageToggle`](/doiceladev/features/language-toggle/ui/LanguageToggle.tsx) ES/EN).
* **Portadas Visuales de Alta Precisión e Inteligencia Temática (`ArticleCover.tsx` en 16:9):**
  * Soporta imágenes estáticas con `next/image` y fallback procedural dinámico por categoría temática (`category` / `topicCategory`):
    * **Servidores (`servers`):** Nodos bare-metal y topologías físicas en gradientes esmeralda (`from-emerald-950/70`).
    * **Redes y mTLS (`networking`):** Topologías de red mallada y perímetros en gradientes cian (`from-teal-950/70 via-slate-900 to-cyan-950`).
    * **Contenedores (`containers`):** Arquitectura de micro-contenedores y cgroups en gradientes índigo/azul cobalto.
    * **CI/CD (`ci_cd`):** Pipelines continuos, automatización y ramas en gradientes violeta/fucsia.
    * **Hardening (`hardening`):** Escudos de blindaje, mTLS y sockets seguros en gradientes ámbar/cobre con resplandor dorado.
    * **Cloud (`cloud`):** Topologías de nube híbrida y orquestación systemd en gradientes azul cielo.
  * Refracción vítrea, texturas de ingeniería (`.tech-grid-bg`) y badges animados de `★ DESTACADO` en artículos de alta prioridad editorial.
* **Sistema de Relevancia y Ordenamiento Inteligente Enterprise (`sortBy`):**
  * Tanto la página de categoría `/infrastructure` como el Portal de DoicelaDev integran un algoritmo de ponderación matemática en el backend:
    $$\text{SmartScore} = (\text{featured} \times 1000) + (\text{orderPriority} \times 20) + (\text{likes} \times 4) + (\text{views} \times 1.5)$$
  * Esto garantiza que los artículos insignia (como el análisis forense del incidente P1 y la arquitectura en 1 GB de RAM) encabecen la experiencia del usuario, evitando el desplazamiento errático de nuevas publicaciones al fondo.
  * El usuario dispone de una barra de control interactiva multi-criterio: *★ Relevancia Arquitectónica*, *Más Recientes*, *Más Populares* y *Mayor Complejidad*.
* **Portada General de Todo el Contenido: Podio Top 3 Global y Feed Cronológico Unificado:**
  * **Podio de Destacados (Top 3):** No está restringido artificialmente a categorías fijas; evalúa el `smartScore` consolidado entre todas las áreas para seleccionar las 3 publicaciones insignia de mayor impacto global de la plataforma.
  * **Feed de Últimas Publicaciones:** Unifica todas las publicaciones restantes en una lista polimórfica ordenada estrictamente por fecha de publicación descendente (`publishedAt DESC`), garantizando un flujo vivo, orgánico y fresco donde cada nueva publicación (sea tutorial, aviso de seguridad, servidor o noticia) aparece de inmediato en la parte superior.
* **Normalización Arquitectónica Universal de 3 Secciones (`DoiceladevCard.tsx`):**
  * Para garantizar simetría visual absoluta, sobriedad y máxima elegancia entre todas las categorías (Noticias, Blog, IA, Ciberseguridad, Tutoriales, Proyectos, Infraestructura), todas las tarjetas especializadas (`NewsCard`, `BlogCard`, `AiCard`, `SecurityCard`, `TutorialCard`, `ProjectCard`, `InfrastructureCard`) delegan como componentes de presentación en la tarjeta atómica unificada `DoiceladevCard`.
    * **1. Metadatos Técnicos / Jerarquía Taxonómica (Nivel 1 • Nivel 2):** Una sola línea mono sobria (`text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate font-medium`) estructurada bajo la regla universal **Nivel 1 (Módulo) • Nivel 2 (Categoría Temática)** (ej. `TUTORIALES • WEB`, `PROYECTOS • DEVOPS`, `INFRAESTRUCTURA • SERVERS`, `CIBERSEGURIDAD • HARDENING`), con internacionalización reactiva (`tNav(module).toUpperCase() • post.category.toUpperCase()`). Las etiquetas o palabras clave del artículo corresponden al **Nivel 3 (Tags)** transversal.
    * **2. Titular Principal:** Campo `title` o `name` puro de la base de datos en `text-base` (16px, `leading-snug`, `font-bold`), manteniendo altura uniforme sin saltos ni inflación visual.
    * **3. Extracto Descriptivo:** Campo `excerpt`, `subtitle` o `description` puro de la base de datos en `text-xs` (12px, `text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5`).
  * **Cero Ruido Visual (Prohibición de Footers, Tiempos de Lectura y Datos Quemados):** Se eliminaron los pies de tarjeta con líneas divisorias (`border-t`), listas secundarias de tecnologías apiladas, estimaciones de tiempo de lectura y textos estáticos artificiales, garantizando que el 100% de la información provenga directamente de la base de datos SQLite y los corpus JSON bilingües.
* **Coherencia Editorial Total en las 8 Páginas de Categoría (`/[category]`):**
  * Las 8 páginas de listado (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`, `forum`) incorporan la misma estructura arquitectónica que el home `/`: cabecera editorial de marca [`DoiceladevHeaderNav`](/doiceladev/widgets/doiceladev-header/ui/DoiceladevHeaderNav.tsx) con la categoría activa resaltada en la cápsula, botón de retorno a la raíz (`/`) con la etiqueta localizada `Inicio` (ES) / `Home` (EN), barra de búsqueda integrada, contenedor unificado `glass-convex-panel` con sombra 2xl y el pie de página completo [`DoiceladevFooter`](/doiceladev/widgets/doiceladev-footer/ui/DoiceladevFooter.tsx).
  * **Sistema Universal de Filtros Polimórficos (`CategoryFilterBar.tsx` en `shared/ui`):**
    * Erradicación total de categorías quemadas en cliente TSX y en controladores del backend. Todo el catálogo delega en el componente transversal reutilizable [`CategoryFilterBar`](/doiceladev/shared/ui/CategoryFilterBar.tsx) basado en el contrato único `FilterOption: { id: string, label: string, count?: number }`.
    * El backend NestJS actúa como proveedor puro de datos y conteos desde SQLite (`GET /doiceladev/[modulo]/categories?lang=es|en`), mientras que la internacionalización reside de forma reactiva y limpia en los archivos JSON de mensajes del frontend (`messages/es.json` y `messages/en.json` bajo la clave `"Filters"`), eliminando diccionarios de strings duplicados en memoria en el servidor.
    * Consulta reactiva en tiempo real al backend NestJS con hooks desacoplados en la capa `entities/*` (`useNewsCategories`, `useBlogCategories`, `useForumCategories`, `useInfrastructureCategories`, `useCybersecurityCategories`, `useTutorialsCategories`, `useProjectsCategories`, `useAiCategories`).
    * **Identidad Neumórfica UI + Glassmorphic:** Pastillas con relieve extruido activo (`glass-btn-neumorphic`), skeletons pulsantes automáticos mientras SQLite calcula los conteos, badges numéricos discretos con la cantidad de publicaciones vivas, accesibilidad WCAG (`tablist`, `tab`, `aria-selected`) y paleta de acentos visuales por módulo (`cyan`, `blue`, `purple`, `emerald`, `amber`, `rose`).
    * **Arquitectura Adaptativa Responsive (Móvil vs Escritorio):** Para erradicar el desbordamiento horizontal en pantallas estrechas (`< 640px`), delega automáticamente en el selector dropdown centrado con ancho uniforme `max-w-xs` (alineado simétricamente con el buscador), desplegando verticalmente todas las opciones de filtro con sus conteos; en pantallas de escritorio (`>= 640px`) despliega la fila horizontal de pastillas neumórficas completas. Esta mejora beneficia de forma unificada a las 8 páginas de catálogo de la plataforma.
  * **Selector Dropdown Táctil Neumórfico Reutilizable:**
    * Componente atómico de presentación desacoplado en la Capa 6 (`shared/ui`) que sustituye de raíz los elementos `<select>` nativos del navegador por un popover flotante calibrado con **Neumorphism UI + Glassmorphism**.
    * **Gatillo Táctil (Trigger):** Botón con pastilla convexa (`glass-convex-panel`), micro-chevron `ChevronDown` animado que rota $180^\circ$ suavemente al desplegar, feedback táctil (`active:scale-[0.98]`) y borde vítreo fino.
    * **Panel Flotante Popover Inmune a Clipping (`createPortal`):** Se monta directamente en `document.body` mediante `createPortal` con posicionamiento flotante calculado dinámicamente (`getBoundingClientRect`) y `position: fixed` (`z-[999999]`), haciéndolo 100% inmune a ser recortado por cualquier contenedor padre con `overflow: hidden`, `overflow-x: auto` o restricciones de altura. Posee vidrio esmerilado denso (`backdrop-blur-2xl bg-white/95 dark:bg-[#12161f]/95 border border-black/10 dark:border-white/10 shadow-2xl rounded-2xl p-1.5`), con micro-indicadores de selección (`Check`), badges opcionales, soporte para íconos y transiciones fluidas.
    * **Accesibilidad e Interactividad Completa (WCAG AA):** Cierre automático por clic exterior, cierre con tecla `Escape`, navegación completa por teclado (`ArrowDown`, `ArrowUp`, `Enter`, `Space`, `Home`, `End`) y roles ARIA (`role="combobox"`, `role="listbox"`, `role="option"`, `aria-expanded`). Se integra transversalmente en las 8 páginas de catálogo, el buscador de foros y los selectores de idioma/categoría.
* **Lector Editorial Unificado y Migas de Pan Embebidas (`DoiceladevArticleLayout.tsx`):**
  * Shell reutilizable para todos los artículos individuales con cabecera adaptada: el botón de retroceso de la barra superior apunta a su respectiva categoría de origen (`← Infraestructura`, `← Noticias`, etc.).
  * **Disposición de Cuadrícula Calibrada (`.article-layout-grid`):** Implementa una cuadrícula asimétrica optimizada `minmax(0, 1fr) 430px` que otorga mayor amplitud de lectura al artículo hacia la derecha, mientras mantiene el sidebar en `430px` estables para preservar la ergonomía visual y legibilidad de las tarjetas.
  * **Cabecera Editorial Estilo Hero Centrado con Divisor:** La cabecera del artículo implementa un Hero centrado de alta legibilidad (`text-center border-b pb-8`) que reúne en el eje central las migas de pan embebidas (`[Inicio] › [Categoría]`), el título H1 (`max-w-4xl mx-auto`), el subtítulo descriptivo (`max-w-2xl mx-auto`) y el byline editorial con micro-avatar de Jorge Doicela y fecha. La línea divisoria inferior delimita con sobriedad la cabecera del cuerpo técnico del artículo (resumen ejecutivo, callouts y Markdown), el cual arranca a la izquierda con su margen natural.
  * **Expansión de Lectura Inmersiva por Borde Interactivo Invisible (`cursor-col-resize`):** Para optimizar la concentración y ergonomía de lectura de artículos largos o con diagramas extensos, el borde derecho del cuadro de lectura incorpora un disparador sutil sin líneas invasivas (`hidden lg:block absolute top-0 -right-2 w-4 h-full cursor-col-resize`). Al pasar el cursor, adopta el puntero de ajuste de columna (`col-resize`); al hacer clic, colapsa la barra lateral (`aside`) y expande el artículo fluidamente de 1 columna a pantalla completa (`.article-layout-grid-collapsed`). Al hacer clic nuevamente en el borde derecho del artículo expandido, restaura la barra lateral instantáneamente (`ArticleLayout.expandReading` / `ArticleLayout.restoreSidebar`).
  * **Bloque Tipográfico de Etiquetas del Artículo ([`ArticleTags.tsx`](/doiceladev/widgets/article-layout/ui/ArticleTags.tsx)):** Posicionado al pie del artículo antes de las acciones sociales. Encabezado tipográfico mono sobrio (`TEMAS Y TECNOLOGÍAS`) sin iconografía decorativa, desplegando píldoras neumórficas interactivas conectadas a `useSpotlight(tag)` que abren inmediatamente el buscador modal con el tag seleccionado.
  * **Barra de Acciones e Interacción Social ([`ArticleShareActions.tsx`](/doiceladev/widgets/article-layout/ui/ArticleShareActions.tsx)):** Proporciona botón de copiado de URL directa con retroalimentación visual reactiva (`¡Enlace copiado!`) y enlaces de compartición optimizados para X (Twitter) y LinkedIn.
  * **Barra Lateral con Anclaje Inteligente al Fondo y Desplazamiento Bidireccional ([`SmartSidebar.tsx`](/doiceladev/widgets/article-layout/ui/SmartSidebar.tsx)):** Mantiene las 5 tarjetas editoriales unificadas bajo anclaje inferior (`lg:sticky lg:bottom-8 lg:self-end`) y permite revelar las tarjetas superiores con la rueda del ratón paso a paso sin barras de scroll visibles. Cuando el cursor permanece sobre el panel y se alcanza el tope superior o inferior, sincroniza de forma atómica y síncrona el desplazamiento de ventana (`window.scrollBy`) y el ajuste de `transform` (`translate3d`) en el mismo ciclo de pintado del navegador, evitando desfases entre el hilo compositor y el hilo principal de JavaScript.
* **Bloque de Lecturas Recomendadas de Ancho Completo ([`RelatedArticlesNav.tsx`](/doiceladev/widgets/article-layout/ui/RelatedArticlesNav.tsx)):**
  * **Ordenamiento Responsivo Inteligente (Mobile vs. Desktop):** En pantallas móviles (`< lg`), el bloque se posiciona inmediatamente debajo del artículo (`order-2`), evitando que el lector tenga que desplazarse por toda la barra lateral para descubrirlas; los widgets de la barra lateral quedan al final (`order-3`). En escritorio (`lg:`), se ubica en la segunda fila del grid (`lg:row-start-2 lg:col-span-12 lg:order-3`), abarcando el 100% del contenedor editorial (`max-w-[1490px]`) alineado de extremo a extremo debajo del artículo y la barra lateral.
  * **Cuadrícula Equilibrada con Carrusel Táctil en Móvil:** En móviles (`< sm`), implementa un carrusel táctil de desplazamiento horizontal continuo con anclaje magnético (`flex overflow-x-auto snap-x snap-mandatory no-scrollbar`) donde cada tarjeta ocupa el `84%` del ancho disponible con asomo de la siguiente tarjeta, reduciendo la altura vertical de ~1.000 px a ~240 px para eliminar la fatiga de scroll sin recargar la interfaz. En pantallas tablet y escritorio (`sm:` y `lg:`), evoluciona automáticamente a una cuadrícula de 2 y 3 columnas (`sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6`), limitando estrictamente la presentación a **3 tarjetas** (`limit = 3`) con portadas 16:9 (`<ArticleCover />`), titulares a dos líneas, píldora de categoría mono y enlace de lectura con flecha interactiva.
  * **Unificación Integral del Catálogo Editorial:** Consume y deduplica en memoria las colecciones `featured` y `feed` desde `useDoiceladevPortal()`, accediendo al 100% de publicaciones disponibles en la plataforma.
  * **Algoritmo de Afinidad Técnica Transversal:** Prioriza artículos de la misma categoría técnica, encadena categorías afines del ecosistema (ej. Infraestructura → Ciberseguridad → Tutoriales → Proyectos) y aplica fallback ordenado por `smartScore`, garantizando que en todas las especialidades siempre se muestren las 3 recomendaciones sin huecos vacíos.
* **Navegación Flotante Global "Scroll to Top" ([`ScrollToTopButton.tsx`](/doiceladev/shared/ui/ScrollToTopButton.tsx)):
  * Botón flotante interactivo situado en la esquina inferior derecha (`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40`).
  * Detección reactiva de scroll con listener pasivo de alto rendimiento: permanece oculto en la cabecera y se revela con animación fluida de opacidad y elevación al desplazarse más de 300px hacia abajo.
  * Al activarlo, ejecuta un desplazamiento suave hasta la parte superior de la página (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  * Diseño Neumórfico UI + Glassmorphic (`.glass-convex-panel`), micro-interacciones táctiles al hover/active, icono `ArrowUp` de Lucide y soporte bilingüe (`Nav.scrollToTop`). Se integra a nivel global en el layout raíz `(doiceladev)/layout.tsx` para todas las páginas y subrutas de DoicelaDev.
* **Barra Lateral de Recirculación Editorial ([`FeaturedPostsSidebarCard.tsx`](/doiceladev/widgets/article-layout/ui/FeaturedPostsSidebarCard.tsx)):
  * Inspirado en la arquitectura editorial de **Marcus Hutchins (MalwareTech)** y alineado 100% con la estética **Neumorphism UI + Glassmorphism** de DoicelaDev, sustituye las fichas estáticas de hardware por un widget dinámico de publicaciones destacadas de alta retención.
  * **Diseño Tipográfico Puro y Ultraligero:** Cada fila presenta exclusivamente la especialidad o módulo correspondiente (Nivel 1, ej. *PROYECTOS*, *IA*, *TUTORIALES*, *CIBERSEGURIDAD*) en tipografía mono sobria (`text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider`) y titular en negrita con micro-transición cromática en hover, mientras que las tarjetas del feed principal y catálogos estandarizan su línea de metadatos estrictamente a **Nivel 1 (Módulo) • Nivel 2 (Categoría)**. Elimina imágenes miniaturas pesadas o decorativas para priorizar la velocidad de lectura, el enfoque tipográfico y la sobriedad ejecutiva en todo el ancho del componente.
  * Integra filtrado contextual automático (`usePathname`) para nunca recomendar el artículo actualmente abierto y skeletons de carga fluidos integrados.
* **Directorio Tipográfico con Acordeón por Especialidad ([`ExploreTopicsSidebarCard.tsx`](/doiceladev/widgets/article-layout/ui/ExploreTopicsSidebarCard.tsx)):
  * Inspirado en la navegación técnica de **Marcus Hutchins (MalwareTech)** y optimizado para la ergonomía del sidebar fijo (`sticky`), implementa un **árbol interactivo multi-apertura por cada especialidad**:
    * **Despliegue Multi-Apertura Concurrente (Sin Cierre Automático):** Al pulsar sobre cualquiera de las 8 especialidades (Ciberseguridad, Infraestructura, IA, Tutoriales, Proyectos, Blog, Noticias, Foros), la fila se expande suavemente revelando sus publicaciones sin colapsar ni cerrar automáticamente las demás especialidades previamente abiertas, permitiendo navegación y comparación simultánea fluida.
    * **Minimalismo Visual Sobrio:** Erradica iconos temáticos SVG innecesarios en la lista de categorías, conservando una presentación limpia y monocromática con el chevron indicador `ChevronRight` rotativo, el label de la categoría y la pastilla cóncava neumórfica (`glass-concave-panel px-2.5 py-0.5 rounded-md text-[11px] font-mono`) con conteo dinámico de artículos.
    * **Estética de Rama Técnica Centrada en Títulos (Tree / Branch View):** Al expandir una categoría, despliega un riel vertical con línea guía (`border-l-2 border-blue-500/25`) y **únicamente el título limpio de cada publicación** (alineado directamente sin puntos, viñetas ni metadatos intermedios para una lectura minimalista inmediata), finalizando con el enlace terminal limpio `Todo el Contenido ↗` (sin números redundantes, ya que el conteo vive exclusivamente en la pastilla cóncava superior).
  * **Contenedor Inteligente de Barra Lateral ([`SmartSidebar.tsx`](/doiceladev/widgets/article-layout/ui/SmartSidebar.tsx)):**
    * **Desplazamiento Independiente con Sincronización Atómica Omnidireccional:** Mantiene el anclaje firme al fondo (`lg:sticky lg:bottom-8 lg:self-end`) sin vibraciones en el scroll nativo de la página, permitiendo a la vez desplazar el panel de forma 100% independiente con la rueda del ratón para explorar las tarjetas superiores paso a paso. Al alcanzar el tope o la base del panel, sincroniza de forma atómica e instantánea el scroll de la ventana (`window.scrollBy`) en el mismo fotograma de JavaScript (`behavior: 'instant'`), tanto en movimientos de subida como de bajada (`deltaY > 0` y `deltaY < 0`), eliminando cualquier desfase con la GPU o efecto de vaivén.
    * **Desacoplamiento Estructural y Límite Infranqueable de Grilla:** La sección de recomendaciones ([`RelatedArticlesNav.tsx`](/doiceladev/widgets/article-layout/ui/RelatedArticlesNav.tsx)) se ubica fuera de la cuadrícula como bloque hermano independiente. Además, `getMaxOffset` acota matemáticamente cualquier traslación con `maxBottomOffset = Math.max(0, gridBottom - asideBottom)`, impidiendo que el contenido sobrepase la base del artículo o invada el bloque de lecturas recomendadas.
    * **Compensación Inmediata de Acordeones (Despliegue Descendente Natural):** Al interactuar con el árbol de especialidades en [`ExploreTopicsSidebarCard.tsx`](/doiceladev/widgets/article-layout/ui/ExploreTopicsSidebarCard.tsx), un `ResizeObserver` sobre el contenedor ajusta síncronamente `offsetY` por el delta de altura (`heightDiff`) acotado estrictamente por `getMaxOffset()`. Esto anula el empuje ascendente de `sticky bottom: 8`, manteniendo la fila seleccionada fija bajo el cursor y desplegando el contenido fluidamente hacia abajo.
  * **Tarjeta de Perfil del Autor ([`AuthorSidebarCard.tsx`](/doiceladev/widgets/article-layout/ui/AuthorSidebarCard.tsx)):**
    * Presenta el perfil profesional bajo internacionalización estricta (`messages/es.json` y `messages/en.json`) sin títulos comerciales ni adjetivos no fácticos: `Full Stack, Cloud & Seguridad de Sistemas` (`Full Stack, Cloud & Systems Security`).
    * Incorpora avatar calibrado a 96px (`w-24 h-24`) con bisel cóncavo neumórfico (`glass-concave-panel`), borde translúcido y comportamiento visual estático (sin distorsión de escala al hacer hover).
    * Integra barra horizontal con las 6 conexiones profesionales verificadas: GitHub, LinkedIn, YouTube, TikTok, Portafolio SSH dinámico (con resolución determinista de subdominio localhost/producción) y correo electrónico directo.
* **Directorio de Etiquetas Populares del Dominio ([`PopularTagsSidebarCard.tsx`](/doiceladev/widgets/article-layout/ui/PopularTagsSidebarCard.tsx)):
  * Materializa la visibilidad del **Nivel 3 (Tags / Etiquetas)** de forma limpia y desacoplada del catálogo principal.
  * **Diseño Homogéneo en Lista Vertical:** Sustituye la dispersión de píldoras aglomeradas por una lista vertical minimalista en armonía con las demás tarjetas del sidebar. Su cabecera erradica el símbolo `#` del título (`ETIQUETAS POPULARES` en mayúsculas mono sobrias), mientras que cada fila preserva el identificador `#` en el término técnico (`# typescript`, `# architecture`), el nombre tipográfico mono y su contador de publicaciones en pastilla cóncava neumórfica a la derecha.
  * **Interacción Instantánea con Spotlight (Apertura Atómica Zero-Flicker):** Cada fila es un botón interactivo y accesible conectado a `useSpotlight(name)`: al pulsar sobre una etiqueta, abre inmediatamente el buscador modal Spotlight (`Cmd + K`) prefiltrado con ese término, mostrando en tiempo real todas las publicaciones asociadas con su correspondiente badge destacado `#[tag]` sin recargas de página ni pérdida del contexto de lectura. La sincronización síncrona en el ciclo de render erradica cualquier parpadeo de apertura momentánea de todo el catálogo antes de filtrar.
* **Buscador y Paleta de Comandos Spotlight ([`SpotlightModal.tsx`](/doiceladev/features/spotlight-search/ui/SpotlightModal.tsx)):**
  * **Diseño Neumorphism Pro Sólido con Fondo Difuminado:** Overlay con desenfoque de fondo (`bg-slate-900/40 dark:bg-black/75 backdrop-blur-md`) que enfoca visualmente el modal difuminando la página inferior, mientras que el contenedor modal permanece 100% opaco y sólido (`bg-white dark:bg-[#0c121e] border border-slate-200/90 dark:border-white/10 shadow-2xl`) para no transparentar el texto. Integra el campo de búsqueda en una cápsula sólida suave (`bg-slate-100/90 dark:bg-[#121824] border border-slate-200/80 dark:border-white/10`) con icono de búsqueda y botón interactivo de limpieza.
  * **Motor Difuso Inteligente en Memoria (`fuse.js`):** Implementa búsqueda difusa (fuzzy search) con ponderación multicampo calibrada (`title: 2.5`, `tags: 1.8`, `categoryLabel: 1.2`, `extraSearchTerms: 1.0`, `snippet: 0.8`), tolerancia a errores tipográficos leves (*typos* como `dokcer`, `firewal`, `typecsript`), búsqueda por prefijo `#` para etiquetas técnicas y normalización diacrítica transparente sin carga en el servidor.
  * **Resaltado Seguro de Coincidencias (Zero XSS):** Mediante el componente especializado `HighlightedText`, renderiza las coincidencias exactas y difusas devueltas por `res.matches` aplicando fusión defensiva de intervalos adyacentes (`<mark className="bg-transparent p-0 ...">`) sin recurrir a `dangerouslySetInnerHTML`.
  * **Búsqueda Unificada Global (Estilo Raycast / Spotlight):** Erradica barras de pestañas horizontales que se desbordan o cortan texto en el modal. El motor indexa y filtra en tiempo real sobre el 100% de los 8 dominios (títulos, extractos, categorías y etiquetas técnicas), permitiendo al usuario escribir directamente con foco inmediato sin fricción previa de categorización.
  * **Estética Editorial Tipográfica Pura (Paridad con `FeaturedPostsSidebarCard`):** Erradica cajas con iconos de colores y badges estridentes. Cada fila adopta la estructura sobria del sidebar: categoría en mayúsculas mono (`text-[11px] font-mono text-slate-500 dark:text-zinc-400`), titular en negrita (`text-xs sm:text-[13px] font-bold`) con micro-transición cromática a azul en hover, extracto descriptivo en fuente light y flecha terminal interactiva `ArrowRight`.
  * **Bloqueo de Scroll de Fondo y Navegación Total por Teclado:** Implementa bloqueo estricto del scroll de la página inferior (`document.body.style.overflow = 'hidden'`, `document.documentElement.style.overflow = 'hidden'` y `overscroll-contain`) impidiendo que la rueda del ratón desplace el fondo mientras el modal está abierto. Elimina barras de pie de página innecesarias para maximizar el área útil de resultados con soporte de navegación con flechas `↑` y `↓`, selección directa con `↵ Enter` y cierre rápido con `ESC`.

---

## 6. Eliminación de Datos Hardcodeados y Erradicación de Tiempos de Lectura

* **Cero Cadenas en Duro (100% i18n con `next-intl`):**
  * Todo texto de interfaz de usuario (etiquetas, placeholders, accesibilidad `aria-label`, títulos de tooltips, mensajes de error, estados de carga, empty states, botones de copia de código y diagramas, y badges de callout) se resuelve a través de `messages/es.json` y `messages/en.json`.
  * Namespaces dedicados y consistentes con paridad 1:1 estricta: `Metadata`, `Nav`, `Search`, `Common`, `Home`, `AuthorCard`, `Newsletter`, `Footer`, `Spotlight`, `CardActions`, `Filters`, `Detail`, `Markdown`, `News`, `Blog`, `Forum`, `Ai`, `Cybersecurity`, `Tutorials`, `Projects`, `Infrastructure`.
  * Datos estructurados `Schema.org` ([`DoiceladevJsonLd.tsx`](/doiceladev/shared/seo/DoiceladevJsonLd.tsx)) dinámicamente localizados según el `locale` activo.
* **Erradicación Total de "Tiempos de Lectura":**
  * Se eliminaron por completo las estimaciones de lectura ("5 min lectura", "readingTime") tanto en la base de datos `doiceladev.sqlite` (entidades TypeORM), en los esquemas y corpus JSON, como en todos los componentes de la interfaz (`NewsCard`, `BlogCard`, `TutorialCard`, etc.). La plataforma sigue una filosofía de ingeniería y referencia directa sin métricas artificiales.
* **Slugs Canónicos Bilingües:**
  * Cada recurso mantiene el mismo `slug` canónico para español e inglés en la base de datos (`IDX_<tabla>_slug_lang`), permitiendo alternar de idioma con `LanguageToggle` de manera instantánea sin redirecciones 404 ni roturas de navegación.
* **Autor 100% Dinámico desde Base de Datos y Micro-Avatar Editorial:**
  * Los 8 módulos temáticos (`infrastructure`, `tutorials`, `projects`, `cybersecurity`, `ai`, `blog`, `news`, `forum`) leen el autor estrictamente de la entidad devuelta por la base de datos (`author` en `doiceladev.sqlite`).
  * Erradicación total de fallbacks o valores por defecto hardcodeados tanto en las páginas `[slug]/page.tsx` como en el layout maestro ([`DoiceladevArticleLayout.tsx`](/doiceladev/widgets/article-layout/ui/DoiceladevArticleLayout.tsx)).
  * La cabecera editorial integra un micro-avatar circular de perfil ($20\times 20\text{px}$, `/doiceladev/logo/perfil.jpg`) a la izquierda del nombre del autor con borde suave y sombra neumórfica.
  * En el módulo de IA (`/ai`), el proveedor tecnológico (`provider`, ej. *Anthropic*) se aísla en una insignia técnica (`badge`) independiente, distinguiéndolo claramente del autor del artículo.

---

## 7. Suite Editorial y Renderizado de Contenido Técnico (Markdown Enriquecido)

* **Almacenamiento Desacoplado en Base de Datos (`doiceladev.sqlite`):**
  * El contenido técnico de todas las categorías se almacena como texto plano Markdown estándar (`contentMarkdown TEXT` o `content TEXT`).
  * **Cero Carga en el Servidor (VPS 1 GB RAM):** El backend en NestJS se limita a servir el texto crudo sin transformaciones pesadas ni manipulación de árboles sintácticos en el servidor.
  * **Seguridad (Inmunidad XSS):** No se almacena HTML crudo en base de datos. El parsing lo realiza el cliente de forma controlada y segura mediante componentes React.
* **Componentes Modulares Especializados (`shared/markdown/components/`):**
   1. **Diagramas Vectoriales Multidiagrama Adaptativos Estilo Mermaid Chart ([`MermaidBlock.tsx`](/doiceladev/shared/markdown/components/MermaidBlock.tsx)):**
      * **Detección Tipificada Robusta:** Analiza el bloque ignorando comentarios (`%%`) y frontmatter YAML (`---`) para identificar automáticamente la familia del diagrama (`sequenceDiagram`, `flowchart` / `graph`, `classDiagram`, `erDiagram`, `stateDiagram-v2`, `gitGraph`, `architecture-beta`, `c4Context`, `mindmap`, `pie`, etc.).
      * **Cabecera Técnica Minimalista (Acción Directa de Inspección):** Muestra el título específico del tipo de diagrama traducido vía `next-intl` con su icono temático de Lucide, y a la derecha el botón de acción minimalista con icono de alta precisión (`Maximize2` para expandir en visor inmersivo) con tooltip nativo accesible, manteniendo máxima sobriedad y elegancia sin saturar la cabecera ni incluir acciones redundantes como copiar en diagramas puramente visuales.
      * **Renderizado Universal en Cliente (Mermaid 12):** Renderizador configurado con `look: 'neo'`, temas oficiales nativos (`theme: 'dark'` en modo oscuro y `'neutral'` en claro) y `themeVariables` de alta definición calibradas para Neumorphism / Dark Luxury, curvas orgánicas `basis` en flowcharts y tipografía uniforme ($13\text{px}$ a $14\text{px}$).
      * **Arquitectura Híbrida de Primera Clase (Ajuste Fluido en Artículo + Visor de Inspección Forense a Pantalla Completa):**
        - *En el Artículo (Móvil y Escritorio):* El diagrama se muestra siempre **completo de inicio a fin** (`max-w-full mx-auto`), sin recortes a la izquierda ni barras de scroll forzadas que interrumpan el flujo de lectura. En escritorio respeta su ancho intrínseco 1:1 (`targetInlineWidth` hasta $1020\text{px}$) centrado simétricamente sin agigantarse.
        - *Visor Inmersivo Interactivo a Pantalla Completa (`createPortal` + Pan & Zoom):* Al pulsar el botón de expandir o hacer click en el diagrama (`cursor-zoom-in`), se monta un lienzo modal directamente en `document.body` mediante `createPortal`, cubriendo el $100\%$ de la pantalla (`z-[999999]`) con vidrio esmerilado de alta fidelidad (`backdrop-blur-2xl bg-slate-100/85 dark:bg-black/85`).
          * **Aislamiento Total de Scroll del Fondo:** Previene el *scroll chaining* capturando de forma activa los eventos de rueda (`wheel`) con `e.preventDefault()`, al tiempo que bloquea temporalmente el scroll en `document.body` y `document.documentElement` con `overflow: hidden` y `touchAction: none`.
          * **Zoom Infinito y Suave con Rueda del Ratón:** Permite ampliar diagramas complejos y extensos desde $30\%$ hasta $500\%$ de su escala natural sin pérdida de nitidez vectorial.
          * **Arrastre y Zoom Multitáctil de Alta Precisión (Pinch-to-Zoom & Touch Pan Nativo a 120 FPS):** Soporta arrastre directo con el ratón (`cursor-grab` $\rightarrow$ `cursor-grabbing`) y gestos multitáctiles en móviles mediante listeners nativos no pasivos (`passive: false`) con `touch-action: none` y blindaje de eventos en nodos internos del SVG (`pointer-events-none`). Permite pellizcar con dos dedos (*pinch-to-zoom*) de forma continua y orgánica, sin saltos discretos por redondeo ni transiciones CSS que interfieran durante el arrastre, con recálculo dinámico del centroide y transición transparente al levantar un dedo sin congelamientos.
          * **Ajuste Dinámico a Pantalla Completa (Fit to Screen por Defecto):** Al abrir el visor, calcula automáticamente las dimensiones intrínsecas del SVG (`viewBox`) contra el viewport disponible. Diagramas verticales extensos o diagramas horizontales anchos se abren en su escala óptima completa sin recortes en la parte superior ni inferior, permitiendo apreciar todo el flujo de inicio a fin.
          * **Barra Flotante Unificada Superior Derecha (Glassmorphic Toolbar):** En lugar de dispersar elementos por las esquinas y la parte inferior, consolida en una sola píldora elegante de vidrio esmerilado en la esquina superior derecha:
            - **Contexto del Diagrama:** Icono técnico específico y título localizado.
            - **Controles Simétricos de Zoom:** `ZoomOut`, indicador interactivo de porcentaje (clic para alternar entre *Fit to Screen* y $100\%$), `ZoomIn` y botón dedicado de reajuste `RotateCcw` (*Ajustar a pantalla*).
            - **Botón de Cierre:** Icono `X` accesible con highlight sutil en hover.
            - **Lienzo $100\%$ Libre:** Toda la pantalla queda completamente despejada sin barras inferiores ni elementos dispersos en la izquierda. Soporta atajos (`Escape` o clic en el fondo para cerrar, `+` / `-` para zoom, `0` o `f` para ajustar a pantalla, `1` para $100\%$ real, doble clic en el lienzo para alternar entre ajuste y tamaño real).
   2. **Bloques de Código de Alta Precisión con Cabecera Inteligente ([`CodeBlock.tsx`](/doiceladev/shared/markdown/components/CodeBlock.tsx)):**
      * **Resaltado de Sintaxis Universal (23 Lenguajes Esenciales):** Soporte oficial en `prismjs` para desarrollo backend, frontend, infraestructura, bajo nivel y DevOps:
        - *Desarrollo Web & Cloud:* `TypeScript`, `TSX`, `JavaScript`, `JSX`, `JSON`, `YAML`, `Markdown`.
        - *Infraestructura, DevOps & IaC:* `Bash` / `Shell`, `Nginx`, `Docker`, `INI Config`, `TOML`, `HCL / Terraform`.
        - *Backend & Microservicios:* `Python`, `SQL`, `Go`, `Rust`, `C#` (.NET), `GraphQL`, `Protobuf` (gRPC).
        - *Bajo Nivel & Kernel Linux:* `C`, `C++` (sockets, Netfilter, eBPF).
        - *Auditoría & Control de Versiones:* `Git Diff` (`diff` / `patch`) con realce semántico de líneas insertadas en verde (`.token.inserted`) y eliminadas en rojo (`.token.deleted`).
     * **Cabecera Inteligente Contextual y 100% Localizada:** Erradica los semáforos de colores decorativos y las etiquetas toscas de "Texto Plano". Detecta automáticamente nombres de archivo y rutas en comentarios de la primera línea (ej. `pm2.config.js`, `nginx/jorgedoicela.com.conf`) para orientar didácticamente al lector; si se trata de scripts o comandos muestra `Bash` / `Shell`, y para logs de error o salida de comandos muestra `Terminal / Salida` (ES) / `Terminal / Output` (EN) vía `t('terminal')`.
     * **Botón Interactivo Minimalista con Motor de Detección Heurística:** Muestra exclusivamente el micro-icono de Lucide (`Copy` / `Check`) con feedback mediante tooltip nativo accesible y micro-interacción táctil, eliminando etiquetas redundantes. Para evitar antipatrones de experiencia de usuario (como inducir al lector a copiar trazas de diagnóstico o salidas del kernel), un motor heurístico en 3 capas determina si el bloque ofrece copia:
       - *Copiables (Acción / Código / Configuración):* Bloques de código fuente (`ts`, `py`, `sql`, etc.), comandos ejecutables (`bash`, `sh`, `zsh`) y cualquier bloque con archivo de configuración detectado en la cabecera (ej. `99-hardening.conf`, `nginx.conf`). Al copiar comandos de consola, limpia automáticamente prompts terminales iniciales (`$ `).
        - *No Copiables (Salidas / Diagnóstico / Estructuras / Logs):* Bloques etiquetados como `text`, `plaintext`, `log`, `output`, `terminal` o cuyo contenido exhibe patrones inequívocos de solo lectura: trazas de kernel (`[UFW BLOCK]`), tablas de estado (`nmap`, `ufw status`, `ps aux`, `top`, `docker ps`, `ss`, `df -h`), salidas de control de versiones (`git status`, `git log`), herramientas de red (`ping`, `traceroute`, `dig`, cabeceras `HTTP 200`), listados de archivos (`total 64` / `ls -l`), gestores de paquetes y tests (`apt update`, `npm ERR!`, `Jest/Vitest PASS/FAIL`), tablas ASCII de bases de datos (`+---+---+`, `(X rows)`), árboles de directorios (`tree` / `├──`), o stack traces de excepciones (`Traceback`, `Error: at`, `panic:`). Muestra en su lugar una cabecera sobria y neutral `>_ Terminal / Salida` sin botón de copia.
       - *Directivas de Autor en Markdown:* Soporta anulaciones explícitas tanto en la etiqueta de código (````bash output````, ````text copy````) como mediante comentarios mágicos en la primera línea (`# output`, `// no-copy`, `# copy`).
     * Paleta calibrada Obsidian / Dark Luxury integrada en `globals.css` (funciones en ámbar, cadenas en esmeralda, palabras clave en índigo, comentarios en cursiva).
     * **Código en Línea Sutil y Libre de Ruido (`InlineCode`):**
       - **Cero Bordes Perimetrales y Escala Proporcional (`text-[0.875em]`):** Erradica el efecto de "etiquetas / pastillas pegadas" eliminando los bordes rígidos y aplicando un fondo translúcido ultramínimo (`bg-slate-100/80 dark:bg-zinc-800/60`). El código en línea se escala de forma relativa (`0.875em`) con el tamaño de su contenedor (párrafos, títulos o celdas de tabla) preservando el interlineado (`leading`) sin saltos de línea.
       - **Deduplicación en Celdas de Tablas:** En tablas donde la primera columna ya tiene asignada tipografía `font-mono`, el renderizador neutraliza cualquier contenedor secundario (`first:[&_code]:bg-transparent first:[&_code]:p-0`), evitando cajas grises anidadas.
     * **Manual de Estilo Tipográfico y Editorial (Las 4 Categorías Canónicas):**
       - **1. Código en Línea (`` `...` ``):** Reservado estrictamente para elementos literales de ejecución (comandos completos `sudo ufw enable`, flags `-p 8080:8080`, rutas exactas `/etc/sysctl.conf`, variables `IPV6=yes` o métodos `useSpotlight()`). Prohibido en nombres propios de software (Docker, Linux, Nginx) o frases explicativas en lenguaje natural.
       - **2. Negrita (`**...**`):** Anclaje visual para escaneo rápido (*visual scanning*), con un límite estricto de **1 a 3 palabras clave** por mención (**Default Deny**, **DROP**, **0 ms de CPU**). Prohibido su uso en oraciones o cláusulas completas.
       - **3. Cursiva (`*...*`):** Énfasis contextual sutil, términos foráneos adoptados (*Stateful Packet Inspection*, *loopback*, *daemon*, *bypassea*) y conceptos en su primera mención.
       - **4. Texto Plano:** El 85% del contenido, redactado con fluidez sin envoltorios decorativos redundantes.
* **Tabla de Referencia Rápida: Patrones de Redacción (Antes vs. Después):**

| Caso de Uso | Patrón Incorrecto (Saturación) | Estándar Correcto (Ingeniería Sobria) | Justificación de Diseño |
|---|---|---|---|
| **Tuplas y conceptos teóricos** | `` `(IP de Origen, Puerto de Origen...)` `` | `(IP de Origen, Puerto de Origen...)` (texto plano) | Los backticks son exclusivos de sintaxis ejecutable. Las tuplas conceptuales no se ejecutan y rompen la fluidez. |
| **Políticas y directivas en prosa** | `` `deny incoming` `` o `` `default deny` `` | Política **Default Deny** (negrita corta) o `` `sudo ufw default deny incoming` `` | Frases explicativas no deben encerrarse en código; se usa el concepto formal o el comando terminal exacto. |
| **Advertencias y oraciones completas** | `` **bypassea por completo las reglas de UFW** `` | `*bypassea* las directivas de UFW` con concepto **Default Deny** | Negritas de más de 3 palabras saturan el campo visual y degradan la elegancia editorial. |
| **Analogías y listas didácticas** | `* **Los Puertos (Ports):** Son...` | `* **Puertos:** Puertas numeradas...` | Erradica artículos gramaticales ("Los") y redundancias en inglés para maximizar la síntesis técnica. |
| **Herramientas y tecnologías en prosa** | `` `Docker` ``, `` `Linux` ``, `` `Nginx` `` | Docker, Linux, Nginx (texto plano) | Solo llevan backticks cuando se refieren al comando de consola (`` `docker run` ``, `` `nginx -t` ``). |
  3. **Tablas Técnicas de Ingeniería Enterprise Data-Grid Pro ([`TableBlock.tsx`](/doiceladev/shared/markdown/components/TableBlock.tsx)):**
      * Marco de cristal convexo (`glass-convex-panel`) con borde vítreo perimetral y sombra de elevación suave (`shadow-lg`).
     * Cabecera `thead` con sutil desenfoque (`backdrop-blur-md`), línea guía inferior `border-blue-500/30` y tipografía mono técnica en mayúsculas (`text-[11px] uppercase tracking-wider font-bold`).
     * **Diferenciación Estructural de Clave/Parámetro:** La primera columna (`td:first-child`, ancho fijo `28%`) posee tipografía mono seminegrita, fondo sutil contrastado (`bg-black/[0.015] dark:bg-white/[0.015]`) y borde divisorio vertical para identificar inmediatamente la clave del parámetro frente a los valores y detalles.
     * Filas estáticas y limpias sin resaltado reactivo en hover, garantizando una lectura descansada y libre de parpadeos o distracciones visuales al desplazar el cursor.
  4. **Paneles de Resumen Técnico y Callouts Blueprint Glass ([`CalloutBlock.tsx`](/doiceladev/shared/markdown/components/CalloutBlock.tsx)):**
     * **Diseño Simétrico Neumórfico / Glassmórfico Unificado:** Todos los paneles de resumen (`post.architectureOverview`, `post.remediation`), directivas de alerta de GitHub (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`) y citas se renderizan bajo la misma estructura arquitectónica limpia y simétrica: marco de cristal convexo (`glass-convex-panel`), esquinas simétricas (`rounded-2xl`), gradiente de color sutil por tipo, titular semántico en mayúsculas monospace (`text-[11px] font-mono font-bold tracking-wider uppercase`) y cuerpo de texto nítido sin forzar cursivas ni barras laterales asimétricas (`border-l-4`), erradicando cualquier inconsistencia visual en todo el subdominio.
  5. **Glosario Terminológico Interactivo ([`GlossaryTermPopover.tsx`](/doiceladev/shared/markdown/components/GlossaryTermPopover.tsx)):**
      * **Detección Léxica Desacoplada (100% Base de Datos):** Los artículos consumen dinámicamente los términos de `doiceladev.sqlite` (`glossary_terms`) mediante `serverGet<GlossaryTerm[]>('/doiceladev/glossary?lang=' + locale)`.
      * **Regla de la Primera Mención (Anti-Fatiga Visual):** Para evitar sobrecarga cognitiva (*efecto árbol de navidad*), cada concepto técnico se vuelve interactivo **únicamente en su primera aparición en el artículo**. Las siguientes ocurrencias permanecen como texto o código limpio regular.
      * **Soporte de Alias Bilingüe y Límites de Palabra (`\b`):** Reconoce variantes en inglés y español (ej. `DROP`, `REJECT`, `firewall`, `cortafuegos`, `Netfilter`) sin falsos positivos ni coincidencias parciales.
      * **Diseño Neumorphism UI + Glassmorphism y Accesibilidad WCAG 2.1 AA:** Presenta un subrayado punteado W3C (`border-b-2 border-dotted border-blue-500/70`) tanto en texto plano como en `InlineCode`. Al hacer clic o navegar con `Tab` + `Enter`, despliega un popover flotante de cristal con pastilla de categoría, definición didáctica concisa y claves de arquitectura, con cierre suave al pulsar afuera o mediante tecla `Escape`.
* **Orquestador Central ([`MarkdownRenderer.tsx`](/doiceladev/shared/markdown/MarkdownRenderer.tsx)):**
  * Conecta `react-markdown`, `remark-gfm` y el plugin AST nativo `createRemarkGlossary` con los componentes de la suite, garantizando una experiencia editorial homogénea en todas las subrutas `[slug]/page.tsx`.
  * **Arquitectura AST Determinista y Cero Hydration Mismatches:** El enriquecimiento de glosario y la regla de la primera mención operan a nivel de Abstract Syntax Tree (MDAST) mediante el plugin `createRemarkGlossary` antes del render de React. Esto erradica el uso de `useRef` mutables en la fase de renderizado, asegurando compatibilidad estricta con el modo concurrente y StrictMode de React 19 y garantizando una paridad 1:1 absoluta entre el HTML del servidor (SSR) y la hidratación del cliente.
  * **Defensa en Profundidad Semántica (WCAG 2.1 / SEO):** Dado que la cabecera editorial (`DoiceladevArticleLayout`) es el único `<h1>` del documento, cualquier encabezado `h1` que provenga del cuerpo Markdown se degrada automáticamente a un `<h2>` semántico estilizado, blindando el DOM contra duplicaciones de H1.
  * **Protección Estricta de Código:** El enriquecimiento de glosario opera exclusivamente sobre nodos de texto editorial en párrafos (`p`), listas (`li`) e inline snippets (`InlineCode`), dejando 100% intactos los bloques de código fuente (`CodeBlock`) y diagramas vectoriales (`MermaidBlock`).
   * **IDs de Anclaje Automáticos en Encabezados (`h2`, `h3`, `h4`):** Genera identificadores slugificados normalizados (`slugifyHeading`), permitiendo enlazar y compartir directamente cualquier sección técnica (`#inspeccion-rapida-de-sockets`) con margen de compensación de desplazamiento (`scroll-mt-24`) y presentación tipográfica 100% limpia sin símbolos flotantes ni elementos decorativos en hover.
   * **Figuras Técnicas e Imágenes en Markdown (`img`):** Renderiza esquemas de red, capturas o diagramas estáticos dentro de un contenedor neumórfico centrado (`glass-convex-panel rounded-2xl shadow-lg max-h-[560px]`), con carga diferida nativa (`loading="lazy"`) y pie de figura (`figcaption`) tipográfico monospace si se proporciona texto alternativo (`alt`).
   * **Listas de Verificación Técnicas / Checklists (`- [x]`):** Normaliza task lists de `remarkGfm` eliminando viñetas desalineadas (`list-none -ml-5`) e inyectando un checkbox sobrio con acento azul neumórfico (`accent-blue-600`), ideal para checklists de producción, planes de remediación y auditorías de seguridad.

---

## 8. Arquitectura de Activos Estáticos e Imágenes (`public/doiceladev/images/`)

Para garantizar escalabilidad, trazabilidad y cero colisión de archivos a medida que crezca el catálogo editorial, los recursos visuales se organizan estrictamente bajo `frontend/web/public/doiceladev/images/`, alineados 100% con la directiva de caché estático de Nginx en Debian 13 (`location ^~ /doiceladev/images/`):

```text
public/doiceladev/images/
├── covers/                      # Portadas 16:9 oficiales (1 por publicación, nombrada con el slug)
│   ├── news/                    # ej: /doiceladev/images/covers/news/nextjs-16.jpg
│   ├── tutorials/               # ej: /doiceladev/images/covers/tutorials/terminal-ssh-websockets.jpg
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
    └── default-doiceladev-cover.svg
```

* **Nomenclatura basada en `slug`:** Las portadas coinciden exactamente con el `slug` del artículo (`covers/<categoría>/<slug>.<ext>`), garantizando rutas predecibles en base de datos SQLite y corpus JSON.
* **Encapsulación por Artículo:** Las imágenes internas de texto se almacenan en una carpeta propia por slug (`content/<categoría>/<slug>/`), facilitando la depuración o retiro limpio de archivos huérfanos cuando un artículo sea despublicado.
* **Compatibilidad de Infraestructura Nginx:** Al concentrar los recursos bajo `images/`, el servidor Nginx en AWS Lightsail cachea automáticamente todos los recursos visuales mediante el alias `alias /home/admin/jorge_doicela/frontend/web/public/doiceladev/images/;`, con encabezados `Cache-Control: "public, no-transform"` y expiración a 30 días sin sobrecargar el runtime Node.js.

---

## 7. Sistema de Contenido Técnico Markdown y Popovers de Glosario

### 7.1 Arquitectura de Renderizado Markdown Determinista
El componente `MarkdownRenderer` (`shared/markdown/MarkdownRenderer.tsx`) procesa artículos técnicos enriquecidos mediante un pipeline Unified/Remark/Rehype:
1. **Transformación AST con Remark Plugin (`createRemarkGlossary`):**
   - Transforma nodos de texto en el Árbol de Sintaxis Abstracta (AST) antes de la serialización HTML.
   - Aplica detección de palabras clave del glosario técnico de forma estricta (una sola ocurrencia por término por documento) de manera 100% determinista entre SSR y el cliente.
   - Excluye títulos (`h1`-`h6`), enlaces (`a`) y bloques de código de ser enlazados a glosario para mantener limpieza visual.
2. **Cumplimiento Estricto HTML5 Phrasing Content:**
   - La palabra clave interactiva dentro de párrafos `<p>` se renderiza mediante un elemento `<button>` accesible (`aria-haspopup="dialog"`).
   - El contenido flotante del popover nunca se inyecta directamente dentro del árbol `<p>`, evitando advertencias de hidratación de React por anidación inválida de bloques.

### 7.2 Arquitectura Flotante Desacoplada e Inmune a Colisiones (`GlossaryTermPopover`)
Para garantizar que los popovers explicativos nunca se corten por límites de pantalla, no colisionen con el término disparador al abrirse y mantengan precisión milimétrica en cualquier resolución:
* **React Portal (`createPortal(..., document.body)`):**
  - Desacopla físicamente el contenedor del diálogo flotante (`role="dialog"`) del contenedor padre en el DOM, montándolo directamente en la raíz del documento.
* **Medición Síncrona Pre-Paint (`useIsomorphicLayoutEffect`):**
  - Elimina el desfase de estimaciones de altura fijas (donde textos largos en anchos móviles de 320-380px generaban alturas de 320px+ pero se calculaban con fallbacks de 240px, tapando el término en el render inicial hasta que un evento de scroll forzaba el recálculo).
  - El elemento se monta en el Portal con `visibility: hidden` en el primer ciclo y se mide de forma síncrona en el ciclo de layout antes de que el navegador realice el primer repintado (*paint*), garantizando que las coordenadas iniciales sean 100% exactas desde el primer fotograma.
* **Geometría Bidireccional e Invariante Anticolisión:**
  - Calcula `triggerRect = triggerRef.current.getBoundingClientRect()` en tiempo real.
  - Compara el espacio disponible superior (`spaceAbove`) e inferior (`spaceBelow`) contra la altura real (`popoverHeight`). Si no hay espacio superior suficiente, realiza *flip* automático a `placement="bottom"`.
  - Aplica un invariante estricto donde el popover nunca puede sobrepasar la línea del término disparador: si `placement === 'top'`, la base nunca baja de `triggerRect.top - gap`; si el espacio es reducido en ambos lados, asigna dinámicamente `maxHeight` con `overflow-y-auto`.
* **Sincronización Continua y Reactiva (`ResizeObserver` + `scroll` en fase de captura):**
  - Vincula un `ResizeObserver` nativo al nodo del popover para reaccionar de inmediato si fuentes web o cambios de estilo alteran las dimensiones del contenido.
  - Escucha eventos globales de `scroll` (en fase de captura) y `resize` de la ventana para mantener el anclaje perfecto durante desplazamientos táctiles o con ratón.






---

## 9. Arquitectura de Recomendaciones Inteligentes en SSR y Telemetría de Lectura

Para resolver la recirculación editorial con cero parches, cero parpadeo visual y cero sobrecarga de red:

### 9.1 Renderizado de Servidor Síncrono (RSC)
En lugar de forzar descargas en el cliente (`useEffect` / `useDoiceladevPortal`), todas las páginas de detalle (`[slug]/page.tsx`) en los 8 módulos resuelven las recomendaciones síncronamente en el servidor:
1. **Lectura de Cookie de Historial (`cookies()`):** Lee la cookie HTTP `doicela_read_history` sin latencia de red.
2. **Petición Concurrente:** Ejecuta en paralelo dentro de `Promise.all`:
   ```ts
   serverGet<RecommendationCard[]>(
     `/doiceladev/recommendations?module=${module}&slug=${slug}&lang=${locale}${
       readHistory ? `&exclude=${encodeURIComponent(readHistory)}` : ''
     }`
   )
   ```
3. **Inyección en Layout:** Las tarjetas se entregan pre-renderizadas en el HTML a [`DoiceladevArticleLayout`](/doiceladev/widgets/article-layout/ui/DoiceladevArticleLayout.tsx) y [`RelatedArticlesNav`](/doiceladev/widgets/article-layout/ui/RelatedArticlesNav.tsx), garantizando paridad 1:1 entre SSR y el cliente (cero warnings de hidratación).

### 9.2 Telemetría Anónima Antifatiga (`ReaderHistoryTracker`)
* **Componente Aislado:** [`ReaderHistoryTracker.tsx`](/doiceladev/features/reader-history/ui/ReaderHistoryTracker.tsx) opera como un observador puro de cliente.
* **Almacenamiento Efímero en Cookie:** Mantiene un búfer FIFO de hasta 10 identificadores `slug` leídos recientemente (`max-age=30 días`, `SameSite=Lax`, < 150 bytes).
* **Cero Impacto en VPS:** No requiere persistencia de sesiones en el servidor ni genera escrituras en `doiceladev.sqlite`, blindando la memoria del servidor de 1 GB de RAM.

---

## 10. Toolbar Maestro de Filtros (`ModuleFilterToolbar`) y Directorios Transversales

### 10.1 Toolbar Maestro de Contenido (`shared/ui/ModuleFilterToolbar.tsx`)
Para erradicar la duplicación de código en las cabeceras de los módulos de contenido (`infrastructure`, `tutorials`, `cybersecurity`, `ai`, `blog`, `forum`, `news`, `projects`) y garantizar simetría estética permanente con los títulos centrados:
* **Inmunidad a Deformaciones (`shrink-0` y `max-w-md`):** El contenedor del buscador neumórfico (`glass-concave-panel`) cuenta con blindaje estricto contra compresión.
* **Disposición Vertical Centrada Universal:**
  - **Arriba:** Buscador neumórfico siempre centrado (`w-full max-w-md mx-auto`).
  - **Abajo:** Barra de pastillas de filtros siempre centrada (`w-fit max-w-full mx-auto`) con scroll horizontal fluido.
  - Elimina separaciones excesivas, asimetrías o colisiones en cualquier resolución de pantalla.
* **Acentos Dinámicos de Foco:** Conexión semántica de `focus:ring` según la paleta del módulo (`blue`, `cyan`, `purple`, `amber`, `emerald`, `rose`).
* **Integración con `CategoryFilterBar`:** Mantiene el selector táctil desplegable neumórfico (`DoiceladevSelect`) en pantallas móviles (`< sm`) y pestañas horizontales con scroll fluido en pantallas de escritorio.

### 10.2 Directorios y Hubs Taxonómicos Transversales (`/categories` y `/tags`)
* **Directorio de Categorías (`/categories/page.tsx`):** Vista de catálogo que expone todas las categorías técnicas consolidadas en una grilla de tarjetas neumórficas convexas minimalistas (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`). Cada bloque presenta exclusivamente el nombre de la categoría con interactividad completa y relieve al cursor hacia `/categories/[slug]`, eliminando conteos e insignias redundantes.
* **Directorio de Etiquetas (`/tags/page.tsx`):** Catálogo de etiquetas indexadas con numeral `#` y tipografía monoespaciada sin conteos numéricos superfluos, ordenadas orgánicamente con enlace hacia `/tags/[slug]`.
* **Hubs de Artículos Filtrados (`/categories/[slug]` y `/tags/[slug]`):** Server Components de alto rendimiento que resuelven síncronamente los artículos asociados mediante `serverGet`. Incorporan miga de pan canónica (`Inicio > Categorías` / `Inicio > Etiquetas`) y botón de retorno limpio (`← Categorías` / `← Etiquetas`) sin caracteres de flecha duplicados, presentando los contenidos en la grilla oficial con [`DoiceladevCard`](/doiceladev/shared/ui/DoiceladevCard.tsx).
* **Cabeceras de Módulo Despejadas:** Se erradicaron las líneas divisorias horizontales inferiores (`border-b border-black/5 dark:border-white/5`) en las cabeceras de todos los módulos temáticos y hubs, logrando una transición visual continua y limpia hacia las cuadrículas de contenido.

### 10.3 Motor de Búsqueda Difusa en Cliente y Cero Parpadeo (`useFuzzyFilter`)
Para solucionar de raíz el parpadeo de esqueletos (`animate-pulse`) durante la escritura y homologar la inteligencia de búsqueda con el buscador general (Spotlight):
* **Carga Inicial Única:** Los hooks de entidad (`useInfrastructure`, `useNews`, `useTutorials`, `useCybersecurity`, `useAi`, `useBlog`, `useForum`, `useProjects`) obtienen los datos del módulo una única vez por idioma activo (`GET /doiceladev/[modulo]?lang=es|en`). El estado `loading: true` con esqueletos pulsantes se activa exclusivamente durante esta carga inicial.
* **Filtrado Difuso Instantáneo en Memoria (`useFuzzyFilter.ts`):** Utiliza **Fuse.js** en memoria con tolerancia a fallos tipográficos (`threshold: 0.35`) y ponderación estricta por campos:
  * **Título / Nombre:** Peso 2.5
  * **Etiquetas / Tecnologías (`tags` / `techStack`):** Peso 1.8
  * **Categoría (Nivel 2):** Peso 1.2
  * **Extracto / Descripción:** Peso 0.8
* **Eliminación Total de Parpadeo y Latencia:** La selección de categorías y la búsqueda por texto o numeral (`#`) se ejecutan síncronamente en `< 1 ms` sin disparar peticiones HTTP por pulsación de tecla ni alterar el estado de `loading`, preservando la estabilidad visual de la cuadrícula.

### 10.4 Normalización Canónica de Slugs, Estética Neutra y Cero Destello
* **Resolución Canónica Bidireccional de Categorías:**
  - Las tarjetas (`SecurityCard`, `TutorialCard`, `BlogCard`, `NewsCard`, `AiCard`, `ProjectCard`) vinculan explícitamente el slug físico mediante `topicCategory={item.category}` (ej. `cve_analysis`).
  - Tanto `DoiceladevCard.tsx` (`CANONICAL_CATEGORY_MAP`) como el servicio backend `categories.service.ts` (`CATEGORY_ALIAS_MAP`) incorporan normalizadores defensivos con desacentuación (`normalize('NFD')`) y decodificación de URI (`decodeURIComponent`), garantizando que cualquier variación textual o alias resuelva de forma determinista hacia el slug canónico sin respuestas vacías ni títulos con código de escape (`%C3%A1`).
* **Migas de Pan (*Breadcrumbs*) Homogéneas y Libres de Subrayado:**
  - Se eliminaron colores de acento y subrayados forzados (`hover:underline`) en `DoiceladevArticleLayout`, `categories/[slug]` y `tags/[slug]`.
  - La navegación de cabecera mantiene un tono neutral uniforme (`text-slate-500 dark:text-zinc-400 hover:text-[var(--foreground)] font-medium`).
* **Bordes Perimetrales Neutros y Supresión de Anillo Nativo:**
  - Se suprimieron todos los bordes de color en hover (`hover:border-blue-500/30`, `hover:border-cyan-500/30`) en tarjetas, carrusel y directorios en favor de bordes neutros de vidrio esmerilado (`hover:border-slate-300 dark:hover:border-white/15`).
  - En las pastillas de filtro y navegación se neutralizó el foco con `outline-none focus:outline-none focus-visible:ring-2`, eliminando el destello rectangular negro del navegador al interactuar con el ratón.
