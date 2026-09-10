# Software - Frontend y Plataforma Tecnológica (Next.js)

Este documento detalla la arquitectura macro y micro, componentes, categorías temáticas y diseño de **Software** (`software.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Subdominio:** `software.jorgedoicela.com` (o `http://software.localhost:3001` en local).
> * **Enrutamiento:** `src/middleware.ts` reescribe el host hacia el grupo de rutas `frontend/web/src/app/(software)/`.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`, VPS 1 GB RAM).
> * **Aislamiento de Dominio:** Estilos independientes en `(software)/globals.css`. Cero importaciones de otros subdominios.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD):** `features/news/`, `features/blog/`, `features/forum/`, `features/ai/`, `features/cybersecurity/`, `features/tutorials/`, `features/projects/`, `features/navigation/`.
> * **Internacionalización Integral (i18n):** Soporte bilingüe completo (`es` / `en`) mediante `next-intl` en `messages/{es,en}.json` para las 7 categorías, barras de navegación (`MenuBar`, `Dock`), badges, metadatos, y consumo bilingüe dinámico hacia el backend vía `?lang=${locale}`.
> * **Jerarquía de Componentes:** Componentes encapsulados localmente con sus propios hooks y tipos.
> * **Estética Neumorphism UI + Glassmorphism:** Paneles táctiles cóncavos/convexos combinados con desenfoques vítreos translúcidos, reflejos esmerilados y sombras suaves superpuestas.

---

## 2. Estructura de Rutas y FSD

```text
frontend/web/src/app/(software)/
├── globals.css                       # Estilos aislados de Software (Neumorphism UI + Glassmorphism)
├── layout.tsx                        # Layout raíz del subdominio
├── components/                       # Componentes compartidos del subdominio
│   └── BackToPortalButton.tsx        # Retorno directo al portal principal (Neumorphism / Glassmorphism)
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
│   └── projects/
│       ├── page.tsx                  # Galería showcase con filtro por estado (activo / en desarrollo)
│       └── [slug]/page.tsx           # Caso de estudio y arquitectura de proyecto
│
└── features/                         # FEATURE-SLICED DESIGN (FSD)
    ├── navigation/                   # CategoryNav (filtro de las 7 categorías)
    ├── news/                         # NewsCard, NewsGrid, useNews, types
    ├── blog/                         # BlogCard, BlogGrid, useBlog, types
    ├── forum/                        # TopicCard, ForumSection, useForum, types
    ├── ai/                           # AiCard, AiGrid, useAi, types
    ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, types
    ├── tutorials/                    # TutorialCard, TutorialGrid, useTutorials, types
    └── projects/                     # ProjectCard, ProjectGrid, useProjects, types
```

---

## 3. Las 7 Categorías de Software

1. **Noticias (`news`):** Novedades y actualidad del desarrollo de software y tecnología con alertas breaking.
2. **Blog (`blog`):** Ensayos profundos sobre arquitectura de software, patrones de diseño y buenas prácticas.
3. **Foros (`forum`):** Espacio comunitario para debates técnicos, preguntas y respuestas anidadas.
4. **Inteligencia Artificial (`ai`):** Modelos de razonamiento, agentes, servidores MCP y herramientas de IA.
5. **Ciberseguridad (`cybersecurity`):** Avisos con matriz de severidad (LOW a CRITICAL), guías de bastionado y remediación.
6. **Tutoriales y Guías (`tutorials`):** Manuales paso a paso con código reproducible y asistente StepWizard.
7. **Proyectos (`projects`):** Catálogo de sistemas, librerías y herramientas desarrolladas por Jorge con enlaces demo/repo.

---

## 4. Internacionalización, SEO Dinámico y Dossier para IA (next-intl, Schema.org & GEO)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Software.Metadata` en `src/messages/es.json` y `src/messages/en.json`, con tarjetas completas Open Graph y Twitter.
* **Datos Estructurados Schema.org (`SoftwareJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `WebSite` con desglose de las 7 áreas tecnológicas (`hasPart`) para indexación en motores de búsqueda e IA.
* **Dossier Especializado para IA (`public/software/llms.txt`):** Desglose detallado de las 7 áreas de conocimiento, tutoriales StepWizard y proyectos servido en `software.jorgedoicela.com/llms.txt`.
* **Manifiesto PWA Independiente (`public/software/manifest.json`):** Configuración de aplicación web independiente con tema `#0b0f19`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://software.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(software)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.
* **Diccionarios UI Localizados:** Soporte para traducción de nombres de las 7 categorías, placeholders del buscador y etiquetas de estado.

---

## 5. Componentes de Interfaz y Estética Editorial Tech (Referencia MalwareTech + Neumorphism Pro)

* **Fusión Neumórfica y Vítrea Calibrada:** Contenedores y tarjetas construidos sobre `.glass-convex-panel` y `.glass-concave-panel` que combinan sombras cóncavas (efecto hendido) y convexas (relieve extruido) con fondos de cristal esmerilado translúcido (`backdrop-filter: blur(16px)`), gradientes lumínicos diagonales y bordes perimetrales vítreos.
* **Cabecera Editorial de Marca Centralizada:**
  * Imagotipo compuesto de alta nitidez y escala calibrada: icono [`logo_blanco.png`](/software/logo/logo_blanco.png) a la izquierda (`h-20 sm:h-24 md:h-28 lg:h-32`) y bloque tipográfico [`nombre_rol.png`](/software/logo/nombre_rol.png) a la derecha (`h-12 sm:h-15 md:h-18 lg:h-20`), asegurando una proporción armónica y legibilidad impecable.
  * Titular semántico accesible para SEO (`h1.sr-only`), eliminando el texto visual redundante para dar protagonismo absoluto al diseño del imagotipo.
  * Fila limpia de iconos de redes sociales libres sin contenedores invasivos (`w-6 h-6`, 24px) en color blanco nítido: LinkedIn, GitHub, YouTube, TikTok y Email de contacto, situados a proximidad inmediata bajo el logotipo (`text-white hover:text-zinc-300`).
  * **Barra de Navegación y Control Unificada a Ancho Completo (`w-full glass-concave-panel`):**
    * Encapsulada dentro de un único contenedor cóncavo continuo (`glass-concave-panel`) que abarca el 100% del ancho del layout, alineándose exactamente con los márgenes exteriores de las tarjetas de la grilla de publicaciones:
      * **Flanco Izquierdo:** Botón de retorno al portal principal ([`BackToPortalButton`](/software/components/BackToPortalButton.tsx)).
      * **Centro:** Menú de categorías ([`CategoryNav`](/software/features/navigation/components/CategoryNav.tsx)) con prop `bare` para integrarse limpiamente sin contenedores cóncavos redundantes, cubriendo las 7 áreas temáticas (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `forum`, `projects`) con filtrado en tiempo real y soporte scrollable.
      * **Flanco Derecho:** Utilidades integradas con el botón de lupa (buscador modal Spotlight `⌘K`) y el conmutador de idioma ([`LanguageToggle`](/software/features/navigation/components/LanguageToggle.tsx) ES/EN).
* **Portadas Visuales de Alta Precisión (`ArticleCover.tsx` en 16:9):**
  * Soporta imágenes estáticas con `next/image` y fallback procedural limpio y elegante con texturas de ingeniería (`.tech-grid-bg`), gradientes temáticos según categoría, refracción vítrea y un icono SVG central libre y flotante (`w-12 h-12`) sin recuadros ni marcos perimetrales.
* **Sección `Featured Posts` (Bandeja Envolvente y Celdas Internas):**
  * Las 3 publicaciones destacadas se organizan en un **panel envolvente amplio** (`glass-convex-panel` a ancho completo). Dentro de esta bandeja, cada artículo es una **celda interna definida** (`bg-black/20 dark:bg-[#16202c]/80 border border-black/5 dark:border-white/[0.07] rounded-2xl p-4 sm:p-5`) con banner 16:9 (`ArticleCover`), metadatos de categoría temáticos limpios y minimalistas, titulares prominentes y extractos técnicos, emulando la jerarquía de tarjetas contenidas de MalwareTech.
* **Sección `Latest Posts` (Bandeja Editorial y Celdas Internas):**
  * Toda la cuadrícula de publicaciones generales y filtradas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) reside dentro de su **panel envolvente amplio** (`glass-convex-panel` a ancho completo), alojando cada publicación como una **celda interna individualizada** con fondo distintivo y esquinas redondeadas, logrando coherencia visual absoluta en toda la revista técnica.
* **Coherencia Editorial Total en las 7 Páginas de Categoría (`/software/[category]`):**
  * Las 7 páginas de listado (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `projects`, `forum`) incorporan la misma estructura arquitectónica que el home `/software`: cabecera editorial de marca [`SoftwareHeaderNav`](/software/components/SoftwareHeaderNav.tsx) con la categoría activa resaltada en la cápsula, retorno a `/software`, barra de búsqueda integrada, contenedor unificado `glass-convex-panel` con sombra 2xl y el pie de página completo [`SoftwareFooter`](/software/components/SoftwareFooter.tsx).
  * **Tarjetas con Banners de Portada (`ArticleCover` 16:9):** Todas las tarjetas de catálogo (`NewsCard`, `BlogCard`, `AiCard`, `SecurityCard`, `TutorialCard`, `ProjectCard`) integran en la parte superior el banner de portada en proporción 16:9 (`<ArticleCover />`), ya sea con su imagen real de alta resolución o con el banner procedural SVG temático neumórfico/glassmórfico de la categoría, estructuradas en grillas responsivas de 3 columnas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).

