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
> * **Feature-Sliced Design (FSD):** `features/news/`, `features/blog/`, `features/forum/`, `features/ai/`, `features/cybersecurity/`, `features/tutorials/`, `features/projects/`, `features/infrastructure/`, `features/hub/`. Componentes UI compartidos y de navegación desacoplados en `components/`.
> * **Internacionalización Integral (i18n):** Soporte bilingüe completo (`es` / `en`) mediante `next-intl` en `messages/{es,en}.json` para las 8 categorías, barras de navegación (`MenuBar`, `Dock`), badges, metadatos, y consumo bilingüe dinámico hacia el backend vía `?lang=${locale}`.
> * **Jerarquía de Componentes:** Componentes encapsulados localmente con sus propios hooks y tipos.
> * **Estética Neumorphism UI + Glassmorphism:** Paneles táctiles cóncavos/convexos combinados con desenfoques vítreos translúcidos, reflejos esmerilados y sombras suaves superpuestas.

---

## 2. Estructura de Rutas y FSD

```text
frontend/web/src/app/(software)/
├── globals.css                       # Estilos aislados de Software (Neumorphism UI + Glassmorphism: Titanio Claro / Obsidiana Oscuro)
├── theme-provider.tsx                # Proveedor de tema local aislado (next-themes)
├── layout.tsx                        # Layout raíz del subdominio (ThemeProvider + NextIntlClientProvider)
├── components/                       # Componentes compartidos del subdominio (Widgets & Shared UI)
│   ├── BackToPortalButton.tsx        # Retorno directo al portal principal (Neumorphism / Glassmorphism)
│   ├── CategoryNav.tsx               # Selector unificado de las 8 categorías (URL-driven con pestañas de escritorio y dropdown táctil)
│   ├── LanguageToggle.tsx            # Selector de idioma ES/EN con persistencia y refresh
│   ├── ThemeToggle.tsx               # Alternador de tema Titanio Claro / Obsidiana Oscuro
│   ├── Dock.tsx                      # Barra de navegación flotante estilo macOS
│   ├── MenuBar.tsx                   # Cabecera de sistema con reloj Guayaquil y Spotlight
│   ├── SpotlightModal.tsx            # Buscador omnisciente Cmd+K multi-dominio
│   ├── SoftwareCard.tsx              # Tarjeta atómica universal normalizada (escala exacta y neumorphism)
│   ├── ArticleCover.tsx              # Banner de portada 16:9 con soporte SVG procedural temático
│   ├── SoftwareHeaderNav.tsx         # Cabecera editorial y navegación unificada
│   ├── SoftwarePageLayout.tsx        # Shell reutilizable para páginas (herencia de header, tema, footer)
│   ├── SoftwareArticleLayout.tsx     # Shell reutilizable para lectores de artículos individuales (Sidebar MalwareTech)
│   ├── FeaturedPostsSidebarCard.tsx  # Tarjeta de artículos destacados con miniaturas cuadradas 1:1
│   ├── FeaturedCarousel.tsx          # Carrusel interactivo para publicaciones destacadas (Autoplay + Neumorphic Controls)
│   ├── ExploreTopicsSidebarCard.tsx  # Explorador de las 8 categorías con contadores vivos
│   ├── ScrollToTopButton.tsx         # Botón flotante para retorno suave al inicio de página
│   ├── MarkdownRenderer.tsx          # Orquestador formal de contenido técnico (react-markdown + suite markdown/)
│   ├── markdown/                     # SUITE EDITORIAL MODULAR DE CONTENIDO TÉCNICO
│   │   ├── CodeBlock.tsx             # Bloque de código con Prism syntax highlighting, badge y botón "Copiar"
│   │   ├── MermaidBlock.tsx          # Renderizador dinámico de diagramas SVG vectoriales (Mermaid.js, Zero-RAM en SSR)
│   │   ├── TableBlock.tsx            # Tablas responsivas GFM con scroll horizontal y estilo neumórfico
│   │   ├── CalloutBlock.tsx          # Alertas tipo GitHub ([!NOTE], [!WARNING], [!TIP], [!IMPORTANT], [!CAUTION])
│   │   └── index.ts                  # Barril de exportación
│   └── SoftwareFooter.tsx            # Pie de página tecnológico institucional
├── software/                         # SUBRUTAS DE PÁGINAS INDIVIDUALES
│   ├── page.tsx                      # Vista principal de Software (Bento Grid + filtro dinámico de 7 categorías)
│   ├── news/
│   │   ├── page.tsx                  # Catálogo de noticias con buscador en tiempo real
│   │   └── [slug]/page.tsx           # Lector de noticia con fuente oficial
│   ├── blog/
│   │   ├── page.tsx                  # Catálogo de artículos del blog
│   │   └── [slug]/page.tsx           # Lector de ensayo con tabla de contenidos
│   ├── forum/
│   │   ├── page.tsx                  # Lista de temas del foro con filtros de estado
│   │   └── [slug]/page.tsx           # Hilo de discusión con árbol de respuestas y formulario
│   ├── ai/
│   │   ├── page.tsx                  # Directorio de modelos IA, agentes y MCP servers con filtro por tipo
│   │   └── [slug]/page.tsx           # Ficha técnica de modelo / agente / MCP server
│   ├── cybersecurity/
│   │   ├── page.tsx                  # Matriz de avisos con filtro por severidad (LOW a CRITICAL)
│   │   └── [slug]/page.tsx           # Aviso de seguridad con severidad y remediación
│   ├── tutorials/
│   │   ├── page.tsx                  # Malla de tutoriales con filtro por dificultad
│   │   └── [slug]/page.tsx           # Tutorial interactivo paso a paso (StepWizard)
│   ├── projects/
│   │   ├── page.tsx                  # Galería showcase con filtro por estado (activo / en desarrollo)
│   │   └── [slug]/page.tsx           # Caso de estudio y arquitectura de proyecto
│   └── infrastructure/
│       ├── page.tsx                  # Catálogo de infraestructura con selector de categorías y buscador
│       └── [slug]/page.tsx           # Lector técnico interactivo con visor de specs del servidor
│
└── features/                         # FEATURE-SLICED DESIGN (FSD: Features de Negocio con Barriles index.ts)
    ├── news/                         # NewsCard, NewsGrid, useNews, types, index.ts
    ├── blog/                         # BlogCard, BlogGrid, useBlog, types, index.ts
    ├── forum/                        # TopicCard, ForumSection, useForum, types, index.ts
    ├── ai/                           # AiCard, AiGrid, useAi, types, index.ts
    ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, types, index.ts
    ├── tutorials/                    # TutorialCard, TutorialGrid, useTutorials, types, index.ts
    ├── projects/                     # ProjectCard, ProjectGrid, useProjects, types, index.ts
    ├── infrastructure/               # InfrastructureCard, InfrastructureGrid, useInfrastructure, types, index.ts
    └── hub/                          # SoftwareHubFeed, useSoftwareHub, types, index.ts (consumo consolidado GET /software/hub)
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
      * **Flanco Izquierdo:** Botón adaptativo de retorno ([`BackToPortalButton`](/software/components/BackToPortalButton.tsx)): enlaza al portal central `jorgedoicela.com` desde la raíz con etiqueta `Portal`, o a la raíz del subdominio (`/`) desde páginas de categoría con la etiqueta internacionalizada `Inicio` (ES) / `Home` (EN).
      * **Centro:** Menú de categorías ([`CategoryNav`](/software/components/CategoryNav.tsx)) con prop `bare` para integrarse limpiamente sin contenedores cóncavos redundantes, cubriendo las 8 áreas temáticas (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `forum`, `projects`, `infrastructure`). Funciona bajo **arquitectura canónica URL-driven**: cada pestaña enlaza directamente a su módulo dedicado (`/news`, `/blog`, `/infrastructure`, etc.), permitiendo que el usuario experimente el módulo completo con sus propios filtros, buscadores y controles avanzados sin estados efímeros en memoria que oculten las rutas.
      * **Flanco Derecho:** Utilidades integradas con el botón de lupa (buscador modal Spotlight `⌘K`) y el conmutador de idioma ([`LanguageToggle`](/software/components/LanguageToggle.tsx) ES/EN).
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
  * Las 8 páginas de listado (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`, `forum`) incorporan la misma estructura arquitectónica que el home `/`: cabecera editorial de marca [`SoftwareHeaderNav`](/software/components/SoftwareHeaderNav.tsx) con la categoría activa resaltada en la cápsula, botón de retorno a la raíz (`/`) con la etiqueta localizada `Inicio` (ES) / `Home` (EN), barra de búsqueda integrada, contenedor unificado `glass-convex-panel` con sombra 2xl y el pie de página completo [`SoftwareFooter`](/software/components/SoftwareFooter.tsx).
  * **Tarjetas con Banners de Portada (`ArticleCover` 16:9):** Todas las tarjetas de catálogo (`NewsCard`, `BlogCard`, `AiCard`, `SecurityCard`, `TutorialCard`, `ProjectCard`) integran en la parte superior el banner de portada en proporción 16:9 (`<ArticleCover />`), ya sea con su imagen real de alta resolución o con el banner procedural SVG temático neumórfico/glassmórfico de la categoría, estructuradas en grillas responsivas de 3 columnas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
