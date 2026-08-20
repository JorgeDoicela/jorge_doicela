---
name: software-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento del Software Hub (software.jorgedoicela.com), incluyendo el frontend en Next.js (estética neumórfica/satinada, artículos, foros, proyectos), backend en NestJS y la base de datos software.sqlite.
---
# Directrices de Desarrollo: Plataforma y Hub de Software (software.jorgedoicela.com)

Esta habilidad define los estándares técnicos, estructura, modelo de datos y buenas prácticas de seguridad para el Software Hub de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_frontend_y_hub_tecnologico.md](../../../docs/05-software/01-frontend/01_frontend_y_hub_tecnologico.md)
* [02_backend_y_persistencia.md](../../../docs/05-software/02-backend/01_backend_y_persistencia.md)

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
│   ├── articles/           # Noticias, Blog, IA, Ciberseguridad, Tutoriales, Foros
│   │   ├── components/     # ArticleGrid.tsx, ArticleCard.tsx, CategoryNav.tsx, ForumSection.tsx
│   │   ├── hooks/          # useArticles.ts, useForum.ts
│   │   └── types.ts        # Tipado local Article, ForumTopic
│   └── projects/           # Catálogo de proyectos de software del autor
│       ├── components/     # ProjectGrid.tsx, ProjectCard.tsx
│       ├── hooks/          # useProjects.ts
│       └── types.ts        # Tipado local Project
├── globals.css             # Estilos independientes de Software
└── layout.tsx              # Layout independiente
```

### 2.2 Las 7 Áreas Temáticas del Hub
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
* **`Article` (`article.entity.ts`):** `id`, `title`, `slug`, `excerpt`, `content`, `category`, `author`, `tags`, `coverImage`, `readTimeMinutes`, `views`, `likes`.
* **`ForumTopic` (`forum-topic.entity.ts`):** `id`, `title`, `slug`, `content`, `author`, `category`, `repliesCount`, `views`.
* **`Project` (`project.entity.ts`):** `id`, `name`, `description`, `techStack`, `repoUrl`, `liveUrl`.

### 3.2 Catálogo de Endpoints REST (`/software/*`)
* **Artículos:** `GET|POST /software/articles`, `GET|PATCH|DELETE /software/articles/:id`
* **Foros:** `GET|POST /software/forum`, `GET /software/forum/:id`
* **Proyectos:** `GET|POST /software/projects`, `GET|PATCH|DELETE /software/projects/:id`

---

## 4. Comandos de Operación

```bash
# Agregar librerías al módulo
pnpm --filter backend add <paquete>
pnpm --filter web add <paquete>

# Chequeo de tipos
pnpm -r typecheck
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Inyectar repositorios sin 'softwareConnection' | Conecta a la base de datos equivocada. | Usar @InjectRepository(Article, 'softwareConnection'). |
| Mezclar tipos de artículos con entidades bíblicas o de portafolio | Rompe el aislamiento y genera acoplamiento indeseado. | Mantener las entidades dentro de backend/src/software/entities/. |
| Usar la base de datos software.sqlite para registrar contactos | Contamina la persistencia del software hub. | Los mensajes de contacto pertenecen exclusivamente a portfolio.sqlite. |

---

## 6. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para monorepo, pnpm --filter, FSD, proxy Nginx y despliegues).
