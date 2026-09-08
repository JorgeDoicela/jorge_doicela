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
> * **Internacionalización Integral (i18n):** 100% de cobertura en `messages/es.json` y `messages/en.json` con `next-intl`. Todos los motores exegéticos (Interlineal Inverso, Quiasmos, Atlas, Cronología Sincrónica, Léxicos) consumen namespaces tipados sin cadenas hardcodeadas.
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
│   ├── BackToPortalButton.tsx # Retorno directo al portal principal (jorgedoicela.com / localhost)
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

### 4.1 Jerarquía de Resolución Inteligente y Persistencia de Traducción

Para garantizar una experiencia de usuario (UX) óptima tanto en primeros ingresos como en lectores frecuentes, la plataforma implementa una jerarquía de 3 niveles administrada en `BiblePassageContext` y `translationPreferences.ts`:

1. **Prioridad 1 (Parámetro URL `?trans=...`):** Soporte total de deep-linking para compartir pasajes en versiones específicas.
2. **Prioridad 2 (Persistencia `localStorage`):** Memoriza la última traducción utilizada por el usuario (`bible_last_translation_id` y por idioma `bible_last_translation_[es|en]`).
3. **Prioridad 3 (Default Contextual por Idioma / `next-intl`):**
   * Español (`es`): **Nueva Biblia de las Américas (`NBLA`, ID: 3)** por defecto.
   * Inglés (`en`): **New International Version (`NIV`, ID: 5)** por defecto.
   * Al alternar el idioma con el `LanguageToggle`, la plataforma conmuta dinámicamente a la versión correspondiente del nuevo idioma si la actual no pertenece a dicho idioma.

---

## 5. Internacionalización, SEO Dinámico y Dossier para IA (next-intl, Schema.org & GEO)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Metadata` en `(bible)/messages/es.json` y `(bible)/messages/en.json`, con tarjetas completas Open Graph y Twitter.
* **Cobertura Integral i18n (Cero Textos Hardcodeados):** Se auditaron y refactorizaron todos los componentes TSX de `(bible)` eliminando cualquier cadena o tooltip quemado en español. Cobertura completa y simétrica en `es.json` y `en.json`:
  * `ReadingView`: Avisos de copyright por versión, contadores analíticos, acciones de copiado y tooltips.
  * `Timeline`: Monarquías sincronizadas, evaluaciones teológicas, profetas contemporáneos, imperios mundiales e hitos fechados.
  * `Interlinear`: Tarjetas morfológicas Masoréticas y Koiné, badges lingüísticos (`hebrew`, `aramaic`, `greek`), tooltips de audio y parsing Robinson.
  * `ArchaeologyFeed`: Fichas epigráficas, catálogo de manuscritos, filtros temáticos/geográficos y modal de lectura completa.
  * `Atlas`: Itinerarios de peregrinación (Ruta del Éxodo, viajes paulinos), controles multimedia del reproductor, visor 3D arquitectónico (Tabernáculo, templos) y ficha arqueológica de lugares georreferenciados (`PlaceDetailsDrawer`).
  * `PassagePicker` y `BookSelector`: Catálogo bilingüe de los 66 libros canónicos, 9 categorías canónicas y placeholders.
* **Datos Estructurados Schema.org (`BibleJsonLd.tsx`):** Inyección de esquema `SoftwareApplication` y `Dataset` para el corpus bíblico y los 9 motores exegéticos en motores de búsqueda e IA.
* **Dossier Especializado para IA (`public/bible/llms.txt`):** Desglose detallado de los 9 motores exegéticos, textos Masorético BHS / Griego NA28 y léxicos servido en `bible.jorgedoicela.com/llms.txt`.
* **Manifiesto PWA Independiente (`public/bible/manifest.json`):** Configuración de aplicación web independiente con tema `#000000`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://bible.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(bible)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.
* **Navegación de Suites Bilingüe:** Textos de las 6 suites de estudio y menús de cabecera localizables vía diccionarios tipados.

---

## 6. Estética Visual, Ergonomía Editorial y Estilo Geist (Vercel Style & DIITRA)

