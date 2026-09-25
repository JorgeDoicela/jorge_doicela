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
> * **Motor Universal de Filtros Polimórficos:**
>   - Todos los submódulos exponen el endpoint `GET /software/[modulo]/categories?lang=es|en` devolviendo el contrato universal `{ id: string, label: string, count: number }`.
>   - Las agregaciones se ejecutan dinámicamente en `software.sqlite` sin sobrecarga de memoria, erradicando datos quemados y alimentando de forma homogénea a `CategoryFilterBar` en el frontend.


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
├── common/                            # DTOs Y UTILIDADES COMPARTIDAS DEL MÓDULO SOFTWARE
│   └── dto/software-query.dto.ts      # Clase base con paginación (limit/page), search y lang
│
├── news/                              # 1. NOTICIAS Y TENDENCIAS
│   ├── news.module.ts
│   ├── controllers/news.controller.ts # /software/news (ParseIntPipe en :id)
│   ├── services/news.service.ts
│   ├── entities/news-article.entity.ts
│   └── dto/{create-news.dto.ts, get-news-query.dto.ts}
│
├── blog/                              # 2. BLOG DE ARQUITECTURA
│   ├── blog.module.ts
│   ├── controllers/blog.controller.ts # /software/blog (ParseIntPipe en :id)
│   ├── services/blog.service.ts
│   ├── entities/blog-post.entity.ts
│   └── dto/{create-blog-post.dto.ts, get-blog-query.dto.ts}
│
├── forum/                             # 3. FOROS Y DEBATES COMUNITARIOS
│   ├── forum.module.ts
│   ├── controllers/forum.controller.ts # /software/forum (ParseIntPipe en :id/replies)
│   ├── services/forum.service.ts
│   ├── entities/forum-topic.entity.ts
│   ├── entities/forum-reply.entity.ts
│   └── dto/{create-forum-topic.dto.ts, create-forum-reply.dto.ts, get-forum-topics-query.dto.ts}
│
├── ai/                                # 4. INTELIGENCIA ARTIFICIAL Y AGENTES
│   ├── ai.module.ts
│   ├── controllers/ai.controller.ts   # /software/ai (ParseIntPipe en :id)
│   ├── services/ai.service.ts
│   ├── entities/ai-resource.entity.ts
│   └── dto/{create-ai-resource.dto.ts, get-ai-resources-query.dto.ts}
│
├── cybersecurity/                     # 5. CIBERSEGURIDAD Y BASTIONADO
│   ├── cybersecurity.module.ts
│   ├── controllers/cybersecurity.controller.ts # /software/cybersecurity (ParseIntPipe en :id)
│   ├── services/cybersecurity.service.ts
│   ├── entities/security-post.entity.ts
│   └── dto/{create-security-post.dto.ts, get-security-posts-query.dto.ts}
│
├── tutorials/                         # 6. TUTORIALES PRÁCTICOS
│   ├── tutorials.module.ts
│   ├── controllers/tutorials.controller.ts # /software/tutorials (ParseIntPipe en :id)
│   ├── services/tutorials.service.ts
│   ├── entities/tutorial.entity.ts
│   ├── entities/tutorial-step.entity.ts
│   └── dto/{create-tutorial.dto.ts, create-tutorial-step.dto.ts, get-tutorials-query.dto.ts}
│
├── projects/                          # 7. PROYECTOS SHOWCASE
│   ├── projects.module.ts
│   ├── controllers/projects.controller.ts # /software/projects (ParseIntPipe en :id)
│   ├── services/projects.service.ts
│   ├── entities/project.entity.ts
│   └── dto/{create-project.dto.ts, update-project.dto.ts, get-projects-query.dto.ts}
│
├── infrastructure/                   # 8. INFRAESTRUCTURA, SERVIDORES Y CLOUD
│   ├── infrastructure.module.ts
│   ├── controllers/infrastructure.controller.ts # /software/infrastructure (ParseIntPipe en :id y like)
│   ├── services/infrastructure.service.ts
│   ├── entities/infrastructure-post.entity.ts
│   └── dto/{create-infrastructure-post.dto.ts, get-infrastructure-query.dto.ts}
│
├── glossary/                         # 9. GLOSARIO TERMINOLÓGICO Y PEDAGÓGICO
│   ├── glossary.module.ts
│   ├── controllers/glossary.controller.ts # /software/glossary (?lang, :slug)
│   ├── services/glossary.service.ts
│   ├── entities/glossary-term.entity.ts
│   └── dto/get-glossary-query.dto.ts
│
└── hub/                              # 10. AGREGACIÓN EDITORIAL CONSOLIDADA (HUB GLOBAL)
    ├── hub.module.ts
    ├── controllers/
    │   └── hub.controller.ts         # GET /software/hub con GetHubQueryDto validado
    ├── dto/
    │   ├── hub-response.dto.ts       # HubFeedItem, HubSpotlightData, HubResponseDto
    │   └── get-hub-query.dto.ts      # Validación class-validator (?lang, ?search)
    └── services/
        └── hub.service.ts            # Consulta consolidada resiliente (SmartScore + feed cronológico + Spotlight)
