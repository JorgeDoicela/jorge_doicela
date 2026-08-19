---
name: bible-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de la Biblia Modular (bible.jorgedoicela.com), incluyendo el frontend web Next.js (FSD), la app móvil nativa en Expo (frontend/mobile), el backend en NestJS, los 9 motores de estudio exegético, la morfología Strong y la persistencia escalable en bible.sqlite.
---
# Directrices de Desarrollo: Biblia Modular (bible.jorgedoicela.com)

Esta habilidad define los estándares técnicos, el modelo de datos relacional, la arquitectura web (Next.js 16), la app móvil (Expo) y la estrategia de persistencia y escalabilidad para la plataforma de la **Biblia Modular**.

---

## 1. Arquitectura y Aislamiento (Principio de Cajas Negras)

* **Subdominio Web:** `bible.jorgedoicela.com` (en desarrollo: `bible.localhost:3001` o subruta `/bible`).
* **App Móvil:** `frontend/mobile/` (React Native / Expo).
* **Frontend Web:** Grupo de rutas `frontend/web/src/app/(bible)/`.
* **Backend:** Módulo aislado `backend/src/bible/`.
* **Persistencia:** Base de datos SQLite física independiente `bible.sqlite` conectada mediante `'bibleConnection'` en TypeORM.
* **Restricción de Hardware en VPS (1 GB de RAM):** Paginación por capítulo (`limit: 200`), consultas indexadas, cero carga masiva en memoria y sembrado transaccional por lotes (< 20 MB RAM).
* **Aislamiento de Estilos y Assets:** Estilos en `(bible)/globals.css` (estética consola Vercel / Linear) y assets en `frontend/web/public/bible/`.

---

## 2. Frontend Web: Enrutamiento y Feature-Sliced Design (FSD)

### 2.1 Enrutamiento
1. **Landing Page (`/bible` - `bible/page.tsx`):**
   - Presentación general de la plataforma y corpus textual.
   - Live Preview interactivo con comparación de textos (*Salmos 23 en RV1960 vs BHS Hebreo*).
   - Vitrina de los 9 motores de exégesis con iconos SVG de Lucide.
   - Especificaciones de la App Móvil nativa y métricas de infraestructura en 1 GB de RAM.
2. **Espacio de Estudio (`/bible/study` - `bible/study/page.tsx`):**
   - Aloja el componente reutilizable `BibleStudyWorkspace.tsx`.
   - Header unificado en **1 sola línea horizontal** (`BibleHeaderNav.tsx`) con navegación de 9 pestañas, selector de versión y conmutador de tema claro/oscuro.
   - Barra de control de pasaje integrada (`ReaderToolbar.tsx`) con popover buscador de libros (AT/NT), chips compactos de capítulos (`1, 2, 3...`), alternancia párrafo/versículo y controles tipográficos.
   - Canvas de lectura ampliado (`max-w-5xl`) con sangría editorial y superíndices interactivos.

### 2.2 Catálogo de los 9 Motores de Estudio Exegético

```text
frontend/web/src/app/(bible)/features/
├── verses/               # 1. Lectura continua y versículo a versículo (ReaderToolbar, ContinuousReadingView)
├── parallel-view/        # 2. Vista paralela de 2 a 4 columnas sincronizadas por capítulo (ParallelViewGrid)
├── textual-diff/         # 3. Comparador y algoritmo LCS de diferencias textuales (TextualDiffModal)
├── interlinear/          # 4. Interlineal inverso Hebreo/Griego, morfología y Strong (InterlinearView)
├── literary-analysis/    # 5. Quiasmos semíticos y discurso lógico paulino (ChiasmViewer, PaulineDiscourseViewer)
├── lexicons/             # 6. Diccionarios integrados: BDB, Gesenius, Thayer, DTAT, LSJ (LexiconView)
├── grammar-search/       # 7. Búsqueda morfológica, scatter plot canónico y concordancia FTS5 (GrammarSearchDashboard)
├── atlas/                # 8. Atlas georreferenciado WGS84, rutas históricas y visualizador 3D (AtlasDashboard)
├── timeline/             # 9. Cronología sincrónica de reyes, profetas, imperios y arqueología (TimelineDashboard)
├── archaeology-feed/     # Feed de descubrimientos epigráficos y Rollos del Mar Muerto (ArchaeologyFeedDashboard)
├── books/                # Selector y catálogo de libros bíblicos (BookSelector)
└── translations/         # Selector de versiones bíblicas (TranslationSelector)
```

---

## 3. App Móvil Nativa (`frontend/mobile` - React Native / Expo)

* **Arquitectura de Rutas:** Desarrollada con `expo-router` con navegación por pestañas (`app/(tabs)/`).
* **Estrategia Offline-First:**
  * Almacenamiento local de libros y capítulos descargados vía `expo-file-system`.
  * Persistencia de notas privadas, historial y versículos favoritos mediante `@react-native-async-storage/async-storage`.
* **Rendimiento de Renderizado:** Uso estricto de `FlashList` (Shopify) para renderizar versículos a 60 fps constantes sin fugas de memoria.
* **Notificaciones Locales:** Versículo del día programado con `expo-notifications` (100% offline).
* **Gestos y Hápticos:** Swipe horizontal entre capítulos con `react-native-gesture-handler` y respuesta háptica con `expo-haptics`.

---