---

## 6. Eliminación de Datos Hardcodeados y Erradicación de Tiempos de Lectura

* **Cero Cadenas en Duro (100% i18n con `next-intl`):**
  * Todo texto de interfaz de usuario (etiquetas, placeholders, accesibilidad `aria-label`, títulos de tooltips, mensajes de error, estados de carga y empty states) se resuelve a través de `messages/es.json` y `messages/en.json`.
  * Namespaces dedicados y consistentes: `Nav`, `Search`, `Common`, `Home`, `AuthorCard`, `Newsletter`, `Footer`, `Spotlight`, `CardActions`, `Filters`, `Detail`, `News`, `Blog`, `Forum`, `Ai`, `Cybersecurity`, `Tutorials`, `Projects`.
* **Erradicación Total de "Tiempos de Lectura":**
  * Se eliminaron por completo las estimaciones de lectura ("5 min lectura", "readingTime") tanto en la base de datos `software.sqlite` (entidades TypeORM), en los esquemas y corpus JSON, como en todos los componentes de la interfaz (`NewsCard`, `BlogCard`, `TutorialCard`, etc.). La plataforma sigue una filosofía de ingeniería y referencia directa sin métricas artificiales.
* **Slugs Canónicos Bilingües:**
  * Cada recurso mantiene el mismo `slug` canónico para español e inglés en la base de datos (`IDX_<tabla>_slug_lang`), permitiendo alternar de idioma con `LanguageToggle` de manera instantánea sin redirecciones 404 ni roturas de navegación.