```

---

## 3. Catálogo de Endpoints REST

Todos los endpoints `GET` aceptan el parámetro opcional de consulta `?lang=es|en` para entregar el contenido localizado y consultar de forma óptima los índices compuestos.

| Dominio | Método y Ruta | Parámetros Query | Descripción |
|---|---|---|---|
| **Noticias** | `GET /software/news` | `search`, `category`, `tag`, `lang` | Listado filtrable por búsqueda, categoría, etiqueta e idioma |
| | `GET /software/news/categories` | `lang` | Taxonomías y categorías dinámicas con conteo de artículos activos |
| | `GET /software/news/:idOrSlug` | `lang` | Detalle de la noticia por ID o slug con fallback de idioma |
| | `POST /software/news` | - | Crear nuevo artículo de noticias |
| | `DELETE /software/news/:id` | - | Eliminar artículo de noticias por ID |
| **Blog** | `GET /software/blog` | `search`, `category`, `tag`, `series`, `lang` | Ensayos de arquitectura filtrables por categoría, búsqueda, serie, etiqueta e idioma |
| | `GET /software/blog/categories` | `lang` | Series y categorías dinámicas del blog con conteo de artículos activos |
| | `GET /software/blog/:idOrSlug` | `lang` | Detalle del post con tabla de contenidos e idioma |
| | `POST /software/blog` | - | Publicar nuevo post editorial de blog |
| | `DELETE /software/blog/:id` | - | Eliminar post de blog por ID |
| **Foros** | `GET /software/forum` | `category`, `search`, `lang` | Hilos de debate filtrables por categoría, búsqueda e idioma |
| | `GET /software/forum/categories` | `lang` | Categorías y salas de debate activas con conteo de hilos |
| | `GET /software/forum/:idOrSlug` | `lang` | Hilo principal con respuestas anidadas |
| | `POST /software/forum` | - | Crear nuevo hilo de debate (`ForumTopic`) |
| | `POST /software/forum/replies` | - | Publicar nueva respuesta a un tema (`ForumReply`) |
| | `GET /software/forum/:id/replies` | - | Obtener todas las respuestas de un hilo por ID |
| **IA** | `GET /software/ai` | `category`, `search`, `lang` | Catálogo de modelos, agentes y MCP servers filtrable por categoría, búsqueda e idioma |
| | `GET /software/ai/categories` | `lang` | Categorías y artefactos de IA activos con conteo real |
| | `GET /software/ai/:idOrSlug` | `lang` | Ficha técnica del recurso de IA localizado |

| | `POST /software/ai` | - | Registrar nuevo recurso de IA / agente / servidor MCP |
| | `DELETE /software/ai/:id` | - | Eliminar recurso de IA por ID |
| **Ciberseguridad** | `GET /software/cybersecurity` | `severity`, `category`, `search`, `lang` | Avisos por severidad, categoría, búsqueda e idioma |
| | `GET /software/cybersecurity/categories` | `lang` | Severidades de seguridad activas en base a estándar CVSS con conteo |
| | `GET /software/cybersecurity/:idOrSlug` | `lang` | Detalle del aviso y guía de remediación localizada |
| | `POST /software/cybersecurity` | - | Registrar nuevo aviso o guía de seguridad |
| | `DELETE /software/cybersecurity/:id` | - | Eliminar aviso de seguridad por ID |
| **Tutoriales** | `GET /software/tutorials` | `category`, `difficulty`, `search`, `lang` | Guías paso a paso filtrables por categoría temática, dificultad, búsqueda e idioma |
| | `GET /software/tutorials/categories` | `lang` | Niveles y dificultades pedagógicas activas con conteo |
| | `GET /software/tutorials/:idOrSlug` | `lang` | Tutorial interactivo con pasos ordenados (`steps`) e idioma |

| | `POST /software/tutorials` | - | Crear nuevo tutorial maestro |
| | `POST /software/tutorials/steps` | - | Agregar paso con snippet de código a un tutorial |
| | `DELETE /software/tutorials/:id` | - | Eliminar tutorial por ID |
| **Proyectos** | `GET /software/projects` | `category`, `status`, `search`, `lang` | Showcase filtrable por categoría temática, estado, búsqueda e idioma |
| | `GET /software/projects/categories` | `lang` | Estados de proyectos activos con conteo |
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
| **Glosario** | `GET /software/glossary` | `category`, `lang` | Catálogo bilingüe de conceptos técnicos para popovers editoriales |
| | `GET /software/glossary/:slug` | `lang` | Definición de un término específico por slug |
| **Hub Global** | `GET /software/hub` | `search`, `lang` | Consulta consolidada única: Top destacados por SmartScore (para carrusel dinámico), feed cronológico deduplicado (excluye destacados para cero redundancia visual) y datos para Spotlight |

---

## 4. Modelo Relacional Bilingüe (`software.sqlite`)

La persistencia implementa soporte multiidioma nativo mediante la columna `language TEXT NOT NULL DEFAULT 'es'` e índices únicos compuestos `(slug, language)` para permitir registros homólogos en español e inglés sin colisión:

* `news_articles`: `id`, `slug`, `title`, `excerpt`, `contentMarkdown`, `sourceUrl`, `isBreaking`, `featured`, `orderPriority`, `author`, `tags`, `language`, `coverImage`, `views`, `likes`, `publishedAt`.  
  * **Índice Único:** `IDX_news_articles_slug_lang (slug, language)`.
* `blog_posts`: `id`, `slug`, `title`, `subtitle`, `excerpt`, `contentMarkdown`, `author`, `tags`, `language`, `series`, `tableOfContents`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`.  
  * **Índice Único:** `IDX_blog_posts_slug_lang (slug, language)`.
