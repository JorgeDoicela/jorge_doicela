---
name: bible-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de la Biblia Modular (bible.jorgedoicela.com), incluyendo el frontend web Next.js (estilo Geist / Vercel Style, FSD), la app móvil nativa en Expo (frontend/mobile), el backend en NestJS, los 9 motores de estudio exegético, la morfología Strong, el contexto histórico y la persistencia escalable en bible.sqlite.
---
# Directrices de Desarrollo: Biblia Modular (bible.jorgedoicela.com)

Esta habilidad define los estándares técnicos, el modelo de datos relacional, la arquitectura web (Next.js 16), la app móvil (Expo) y la estrategia de persistencia y escalabilidad para la plataforma de la Biblia Modular.

---

## Documentación Técnica Oficial
* [01_lector_y_estudio_web.md](../../../docs/04-bible/01-frontend-web/01_lector_y_estudio_web.md)
* [02_backend_y_morfologia.md](../../../docs/04-bible/02-backend/01_backend_y_morfologia.md)
* [03_base_datos_y_seeder.md](../../../docs/04-bible/03-base-de-datos/01_base_datos_y_seeder.md)
* [04_app_movil_expo.md](../../../docs/04-bible/04-mobile-expo/01_app_movil_expo.md)
* [01_roadmap_bible.md](../../../docs/04-bible/05-roadmap/01_roadmap_bible.md)
* [01_marco_legal_fuentes_y_api.md](../../../docs/04-bible/06-marco-legal-y-fuentes/01_marco_legal_fuentes_y_api.md)

---

## 1. Arquitectura y Aislamiento (Principio de Cajas Negras)

