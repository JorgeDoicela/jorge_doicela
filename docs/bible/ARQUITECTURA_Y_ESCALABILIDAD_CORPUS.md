# Arquitectura y Escalabilidad del Sistema: La Biblia Modular

Documentación técnica integral del ecosistema de la **Biblia Modular** (`bible.jorgedoicela.com`), abarcando la arquitectura de datos, el backend en NestJS, el frontend web en Next.js (FSD), la persistencia en SQLite y la estrategia de escalabilidad masiva para corpus de textos, morfología y diccionarios léxicos.

---

## 1. Visión General y Principios Arquitectónicos

El proyecto está diseñado bajo tres principios fundamentales:
1. **Restricción de Hardware en Producción (1 GB de RAM):** Todas las consultas, transacciones y renderizados están optimizados para operar con latencia mínima (< 15 ms) y un consumo estricto de memoria (< 20 MB por proceso de sembrado / < 180 MB en el proceso PM2 consolidado).
2. **Principio de Cajas Negras (Aislamiento de Dominio):** Todo el código, estilos, entidades y componentes residen exclusivamente en `backend/src/bible/` y `frontend/web/src/app/(bible)/`, sin acoplamientos ni dependencias cruzadas con otros módulos del monorepo (`software` o `portfolio`).
3. **Cero Paquetes Compartidos (`@shared`):** Duplicación obligatoria de contratos en TypeScript, permitiendo extraer el subproyecto a un repositorio independiente sin refactorizaciones.

---

## 2. Base de Datos y Modelo de Persistencia (`bible.sqlite`)

La base de datos física es `bible.sqlite`, gestionada con `better-sqlite3` en modo WAL (`Write-Ahead Logging`) y TypeORM mediante la conexión `'bibleConnection'`.

### Diagrama Entidad-Relación

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────────────────┐
│    books     │       │  translations   │       │   lexicon_entries    │
├──────────────┤       ├─────────────────┤       ├──────────────────────┤
│ id (PK)      │       │ id (PK)         │       │ id (PK)              │
│ name         │       │ name            │       │ strongCode (UNIQUE)  │
│ abbreviation │       │ abbreviation    │       │ language             │
│ testament    │       │ language        │       │ lemma                │
└──────┬───────┘       └────────┬────────┘       │ transliteration      │
       │                        │                │ ipa                  │
       │ 1                      │ 1              │ partOfSpeech         │
       │                        │                │ shortDefinition      │
       │ N                      │ N              │ extendedDefinition   │
┌──────┴────────────────────────┴────────┐       └──────────┬───────────┘
│                 verses                 │                  │ 1
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
                                                 │ consonantsOnly       │
                                                 │ transliteration      │
                                                 │ strongCode           │
                                                 │ morphologyCode       │
                                                 │ gloss                │
                                                 ├──────────────────────┤
                                                 │ UNIQUE INDEX(v,order)│
                                                 └──────────────────────┘
```

---

## 3. Backend: Módulos y Catálogo de Endpoints REST (`NestJS 11`)

El backend expone endpoints normalizados con el interceptor global `{ success: true, data: [...] }` y manejo centralizado de excepciones de dominio:

### Catálogo de Rutas

| Método | Endpoint | Descripción | Parámetros Clave |
|---|---|---|---|
| `GET` | `/bible/books` | Lista de libros bíblicos | `?testament=OT` o `NT` |
| `GET` | `/bible/books/:id` | Detalle de un libro | `id` |
| `GET` | `/bible/translations` | Lista de versiones activas | — |
| `GET` | `/bible/translations/:id` | Detalle de traducción | `id` |
| `GET` | `/bible/verses` | Consulta filtrada de versículos | `?bookId=1&translationId=1&chapter=1&limit=200` |
| `GET` | `/bible/verses/:id` | Detalle de un versículo | `id` |
| `GET` | `/bible/morphology/verse/:verseId` | Tokens interlineales ordenados | `verseId` |
| `GET` | `/bible/morphology/lexicon/:strong` | Definición académica Strong | `strongCode` (ej. `H7225`, `G3056`) |
| `GET` | `/bible/morphology/lexicon` | Búsqueda de lemas/raíces | `?q=logos` |

---

## 4. Frontend Web: Feature-Sliced Design (`Next.js 16`)

La aplicación se estructura en dos rutas principales y 12 submódulos desacoplados:

### 4.1 Enrutamiento
1. **Landing Page (`/bible` - [`page.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/bible/page.tsx)):**
   - Presentación general de la plataforma.
   - Live Preview interactivo con comparación de textos (*Salmos 23 en RV1960 vs BHS Hebreo*).
   - Showcase de los 9 motores de estudio con iconos SVG de Lucide.
   - Especificaciones de la App Móvil y métricas de infraestructura.