* **Lector Editorial Unificado y Migas de Pan Embebidas (`SoftwareArticleLayout.tsx`):**
  * Shell reutilizable para todos los artículos individuales con cabecera adaptada: el botón de retroceso de la barra superior apunta a su respectiva categoría de origen (`← Infraestructura`, `← Noticias`, etc.).
  * **Integración Editorial en el Encabezado del Artículo:** La ruta jerárquica (`[🏠 Inicio] › [Categoría]`) se encuentra integrada de forma limpia dentro del `<header>` de la propia tarjeta `<article>` (`glass-convex-panel`), unificada con la fecha y metadatos con micro-iconos de Lucide (`Home`, `ChevronRight`). Esto erradica el texto plano huérfano flotante, elimina la redundancia con el título H1 inferior y garantiza una jerarquía espacial sobria y estándar de la industria.
* **Navegación Flotante Global "Scroll to Top" ([`ScrollToTopButton.tsx`](/software/components/ScrollToTopButton.tsx)):**
  * Botón flotante interactivo situado en la esquina inferior derecha (`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40`).
  * Detección reactiva de scroll con listener pasivo de alto rendimiento: permanece oculto en la cabecera y se revela con animación fluida de opacidad y elevación al desplazarse más de 300px hacia abajo.
  * Al activarlo, ejecuta un desplazamiento suave hasta la parte superior de la página (`window.scrollTo({ top: 0, behavior: 'smooth' })`).
  * Diseño Neumórfico UI + Glassmorphic (`.glass-convex-panel`), micro-interacciones táctiles al hover/active, icono `ArrowUp` de Lucide y soporte bilingüe (`Nav.scrollToTop`). Se integra a nivel global en el layout raíz `(software)/layout.tsx` para todas las páginas y subrutas de Software.