* **Jerarquía y Contraste de Superficies (Layering Tri-Capa):**
  * **Capa 0 (Lienzo Global Base):** Fondo sutil `bg-zinc-50/60 dark:bg-black` que rompe el efecto de pared monocromática plana.
  * **Capa 1 (Paneles de Utilidad):** Sidebar izquierdo e Inspector derecho con `bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md` y bordes de delimitación `border-zinc-200/80 dark:border-zinc-800`.
  * **Capa 2 (Hoja Editorial Central):** El contenido de lectura bíblica (`ContinuousReadingView` y `LineByLineReadingView`) se eleva como un folio de lectura de alta gama (`bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 sm:p-12 lg:p-14`).
* **Tipografía y Prosa Editorial:**
  * Eliminación de sangría tosca (`indent-6`) en prosa continua a favor de espaciado inter-palabra natural con alineación balanceada (`text-justify sm:text-left`).
  * Números de versículos en tipografía mono de precisión (`font-mono text-[11px] font-bold text-zinc-400 dark:text-zinc-500`) integrados en línea para no deformar el ritmo de lectura.
* **Progressive Disclosure en Barra de Control (`ReaderToolbar.tsx`):**
  * Condensación de 11 controles ruidosos en 3 bloques equilibrados:
    * **Izquierda:** Pasaje canónico (`UnifiedPassagePicker`) y selector de versión (`TranslationSelector`).
    * **Centro / Derecha:** Segmented control Geist de modo (`Prosa` vs `Versículo`), Popover flotante Geist (`Aa`) que agrupa selección de familia tipográfica (`Serif` / `Sans`), escala de tamaño (`A-` a `A++`) y alternador de numeración (`123`).
    * **Extremo Derecho:** Botones discretos de copiado de capítulo e impresión a PDF.
* **Navegación Canónica y Chips Ergonómicos (`BibleNavigationSidebar.tsx`):**
  * Integración visual continua: en desktop (`lg:`), se eliminó la cabecera redundante con título y botón de cierre para evitar el efecto de "doble barra horizontal rota". El panel arranca directamente con su buscador y selector de testamentos al ras.
  * Segmented control Geist encapsulado para testamentos (`Todos | AT (39) | NT (27)`).
  * Buscador rápido con bordes suaves `rounded-xl` y padding ergonómico.
  * Cuadrícula de capítulos con chips circulares/redondeados suaves (`w-8 h-8 rounded-lg text-xs font-mono font-medium border border-zinc-200/80 dark:border-zinc-700/80`) inspirados en el diseño de componentes de DIITRA.
  * En móviles (`< lg`), se proyecta como Drawer con cabecera dedicada, cortina oscura y auto-cierre al seleccionar capítulo.
* **Inspector Exegético Desacoplado (`BibleExegesisInspector.tsx`):**
  * En desktop (`lg:`), inicia de inmediato con sus pestañas en segmented control Geist (`Morfología Strong` y `Versiones Sinópticas`), eliminando barras de título duplicadas.
  * Estados vacíos minimalistas sin cajas punteadas sobredimensionadas, con iconografía circular en reposo.
  * Componentes internos puros y desacoplados (`StrongMorphologyInspector` y `ParallelVerseInspector`).
* **Barra de Navegación de Suites Geist Pura (`BibleHeaderNav.tsx`):**
  * Supresión definitiva de puntos circulares de colores en las pestañas de suites.
  * Estilo tipográfico monocromático Geist idéntico a Vercel Dashboard, con cápsula activa sobria (`bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs`) y botones de panel unificados (`PanelLeft` y `PanelRight`).

---

## 7. Refinamientos de Alta Precisión Exegética

### 7.1 Atajos de Teclado Profesionales (*Power-User Keybindings*)
Integrado a través del hook [`useBibleKeybindings.ts`](../../../frontend/web/src/app/(bible)/hooks/useBibleKeybindings.ts) y activo en todas las suites de estudio:
* `[` $\rightarrow$ Alternar panel de navegación canónica izquierdo (`toggleLeftSidebar`).
* `]` $\rightarrow$ Alternar inspector exegético derecho (`toggleRightInspector`).
* `←` / `→` $\rightarrow$ Navegación rápida al capítulo anterior / siguiente (`prevChapter` / `nextChapter`).
* `Escape` $\rightarrow$ Cerrar el inspector exegético o deseleccionar texto.
* *Aislamiento de Inputs:* Los atajos de navegación y paneles se desactivan automáticamente cuando el foco está sobre elementos de texto (`input`, `textarea`, `select`, `isContentEditable`) para permitir escribir normalmente en los buscadores.

