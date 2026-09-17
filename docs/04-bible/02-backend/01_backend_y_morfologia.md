# Biblia Modular - Backend, Endpoints y Morfología (NestJS)

Este documento detalla la arquitectura macro y micro, servicios, controladores, modelos morfológicos y catálogo de endpoints REST del módulo de Biblia (`backend/src/bible/`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** Módulo encapsulado en `backend/src/bible/` ejecutado en el servidor único de NestJS 11 (puerto `3000`, VPS 1 GB RAM).
> * **Aislamiento de Persistencia:** Base de datos física independiente `backend/data/bible.sqlite` registrada con la conexión TypeORM `'bibleConnection'`.
> * **Aislamiento de Dominio:** Cero dependencias de otros módulos del monorepo.
>
> **Arquitectura Micro:**
> * **Arquitectura en Capas:**
>   1. *Presentación:* `VersesController`, `BooksController`, `TranslationsController`, `MorphologyController`, `AtlasController`, `TimelineController`, `ArchaeologyController`, `EvangelismController`.
>   2. *Lógica de Negocio:* `VersesService`, `BooksService`, `MorphologyService`, `AtlasService`, `TimelineService`, `ArchaeologyService`, `EvangelismService`.
>   3. *Acceso a Datos:* Entidades `Verse`, `Book`, `Translation`, `MorphologyToken`, `LexiconEntry`, `HistoricalPlaceEntity`, `TimelineEventEntity`, `ArchaeologyArticleEntity`, `EvangelismPathwayEntity`, `EvangelismObjectionEntity`, `EvangelismTractEntity`.

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
│   ├── books.module.ts
│   ├── controllers/books.controller.ts
│   ├── dto/ (CreateBookDto, GetBooksFilterDto)
│   ├── services/books.service.ts
│   └── entities/ (Book)
├── translations/              # Versiones oficiales autorizadas (/bible/translations)
│   ├── translations.module.ts
│   ├── controllers/translations.controller.ts
│   ├── dto/ (CreateTranslationDto)
│   ├── services/translations.service.ts
│   └── entities/ (Translation)
│
├── morphology/                # Sub-módulo de morfología y léxicos (/bible/morphology/*)
│   ├── morphology.module.ts
│   ├── controllers/morphology.controller.ts
│   ├── dto/ (GetPassageTokensDto, SearchLexiconDto)
│   ├── services/morphology.service.ts # Consultas agrupadas con Brackets TypeORM
│   └── entities/ (MorphologyToken, LexiconEntry)
│
├── atlas/                     # Sub-módulo de Atlas Bíblico Vectorial y 3D (/bible/atlas/*)
│   ├── atlas.module.ts
│   ├── controllers/atlas.controller.ts # @Controller('bible/atlas') -> @Get('places')
│   ├── dto/ (GetPlacesQueryDto)
│   ├── services/atlas.service.ts
│   └── entities/ (HistoricalPlaceEntity)
│
├── timeline/                  # Sub-módulo de Cronología Sincrónica (/bible/timeline/*)
│   ├── timeline.module.ts
│   ├── controllers/timeline.controller.ts # @Controller('bible/timeline') -> @Get()
│   ├── dto/ (GetTimelineQueryDto)
│   ├── services/timeline.service.ts
│   └── entities/ (TimelineEventEntity)
│
├── archaeology/               # Sub-módulo de Arqueología y Epigrafía (/bible/archaeology/*)
│   ├── archaeology.module.ts
│   ├── controllers/archaeology.controller.ts # @Controller('bible/archaeology') -> @Get('articles')
│   ├── dto/ (GetArticlesQueryDto)
│   ├── services/archaeology.service.ts # EntityNotFoundError para 404 canónico
│   └── entities/ (ArchaeologyArticleEntity)
│
└── evangelism/                 # Sub-módulo de evangelización y apologética (/bible/evangelism/*)
    ├── evangelism.module.ts
    ├── controllers/evangelism.controller.ts # @Controller('bible/evangelism')
    ├── dto/ (GetPathwaysQueryDto, GetObjectionsQueryDto, GetTractsQueryDto)
    ├── services/evangelism.service.ts # EntityNotFoundError para 404 canónico
    └── entities/ (EvangelismPathwayEntity, EvangelismObjectionEntity, EvangelismTractEntity)
```

---

## 3. Catálogo de Endpoints REST

### 3.1 Versículos (`/bible/verses`)
* **`GET /bible/verses`**: Consulta filtrada de versículos (`?bookId=1&translationId=1&chapter=1&limit=200`).
* **`GET /bible/verses/:id`**: Detalle de un versículo por ID.
* **`POST /bible/verses`**: Inserción de un nuevo versículo (validado con `CreateVerseDto`).
* **`PATCH /bible/verses/:id`**: Actualización de un versículo (validado con `UpdateVerseDto`).
* **`DELETE /bible/verses/:id`**: Eliminación de un versículo.

### 3.2 Libros Bíblicos (`/bible/books`)
* **`GET /bible/books`**: Catálogo de los 66 libros en orden canónico ascendente (`?testament=OT` o `NT`, validado con `GetBooksFilterDto`).
* **`GET /bible/books/:id`**: Detalle de un libro por ID numérico.
* **`POST /bible/books`**: Registro de libro canónico con orden opcional (`CreateBookDto`).
* **`DELETE /bible/books/:id`**: Eliminación de un libro por ID.

### 3.3 Traducciones (`/bible/translations`)
* **`GET /bible/translations`**: Lista de versiones de la Biblia ordenadas por ID ascendente.
* **`GET /bible/translations/:id`**: Detalle de una versión.
* **`POST /bible/translations`**: Registro de versión oficial (`CreateTranslationDto`).
* **`DELETE /bible/translations/:id`**: Eliminación de una versión por ID.

### 3.4 Morfología y Léxicos (`/bible/morphology/*`)
* **`GET /bible/morphology/passage`**: Retorna los tokens morfológicos agrupados por versículo para un pasaje completo (`?book=GEN&chapter=1`).
* **`GET /bible/morphology/verse/:verseId`**: Retorna los tokens de un versículo específico ordenados por `wordOrder` ascendente.
* **`GET /bible/morphology/lexicon`**: Búsqueda léxica multilingüe con precedencia de agrupamiento seguro (`new Brackets`) (`?q=logos&lang=greek&limit=30`).
* **`GET /bible/morphology/lexicon/:strongCode`**: Obtiene la definición académica y lema de un código Strong (ej. `H7225`, `G3056`). Lanza `EntityNotFoundError` si no existe.

### 3.5 Atlas Bíblico (`/bible/atlas/*`)
* **`GET /bible/atlas/places`**: Sitios con coordenadas WGS84, nombres bilingües y notas arqueológicas (`?category=city&q=Jeru&lang=es|en`). Retorno tipado y ordenado por ID.

### 3.6 Cronología Sincrónica (`/bible/timeline`)
* **`GET /bible/timeline`**: Monarcas, profetas, imperios y eventos sincrónicos (`?type=monarch&from=-1000&to=-500&lang=es|en`).

### 3.7 Arqueología y Epigrafía (`/bible/archaeology/*`)
* **`GET /bible/archaeology/articles`**: Artículos de investigación arqueológica, epigrafía y manuscritos con índice compuesto `(slug, language)` (`?category=recent_discoveries&lang=es|en`).
* **`GET /bible/archaeology/articles/:slug`**: Detalle completo de un artículo de evidencia material localizado (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.

### 3.8 Evangelización y Apologética (`/bible/evangelism/*`)
* **`GET /bible/evangelism/pathways`**: Rutas y secuencias bíblicas bilingües (Camino de Romanos, Puente a la Vida, Cuatro Verdades) (`?lang=es|en`).
* **`GET /bible/evangelism/pathways/:slug`**: Detalle de una ruta evangelística con pasos, versículos y reflexiones (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.
* **`GET /bible/evangelism/objections`**: Banco de objeciones comunes y respuestas apologéticas exegéticas con filtro por categoría y búsqueda textual (`?category=&q=&lang=es|en`).
* **`GET /bible/evangelism/tracts`**: Tratados y bosquejos homiléticos para predicar o compartir (`?audience=&lang=es|en`).
* **`GET /bible/evangelism/tracts/:slug`**: Detalle de un tratado con bosquejo por puntos, ilustración, oración de fe y pasos de discipulado (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.



