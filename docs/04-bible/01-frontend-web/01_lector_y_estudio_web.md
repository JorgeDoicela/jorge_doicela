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
│   ├── page.tsx               # Landing Page de presentación y Live Preview interactivo
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
│   ├── BackToBibleButton.tsx  # Retorno directo al inicio de la Biblia (bible.localhost:3001 / bible.jorgedoicela.com o /bible)
│   ├── BackToPortalButton.tsx # Retorno directo al portal principal (jorgedoicela.com / localhost) desde la landing
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
    ├── literary-analysis/     # services/literaryApiService (API /bible/literary/chiasms & /bible/literary/pauline)
    ├── lexicons/              # services/lexiconApiService (API /bible/morphology/lexicon)
    ├── grammar-search/        # services/grammarSearchApiService (API /bible/morphology/tokens/search)
    ├── atlas/                 # services/atlasApiService (API /bible/historical/atlas/places con ?lang=)
    ├── timeline/              # services/timelineApiService (API /bible/historical/timeline con ?lang=)
    └── archaeology-feed/      # services/archaeologyApiService (API /bible/historical/articles con ?lang=)
```

### 2.1 Arquitectura Visual de la Landing Page (`bible/page.tsx`)
Inspirada en las proporciones y jerarquía métrica exacta de *Google Perfil de Negocio* (inspección DevTools):
1. **Calibración Dimensional y Escala Tipográfica:**
   * **Headline Principal (`h1`):** `text-4xl sm:text-5xl md:text-6xl lg:text-[68px]` con `leading-[1.12]` y color suave `#202124` (dark charcoal) para máxima legibilidad humana sin agresividad visual.
   * **Cuerpo Introductorio (`p`):** `text-base sm:text-[18px]` con `leading-[1.6]` y color `#3C4043`, con contenedor de lectura amplio `max-w-[1200px]`.
   * **Grid y Ritmo Vertical:** Contenedor de `1456px` (`max-w-[1456px]`), sin líneas divisorias horizontales entre secciones (`border-b`, `border-y` eliminados) y con espaciado vertical amplio y generoso (`py-24 sm:py-32` y `py-28 sm:py-36` en secciones oscuras y CTA) para un flujo editorial limpio y aireado.
   * **Botones Principales:** Botones tipo píldora (`rounded-full`) con padding ergonómico `px-8 py-3.5 text-base font-semibold`.
   * **Encabezados de Sección (`h2`):** Armonizados a `text-3xl sm:text-4xl lg:text-[42px]` en `#202124` con subtítulos descriptivos en `#3C4043` (`text-base sm:text-[17-18px]`).
2. **Layering Cinematográfico en el Hero:**
   * **Fondo ambiental:** Fotografía editorial de alta definición con un espacio de estudio bíblico moderno en tonos grafito/carbón, biblia en cuero abierta con tipografía nítida y suite digital en tablet (`/bible/images/hero_editorial_dark.jpg`) montada en marco panorámico `max-w-[1380px]` y altura calibrada a primer pliegue (`max-h-[460px] sm:max-h-[480px]`).
   * **Tarjeta de lectura flotante:** Superpuesta con elevación translúcida (*glassmorphism* `backdrop-blur-2xl`, sombra difusa `shadow-[0_25px_60px_-15px_rgba(0,0,0,0.20)]`), controles Mac y versículos en español e hebreo masorético con interlineado `leading-[1.8]` de alta legibilidad editorial.
   * **Distribución Split Geist (45% Narrativa / 55% Viewport Editorial Integrado):**
     * **Monocromía y Neutralidad:** Fondo de tarjeta neutro de alta gama (`bg-white dark:bg-[#0c0c0d] border border-zinc-200/90 dark:border-zinc-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]`), eliminando tintes pasteles genéricos para alinearse con la sobriedad académica de Geist.
     * **Jerarquía Tipográfica Limpia y Directa:** Se eliminaron badges y etiquetas redundantes de numeración para maximizar el minimalismo editorial Geist, dando todo el protagonismo al título principal de la herramienta (`text-2xl sm:text-3xl lg:text-[32px]`) y a su descripción.
     * **9 Imágenes Editoriales Dedicadas de Alta Definición:** Cada herramienta cuenta con su propia fotografía cinematográfica de erudición (`hero_editorial_dark.jpg`, `parallel_versions_study.jpg`, `codex_interlinear_scroll.jpg`, `chiasm_poetry_manuscript.jpg`, `strong_lexicon_study.jpg`, `smart_search_scriptures.jpg`, `bible_atlas_topography.jpg`, `historical_timeline_chronology.jpg`, `manuscripts_heritage.jpg`).
     * **Composiciones Espaciales y Layouts Dinámicos con Efecto Sobresalido ("Salidito" Estilo Google):** Se combinan ventanas contenidas con elementos flotantes que rompen sutilmente los bordes del marco fotográfico (`z-20` con sombra difusa `shadow-[0_20px_50px_rgba(0,0,0,0.18)]`), recreando el efecto de profundidad de Google Business Profile:
        1. *Lectura Continua:* Tarjeta de lectura sobresalida en la esquina inferior izquierda (`-bottom-5 -left-6`), creando profundidad entre el escritorio y la narrativa.
        2. *Comparador de Versiones:* Ventana flotante de diff textual centrada en la escena.
        3. *Idiomas Originales:* Inspector anclado en la parte superior descubriendo el códice subyacente.
        4. *Estructura Quiástica:* Cajón vertical derecho con árbol escalonado de simetría poética.
        5. *Diccionarios Strong:* Ficha léxica sobresalida en la esquina inferior izquierda (`-bottom-5 -left-6`) sobre el libro y la lupa.
        6. *Buscador Inteligente:* Omnibar Spotlight centrado superior estilo Cmd+K con coincidencias en tiempo real.
        7. *Mapas Bíblicos:* Doble HUD cartográfico con telemetría sobresalida en la esquina inferior derecha (`-bottom-3.5 -right-4`).
        8. *Línea de Tiempo:* Cinta horizontal sincronizada a lo ancho con rail de épocas históricas.
        9. *Arqueología:* Ficha de registro de museo arqueológico anclada al cuadrante inferior derecho.
   * **Controles y Click-to-Slide:** Cápsula flotante translúcida centrada (`h-11 sm:h-12`) con 9 indicadores de píldora interactivos, botón circular independiente de Pausa / Reproducción, y desplazamiento reactivo inmediato al pulsar las tarjetas laterales que se muestran con nitidez total (`opacity-100`) y bordes uniformes (`hover:border-card-hover-border`).
