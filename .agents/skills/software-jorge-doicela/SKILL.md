---
name: software-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de Software (software.jorgedoicela.com), incluyendo el frontend en Next.js 16 (estética Neumorphism UI + Glassmorphism, 8 categorías temáticas, páginas de listado y subrutas [slug] con FSD), backend en NestJS 11 (8 submódulos verticales, corpus/*.json, seeder atómico) y la base de datos software.sqlite (10 tablas relacionales).
---
# Directrices de Desarrollo: Plataforma de Software (software.jorgedoicela.com)

Esta habilidad define los estándares técnicos, estructura, modelo de datos y buenas prácticas de desarrollo para Software de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_frontend_y_hub_tecnologico.md](../../../docs/05-software/01-frontend/01_frontend_y_hub_tecnologico.md)
* [02_backend_y_persistencia.md](../../../docs/05-software/02-backend/01_backend_y_persistencia.md)
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

### 2.1 Estructura de Directorios
```text
frontend/web/src/app/(software)/
├── messages/                         # Diccionarios locales de software (es.json, en.json)
├── globals.css                       # Estilos Neumorphism UI + Glassmorphism (Titanio Claro / Obsidiana Oscuro)
├── theme-provider.tsx                # Proveedor de tema local aislado (next-themes)
├── layout.tsx                        # Layout raíz del subdominio (ThemeProvider + NextIntlClientProvider + generateMetadata)
├── components/                       # Componentes compartidos (SoftwareHeaderNav con ThemeToggle, SoftwarePageLayout, SoftwareFooter, etc.)
├── software/                         # Subrutas individuales

│   ├── page.tsx                      # Página principal: Bento Grid + selector de 7 categorías
│   ├── news/
│   │   ├── page.tsx                  # Catálogo de noticias con buscador en tiempo real
│   │   └── [slug]/page.tsx           # Lector de noticia individual con fuente oficial
│   ├── blog/
│   │   ├── page.tsx                  # Catálogo de artículos del blog
│   │   └── [slug]/page.tsx           # Lector editorial con tabla de contenidos
│   ├── forum/
│   │   ├── page.tsx                  # Lista de temas del foro con filtros de estado
│   │   └── [slug]/page.tsx           # Hilo con árbol de respuestas y formulario de respuesta
│   ├── ai/
│   │   ├── page.tsx                  # Directorio de modelos IA, agentes y MCP servers
│   │   └── [slug]/page.tsx           # Ficha técnica del modelo / agente
│   ├── cybersecurity/
│   │   ├── page.tsx                  # Matriz de avisos con filtro por severidad
│   │   └── [slug]/page.tsx           # Aviso de seguridad con remediación
│   ├── tutorials/
│   │   ├── page.tsx                  # Malla de tutoriales con filtro por dificultad
│   │   └── [slug]/page.tsx           # Tutorial interactivo paso a paso (StepWizard)
│   ├── projects/
│   │   ├── page.tsx                  # Galería showcase con filtro por estado
│   │   └── [slug]/page.tsx           # Caso de estudio y arquitectura
│   └── infrastructure/
│       ├── page.tsx                  # Catálogo de infraestructura y guías de servidor
│       └── [slug]/page.tsx           # Lector técnico interactivo con visor de specs del nodo
│
└── features/                         # Features FSD
    ├── navigation/                   # CategoryNav (selector de las 8 categorías)
    ├── news/                         # NewsCard, NewsGrid, useNews, types
    ├── blog/                         # BlogCard, BlogGrid, useBlog, types
    ├── forum/                        # TopicCard, ForumSection, useForum, types
    ├── ai/                           # AiCard, AiGrid, useAi, types
    ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, types
    ├── tutorials/                    # TutorialCard, TutorialGrid, useTutorials, types
    ├── projects/                     # ProjectCard, ProjectGrid, useProjects, types
    ├── infrastructure/               # InfrastructureCard, InfrastructureGrid, useInfrastructure, types
    └── os/                           # Dock, MenuBar, SpotlightModal (Cmd+K)
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
* **Datos Estructurados Schema.org (`SoftwareJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `WebSite` con desglose de las 8 áreas tecnológicas (`hasPart`) para indexación en motores de búsqueda e IA.
* **Sincronización con IA:** Cuando se agreguen nuevos tipos de contenido, tutoriales o proyectos mayores en Software, reflejarlos en `public/software/llms.txt` y en `public/landing/llms.txt`.

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

