# Biblia Modular - Backend, Endpoints y Morfología (NestJS)

Este documento detalla la arquitectura macro y micro, servicios, controladores, modelos morfológicos y catálogo de endpoints REST del módulo de Biblia (`backend/src/bible/`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** Módulo encapsulado en `backend/src/bible/` ejecutado en el servidor único de NestJS 11 (puerto `3000`, VPS 1 GB RAM).
> * **Aislamiento de Persistencia:** Base de datos física independiente `bible.sqlite` registrada con la conexión TypeORM `'bibleConnection'`.
> * **Aislamiento de Dominio:** Cero dependencias de otros módulos del monorepo.
>
> **Arquitectura Micro:**
> * **Arquitectura en Capas:**
>   1. *Presentación:* `VersesController`, `BooksController`, `TranslationsController`, `MorphologyController`.
>   2. *Lógica de Negocio:* `VersesService`, `BooksService`, `MorphologyService`.
>   3. *Acceso a Datos:* Entidades `Verse`, `Book`, `Translation`, `MorphologyToken`, `LexiconEntry`.

---

## 2. Módulos y Arquitectura en Capas

```text
backend/src/bible/
├── bible.module.ts            # Módulo raíz (Conexión 'bibleConnection' a bible.sqlite)
│
├── controllers/               # Controladores REST
│   ├── verses.controller.ts   # /bible/verses
│   ├── books.controller.ts    # /bible/books
│   └── translations.controller.ts # /bible/translations
│
├── services/                  # Lógica de negocio
│   ├── verses.service.ts
│   └── books.service.ts
│
├── entities/                  # Entidades TypeORM principales
│   ├── verse.entity.ts        # Segmentación del texto bíblico
│   ├── book.entity.ts         # Catálogo canónico de 66 libros
│   └── translation.entity.ts  # Versiones (RV1960, NVI, LBLA, KJV, BHS, LXX)
│
└── morphology/                # Sub-módulo de análisis morfológico y léxicos
    ├── morphology.module.ts
    ├── controllers/
    │   └── morphology.controller.ts # /bible/morphology/*
    ├── services/
    │   └── morphology.service.ts
    └── entities/
        ├── morphology-token.entity.ts # Palabras individuales alineadas
        └── lexicon-entry.entity.ts    # Códigos Strong y definiciones
```

---

## 3. Catálogo de Endpoints REST

### 3.1 Versículos (`/bible/verses`)
* **`GET /bible/verses`**: Consulta filtrada de versículos (`?bookId=GEN&translationId=rv1960&chapter=1&limit=200`).
* **`GET /bible/verses/:id`**: Detalle de un versículo por ID.
* **`POST /bible/verses`**: Inserción de un nuevo versículo (validado con `CreateVerseDto`).
* **`PATCH /bible/verses/:id`**: Actualización de un versículo.
* **`DELETE /bible/verses/:id`**: Eliminación de un versículo.

### 3.2 Libros Bíblicos (`/bible/books`)
* **`GET /bible/books`**: Catálogo de los 66 libros ordenados (`?testament=OT` o `NT`).
* **`GET /bible/books/:id`**: Detalle de un libro por ID o abreviatura.

### 3.3 Traducciones (`/bible/translations`)
* **`GET /bible/translations`**: Lista de versiones de la Biblia registradas.
* **`GET /bible/translations/:id`**: Detalle de una versión.

### 3.4 Morfología y Códigos Strong (`/bible/morphology/*`)
* **`GET /bible/morphology/verse/:verseId`**: Retorna los tokens de palabras ordenadas en Hebreo/Griego con códigos Strong y análisis gramatical.
* **`GET /bible/morphology/lexicon/:strong`**: Obtiene la definición académica y lema de un código Strong (ej. `H7225`, `G3056`).
* **`GET /bible/morphology/lexicon`**: Búsqueda léxica por raíz o lema (`?q=logos`).
