# Biblia Modular (bible.jorgedoicela.com)

Este documento detalla la arquitectura, el funcionamiento y el modelo de datos de la Biblia Modular, accesible mediante el subdominio `bible.jorgedoicela.com`.

---

## 1. Descripción General
La Biblia Modular es un lector digital minimalista diseñado con una estética limpia inspirada en la consola de Vercel y los principios de diseño de shadcn/ui. Su objetivo es proporcionar una lectura ágil y veloz de las Sagradas Escrituras, sin distracciones y optimizada para el estudio bíblico.

---

## 2. Frontend (Next.js)

El frontend reside en el grupo de rutas `(bible)`. Mantiene un flujo de lectura vertical y controles rápidos en la parte superior.

### 2.1 Componentes e Interfaz
* **Header / Barra Superior**: Contiene un selector de traducción y un interruptor de tema claro/oscuro.
* **Selector de Libros (`BookSelector`)**: Panel estructurado para filtrar los textos según los libros del Antiguo y Nuevo Testamento.
* **Lista de Versículos (`VerseList`)**: Mapea y despliega dinámicamente los versículos correspondientes al libro y traducción seleccionados con estados de carga y manejo de errores.
* **Manejo de Estado (`useVerses`)**: Hook personalizado [useVerses.ts](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(bible)/features/verses/hooks/useVerses.ts) que sincroniza de forma reactiva las llamadas a la API según los filtros activos.

---

## 3. Backend y Modelo de Datos (NestJS)

La lógica del servidor se agrupa dentro del directorio [backend/src/bible/](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible). Se conecta de manera exclusiva a la base de datos `bible.sqlite` utilizando la conexión de TypeORM denominada `'bibleConnection'`.

### 3.1 Entidades (Persistencia)

#### **Traducción (`Translation`)**
Representa las diferentes versiones de la Biblia (por ejemplo, Reina Valera 1960, Nueva Versión Internacional).
* `id`: Identificador único (ej: `'rv1960'`, `'nvi'`).
* `name`: Nombre descriptivo completo de la traducción.
* `language`: Idioma de la traducción (por defecto `'es'`).
* `verses`: Relación uno a muchos (`OneToMany`) hacia `Verse`.

#### **Libro (`Book`)**
Representa los 66 libros del canon bíblico.
* `id`: Abreviatura del libro que sirve como clave primaria (ej: `'gen'`, `'exo'`).
* `name`: Nombre del libro (ej: "Génesis", "Éxodo").
* `testament`: Clasificación del libro (`'OT'` para Antiguo Testamento, `'NT'` para Nuevo Testamento).
* `verses`: Relación uno a muchos (`OneToMany`) hacia `Verse`.

#### **Versículo (`Verse`)**
Representa el texto bíblico segmentado.
* `id`: Identificador entero autoincremental.
* `book`: Relación muchos a uno (`ManyToOne`) con `Book` (carga eagerly y borrado en cascada).
* `translation`: Relación muchos a uno (`ManyToOne`) con `Translation` (carga eagerly y borrado en cascada).
* `chapter`: Número de capítulo.
* `verseNumber`: Número de versículo.
* `text`: El cuerpo o contenido textual del versículo.
* **Indexación**: Cuenta con un índice compuesto único sobre `[translation, book, chapter, verseNumber]` para evitar duplicidad de datos en la base de datos.

---

## 4. Endpoints del Backend

Todas las rutas de la API de la Biblia están estructuradas de forma REST bajo `/bible/*`:

### 4.1 Versículos (`/bible/verses`)
* `GET /bible/verses`: Lista los versículos. Soporta filtros mediante parámetros de consulta (query params) como `bookId` y `translationId`.
* `GET /bible/verses/:id`: Detalle de un versículo individual.
* `POST /bible/verses`: Crea un nuevo versículo (validado con `CreateVerseDto`).
* `PATCH /bible/verses/:id`: Actualiza campos del versículo.
* `DELETE /bible/verses/:id`: Remueve un versículo físico.

### 4.2 Libros (`/bible/books`)
* `GET /bible/books`: Obtiene el catálogo completo de libros bíblicos ordenados.
* `GET /bible/books/:id`: Detalle de un libro.
* `POST /bible/books`: Registra un nuevo libro.
* `DELETE /bible/books/:id`: Elimina un libro de la base de datos.

### 4.3 Traducciones (`/bible/translations`)
* `GET /bible/translations`: Lista las versiones bíblicas habilitadas en el sistema.
* `GET /bible/translations/:id`: Detalle de una traducción.
* `POST /bible/translations`: Agrega una traducción.
* `DELETE /bible/translations/:id`: Elimina una traducción del catálogo.
