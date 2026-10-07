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
│ name                   │       │ authorId (IDX -> commentary_authors.id)                │
│ author                 │       │ bookId (IDX)                                           │
│ era                    │       │ chapter (IDX)                                          │
│ theologicalFocus       │       │ verseStart                                             │
│ biography              │       │ verseEnd                                               │
│ historicalWork         │       │ title                                                  │
│ license                │       │ contentMarkdown                                        │
└────────────────────────┘       │ tags (JSON)                                            │
                                 ├────────────────────────────────────────────────────────┤
                                 │ INDEX(bookId, chapter, verseStart, verseEnd)           │
                                 │ INDEX(authorId, language)                              │
                                 └────────────────────────────────────────────────────────┘
```


---

## 2. Organización del Corpus Bíblico y Recursos Históricos

Los textos fuente se organizan exclusivamente en archivos JSON estructurados bajo `backend/src/kartex/corpus/`:

```text
backend/src/kartex/corpus/
├── rv1960/01_genesis.json        # Reina-Valera 1960
├── nvi/01_genesis.json           # Nueva Versión Internacional
├── lbla/01_genesis.json          # La Biblia de las Américas
├── jer/01_genesis.json           # Biblia de Jerusalén
├── kjv/01_genesis.json           # King James Version
├── bhs/01_genesis.json           # Biblia Hebraica Stuttgartensia (Hebreo)
├── lxx/01_genesis.json           # Septuaginta (Griego Koiné)
├── historical/                   # Fuentes de Contexto Histórico Bilingüe (ES / EN)
│   ├── atlas_locations.json      # Coordenadas WGS84, regiones y excavaciones
│   ├── timeline_events.json      # Monarcas, profetas e imperios
│   └── archaeology_articles.json # Artículos de epigrafía y manuscritos
├── commentaries/                 # Corpus de Comentarios Bíblicos Clásicos (ES / EN)
│   ├── commentary_authors.json   # Obras y biografías de comentaristas en Dominio Público
│   └── commentary_entries.json   # Notas exegéticas versículo a versículo
├── dictionaries/                 # Diccionarios Bíblicos Clásicos y Enciclopedia A-Z (ES / EN)
│   ├── dictionaries.json         # Obras enciclopédicas (Easton 1897, Smith 1884, Hitchcock 1869)
│   └── dictionary_entries.json   # Artículos y definiciones teológicas e históricas A-Z
└── evangelism/                   # Fuentes de Evangelización y Apologética (ES / EN)
    ├── pathways.json             # Rutas y secuencias bíblicas (Camino de Romanos, Puente a la Vida)
    ├── objections.json           # Objeciones escépticas y defensas exegéticas
    └── tracts.json               # Tratados y bosquejos homiléticos para predicar