### 4.1 Pragmas de Conexión SQLite (`better-sqlite3`)
En `backend/src/software/software.module.ts` y en `seed-software.ts`, la base de datos `software.sqlite` está configurada con los siguientes pragmas de alto rendimiento y blindaje de memoria:
* `enableWAL: true` (`PRAGMA journal_mode = WAL;`): Permite lecturas y escrituras concurrentes sin bloqueo.
* `PRAGMA foreign_keys = ON;`: Garantiza integridad referencial y borrado en cascada relacional (`ON DELETE CASCADE`).
* `PRAGMA synchronous = NORMAL;`: Reduce el I/O en disco un 80% manteniendo durabilidad completa contra caídas en modo WAL.
* `PRAGMA busy_timeout = 5000;`: Previene errores de contención `SQLITE_BUSY` ante concurrencia.
* `PRAGMA cache_size = -20000;`: Asigna 20 MB de caché en RAM para lecturas ultra-rápidas O(1).
* `PRAGMA journal_size_limit = 67108864;`: Límite de 64 MB para el archivo `.sqlite-wal`, protegiendo el espacio en disco en el VPS de 1 GB de RAM.
* `PRAGMA temp_store = MEMORY;`: Almacena tablas y ordenamientos temporales en memoria RAM, erradicando lecturas/escrituras secundarias en disco.

### 4.2 Catálogo de Tablas, Restricciones CHECK e Índices Compuestos

Todas las tablas cuentan con índices compuestos cubrientes alineados con los filtros y ordenamientos reales de las consultas (`language`, filtros de dominio, `orderPriority DESC`, `publishedAt DESC`), eliminando el costo de ordenamiento en memoria RAM (*B-Tree Filesort*):

