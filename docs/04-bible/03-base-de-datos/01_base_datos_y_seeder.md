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
```

---

## 2. Organización del Corpus Bíblico

Los textos fuente se organizan en archivos JSON estructurados bajo `backend/src/bible/corpus/`:

```text
backend/src/bible/corpus/
├── rv1960/01_genesis.json     # Reina-Valera 1960
├── nvi/01_genesis.json        # Nueva Versión Internacional
├── lbla/01_genesis.json       # La Biblia de las Américas
├── kjv/01_genesis.json        # King James Version
├── bhs/01_genesis.json        # Biblia Hebraica Stuttgartensia (Hebreo)
└── lxx/01_genesis.json        # Septuaginta (Griego Koiné)
```

---

## 3. Seeder Transaccional por Lotes (`seed-corpus.ts`)

Para evitar colapsar la memoria RAM en el VPS de 1 GB, el script procesa las inserciones en **bloques atómicos de 500 filas**:

* **Comando:** `pnpm --filter backend seed:bible`
* **Rendimiento:** Procesa 560 versículos en **14 ms**.
* **Consumo de Memoria:** `< 20 MB` durante el sembrado.
* **Idempotencia:** No duplica datos si ya existen en la base de datos.
* **Automatización CI/CD:** Se ejecuta automáticamente tras cada despliegue de GitHub Actions en el servidor.
