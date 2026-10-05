---
name: kartex-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de KARTEX (kartex.jorgedoicela.com), incluyendo el frontend web Next.js (estilo Geist / Vercel Style, FSD), la app móvil nativa en Expo (frontend/mobile), el backend en NestJS, los 9 módulos de estudio exegético, la morfología Strong, el contexto histórico y la persistencia escalable en kartex.sqlite.
---
# Directrices de Desarrollo: KARTEX (kartex.jorgedoicela.com)

Esta habilidad define los estándares técnicos, el modelo de datos relacional, la arquitectura web (Next.js 16), la app móvil (Expo) y la estrategia de persistencia y escalabilidad para la plataforma KARTEX (Biblical Research & Study Platform).

---

## Documentación Técnica Oficial
* [01_lector_y_estudio_web.md](../../../docs/04-kartex/01-frontend-web/01_lector_y_estudio_web.md)
* [02_backend_y_morfologia.md](../../../docs/04-kartex/02-backend/01_backend_y_morfologia.md)
* [03_base_datos_y_seeder.md](../../../docs/04-kartex/03-base-de-datos/01_base_datos_y_seeder.md)
* [04_app_movil_expo.md](../../../docs/04-kartex/04-mobile-expo/01_app_movil_expo.md)
* [01_roadmap_kartex.md](../../../docs/04-kartex/05-roadmap/01_roadmap_kartex.md)
* [01_marco_legal_fuentes_y_api.md](../../../docs/04-kartex/06-marco-legal-y-fuentes/01_marco_legal_fuentes_y_api.md)

---

## 1. Arquitectura y Aislamiento (Principio de Cajas Negras)

* **Subdominio Web:** `kartex.jorgedoicela.com` (en desarrollo: `kartex.localhost:3001` o subruta `/kartex`).
* **App Móvil:** `frontend/mobile/` (React Native / Expo SDK 52+).
* **Frontend Web:** Grupo de rutas `frontend/web/src/app/(kartex)/`.
* **Backend:** Módulo aislado `backend/src/kartex/`.
* **Persistencia:** Base de datos SQLite física independiente `kartex.sqlite` conectada mediante `'kartexConnection'` en TypeORM.
* **Cero Datos Hardcodeados en TypeScript:** Ningún archivo `.ts` o `.tsx` en el frontend contiene versículos, palabras, coordenadas geográficas ni artículos incrustados. Toda la data reside en archivos `.json` bajo `backend/src/kartex/corpus/` y se consulta asíncronamente desde los endpoints de NestJS.
* **Aislamiento de Estilos y Tipografías Exegéticas Locales:** Utiliza exclusivamente su propio archivo `(kartex)/globals.css` (estética **Geist / Vercel Style** monocromática de precisión, micro-interacciones de alta densidad y bordes ultra-delgados) y su suite completa de 6 tipografías locales bajo `(kartex)/fonts/` con licencia **SIL OFL 1.1**:
  - `Geist-Variable.woff2` (`--font-geist-sans`): UI Chrome y navegación.
  - `GeistMono-Variable.woff2` (`--font-geist-mono`): Códigos Strong y metadatos léxicos.
  - `Lora-Variable.ttf` y `Lora-Italic-Variable.ttf` (`--font-lora`): Lectura continua editorial y devocional.
  - `FrankRuhlLibre-Variable.ttf` (`--font-hebrew`): Hebreo y Arameo bíblico con soporte tipográfico completo de puntos vocálicos masoréticos (*niqud*).
  - `Cardo-Regular.ttf` (`--font-greek`): Griego Koiné politónico con acentos, espíritus y ligaduras clásicas (Septuaginta y Nuevo Testamento).
  - **Zero-External Network Fonts:** Prohibido depender de fuentes del sistema operativo del cliente o de Google Fonts/CDNs.