* `tags`: `id`, `slug` (UNIQUE), `label`. Registro canónico centralizado del vocabulario técnico controlado.
  * **Índice:** `IDX_tags_slug (slug)`.
* `content_tags`: `content_type`, `content_id`, `tag_id` (FK). Tabla de unión polimórfica para taxonomía transversal indexada.
  * **Integridad:** `FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE`.
  * **Índices:** `IDX_content_tags_tag (tag_id)`, `IDX_content_tags_content (content_type, content_id)`.
* `news_articles`: `id`, `slug`, `title`, `excerpt`, `contentMarkdown`, `sourceUrl`, `isBreaking`, `featured`, `orderPriority`, `author`, `category`, `tags`, `language`, `coverImage`, `views`, `likes`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Restricción:** `CHECK (category IN ('frameworks', 'security', 'ai', 'cloud', 'architecture', 'devops', 'standards', 'general'))`.
  * **Índices:** `IDX_news_articles_slug_lang (slug, language) UNIQUE`, `IDX_news_articles_feed (language, orderPriority DESC, publishedAt DESC)`, `IDX_news_articles_feat_feed (language, featured, orderPriority DESC, publishedAt DESC)`, `IDX_news_articles_break_feed (language, isBreaking, orderPriority DESC, publishedAt DESC)`.
* `blog_posts`: `id`, `slug`, `title`, `subtitle`, `excerpt`, `contentMarkdown`, `author`, `category`, `tags`, `language`, `series`, `tableOfContents`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Restricción:** `CHECK (category IN ('architecture', 'devops', 'ai', 'frontend', 'backend', 'career', 'opinion', 'databases'))`.
  * **Índices:** `IDX_blog_posts_slug_lang (slug, language) UNIQUE`, `IDX_blog_posts_feed (language, orderPriority DESC, publishedAt DESC)`, `IDX_blog_posts_series_feed (language, series, orderPriority DESC, publishedAt DESC)`, `IDX_blog_posts_feat_feed (language, featured, orderPriority DESC, publishedAt DESC)`.
* `forum_topics`: `id`, `slug`, `title`, `content`, `author`, `category`, `language`, `coverImage`, `isSolved`, `isPinned`, `orderPriority`, `repliesCount`, `views`, `createdAt`, `updatedAt`.  
  * **Índices:** `IDX_forum_topics_slug_lang (slug, language) UNIQUE`, `IDX_forum_topics_feed (language, isPinned DESC, orderPriority DESC, createdAt DESC)`, `IDX_forum_topics_cat_feed (language, category, isPinned DESC, orderPriority DESC, createdAt DESC)`.
* `forum_replies`: `id`, `topicId` (FK), `parentId` (FK autorreferencial), `author`, `content`, `isAcceptedAnswer`, `likes`, `createdAt`, `updatedAt`.  
  * **Integridad:** `FOREIGN KEY (topicId) REFERENCES forum_topics(id) ON DELETE CASCADE`, `FOREIGN KEY (parentId) REFERENCES forum_replies(id) ON DELETE CASCADE`.  
  * **Índices:** `IDX_forum_replies_topic (topicId)`, `IDX_forum_replies_parent (parentId)`, `IDX_forum_replies_topic_created (topicId, createdAt ASC)`.
* `ai_resources`: `id`, `slug`, `name`, `category`, `provider`, `author`, `description`, `contentMarkdown`, `license`, `documentationUrl`, `paperUrl`, `githubUrl`, `tags`, `language`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Restricción:** `CHECK (category IN ('llm', 'agent', 'framework', 'mcp_server', 'tool', 'dataset', 'platform'))`.  
  * **Índices:** `IDX_ai_resources_slug_lang (slug, language) UNIQUE`, `IDX_ai_resources_feed (language, orderPriority DESC, createdAt DESC)`, `IDX_ai_resources_cat_feed (language, category, orderPriority DESC, createdAt DESC)`, `IDX_ai_resources_feat_feed (language, featured, orderPriority DESC, createdAt DESC)`.
