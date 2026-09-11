# Software - Backend, Submódulos y Persistencia (NestJS)

Este documento detalla la arquitectura macro y micro, submódulos verticales, controladores, modelos de persistencia y catálogo de endpoints REST del módulo de Software (`backend/src/software/`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular Orquestado:** Módulo orquestador en `backend/src/software/software.module.ts` dentro del proceso único NestJS (puerto `3000`, VPS 1 GB RAM).
> * **Aislamiento de Persistencia:** Base de datos física independiente `backend/data/software.sqlite` registrada con la conexión TypeORM `'softwareConnection'`.
> * **Aislamiento de Dominio:** 8 submódulos verticales con sus propios módulos, controladores, servicios y entidades.
>
> **Arquitectura Micro:**
> * **Arquitectura en 3 Capas por Submódulo:**
>   1. *Presentación:* Controladores REST (`NewsController`, `BlogController`, `ForumController`, `AiController`, `CybersecurityController`, `TutorialsController`, `ProjectsController`, `InfrastructureController`).
>   2. *Lógica de Negocio:* Servicios especializados con consultas indexadas (`NewsService`, `BlogService`, `InfrastructureService`, etc.).
>   3. *Acceso a Datos:* 10 entidades TypeORM en `better-sqlite3` (`NewsArticle`, `BlogPost`, `ForumTopic`, `ForumReply`, `AiResource`, `SecurityPost`, `Tutorial`, `TutorialStep`, `Project`, `InfrastructurePost`).

---

## 2. Módulos del Backend (`backend/src/software/`)

```text
backend/src/software/
├── software.module.ts                 # Orquestador puro de los 8 submódulos (registra 10 entidades)
├── cli/
│   └── seed-software.ts               # Sembrado transaccional atómico CLI (9 tablas desde corpus/*.json)
│
├── corpus/                            # DATASETS JSON ESTRUCTURADOS (FUENTE DE VERDAD)
│   ├── news.json                      # Noticias iniciales de tecnología
│   ├── blog.json                      # Artículos de arquitectura y buenas prácticas
│   ├── forum.json                     # Temas y respuestas iniciales del foro
│   ├── ai.json                        # Modelos LLM, agentes y servidores MCP
│   ├── security.json                  # Avisos de ciberseguridad y guías de bastionado
│   ├── tutorials.json                 # Tutoriales con pasos y snippets de código
│   ├── projects.json                  # Proyectos showcase de Jorge Doicela
│   └── infrastructure.json            # Guías de infraestructura, servidores y cloud
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
├── projects/                          # 7. PROYECTOS SHOWCASE
│   ├── projects.module.ts
│   ├── controllers/projects.controller.ts # /software/projects
│   ├── services/projects.service.ts
│   ├── entities/project.entity.ts
│   └── dto/{create-project.dto.ts, update-project.dto.ts}
│
│
├── infrastructure/                   # 8. INFRAESTRUCTURA, SERVIDORES Y CLOUD
│   ├── infrastructure.module.ts
│   ├── controllers/infrastructure.controller.ts # /software/infrastructure
│   ├── services/infrastructure.service.ts
│   ├── entities/infrastructure-post.entity.ts
│   └── dto/{create-infrastructure-post.dto.ts}
│
└── hub/                              # 9. AGREGACIÓN EDITORIAL CONSOLIDADA (HUB GLOBAL)
    ├── hub.module.ts
    ├── hub.controller.ts             # /software/hub
    └── hub.service.ts                # Consulta consolidada de alto rendimiento (Top 3 por SmartScore + feed cronológico)
```

---

## 3. Catálogo de Endpoints REST

Todos los endpoints `GET` aceptan el parámetro opcional de consulta `?lang=es|en` para entregar el contenido localizado y consultar de forma óptima los índices compuestos.

| Dominio | Método y Ruta | Parámetros Query | Descripción |
|---|---|---|---|
| **Noticias** | `GET /software/news` | `search`, `tag`, `lang` | Listado filtrable por búsqueda, etiqueta e idioma |
| | `GET /software/news/:idOrSlug` | `lang` | Detalle de la noticia por ID o slug con fallback de idioma |
| | `POST /software/news` | - | Crear nuevo artículo de noticias |
| | `DELETE /software/news/:id` | - | Eliminar artículo de noticias por ID |
| **Blog** | `GET /software/blog` | `search`, `series`, `lang` | Ensayos de arquitectura filtrables por búsqueda, serie e idioma |
| | `GET /software/blog/:idOrSlug` | `lang` | Detalle del post con tabla de contenidos e idioma |
| | `POST /software/blog` | - | Publicar nuevo post editorial de blog |
| | `DELETE /software/blog/:id` | - | Eliminar post de blog por ID |
| **Foros** | `GET /software/forum` | `category`, `search`, `lang` | Hilos de debate filtrables por categoría, búsqueda e idioma |
| | `GET /software/forum/:idOrSlug` | `lang` | Hilo principal con respuestas anidadas |
| | `POST /software/forum` | - | Crear nuevo hilo de debate (`ForumTopic`) |
| | `POST /software/forum/replies` | - | Publicar nueva respuesta a un tema (`ForumReply`) |
| | `GET /software/forum/:id/replies` | - | Obtener todas las respuestas de un hilo por ID |
| **IA** | `GET /software/ai` | `type`, `search`, `lang` | Catálogo de modelos, agentes y MCP servers filtrable por tipo, búsqueda e idioma |
| | `GET /software/ai/:idOrSlug` | `lang` | Ficha técnica del recurso de IA localizado |
| | `POST /software/ai` | - | Registrar nuevo recurso de IA / agente / servidor MCP |
| | `DELETE /software/ai/:id` | - | Eliminar recurso de IA por ID |
| **Ciberseguridad** | `GET /software/cybersecurity` | `severity`, `postType`, `search`, `lang` | Avisos por severidad, tipo, búsqueda e idioma |
| | `GET /software/cybersecurity/:idOrSlug` | `lang` | Detalle del aviso y guía de remediación localizada |
| | `POST /software/cybersecurity` | - | Registrar nuevo aviso o guía de seguridad |
| | `DELETE /software/cybersecurity/:id` | - | Eliminar aviso de seguridad por ID |
| **Tutoriales** | `GET /software/tutorials` | `difficulty`, `search`, `lang` | Guías paso a paso filtrables por dificultad, búsqueda e idioma |
| | `GET /software/tutorials/:idOrSlug` | `lang` | Tutorial interactivo con pasos ordenados (`steps`) e idioma |
| | `POST /software/tutorials` | - | Crear nuevo tutorial maestro |
| | `POST /software/tutorials/steps` | - | Agregar paso con snippet de código a un tutorial |
| | `DELETE /software/tutorials/:id` | - | Eliminar tutorial por ID |
| **Proyectos** | `GET /software/projects` | `status`, `search`, `lang` | Showcase filtrable por estado, búsqueda e idioma |
| | `GET /software/projects/:idOrSlug` | `lang` | Ficha, demo, repo y arquitectura del proyecto localizada |
| | `POST /software/projects` | - | Registrar nuevo proyecto showcase |
| | `PATCH /software/projects/:id` | - | Actualizar campos o estado de un proyecto |
| | `DELETE /software/projects/:id` | - | Eliminar proyecto por ID |
| **Infraestructura** | `GET /software/infrastructure` | `category`, `environment`, `difficulty`, `search`, `lang` | Guías de servidores y cloud filtrables |
| | `GET /software/infrastructure/categories` | `lang` | Categorías disponibles con conteo de guías |
| | `GET /software/infrastructure/:idOrSlug` | `lang` | Detalle de guía técnica con specs e incremento de vistas |
| | `GET /software/infrastructure/:idOrSlug` | `lang` | Guía técnica interactiva con lector de código |
| | `POST /software/infrastructure` | - | Crear nueva publicación de infraestructura |
| | `DELETE /software/infrastructure/:id` | - | Eliminar publicación de infraestructura por ID |
| **Hub Global** | `GET /software/hub` | `search`, `lang` | Consulta consolidada única: Top 3 destacados globales por SmartScore, feed cronológico polimórfico unificado y datos para Spotlight |

---

## 4. Modelo Relacional Bilingüe (`software.sqlite`)

La persistencia implementa soporte multiidioma nativo mediante la columna `language TEXT NOT NULL DEFAULT 'es'` e índices únicos compuestos `(slug, language)` para permitir registros homólogos en español e inglés sin colisión:

* `news_articles`: `id`, `slug`, `title`, `excerpt`, `contentMarkdown`, `sourceUrl`, `isBreaking`, `featured`, `orderPriority`, `author`, `tags`, `language`, `coverImage`, `readTimeMinutes`, `views`, `likes`, `publishedAt`.  
  * **Índice Único:** `IDX_news_articles_slug_lang (slug, language)`.
* `blog_posts`: `id`, `slug`, `title`, `subtitle`, `excerpt`, `contentMarkdown`, `author`, `tags`, `language`, `series`, `tableOfContents`, `coverImage`, `readTimeMinutes`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`.  
  * **Índice Único:** `IDX_blog_posts_slug_lang (slug, language)`.
* `forum_topics`: `id`, `slug`, `title`, `content`, `author`, `category`, `language`, `isSolved`, `isPinned`, `orderPriority`, `repliesCount`, `views`.  
  * **Índice Único:** `IDX_forum_topics_slug_lang (slug, language)`.
* `forum_replies`: `id`, `topicId` (FK), `parentId`, `author`, `content`, `isAcceptedAnswer`, `likes`.
* `ai_resources`: `id`, `slug`, `name`, `type`, `provider`, `description`, `contentMarkdown`, `license`, `documentationUrl`, `paperUrl`, `githubUrl`, `tags`, `language`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`.  
  * **Índice Único:** `IDX_ai_resources_slug_lang (slug, language)`.
* `security_posts`: `id`, `slug`, `title`, `severity`, `postType`, `cveId`, `affectedSystems`, `remediation`, `excerpt`, `contentMarkdown`, `author`, `tags`, `language`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`.  
  * **Índice Único:** `IDX_security_posts_slug_lang (slug, language)`.
* `tutorials`: `id`, `slug`, `title`, `excerpt`, `description`, `difficulty`, `estimatedMinutes`, `prerequisites`, `techStack`, `author`, `tags`, `language`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`.  
  * **Índice Único:** `IDX_tutorials_slug_lang (slug, language)`.
* `tutorial_steps`: `id`, `tutorialId` (FK), `stepOrder`, `title`, `contentMarkdown`, `codeSnippet`, `codeLanguage`, `imageUrl`.
* `projects`: `id`, `slug`, `name`, `description`, `techStack`, `language`, `repoUrl`, `liveUrl`, `status`, `featured`, `orderPriority`, `stars`, `views`, `architectureDiagramUrl`.  
  * **Índice Único:** `IDX_projects_slug_lang (slug, language)`.
* `infrastructure_posts`: `id`, `slug`, `title`, `subtitle`, `category`, `environment`, `difficulty`, `techStack`, `architectureOverview`, `specs`, `contentMarkdown`, `author`, `tags`, `language`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Índice Único:** `IDX_infrastructure_posts_slug_lang (slug, language)`.
  * **Índices Secundarios:** `IDX_infrastructure_posts_cat (category)`, `IDX_infrastructure_posts_env (environment)`, `IDX_infrastructure_posts_feat (featured)`, `IDX_infrastructure_posts_prio (orderPriority)`.

---

## 5. Algoritmo de Inteligencia Editorial Global (SmartScore)

Todos los servicios del backend calculan dinámicamente un `smart_score` compuesto en sus consultas `findAll` para ordenar los contenidos con criterio enterprise:

$$\text{SmartScore} = (\text{featured} \times 1000) + \text{DomainWeight} + (\text{orderPriority} \times 20) + (\text{engagement}) + \text{RecencyTiebreaker}$$

* **Noticias (`NewsService`):** `(news.featured * 1000) + (news.isBreaking * 500) + (news.orderPriority * 20) + (news.likes * 4) + (news.views * 1.5)`
* **Ensayos de Arquitectura (`BlogService`):** `(blog.featured * 1000) + (blog.orderPriority * 20) + (blog.likes * 4) + (blog.views * 1.5)`
* **Ciberseguridad (`CybersecurityService`):** `(sec.featured * 1000) + (CASE sec.severity WHEN 'CRITICAL' THEN 300 WHEN 'HIGH' THEN 150 WHEN 'MEDIUM' THEN 50 ELSE 0 END) + (sec.orderPriority * 20) + (sec.likes * 4) + (sec.views * 1.5)`
* **Tutoriales (`TutorialsService`):** `(tut.featured * 1000) + (tut.orderPriority * 20) + (tut.likes * 4) + (tut.views * 1.5)`
* **Modelos IA & MCP (`AiService`):** `(ai.featured * 1000) + (ai.orderPriority * 20) + (ai.likes * 4) + (ai.views * 1.5)`
* **Proyectos Showcase (`ProjectsService`):** `(proj.featured * 1000) + (proj.orderPriority * 20) + (proj.stars * 10) + (proj.views * 1.5)`
* **Foros Comunitarios (`ForumService`):** `(forum.isPinned * 1000) + (forum.orderPriority * 20) + (forum.repliesCount * 15) + (forum.views * 1.5)`
* **Infraestructura (`InfrastructureService`):** `(infra.featured * 1000) + (infra.orderPriority * 20) + (infra.likes * 4) + (infra.views * 1.5)`

---

## 6. Corpus JSON Bilingüe y Sembrador Atómico (`seed-software.ts`)

Todos los datasets fuente en `backend/src/software/corpus/*.json` contienen registros pareados en español (`language: "es"`) e inglés (`language: "en"`).

* **Comando de Sembrado:**
  ```bash
  pnpm --filter backend seed:software
  ```
* **Garantía Transaccional:** Ejecutado dentro de `db.transaction()` en modo `WAL` sobre `better-sqlite3`, garantizando reconstrucción limpia e indexación sin pérdida de datos ni lecturas sucias.