* **Barra Lateral de Recirculación Editorial ([`FeaturedPostsSidebarCard.tsx`](/software/components/FeaturedPostsSidebarCard.tsx)):**
  * Inspirado en la arquitectura editorial de **Marcus Hutchins (MalwareTech)** y alineado 100% con la estética **Neumorphism UI + Glassmorphism** de Software, sustituye las fichas estáticas de hardware por un widget dinámico de publicaciones destacadas de alta retención.
  * **Diseño Tipográfico Puro y Ultraligero:** Cada fila presenta metadatos contextuales ricos (`categoryMeta` o `tag`, ej. *95 estrellas GitHub*, *Anthropic — MCP_SERVER*, *Aviso HIGH — Ciberseguridad, Linux*) en tipografía mono (`text-[11px] font-mono text-slate-500 dark:text-zinc-400`) y titular en negrita con micro-transición cromática en hover, eliminando imágenes miniaturas pesadas o decorativas para priorizar la velocidad de lectura, el enfoque tipográfico y la sobriedad ejecutiva en todo el ancho del componente.
  * Integra filtrado contextual automático (`usePathname`) para nunca recomendar el artículo actualmente abierto y skeletons de carga fluidos integrados.
* **Directorio Tipográfico con Acordeón por Especialidad ([`ExploreTopicsSidebarCard.tsx`](/software/components/ExploreTopicsSidebarCard.tsx)):**
  * Inspirado en la navegación técnica de **Marcus Hutchins (MalwareTech)** y optimizado para la ergonomía del sidebar fijo (`sticky`), implementa un **árbol interactivo multi-apertura por cada especialidad**:
    * **Despliegue Multi-Apertura Concurrente (Sin Cierre Automático):** Al pulsar sobre cualquiera de las 8 especialidades (Ciberseguridad, Infraestructura, IA, Tutoriales, Proyectos, Blog, Noticias, Foros), la fila se expande suavemente revelando sus publicaciones sin colapsar ni cerrar automáticamente las demás especialidades previamente abiertas, permitiendo navegación y comparación simultánea fluida.
    * **Minimalismo Visual Sobrio:** Erradica iconos temáticos SVG innecesarios en la lista de categorías, conservando una presentación limpia y monocromática con el chevron indicador `ChevronRight` rotativo, el label de la categoría y la pastilla cóncava neumórfica (`glass-concave-panel px-2.5 py-0.5 rounded-md text-[11px] font-mono`) con conteo dinámico de artículos.
    * **Estética de Rama Técnica Centrada en Títulos (Tree / Branch View):** Al expandir una categoría, despliega un riel vertical con línea guía (`border-l-2 border-blue-500/25`) y **únicamente el título limpio de cada publicación** (alineado directamente sin puntos, viñetas ni metadatos intermedios para una lectura minimalista inmediata), finalizando con el enlace terminal limpio `Todo el Contenido ↗` (sin números redundantes, ya que el conteo vive exclusivamente en la pastilla cóncava superior).
  * Consolida la jerarquía editorial de 4 niveles en la barra lateral fija ([`SoftwareArticleLayout.tsx`](/software/components/SoftwareArticleLayout.tsx)): **1. Autor (`AuthorSidebarCard`) → 2. Publicaciones Destacadas (`FeaturedPostsSidebarCard`) → 3. Explorador de Especialidades (`ExploreTopicsSidebarCard`) → 4. Mantente Informado (`StayInformedCard`)**.