* `security_posts`: `id`, `slug`, `title`, `severity`, `category`, `cveId`, `affectedSystems`, `remediation`, `excerpt`, `contentMarkdown`, `author`, `tags`, `language`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Restricciones:** `CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))`, `CHECK (category IN ('advisory', 'hardening_guide', 'writeup', 'cve_analysis', 'pentest'))`.  
  * **Índices:** `IDX_security_posts_slug_lang (slug, language) UNIQUE`, `IDX_security_posts_feed (language, orderPriority DESC, publishedAt DESC)`, `IDX_security_posts_sev_feed (language, severity, orderPriority DESC, publishedAt DESC)`, `IDX_security_posts_cat_feed (language, category, orderPriority DESC, publishedAt DESC)`, `IDX_security_posts_feat_feed (language, featured, orderPriority DESC, publishedAt DESC)`.
* `tutorials`: `id`, `slug`, `title`, `excerpt`, `description`, `difficulty`, `category`, `prerequisites`, `techStack`, `author`, `tags`, `language`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Restricciones:** `CHECK (difficulty IN ('beginner', 'intermediate', 'advanced'))`, `CHECK (category IN ('web', 'backend', 'devops', 'mobile', 'ai', 'databases', 'security', 'architecture'))`.  
  * **Índices:** `IDX_tutorials_slug_lang (slug, language) UNIQUE`, `IDX_tutorials_feed (language, orderPriority DESC, publishedAt DESC)`, `IDX_tutorials_diff_feed (language, difficulty, orderPriority DESC, publishedAt DESC)`, `IDX_tutorials_feat_feed (language, featured, orderPriority DESC, publishedAt DESC)`.
* `tutorial_steps`: `id`, `tutorialId` (FK), `stepOrder`, `title`, `contentMarkdown`, `codeSnippet`, `codeLanguage`, `imageUrl`, `createdAt`, `updatedAt`.  
  * **Integridad:** `FOREIGN KEY (tutorialId) REFERENCES tutorials(id) ON DELETE CASCADE`.  
  * **Índices:** `IDX_tutorial_steps_tut (tutorialId)`, `IDX_tutorial_steps_tut_order (tutorialId, stepOrder ASC)`.
* `projects`: `id`, `slug`, `name`, `description`, `category`, `techStack`, `author`, `language`, `coverImage`, `repoUrl`, `liveUrl`, `status`, `featured`, `orderPriority`, `stars`, `views`, `architectureDiagramUrl`, `createdAt`, `updatedAt`.  
  * **Restricciones:** `CHECK (status IN ('active', 'archived', 'wip'))`, `CHECK (category IN ('web', 'backend', 'mobile', 'devops', 'tools', 'ai', 'security', 'open_source'))`.  
  * **Índices:** `IDX_projects_slug_lang (slug, language) UNIQUE`, `IDX_projects_feed (language, orderPriority DESC, stars DESC)`, `IDX_projects_status_feed (language, status, orderPriority DESC, stars DESC)`, `IDX_projects_feat_feed (language, featured, orderPriority DESC, stars DESC)`.
* `infrastructure_posts`: `id`, `slug`, `title`, `subtitle`, `category`, `environment`, `difficulty`, `techStack`, `architectureOverview`, `specs`, `contentMarkdown`, `author`, `tags`, `language`, `coverImage`, `views`, `likes`, `featured`, `orderPriority`, `publishedAt`, `createdAt`, `updatedAt`.  
  * **Restricciones:** `CHECK (category IN ('cloud', 'servers', 'containers', 'networking', 'ci_cd', 'hardening', 'zero_ram'))`, `CHECK (environment IN ('production', 'edge', 'hybrid', 'vps', 'bare_metal'))`, `CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert'))`.  
  * **Índices:** `IDX_infrastructure_posts_slug_lang (slug, language) UNIQUE`, `IDX_infrastructure_posts_feed (language, orderPriority DESC, publishedAt DESC)`, `IDX_infrastructure_posts_cat_feed (language, category, orderPriority DESC, publishedAt DESC)`, `IDX_infrastructure_posts_env_feed (language, environment, orderPriority DESC, publishedAt DESC)`, `IDX_infrastructure_posts_feat_feed (language, featured, orderPriority DESC, publishedAt DESC)`.