* **Internacionalización y SEO (next-intl):** Diccionarios encapsulados en `(kartex)/messages/es.json` y `en.json`. Layout raíz `(kartex)/layout.tsx` integrado con `NextIntlClientProvider` y `generateMetadata()` dinámico con etiquetas `hreflang`. Soporte de base de datos bilingüe (`language: 'es' | 'en'`) en tablas explicativas (`archaeology_articles`, `timeline_events`, `historical_places`).
* **Datos Estructurados Schema.org (`KartexJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `Dataset` para el corpus de investigación y los 9 módulos de Kartex ante buscadores web e IA.
* **Sincronización con IA:** Cuando se agreguen nuevos módulos o traducciones oficiales, reflejarlos en `public/kartex/llms.txt` y en `public/landing/llms.txt`.

---

## 2. Frontend Web: Enrutamiento y Feature-Sliced Design (FSD)

### 2.1 Enrutamiento
1. **Landing Page (`/kartex` - `kartex/page.tsx`):**
   - Presentación general de la plataforma y corpus textual.
   - Live Preview interactivo con comparación de textos (Salmos 23 en RV1960 vs BHS Hebreo).
   - Vitrina de los 9 módulos de Kartex con iconos SVG.
2. **Espacio de Estudio e Investigación:**
   - Header unificado persistente (`KartexHeaderNav.tsx`) con navegación macro en desktop y menú móvil.
   - Barra de control exegético integrada (`KartexPassageToolbar.tsx`).
   - **Módulo 1: Kartex Lector (`/kartex/reader`):** Prosa continua y versículo a versículo sin distracciones.
   - **Módulo 2: Kartex Paralelo (`/kartex/parallel`):** Comparación simultánea de 2 a 4 versiones con herramienta de diff textual (LCS).
   - **Módulo 3: Kartex Interlineal (`/kartex/interlinear`):** Desglose morfológico palabra por palabra (BHS/NA28) con lematización y Strong.
   - **Módulo 4: Kartex Lexicón (`/kartex/lexicon`):** Léxicos Strong BDB/Thayer/Gesenius y ocurrencias canónicas.
   - **Módulo 5: Kartex Atlas (`/kartex/atlas`):** Atlas Georreferenciado WGS84 con canvas vectorial y filtro por épocas.
   - **Módulo 6: Kartex Cronología (`/kartex/timeline`):** Cronología sincrónica de reyes de Judá/Israel e imperios coetáneos.
   - **Módulo 7: Kartex Arqueología (`/kartex/archaeology`):** Catálogo de evidencia material y epigráfica con fichas históricas.
   - **Módulo 8: Kartex Evangelismo (`/kartex/evangelism`):** Rutas bíblicas estructuradas, banco apologético y tratados.
   - **Módulo 9: Kartex Exégesis (`/kartex/exegesis`):** Espacio integrador de análisis exegético profundo.

### 2.2 Capas y Catálogo Feature-Sliced Design (FSD Canónico)
* **`providers/`**: `theme-provider.tsx` (next-themes encapsulado).
* **`shared/`**:
   * `context/`: `KartexPassageContext` (sincronización URL-Driven de pasaje y traducción).
   * `data/`: `canonData.ts` (fuente única de la verdad del canon, categorías y recuentos de capítulos).
   * `hooks/`: `useHeaderScrollBehavior`, `useKartexKeybindings`.
   * `seo/`: `KartexJsonLd` (esquema estructurado Schema.org).
   * `ui/`: `StudySidePanel` (componente compuesto: `.Toolbar`, `.Body`, `.Footer` con persistencia `storageKey` y `defaultWidth`), `ResizeBorderHandle` (física de arrastre y autocolapso magnético `<160px`), `BackToKartexButton`, `BackToPortalButton`, `KartexLogo`, `KartexSelect`, `DraggableEdgeTab`, `OngoingExpansionNotice`.
* **`entities/`**:
   * `books/` $\rightarrow$ `useBooks`, `UnifiedPassagePicker`, `getBookHistoricalInfo` (`GET /kartex/books`).
   * `translations/` $\rightarrow$ `useTranslations`, `TranslationSelector` (`GET /kartex/translations`).
* **`widgets/`**:
   * `kartex-header/` $\rightarrow$ `KartexHeaderNav` (cabecera persistente con auto-hide y menú móvil).
   * `kartex-sidebar/` $\rightarrow$ `KartexNavigationSidebar` (panel canónico de 66 libros y navegación por capítulos).
   * `kartex-passage-toolbar/` $\rightarrow$ `KartexPassageToolbar` (barra de pasaje activo para estudios).
   * `exegesis-inspector/` $\rightarrow$ `KartexExegesisInspector`, `StrongMorphologyInspector`, `ParallelVerseInspector`, `BookHistoricalProfile`.
   * `landing/` $\rightarrow$ Las 9 secciones modulares de la Landing Page de Kartex.
* **`features/`**:
   * `language-toggle/` $\rightarrow$ `LanguageToggle` (conmutador ES / EN).
   * `theme-toggle/` $\rightarrow$ `ThemeToggle` (conmutador claro / oscuro).
   * `verses/` $\rightarrow$ `useVerses` (`GET /kartex/verses`), vistas continuas y línea por línea.
   * `parallel-view/` $\rightarrow$ Comparador multiversión y módulo interno `textual-diff` (LCS).
   * `interlinear/` $\rightarrow$ `interlinearApiService` (`GET /kartex/morphology/passage`).
   * `lexicons/` $\rightarrow$ `lexiconApiService` (`GET /kartex/morphology/lexicon`).
   * `atlas/` $\rightarrow$ `atlasApiService` (`GET /kartex/historical/atlas/places`).
   * `timeline/` $\rightarrow$ `timelineApiService` (`GET /kartex/historical/timeline`).
   * `archaeology-feed/` $\rightarrow$ `archaeologyApiService` (`GET /kartex/historical/articles`).
   * `evangelism/` $\rightarrow$ `evangelismApiService` (`GET /kartex/evangelism/*`).

---

## 3. Modelo de Datos y Marco Legal de Versiones

### 3.1 Catálogo Oficial Autorizado
* **Reina-Valera 1960 (`RV1960`):** Sociedades Bíblicas Unidas (Conectada vía `ApiBibleService` / fallback local).
* **Nueva Versión Internacional (`NVI`):** Bíblica, Inc. / Zondervan (Conectada vía API autorizada / fallback local).
* **Nueva Biblia de las Américas (`NBLA`):** The Lockman Foundation (Uso autorizado con nota formal de copyright).
* **Biblia Hebraica Stuttgartensia (`BHS`):** Westminster Leningrad Codex (Licencia Académica Abierta CC BY 4.0).
* **Septuaginta Griega (`LXX`):** Dominio Público Académico (Swete / Rahlfs).

### 3.2 Esquema Relacional de `kartex.sqlite`
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
# 1. Sembrado atómico y recreación limpia desde cero de kartex.sqlite
pnpm --filter backend seed:kartex

# 2. Iniciar cliente móvil Expo
pnpm --filter mobile start

# 3. Comprobación estricta de tipos
pnpm -r typecheck
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Modificar componentes web o pantallas de Expo ante errores 404 en rutas dinámicas | Asume un error de routing cuando la causa raíz suele ser la ausencia física de kartex.sqlite o la falta de seeder. | Verificar si kartex.sqlite existe y sembrar con pnpm --filter backend seed:kartex antes de modificar código. |
| Hardcodear arrays de versículos, diccionarios o lugares en TypeScript | Aumenta el bundle size del cliente y rompe la fuente única de verdad. | Almacenar en backend/src/kartex/corpus/ y sembrar en kartex.sqlite. |
| Omitir el índice único compuesto en Verse o MorphologyToken | Permite insertar duplicados del mismo versículo o palabra. | Asegurar @Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true }). |
| Traer toda la Biblia o libros completos sin filtrar por capítulo | Bloquea el event loop de NestJS y satura el ancho de banda. | Filtrar siempre por libro (bookId) y capítulo (chapter). |
| Lanzar excepciones HTTP (NotFoundException) en controladores | Viola la separación de 3 capas al mezclar transporte HTTP con lógica de dominio. | Lanzar EntityNotFoundError en el servicio; el GlobalExceptionFilter lo mapeará a 404. |
| Encadenar múltiples .orWhere() con .andWhere() en TypeORM sin Brackets | El operador AND tiene mayor precedencia que OR, evaluando erróneamente las condiciones. | Agrupar las condiciones disyuntivas con new Brackets((sub) => sub.where(...).orWhere(...)). |
| Inyectar repositorios sin 'kartexConnection' | Falla en runtime o consulta la base de datos equivocada. | Usar @InjectRepository(Verse, 'kartexConnection'). |

---

## 6. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se incorporen o modifiquen módulos, endpoints REST, tablas en `kartex.sqlite`, pantallas de Next.js o módulos de la app móvil Expo, es **obligatorio actualizar la documentación técnica correspondiente en `docs/04-kartex/`**.
* **Gestión Documental Proactiva:** Se autoriza crear nuevos archivos `.md`, estructurar nuevas subcarpetas en `docs/04-kartex/` o depurar especificaciones obsoletas, manteniendo siempre la precisión exegética, orden riguroso y exactitud arquitectónica.

---

## 7. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para reglas de monorepo, backend en 3 capas, FSD y pipeline CI/CD).