---

## 6. Eliminación de Datos Hardcodeados y Erradicación de Tiempos de Lectura

* **Cero Cadenas en Duro (100% i18n con `next-intl`):**
  * Todo texto de interfaz de usuario (etiquetas, placeholders, accesibilidad `aria-label`, títulos de tooltips, mensajes de error, estados de carga, empty states, botones de copia de código y diagramas, y badges de callout) se resuelve a través de `messages/es.json` y `messages/en.json`.
  * Namespaces dedicados y consistentes con paridad 1:1 estricta: `Metadata`, `Nav`, `Search`, `Common`, `Home`, `AuthorCard`, `Newsletter`, `Footer`, `Spotlight`, `CardActions`, `Filters`, `Detail`, `Markdown`, `News`, `Blog`, `Forum`, `Ai`, `Cybersecurity`, `Tutorials`, `Projects`, `Infrastructure`.
  * Datos estructurados `Schema.org` ([`SoftwareJsonLd.tsx`](/software/components/SoftwareJsonLd.tsx)) dinámicamente localizados según el `locale` activo.
* **Erradicación Total de "Tiempos de Lectura":**
  * Se eliminaron por completo las estimaciones de lectura ("5 min lectura", "readingTime") tanto en la base de datos `software.sqlite` (entidades TypeORM), en los esquemas y corpus JSON, como en todos los componentes de la interfaz (`NewsCard`, `BlogCard`, `TutorialCard`, etc.). La plataforma sigue una filosofía de ingeniería y referencia directa sin métricas artificiales.
* **Slugs Canónicos Bilingües:**
  * Cada recurso mantiene el mismo `slug` canónico para español e inglés en la base de datos (`IDX_<tabla>_slug_lang`), permitiendo alternar de idioma con `LanguageToggle` de manera instantánea sin redirecciones 404 ni roturas de navegación.

