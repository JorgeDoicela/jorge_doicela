---
name: software-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento del Software Hub (software.jorgedoicela.com), incluyendo el frontend en Next.js (estética neumórfica/satinada, artículos, foros, proyectos), backend en NestJS y la base de datos software.sqlite.
---
# Directrices de Desarrollo: Plataforma y Hub de Software (software.jorgedoicela.com)

Esta habilidad define los estándares técnicos, estructura, modelo de datos y buenas prácticas de seguridad para el **Software Hub** de Jorge Doicela.

---

## 1. Arquitectura y Aislamiento

* **Subdominio:** `software.jorgedoicela.com` (en desarrollo: `software.localhost:3001`).
* **Frontend:** Grupo de rutas `frontend/web/src/app/(software)/`.
* **Backend:** Módulo modular aislado `backend/src/software/`.
* **Persistencia:** Base de datos SQLite física independiente `software.sqlite` conectada mediante `'softwareConnection'` en TypeORM.
* **Aislamiento de Estilos:** Utiliza exclusivamente su propio archivo `(software)/globals.css` (estética avanzada con paneles satinados cóncavos/convexos y bordes esmerilados).
* **Aislamiento de Assets:** Recursos estáticos ubicados en `frontend/web/public/software/`.

---

## 2. Frontend Web (Next.js 16)

### 2.1 Estructura de Directorios (Feature-Sliced Design)
```text
frontend/web/src/app/(software)/
├── software/
│   └── page.tsx            # Página principal del Hub de Software
├── features/
│   ├── articles/           # Noticias, Blog, IA, Ciberseguridad, Tutoriales
│   │   ├── components/     # ArticleGrid.tsx, ArticleCard.tsx, ArticleDetail.tsx
│   │   ├── hooks/          # useArticles.ts
│   │   └── types.ts        # Tipado local Article
│   ├── forum/              # Foros y debates comunitarios
│   │   ├── components/     # ForumSection.tsx, ForumTopicList.tsx, ForumTopicCard.tsx
│   │   ├── hooks/          # useForum.ts
│   │   └── types.ts        # Tipado local ForumTopic
│   └── projects/           # Catálogo de proyectos de software del autor
│       ├── components/     # ProjectGrid.tsx, ProjectCard.tsx
│       ├── hooks/          # useProjects.ts
│       └── types.ts        # Tipado local Project
├── components/             # Header, CategoryNav (filtro de 7 categorías), SearchBar
├── globals.css             # Estilos independientes de Software
└── layout.tsx              # Layout independiente
```

### 2.2 Las 7 Áreas Temáticas del Hub (Slugs Válidos)
1. **Noticias (`news`):** Actualidad y tendencias del sector de software.
2. **Blog (`blog`):** Ensayos profundos sobre arquitectura y buenas prácticas.
3. **Foros (`forum`):** Espacio de discusión y preguntas técnicas.
4. **Inteligencia Artificial (`ai`):** Modelos, agentes y automatización.
5. **Ciberseguridad (`cybersecurity`):** Bastionado, avisos de seguridad y desarrollo seguro.
6. **Tutoriales (`tutorial`):** Guías prácticas paso a paso con bloques de código.
7. **Proyectos (`projects`):** Galería showcase de herramientas creadas por Jorge.

---

## 3. Backend y Modelo de Datos (NestJS 11)

### 3.1 Entidades de Persistencia (TypeORM en `software.sqlite`)

1. **`Article` (`article.entity.ts`):**
   * `id`: Clave primaria autoincremental de tipo entero.
   * `title`: Título del artículo o contenido.
   * `slug`: Cadena única para URL (`@Index({ unique: true })`).
   * `excerpt`: Resumen para tarjetas.
   * `content`: Texto completo en Markdown estructurado.
   * `category`: `'news' | 'blog' | 'ai' | 'cybersecurity' | 'tutorial'`.
   * `author`: Nombre o firma del autor.
   * `tags`: Etiquetas separadas por comas.
   * `coverImage`: URL opcional de portada.
   * `readTimeMinutes`, `views`, `likes`: Métricas numéricas.
   * `createdAt`, `updatedAt`: Marcas de tiempo automáticas.

