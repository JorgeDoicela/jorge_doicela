# KARTEX - Backend, Endpoints y Morfología (NestJS)

Este documento detalla la arquitectura macro y micro, servicios, controladores, modelos morfológicos y catálogo de endpoints REST del módulo KARTEX (`backend/src/kartex/`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** Módulo encapsulado en `backend/src/kartex/` ejecutado en el servidor único de NestJS 11 (puerto `3000`, VPS 1 GB RAM).
> * **Aislamiento de Persistencia:** Base de datos física independiente `backend/data/kartex.sqlite` registrada con la conexión TypeORM `'kartexConnection'`.
> * **Aislamiento de Dominio:** Cero dependencias de otros módulos del monorepo.
>
> **Arquitectura Micro:**
> * **Arquitectura en Capas:**
>   1. *Presentación:* `VersesController`, `BooksController`, `TranslationsController`, `MorphologyController`, `CommentariesController`, `AtlasController`, `TimelineController`, `ArchaeologyController`, `EvangelismController`.
>   2. *Lógica de Negocio:* `VersesService`, `BooksService`, `MorphologyService`, `CommentariesService`, `AtlasService`, `TimelineService`, `ArchaeologyService`, `EvangelismService`.
>   3. *Acceso a Datos:* Entidades `Verse`, `Book`, `Translation`, `MorphologyToken`, `LexiconEntry`, `CommentaryAuthorEntity`, `CommentaryEntryEntity`, `HistoricalPlaceEntity`, `TimelineEventEntity`, `ArchaeologyArticleEntity`, `EvangelismPathwayEntity`, `EvangelismObjectionEntity`, `EvangelismTractEntity`.

---

## 2. Módulos y Arquitectura en Capas

```text
backend/src/kartex/
├── kartex.module.ts           # Módulo raíz (Conexión 'kartexConnection' a kartex.sqlite)
│
├── corpus/                    # FUENTES OFICIALES ESTRUCTURADAS EN JSON
│   ├── rv1960/                # Reina-Valera 1960 (*.json)
│   ├── nvi/                   # Nueva Versión Internacional (*.json)
│   ├── nbla/                  # Nueva Biblia de las Américas (*.json)
│   ├── bhs/                   # Westminster Leningrad Codex Hebreo (*.json)
│   ├── lxx/                   # Septuaginta Griega (*.json)
│   ├── morphology/            # Tokens WLC y Léxicos Strong BDB/Gesenius (*.json)
│   ├── commentaries/          # Obras clásicas y notas exegéticas bilingües (*.json)
│   │   ├── commentary_authors.json
│   │   └── commentary_entries.json
│   └── historical/            # Atlas WGS84, Cronología y Arqueología (*.json)
│       ├── atlas_locations.json
│       ├── timeline_events.json
│       └── archaeology_articles.json
│
├── cli/                       # Scripts CLI
│   ├── seed-corpus.ts         # Seeder atómico (pnpm --filter backend seed:kartex)
│   └── build-full-gen1.ts     # Generador de corpus para Génesis 1 íntegro
│
├── verses/                    # Versículos y adaptador API (/kartex/verses)
│   ├── services/verses.service.ts
│   └── services/api-bible.service.ts # Adaptador oficial a API.Bible (American Bible Society)
    ├── books/                     # Catálogo de 66 libros canónicos (/kartex/books)
│   ├── books.module.ts
│   ├── controllers/books.controller.ts
│   ├── dto/ (CreateBookDto, GetBooksFilterDto)
│   ├── services/books.service.ts
│   └── entities/ (Book)
├── translations/              # Versiones oficiales autorizadas (/kartex/translations)
│   ├── translations.module.ts
│   ├── controllers/translations.controller.ts
│   ├── dto/ (CreateTranslationDto)
│   ├── services/translations.service.ts
│   └── entities/ (Translation)
│
├── morphology/                # Sub-módulo de morfología y léxicos (/kartex/morphology/*)
│   ├── morphology.module.ts
│   ├── controllers/morphology.controller.ts
│   ├── dto/ (GetPassageTokensDto, SearchLexiconDto)
│   ├── services/morphology.service.ts # Consultas agrupadas con Brackets TypeORM
│   └── entities/ (MorphologyToken, LexiconEntry)
│
├── atlas/                     # Sub-módulo de Atlas Bíblico Vectorial y 3D (/kartex/atlas/*)
│   ├── atlas.module.ts
│   ├── controllers/atlas.controller.ts # @Controller('kartex/atlas') -> @Get('places')
│   ├── dto/ (GetPlacesQueryDto)
│   ├── services/atlas.service.ts
│   └── entities/ (HistoricalPlaceEntity)
│
├── timeline/                  # Sub-módulo de Cronología Sincrónica (/kartex/timeline/*)
│   ├── timeline.module.ts
│   ├── controllers/timeline.controller.ts # @Controller('kartex/timeline') -> @Get()
│   ├── dto/ (GetTimelineQueryDto)
│   ├── services/timeline.service.ts
│   └── entities/ (TimelineEventEntity)
│
├── archaeology/               # Sub-módulo de Arqueología y Epigrafía (/kartex/archaeology/*)
│   ├── archaeology.module.ts
│   ├── controllers/archaeology.controller.ts # @Controller('kartex/archaeology') -> @Get('articles')
│   ├── dto/ (GetArticlesQueryDto)
│   ├── services/archaeology.service.ts # EntityNotFoundError para 404 canónico
│   └── entities/ (ArchaeologyArticleEntity)
│
└── evangelism/                 # Sub-módulo de evangelización y apologética (/kartex/evangelism/*)
    ├── evangelism.module.ts
    ├── controllers/evangelism.controller.ts # @Controller('kartex/evangelism')
    ├── dto/ (GetPathwaysQueryDto, GetObjectionsQueryDto, GetTractsQueryDto)
    ├── services/evangelism.service.ts # EntityNotFoundError para 404 canónico
    └── entities/ (EvangelismPathwayEntity, EvangelismObjectionEntity, EvangelismTractEntity)
├── commentaries/                  # Corpus de comentarios bíblicos clásicos (/kartex/commentaries)
│   ├── commentaries.module.ts
│   ├── controllers/commentaries.controller.ts # @Controller('kartex/commentaries')
│   ├── dto/ (GetCommentariesQueryDto)
│   ├── services/commentaries.service.ts # Filtrado por pasaje, obra e idioma
│   └── entities/ (CommentaryAuthorEntity, CommentaryEntryEntity)
│
└── dictionaries/                  # Diccionarios bíblicos clásicos y enciclopedia A-Z (/kartex/dictionaries)
    ├── dictionaries.module.ts
    ├── controllers/dictionaries.controller.ts # @Controller('kartex/dictionaries')
    ├── dto/ (GetDictionariesQueryDto, SearchDictionaryEntriesDto)
    ├── services/dictionaries.service.ts # Búsqueda A-Z, letra, normalización y agregación
    └── entities/ (BibleDictionaryEntity, BibleDictionaryEntryEntity)
```

---

## 3. Catálogo de Endpoints REST

### 3.1 Versículos (`/kartex/verses`)
* **`GET /kartex/verses`**: Consulta filtrada de versículos (`?bookId=1&translationId=1&chapter=1&limit=200`).
* **`GET /kartex/verses/:id`**: Detalle de un versículo por ID.
* **`POST /kartex/verses`**: Inserción de un nuevo versículo (validado con `CreateVerseDto`).
* **`PATCH /kartex/verses/:id`**: Actualización de un versículo (validado con `UpdateVerseDto`).
* **`DELETE /kartex/verses/:id`**: Eliminación de un versículo.

### 3.2 Libros Bíblicos (`/kartex/books`)
* **`GET /kartex/books`**: Catálogo de los 66 libros en orden canónico ascendente (`?testament=OT` o `NT`, validado con `GetBooksFilterDto`).
* **`GET /kartex/books/:id`**: Detalle de un libro por ID numérico.
* **`POST /kartex/books`**: Registro de libro canónico con orden opcional (`CreateBookDto`).
* **`DELETE /kartex/books/:id`**: Eliminación de un libro por ID.

### 3.3 Traducciones (`/kartex/translations`)
* **`GET /kartex/translations`**: Lista de versiones de la Biblia ordenadas por ID ascendente.
* **`GET /kartex/translations/:id`**: Detalle de una versión.
* **`POST /kartex/translations`**: Registro de versión oficial (`CreateTranslationDto`).
* **`DELETE /kartex/translations/:id`**: Eliminación de una versión por ID.

### 3.4 Morfología y Léxicos (`/kartex/morphology/*`)
* **`GET /kartex/morphology/passage`**: Retorna los tokens morfológicos agrupados por versículo para un pasaje completo (`?book=GEN&chapter=1`).
* **`GET /kartex/morphology/verse/:verseId`**: Retorna los tokens de un versículo específico ordenados por `wordOrder` ascendente.
* **`GET /kartex/morphology/lexicon`**: Búsqueda léxica multilingüe con precedencia de agrupamiento seguro (`new Brackets`) (`?q=logos&lang=greek&limit=30`).
* **`GET /kartex/morphology/lexicon/:strongCode`**: Obtiene la definición académica y lema de un código Strong (ej. `H7225`, `G3056`). Lanza `EntityNotFoundError` si no existe.

### 3.5 Atlas Bíblico (`/kartex/atlas/*`)
* **`GET /kartex/atlas/places`**: Sitios con coordenadas WGS84, nombres bilingües y notas arqueológicas (`?category=city&q=Jeru&lang=es|en`). Retorno tipado y ordenado por ID.

### 3.6 Cronología Sincrónica (`/kartex/timeline`)
* **`GET /kartex/timeline`**: Monarcas, profetas, imperios y eventos sincrónicos (`?type=monarch&from=-1000&to=-500&lang=es|en`).

### 3.7 Arqueología y Epigrafía (`/kartex/archaeology/*`)
* **`GET /kartex/archaeology/articles`**: Artículos de investigación arqueológica, epigrafía y manuscritos con índice compuesto `(slug, language)` (`?category=recent_discoveries&lang=es|en`).
* **`GET /kartex/archaeology/articles/:slug`**: Detalle completo de un artículo de evidencia material localizado (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.

### 3.8 Evangelización y Apologética (`/kartex/evangelism/*`)
* **`GET /kartex/evangelism/pathways`**: Rutas y secuencias bíblicas bilingües (Camino de Romanos, Puente a la Vida, Cuatro Verdades) (`?lang=es|en`).
* **`GET /kartex/evangelism/pathways/:slug`**: Detalle de una ruta evangelística con pasos, versículos y reflexiones (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.
* **`GET /kartex/evangelism/objections`**: Banco de objeciones comunes y respuestas apologéticas exegéticas con filtro por categoría y búsqueda textual (`?category=&q=&lang=es|en`).
* **`GET /kartex/evangelism/tracts`**: Tratados y bosquejos homiléticos para predicar o compartir (`?audience=&lang=es|en`).
* **`GET /kartex/evangelism/tracts/:slug`**: Detalle de un tratado con bosquejo por puntos, ilustración, oración de fe y pasos de discipulado (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.

### 3.9 Comentarios Bíblicos y Exégesis Clásica (`/kartex/commentaries/*`)
* **`GET /kartex/commentaries`**: Búsqueda y filtrado de notas exegéticas por libro, capítulo, versículo, autor o consulta de texto (`?bookId=GEN&chapter=1&verse=1&authorId=matthew-henry&q=&lang=es|en`).
* **`GET /kartex/commentaries/authors`**: Catálogo de obras y comentaristas canónicos en dominio público (`?lang=es|en`).
* **`GET /kartex/commentaries/authors/:id`**: Detalle biográfico, obra y enfoque hermenéutico de un autor por ID (`?lang=es|en`). Lanza `EntityNotFoundError` si no existe.
* **`GET /kartex/commentaries/passage/:bookId/:chapter`**: Retorna todas las notas exegéticas de un capítulo o versículo específico optimizado para inspectores laterales (`?verse=1&lang=es|en`).

### 3.10 Diccionarios Bíblicos Clásicos (`/kartex/dictionaries/*`)
* **`GET /kartex/dictionaries`**: Catálogo de diccionarios bíblicos disponibles en dominio público (`?lang=es|en`). Retorna título, autor, época, año y recuento de entradas.
* **`GET /kartex/dictionaries/:id`**: Perfil y metadata histórica detallada de una obra enciclopédica por ID o slug (`?lang=es|en`). Lanza `NotFoundException` si no existe.
* **`GET /kartex/dictionaries/letters`**: Recuento agregado instantáneo de términos disponibles por letra A-Z (`?dictionaryId=easton-1897-es&lang=es|en`) para navegación alfabética en milisegundos.
* **`GET /kartex/dictionaries/entries`**: Búsqueda paginada e indexada de artículos con soporte de normalización diacrítica (insensible a acentos), filtro por diccionario, letra A-Z o categoría temática (`?q=jerusalen&letter=J&category=toponym&page=1&limit=20&lang=es|en`).
* **`GET /kartex/dictionaries/entries/:id`**: Entrada enciclopédica completa con definición, etimología, referencias bíblicas e hipervínculos relacionados (`?lang=es|en`). Lanza `NotFoundException` si no existe.