---

## 7. Suite Editorial y Renderizado de Contenido Técnico (Markdown Enriquecido)

* **Almacenamiento Desacoplado en Base de Datos (`software.sqlite`):**
  * El contenido técnico de todas las categorías se almacena como texto plano Markdown estándar (`contentMarkdown TEXT` o `content TEXT`).
  * **Cero Carga en el Servidor (VPS 1 GB RAM):** El backend en NestJS se limita a servir el texto crudo sin transformaciones pesadas ni manipulación de árboles sintácticos en el servidor.
  * **Seguridad (Inmunidad XSS):** No se almacena HTML crudo en base de datos. El parsing lo realiza el cliente de forma controlada y segura mediante componentes React.
* **Componentes Modulares Especializados (`components/markdown/`):**
   1. **Diagramas Vectoriales Multidiagrama Adaptativos Estilo Mermaid Chart ([`MermaidBlock.tsx`](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(software)/components/markdown/MermaidBlock.tsx)):**
      * **Detección Tipificada Robusta:** Analiza el bloque ignorando comentarios (`%%`) y frontmatter YAML (`---`) para identificar automáticamente la familia del diagrama (`sequenceDiagram`, `flowchart` / `graph`, `classDiagram`, `erDiagram`, `stateDiagram-v2`, `gitGraph`, `architecture-beta`, `c4Context`, `mindmap`, `pie`, etc.).
      * **Cabecera Técnica Minimalista (Solo Iconos de Acción):** Muestra el título específico del tipo de diagrama traducido vía `next-intl` con su icono temático de Lucide, y a la derecha dos botones de acción con **solo iconos** de alta precisión (`Maximize2` para expandir y `Copy` / `Check` para copiar) con tooltips nativos accesibles, manteniendo máxima sobriedad y elegancia sin saturar la cabecera con textos redundantes.
      * **Renderizado Universal en Cliente (Mermaid 12):** Motor configurado con `look: 'neo'`, paleta semántica `redux-color` en claro y `redux-dark-color` en oscuro, curvas orgánicas `basis` en flowcharts y tipografía uniforme ($14\text{px}$ a $15\text{px}$).
      * **Arquitectura Híbrida de Primera Clase (Ajuste Fluido en Artículo + Visor de Inspección Forense a Pantalla Completa):**
        - *En el Artículo (Móvil y Escritorio):* El diagrama se muestra siempre **completo de inicio a fin** (`max-w-full mx-auto`), sin recortes a la izquierda ni barras de scroll forzadas que interrumpan el flujo de lectura. En escritorio respeta su ancho intrínseco 1:1 (`targetInlineWidth` hasta $1020\text{px}$) centrado simétricamente sin agigantarse.
        - *Visor Inmersivo a Pantalla Completa Inmune a Grids (`createPortal`):* Al pulsar el botón de expandir o hacer click en el diagrama (`cursor-zoom-in`), se monta un lienzo modal directamente en `document.body` mediante `createPortal`, cubriendo el $100\%$ real de la pantalla del dispositivo (`z-[999999]`) con vidrio esmerilado suave de alta fidelidad (`backdrop-blur-xl bg-black/20 dark:bg-black/40`), eliminando fondos oscuros pesados y permitiendo un efecto bokeh elegante donde el artículo de fondo se difumina sutilmente. Diseñado sin barras superiores redundantes: el SVG flota nítido a escala 1:1 en el centro y se cierra de manera intuitiva simplemente al pulsar en cualquier lugar afuera (en el fondo) o mediante la tecla `Escape`. Permite rotar el móvil a horizontal (*landscape*) o inspeccionar notas técnicas y flujos densos con total libertad.
        - *Calibración Armónica de Secuencia (Mermaid 12):* Cajas de actores optimizadas ($140\text{px} \times 48\text{px}$), márgenes calibrados ($45\text{px}$ entre participantes, $35\text{px}$ entre mensajes) y tipografía uniforme ($13\text{px}$–$14\text{px}$).
      * **Arquitectura Cero-RAM:** Modal ligero en React puro montado con portal nativo sin librerías externas; cero impacto en memoria en el servidor VPS de 1 GB.
   2. **Bloques de Código de Alta Precisión con Cabecera Inteligente ([`CodeBlock.tsx`](/software/components/markdown/CodeBlock.tsx)):**
     * Resaltado de sintaxis profesional con `prismjs` para 13 lenguajes esenciales (`TypeScript`, `TSX`, `JavaScript`, `JSX`, `Bash`, `JSON`, `YAML`, `SQL`, `Python`, `Nginx`, `Docker`, `Markdown`, `INI`).
     * **Cabecera Inteligente Contextual y 100% Localizada:** Erradica los semáforos de colores decorativos y las etiquetas toscas de "Texto Plano". Detecta automáticamente nombres de archivo y rutas en comentarios de la primera línea (ej. `📄 pm2.config.js`, `📄 nginx/jorgedoicela.com.conf`) para orientar didácticamente al lector; si se trata de scripts o comandos muestra `Bash` / `Shell`, y para logs de error o salida de comandos muestra `Terminal / Salida` (ES) / `Terminal / Output` (EN) vía `t('terminal')`.
     * **Botón Interactivo Minimalista (Solo Icono):** Muestra exclusivamente el micro-icono de Lucide (`Copy` / `Check`) con feedback mediante tooltip nativo accesible y micro-interacción táctil, eliminando etiquetas de texto redundantes y manteniendo simetría total con la cabecera de diagramas.
     * Paleta calibrada Obsidian / Dark Luxury integrada en `globals.css` (funciones en ámbar, cadenas en esmeralda, palabras clave en índigo, comentarios en cursiva).
     * Soporte para código en línea (`InlineCode`).
  3. **Tablas Técnicas de Ingeniería Enterprise Data-Grid Pro ([`TableBlock.tsx`](/software/components/markdown/TableBlock.tsx)):**
      * Marco de cristal convexo (`glass-convex-panel`) con borde vítreo perimetral y sombra de elevación suave (`shadow-lg`).
     * Cabecera `thead` con sutil desenfoque (`backdrop-blur-md`), línea guía inferior `border-blue-500/30` y tipografía mono técnica en mayúsculas (`text-[11px] uppercase tracking-wider font-bold`).
     * **Diferenciación Estructural de Clave/Parámetro:** La primera columna (`td:first-child`, ancho fijo `28%`) posee tipografía mono seminegrita, fondo sutil contrastado (`bg-black/[0.015] dark:bg-white/[0.015]`) y borde divisorio vertical para identificar inmediatamente la clave del parámetro frente a los valores y detalles.
     * Filas con transición fluida de iluminación interactiva al pasar el cursor (`hover:bg-blue-500/[0.035] dark:hover:bg-blue-400/[0.04]`).
  4. **Paneles de Resumen Técnico y Callouts Blueprint Glass ([`CalloutBlock.tsx`](/software/components/markdown/CalloutBlock.tsx)):**
     * **Diseño Simétrico Neumórfico / Glassmórfico Unificado:** Todos los paneles de resumen (`post.architectureOverview`, `post.remediation`), directivas de alerta de GitHub (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`) y citas se renderizan bajo la misma estructura arquitectónica limpia y simétrica: marco de cristal convexo (`glass-convex-panel`), esquinas simétricas (`rounded-2xl`), gradiente de color sutil por tipo, titular semántico en mayúsculas monospace (`text-[11px] font-mono font-bold tracking-wider uppercase`) y cuerpo de texto nítido sin forzar cursivas ni barras laterales asimétricas (`border-l-4`), erradicando cualquier inconsistencia visual en todo el subdominio.
* **Orquestador Central ([`MarkdownRenderer.tsx`](/software/components/MarkdownRenderer.tsx)):**
  * Conecta `react-markdown` y `remark-gfm` con los componentes de la suite, garantizando una experiencia editorial homogénea en todas las subrutas `[slug]/page.tsx`.

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



