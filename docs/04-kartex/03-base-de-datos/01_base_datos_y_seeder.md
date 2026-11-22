# KARTEX - Base de Datos, Corpus y Seeder Transaccional

Este documento detalla el modelo de datos en `kartex.sqlite`, la organización del corpus de textos bíblicos y el funcionamiento del sembrador transaccional masivo.

---

## 1. Modelo de Datos Relacional (`kartex.sqlite`)

La base de datos física `kartex.sqlite` está optimizada para lecturas ultra-rápidas mediante **`better-sqlite3` en modo WAL** con los siguientes pragmas de producción (`prepareDatabase`):
* `enableWAL: true`: Permite lecturas y escrituras simultáneas sin bloqueos.
* `PRAGMA foreign_keys = ON`: Garantiza la integridad referencial y borrado en cascada en runtime.
* `PRAGMA synchronous = NORMAL`: Minimiza I/O en disco para el entorno de 1 GB de RAM.
* `PRAGMA busy_timeout = 5000`: Espera defensiva ante bloqueos concurrentes.
* `PRAGMA cache_size = -32000`: Reserva 32 MB de caché en RAM para acelerar consultas frecuentes.
* `PRAGMA temp_store = MEMORY`: Ordenamientos y subconsultas en RAM volátil.
* `PRAGMA journal_size_limit = 67108864`: Límite de 64 MB para el WAL para no saturar el almacenamiento del VPS.

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────────────────┐
│    books     │       │  translations   │       │   lexicon_entries    │
├──────────────┤       ├─────────────────┤       ├──────────────────────┤
│ id (PK)      │       │ id (PK)         │       │ id (PK)              │
│ name         │       │ name            │       │ strongCode (UNIQUE)  │
│ abbreviation │       │ abbreviation    │       │ language             │
│ order (UQ)   │       │ language        │       │ lemma                │
│ testament    │       └────────┬────────┘       │ transliteration      │
└──────┬───────┘                                 │ shortDefinition      │
       │                        │                │ extendedDefinition   │
       │                        │                └──────────┬───────────┘
       │ N                      │ N                         │ 1
┌──────┴────────────────────────┴────────┐                  │
│                 verses                 │                  │
├────────────────────────────────────────┤                  │
│ id (PK)                                │                  │
│ bookId (FK -> books.id)                │                  │
│ translationId (FK -> translations.id)  │                  │
│ chapter                                │                  │
│ verseNumber                            │                  │
│ text                                   │                  │
├────────────────────────────────────────┤                  │ N
│ UNIQUE INDEX(translation,book,ch,vNum) │       ┌──────────┴───────────┐
└──────────────────┬─────────────────────┘       │  morphology_tokens   │
                   │ 1                           ├──────────────────────┤
                   │                             │ id (PK)              │
                   │ N                           │ verseId (FK)         │
                   └─────────────────────────────┤ wordOrder            │
                                                 │ surfaceText          │
                                                 │ strongCode           │
                                                 │ morphologyCode       │
                                                 │ gloss                │
                                                 └──────────────────────┘

┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│   historical_places    │       │    timeline_events     │       │  archaeology_articles  │
├────────────────────────┤       ├────────────────────────┤       ├────────────────────────┤
│ id (PK)                │       │ id (PK)                │       │ id (PK)                │
│ language (PK)          │       │ language (PK)          │       │ language (PK)          │
│ name                   │       │ name                   │       │ title                  │
│ originalName (JSON)    │       │ type (INDEX)           │       │ slug                   │
│ coordinates (JSON)     │       │ startYearBC (INDEX)    │       │ category (INDEX)       │
│ category (INDEX)       │       │ endYearBC (INDEX)      │       │ region                 │
│ era (JSON)             │       │ kingdom                │       │ publishDate (DATE)     │
│ modernName             │       │ evaluation             │       │ summary                │
│ description            │       │ biblicalReferences     │       │ contentMarkdown        │
│ archaeologicalNotes    │       │ keyEvents              │       │ UQ(slug, language)     │
└────────────────────────┘       └────────────────────────┘       └────────────────────────┘


┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│  evangelism_pathways   │       │ evangelism_objections  │       │   evangelism_tracts    │
├────────────────────────┤       ├────────────────────────┤       ├────────────────────────┤
│ id (PK)                │       │ id (PK)                │       │ id (PK)                │
│ language (PK)          │       │ language (PK)          │       │ language (PK)          │
│ slug (IDX)             │       │ category (IDX)         │       │ slug (IDX)             │
│ title                  │       │ question               │       │ title                  │
│ subtitle               │       │ summary                │       │ targetAudience         │
│ description            │       │ biblicalAnswer         │       │ summary                │
│ theologicalFocus       │       │ keyVerses (JSON)       │       │ fullOutline (JSON)     │
│ steps (JSON)           │       │ practicalAdvice        │       │ prayerOfFaith          │
└────────────────────────┘       └────────────────────────┘       │ nextSteps (JSON)       │
                                                                  └────────────────────────┘

┌────────────────────────┐       ┌────────────────────────────────────────────────────────┐
│   commentary_authors   │       │                   commentary_entries                   │
├────────────────────────┤       ├────────────────────────────────────────────────────────┤
│ id (PK)                │       │ id (PK)                                                │
│ language (PK)          │       │ language (PK)                                          │
│ name                   │       │ authorId (FK -> commentary_authors.id, language)       │
│ author                 │       │ bookId (IDX, código canónico normalizado)              │
│ era                    │       │ bookOrder (FK -> books.id, 1..66)                      │
│ theologicalFocus       │       │ entryType ('book_intro' | 'chapter_intro' | 'passage') │
│ biography              │       │ chapter (IDX)                                          │
│ historicalWork         │       │ verseStart                                             │
│ license                │       │ verseEnd                                               │
│ entriesCount           │       │ title                                                  │
└────────────────────────┘       │ contentMarkdown                                        │
                                 │ tags (JSON)                                            │
                                 ├────────────────────────────────────────────────────────┤
                                 │ INDEX(bookId, chapter, verseStart, verseEnd)           │
                                 │ INDEX(bookOrder, chapter, verseStart)                  │
                                 │ INDEX(authorId, language)                              │
                                 │ VIRTUAL TABLE FTS5: commentary_entries_fts             │
                                 │ (External Content FTS5 + unicode61 remove_diacritics 2)│
                                 └────────────────────────────────────────────────────────┘

┌────────────────────────┐       ┌────────────────────────────────────────────────────────┐
│   bible_dictionaries   │       │                bible_dictionary_entries                │
├────────────────────────┤       ├────────────────────────────────────────────────────────┤
│ id (PK)                │       │ id (PK)                                                │
│ language (PK)          │       │ language (PK)                                          │
│ slug (UQ + language)   │       │ dictionaryId (FK -> bible_dictionaries.id, language)   │
│ title                  │       │ term                                                   │
│ author                 │       │ normalizedTerm (IDX + language)                        │
│ era                    │       │ letter (IDX + dictionaryId + language)                 │
│ year                   │       │ category (IDX + language)                              │
│ entriesCount           │       │ etymology                                              │
│ theologicalFocus       │       │ definitionMarkdown                                     │
│ description            │       │ biblicalReferences (JSON)                              │
│ license                │       │ relatedTerms (JSON)                                    │
└────────────────────────┘       ├────────────────────────────────────────────────────────┤
                                 │ VIRTUAL TABLE FTS5: bible_dictionary_entries_fts       │
                                 │ (External Content FTS5 + unicode61 remove_diacritics 2)│
                                 └────────────────────────────────────────────────────────┘
