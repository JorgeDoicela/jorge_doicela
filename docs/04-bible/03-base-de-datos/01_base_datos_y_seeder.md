# Biblia Modular - Base de Datos, Corpus y Seeder Transaccional

Este documento detalla el modelo de datos en `bible.sqlite`, la organización del corpus de textos bíblicos y el funcionamiento del sembrador transaccional masivo.

---

## 1. Modelo de Datos Relacional (`bible.sqlite`)

La base de datos física `bible.sqlite` está optimizada para lecturas ultra-rápidas mediante **`better-sqlite3` en modo WAL**:

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────────────────┐
│    books     │       │  translations   │       │   lexicon_entries    │
├──────────────┤       ├─────────────────┤       ├──────────────────────┤
│ id (PK)      │       │ id (PK)         │       │ id (PK)              │
│ name         │       │ name            │       │ strongCode (UNIQUE)  │
│ abbreviation │       │ abbreviation    │       │ language             │
│ testament    │       │ language        │       │ lemma                │
└──────┬───────┘       └────────┬────────┘       │ transliteration      │
       │                        │                │ shortDefinition      │
       │ 1                      │ 1              │ extendedDefinition   │
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
│ name                   │       │ name                   │       │ title                  │
│ originalName (JSON)    │       │ type (INDEX)           │       │ slug (UNIQUE, INDEX)   │
│ coordinates (JSON)     │       │ startYearBC (INDEX)    │       │ category (INDEX)       │
│ category (INDEX)       │       │ endYearBC (INDEX)      │       │ region                 │
│ era (JSON)             │       │ kingdom                │       │ publishDate            │
│ modernName             │       │ evaluation             │       │ summary                │
│ description            │       │ biblicalReferences     │       │ contentMarkdown        │
│ archaeologicalNotes    │       │ keyEvents              │       │ biblicalReferences     │
└────────────────────────┘       └────────────────────────┘       └────────────────────────┘
```

---

## 2. Organización del Corpus Bíblico y Recursos Históricos

Los textos fuente se organizan exclusivamente en archivos JSON estructurados bajo `backend/src/bible/corpus/`:

```text
backend/src/bible/corpus/
├── rv1960/01_genesis.json        # Reina-Valera 1960
├── nvi/01_genesis.json           # Nueva Versión Internacional
├── lbla/01_genesis.json          # La Biblia de las Américas
├── jer/01_genesis.json           # Biblia de Jerusalén
├── kjv/01_genesis.json           # King James Version
├── bhs/01_genesis.json           # Biblia Hebraica Stuttgartensia (Hebreo)
├── lxx/01_genesis.json           # Septuaginta (Griego Koiné)
└── historical/                   # Fuentes de Contexto Histórico
    ├── atlas_locations.json      # Coordenadas WGS84, regiones y excavaciones
    ├── timeline_events.json      # Monarcas, profetas e imperios
    └── archaeology_articles.json # Artículos de epigrafía y manuscritos
```

---

## 3. Seeder Atómico y Recreación Limpia desde Cero (`seed-corpus.ts`)

La persistencia del corpus bíblico e histórico sigue el principio de **Ingestión Determinista Inmutable (Deterministic Clean Ingestion)**. Tratamos la base de datos `bible.sqlite` como un artefacto generado de forma pura y reproducible desde los archivos JSON fuente.

### 3.1 Flujo de Recreación Limpia
Al ejecutar el comando del seeder, se realiza un proceso atómico en 4 fases:

1. **Purga Total Previa (`Reset Limpio`):** Ejecuta `DROP TABLE IF EXISTS` en estricto orden de dependencias relacionales para las 8 tablas del corpus (`morphology_tokens`, `lexicon_entries`, `verses`, `translations`, `books`, `historical_places`, `timeline_events`, `archaeology_articles`).
2. **Recreación de Esquema e Índices:** Crea las tablas de forma limpia definiendo sus restricciones, claves foráneas e índices únicos e índices B-Tree optimizados (`IDX_verse_unique`, `IDX_morph_token_unique`, `IDX_timeline_start`, `IDX_articles_slug`, etc.).
3. **Sembrado Canónico y Textual por Lotes:** Inserta los 66 libros canónicos, versiones y procesa los versículos por lotes transaccionales (`better-sqlite3`).
4. **Sembrado de Contexto Histórico:** Inserta las ubicaciones geográficas del atlas WGS84, eventos cronológicos de sincronía y artículos de arqueología/epigrafía.

### 3.2 Beneficios Arquitectónicos
* **Cero Residuos ni Datos Huérfanos:** Si se renombran slugs, corrigen versículos o ajustan fechas en los JSON, no quedan registros obsoletos ni desalineados.
* **Idempotencia Absoluta:** La ingestión es una función pura: `JSONs en corpus/ ──► bible.sqlite`.
* **Optimización Física (1 GB de RAM en VPS):** Recrear SQLite desde cero genera un árbol B-Tree limpio y compacto sin páginas fragmentadas ni *bloated space*.
* **Aislamiento de Usuarios:** Al no mezclar transacciones de usuario con el corpus de referencia, `bible.sqlite` puede destruirse y recrearse en cualquier momento sin afectar el estado del sistema.

### 3.3 Rendimiento y Operación
* **Comando:**
  ```bash
  pnpm --filter backend seed:bible
  ```
* **Rendimiento Medido:** Procesa y recrea todo el corpus en **< 80 ms**.
* **Consumo de Memoria:** `< 165 MB` de RAM durante el sembrado.
* **Salida de Ejecución Típica:**
  ```text
  [CorpusSeeder] 🚀 Recreando base de datos desde cero: bible.sqlite...
  [CorpusSeeder] Purgando tablas anteriores (Reset Limpio)...
  [CorpusSeeder] Sembrando catálogo de 66 libros canónicos...
  [CorpusSeeder] Procesando בְּרֵאשִׁית (GEN) en BHS...
  [CorpusSeeder] Procesando ΓΕΝΕΣΙΣ (GEN) en LXX...
  [CorpusSeeder] Procesando Génesis (GEN) en NBLA...
  [CorpusSeeder] Procesando Génesis (GEN) en NVI...
  [CorpusSeeder] Procesando Génesis (GEN) en RV1960...
  [MorphologySeeder] -> 30 entradas léxicas Strong indexadas.
  [MorphologySeeder] -> 355 tokens morfológicos masoréticos indexados.
  [HistoricalSeeder] -> 3 ubicaciones geográficas indexadas.
  [HistoricalSeeder] -> 17 entidades cronológicas indexadas.
  [HistoricalSeeder] -> 3 artículos arqueológicos indexados.
  [CorpusSeeder] Completado con éxito: 351 versículos indexados en 23 ms. Consumo de RAM: 146.47 MB.
  ```
* **Automatización CI/CD:** Se ejecuta automáticamente tras cada despliegue en GitHub Actions para mantener `bible.sqlite` sincronizada con el repositorio.