4. **Selector por Propósito del Lector (Estética Geist / Vercel OLED Black Puro con Métricas Calibradas):**
   * **Bloque de Contraste Teatral (`#proposito`):** Fondo negro puro `bg-black text-white` con padding vertical exacto `py-[60px] lg:py-[72px]`, contenedor expandido `max-w-[1440px]`, selector de pestañas en cápsula Geist con altura fija `h-[60px]` y padding de 4px (`p-1`), título dinámico en blanco nítido a escala completa (`text-3xl sm:text-5xl lg:text-[60px]` con `leading-[1.12]` y `max-w-[1170px]`) y botón primario Vercel (`px-8 py-3.5 rounded-full`) con separación de 60px hacia las tarjetas (`mb-[60px]`).
   * **Grid de 3 Tarjetas Verticales de Proporción Real (`442px x 615px`):**
     * **Tarjeta 1:** `bg-[#0a0a0a] border border-zinc-800/90 rounded-[32px] sm:rounded-[36px] min-h-[615px] p-8 sm:p-9`, texto superior + mockup inferior en tarjeta interior `bg-black border border-zinc-800/80 rounded-[24px] p-6`.
     * **Tarjeta 2:** Mockup superior en tarjeta interior + texto inferior (`min-h-[615px]`).
     * **Tarjeta 3:** Texto superior + mockup inferior en tarjeta interior (`min-h-[615px]`).
   * **Mockups internos de alta precisión:**
      * *Lectura y Devocional:* Controles tipográficos (Serif/Sans, 18px, Prosa), texto en vivo (Salmos 23:2-3), checks de interlineado óptico, libreta de reflexiones privadas con anclaje escritural y devocional matutino con versículo destacado (NBLA) y meditación pastoral.
     * *Comparar Versiones:* Cotejo paralelo a doble columna (NBLA vs NTV), motor de resaltado léxico LCS y cotejo de textos base (BHS vs LXX).
     * *Idiomas Originales:* Token interlineal morfológico (`יְהוָ֥ה רֹ֝עִ֗י`), ficha léxica Strong H7462 / BDB con conteo de ocurrencias, y diagrama de estructura quiástica (A-B-C-B'-A').
     * *Mapas e Historia:* Diagrama vectorial de ruta misionera mediterránea (Antioquía → Chipre → Perge → Listra/Derbe), cronología sincrónica tripartita (Monarquía/Profecía/Imperio) y ficha arqueológica del Gran Rollo de Isaías (1QIsaª).