```


---

## 3. Seeder Atómico y Recreación Limpia desde Cero (`seed-corpus.ts`)

La persistencia del corpus bíblico e histórico sigue el principio de **Ingestión Determinista Inmutable (Deterministic Clean Ingestion)**. Tratamos la base de datos `kartex.sqlite` como un artefacto generado de forma pura y reproducible desde los archivos JSON fuente.

### 3.1 Flujo de Recreación Limpia
Al ejecutar el comando del seeder, se realiza un proceso atómico en 4 fases:

1. **Purga Total Previa (`Reset Limpio`):** Ejecuta `DROP TABLE IF EXISTS` en estricto orden de dependencias relacionales para las 15 tablas del corpus (`morphology_tokens`, `lexicon_entries`, `verses`, `translations`, `books`, `historical_places`, `timeline_events`, `archaeology_articles`, `evangelism_pathways`, `evangelism_objections`, `evangelism_tracts`, `commentary_entries`, `commentary_authors`, `bible_dictionary_entries`, `bible_dictionaries`).
2. **Recreación de Esquema e Índices:** Crea las tablas de forma limpia definiendo sus restricciones, claves foráneas e índices únicos e índices B-Tree optimizados (`IDX_verse_unique`, `IDX_morph_token_unique`, `IDX_timeline_start`, `IDX_articles_slug_lang`, `IDX_pathways_slug`, `IDX_objections_cat`, `IDX_tracts_slug`, `IDX_commentary_passage`, `IDX_commentary_author`, `IDX_dict_term_lang`, `IDX_dict_letter`, `IDX_dict_category`), empleando claves primarias compuestas `(id, language)` para soporte multilingüe.
3. **Sembrado Canónico y Textual por Lotes:** Inserta los 66 libros canónicos, versiones y procesa los versículos por lotes transaccionales (`better-sqlite3`).
4. **Sembrado de Contexto Histórico Bilingüe:** Inserta las ubicaciones geográficas del atlas WGS84, eventos cronológicos de sincronía y artículos de arqueología/epigrafía en español e inglés.
5. **Sembrado de Evangelización y Apologética:** Inserta rutas salvíficas estructuradas, banco de objeciones exegéticas y tratados listos para predicar.
6. **Sembrado de Comentarios Bíblicos Clásicos:** Inserta el catálogo de obras/autores clásicos en dominio público y las notas exegéticas granulares versículo por versículo indexadas por coordenadas bíblicas.
7. **Sembrado de Diccionarios Bíblicos Clásicos:** Inserta las obras enciclopédicas históricas (Easton, Smith, Hitchcock) y sus artículos lexicográficos/teológicos con términos normalizados, desglose etimológico e hipervínculos relacionados.


### 3.2 Beneficios Arquitectónicos
* **Cero Residuos ni Datos Huérfanos:** Si se renombran slugs, corrigen versículos o ajustan fechas en los JSON, no quedan registros obsoletos ni desalineados.
* **Idempotencia Absoluta:** La ingestión es una función pura: `JSONs en corpus/ ──► kartex.sqlite`.
* **Optimización Física (1 GB de RAM en VPS):** Recrear SQLite desde cero genera un árbol B-Tree limpio y compacto sin páginas fragmentadas ni *bloated space*.
* **Aislamiento de Usuarios:** Al no mezclar transacciones de usuario con el corpus de referencia, `kartex.sqlite` puede destruirse y recrearse en cualquier momento sin afectar el estado del sistema.

### 3.3 Rendimiento y Operación
* **Comando:**
  ```bash
  pnpm --filter backend seed:kartex
  ```
* **Rendimiento Medido:** Procesa y recrea todo el corpus en **~110 ms**.
* **Consumo de Memoria:** `< 180 MB` de RAM durante el sembrado.
* **Salida de Ejecución Típica:**
  ```text
  [CorpusSeeder] 🚀 Recreando base de datos desde cero: kartex.sqlite...
  [CorpusSeeder] Purgando tablas anteriores (Reset Limpio)...
  [CorpusSeeder] Sembrando catálogo de 66 libros canónicos...
  [CorpusSeeder] Sembrando catálogo de 5 traducciones oficiales...
  [CorpusSeeder] Procesando בְּרֵאשִׁית (GEN) en BHS...
  [CorpusSeeder] Procesando Mateo (MAT) en NA28...
  [CorpusSeeder] Procesando Génesis (GEN) en RV1909...
  [CorpusSeeder] Procesando Mateo (MAT) en RV1909...
  [MorphologySeeder] -> 40 entradas léxicas Strong indexadas.
  [MorphologySeeder] -> 412 tokens morfológicos interlineales indexados.
  [HistoricalSeeder] -> 6 ubicaciones geográficas indexadas.
  [HistoricalSeeder] -> 34 entidades cronológicas indexadas.
  [HistoricalSeeder] -> 6 artículos arqueológicos indexados.
  [EvangelismSeeder] -> 3 rutas bíblicas evangelísticas indexadas.
  [EvangelismSeeder] -> 10 objeciones apologéticas indexadas.
  [EvangelismSeeder] -> 5 tratados y bosquejos homiléticos indexados.
  [CorpusSeeder] Completado con éxito: 161 versículos indexados en 110 ms. Consumo de RAM: 177.60 MB.
  ```
* **Automatización CI/CD:** Se ejecuta automáticamente tras cada despliegue en GitHub Actions para mantener `kartex.sqlite` sincronizada con el repositorio.
