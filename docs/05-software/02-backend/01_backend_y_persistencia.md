# Software - Backend, Submódulos y Persistencia (NestJS)

Este documento detalla la arquitectura macro y micro, submódulos verticales, controladores, modelos de persistencia y catálogo de endpoints REST del módulo de Software (`backend/src/software/`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular Orquestado:** Módulo orquestador en `backend/src/software/software.module.ts` dentro del proceso único NestJS (puerto `3000`, VPS 1 GB RAM).
> * **Aislamiento de Persistencia:** Base de datos física independiente `software.sqlite` registrada con la conexión TypeORM `'softwareConnection'`.
> * **Aislamiento de Dominio:** 7 submódulos verticales con sus propios módulos, controladores, servicios y entidades.
>
> **Arquitectura Micro:**
> * **Arquitectura en 3 Capas por Submódulo:**
>   1. *Presentación:* Controladores REST (`NewsController`, `BlogController`, `ForumController`, `AiController`, `CybersecurityController`, `TutorialsController`, `ProjectsController`).
>   2. *Lógica de Negocio:* Servicios especializados con consultas indexadas (`NewsService`, `BlogService`, etc.).
>   3. *Acceso a Datos:* 9 entidades TypeORM en `better-sqlite3` (`NewsArticle`, `BlogPost`, `ForumTopic`, `ForumReply`, `AiResource`, `SecurityPost`, `Tutorial`, `TutorialStep`, `Project`).

---

## 2. Módulos del Backend (`backend/src/software/`)

```text
backend/src/software/
├── software.module.ts                 # Orquestador puro de los 7 submódulos (registra 9 entidades)
├── cli/
│   └── seed-software.ts               # Sembrado transaccional atómico CLI (8 tablas desde corpus/*.json)
│
├── corpus/                            # DATASETS JSON ESTRUCTURADOS (FUENTE DE VERDAD)
│   ├── news.json                      # Noticias iniciales de tecnología
│   ├── blog.json                      # Artículos de arquitectura y buenas prácticas
│   ├── forum.json                     # Temas y respuestas iniciales del foro
│   ├── ai.json                        # Modelos LLM, agentes y servidores MCP
│   ├── security.json                  # Avisos de ciberseguridad y guías de bastionado
│   ├── tutorials.json                 # Tutoriales con pasos y snippets de código
│   └── projects.json                  # Proyectos showcase de Jorge Doicela
│
├── news/                              # 1. NOTICIAS Y TENDENCIAS
│   ├── news.module.ts
│   ├── controllers/news.controller.ts # /software/news
│   ├── services/news.service.ts
│   ├── entities/news-article.entity.ts
│   └── dto/create-news.dto.ts
│
├── blog/                              # 2. BLOG DE ARQUITECTURA
│   ├── blog.module.ts
│   ├── controllers/blog.controller.ts # /software/blog
│   ├── services/blog.service.ts
│   ├── entities/blog-post.entity.ts
│   └── dto/create-blog-post.dto.ts
│
├── forum/                             # 3. FOROS Y DEBATES COMUNITARIOS
│   ├── forum.module.ts
│   ├── controllers/forum.controller.ts # /software/forum
│   ├── services/forum.service.ts
│   ├── entities/forum-topic.entity.ts
│   ├── entities/forum-reply.entity.ts
│   └── dto/{create-forum-topic.dto.ts, create-forum-reply.dto.ts}
│
├── ai/                                # 4. INTELIGENCIA ARTIFICIAL Y AGENTES
│   ├── ai.module.ts
│   ├── controllers/ai.controller.ts   # /software/ai
│   ├── services/ai.service.ts
│   ├── entities/ai-resource.entity.ts
│   └── dto/create-ai-resource.dto.ts
│
├── cybersecurity/                     # 5. CIBERSEGURIDAD Y BASTIONADO
│   ├── cybersecurity.module.ts
│   ├── controllers/cybersecurity.controller.ts # /software/cybersecurity
│   ├── services/cybersecurity.service.ts
│   ├── entities/security-post.entity.ts
│   └── dto/create-security-post.dto.ts
│
├── tutorials/                         # 6. TUTORIALES PRÁCTICOS
│   ├── tutorials.module.ts
│   ├── controllers/tutorials.controller.ts # /software/tutorials
│   ├── services/tutorials.service.ts
│   ├── entities/tutorial.entity.ts
│   ├── entities/tutorial-step.entity.ts
│   └── dto/{create-tutorial.dto.ts, create-tutorial-step.dto.ts}
│
└── projects/                          # 7. PROYECTOS SHOWCASE
    ├── projects.module.ts
    ├── controllers/projects.controller.ts # /software/projects
    ├── services/projects.service.ts
    ├── entities/project.entity.ts
    └── dto/{create-project.dto.ts, update-project.dto.ts}
```

---

## 3. Catálogo de Endpoints REST

| Dominio | Método y Ruta | Descripción |
|---|---|---|
| **Noticias** | `GET /software/news` | Listado filtrable por búsqueda (`search`) y etiqueta (`tag`) |
| | `GET /software/news/:idOrSlug` | Detalle de la noticia por ID o slug |
| | `POST /software/news` | Crear nuevo artículo de noticias |
| | `DELETE /software/news/:id` | Eliminar artículo de noticias por ID |
| **Blog** | `GET /software/blog` | Ensayos de arquitectura filtrables por búsqueda (`search`) y serie (`series`) |
| | `GET /software/blog/:idOrSlug` | Detalle del post con tabla de contenidos |
| | `POST /software/blog` | Publicar nuevo post editorial de blog |
| | `DELETE /software/blog/:id` | Eliminar post de blog por ID |
| **Foros** | `GET /software/forum` | Hilos de debate filtrables por categoría (`category`) y búsqueda (`search`) |
| | `GET /software/forum/:idOrSlug` | Hilo principal con respuestas anidadas |
| | `POST /software/forum` | Crear nuevo hilo de debate (`ForumTopic`) |
| | `POST /software/forum/replies` | Publicar nueva respuesta a un tema (`ForumReply`) |
| | `GET /software/forum/:id/replies` | Obtener todas las respuestas de un hilo por ID |
| **IA** | `GET /software/ai` | Catálogo de modelos, agentes y MCP servers filtrable por `type` y `search` |
| | `GET /software/ai/:idOrSlug` | Ficha técnica del recurso de IA |
| | `POST /software/ai` | Registrar nuevo recurso de IA / agente / servidor MCP |
| | `DELETE /software/ai/:id` | Eliminar recurso de IA por ID |
| **Ciberseguridad** | `GET /software/cybersecurity` | Avisos por severidad (`severity`), tipo (`postType`) y búsqueda (`search`) |
| | `GET /software/cybersecurity/:idOrSlug` | Detalle del aviso y guía de remediación |
| | `POST /software/cybersecurity` | Registrar nuevo aviso o guía de seguridad |
| | `DELETE /software/cybersecurity/:id` | Eliminar aviso de seguridad por ID |
| **Tutoriales** | `GET /software/tutorials` | Guías paso a paso filtrables por dificultad (`difficulty`) y búsqueda (`search`) |
| | `GET /software/tutorials/:idOrSlug` | Tutorial interactivo con pasos ordenados (`steps`) |
| | `POST /software/tutorials` | Crear nuevo tutorial maestro |
| | `POST /software/tutorials/steps` | Agregar paso con snippet de código a un tutorial |
| | `DELETE /software/tutorials/:id` | Eliminar tutorial por ID |
| **Proyectos** | `GET /software/projects` | Showcase filtrable por estado (`status`) y búsqueda (`search`) |
| | `GET /software/projects/:idOrSlug` | Ficha, demo, repo y arquitectura del proyecto |
| | `POST /software/projects` | Registrar nuevo proyecto showcase |
| | `PATCH /software/projects/:id` | Actualizar campos o estado de un proyecto |
| | `DELETE /software/projects/:id` | Eliminar proyecto por ID |

---

## 4. Modelo Relacional (`software.sqlite`)

* `news_articles`: `id`, `slug` (UK), `title`, `excerpt`, `contentMarkdown`, `sourceUrl`, `isBreaking`, `author`, `tags`, `coverImage`, `readTimeMinutes`, `views`, `likes`, `publishedAt`.
* `blog_posts`: `id`, `slug` (UK), `title`, `subtitle`, `excerpt`, `contentMarkdown`, `author`, `tags`, `series`, `tableOfContents`, `coverImage`, `readTimeMinutes`, `views`, `likes`.
* `forum_topics`: `id`, `slug` (UK), `title`, `content`, `author`, `category`, `isSolved`, `isPinned`, `repliesCount`, `views`.
* `forum_replies`: `id`, `topicId` (FK), `parentId`, `author`, `content`, `isAcceptedAnswer`, `likes`.
* `ai_resources`: `id`, `slug` (UK), `name`, `type`, `provider`, `description`, `contentMarkdown`, `license`, `documentationUrl`, `paperUrl`, `githubUrl`, `tags`, `views`, `likes`.
* `security_posts`: `id`, `slug` (UK), `title`, `severity`, `postType`, `cveId`, `affectedSystems`, `remediation`, `excerpt`, `contentMarkdown`, `author`, `tags`, `views`, `likes`.
* `tutorials`: `id`, `slug` (UK), `title`, `excerpt`, `description`, `difficulty`, `estimatedMinutes`, `prerequisites`, `techStack`, `author`, `tags`, `coverImage`, `views`, `likes`.
* `tutorial_steps`: `id`, `tutorialId` (FK), `stepOrder`, `title`, `contentMarkdown`, `codeSnippet`, `codeLanguage`, `imageUrl`.
* `projects`: `id`, `slug` (UK), `name`, `description`, `techStack`, `repoUrl`, `liveUrl`, `status`, `featured`, `stars`, `views`, `architectureDiagramUrl`.