### 7.2 Barra de Lectura Sticky Flotante (`ReaderToolbar.tsx`)
* Anclaje permanente `sticky top-14 z-30` con fondo `bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md` y borde sutil.
* Popover `Aa` desacoplado con cierre automático en click exterior (`useRef` y evento `mousedown`).

### 7.3 Modo Impresión y Exportación Limpia (*Print / Pulpit Mode*)
* Reglas dedicadas `@media print` en [`globals.css`](../../../frontend/web/src/app/(bible)/globals.css) y etiquetas `print:hidden`:
  * Ocultamiento automático de barras de navegación superior, paneles laterales, toolbars, botones de interacción y footers.
  * Supresión de bordes, sombras y márgenes innecesarios (`print-clean`).
  * Protección contra saltos de página partidos en versículos (`page-break-inside: avoid`).
  * Botón directo de **Imprimir / Exportar a PDF** en [`ReaderToolbar.tsx`](../../../frontend/web/src/app/(bible)/features/verses/components/reader-toolbar/ReaderToolbar.tsx).

### 7.4 Botones Flotantes con Auto-Snap a Bordes estilo Messenger (`DraggableEdgeTab.tsx`)
* **Auto-Snap Obligatorio al Borde:** Los botones emergen cuando los paneles están cerrados. Mientras se arrastran flotan libremente, pero al soltarlos (`pointerup`), se acoplan automáticamente contra el borde correspondiente (`left: 0` para el panel izquierdo, `right: 0` para el inspector derecho). Esto garantiza que nunca se queden flotando sobre los selectores de pasaje ni tapen el texto bíblico.
* **Restricción de Desplazamiento (Máximo 25% de Pantalla):** El botón izquierdo no puede ser arrastrado más allá del 25% del ancho de la pantalla hacia el centro, y el botón derecho no puede sobrepasar el 75%, blindando el área central de lectura contra cualquier obstrucción.
* **Geometría Adaptativa:** En reposo se presentan como pestañas acopladas al marco (`rounded-r-2xl` a la izquierda, `rounded-l-2xl` a la derecha, `w-11 h-12`), y durante el arrastre se transforman con fluidez en squircles flotantes (`rounded-2xl`, elevación `shadow-2xl` y micro-escala).
* **Persistencia Vertical:** Memoriza la altura exacta (`top`) en `localStorage` (`bible_drag_tab_left_y` y `bible_drag_tab_right_y`).

### 7.5 Aprovechamiento Integral del Ancho de Pantalla (*Full-Width Canvas*)
* **Eliminación de Restricciones Artificiales:** Se retiraron las limitaciones rígidas (`max-w-4xl`, `max-w-5xl` y `max-w-7xl`) tanto en el Lector Estándar (`VerseList`, `ContinuousReadingView`, `LineByLineReadingView`) como en la Landing Page principal (`/bible` - `bible/page.tsx`).
* **Equidad Visual con Suites Exegéticas:** Tanto la vitrina del Live Preview como las suites de estudio aprovechan el lienzo de trabajo en monitores anchos (`w-full px-4 sm:px-6 lg:px-8 max-w-[1700px]`), ofreciendo una experiencia editorial inmersiva sin sensación de caja encogida en pantallas ultra-amplias.

### 7.6 Flujo Natural de la Barra y Visibilidad Editorial del Título
* **Flujo Natural sin Colisiones:** Se removió la fijación `sticky` de `ReaderToolbar.tsx`, unificándolo con el patrón del resto de suites (`ParallelStudyPage`, `InterlinearStudyPage`). La barra de herramientas fluye armónicamente con el contenido, eliminando para siempre las colisiones donde la barra flotaba por encima del título del libro ("Génesis") al desplazarse.
* **Alineación Superior al Ras (`pt-0`):** Se eliminó el padding superior del contenedor principal (`pt-0`) y se acortó el espaciado vertical (`space-y-2`), situando la barra de herramientas directamente debajo de la cabecera sin holguras vacías.
* **Presencia Editorial del Capítulo:** Con `pt-8` y `pb-6 mb-6`, el título del libro y el capítulo destacan con elegancia editorial completa y nunca son ocluidos ni cortados.