```


---

## 2. Organización del Corpus Bíblico y Recursos Históricos

Los textos fuente de Dominio Público se organizan exclusivamente en archivos JSON estructurados bajo `backend/src/kartex/corpus/` y se siembran en `kartex.sqlite`:

```text
backend/src/kartex/corpus/
├── bhs/01_genesis.json           # Biblia Hebraica Stuttgartensia (Hebreo Masorético)
├── na28/40_mateo.json            # Texto Crítico Griego (Nuevo Testamento)
├── rv1909/                       # Reina-Valera 1909 (Dominio Público)
│   ├── 01_genesis.json
│   └── 40_mateo.json
├── morphology/                   # Léxicos Strong y Tokens Morfológicos Interlineales
│   ├── genesis_lexicon.json
│   ├── genesis_tokens.json
│   ├── matthew_lexicon.json
│   └── matthew_tokens.json
├── pericopes/                    # Subtítulos y Divisiones Canónicas Bilingües
│   └── pericopes.json
├── historical/                   # Fuentes de Contexto Histórico Bilingüe (ES / EN)
│   ├── atlas_locations.json      # Coordenadas WGS84, regiones y excavaciones
│   ├── timeline_events.json      # Monarcas, profetas e imperios
│   └── archaeology_articles.json # Artículos de epigrafía y manuscritos
├── commentaries/                 # Corpus de Comentarios Bíblicos Clásicos (ES / EN)
│   ├── commentary_authors.json   # Obras y biografías en Dominio Público (Matthew Henry y JFB)
│   ├── matthew-henry/            # Archivos modulares por idioma (es/ | en/) y libro (01_genesis.json...)
│   └── jfb/                      # Archivos modulares por idioma (es/ | en/) y libro (01_genesis.json...)
├── dictionaries/                 # Diccionarios Bíblicos Clásicos y Enciclopedia A-Z (ES / EN)
│   ├── dictionaries.json         # Obras enciclopédicas (Easton 1897, Smith 1884, Hitchcock 1869)
│   ├── easton-1897/              # Archivos modulares por idioma (es/entries.json | en/entries.json)
│   ├── smith-1884/               # Archivos modulares por idioma (es/entries.json | en/entries.json)
│   └── hitchcock-1869/           # Archivos modulares por idioma (es/entries.json | en/entries.json)
└── evangelism/                   # Fuentes de Evangelización y Apologética (ES / EN)
    ├── pathways.json             # Rutas y secuencias bíblicas (Camino de Romanos, Puente a la Vida)
    ├── objections.json           # Objeciones escépticas y defensas exegéticas
    └── tracts.json               # Tratados y bosquejos homiléticos para predicar