4. **Catálogo Exegético de Versiones y Manuscritos (`#versiones` en `max-w-[1400px]`):**
   * **Vitrina de 6 Tarjetas Editoriales de Alta Presencia:** Grid de 3 columnas (`min-h-[300px]`, `rounded-[28px]`, `border-border/80 bg-card`) con acrónimo destacado en mono, metodología de traducción (*Tradición Masorética, Equivalencia Formal, Dinámica, Hebreo Masorético, Griego Alejandrino*), nombre oficial, valor exegético, versículo muestra en vivo (*Salmos 23:1* con soporte RTL masorético), titular de derechos de autor y enlace directo de apertura en el lector.
   * Cubre las 6 versiones pilares: `RV1960` (SBU), `NBLA` (Lockman), `NVI` (Bíblica/Zondervan), `NTV` (Tyndale), `BHS` (Groves Center) y `LXX` (Rahlfs).
5. **Sección Oscura Teatral de Manuscritos Milenarios (`#manuscritos` en `max-w-[1400px]`):**
   * Bloque inmersivo en carbón (`bg-zinc-950`) de ancho generoso con iluminación focal sobre facsímil antiguo (`/bible/images/manuscripts_heritage.jpg`), detallando el Códice de Leningrado, la Septuaginta LXX y los Rollos de Qumrán.
6. **Comienza en 3 Pasos Sencillos y Suite Móvil (`max-w-[1400px]`):**
   * Guía visual numerada con insignias circulares y smartphone minimalista con Dynamic Island, armónicos a escala completa.

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
9. **Cronología y Arqueología (`features/timeline/` y `features/archaeology-feed/`):** Conexión 100% reactiva y bilingüe con `GET /bible/historical/timeline` y `GET /bible/historical/articles`. `TimelineCanvas` y `SynchronousComparisonView` consumen los eventos históricos dinámicos tipados (`MonarchData`, `ProphetData`, `WorldEmpireData`, `ArchaeologicalMilestone`) transformados por `timelineApiService.ts` y orquestados por el hook `useBiblicalTimeline` según el idioma activo (`next-intl`), eliminando por completo cualquier dataset estático o mock local.
10. **Evangelización y Apologética Práctica (`features/evangelism/`):** Conexión 100% reactiva y bilingüe con `GET /bible/evangelism/*`. Integra rutas bíblicas secuenciales (Camino de Romanos, Puente hacia la Vida, Cuatro Verdades), banco interactivo de objeciones apologéticas clasificadas y tratados/bosquejos listos para predicar o compartir (`EvangelismWorkspace`, `PathwayViewer`, `ObjectionsExplorer`, `TractsExplorer`), alimentados desde `bible.sqlite` y el corpus JSON.

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

### 7.7 Arquitectura Desacoplada App Shell y Auto-Hide Inteligente (`layout.tsx`, `BibleHeaderNav.tsx`)
* **Patrón App Shell de Estudio Profesional (Cero Layout Shifts - CLS = 0):** El workspace de estudio adopta la arquitectura canónica de IDEs y suites profesionales (Geist, Linear, VS Code):
  * **Marco Raíz Inamovible:** `h-screen flex flex-col overflow-hidden`. La ventana del navegador nunca produce scroll global ni desacomoda los paneles laterales.
  * **Auto-Hide Inteligente de Cabecera (`BibleHeaderNav.tsx`):** La barra de 56px (`h-14`) cuenta con transición fluida de altura y opacidad (`transition-[height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden`).
    * **Zona de Reposo Serena (`scrollTop <= 200px`):** Los primeros 200px permanecen fijos para que el lector examine el título, la barra de herramientas o el pasaje sin que nada desaparezca.
    * **Ocultamiento por Intención Real (`>= 80px` continuos hacia abajo):** Solo al rebasar la zona de reposo y demostrar lectura continuada, la barra colapsa suavemente a `h-0 opacity-0`.
    * **Reaparición Inmediata (`>= 25px` hacia arriba):** Cualquier retroceso o gesto ascendente restaura la cabecera al instante.
  * **Expansión Automática del Workspace:** Al retraerse la cabecera, la fila del workspace (`flex-1 min-h-0 overflow-hidden`) se expande naturalmente a pantalla completa (`100vh`).
  * **Blindaje Total de Paneles Laterales (`BibleNavigationSidebar.tsx` e `Inspector`):** En desktop (`lg:`), actúan como columnas fijas acopladas (`lg:static lg:h-full`). Sus cabeceras (`[Todos | AT | NT]` y `[Morfología Strong]`) son `shrink-0` y residen siempre al tope de la fila, por lo que **jamás se cortan ni se empujan fuera de pantalla**.
  * **Canvas Central de Lectura (`<main>`):** Ocupa el espacio central (`flex-1 h-full overflow-y-auto`). La lectura de versículos se desplaza a 120 FPS sin colisiones y dispara los eventos de intención de forma nativa.
  * **Footer Editorial Integrado:** El pie de página con información legal y enlaces canónicos se aloja al final del canvas de lectura (`<main>`).