* **Subdominio Web:** `bible.jorgedoicela.com` (en desarrollo: `bible.localhost:3001` o subruta `/bible`).
* **App Móvil:** `frontend/mobile/` (React Native / Expo SDK 52+).
* **Frontend Web:** Grupo de rutas `frontend/web/src/app/(bible)/`.
* **Backend:** Módulo aislado `backend/src/bible/`.
* **Persistencia:** Base de datos SQLite física independiente `bible.sqlite` conectada mediante `'bibleConnection'` en TypeORM.
* **Cero Datos Hardcodeados en TypeScript:** Ningún archivo `.ts` o `.tsx` en el frontend contiene versículos, palabras, coordenadas geográficas ni artículos incrustados. Toda la data reside en archivos `.json` bajo `backend/src/bible/corpus/` y se consulta asíncronamente desde los endpoints de NestJS.
* **Aislamiento de Estilos y Diseño:** Utiliza exclusivamente su propio archivo `(bible)/globals.css` (estética **Geist / Vercel Style** monocromática de precisión, micro-interacciones de alta densidad, bordes ultra-delgados, tipografía Geist y legibilidad editorial para exégesis) y assets en `frontend/web/public/bible/`.
* **Internacionalización y SEO (next-intl):** Diccionarios encapsulados en `(bible)/messages/es.json` y `en.json`. Layout raíz `(bible)/layout.tsx` integrado con `NextIntlClientProvider` y `generateMetadata()` dinámico con etiquetas `hreflang`. Soporte de base de datos bilingüe (`language: 'es' | 'en'`) en tablas explicativas (`archaeology_articles`, `timeline_events`, `historical_places`).
* **Datos Estructurados Schema.org (`BibleJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `Dataset` para el corpus bíblico y los 9 motores exegéticos ante motores de búsqueda e IA.
* **Sincronización con IA:** Cuando se agreguen nuevos motores de exégesis o traducciones oficiales, reflejarlos en `public/bible/llms.txt` y en `public/landing/llms.txt`.


---

## 2. Frontend Web: Enrutamiento y Feature-Sliced Design (FSD)

### 2.1 Enrutamiento
1. **Landing Page (`/bible` - `bible/page.tsx`):**
   - Presentación general de la plataforma y corpus textual.
   - Live Preview interactivo con comparación de textos (Salmos 23 en RV1960 vs BHS Hebreo).
   - Vitrina de los 9 motores de exégesis con iconos SVG.
2. **Espacio de Estudio (`/bible/study` - `bible/study/layout.tsx`):**
   - Header unificado persistente (`BibleHeaderNav.tsx`) con pestañas en desktop y menú desplegable flotante de 6 suites en móvil (`< md`).
   - Barra de control exegético integrada (`ReaderToolbar.tsx`) que agrupa pasaje (`UnifiedPassagePicker`), versión bíblica (`TranslationSelector`) y controles de tipografía/diseño.
   - **Suite 1: Lectura Editorial Continua (`/bible/study/standard`):** Prosa continua sin distracciones.
   - **Suite 2: Vista Paralela & Diff (`/bible/study/parallel`):** Comparación simultánea de versiones.
   - **Suite 3: Interlineal Inverso (`/bible/study/interlinear`):** Desglose morfológico palabra por palabra (BHS/NA28).
   - **Suite 4: Análisis de Palabra (`/bible/study/word-study`):** Léxicos Strong BDB/Thayer y ocurrencias canónicas.
   - **Suite 5: Contexto Histórico (`/bible/study/historical-context`):** Atlas Vectorial WGS84, Cronología Sincrónica y Arqueología.
   - **Suite 6: Evangelización y Apologética (`/bible/study/evangelism`):** Rutas bíblicas estructuradas (Camino de Romanos, Puente a la Vida), banco de objeciones apologéticas y tratados/bosquejos homiléticos listos para predicar.

### 2.2 Capas y Catálogo Feature-Sliced Design (FSD Canónico)
* **`providers/`**: `theme-provider.tsx` (next-themes encapsulado).
* **`shared/`**:
  * `context/`: `BiblePassageContext` (sincronización URL-Driven de pasaje y traducción).
  * `data/`: `canonData.ts` (fuente única de la verdad del canon, categorías y recuentos de capítulos).
  * `hooks/`: `useHeaderScrollBehavior`, `useBibleKeybindings`.
  * `seo/`: `BibleJsonLd` (esquema estructurado Schema.org).
  * `ui/`: `StudySidePanel` (componente compuesto: `.Toolbar`, `.Body`, `.Footer` con persistencia `storageKey` y `defaultWidth`), `ResizeBorderHandle` (física de arrastre y autocolapso magnético `<160px`), `BackToBibleButton`, `BackToPortalButton`, `BibleLogo`, `BibleSelect`, `DraggableEdgeTab`, `OngoingExpansionNotice`.
* **`entities/`**:
  * `books/` $\rightarrow$ `useBooks`, `UnifiedPassagePicker`, `getBookHistoricalInfo` (`GET /bible/books`).
  * `translations/` $\rightarrow$ `useTranslations`, `TranslationSelector` (`GET /bible/translations`).
* **`widgets/`**:
  * `bible-header/` $\rightarrow$ `BibleHeaderNav` (cabecera persistente con auto-hide y menú móvil).
  * `bible-sidebar/` $\rightarrow$ `BibleNavigationSidebar` (panel canónico de 66 libros y navegación por capítulos).
  * `bible-passage-toolbar/` $\rightarrow$ `BiblePassageToolbar` (barra de pasaje activo para estudios).
  * `exegesis-inspector/` $\rightarrow$ `BibleExegesisInspector`, `StrongMorphologyInspector`, `ParallelVerseInspector`, `BookHistoricalProfile`.
  * `landing/` $\rightarrow$ Las 9 secciones modulares de la Landing Page.
* **`features/`**:
  * `language-toggle/` $\rightarrow$ `LanguageToggle` (conmutador ES / EN).
  * `theme-toggle/` $\rightarrow$ `ThemeToggle` (conmutador claro / oscuro).
  * `verses/` $\rightarrow$ `useVerses` (`GET /bible/verses`), vistas continuas y línea por línea.
  * `parallel-view/` $\rightarrow$ Comparador multiversión y módulo interno `textual-diff` (LCS).
  * `interlinear/` $\rightarrow$ `interlinearApiService` (`GET /bible/morphology/passage`).
  * `lexicons/` $\rightarrow$ `lexiconApiService` (`GET /bible/morphology/lexicon`).
  * `atlas/` $\rightarrow$ `atlasApiService` (`GET /bible/historical/atlas/places`).
  * `timeline/` $\rightarrow$ `timelineApiService` (`GET /bible/historical/timeline`).
  * `archaeology-feed/` $\rightarrow$ `archaeologyApiService` (`GET /bible/historical/articles`).
  * `evangelism/` $\rightarrow$ `evangelismApiService` (`GET /bible/evangelism/*`).

---

## 3. Modelo de Datos y Marco Legal de Versiones

### 3.1 Catálogo Oficial Autorizado
* **Reina-Valera 1960 (`RV1960`):** Sociedades Bíblicas Unidas (Conectada vía `ApiBibleService` / fallback local).
* **Nueva Versión Internacional (`NVI`):** Bíblica, Inc. / Zondervan (Conectada vía API autorizada / fallback local).
* **Nueva Biblia de las Américas (`NBLA`):** The Lockman Foundation (Uso autorizado con nota formal de copyright).
* **Biblia Hebraica Stuttgartensia (`BHS`):** Westminster Leningrad Codex (Licencia Académica Abierta CC BY 4.0).
* **Septuaginta Griega (`LXX`):** Dominio Público Académico (Swete / Rahlfs).

### 3.2 Esquema Relacional de `bible.sqlite`
* `books` (id, name, abbreviation, order, testament) $\rightarrow$ Orden canónico ascendente (1 a 66).
* `translations` (id, name, abbreviation, language)
* `verses` (id, bookId, translationId, chapter, verseNumber, text) $\rightarrow$ Índice único compuesto en `(bookId, translationId, chapter, verseNumber)`.
* `morphology_tokens` (id, verseId, wordOrder, surfaceText, consonantsOnly, transliteration, strongCode, morphologyCode, gloss)
* `lexicon_entries` (id, strongCode, language, lemma, transliteration, ipa, partOfSpeech, shortDefinition, extendedDefinition)
* `historical_places` (id, name, originalName, coordinates, category, era, modernName, country, elevationMeters, description, biblicalReferences, archaeologicalNotes, language)
* `timeline_events` (id, name, type, originalName, startYearBC, endYearBC, kingdom, evaluation, dynastyOrOrigin, contemporaryEntities, biblicalReferences, keyEvents, details, language)
* `archaeology_articles` (id, title, slug, category, region, regionLabel, publishDate, institutionOrAuthor, readTimeMinutes, summary, contentMarkdown, biblicalReferences, epigraphy, museumOrLocation, keyArtifact, tags, language)
* `evangelism_pathways` (id, language, slug, title, subtitle, description, theologicalFocus, steps)
* `evangelism_objections` (id, language, category, question, summary, biblicalAnswer, keyVerses, practicalAdvice)
* `evangelism_tracts` (id, language, slug, title, targetAudience, summary, fullOutline, prayerOfFaith, nextSteps)


---

## 4. Comandos de Operación

```bash
# 1. Sembrado atómico y recreación limpia desde cero de bible.sqlite
pnpm --filter backend seed:bible

# 2. Iniciar cliente móvil Expo
pnpm --filter mobile start

# 3. Comprobación estricta de tipos
pnpm -r typecheck
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Modificar componentes web o pantallas de Expo ante errores 404 en rutas dinámicas (/archaeology/[slug], /evangelism/[slug], pasajes) | Asume un error de routing o cliente cuando la causa raíz suele ser la ausencia física de bible.sqlite o la falta de ejecución del seeder tras clonar el repo. | Verificar si bible.sqlite existe y sembrar con pnpm --filter backend seed:bible antes de modificar código frontend o móvil. |
| Hardcodear arrays de versículos, diccionarios o lugares en TypeScript | Aumenta el bundle size del cliente y rompe la fuente única de verdad con la app móvil. | Almacenar en backend/src/bible/corpus/ y sembrar en bible.sqlite. |
| Omitir el índice único compuesto en Verse o MorphologyToken | Permite insertar duplicados del mismo versículo o palabra. | Asegurar @Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true }). |
| Traer toda la Biblia o libros completos sin filtrar por capítulo | Bloquea el event loop de NestJS y satura el ancho de banda. | Filtrar siempre por libro (bookId) y capítulo (chapter). |
| Lanzar excepciones HTTP (NotFoundException) en controladores | Viola la separación de 3 capas al mezclar transporte HTTP con lógica de dominio. | Lanzar EntityNotFoundError en el servicio; el GlobalExceptionFilter lo mapeará a 404. |
| Encadenar múltiples .orWhere() con .andWhere() en TypeORM sin Brackets | El operador AND tiene mayor precedencia que OR, evaluando (A OR B OR (C AND D)) y corrompiendo los filtros. | Agrupar las condiciones disyuntivas con new Brackets((sub) => sub.where(...).orWhere(...)). |
| Consultar tablas bilingües sin fallback de idioma por defecto | Retorna registros duplicados en español e inglés simultáneamente si no se pasa ?lang=. | Aplicar const targetLang = lang?.trim() \|\| 'es' y filtrar por place.language = :lang. |
| Instalar librerías de Expo (expo-*) en frontend/web | Contamina el bundle web con módulos nativos incompatibles. | Usar pnpm --filter mobile add <paquete-expo>. |
| Inyectar repositorios sin 'bibleConnection' | Falla en runtime o consulta la base de datos equivocada. | Usar @InjectRepository(Verse, 'bibleConnection'). |
| Bandejas con falsa profundidad estilo iOS (cajas grises con pastillas blancas flotantes y sombras) | Contradice la filosofía Geist de Vercel y genera fatiga visual en pantallas de estudio editorial. | Aplicar Minimalismo Plano Geist (1 sola capa): pestañas al ras del header con línea inferior (border-b-2) y botones contiguos de 1px (divide-x). |
| Rodear controles secundarios con marcos o bordes permanentes ("Efecto Cajitas Enjauladas") | Sobrecarga la interfaz con ruido de líneas de 1px innecesarias y rompe la fluidez visual de la cabecera. | Emplear Ghost Controls (planos y transparentes en reposo con micro-hover sutil); reservar bordes únicamente para divisiones estructurales mayores (header border-b, paneles border-r/l, hoja editorial e inputs). |
| Fondos grises lavados o descoloridos (zinc-900/800) en modo oscuro ("Dark Fangoso") | Genera un contraste visualmente sucio, rompe la armonía estética y se aleja del estándar industrial de Vercel Dashboard. | Implementar el estándar **Vercel OLED Black puro**: lienzo base, cabecera y paneles laterales en `#000000` (`dark:bg-black`), divisiones arquitectónicas de 1px en `#222` (`dark:border-zinc-800/80`), tarjetas y hoja editorial de lectura en `#0a0a0a` (`dark:bg-[#0a0a0a]`), textos de lectura en `#ededed` / `#d4d4d8` y hover en `#111111` / `dark:hover:bg-zinc-900`. |
| Desparramar la lectura bíblica en anchos gigantescos ("Efecto Sábana" > 80 caracteres por línea) | Destruye la ergonomía de lectura, causa fatiga ocular e imposibilita el salto sacádico del ojo en pantallas panorámicas. | Aplicar contención tipográfica central `max-w-4xl mx-auto` (896px) en `VerseList.tsx`, garantizando la medida áurea de 70 a 80 caracteres por línea en prosa continua y versículo a versículo. |
| Forzar a todos los paneles laterales a un ancho rígido idéntico o acoplarlos entre sí | Rompe la adaptabilidad contextual (ej. un menú de libros se infla o una ficha compleja de morfología se corta) e impide evolucionar una herramienta individual. | Respetar la arquitectura desacoplada de paneles (`StudySidePanel`): cada módulo define su propio `defaultWidth` (280px-340px izquierda, 340px-360px derecha) y su propia clave de persistencia `storageKey`, permitiendo agrandar o modificar cualquier lateral individual sin efectos secundarios en los demás. |
| Crear paneles laterales ad-hoc o duplicar lógica de redimensión/drawers móviles en `features/*` o `widgets/*` | Genera inconsistencia visual en las suites, multiplica código muerto con cabeceras móviles repetidas y desborda el layout. | Consumir siempre el componente compuesto `StudySidePanel` (`.Toolbar`, `.Body`, `.Footer`) desde `shared/ui/StudySidePanel.tsx`, aprovechando su cabecera móvil automática, físicas de autocolapso magnético (< 160px) e independencia de ancho vía `storageKey`. |

---

## 6. Estándares de Ergonomía Espacial, Medida Tipográfica y Paneles Desacoplados

### 6.1 Calibración Dimensional del Canvas
* **Unificación de Cuadrícula Exterior y Centrado Geométrico Absoluto (`Grid Drift Zero`):** El elemento `<main>` en `layout.tsx` comparte el padding horizontal simétrico `px-3 sm:px-6 lg:px-8` con `BibleHeaderNav.tsx`. Además, en pantallas de escritorio (`lg:`), las 8 pestañas de navegación se anclan en el centro geométrico absoluto del monitor (`absolute left-1/2 -translate-x-1/2`), eliminando cualquier desviación provocada por la asimetría dimensional de los botones de los extremos (`Atrás/Logo` vs `Idioma/Tema`).
* **Escala por Naturaleza de Contenido:**
  * *Lectura Estándar (`/study/standard`):* `max-w-4xl mx-auto` (`896px` / 70–80ch).
  * *Cotejo Paralelo (`/study/parallel`):* Adaptativo dinámico según `columns.length` (`max-w-3xl`, `max-w-5xl`, `max-w-7xl`, `max-w-full`).
  * *Interlineal Inverso (`/study/interlinear`):* `max-w-5xl mx-auto` (`1024px`), eliminando el vacío asimétrico RTL en hebreo masorético.
  * *Diccionarios Léxicos y Arqueología (`/study/word-study`, `/study/archaeology`):* `max-w-6xl mx-auto` (`1152px`).
  * *Evangelismo y Apologética (`/study/evangelism`):* `max-w-5xl mx-auto` (`1024px`).
  * *Lienzos Cartográficos y Cronográficos (`/study/atlas`, `/study/timeline`):* Full Canvas `max-w-[1780px]`.

### 6.2 Desacoplamiento Total de Paneles Laterales
### 6.3 Gobernanza Adaptativa de Paneles (Tiradores Esbeltos en PC y Círculos en Móvil)
* **En Desktop (`>= lg`): Tiradores de Borde Verticales Esbeltos (1:3) y Cabecera Pura:** Cabecera superior 100% limpia para identidad y navegación macro entre suites. Los paneles laterales se despliegan mediante tiradores estilizados de tan solo 20px de saliente horizontal por 56px de alto (`w-5 h-14 rounded-r-md` / `rounded-l-md`, fondo 100% sólido opaco `bg-white dark:bg-[#121214]`) equipados con chevrons direccionales (`ChevronRight` a la izquierda y `ChevronLeft` a la derecha) con micro-animación en hover, complementados por los atajos de teclado (`[` y `]`).
* **En Móvil (`< lg`): Dos Círculos Ergonómicos con Iconografía Semántica Dinámica:** Dos botones circulares de 48px (`w-12 h-12 rounded-full`) anclados en la base (`bottom: 20px`), fondo 100% sólido opaco (`bg-white dark:bg-[#121214]` sin transparencias) con apertura táctil directa (`onClick={onOpen}`) e **iconografía semántica contextual por módulo** (Lector: `BookOpen` y `Languages`; Paralelo: `Columns3` y `GitCompare`; Interlineal: `Scroll` y `Languages`; Atlas: `Map` y `Compass`, etc.). Los paneles laterales y el backdrop operan mediante posicionamiento relativo al Workspace (`absolute inset-y-0`), confinándose bajo la barra superior (`BibleHeaderNav`, `h-14`, `z-50`) para que la cabecera (`Atrás | Logo | Modo | Idioma | Tema`) permanezca 100% visible, limpia y accesible sin ser tapada.

---


## 7. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se incorporen o modifiquen motores exegéticos, esquemas de morfología, fuentes en `corpus/`, endpoints REST, tablas en `bible.sqlite`, pantallas de Next.js o módulos de la app móvil Expo, es **obligatorio actualizar la documentación técnica correspondiente en `docs/04-bible/`**.
* **Gestión Documental Proactiva:** Se autoriza crear nuevos archivos `.md`, estructurar nuevas subcarpetas en `docs/04-bible/` o depurar especificaciones obsoletas, manteniendo siempre la precisión exegética, orden riguroso y exactitud arquitectónica.

---

## 8. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para reglas de monorepo, backend en 3 capas, FSD y pipeline CI/CD).

