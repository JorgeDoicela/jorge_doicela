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
> * **Feature-Sliced Design (FSD):** `features/news/`, `features/blog/`, `features/forum/`, `features/ai/`, `features/cybersecurity/`, `features/tutorials/`, `features/projects/`, `features/infrastructure/`, `features/navigation/`.
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
├── components/                       # Componentes compartidos del subdominio
│   ├── BackToPortalButton.tsx        # Retorno directo al portal principal (Neumorphism / Glassmorphism)
│   ├── SoftwareCard.tsx              # Tarjeta atómica universal normalizada (escala exacta y neumorphism)
│   ├── ArticleCover.tsx              # Banner de portada 16:9 con soporte SVG procedural temático
│   ├── SoftwareHeaderNav.tsx         # Cabecera editorial y navegación unificada (Spotlight + ThemeToggle + LanguageToggle)
│   ├── SoftwarePageLayout.tsx        # Shell reutilizable para páginas (herencia de header, tema, footer)
│   ├── SoftwareArticleLayout.tsx     # Shell reutilizable para lectores de artículos individuales
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
└── features/                         # FEATURE-SLICED DESIGN (FSD)
    ├── navigation/                   # CategoryNav (filtro de las 8 categorías)
    ├── news/                         # NewsCard, NewsGrid, useNews, types
    ├── blog/                         # BlogCard, BlogGrid, useBlog, types
    ├── forum/                        # TopicCard, ForumSection, useForum, types
    ├── ai/                           # AiCard, AiGrid, useAi, types
    ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, types
    ├── tutorials/                    # TutorialCard, TutorialGrid, useTutorials, types
    ├── projects/                     # ProjectCard, ProjectGrid, useProjects, types
    ├── infrastructure/               # InfrastructureCard, InfrastructureGrid, useInfrastructure, types
    └── hub/                          # useSoftwareHub (consumo consolidado del endpoint GET /software/hub)
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
      * **Centro:** Menú de categorías ([`CategoryNav`](/software/features/navigation/components/CategoryNav.tsx)) con prop `bare` para integrarse limpiamente sin contenedores cóncavos redundantes, cubriendo las 8 áreas temáticas (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `forum`, `projects`, `infrastructure`). Funciona bajo **arquitectura canónica URL-driven**: cada pestaña enlaza directamente a su módulo dedicado (`/news`, `/blog`, `/infrastructure`, etc.), permitiendo que el usuario experimente el módulo completo con sus propios filtros, buscadores y controles avanzados sin estados efímeros en memoria que oculten las rutas.
      * **Flanco Derecho:** Utilidades integradas con el botón de lupa (buscador modal Spotlight `⌘K`) y el conmutador de idioma ([`LanguageToggle`](/software/features/navigation/components/LanguageToggle.tsx) ES/EN).
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
* **Normalización de Escala Tipográfica Universal (`SoftwareCard.tsx`):**
  * Para garantizar consistencia visual absoluta entre todas las categorías (Noticias, Blog, IA, Ciberseguridad, Tutoriales, Proyectos, Infraestructura, Foro) y la vista general (*Todo el Contenido / Publicaciones Destacadas*), se eliminaron las clases de escalado ad-hoc (como `sm:text-lg` o 18px en títulos destacados).
  * Toda tarjeta implementa la escala estándar calibrada de Noticias:
    * **Titular:** `text-base` (16px, `leading-snug`, `font-bold`), manteniendo altura uniforme sin saltos ni inflación visual.
    * **Metadatos y Categoría:** `text-[11px] font-mono text-zinc-400`, con soporte opcional para subcategorías técnicas o niveles de severidad.
    * **Extracto Descriptivo:** `text-xs` (12px, `text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5`).
    * **Contenedor y Elevación:** `glass-convex-panel rounded-2xl p-4 transition-all duration-300 hover:scale-[1.01]`.