### 7.8 Botones Flotantes Laterales de Cambio de Capítulo Adaptables (`ChapterNavigator.tsx`)
* **Visibilidad Continua sin Oclusión:** Los botones de navegación de capítulos flotan a media altura (`top-1/2 -translate-y-1/2`) en los flancos de la lectura. Se sincronizan reactivamente con el estado de apertura de los paneles (`isLeftSidebarOpen` e `isRightInspectorOpen` de `BiblePassageContext`), ajustando sus posiciones con `transition-[left,right] duration-300`:
  * **Con panel izquierdo abierto:** Se desplaza automáticamente a `lg:left-[calc(20rem+1rem)]`, manteniéndose visible al ras del margen del sidebar sin quedar tapado.
  * **Con inspector derecho abierto:** Se desplaza automáticamente a `lg:right-[calc(22rem+1rem)] xl:right-[calc(24rem+1rem)]`, manteniéndose visible al margen del inspector sin ocultarse.
* **Indicación Numérica Exegética:** Los botones de formato squircle (`rounded-xl`, `h-9 px-2.5`) exhiben de forma limpia y estilizada el número del capítulo al que se transitará:
  * **Izquierda:** Chevron `<` junto con el número del capítulo anterior (`currentChapter - 1`).
  * **Derecha:** Número del capítulo siguiente (`currentChapter + 1`) junto con el chevron `>`.
* **Estética Geist / Vercel:** Acabado rectangular con esquinas suavizadas (`rounded-xl` en lugar de óvalos completos `rounded-full`), fondo 100% sólido monocromático (`bg-white dark:bg-[#0a0a0a]`), tipografía mono (`font-mono font-semibold text-xs`), borde ultra-fino, elevación `shadow-md` y micro-escalado en hover.
* **Eliminación del Bloque Inferior Redundante:** Se eliminó por completo el pie de navegación secuencial inferior (`< Capítulo anterior | Resumen | Capítulo siguiente >`) que se renderizaba al final de la lista de versículos, despejando el pie de lectura y delegando el cambio de capítulo exclusivamente en los botones flotantes laterales y los atajos de teclado (`←` / `→`).

### 7.9 Visibilidad Inteligente del Selector Canónico (`UnifiedPassagePicker.tsx`)
* **Aislamiento de Duplicidad en Desktop (`lg:hidden` reactivo):** Mientras el panel lateral de navegación canónica (`BibleNavigationSidebar`) está desplegado en pantalla grande (`isLeftSidebarOpen === true`), el selector central de pasaje (`UnifiedPassagePicker` — `< Génesis 1 >`) se oculta automáticamente (`lg:hidden`) en [ReaderToolbar.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/features/verses/components/reader-toolbar/ReaderToolbar.tsx) y [BiblePassageToolbar.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BiblePassageToolbar.tsx). Esto garantiza que no coexistan dos selectores de capítulos simultáneos en pantalla.
* **Apertura Completa sin Restricciones de Overflow:** Cuando el panel lateral se cierra (mediante el tirador del borde `(←|→)`, la pestaña de borde o el atajo `[`), el selector de pasaje reaparece fluidamente (`animate-in fade-in duration-200`). Al carecer de cualquier envoltorio con `overflow-hidden`, el modal desplegable (con su buscador de libros, tabs de testamentos y cuadrícula de capítulos) se abre al 100% de su altura y anchura sin ser recortado ni atrapado.
* **Garantía Móvil:** En pantallas pequeñas (`< lg`), el selector permanece siempre disponible para permitir la selección de pasajes sin depender del drawer lateral.

### 7.10 Tiradores Interactivos en Líneas Divisorias de Paneles (`(←|→)`)
* **Centrado Vertical y Horizontal Ergonómico:** Los tiradores de colapso en [BibleNavigationSidebar.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BibleNavigationSidebar.tsx) y [BibleExegesisInspector.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BibleExegesisInspector.tsx) se sitúan exactamente en la mitad vertical de la pantalla (`items-center justify-center` sobre el riel `h-full`), eliminando la fijación superior previa (`items-start pt-3`).
* **Cero Recortes de Borde:** Se resolvió el corte visual que seccionaba el botón en dos mitades al reemplazar la posición estática y el `overflow-hidden` del panel por `lg:relative lg:z-20` y `lg:overflow-visible` con un contenedor simétrico de 24px (`w-6`, `-right-3` / `-left-3`), permitiendo que el squircle completo (`w-6 h-7 rounded-md`) con el glifo dual `< | >` emerja con nitidez absoluta y sombra suave en el centro de la arista divisoria al pasar el cursor.






