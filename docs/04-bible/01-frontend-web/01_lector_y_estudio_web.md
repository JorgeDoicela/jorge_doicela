# Biblia Modular - Lector y Suite de Estudio Web (Next.js)

Este documento detalla la arquitectura macro y micro, herramientas exegéticas y componentes del subdominio de la Biblia (`bible.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Subdominio:** `bible.jorgedoicela.com` (o `http://bible.localhost:3001` en local).
> * **Enrutamiento:** `src/middleware.ts` reescribe el host hacia el grupo de rutas `frontend/web/src/app/(bible)/`.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`) para respetar la memoria de **1 GB de RAM** del VPS.
> * **Aislamiento de Dominio:** Cero dependencias de otros subdominios. Estilos aislados en `(bible)/globals.css`.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD):** Cada una de las 12 herramientas exegéticas está encapsulada en su propia subcarpeta funcional dentro de `(bible)/features/` (`verses`, `books`, `translations`, `interlinear`, `parallel-view`, `grammar-search`, `atlas`, `timeline`, `archaeology-feed`, etc.).
> * **Cero Datos Hardcodeados en Cliente:** Ningún archivo TypeScript contiene versículos, palabras, coordenadas ni textos bíblicos incrustados. Toda la data se consume asíncronamente desde los endpoints de NestJS (`GET /bible/*`).
> * **Header Unificado y Responsivo:** `BibleHeaderNav.tsx` con pestañas en escritorio y menú desplegable flotante de 6 suites en pantallas móviles (`< md`).
> * **Barra de Control Exegético:** `ReaderToolbar.tsx` agrupa pasaje (`UnifiedPassagePicker`), versión bíblica (`TranslationSelector`) y controles de tipografía/diseño (`ReaderLayoutMode`, `ReaderFontSize`, `ReaderFontFamily`) de forma 100% responsiva.
> * **Estética Geist / Vercel Style:** Monocromática de alta precisión, micro-interacciones de alta densidad, bordes ultra-delgados (`border-zinc-800`), tipografía Geist y legibilidad editorial para análisis exegético.

---

## 2. Estructura de Rutas y Navegación URL-Driven

El subdominio cuenta con una Landing Page y 6 suites de estudio con enrutamiento dedicado y layout persistente:

```text
frontend/web/src/app/(bible)/
├── globals.css                # Estilos aislados de la biblia (Geist / Vercel Style)
├── layout.tsx                 # Layout raíz del subdominio
│
├── bible/                     # ENRUTAMIENTO (App Router)
│   ├── page.tsx               # Landing Page de presentación y Live Preview
│   └── study/
│       ├── layout.tsx         # Layout compartido: BiblePassageProvider + BibleHeaderNav persistente
│       ├── page.tsx           # Redirección por defecto a /study/standard
│       ├── standard/page.tsx  # Suite 1: Lectura Editorial Continua
│       ├── parallel/page.tsx  # Suite 2: Comparador Multi-Versión & Diff Textual
│       ├── interlinear/page.tsx # Suite 3: Interlineal Inverso (Hebreo BHS / Griego NA28)
│       ├── word-study/page.tsx # Suite 4: Análisis de Palabra (Léxicos Strong + Morfología)
│       ├── literary/page.tsx  # Suite 5: Estructura, Quiasmos y Discurso Paulino
│       └── historical-context/page.tsx # Suite 6: Atlas Vectorial, Cronología y Arqueología
│
├── context/                   # GESTIÓN DE ESTADO REACTIVO Y URL PARAMS
│   └── BiblePassageContext.tsx # Sincroniza bookId, chapter y trans con la URL (?book=GEN&chapter=1)
│
├── components/                # COMPONENTES Y WIDGETS TRANSVERSALES
│   ├── BibleHeaderNav.tsx     # Header con selector de suites móvil flotante y desktop
│   ├── WordStudyView.tsx      # Orquestador con subtabs de Léxicos y Morfología
│   └── HistoricalContextView.tsx # Orquestador con subtabs de Atlas, Cronología y Arqueología
│
└── features/                  # FEATURE-SLICED DESIGN (FSD) CON SERVICIOS API
    ├── verses/                # services/ + hooks/useVerses (API /bible/verses)
    ├── books/                 # data/canonicCategories + hooks/useBooks (API /bible/books)
    ├── translations/          # hooks/useTranslations (API /bible/translations)
    ├── parallel-view/         # Comparador multi-columna alineado por versículo
    ├── textual-diff/          # Algoritmo LCS para resaltar variantes textuales
    ├── interlinear/           # services/interlinearApiService (API /bible/morphology/passage)
    ├── literary-analysis/     # Quiasmos y paralelismos estructurados
    ├── lexicons/              # services/lexiconApiService (API /bible/morphology/lexicon)
    ├── grammar-search/        # services/grammarSearchApiService (API /bible/morphology/tokens/search)
    ├── atlas/                 # services/atlasApiService (API /bible/historical/atlas/places)
    ├── timeline/              # services/timelineApiService (API /bible/historical/timeline)
    └── archaeology-feed/      # services/archaeologyApiService (API /bible/historical/articles)
```

---

## 3. Los 9 Motores de Estudio Exegético y Clientes API

1. **Lectura Continua (`features/verses/`):** Consume `GET /bible/verses?bookId=&chapter=&translationId=`. Incluye notas de atribución legal de copyright oficiales al pie de cada capítulo.
2. **Vista Paralela (`features/parallel-view/`):** Comparación simultánea de 2 a 4 versiones sincronizadas por capítulo (`RV1960`, `NVI`, `NBLA`, `BHS`, `LXX`).
3. **Diff Textual (`features/textual-diff/`):** Algoritmo de Diferencia de Texto para resaltar adiciones, omisiones y divergencias de traducción.
4. **Interlineal Inverso (`features/interlinear/`):** Consume `GET /bible/morphology/passage`. Integra lectura corrida en español limpia omitiendo etiquetas técnicas de partículas intransferibles (`אֵת` Strong H853) en el texto superior, manteniendo la tarjeta morfológica interactiva en el desglose masorético inferior.
5. **Estudio de Palabra / Léxicos (`features/lexicons/`):** Consume `GET /bible/morphology/lexicon`. Diccionarios académicos BDB / Gesenius para raíces hebreas y léxico griego.
6. **Búsqueda Gramatical y Sintáctica (`features/grammar-search/`):** Consume `GET /bible/morphology/tokens/search`. Filtra por lema consonántico, código Strong y categoría morfológica.
7. **Estructuras Literarias y Quiasmos (`features/literary-analysis/`):** Diagramación concéntrica de pasajes simétricos (Hexamerón de Génesis 1:1 - 2:3, discurso paulino de Romanos 8).
8. **Atlas Bíblico Georreferenciado (`features/atlas/`):** Consume `GET /bible/historical/atlas/places`. Coordenadas WGS84 proyectadas sobre canvas vectorial con filtro por épocas.
9. **Cronología y Arqueología (`features/timeline/` y `features/archaeology-feed/`):** Consume `/bible/historical/timeline` y `/bible/historical/articles`.

---

## 4. Marco Legal de Versiones y Atribución de Copyright

El catálogo oficial de traducciones opera bajo estricto cumplimiento de derechos de autor y licencias autorizadas:

| Traducción | Abreviación | Titular de Derechos | Modo de Integración |
|---|---|---|---|
| **Reina-Valera 1960** | `RV1960` | Sociedades Bíblicas Unidas (SBU) | Conexión autorizada vía adaptador `ApiBibleService` / fallback local. |
| **Nueva Versión Internacional** | `NVI` | Bíblica, Inc. / Zondervan | Conexión autorizada API.Bible / fallback local. |
| **Nueva Biblia de las Américas** | `NBLA` | The Lockman Foundation | Conexión autorizada en API.Bible / fallback local. |
| **Nueva Traducción Viviente** | `NTV` | Tyndale House Foundation | Conexión autorizada en API.Bible / fallback local. |
| **Biblia Hebraica Stuttgartensia** | `BHS` | Groves Center / Open Scriptures | Licencia Académica Abierta CC BY 4.0. |
| **Septuaginta Griega** | `LXX` | Dominio Público | Dominio Público Académico (Swete / Rahlfs). |

---

## 5. Internacionalización y SEO Dinámico (next-intl)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Bible.Metadata` en `src/messages/es.json` y `src/messages/en.json`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://bible.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(bible)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.
* **Navegación de Suites Bilingüe:** Textos de las 6 suites de estudio y menús de cabecera localizables vía diccionarios tipados.

---

## 6. Estética Visual y Geist (Vercel Style)

* **Monocromía de Alta Precisión:** Fondos oscuros de escala de grises zinc/neutral (`#000000`, `#09090b`, `#18181b`) con bordes ultra-delgados de 1px.
* **Tipografía Geist:** Familia tipográfica Geist Sans y Geist Mono para una legibilidad óptima en lectura densa de textos bíblicos, aparatos críticos y léxicos.
* **Componentes de Alta Densidad:** Pestañas compactas, botones mínimos, chips de libro y capítulo optimizados para el flujo de estudio exegético.
* **Modo Oscuro / Claro Nativo:** Transiciones de contraste limpias respetando la jerarquía tipográfica sin distracciones visuales.