* `glossary_terms`: `id`, `slug`, `term`, `aliases`, `category`, `shortDefinition`, `keyDifference`, `caseSensitive`, `language`, `orderPriority`, `createdAt`, `updatedAt`.  
  * **Restricción:** `CHECK (category IN ('cloud', 'servers', 'containers', 'networking', 'ci_cd', 'hardening', 'zero_ram', 'security', 'ai', 'architecture', 'general', 'database', 'linux'))`.  
  * **Índices:** `IDX_glossary_terms_term_lang (term, language) UNIQUE`, `IDX_glossary_terms_lang_prio (language, orderPriority DESC)`.

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

## 6. Corpus JSON Bilingüe, Portadas Profesionales y Sincronización Idempotente (`seed-software.ts`)

Todos los datasets fuente en `backend/src/software/corpus/*.json` contienen registros pareados en español (`language: "es"`) e inglés (`language: "en"`). Cada publicación técnica cuenta con su portada editorial profesional (16:9, Dark Luxury / Neumorphic Glassmorphism) servida estáticamente desde `frontend/web/public/software/images/covers/<categoría>/`:

| Sección | Archivo JSON | Slug Canónico | Portada Editorial (16:9) |
|---|---|---|---|
| **Noticias** | `news.json` | `novedades-nextjs-16-react-server-components` | `/software/images/covers/news/nextjs-16.jpg` |
| **Blog** | `blog.json` | `arquitectura-limpia-monolitos-modulares-nestjs` | `/software/images/covers/blog/arquitectura-limpia-monolitos.jpg` |
| **Foro** | `forum.json` | `optimizacion-ram-vps-1gb-nodejs` | `/software/images/covers/forum/optimizacion-ram-vps.jpg` |
| **IA & MCP** | `ai.json` | `mcp-model-context-protocol-anthropic` | `/software/images/covers/ai/model-context-protocol.jpg` |
| **Ciberseguridad** | `security.json` | `guia-bastionado-ssh-seguridad-linux` | `/software/images/covers/cybersecurity/bastionado-ssh-linux.jpg` |
| **Tutoriales** | `tutorials.json` | `tutorial-terminal-ssh-virtual-websockets-react` | `/software/images/covers/tutorials/terminal-ssh-websockets.jpg` |
| **Proyectos** | `projects.json` | `software-tecnologico` | `/software/images/covers/projects/software-hub-tecnologico.jpg` |
| **Infraestructura** | `infrastructure.json` | `firewall-linux-ufw-netfilter-seguridad-servidores` | `/software/images/covers/infrastructure/guia-firewall-linux-ufw.jpg` |

### 6.1 Modo de Operación del Seeder (`seed-software.ts`)
El script `seed-software.ts` está diseñado para reconstruir y reiniciar la base de datos limpia desde cero de forma instantánea:

* **Reinicio y Sembrado Directo:**
  ```bash
  pnpm seed:software
  ```
  * Ejecuta una purga atómica de tablas anteriores (`DROP TABLE IF EXISTS`) para garantizar un estado limpio libre de esquemas desactualizados o datos residuales.
  * Reconstruye las 10 tablas relacionales con sus restricciones de integridad `CHECK`, relaciones foráneas con `ON DELETE CASCADE` e índices compuestos cubrientes.
  * Inserta todo el corpus bilingüe (`es` / `en`) desde `corpus/*.json` dentro de una transacción `better-sqlite3` en menos de **100 ms**.

* **Bilingüismo Riguroso en Diagramas Vectoriales (Mermaid):** Los diagramas embebidos en el markdown de cada publicación están traducidos de raíz según el idioma:
  * **En Español (`es`):** Actores humanos, subgraphs y estados traducidos al español profesional (`Usuario / Navegador`, `Proxy Inverso Nginx`, `Gestor de Comandos`, `Módulo`, `Modo WAL`), preservando intactos los nombres literales de código, variables, APIs, llamadas POSIX y directivas de red (`stdout`, `socket.emit()`, `child_process.spawn()`, `resolve-routes.js`, `proxy_pass`).
  * **En Inglés (`en`):** 100% en terminología técnica internacional (`Browser Client`, `Nginx Reverse Proxy`, `Command Handler`, `WAL Mode`).


