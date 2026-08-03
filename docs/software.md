# Plataforma y Hub de Software (software.jorgedoicela.com)

Este documento detalla la arquitectura, el funcionamiento y el modelo de datos del **Software Hub**, accesible mediante el subdominio `software.jorgedoicela.com`.

---

## 1. Descripción General
La aplicación de Software es una plataforma y hub integral de contenidos sobre tecnología, informática y desarrollo de software creado por Jorge Doicela. Está diseñada con una interfaz avanzada de alta fidelidad estética (utilizando bordes esmerilados y paneles satinados cóncavos/convexos en modo claro y oscuro) para ofrecer información estructurada en 7 áreas clave:

1. **Noticias**: Novedades y tendencias del sector del software y tecnología.
2. **Blog**: Artículos de opinión, reflexiones y análisis técnico extenso.
3. **Foros**: Discusiones de comunidad y preguntas/respuestas sobre desarrollo.
4. **Inteligencia Artificial**: Herramientas, modelos, agentes y avances de IA.
5. **Ciberseguridad**: Avisos de vulnerabilidades, guías de bastionado y buenas prácticas de seguridad.
6. **Tutoriales y Guías**: Manuales paso a paso de programación y arquitectura.
7. **Proyectos**: Galería de herramientas y sistemas desarrollados por Jorge.

---

## 2. Frontend (Next.js)

El frontend está desarrollado bajo el grupo de rutas `(software)`.

### 2.1 Secciones e Interfaz
* **Header Satinado Convexo**: Encabezado principal que introduce el Software Hub, integrando un conmutador de tema claro/oscuro y un chip de titanio grabado de forma cóncava que resalta el carácter modular de la aplicación.
* **Barra de Navegación por Categorías (`CategoryNav`)**: Menú interactivo neumórfico que permite filtrar dinámicamente el contenido entre *Todas, Noticias, Blog, Foros, IA, Ciberseguridad, Tutoriales y Proyectos*.
* **Buscador Unificado**: Campo de búsqueda en tiempo real que filtra artículos, temas de foros y proyectos por título, descripción o etiquetas.
* **Malla de Artículos y Recursos (`ArticleGrid` / `ArticleCard`)**: Renderizado dinámico de tarjetas de contenidos con insignias de categoría, tiempo estimado de lectura, etiquetas y enlaces de lectura.
* **Sección de Foros (`ForumSection`)**: Módulo de discusión comunitario para debates sobre desarrollo e ingeniería de software.
* **Malla de Proyectos (`ProjectGrid`)**: Renderizado de proyectos de software del autor integrados dentro del hub.
* **Manejo de Datos (`useArticles`, `useProjects`)**: Hooks personalizados que gestionan las llamadas asíncronas hacia el backend, el almacenamiento de la respuesta y el control de errores o pantallas de carga.

---

## 3. Backend y Modelo de Datos (NestJS)

La lógica del servidor reside en el directorio [backend/src/software/](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/software). Opera conectado a la base de datos local `software.sqlite` de forma desacoplada utilizando la conexión de TypeORM denominada `'softwareConnection'`.

### 3.1 Entidades (Persistencia)

#### **Entidad `Article`**
Almacena noticias, artículos de blog, tutoriales, contenido de IA y ciberseguridad:
* `id`: Clave primaria autoincremental de tipo entero.
* `title`: Título del artículo o noticia.
* `slug`: Cadena única amigable para URLs.
* `excerpt`: Resumen breve para mostrar en tarjetas.
* `content`: Contenido completo en texto/Markdown.
* `category`: Categoría temática (`'news'`, `'blog'`, `'ai'`, `'cybersecurity'`, `'tutorial'`).
* `author`: Nombre o firma del autor del artículo.
* `tags`: Lista de etiquetas conceptuales separadas por comas.
* `coverImage`: URL opcional de la imagen de portada.
* `readTimeMinutes`: Tiempo estimado de lectura en minutos.
* `views`: Contador de visualizaciones.
* `likes`: Contador de interacciones positivas.
* `createdAt` / `updatedAt`: Marcas de tiempo de creación y modificación.

#### **Entidad `ForumTopic`**
Almacena temas de discusión comunitarios:
* `id`: Clave primaria autoincremental.
* `title`: Título de la consulta o debate.
* `slug`: Cadena única amigable para URLs.
* `content`: Cuerpo de la discusión.
* `author`: Nombre o alias del usuario que inicia el tema.
* `category`: Categoría del foro (`'general'`, `'ai'`, `'cybersecurity'`, `'dev'`).
* `repliesCount`: Contador de respuestas acumuladas.
* `views`: Contador de lecturas.
* `createdAt` / `updatedAt`: Marcas de tiempo.

#### **Entidad `Project`**
Define la estructura de almacenamiento de proyectos desarrollados en la galería:
* `id`: Clave primaria autoincremental de tipo entero.
* `name`: Nombre descriptivo del proyecto de software.
* `description`: Texto extenso con la descripción técnica.
* `techStack`: Cadena de texto que lista las tecnologías clave.
* `repoUrl`: Dirección URL opcional del repositorio en GitHub.
* `liveUrl`: Dirección URL opcional de la demo desplegada.

---

## 4. Endpoints del Backend

Las llamadas REST están expuestas bajo el prefijo `/software/*`:

### 4.1 Artículos y Contenidos (`/software/articles`)
* `GET /software/articles`: Retorna la lista de artículos. Admite query params `category` (para filtrar por categoría) y `search` (búsqueda por término).
* `GET /software/articles/:id`: Retorna la información detallada de un artículo por ID o slug.
* `POST /software/articles`: Crea un nuevo artículo o tutorial (validado mediante DTO).
* `PATCH /software/articles/:id`: Actualiza campos específicos de un artículo.
* `DELETE /software/articles/:id`: Elimina permanentemente un artículo de la base de datos.

### 4.2 Foros (`/software/forum`)
* `GET /software/forum`: Lista todos los temas de discusión en los foros.
* `GET /software/forum/:id`: Obtiene el detalle de un tema de discusión.
* `POST /software/forum`: Crea un nuevo tema en los foros.

### 4.3 Proyectos (`/software/projects`)
* `GET /software/projects`: Retorna la lista completa de proyectos del catálogo.
* `GET /software/projects/:id`: Retorna la información de un único proyecto según su ID.
* `POST /software/projects`: Agrega un nuevo proyecto de software al catálogo.
* `PATCH /software/projects/:id`: Permite actualizar campos específicos de un proyecto.
* `DELETE /software/projects/:id`: Elimina permanentemente un proyecto de la base de datos.