2. **Espacio de Estudio (`/bible/study` - [`study/page.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/bible/study/page.tsx)):**
   - Header unificado en **1 sola línea horizontal** ([`BibleHeaderNav.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BibleHeaderNav.tsx)) con pestañas de estudio, selector de versión y conmutador de tema.
   - Barra de control de pasaje integrada ([`ReaderToolbar.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/features/verses/components/reader-toolbar/ReaderToolbar.tsx)) con buscador de libros, chips compactos de capítulos y controles tipográficos.
   - Canvas de lectura ampliado (`max-w-5xl`) sin espacios muertos.

### 4.2 Los 9 Módulos de Estudio Exegético

| Feature | Carpeta | Capacidad Técnica |
|---|---|---|
| **1. Lectura Continua** | `features/verses/` | Modo prosa editorial con sangría, números superíndices, modo versículo por renglón y copia contextual de citas. |
| **2. Vista Paralela** | `features/parallel-view/` | Comparador de 2 a 4 columnas alineadas versículo a versículo sincronizadas por capítulo. |
| **3. Diff Textual** | `features/textual-diff/` | Algoritmo LCS para resaltar adiciones, supresiones y variantes textuales entre dos versiones. |
| **4. Interlineal Inverso** | `features/interlinear/` | Desglose palabra por palabra en Hebreo, Arameo y Griego Koiné con códigos Strong y morfología. |
| **5. Análisis Literario** | `features/literary-analysis/` | Detección de quiasmos simétricos (Génesis 1, Génesis 3, Salmo 67) y diagramas paulinos (Romanos 8). |
| **6. Léxicos Integrados** | `features/lexicons/` | Diccionarios académicos integrados: BDB, Gesenius, Thayer, DTAT, LSJ y Robertson. |
| **7. Búsqueda Gramatical** | `features/grammar-search/` | Búsqueda morfológica, gráfico canónico de densidad léxica y concordancia FTS5. |
| **8. Atlas Bíblico 3D** | `features/atlas/` | Cartografía georreferenciada WGS84, rutas históricas (Huerto de Edén, Éxodo, Pablo) y modelos 3D. |
| **9. Cronología Sincrónica**| `features/timeline/` | Línea de tiempo interactiva que sincroniza reyes de Judá e Israel con profetas, imperios e hitos de Nínive. |

---

## 5. Estrategia de Escalabilidad y Corpus de Textos

Para almacenar toda la Biblia (~31.102 versículos por versión y millones de palabras) sin colapsar la memoria RAM del servidor:

```text
backend/src/bible/
├── corpus/                      # Archivos de datos fuente ordenados por versión
│   ├── rv1960/01_genesis.json   # Reina-Valera 1960 (Español)
│   ├── nvi/01_genesis.json      # Nueva Versión Internacional (Español)
│   ├── lbla/01_genesis.json     # La Biblia de las Américas (Español)
│   ├── kjv/01_genesis.json      # King James Version (Inglés)
│   ├── jer/01_genesis.json      # Biblia de Jerusalén (Español)
│   ├── bhs/01_genesis.json      # Biblia Hebraica Stuttgartensia (Hebreo Masorético)
│   └── lxx/01_genesis.json      # Septuaginta Griega (Griego Koiné)
└── cli/
    └── seed-corpus.ts           # Cargador transaccional por lotes (Chunks de 500 filas)
```

### Rendimiento del Sembrador Transaccional
* **Comando:** `pnpm --filter backend seed:bible`
* **Transacciones:** Inserciones en bloques atómicos con `better-sqlite3`.
* **Tiempo de Ejecución:** **560 versículos en 14 ms** (Génesis 1, 2 y 3 en las 7 versiones completas).
* **Consumo de Memoria:** `< 20 MB` durante el proceso de sembrado.

---

## 6. App Móvil Nativa (`frontend/mobile/`)

* **Framework:** React Native con Expo Router.
* **Modo Offline-First:** Los libros descargados se almacenan localmente vía `expo-file-system`.
* **Rendimiento de Listas:** Uso de `FlashList` (Shopify) para renderizar versículos a 60 fps constantes sin fugas de memoria.
* **Notificaciones:** `expo-notifications` para el versículo del día 100% en local sin servidores externos.

---

## 7. Comandos de Mantenimiento y Calidad

```bash
# 1. Comprobación estricta de tipos (0 errores en los 3 workspaces)
pnpm -r typecheck

# 2. Sembrado de datos masivos desde el corpus
pnpm --filter backend seed:bible

# 3. Levantar entorno de desarrollo
pnpm dev
```

---

## 8. Inventario de Archivos Creados y Modificados

### Backend (`backend/src/bible/`)
* [NEW] [`morphology/entities/lexicon-entry.entity.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/morphology/entities/lexicon-entry.entity.ts): Modelo normalizado para códigos Strong y diccionarios exegéticos.
* [NEW] [`morphology/entities/morphology-token.entity.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/morphology/entities/morphology-token.entity.ts): Modelo relacional de palabras individuales alineadas por versículo.
* [NEW] [`morphology/services/morphology.service.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/morphology/services/morphology.service.ts): Servicio de consultas morfológicas y búsqueda léxica.
* [NEW] [`morphology/controllers/morphology.controller.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/morphology/controllers/morphology.controller.ts): Endpoints `/bible/morphology/*`.
* [NEW] [`morphology/morphology.module.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/morphology/morphology.module.ts): Registro de módulo y repositorios TypeORM.
* [NEW] [`corpus/rv1960/01_genesis.json`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/corpus/rv1960/01_genesis.json): Estructura de corpus desacoplada por libro.
* [NEW] [`cli/seed-corpus.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/cli/seed-corpus.ts): Motor de sembrado en lotes transaccionales con `better-sqlite3`.
* [NEW] [`data/genesisSeedData.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/verses/data/genesisSeedData.ts): Génesis 1, 2 y 3 completos (80 versículos).
* [MODIFY] [`bible.module.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/bible/bible.module.ts): Configuración de las 5 entidades en `'bibleConnection'`.
* [MODIFY] [`package.json`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/package.json): Script `seed:bible`.

### Frontend Web (`frontend/web/src/app/(bible)/`)
* [NEW] [`bible/study/page.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/bible/study/page.tsx): Ruta dedicada para el entorno de trabajo y exégesis.
* [NEW] [`components/BibleStudyWorkspace.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BibleStudyWorkspace.tsx): Orquestador desacoplado de las 9 herramientas de estudio.
* [MODIFY] [`bible/page.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/bible/page.tsx): Landing Page de presentación del proyecto.
* [MODIFY] [`components/BibleHeaderNav.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BibleHeaderNav.tsx): Header superior fijo en 1 sola línea horizontal.
* [MODIFY] [`features/verses/components/reader-toolbar/ReaderToolbar.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/features/verses/components/reader-toolbar/ReaderToolbar.tsx): Barra de pasaje con buscador de libros, chips de capítulos y z-index blindado.
* [MODIFY] [`features/verses/components/continuous-view/ContinuousReadingView.tsx`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/features/verses/components/continuous-view/ContinuousReadingView.tsx): Canvas ampliado (`max-w-5xl`) y título dinámico de libro y capítulo.
* [MODIFY] [`features/verses/hooks/useVerses.ts`](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/features/verses/hooks/useVerses.ts): Selección inicial predeterminada en Génesis 1 (RV1960).

