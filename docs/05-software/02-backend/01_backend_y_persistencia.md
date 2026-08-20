# Software Hub - Backend, Endpoints y Persistencia (NestJS)

Este documento detalla la arquitectura macro y micro, servicios, controladores, modelos de persistencia y catálogo de endpoints REST del módulo de Software (`backend/src/software/`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** Módulo en `backend/src/software/` dentro del proceso único NestJS (puerto `3000`, VPS 1 GB RAM).
> * **Aislamiento de Persistencia:** Base de datos física independiente `software.sqlite` registrada con la conexión TypeORM `'softwareConnection'`.
> * **Aislamiento de Dominio:** Cero dependencias de otros módulos del monorepo.
>
> **Arquitectura Micro:**
> * **Arquitectura en Capas:**
>   1. *Presentación:* `ArticlesController`, `ForumController`, `ProjectsController`.
>   2. *Lógica de Negocio:* `ArticlesService`, `ForumService`, `ProjectsService`.
>   3. *Acceso a Datos:* Entidades `Article`, `ForumTopic`, `Project` en `better-sqlite3`.

---

## 2. Módulo del Backend (`SoftwareModule`)

```text
backend/src/software/
├── software.module.ts         # Registro del módulo, conexión y entidades
├── cli/
│   └── seed-software.ts       # Sembrado transaccional atómico CLI (software.sqlite)
├── controllers/
│   ├── articles.controller.ts # /software/articles
│   ├── forum.controller.ts    # /software/forum
│   └── projects.controller.ts # /software/projects
├── services/
│   ├── articles.service.ts
│   ├── forum.service.ts
│   └── projects.service.ts
└── entities/
    ├── article.entity.ts      # Artículos, noticias, tutoriales, IA y seguridad
    ├── forum-topic.entity.ts  # Temas de discusión del foro
    └── project.entity.ts      # Proyectos showcase
```

---

## 3. Catálogo de Endpoints REST

### 3.1 Artículos y Recursos (`/software/articles`)
* **`GET /software/articles`**: Lista artículos (`?category=news&search=nest`).
* **`GET /software/articles/:id`**: Detalle de un artículo por ID numérico o slug.
* **`POST /software/articles`**: Registro de nuevo contenido (validado con `CreateArticleDto`).
* **`PATCH /software/articles/:id`**: Actualización de campos de un artículo.
* **`DELETE /software/articles/:id`**: Eliminación permanente de un artículo.

### 3.2 Foros de Comunidad (`/software/forum`)
* **`GET /software/forum`**: Lista los temas de discusión del foro.
* **`GET /software/forum/:id`**: Detalle de un tema con sus metadatos y respuestas.
* **`POST /software/forum`**: Creación de un nuevo debate comunitario.

### 3.3 Proyectos (`/software/projects`)
* **`GET /software/projects`**: Catálogo completo de proyectos desarrollados.
* **`GET /software/projects/:id`**: Detalle de un proyecto por ID.
* **`POST /software/projects`**: Agrega un proyecto al catálogo.
* **`PATCH /software/projects/:id`**: Modifica datos del proyecto.
* **`DELETE /software/projects/:id`**: Elimina un proyecto.

---

## 4. Modelo Relacional (`software.sqlite`)

* **`articles`:** `id`, `title`, `slug`, `excerpt`, `content`, `category`, `author`, `tags`, `coverImage`, `readTimeMinutes`, `views`, `likes`, `createdAt`, `updatedAt`.
* **`forum_topics`:** `id`, `title`, `slug`, `content`, `author`, `category`, `repliesCount`, `views`, `createdAt`, `updatedAt`.
* **`projects`:** `id`, `name`, `description`, `techStack`, `repoUrl`, `liveUrl`.