* **Coherencia Editorial Total en las 8 Páginas de Categoría (`/[category]`):**
  * Las 8 páginas de listado (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`, `forum`) incorporan la misma estructura arquitectónica que el home `/`: cabecera editorial de marca [`SoftwareHeaderNav`](/software/components/SoftwareHeaderNav.tsx) con la categoría activa resaltada en la cápsula, botón de retorno a la raíz (`/`) con la etiqueta localizada `Inicio` (ES) / `Home` (EN), barra de búsqueda integrada, contenedor unificado `glass-convex-panel` con sombra 2xl y el pie de página completo [`SoftwareFooter`](/software/components/SoftwareFooter.tsx).
  * **Tarjetas con Banners de Portada (`ArticleCover` 16:9):** Todas las tarjetas de catálogo (`NewsCard`, `BlogCard`, `AiCard`, `SecurityCard`, `TutorialCard`, `ProjectCard`) integran en la parte superior el banner de portada en proporción 16:9 (`<ArticleCover />`), ya sea con su imagen real de alta resolución o con el banner procedural SVG temático neumórfico/glassmórfico de la categoría, estructuradas en grillas responsivas de 3 columnas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
* **Lector Editorial Unificado y Migas de Pan Embebidas (`SoftwareArticleLayout.tsx`):**
  * Shell reutilizable para todos los artículos individuales con cabecera adaptada: el botón de retroceso de la barra superior apunta a su respectiva categoría de origen (`← Infraestructura`, `← Noticias`, etc.).
  * **Integración Editorial en el Encabezado del Artículo:** La ruta jerárquica (`[🏠 Inicio] › [Categoría]`) se encuentra integrada de forma limpia dentro del `<header>` de la propia tarjeta `<article>` (`glass-convex-panel`), unificada con la fecha y metadatos con micro-iconos de Lucide (`Home`, `ChevronRight`). Esto erradica el texto plano huérfano flotante, elimina la redundancia con el título H1 inferior y garantiza una jerarquía espacial sobria y estándar de la industria.

---

## 6. Eliminación de Datos Hardcodeados y Erradicación de Tiempos de Lectura

* **Cero Cadenas en Duro (100% i18n con `next-intl`):**
  * Todo texto de interfaz de usuario (etiquetas, placeholders, accesibilidad `aria-label`, títulos de tooltips, mensajes de error, estados de carga y empty states) se resuelve a través de `messages/es.json` y `messages/en.json`.
  * Namespaces dedicados y consistentes: `Nav`, `Search`, `Common`, `Home`, `AuthorCard`, `Newsletter`, `Footer`, `Spotlight`, `CardActions`, `Filters`, `Detail`, `News`, `Blog`, `Forum`, `Ai`, `Cybersecurity`, `Tutorials`, `Projects`.
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
  1. **Diagramas Vectoriales Interactivos ([`MermaidBlock.tsx`](/software/components/markdown/MermaidBlock.tsx)):**
     * Detecta bloques de código con lenguaje `mermaid` (ej. `graph TD`, `sequenceDiagram`).
     * Renderizado mediante carga dinámica en cliente (`next/dynamic` con `ssr: false`). Si el artículo no contiene diagramas, la librería **nunca se descarga** en el navegador del usuario.
     * Sincronización en tiempo real con el tema de la aplicación (`light`/`dark`), botón para copiar el código fuente y fallback de error seguro.
  2. **Bloques de Código de Alta Precisión ([`CodeBlock.tsx`](/software/components/markdown/CodeBlock.tsx)):**
     * Resaltado de sintaxis profesional con `prismjs` para 13 lenguajes esenciales (`TypeScript`, `TSX`, `JavaScript`, `JSX`, `Bash`, `JSON`, `YAML`, `SQL`, `Python`, `Nginx`, `Docker`, `Markdown`, `INI`).
     * Cabecera con icono semántico (`Terminal` o `Code2`), badge de lenguaje en mayúsculas y botón interactivo para copiar código con feedback de confirmación (`¡Copiado!`).
     * Paleta calibrada Obsidian / Dark Luxury integrada en `globals.css` (funciones en ámbar, cadenas en esmeralda, palabras clave en índigo, comentarios en cursiva).
     * Soporte para código en línea (`InlineCode`).
  3. **Tablas Técnicas Responsivas ([`TableBlock.tsx`](/software/components/markdown/TableBlock.tsx)):**
     * Contenedor con desplazamiento horizontal suave para pantallas móviles, bordes redondeados y relieve neumórfico.
     * Encabezados con tipografía mono técnica en mayúsculas y filas alternadas con resaltado sutil al pasar el cursor.
  4. **Alertas y Callouts de Ingeniería ([`CalloutBlock.tsx`](/software/components/markdown/CalloutBlock.tsx)):**
     * Soporte automático para directivas estándar de GitHub: `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`.
     * Renderizado con micro-iconos de Lucide (`Info`, `Lightbulb`, `AlertCircle`, `AlertTriangle`, `ShieldAlert`), borde de color semántico y contenedor estilizado.
* **Orquestador Central ([`MarkdownRenderer.tsx`](/software/components/MarkdownRenderer.tsx)):**
  * Conecta `react-markdown` y `remark-gfm` con los componentes de la suite, garantizando una experiencia editorial homogénea en todas las subrutas `[slug]/page.tsx`.


