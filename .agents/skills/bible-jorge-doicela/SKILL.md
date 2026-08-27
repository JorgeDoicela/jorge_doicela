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
   - **Suite 4: Análisis de Palabra (`/bible/study/word-study`):** Léxicos Strong BDB/Thayer y Búsqueda Gramatical.
   - **Suite 5: Análisis Literario (`/bible/study/literary`):** Quiasmos, paralelismos y discurso paulino.
   - **Suite 6: Contexto Histórico (`/bible/study/historical-context`):** Atlas Vectorial WGS84, Cronología Sincrónica y Arqueología.

### 2.2 Catálogo de Features y Clientes API (`(bible)/features/`)
* `verses` $\rightarrow$ `useVerses` (`GET /bible/verses`)
* `books` $\rightarrow$ `useBooks`, `canonicCategories` (`GET /bible/books`)
* `translations` $\rightarrow$ `useTranslations` (`GET /bible/translations`)
* `interlinear` $\rightarrow$ `interlinearApiService` (`GET /bible/morphology/passage`)
* `lexicons` $\rightarrow$ `lexiconApiService` (`GET /bible/morphology/lexicon`)
* `grammar-search` $\rightarrow$ `grammarSearchApiService` (`GET /bible/morphology/tokens/search`)
* `atlas` $\rightarrow$ `atlasApiService` (`GET /bible/historical/atlas/places`)
* `timeline` $\rightarrow$ `timelineApiService` (`GET /bible/historical/timeline`)
* `archaeology-feed` $\rightarrow$ `archaeologyApiService` (`GET /bible/historical/articles`)

---

## 3. Modelo de Datos y Marco Legal de Versiones

### 3.1 Catálogo Oficial Autorizado
* **Reina-Valera 1960 (`RV1960`):** Sociedades Bíblicas Unidas (Conectada vía `ApiBibleService` / fallback local).
* **Nueva Versión Internacional (`NVI`):** Bíblica, Inc. / Zondervan (Conectada vía API autorizada / fallback local).
* **Nueva Biblia de las Américas (`NBLA`):** The Lockman Foundation (Uso autorizado con nota formal de copyright).
* **Biblia Hebraica Stuttgartensia (`BHS`):** Westminster Leningrad Codex (Licencia Académica Abierta CC BY 4.0).
* **Septuaginta Griega (`LXX`):** Dominio Público Académico (Swete / Rahlfs).

### 3.2 Esquema Relacional de `bible.sqlite`
* `books` (id, name, abbreviation, testament)
* `translations` (id, name, abbreviation, language)
* `verses` (id, bookId, translationId, chapter, verseNumber, text) $\rightarrow$ Índice único compuesto en `(bookId, translationId, chapter, verseNumber)`.
* `morphology_tokens` (id, verseId, wordOrder, surfaceText, consonantsOnly, transliteration, strongCode, morphologyCode, gloss)
* `lexicon_entries` (id, strongCode, language, lemma, transliteration, ipa, partOfSpeech, shortDefinition, extendedDefinition)
* `historical_places` (id, name, originalName, coordinates, category, era, modernName, country, elevationMeters, description, biblicalReferences, archaeologicalNotes)
* `timeline_events` (id, name, type, originalName, startYearBC, endYearBC, kingdom, evaluation, dynastyOrOrigin, contemporaryEntities, biblicalReferences, keyEvents, details)
* `archaeology_articles` (id, title, slug, category, region, regionLabel, publishDate, institutionOrAuthor, readTimeMinutes, summary, contentMarkdown, biblicalReferences, epigraphy, museumOrLocation, keyArtifact, tags)

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
| Hardcodear arrays de versículos, diccionarios o lugares en TypeScript | Aumenta el bundle size del cliente y rompe la fuente única de verdad con la app móvil. | Almacenar en backend/src/bible/corpus/ y sembrar en bible.sqlite. |
| Omitir el índice único compuesto en Verse o MorphologyToken | Permite insertar duplicados del mismo versículo o palabra. | Asegurar @Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true }). |
| Traer toda la Biblia o libros completos sin filtrar por capítulo | Bloquea el event loop de NestJS y satura el ancho de banda. | Filtrar siempre por libro (bookId) y capítulo (chapter). |
| Instalar librerías de Expo (expo-*) en frontend/web | Contamina el bundle web con módulos nativos incompatibles. | Usar pnpm --filter mobile add <paquete-expo>. |
| Inyectar repositorios sin 'bibleConnection' | Falla en runtime o consulta la base de datos equivocada. | Usar @InjectRepository(Verse, 'bibleConnection'). |

---

## 6. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se incorporen o modifiquen motores exegéticos, esquemas de morfología, fuentes en `corpus/`, endpoints REST, tablas en `bible.sqlite`, pantallas de Next.js o módulos de la app móvil Expo, es **obligatorio actualizar la documentación técnica correspondiente en `docs/04-bible/`**.
* **Gestión Documental Proactiva:** Se autoriza crear nuevos archivos `.md`, estructurar nuevas subcarpetas en `docs/04-bible/` o depurar especificaciones obsoletas, manteniendo siempre la precisión exegética, orden riguroso y exactitud arquitectónica.

---

## 7. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para reglas de monorepo, backend en 3 capas, FSD y pipeline CI/CD).

