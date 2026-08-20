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
>   1. *Presentación:* `VersesController`, `BooksController`, `TranslationsController`, `MorphologyController`, `HistoricalController`.
>   2. *Lógica de Negocio:* `VersesService`, `BooksService`, `MorphologyService`, `HistoricalService`.
>   3. *Acceso a Datos:* Entidades `Verse`, `Book`, `Translation`, `MorphologyToken`, `LexiconEntry`, `HistoricalPlaceEntity`, `TimelineEventEntity`, `ArchaeologyArticleEntity`.

---

## 2. Módulos y Arquitectura en Capas

```text
backend/src/bible/
├── bible.module.ts            # Módulo raíz (Conexión 'bibleConnection' a bible.sqlite)
│
├── corpus/                    # FUENTES OFICIALES ESTRUCTURADAS EN JSON
│   ├── rv1960/                # Reina-Valera 1960 (*.json)
│   ├── nvi/                   # Nueva Versión Internacional (*.json)
│   ├── nbla/                  # Nueva Biblia de las Américas (*.json)
│   ├── bhs/                   # Westminster Leningrad Codex Hebreo (*.json)
│   ├── lxx/                   # Septuaginta Griega (*.json)
│   ├── morphology/            # Tokens WLC y Léxicos Strong BDB/Gesenius (*.json)
│   └── historical/            # Atlas WGS84, Cronología y Arqueología (*.json)
│       ├── atlas_locations.json
│       ├── timeline_events.json
│       └── archaeology_articles.json
│
├── cli/                       # Scripts CLI
│   ├── seed-corpus.ts         # Seeder atómico (pnpm --filter backend seed:bible)
│   └── build-full-gen1.ts     # Generador de corpus para Génesis 1 íntegro
│
├── verses/                    # Versículos y adaptador API (/bible/verses)
│   ├── services/verses.service.ts
│   └── services/api-bible.service.ts # Adaptador oficial a API.Bible (American Bible Society)
├── books/                     # Catálogo de 66 libros canónicos (/bible/books)
├── translations/              # Versiones oficiales autorizadas (/bible/translations)
│
├── morphology/                # Sub-módulo de morfología y léxicos (/bible/morphology/*)
│   ├── morphology.module.ts
│   ├── controllers/morphology.controller.ts
│   ├── services/morphology.service.ts
│   └── entities/ (MorphologyToken, LexiconEntry)
│
└── historical/                # Sub-módulo de contexto histórico (/bible/historical/*)
    ├── historical.module.ts
    ├── controllers/historical.controller.ts
    ├── services/historical.service.ts
    └── entities/ (HistoricalPlaceEntity, TimelineEventEntity, ArchaeologyArticleEntity)
```

---

## 3. Catálogo de Endpoints REST

### 3.1 Versículos (`/bible/verses`)
* **`GET /bible/verses`**: Consulta filtrada de versículos (`?bookId=GEN&translationId=1&chapter=1&limit=200`).
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

### 3.4 Morfología y Léxicos (`/bible/morphology/*`)
* **`GET /bible/morphology/passage`**: Retorna los tokens morfológicos agrupados por versículo para un pasaje completo (`?book=GEN&chapter=1`).
* **`GET /bible/morphology/tokens/search`**: Búsqueda avanzada de tokens morfológicos por lema, texto original, código Strong, código de parsing gramatical y libro (`?q=bara&strong=H1254&limit=50`).
* **`GET /bible/morphology/lexicon`**: Búsqueda léxica con soporte de filtro de lengua (`?q=logos&lang=greek&limit=50`).
* **`GET /bible/morphology/lexicon/:strong`**: Obtiene la definición académica y lema de un código Strong (ej. `H7225`, `G3056`).

### 3.5 Contexto Histórico (`/bible/historical/*`)
* **`GET /bible/historical/atlas/places`**: Catálogo de ubicaciones geográficas y yacimientos arqueológicos con coordenadas WGS84 (`?category=city&q=jerusalen`).
* **`GET /bible/historical/timeline`**: Eventos sincrónicos de monarcas, profetas, imperios e hitos fechados (`?type=monarch&from=1000&to=500`).
* **`GET /bible/historical/articles`**: Artículos de investigación arqueológica, epigrafía y manuscritos (`?category=recent_discoveries`).
* **`GET /bible/historical/articles/:slug`**: Detalle completo de un artículo de evidencia material.