## 4. Backend y Modelo de Persistencia (`NestJS 11` & `bible.sqlite`)

### 4.1 Las 5 Entidades Relacionales (`TypeORM` en `bibleConnection`)

1. **`Translation` (`translation.entity.ts`):** `id` (numérico), `name`, `abbreviation` (`RV1960`, `NVI`, `BHS`, `LXX`), `language`.
2. **`Book` (`book.entity.ts`):** `id` (numérico), `name`, `abbreviation` (`GEN`, `SAL`, `ROM`), `testament` (`OT`/`NT`).
3. **`Verse` (`verse.entity.ts`):**
   - `id`, `book` (FK `bookId`), `translation` (FK `translationId`), `chapter`, `verseNumber`, `text`.
   - **Índice Compuesto Único Obligatorio:** `@Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true })`.
4. **`LexiconEntry` (`lexicon-entry.entity.ts`):**
   - `id`, `strongCode` (`H7225`, `G3056` con índice único), `language` (`Hebrew`/`Aramaic`/`Greek`), `lemma`, `transliteration`, `ipa`, `partOfSpeech`, `shortDefinition`, `extendedDefinition` (BDB, Thayer, Gesenius).
5. **`MorphologyToken` (`morphology-token.entity.ts`):**
   - `id`, `verse` (FK `verseId`), `wordOrder`, `surfaceText`, `consonantsOnly`, `transliteration`, `strongCode`, `morphologyCode` (parsing Robinson/WLC), `gloss`.
   - **Índice Compuesto Único:** `@Index(['verse', 'wordOrder'], { unique: true })`.

### 4.2 Catálogo de Endpoints REST (`/bible/*`)

| Método | Endpoint | Descripción | Parámetros Clave |
|---|---|---|---|
| `GET` | `/bible/books` | Lista de libros bíblicos | `?testament=OT` o `NT` |
| `GET` | `/bible/books/:id` | Detalle de un libro | `id` |
| `GET` | `/bible/translations` | Lista de versiones disponibles | — |
| `GET` | `/bible/translations/:id` | Detalle de traducción | `id` |
| `GET` | `/bible/verses` | Consulta filtrada de versículos | `?bookId=1&translationId=1&chapter=1&limit=200` |
| `GET` | `/bible/verses/:id` | Detalle de un versículo individual | `id` |
| `GET` | `/bible/morphology/verse/:verseId` | Tokens interlineales ordenados | `verseId` |
| `GET` | `/bible/morphology/lexicon/:strong` | Definición académica Strong | `strongCode` (ej. `H7225`, `G3056`) |
| `GET` | `/bible/morphology/lexicon` | Búsqueda de lemas y raíces | `?q=logos` |

---

## 5. Estrategia de Escalabilidad y Corpus de Textos

Para almacenar toda la Biblia (~31.102 versículos por versión y millones de palabras) sin colapsar el bundle de TypeScript ni la memoria del VPS:

```text
backend/src/bible/
├── corpus/                      # Archivos de datos fuente ordenados por versión
│   └── rv1960/
│       └── 01_genesis.json      # JSON compacto libro por libro
└── cli/
    └── seed-corpus.ts           # Cargador transaccional por lotes (Chunks de 500 filas)
```

* **Sembrador Transaccional por Lotes:** Inserciones en bloques atómicos usando `better-sqlite3` (`INSERT OR REPLACE INTO verses ...`).
* **Rendimiento Medido:** **80 versículos indexados en 13 ms** con consumo de memoria `< 20 MB`.
* **Comando de Ejecución:** `pnpm --filter backend seed:bible`.

---

## 6. Comandos de Calidad y Mantenimiento

```bash
# 1. Comprobación estricta de tipos en todo el monorepo (0 errores)
pnpm -r typecheck

# 2. Sembrado masivo desde el corpus estructurado
pnpm --filter backend seed:bible

# 3. Levantar entorno de desarrollo
pnpm dev
```

---

## 7. ❌ Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Omitir el índice único compuesto en `Verse` o `MorphologyToken` | Permite insertar duplicados del mismo versículo o palabra. | Asegurar `@Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true })`. |
| Hardcodear arrays masivos de 31.000 versículos en código TypeScript | Agota la memoria de `tsc` y satura la compilación en 1 GB de RAM. | Almacenar en `backend/src/bible/corpus/<version>/` y sembrar con `seed:bible`. |
| Traer toda la Biblia o libros completos sin filtrar por capítulo | Bloquea el event loop de NestJS y satura el ancho de banda. | Filtrar siempre por libro (`bookId`) y capítulo (`chapter`). |
| Instalar librerías de Expo (`expo-*`) en `frontend/web` | Contamina el bundle web con módulos nativos incompatibles. | Usar `pnpm --filter mobile add <paquete-expo>`. |
| Compartir interfaces entre la app móvil y el backend | Rompe el principio de autonomía de la aplicación móvil. | Definir los tipos locales en `frontend/mobile/src/types/`. |
| Inyectar repositorios sin `'bibleConnection'` | Falla en runtime o consulta la base de datos equivocada. | Usar `@InjectRepository(Verse, 'bibleConnection')`. |

---

## 8. 🔗 Combinar con
* **General:** `general-jorge-doicela` (para el uso estricto de `--filter` y duplicación de interfaces).
* **Infraestructura:** `infraestructura-jorge-doicela` (para proxy Nginx, Cloudflare mTLS y PM2).