2. **`ForumTopic` (`forum-topic.entity.ts`):**
   * `id`: Clave primaria autoincremental de tipo entero.
   * `title`: Título del tema.
   * `slug`: URL amigable única.
   * `content`: Cuerpo del mensaje o consulta técnica.
   * `author`: Alias del autor.
   * `category`: `'general' | 'ai' | 'cybersecurity' | 'dev'`.
   * `repliesCount`, `views`: Contadores numéricos.
   * `createdAt`, `updatedAt`: Marcas de tiempo.

3. **`Project` (`project.entity.ts`):**
   * `id`: Clave primaria autoincremental.
   * `name`: Nombre del proyecto.
   * `description`: Explicación técnica detallada.
   * `techStack`: Tecnologías utilizadas.
   * `repoUrl`: Enlace opcional a repositorio en GitHub.
   * `liveUrl`: Enlace opcional a demo en vivo.

### 3.2 Catálogo de Endpoints REST (`/software/*`)
* **Artículos:**
  * `GET /software/articles`: Lista con filtros query `category` y `search`.
  * `GET /software/articles/:id`: Detalle por ID o slug.
  * `POST /software/articles`: Registrar artículo (`CreateArticleDto`).
  * `PATCH /software/articles/:id`: Actualizar artículo.
  * `DELETE /software/articles/:id`: Eliminar artículo.
* **Foros:**
  * `GET /software/forum`: Lista de temas de discusión.
  * `GET /software/forum/:id`: Detalle de tema.
  * `POST /software/forum`: Crear tema de discusión (`CreateForumTopicDto`).
* **Proyectos:**
  * `GET /software/projects`: Catálogo de proyectos.
  * `GET /software/projects/:id`: Detalle de proyecto.
  * `POST /software/projects`: Registrar proyecto.
  * `PATCH /software/projects/:id`: Actualizar proyecto.
  * `DELETE /software/projects/:id`: Eliminar proyecto.

---

## 4. Renderizado Seguro de Markdown y Seguridad

* **Prevención de XSS:** Al renderizar contenido Markdown en el frontend, nunca utilices `dangerouslySetInnerHTML` directamente con texto crudo. Sanitiza siempre las etiquetas HTML o utiliza renderizadores seguros basados en componentes (o librerías ligeras validadas).
* **Editor Ligero:** En futuros paneles de administración, prioriza editores de texto plano con soporte de sintaxis Markdown frente a editores WYSIWYG masivos que sobrecargan el bundle de JavaScript.

---

## 5. 📊 Estado de Implementación (Hoja de Ruta)

| Funcionalidad | Estado | Ubicación / Notas |
|---|:---:|---|
| CRUD de Artículos, Foros y Proyectos | ✅ Completado | `backend/src/software/` |
| Conexión TypeORM con `software.sqlite` | ✅ Completado | `softwareConnection` configurada |
| Navegación por 7 categorías (`CategoryNav`) | ✅ Completado | Componente interactivo en frontend |
| Buscador unificado en tiempo real | ✅ Completado | Filtro por título, descripción y tags |
| Panel admin protegido para redactar artículos | ⏳ Pendiente | Rutas protegidas `/admin/software` |
| Editor Markdown / Rich Text embebido | ⏳ Pendiente | Editor ligero para redacción |
| Contador de interacciones / Likes en tiempo real | ⏳ Pendiente | Endpoint `POST /software/articles/:id/like` |
| Hilos de respuestas anidadas en foros | ⏳ Pendiente | Entidad `ForumReply` y componentes |

---

## 6. ❌ Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Inyectar repositorios sin `'softwareConnection'` | Conecta a la base de datos equivocada. | Usar `@InjectRepository(Article, 'softwareConnection')`. |
| Instalar librerías de editores Markdown masivos en el frontend | Sobrecarga el bundle de JavaScript en el navegador. | Preferir editores ligeros o renderizadores basados en CSS puro. |
| Mezclar tipos de artículos con entidades bíblicas o de portafolio | Rompe el aislamiento y genera acoplamiento indeseado. | Mantener las entidades dentro de `backend/src/software/entities/`. |
| Usar la base de datos `software.sqlite` para registrar contactos | Contamina la persistencia del software hub. | Los mensajes de contacto pertenecen exclusivamente a `portfolio.sqlite`. |

---

## 7. 🔗 Combinar con
* **General:** `general-jorge-doicela` (para el aislamiento, pnpm `--filter` y reglas de monorepo).
* **Infraestructura:** `infraestructura-jorge-doicela` (para el proxy Nginx en `/software` y despliegues).
