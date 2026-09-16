---
name: software-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de Software (software.jorgedoicela.com), incluyendo el frontend en Next.js 16 (estética Neumorphism UI + Glassmorphism, 8 categorías temáticas, páginas de listado y subrutas [slug] con FSD), backend en NestJS 11 (8 submódulos verticales, corpus/*.json, seeder atómico) y la base de datos software.sqlite (10 tablas relacionales).
---
# Directrices de Desarrollo: Plataforma de Software (software.jorgedoicela.com)

Esta habilidad define los estándares técnicos, estructura, modelo de datos y buenas prácticas de desarrollo para Software de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_frontend_y_hub_tecnologico.md](../../../docs/05-software/01-frontend/01_frontend_y_hub_tecnologico.md)
* [01_backend_y_persistencia.md](../../../docs/05-software/02-backend/01_backend_y_persistencia.md)
* [01_roadmap_software.md](../../../docs/05-software/03-roadmap/01_roadmap_software.md)

---

## 1. Arquitectura y Aislamiento (Principio de Cajas Negras)

* **Subdominio:** `software.jorgedoicela.com` (en desarrollo: `software.localhost:3001` o subruta `/software`).
* **Frontend:** Grupo de rutas `frontend/web/src/app/(software)/`.
* **Backend:** Módulo orquestador `backend/src/software/software.module.ts` compuesto por 7 submódulos verticales.
* **Persistencia:** Base de datos SQLite física independiente `software.sqlite` conectada mediante `'softwareConnection'` en TypeORM.
* **Aislamiento de Estilos y Diseño:** Utiliza exclusivamente su propio archivo `(software)/globals.css` (estética **Neumorphism UI + Glassmorphism**, combinando paneles táctiles cóncavos/convexos con desenfoques vítreos, reflejos esmerilados y sombras suaves superpuestas).
* **Aislamiento de Assets:** Recursos estáticos ubicados en `frontend/web/public/software/`.

---

## 2. Frontend Web (Next.js 16 + FSD)

### 2.1 Estructura de Directorios (FSD Canónico en 6 Capas)
```text
frontend/web/src/app/(software)/
├── messages/                         # Diccionarios locales de software (es.json, en.json)
├── globals.css                       # Estilos Neumorphism UI + Glassmorphism (Titanio Claro / Obsidiana Oscuro)
├── layout.tsx                        # Layout raíz del subdominio (ThemeProvider + NextIntlClientProvider + generateMetadata)
│
├── providers/                        # CAPA 1 (App): Proveedores globales aislados
│   ├── theme-provider.tsx            # Proveedor de tema local aislado (next-themes)
│   └── index.ts                      # Barrel export de providers
│
├── shared/                           # CAPA 6: UI Kit agnóstico, suite Markdown, SEO, Lib y Tipos
│   ├── ui/                           # SoftwareCard, BackToPortalButton, ScrollToTopButton, ArticleCover
│   ├── markdown/                     # MarkdownRenderer + CodeBlock, MermaidBlock, TableBlock, CalloutBlock
│   ├── seo/                          # SoftwareJsonLd (Schema.org JSON-LD bilingüe)
│   ├── lib/                          # api.ts (API_URL aislado), serverFetch, fetchJson
│   └── types/                        # spotlight.ts
│
├── entities/                         # CAPA 5: Modelos de dominio, Hooks API y Tarjetas de Entidad
│   ├── news/                         # NewsCard, NewsGrid, useNews, types.ts, index.ts
│   ├── blog/                         # BlogCard, BlogGrid, useBlog, types.ts, index.ts
│   ├── forum/                        # TopicCard, useForum, types.ts, index.ts
│   ├── ai/                           # AiCard, AiGrid, useAi, types.ts, index.ts
│   ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, types.ts, index.ts
│   ├── tutorials/                    # TutorialCard, TutorialGrid, TutorialStepWizard, useTutorials, types.ts, index.ts
│   ├── projects/                     # ProjectCard, ProjectGrid, ProjectActions, useProjects, types.ts, index.ts
│   ├── infrastructure/               # InfrastructureCard, InfrastructureGrid, useInfrastructure, types.ts, index.ts
│   └── hub/                          # SoftwareHubFeed, useSoftwareHub, types.ts, index.ts
│
├── features/                         # CAPA 4: Acciones e Interactividad del Usuario
│   ├── spotlight-search/             # SpotlightModal (Cmd + K) y búsqueda interactiva
│   ├── forum-reply/                  # ForumReplyForm, ForumSection
│   ├── language-toggle/              # LanguageToggle (ES / EN)
│   └── theme-toggle/                 # ThemeToggle (Titanio / Obsidiana)
│
├── widgets/                          # CAPA 3: Bloques Visuales Complejos y Layouts Shell
│   ├── software-header/              # SoftwareHeaderNav
│   ├── software-footer/              # SoftwareFooter
│   ├── category-nav/                 # CategoryNav (Selector unificado de 8 categorías)
│   ├── featured-carousel/            # FeaturedCarousel (Autoplay + Neumorphic Controls)
│   ├── article-layout/               # SoftwareArticleLayout + Sidebars (Author, ExploreTopics, FeaturedPosts, StayInformed)
│   └── page-layout/                  # SoftwarePageLayout
│
└── software/                         # CAPAS 2 & 1: Enrutamiento Físico Next.js App Router
    ├── page.tsx                      # Página principal: Bento Grid + feed editorial consolidado
    ├── news/                         # Catálogo (/news) y lector ([slug]/page.tsx)
    ├── blog/                         # Catálogo (/blog) y lector ([slug]/page.tsx)
    ├── forum/                        # Catálogo (/forum) e hilo de discusión ([slug]/page.tsx)
    ├── ai/                           # Directorio (/ai) y fichas técnicas ([slug]/page.tsx)
    ├── cybersecurity/                # Matriz (/cybersecurity) y avisos ([slug]/page.tsx)
    ├── tutorials/                    # Malla (/tutorials) y StepWizard ([slug]/page.tsx)
    ├── projects/                     # Showcase (/projects) y casos de estudio ([slug]/page.tsx)
    └── infrastructure/               # Catálogo (/infrastructure) y visor de specs ([slug]/page.tsx)
```

### 2.2 Las 8 Áreas Temáticas de Software
1. **Noticias (`news`):** Novedades y tendencias del sector de software con alertas breaking.
2. **Blog (`blog`):** Ensayos profundos sobre arquitectura de software y buenas prácticas.
3. **Foros (`forum`):** Espacio de discusión y debates técnicos comunitarios con respuestas anidadas.
4. **Inteligencia Artificial (`ai`):** Modelos de razonamiento, agentes, servidores MCP y herramientas.
5. **Ciberseguridad (`cybersecurity`):** Avisos de vulnerabilidades (LOW a CRITICAL), guías de bastionado y remediación.
6. **Tutoriales (`tutorials`):** Guías prácticas paso a paso con código reproducible y StepWizard interactivo.
7. **Proyectos (`projects`):** Galería showcase de herramientas y sistemas creados por Jorge.
8. **Infraestructura (`infrastructure`):** Servidores Linux, topologías cloud (AWS Lightsail), arquitectura en 1 GB de RAM, seguridad perimetral mTLS, rate limiting en Nginx, sandboxing en Docker y CI/CD.

### 2.3 Datos Estructurados (Schema.org) y Sincronización con IA
* **Datos Estructurados Schema.org ([`SoftwareJsonLd.tsx`](/software/shared/seo/SoftwareJsonLd.tsx)):** Inyección de esquema `SoftwareApplication` y `WebSite` con desglose de las 8 áreas tecnológicas (`hasPart`) para indexación en motores de búsqueda e IA.
* **Sincronización con IA:** Cuando se agreguen nuevos tipos de contenido, tutoriales o proyectos mayores en Software, reflejarlos en `public/software/llms.txt` y en `public/landing/llms.txt`.

### 2.4 Suite Editorial y Renderizado Técnico de Contenido (`shared/markdown/`)
* **Modelo Arquitectónico:** Almacenamiento de Markdown puro en `software.sqlite` (`contentMarkdown TEXT`) sin procesamiento pesado en NestJS (Zero-RAM en VPS 1 GB). El frontend Next.js intercepta y enriquece los elementos sintácticos mediante componentes React modulares y 100% reutilizables en todas las categorías:
  * **Diagramas Vectoriales Multidiagrama Adaptativos ([`MermaidBlock.tsx`](/software/shared/markdown/components/MermaidBlock.tsx)):** Renderizado en cliente con Mermaid 12 (`look: 'neo'`, `redux-color` / `redux-dark-color`, curvas `basis`). Detección tipificada robusta tolerante a comentarios (`%%`) y frontmatter (`---`). Cabecera técnica minimalista con solo iconos de acción (`Maximize2` y `Copy`/`Check`) con tooltips nativos. Arquitectura híbrida de primera clase: en el artículo el diagrama se ajusta de forma fluida (`max-w-full mx-auto`) sin recortes en móvil, y a escala natural 1:1 en PC (tope $1020\text{px}$). Visor modal inmersivo a pantalla completa inmune a grids montado en `document.body` vía `createPortal` con vidrio esmerilado suave (`backdrop-blur-xl bg-black/20 dark:bg-black/40`) sin barras superiores ni fondos negros densos: el SVG flota nítido a escala 1:1 en el centro y se cierra de forma natural al presionar afuera en el fondo o con `Escape`. Soporte apaisado (landscape) en móvil. Cero hacks, cero `!important` y cero impacto en RAM.
  * **Bloques de Código con Cabecera Inteligente ([`CodeBlock.tsx`](/software/shared/markdown/components/CodeBlock.tsx)):** Resaltado con `prismjs` para 13 lenguajes. Erradica semáforos de colores artificiales. Detecta automáticamente nombres de archivo y rutas en comentarios de la primera línea (ej. `📄 pm2.config.js`, `📄 nginx/jorgedoicela.com.conf`) para orientar didácticamente al lector; si se trata de scripts o comandos muestra `Bash` / `Shell`, y para logs o salida de comandos muestra `Terminal / Salida` (ES) / `Terminal / Output` (EN) vía `t('terminal')`. Incluye botón de copiado con confirmación interactiva.
  * **Tablas Técnicas de Ingeniería ([`TableBlock.tsx`](/software/shared/markdown/components/TableBlock.tsx) — Data-Grid Pro B1):** Contenedor convexo con relieve vítreo y sombra de elevación (`glass-convex-panel shadow-lg`), cabecera `thead` con sutil desenfoque (`backdrop-blur-md`) y línea guía `border-blue-500/30`, primera columna de claves/parámetros con ancho fijo `28%`, tipografía mono seminegrita, fondo sutil contrastado y borde divisorio vertical, e iluminación interactiva por fila en hover.
  * **Paneles de Resumen y Callouts ([`CalloutBlock.tsx`](/software/shared/markdown/components/CalloutBlock.tsx) — Blueprint Glass A1):** Directivas estándar de GitHub (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`) con micro-iconos semánticos de Lucide y blockquotes editoriales con riel vertical iluminado (`border-l-4 border-blue-500/80`).
* **Orquestador Universal:** Todos los lectores de artículos (`[slug]/page.tsx` de Tutoriales, Noticias, Blog, Ciberseguridad, Infraestructura, IA, Proyectos, Foros) delegan su contenido en [`MarkdownRenderer.tsx`](/software/shared/markdown/MarkdownRenderer.tsx), garantizando coherencia visual idéntica y reutilización universal en todo el sistema.

---

## 3. Backend y Modelo de Datos (NestJS 11)

### 3.1 Estructura de Directorios Backend
```text
backend/src/software/
├── software.module.ts                 # Orquestador puro (importa 8 submódulos, registra 10 entidades)
├── cli/
│   └── seed-software.ts               # Sembrado transaccional atómico CLI (9 tablas desde corpus/*.json)
│
├── corpus/                            # DATASETS JSON ESTRUCTURADOS (FUENTE DE VERDAD)
│   ├── news.json
│   ├── blog.json
│   ├── forum.json
│   ├── ai.json
│   ├── security.json
│   ├── tutorials.json
│   ├── projects.json
│   └── infrastructure.json
│
├── news/                              # NewsArticle (GET|POST /software/news)
├── blog/                              # BlogPost (GET|POST /software/blog)
├── forum/                             # ForumTopic + ForumReply (GET|POST /software/forum)
├── ai/                                # AiResource (GET|POST /software/ai)
├── cybersecurity/                     # SecurityPost (GET|POST /software/cybersecurity)
├── tutorials/                         # Tutorial + TutorialStep (GET|POST /software/tutorials)
├── projects/                          # Project (GET|POST|PATCH|DELETE /software/projects)
└── infrastructure/                    # InfrastructurePost (GET|POST /software/infrastructure)
```

### 3.2 10 Entidades TypeORM en `software.sqlite`

| Tabla | Propósito |
|---|---|
| `news_articles` | Noticias con `isBreaking`, `sourceUrl`, `readTimeMinutes`, `views`, `likes` |
| `blog_posts` | Ensayos con `series`, `tableOfContents`, `readTimeMinutes`, `views`, `likes` |
| `forum_topics` | Hilos con `isSolved`, `isPinned`, `repliesCount`, `views` |
| `forum_replies` | Respuestas con FK `topicId`, `parentId` (anidado), `isAcceptedAnswer`, `likes` |
| `ai_resources` | Catálogo con `type` (`llm`, `agent`, `framework`, `mcp_server`, `tool`), `license` |
| `security_posts` | Avisos con `severity` (`LOW` a `CRITICAL`), `postType`, `cveId`, `remediation` |
| `tutorials` | Guías con `difficulty` (`beginner`/`intermediate`/`advanced`), `estimatedMinutes` |
| `tutorial_steps` | Pasos con FK `tutorialId`, `stepOrder`, `codeSnippet`, `codeLanguage` |
| `projects` | Showcase con `status`, `featured`, `stars`, `repoUrl`, `liveUrl` |
| `infrastructure_posts` | Guías de infraestructura con `category`, `environment`, `specs`, `techStack`, `views`, `likes` |

---

## 4. Comandos de Operación

```bash
# 1. Sembrado atómico y recreación de software.sqlite (8 tablas desde corpus/*.json)
pnpm --filter backend seed:software

# 2. Agregar librerías con aislamiento
pnpm --filter backend add <paquete>
pnpm --filter web add <paquete>

# 3. Comprobación estricta de tipos en todo el monorepo
pnpm -r typecheck

# 4. Formato y linting
pnpm run lint
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Crear una tabla genérica con discriminador de categoría | Crea columnas vacías y rompe el modelo relacional a medida que el dominio crece. | Mantener entidades especializadas por submódulo. |
| Inyectar repositorios sin `'softwareConnection'` | Conecta a la base de datos equivocada. | Usar `@InjectRepository(Entity, 'softwareConnection')`. |
| Mezclar tipos de artículos con entidades de `bible` o `portfolio` | Rompe el principio de cajas negras. | Mantener las entidades dentro de `backend/src/software/<modulo>/entities/`. |
| Hardcodear datos en el frontend Next.js | Aumenta el bundle size del cliente y acopla datos con UI. | Consultar asíncronamente desde los endpoints de NestJS. |
| Poner datos semilla dentro del archivo `seed-software.ts` mezclados con código | A medida que crece el contenido, el seeder se convierte en un archivo monstruoso de miles de líneas. | Mantener los datos en `corpus/*.json` y el seeder solo como motor de inserción. |
| Usar emojis decorativos en la UI | Inconsistencia con la estética profesional de Software. | Usar tipografía, badges de texto y SVGs para indicadores visuales. |

---

## 6. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se agreguen, modifiquen, refactoricen o eliminen submódulos, controladores, servicios, endpoints REST, entidades TypeORM, esquemas en `software.sqlite`, datasets en `corpus/*.json` o componentes/rutas de Next.js, es **obligatorio actualizar la documentación técnica correspondiente en `docs/05-software/`**.
* **Gestión Documental Proactiva:** Se autoriza crear nuevos archivos `.md`, estructurar nuevas subcarpetas en `docs/05-software/` o podar contenido obsoleto, asegurando siempre que la documentación represente con exactitud y profesionalismo el estado real de la plataforma.

---

## 7. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para monorepo, pnpm --filter, FSD, proxy Nginx y despliegues).