```


---

## 3. Seeder Transaccional e Ingesta Híbrida (`seed-corpus.ts`)

La persistencia de `kartex.sqlite` combina **Preservación de Caché Bíblico** (para capítulos descargados bajo demanda vía `ApiBibleService`) con **Ingestión Determinista Inmutable** (para todos los módulos exegéticos y enciclopédicos del `corpus/`). En tiempo de ejecución, NestJS nunca lee los archivos JSON del disco: todas las consultas se ejecutan directamente contra `kartex.sqlite`.

### 3.1 Flujo de Sembrado y Sincronización
Al ejecutar `pnpm --filter backend seed:kartex` (o `pnpm seed:all`), se ejecuta un proceso atómico:

1. **Preservación del Caché de Versículos (`books`, `translations`, `verses`):** Utiliza `CREATE TABLE IF NOT EXISTS` y sentencias `INSERT ... ON CONFLICT DO UPDATE` (UPSERT que conserva los IDs primarios). De este modo, al resembrar el corpus editorial no se pierden los capítulos bíblicos previamente descargados y cacheados en `kartex.sqlite` desde YouVersion / API.Bible.
2. **Purga y Recreación Limpia del Corpus Editorial:** Ejecuta `DROP TABLE IF EXISTS` exclusivamente sobre las tablas del corpus local (`morphology_tokens`, `lexicon_entries`, `historical_places`, `timeline_events`, `archaeology_articles`, `evangelism_pathways`, `evangelism_objections`, `evangelism_tracts`, `commentary_entries_fts`, `commentary_entries`, `commentary_authors`, `bible_dictionary_entries_fts`, `bible_dictionary_entries`, `bible_dictionaries`), garantizando que cualquier registro eliminado o renombrado en los archivos JSON desaparezca sin dejar datos huérfanos.
3. **Índices B-Tree y Motores External Content FTS5:** Crea índices compuestos y las tablas virtuales `commentary_entries_fts` (`content='commentary_entries'`) y `bible_dictionary_entries_fts` (`content='bible_dictionary_entries'`) con tokenizador `unicode61 remove_diacritics 2`, comando atómico `rebuild` y triggers de sincronización (`ai`, `ad`, `au`), evitando duplicar texto en disco o memoria RAM.
4. **Sembrado de Comentarios y Diccionarios Bíblicos Clásicos:** Recorre recursivamente las subcarpetas modulares por autor/obra e idioma (`es/`, `en/`), normaliza los códigos de libro mediante `resolveCanonicalBook`, inserta las entradas en transacción (`db.transaction`) y recalcula automáticamente `entriesCount` por autor y diccionario.


### 3.2 Beneficios Arquitectónicos
* **Cero Lectura de JSON en Runtime (1 GB de RAM en VPS):** En producción, los archivos `.json` de `corpus/` solo se leen durante el despliegue (`seed:all`). El servidor NestJS responde todas las peticiones leyendo únicamente las filas indexadas desde `kartex.sqlite`.
* **Cero Residuos en el Corpus Editorial y Caché Bíblico Intacto:** El corpus exegético es 100% determinista (`corpus/**/*.json ──► kartex.sqlite`), mientras que el caché de capítulos bíblicos descargados se preserva entre ejecuciones del seeder.

### 3.3 Rendimiento y Operación
* **Comando de Siembra:**
  ```bash
  pnpm --filter backend seed:kartex
  ```
* **Comandos CLI de Ingesta Automatizada de Comentarios (`import-commentaries.ts`):**
  Permiten descargar e indexar capítulos o libros completos de Matthew Henry o Jamieson-Fausset-Brown desde la API abierta de Dominio Público (HelloAO) hacia `backend/src/kartex/corpus/commentaries/{authorId}/{es,en}/`, generando automáticamente las versiones en inglés y español, normalizando las referencias bíblicas y ejecutando `seedCorpus()` al finalizar (sin sobrescribir capítulos ya curados salvo que se indique `--force`):
  ```bash
  # Importar capítulos específicos de un libro en Matthew Henry
  pnpm --filter backend import:matthew-henry --book=GEN --chapters=1-10

  # Importar uno o varios libros completos
  pnpm --filter backend import:matthew-henry --book=GEN,JUA,ROM

  # Importar por testamento (--nt / --ot) o toda la Biblia (--all)
  pnpm --filter backend import:matthew-henry --nt
  pnpm --filter backend import:matthew-henry --all

  # Importar en Jamieson, Fausset & Brown (JFB)
  pnpm --filter backend import:jfb --book=JUA --chapters=1-3
  ```
* **Rendimiento Medido:** Procesa y sincroniza todo el corpus en **~90 ms**.
* **Consumo de Memoria:** `< 180 MB` de RAM durante el sembrado.
* **Salida de Ejecución Típica:**
  ```text
  [CorpusSeeder] Sincronizando y sembrando base de datos: kartex.sqlite...
  [CorpusSeeder] Reiniciando tablas del corpus editorial (preservando caché de versículos)...
  [CorpusSeeder] Sembrando catálogo de 66 libros canónicos...
  [CorpusSeeder] Sembrando catálogo de traducciones oficiales...
  [CorpusSeeder] Procesando בְּרֵאשִׁית (GEN) en BHS...
  [CorpusSeeder] Procesando Mateo (MAT) en NA28...
  [CorpusSeeder] Procesando Génesis (GEN) en RV1909...
  [CorpusSeeder] Procesando Mateo (MAT) en RV1909...
  [MorphologySeeder] -> 40 entradas léxicas Strong indexadas.
  [MorphologySeeder] -> 412 tokens morfológicos interlineales indexados.
  [HistoricalSeeder] -> 6 ubicaciones geográficas indexadas.
  [HistoricalSeeder] -> 34 entidades cronológicas indexadas.
  [HistoricalSeeder] -> 6 artículos arqueológicos indexados.
  [CorpusSeeder] Sembrando Corpus de Evangelización...
  [EvangelismSeeder] -> 6 rutas evangelísticas indexadas.
  [EvangelismSeeder] -> 8 objeciones apologéticas indexadas.
  [EvangelismSeeder] -> 4 tratados y bosquejos indexados.
  [CommentariesSeeder] Sembrando corpus de comentarios bíblicos...
  [CommentariesSeeder] -> 4 autores/obras de comentarios indexados.
  [CommentariesSeeder] -> 28 notas exegéticas de comentarios indexadas (10 archivos).
  [DictionariesSeeder] Sembrando corpus de diccionarios bíblicos...
  [DictionariesSeeder] -> 6 diccionarios bíblicos clásicos indexados.
  [DictionariesSeeder] -> 14 entradas enciclopédicas de diccionario indexadas (6 archivos).
  [PericopesSeeder] -> 32 perícopas temáticas indexadas.
  [CorpusSeeder] Completado con éxito: 161 versículos indexados en 92 ms. Consumo de RAM: 173.59 MB.
  ```
* **Automatización CI/CD:** Se ejecuta automáticamente tras cada despliegue en GitHub Actions para mantener `kartex.sqlite` sincronizada con el repositorio.


### 8. Tabla de Perícopas y Subtítulos Temáticos (`pericopes`)
Almacena las divisiones y encabezados de sección canónicos universales mapeados por libro, capítulo y versículo de inicio (`startVerse`), con soporte bilingüe (`title` y `titleEn`) y orden de secuencia.
