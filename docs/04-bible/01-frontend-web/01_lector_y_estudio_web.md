# Biblia Modular - Lector y Herramientas de Estudio Web (Next.js)

Este documento detalla la arquitectura macro y micro, herramientas exegéticas y componentes del subdominio de la Biblia (`bible.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro y Enrutamiento Canónico Limpio:**
> * **Subdominio Canónico:** `bible.jorgedoicela.com` (o `http://bible.localhost:3001` en desarrollo local).
> * **URLs Limpias Canónicas de Primer Nivel:** La raíz del subdominio es `/` y las 8 herramientas de estudio son rutas directas de primer nivel (`/study/standard`, `/study/parallel`, `/study/interlinear`, `/study/word-study`, `/study/atlas`, `/study/timeline`, `/study/archaeology`, `/study/evangelism`).
> * **Redirección Canónica 308 Permanente:** En `src/middleware.ts`, cualquier solicitud en el subdominio con el prefijo redundante `/bible` o `/bible/*` se redirige automáticamente mediante HTTP 308 a la ruta limpia correspondiente (`/` o `/*`), eliminando URLs duplicadas en el navegador y protegiendo el SEO.
> * **Reescritura Interna Transparente:** Next.js reescribe internamente las rutas limpias al directorio físico `frontend/web/src/app/(bible)/bible/*` para evitar colisiones con los demás dominios bajo el runtime consolidado de 1 GB de RAM.
> * **Compatibilidad Localhost Directa:** Solicitudes directas sin subdominio a `localhost:3001/bible` siguen respondiendo 200 OK directamente.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`) para respetar la memoria de **1 GB de RAM** del VPS.
> * **Aislamiento de Dominio:** Cero dependencias de otros subdominios. Estilos aislados en `(bible)/globals.css`.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD):** La arquitectura separa estrictamente la capa de entidades (`entities/books`, `entities/translations`) de las 8 herramientas exegéticas del usuario encapsuladas en `(bible)/features/` (`verses`, `parallel-view`, `interlinear`, `lexicons`, `atlas`, `timeline`, `archaeology-feed`, `evangelism`), con sus propios paneles laterales (`Sidebar`) e inspectores (`Inspector`) desacoplados. Las dependencias internas de una sola herramienta (como el motor de diferencias textuales LCS) están co-localizadas dentro de su respectivo slice (`parallel-view/textual-diff`).
> * **Internacionalización Integral (i18n):** 100% de cobertura en `messages/es.json` y `messages/en.json` con `next-intl`. Todas las herramientas exegéticas (Interlineal Inverso, Atlas, Cronología Sincrónica, Léxicos Strong, Arqueología) consumen namespaces tipados sin cadenas hardcodeadas.
> * **Cero Datos Hardcodeados en Cliente:** Ningún archivo TypeScript contiene versículos, palabras, coordenadas ni textos bíblicos incrustados. Toda la data se consume asíncronamente desde los endpoints de NestJS (`GET /bible/*`).
> * **Header Unificado y Responsivo:** `BibleHeaderNav.tsx` con pestañas en escritorio y menú desplegable flotante de las 8 herramientas en pantallas móviles (`< md`).
> * **Barra de Control Exegético:** `ReaderToolbar.tsx` agrupa pasaje (`UnifiedPassagePicker`), versión bíblica (`TranslationSelector`) y controles de tipografía/diseño (`ReaderLayoutMode`, `ReaderFontSize`, `ReaderFontFamily`) de forma 100% responsiva.
> * **Estética Geist / Vercel Style:** Monocromática de alta precisión, micro-interacciones de alta densidad, bordes ultra-delgados (`border-zinc-800`), tipografía Geist y legibilidad editorial para análisis exegético.

---

## 2. Estructura de Rutas y Navegación URL-Driven

El subdominio cuenta con una Landing Page y 8 módulos de estudio independientes con enrutamiento dedicado y layout persistente:

```text
frontend/web/src/app/(bible)/
├── globals.css                # Estilos aislados de la biblia (Geist / Vercel Style)
├── layout.tsx                 # Layout raíz del subdominio con ThemeProvider y BibleJsonLd
│
├── bible/                     # ENRUTAMIENTO (App Router)
│   ├── page.tsx               # Landing Page de presentación y Live Preview interactivo
│   └── study/
│       ├── layout.tsx         # Layout compartido: ScopedModuleProviders + BibleHeaderNav + Paneles FSD
│       ├── page.tsx           # Redirección por defecto a /study/standard
│       ├── standard/page.tsx  # Módulo 1: Lectura Estándar Continua
│       ├── parallel/page.tsx  # Módulo 2: Cotejo Paralelo Multi-Versión & Diff Textual
│       ├── interlinear/page.tsx # Módulo 3: Interlineal Inverso (Hebreo BHS / Griego NA28)
│       ├── word-study/page.tsx # Módulo 4: Análisis de Palabra / Léxicos (BDB / Gesenius / Thayer)
│       ├── atlas/page.tsx     # Módulo 5: Atlas Bíblico Vectorial y Georreferenciado WGS84 & 3D
│       ├── timeline/page.tsx  # Módulo 6: Cronología Sincrónica e Historia Comparada
│       ├── archaeology/page.tsx # Módulo 7: Arqueología Bíblica y Feed de Excavaciones
│       └── evangelism/page.tsx # Módulo 8: Evangelización y Apologética (?tab=pathways | objections | tracts)
│
├── providers/                 # CAPA DE PROVIDERS GLOBALES (FSD PROVIDERS)
│   ├── theme-provider.tsx     # Provider next-themes aislado para el subdominio
│   └── index.ts               # Barrel export de providers
│
├── shared/                    # CAPA DE ELEMENTOS COMPARTIDOS (FSD SHARED)
│   ├── context/               # BiblePassageContext (sincroniza bookId, chapter y trans con URL)
│   ├── data/                  # canonData.ts (categorías canónicas, recuentos de capítulos por ID y abreviación)
│   ├── hooks/                 # useHeaderScrollBehavior, useBibleKeybindings
│   ├── seo/                   # BibleJsonLd (Schema.org estructurado)
│   ├── ui/                    # BackToBibleButton, BackToPortalButton, BibleLogo, BibleSelect, DraggableEdgeTab, OngoingExpansionNotice, ResizeBorderHandle, EdgePeekStrip
│   └── index.ts               # Barrel export unificado de shared
│
├── entities/                  # CAPA DE ENTIDADES DE DOMINIO (FSD ENTITIES)
│   ├── books/                 # useBooks, UnifiedPassagePicker, getBookHistoricalInfo (API /bible/books)
│   └── translations/          # useTranslations, TranslationSelector (API /bible/translations)
│
├── widgets/                   # CAPA DE COMPONENTES COMPUESTOS (FSD WIDGETS)
│   ├── bible-header/          # BibleHeaderNav (cabecera con auto-hide de scroll y selector móvil)
│   ├── bible-sidebar/         # BibleNavigationSidebar (navegador canónico de 66 libros con buscador)
│   ├── bible-passage-toolbar/ # BiblePassageToolbar (barra ergonómica de pasaje activo)
│   ├── exegesis-inspector/    # BibleExegesisInspector, StrongMorphologyInspector, ParallelVerseInspector, BookHistoricalProfile
│   ├── landing/               # 9 secciones atómicas de la Landing Page
│   └── index.ts               # Barrel export de widgets
│
└── features/                  # HERRAMIENTAS DE USUARIO Y TOGGLES (FSD FEATURES)
    ├── language-toggle/       # LanguageToggle (selector ES / EN con cookie NEXT_LOCALE)
    ├── theme-toggle/          # ThemeToggle (conmutador claro / oscuro OLED)
    ├── verses/                # services/ + hooks/useVerses + vistas continuas y línea por línea
    ├── parallel-view/         # Comparador multi-columna + subdirectorio textual-diff (LCS)
    ├── interlinear/           # services/interlinearApiService (Hebreo Masorético BHS / Griego NA28)
    ├── lexicons/              # services/lexiconApiService (Léxicos Strong BDB, Thayer, Gesenius)
    ├── atlas/                 # services/atlasApiService (Atlas georreferenciado WGS84 con ?lang=)
    ├── timeline/              # services/timelineApiService (Cronología sincrónica con ?lang=)
    ├── archaeology-feed/      # services/archaeologyApiService (Feed de arqueología con ?lang=)
    └── evangelism/            # services/evangelismApiService (Rutas soteriológicas y apologética)
```

### 2.1 Arquitectura Visual de la Landing Page (`bible/page.tsx`)
> [!TIP]
> **Descomposición Modular Atómica:** La Landing Page de la Biblia opera mediante un orquestador declarativo ultra-liviano (`bible/page.tsx`, < 45 líneas) que ensambla 9 subcomponentes atómicos e independientes ubicados en `widgets/landing/` (`BibleLandingHeader`, `BibleHeroSection`, `BibleEnginesCarousel`, `BiblePurposeSection`, `BibleCorpusVersionsSection`, `BibleManuscriptsSection`, `BibleStepsSection`, `BibleMobileAppSection`, `BibleFinalCtaAndFooter`). Cada componente encapsula su propio estado, interactividad y suscripción i18n (`BibleLanding` / `Landing`), erradicando la deuda técnica de archivos monolíticos y garantizando mantenibilidad a largo plazo.

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
     * **8 Imágenes Editoriales Dedicadas de Alta Definición:** Cada herramienta cuenta con su propia fotografía cinematográfica de erudición (`hero_editorial_dark.jpg`, `parallel_versions_study.jpg`, `codex_interlinear_scroll.jpg`, `strong_lexicon_study.jpg`, `smart_search_scriptures.jpg`, `bible_atlas_topography.jpg`, `historical_timeline_chronology.jpg`, `manuscripts_heritage.jpg`).
     * **Composiciones Espaciales y Layouts Dinámicos:**
        1. *Lectura Continua:* Tarjeta de lectura sobresalida en la esquina inferior izquierda (`-bottom-5 -left-6`), creando profundidad entre el escritorio y la narrativa.
        2. *Comparador de Versiones:* Ventana flotante de diff textual centrada en la escena.
        3. *Idiomas Originales:* Inspector anclado en la parte superior descubriendo el códice subyacente.
        4. *Diccionarios Strong:* Ficha léxica sobresalida en la esquina inferior izquierda (`-bottom-5 -left-6`) sobre el libro y la lupa.
        5. *Buscador Inteligente:* Omnibar Spotlight centrado superior estilo Cmd+K con coincidencias en tiempo real.
        6. *Mapas Bíblicos:* Doble HUD cartográfico con telemetría sobresalida en la esquina inferior derecha (`-bottom-3.5 -right-4`).
        7. *Línea de Tiempo:* Cinta horizontal sincronizada a lo ancho con rail de épocas históricas.
        8. *Arqueología:* Ficha de registro de museo arqueológico anclada al cuadrante inferior derecho.
   * **Controles y Click-to-Slide:** Cápsula flotante translúcida centrada (`h-11 sm:h-12`) con 8 indicadores de píldora interactivos, botón circular independiente de Pausa / Reproducción, y desplazamiento reactivo inmediato al pulsar las tarjetas laterales que se muestran con nitidez total (`opacity-100`) y bordes uniformes (`hover:border-card-hover-border`).
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

## 3. Los Motores de Estudio Exegético y Clientes API

1. **Lectura Continua (`features/verses/`):** Consume `GET /bible/verses?bookId=&chapter=&translationId=`. Integra controles tipográficos (Serif / Sans, tamaños de escala con `+`/`-`), modos de tono de lectura (Auto / Sistema, Sepia / Papel Cálido `#FAF6EE`, Dark / OLED `#000000`), Modo Enfoque Inmersivo a pantalla completa sin distracciones (tecla `F` o botón de foco, salida con `Esc`), navegación por atajos de teclado (`←`/`→`, `J`/`K`), persistencia de preferencias (`bible_reader_settings` en `localStorage`), notas de atribución legal de copyright oficiales al pie de cada capítulo, e integración con el lateral derecho (`BibleExegesisInspector`) inicializado por defecto en la pestaña `'versions'` para cotejo ágil de versículos.
2. **Vista Paralela (`features/parallel-view/`):** Comparación simultánea de 2 a 4 versiones sincronizadas por capítulo (`RV1960`, `NVI`, `NBLA`, `BHS`, `LXX`).
   * **Arquitectura de Laterales Especializados y Desacoplados:**
     * **Panel Lateral Izquierdo (`ParallelSidebar`):** Gestor interactivo de columnas activas (adición, reordenamiento y eliminación de traducciones), catálogo de Presets Rápidos de Cotejo (*Equivalencia Formal, Dinámica, Textos Base Originales y Panorámica Cuádruple*) y navegación ágil de pasaje.
     * **Panel Lateral Derecho (`ParallelDiffInspector`):** Inspector granular de Diferencia de Texto (LCS) versículo a versículo sincronizado con el cursor o clic de fila, selector dinámico de los dos textos base a contrastar, barra de porcentaje de similitud léxica, resaltado de adiciones/omisiones cromáticas y pestaña conmutadora a morfología Strong.
     * **Gestión de Estado (`ParallelContext`):** Proveedor de contexto transversal (`ParallelProvider`) que comunica y reactiva el lienzo central con ambos paneles laterales en tiempo real con 0 latencia.
3. **Diff Textual (`features/textual-diff/`):** Algoritmo de Diferencia de Texto (LCS) para resaltar adiciones, omisiones y divergencias de traducción entre dos versiones seleccionadas.
4. **Interlineal Inverso (`features/interlinear/`):** Consume `GET /bible/morphology/passage`. Integra lectura corrida en español limpia omitiendo etiquetas técnicas de partículas intransferibles (`אֵת` Strong H853) en el texto superior, manteniendo la tarjeta morfológica interactiva en el desglose masorético inferior.
   * **Arquitectura de Laterales Especializados y Desacoplados:**
     * **Panel Lateral Izquierdo (`InterlinearSidebar`):** Navegador canónico categorizado por tradición lingüística (*Torá Masorética, Nevi'im, Ketuvim con secciones destacadas en Arameo Imperial vs Evangelios, Corpus Paulino y Epístolas en Griego Koiné*), panel de conmutación de capas morfológicas visibles (Nikkud, transliteración fonética, glosas, claves Strong y parsing gramatical) y selector de modo de estudio (Inverso continuo vs Cuadrícula de fichas).
     * **Panel Lateral Derecho (`InterlinearInspector`):** Ficha morfológica y léxica profunda del lema/token seleccionado en el texto (caracteres originales en gran formato, IPA, transliteración fonética, pronunciación en audio fonético en vivo mediante `biblicalAudioService`, desglose morfosintáctico de categoría/binyan/aspecto/tiempo/voz/modo/caso, y definiciones exegéticas BDB/Gesenius/Thayer con conteo de ocurrencias canónicas). Incluye pestaña secundaria para cotejo sincrónico de versículo.
     * **Gestión de Estado (`InterlinearContext`):** Proveedor de contexto (`InterlinearProvider`) que sincroniza en tiempo real la palabra inspeccionada, las capas activas, el canon lingüístico y el lienzo de lectura sin acoplamientos cruzados.
5. **Estudio de Palabra / Léxicos (`features/lexicons/`):** Consume `GET /bible/morphology/lexicon`. Diccionarios académicos BDB / Gesenius para raíces hebreas y léxico griego.
6. **Atlas Bíblico Georreferenciado (`features/atlas/`):** Consume `GET /bible/atlas/places`. Coordenadas WGS84 proyectadas sobre canvas vectorial con filtro por épocas.
7. **Cronología y Arqueología (`features/timeline/` y `features/archaeology-feed/`):** Conexión 100% reactiva y bilingüe con `GET /bible/timeline` y `GET /bible/archaeology/articles`. `TimelineCanvas` y `SynchronousComparisonView` consumen los eventos históricos dinámicos tipados (`MonarchData`, `ProphetData`, `WorldEmpireData`, `ArchaeologicalMilestone`) transformados por `timelineApiService.ts` y orquestados por el hook `useBiblicalTimeline` según el idioma activo (`next-intl`), eliminando por completo cualquier dataset estático o mock local.
8. **Evangelización y Apologética Práctica (`features/evangelism/`):** Conexión 100% reactiva y bilingüe con `GET /bible/evangelism/*`. Integra rutas bíblicas secuenciales (Camino de Romanos, Puente hacia la Vida, Cuatro Verdades), banco interactivo de objeciones apologéticas clasificadas y tratados/bosquejos listos para predicar o compartir (`EvangelismWorkspace`, `PathwayViewer`, `ObjectionsExplorer`, `TractsExplorer`), alimentados desde `bible.sqlite` y el corpus JSON.

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
    * **Distribución Biescalar Justificada en Móvil (`< sm`):** La barra se organiza en dos niveles simétricos con una línea divisoria horizontal sutil (`divide-y divide-zinc-100 dark:divide-zinc-800/60`):
      * *Fila Superior (Canónica):* Pasaje canónico a la izquierda (`< Génesis 1 ⌄ >`) y selector de versión compacto a la derecha (`[NBLA] ⌄`), extendidos con `justify-between` sin huecos muertos.
      * *Fila Inferior (Herramientas):* Alternador de modo Geist a la izquierda (`≡` / `::`) y herramientas de tipografía/acciones a la derecha (`T Aa` | `⤢` `❐` `🖶`), también distribuidos de extremo a extremo con `justify-between`.
    * **En Tablet y Desktop (`sm:`):** Se consolida en una sola línea horizontal compacta y continua.
  * **Canvas Móvil Simétrico con Scrollbar Overlay (`layout.tsx`):** El contenedor `<main>` implementa `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden` en móvil, eliminando la barra de desplazamiento gris tosca de 16px de navegadores de escritorio que ladeaba el contenido respecto a la cabecera. En tablet/desktop (`md:`), activa un scrollbar ultra-delgado Geist de 6px (`w-1.5 rounded-full`).
* **Navegación Canónica y Chips Ergonómicos (`BibleNavigationSidebar.tsx`):**
  * Integración visual continua: en desktop (`lg:`), se eliminó la cabecera redundante con título y botón de cierre para evitar el efecto de "doble barra horizontal rota". El panel arranca directamente con su buscador y selector de testamentos al ras.
  * Segmented control Geist encapsulado para testamentos (`Todos | AT (39) | NT (27)`).
  * Buscador rápido con bordes suaves `rounded-xl` y padding ergonómico.
  * Cuadrícula de capítulos con chips circulares/redondeados suaves (`w-8 h-8 rounded-lg text-xs font-mono font-medium border border-zinc-200/80 dark:border-zinc-700/80`) inspirados en el diseño de componentes de DIITRA.
  * En móviles (`< lg`), se proyecta como Drawer con cabecera dedicada, cortina oscura y auto-cierre al seleccionar capítulo.
* **Inspector Exegético Desacoplado (`BibleExegesisInspector.tsx`):**
  * En desktop (`lg:`), inicia de inmediato con sus pestañas en segmented control Geist (`Morfología Strong` y `Versiones Sinópticas`), eliminando barras de título duplicadas.
  * **Activación Predeterminada de Alto Valor en Lectura Estándar:** La pestaña activa por defecto es **«Versiones Paralelas»** (`versions`), inicializada automáticamente con el **Versículo 1 del capítulo en curso** (`inspectedVerse`). De esta manera, el usuario siempre visualiza de inmediato la comparación sincrónica multi-traducción en lugar de una pantalla en blanco.
  * **Sincronización Contextual y Botón ✨:** Al pulsar el botón de acción ✨ de cualquier versículo (en vista continua o versículo por versículo), el inspector se abre o enfoca automáticamente la pestaña de versiones paralelas con ese versículo específico. Al transitar entre libros o capítulos, el versículo por defecto se sincroniza automáticamente al versículo 1 del nuevo pasaje canónico.
  * Componentes internos puros y desacoplados (`StrongMorphologyInspector` y `ParallelVerseInspector`).
* **Barra de Navegación de Suites Geist Pura (`BibleHeaderNav.tsx`):**
  * Supresión definitiva de puntos circulares de colores en las pestañas de suites y líneas divisorias verticales ruidosas en el bloque de identidad (`Atrás` y `Logo`), logrando un flujo visual continuo e integrado.
  * Estilo tipográfico monocromático Geist idéntico a Vercel Dashboard, con cápsula activa sobria (`bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs`) y botones de panel unificados (`PanelLeft` y `PanelRight`).
  * **Centrado Geométrico Simétrico Absoluto Móvil (`Grid Drift Zero`):** El selector de modo de estudio móvil (`< md`) y su menú desplegable flotante se anclan en el centro horizontal exacto de la pantalla mediante `absolute left-1/2 -translate-x-1/2`, erradicando el desfase lateral asimétrico ("de lado") y garantizando márgenes equidistantes hacia ambos extremos de la cabecera.

### 6.1 Arquitectura Desacoplada de Paneles Laterales: Patrón Compuesto `StudySidePanel` (FSD & Geist)

La arquitectura de paneles laterales (izquierdo y derecho) implementa un diseño estrictamente desacoplado, escalable y conforme a **Feature-Sliced Design (FSD)** a través del componente shell compuesto [`StudySidePanel.tsx`](../../../frontend/web/src/app/(bible)/shared/ui/StudySidePanel.tsx) ubicado en `shared/ui`. Este patrón garantiza coherencia visual, física y comportamental en los 16 paneles distribuidos a lo largo de los 8 módulos de la plataforma (`reader`, `atlas`, `timeline`, `archaeology-feed`, `evangelism`, `parallel-view`, `interlinear`, `lexicons`):

* **Patrón de Componente Compuesto (`StudySidePanel` en `shared/ui`):**
  * **Estructura Declarativa FSD:**
    * `<StudySidePanel>`: Shell contenedor (`<aside>`), Backdrop móvil con difuminado (`backdrop-blur-xs`), tirador de redimensión interactivo (`ResizeBorderHandle`), cabecera móvil automática accesible (`title`, `icon`, `badge`, `onClose`) y gestión de anchura/colapso.
    * `<StudySidePanel.Toolbar>`: Contenedor superior para controles de acción (selectores de testamentos, motores de búsqueda, tabs de segmented control, alternadores de filtros). Presenta borde divisorio inferior sutil `border-b border-zinc-100 dark:border-zinc-800/80` y empaquetado de layout limpio.
    * `<StudySidePanel.Body>`: Contenedor ergonómico principal con desplazamiento vertical independiente (`overflow-y-auto min-h-0 flex-1`), eliminando barras de scroll duplicadas o desbordamiento incontrolado.
    * `<StudySidePanel.Footer>`: Contenedor inferior acoplado a la base (`border-t border-zinc-100 dark:border-zinc-800/80 p-3 bg-zinc-50/50 dark:bg-zinc-950/30`) para controles de paginación, contadores métricos o acciones secundarias.
  * **Arquitectura Canónica Controlled / Uncontrolled y Restablecimiento de Fábrica:** [`StudySidePanel`](../../../frontend/web/src/app/(bible)/shared/ui/StudySidePanel.tsx) implementa el estándar nativo de componentes de React:
    * **Modo Controlado:** Si el padre pasa `width` (como `BibleNavigationSidebar` vía `BiblePassageContext`), el componente delega el control al contexto sin bifurcaciones arbitrarias.
    * **Modo Autónomo:** Si no se pasa `width` (como en los paneles modulares de `atlas`, `timeline`, `archaeology`, `evangelism`, `interlinear`), el panel gestiona su propio estado local en memoria inicializado en `initialWidth` (`defaultWidth ?? 280px / 340px`).
    * **Cero Efectos Secundarios:** Se eliminó cualquier persistencia en `localStorage`, escuchas residuales en listeners de `resize` o limpiezas artificiales en `useEffect`. Al recargar la página (F5) o reiniciar la aplicación, todos los paneles en todos los módulos se montan síncronamente en su estado original de fábrica (laterales cerrados y anchos exactos de diseño).
  * **Eliminación de Código Duplicado y Cabecera Móvil Integrada:** Al centralizar la barra móvil en el shell maestro a través de las propiedades `title`, `icon` y `badge`, se eliminaron 16 instancias de marcado HTML duplicado (`<div className="flex lg:hidden ...">`) y handlers de cierre huérfanos a lo largo de todas las carpetas de `features/` y `widgets/`.
  * **Gobernanza de Accesibilidad y Foco WAI-ARIA (`inert` & `blur`):** Al colapsar el panel lateral (`isOpen === false`), el shell aplica el atributo estándar HTML `inert` y libera preventivamente el foco del teclado de cualquier elemento descendiente (`document.activeElement.blur()`). Esto previene que botones o enlaces cerrados retengan foco oculto, garantizando cumplimiento estricto con la especificación W3C WAI-ARIA y eliminando bloqueos de navegación para tecnologías de asistencia.

* **Tirador de Redimensión Reactivo (`ResizeBorderHandle.tsx` en `shared/ui`):**
  * **Soporte Sincrónico Dual y Minimalismo Neutro:** Gestiona tanto `side="left"` como `side="right"` con una línea nítida de exactamente **1px** (`w-[1px]`), sin sombras borrosas, sin tintes rojos agresivos y con estética Geist sobria. En reposo permanece transparente sobre el borde estructural de 1px, en hover se ilumina suavemente (`bg-zinc-300 dark:bg-zinc-700`) y en arrastre activo a `bg-zinc-400 dark:bg-zinc-500`.
  * **Zona de Pre-Aviso y Difuminado Progresivo (`AUTO_COLLAPSE_THRESHOLD = 175px`):** Al arrastrar el panel hacia la pared, si el ancho desciende por debajo de 190px, el panel se va difuminando de forma suave y proporcional (`opacity: 1.0` $\rightarrow$ `0.2`), siendo este el único y suficiente indicador visual de proximidad al colapso automático. Si el usuario suelta el ratón en esa zona difuminada, el panel se desliza y desvanece de manera sedosa (`280ms cubic-bezier(0.16, 1, 0.3, 1)` hacia `0px`), restaurando el ancho ergonómico previo para la reapertura. Si el usuario regresa el ratón hacia adentro, el panel recupera su total opacidad al instante sin cerrarse.
  * **Límites de Contención Ergonómicos Simétricos:** Ambos paneles (izquierdo y derecho) comparten exactamente el mismo rango simétrico: desde un ancho mínimo compacto de `MIN_PANEL_WIDTH = 200px` (permitiendo comprimirlos a voluntad sin rebote) hasta un límite máximo de `MAX_PANEL_WIDTH = 480px` (hasta un 38% del viewport), garantizando paridad física idéntica y preservando `min-w-[440px]` en el lienzo central de lectura.
  * **Discriminación Clic vs. Arrastre:** Movimientos $\le 3\text{px}$ se interpretan como clic puro, conmutando el estado del panel. Doble clic ejecuta `onReset()` restaurando el ancho de fábrica (`300px` / `360px`).
  * **Aislamiento de Selección Global:** Durante el arrastre se desactiva `userSelect` y se fuerza `cursor: col-resize` en el documento global.

* **Máscara de Recorte Desacoplada ("Curtain Reveal" & Cinemática Adaptativa):**
  * **Cinemática Diferenciada por Dispositivo:**
    * **En Móvil (`< lg`):** El panel opera como un Drawer nativo de pantalla completa con deslizamiento físico completo (`translate-x-0` $\leftrightarrow$ `±translate-x-full`) mediante **aceleración por GPU** en 300ms con curva de desaceleración Geist `cubic-bezier(0.32, 0.72, 0, 1)`, fondo 100% sólido permanente (`bg-white dark:bg-[#121214]`) y sombra envolvente (`shadow-[0_0_50px_rgba(0,0,0,0.2)]`). Al estar el fondo anclado de forma fija a la estructura del `<aside>`, toda la unidad (fondo, bordes, cabecera y elementos hijos) se traslada como un único bloque sólido, erradicando desincronizaciones donde el fondo se vuelva transparente antes de que los elementos abandonen la pantalla. El *backdrop* difuso (`bg-black/40 backdrop-blur-[2px]`) se funde en armonía.
    * **En Desktop (`lg:`):** Se mantiene la cinemática **Linear / Notion**: el panel exterior modula su anchura (`lg:w-[var(--active-panel-w)]`) en 250ms mientras el contenedor interior acompaña la apertura con un micro-deslizamiento sutil de 16px (`translate-x-4` / `-translate-x-4` hacia `translate-x-0`) con desvanecimiento gradual, logrando que el lienzo de estudio se acomode suavemente.
  * Durante el arrastre manual con el mouse en el tirador, la transición CSS se desactiva instantáneamente (`transition-none`) permitiendo seguimiento de puntero a 120 FPS.
  * El contenedor interno mantiene su anchura base recortada por la máscara (`min-w-0 shrink-0 overflow-hidden`), impidiendo que los buscadores, botones o chips se compriman o salten de línea durante la animación de colapso o apertura.
  * **Cuadrícula de Capítulos Ergonómica:** 5 columnas uniformes con botones de altura fija de `32px` (`h-8 rounded-lg font-mono text-xs`), impidiendo la distorsión o crecimiento desmesurado de los números de capítulo.

* **Centrado Simétrico y Canvas Amplio de Estudio (`layout.tsx`):**
  * El contenedor central `<main>` implementa en desktop un padding horizontal estrictamente simétrico: **`lg:px-12` (48px exactos a ambos costados)**.
  * El espacio libre desde ambos bordes de la pantalla hasta el cuadro de estudio es **exactamente de 48px**, logrando una simetría visual y matemática perfecta y permitiendo que ambas lengüetas (`DraggableEdgeTab`, tirador vertical esbelto de `w-5 h-24` / 96px de altura con chevrones direccionales) respiren con margen libre sin invadir el cuadro de lectura.
  * El contenido central se envuelve en un contenedor **`max-w-[1780px] mx-auto`** con espaciado simétrico `lg:px-12` (48px), aprovechando al máximo el ancho horizontal hacia afuera para acomodar las herramientas exegéticas complejas (interlineal, lectura paralela, léxicos, mapas y cronologías) de forma uniforme en todos los módulos sin sentirse encogido ni colisionar con las lengüetas laterales.
  * **Navegación Secuencial Editorial Integrada (`ChapterNavigator.tsx`):** Se erradicaron los botones flotantes fijos en mitad de pantalla (`fixed top-1/2`) que quedaban aislados ("volando") en los márgenes exteriores. La navegación entre capítulos y libros continuos se ubica de forma elegante al final del pasaje de lectura mediante un bloque semántico `<nav>` con tarjetas de acceso directo (*«← Capítulo Anterior | Capítulo Siguiente →»*), manteniendo además intactos los listeners globales de atajos de teclado (`ArrowLeft` / `ArrowRight`).

---

## 7. Refinamientos de Alta Precisión Exegética

### 7.1 Atajos de Teclado Profesionales (*Power-User Keybindings*)
Integrado a través del hook [`useBibleKeybindings.ts`](../../../frontend/web/src/app/(bible)/hooks/useBibleKeybindings.ts) y activo en todas las suites de estudio:
* `[` $\rightarrow$ Alternar panel de navegación canónica izquierdo (`toggleLeftSidebar`).
* `]` $\rightarrow$ Alternar inspector exegético derecho (`toggleRightInspector`).
* `←` / `→` $\rightarrow$ Navegación rápida al capítulo anterior / siguiente (`prevChapter` / `nextChapter`).
* `Escape` $\rightarrow$ Cerrar el inspector exegético o deseleccionar texto.
* *Aislamiento de Inputs:* Los atajos de navegación y paneles se desactivan automáticamente cuando el foco está sobre elementos de texto (`input`, `textarea`, `select`, `isContentEditable`) para permitir escribir normalmente en los buscadores.

### 7.2 Barra de Lectura y Control Exegético (`ReaderToolbar.tsx`)
* **Arquitectura de Fila Única Unificada (Single-Row Streamlined):**
  * **En Móvil (`< sm` / `< 640px`):** Estructura horizontal compacta en una sola fila (`h-8`, altura total del card ~44px), eliminando el doble piso y los espacios en blanco artificiales:
    * *Extremo Izquierdo:* Navegación completa `< Génesis 1 ⌄ >` (`UnifiedPassagePicker`) seguida directamente de la versión `[NBLA ⌄]` (`TranslationSelector` + `BibleSelect` sin cuadro interno).
    * *Extremo Derecho:* Popover de apariencia editorial `Aa` (que integra de forma centralizada el conmutador de modo continuo/versículo `[ ≡ | 1 2 ]`, familias tipográficas, tamaños y tonos) y menú compacto de acciones `···` (`MoreHorizontal`) que agrupa:
      - Copiar Capítulo (`❐`)
      - Modo Enfoque Inmersivo (`⤢`)
      - Imprimir / Exportar a PDF (`🖶`)
  * **En Desktop (`>= 640px` / `sm:`):** Flujo horizontal extendido donde los botones de acción (`⤢`, `❐`, `🖶`) se despliegan directamente en la barra con separador vertical, el selector de versión se expande a `w-56`, y el modo de lectura se mantiene unificado exclusivamente dentro de `Aa` para eliminar redundancias visuales.
* Popover `Aa` desacoplado con cierre automático en click exterior (`useRef` y evento `mousedown`).

### 7.3 Modo Impresión y Exportación Limpia (*Print / Pulpit Mode*)
* Reglas dedicadas `@media print` en [`globals.css`](../../../frontend/web/src/app/(bible)/globals.css) y etiquetas `print:hidden`:
  * Ocultamiento automático de barras de navegación superior, paneles laterales, toolbars, botones de interacción y footers.
  * Supresión de bordes, sombras y márgenes innecesarios (`print-clean`).
  * Protección contra saltos de página partidos en versículos (`page-break-inside: avoid`).
  * Botón directo de **Imprimir / Exportar a PDF** en [`ReaderToolbar.tsx`](../../../frontend/web/src/app/(bible)/features/verses/components/reader-toolbar/ReaderToolbar.tsx).

### 7.4 Arquitectura Ergonómica Adaptativa: Pestañas Laterales Discretas en PC y Círculos Flotantes en Móvil (`DraggableEdgeTab.tsx` & `BibleHeaderNav.tsx`)
* **Arquitectura Dual por Factor de Forma:**
  * **En Desktop (`>= 1024px` / `lg:`): Pestañas de Borde Ultra-Discretas y Cabecera Pura:**
    * **Pureza Arquitectónica de la Cabecera:** Se eliminaron los botones de panel de la barra superior, devolviéndole su función macro de identidad y navegación entre suites (`← Atrás | Logo` a la izquierda, 8 suites con centrado geométrico absoluto, y selector de idioma/tema a la derecha), con estilo monocromático Geist idéntico a Vercel Dashboard.
    * **Tiradores Verticales Esbeltos en los Marcos (Proporción Áurea 1:3):** Las pestañas de borde flotan en los marcos exteriores (`left: 0` y `right: 0`), donde existen más de 400px de margen libre sin obstruir la lectura. Presentan un diseño estilizado de tan solo 20px de saliente horizontal por 56px de alto (`w-5 h-14 rounded-r-md` / `rounded-l-md`), reduciendo a más de la mitad el saliente visual previo y adoptando **chevrons direccionales finos** (`ChevronRight` a la izquierda y `ChevronLeft` a la derecha) con micro-animación en hover (`translate-x-0.5`). Cuentan con borde nítido `border-zinc-200 dark:border-zinc-800`, fondo 100% sólido y opaco (`bg-white dark:bg-[#121214]` sin transparencias), y persistencia de posición vertical en `localStorage`.
    * **Atajos de Teclado Profesionales:** Se mantiene la alternancia instantánea mediante las teclas **`[`** (selector de libros) y **`]`** (inspector exegético).
  * **En Móvil (`< 1024px` / `< lg`): Dos Botones Circulares Ergonómicos con Iconografía Semántica Dinámica:**
    * Botones circulares flotantes de 48px (`w-12 h-12 rounded-full`) ubicados en la zona natural del pulgar (`bottom: calc(20px + env(safe-area-inset-bottom, 0px))`).
    * **Iconografía Contextual por Módulo (Cero Disonancia Cognitiva):** En lugar de iconos genéricos estáticos, cada botón exhibe dinámicamente el icono exacto de la herramienta que va a abrir:
      * *Lector Estándar:* Izquierda `BookOpen` (Libros canónicos) | Derecha `Languages` (Cotejo de versiones y Morfología Strong).
      * *Comparador Paralelo:* Izquierda `Columns3` (Gestor de columnas) | Derecha `GitCompare` (Diff LCS).
      * *Interlineal Inverso:* Izquierda `Scroll` (Manuscrito y capas) | Derecha `Languages` (Morfología Strong).
      * *Léxicos y Diccionarios:* Izquierda `BookA` (Índice léxico) | Derecha `BarChart3` (Ocurrencias y distribución).
      * *Atlas Bíblico:* Izquierda `Map` (Lugares y rutas) | Derecha `Compass` (Ficha georreferenciada).
      * *Cronología Histórica:* Izquierda `History` (Línea de tiempo) | Derecha `Clock` (Ficha del monarca/imperio).
      * *Arqueología Bíblica:* Izquierda `ScrollText` (Feed de hallazgos) | Derecha `Landmark` (Ficha del artefacto/sitio).
      * *Evangelización:* Izquierda `Compass` (Rutas bíblicas) | Derecha `Sparkles` (Bosquejos y apologética).
    * **Interacción Táctil Directa y Cero Fallos:** Enlace `onClick={onOpen}` nativo del navegador con micro-feedback `active:scale-90`, eliminando bloqueos por puntero o interferencias con gestos del sistema operativo.
    * **Estética Sólida Geist:** Acabado con borde nítido `border-zinc-200 dark:border-zinc-800` y fondo 100% sólido opaco (`bg-white dark:bg-[#121214]` sin transparencias), asegurando legibilidad y contraste óptimo.
    * **Auto-Ocultamiento:** Al desplegarse el drawer lateral (`isOpen === true`), los botones se desvanecen suavemente (`opacity-0 pointer-events-none scale-75`) para despejar la vista.
    * **Despliegue Asimétrico y Respeto Absoluto del Header en `StudySidePanel`:** En móvil (`< lg`), el shell (`<aside>`) y el backdrop operan mediante posicionamiento `absolute inset-y-0` anclado al contenedor del workspace (`relative`), confinados exactamente bajo la cabecera superior (`BibleHeaderNav`, `h-14`, `z-50`). Esto garantiza que la barra superior (`Atrás | Logo | Modo | Idioma | Tema`) permanezca siempre visible y 100% accesible sin ser tapada ni oscurecida por el drawer. El panel izquierdo emerge desde la izquierda (`-translate-x-full` $\rightarrow$ `translate-x-0`) y el inspector derecho desde la derecha (`translate-x-full` $\rightarrow$ `translate-x-0`), con contención responsive `max-w-[85vw]`.

### 7.5 Aprovechamiento Integral del Ancho de Pantalla (*Full-Width Canvas*)
* **Eliminación de Restricciones Artificiales:** Se retiraron las limitaciones rígidas (`max-w-4xl`, `max-w-5xl` y `max-w-7xl`) tanto en el Lector Estándar (`VerseList`, `ContinuousReadingView`, `LineByLineReadingView`) como en la Landing Page principal (`/bible` - `bible/page.tsx`).
* **Equidad Visual con Suites Exegéticas:** Tanto la vitrina del Live Preview como las suites de estudio aprovechan el lienzo de trabajo en monitores anchos (`w-full px-4 sm:px-6 lg:px-8 max-w-[1700px]`), ofreciendo una experiencia editorial inmersiva sin sensación de caja encogida en pantallas ultra-amplias.

### 7.6 Flujo Natural de la Barra y Visibilidad Editorial del Título
* **Flujo Natural sin Colisiones:** Se removió la fijación `sticky` de `ReaderToolbar.tsx`, unificándolo con el patrón del resto de suites (`ParallelStudyPage`, `InterlinearStudyPage`). La barra de herramientas fluye armónicamente con el contenido, eliminando para siempre las colisiones donde la barra flotaba por encima del título del libro ("Génesis") al desplazarse.
* **Alineación Superior al Ras (`pt-0`):** Se eliminó el padding superior del contenedor principal (`pt-0`) y se acortó el espaciado vertical (`space-y-2`), situando la barra de herramientas directamente debajo de la cabecera sin holguras vacías.
* **Presencia Editorial del Capítulo:** Con `pt-8` y `pb-6 mb-6`, el título del libro y el capítulo destacan con elegancia editorial completa y nunca son ocluidos ni cortados.

### 7.7 Comportamiento Predeterminado de Laterales en PC y Móvil (*Workspace Layout Engine*)
* **Gestión Centralizada en `BiblePassageContext`:** El estado de apertura del panel lateral izquierdo (`isLeftSidebarOpen`) y del inspector exegético derecho (`isRightInspectorOpen`) se orquesta de forma centralizada y uniforme para los 8 módulos del Workspace Studio (`standard`, `parallel`, `interlinear`, `word-study`, `atlas`, `timeline`, `archaeology`, `evangelism`).
* **Regla Canónica por Factor de Forma:**
  * **En PC / Desktop (`>= 1024px` / `lg:`):** Por defecto, **ambos paneles laterales inician ABIERTOS** simultáneamente. El usuario dispone de inmediato del selector canónico de libros/capítulos a la izquierda, el lienzo editorial o interactivo al centro, y el inspector exegético/analítico a la derecha, aprovechando todo el ancho de monitores de escritorio y laptops sin clics previos.
  * **En Móvil / Tablet (`< 1024px`):** Por defecto, **ambos paneles inician CERRADOS**. Esto garantiza un lienzo de lectura limpio, accesible y libre de sobreposiciones modales o cortinas oscuras al cargar la página.
* **Transiciones Reactivas de Redimensionamiento (Resize Listener):**
  * Al transicionar la ventana de PC a móvil (`< 1024px`), ambos laterales se colapsan automáticamente para prevenir que drawers fijos cubran la pantalla.
  * Al transicionar de móvil a PC (`>= 1024px`), el sistema restaura fluidamente la vista de 3 columnas abierta por defecto (o según la preferencia guardada en `localStorage`).
* **Aislamiento de Persistencia:** Los toggles manuales solo escriben en `localStorage` (`bible_left_sidebar_open` y `bible_right_inspector_open`) cuando el usuario opera en desktop (`>= 1024px`), evitando que aperturas efímeras en móviles sobreescriban la configuración de escritorio.

### 7.8 Arquitectura Desacoplada App Shell y Auto-Hide Inteligente (`layout.tsx`, `BibleHeaderNav.tsx`)
* **Patrón App Shell de Estudio Profesional (Cero Layout Shifts - CLS = 0):** El workspace de estudio adopta la arquitectura canónica de IDEs y suites profesionales (Geist, Linear, VS Code):
  * **Marco Raíz Inamovible:** `h-screen flex flex-col overflow-hidden`. La ventana del navegador nunca produce scroll global ni desacomoda los paneles laterales.
  * **Auto-Hide Inteligente de Cabecera Acelerado por GPU (`BibleHeaderNav.tsx`):** La barra de 56px (`h-14`) cuenta con animación de deslizamiento inercial suave mediante traslación por hardware y margen inferior sincronizado (`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-y-full -mb-14 opacity-0`), erradicando el desfase de velocidades, el recorte de contenido y los recálculos de layout forzados (*layout reflow*). Al retornar (`translate-y-0 mb-0 opacity-100`), incorpora cristal esmerilado translúcido (*backdrop-blur-xl* al 85%), borde refinado y sombra ligera flotante.
    * **Zona de Reposo Serena (`scrollTop <= 200px`):** Los primeros 200px permanecen fijos para que el lector examine el título, la barra de herramientas o el pasaje sin que nada desaparezca.
    * **Ocultamiento por Intención Real (`>= 80px` continuos hacia abajo):** Solo al rebasar la zona de reposo y demostrar lectura continuada, la barra se desliza fluidamente hacia arriba fuera del viewport.
    * **Reaparición Inmediata (`>= 25px` hacia arriba):** Cualquier retroceso o gesto ascendente restaura la cabecera al instante.
  * **Expansión Automática del Workspace:** Al retraerse la cabecera, la fila del workspace (`flex-1 min-h-0 overflow-hidden`) asciende suavemente a pantalla completa (`100vh`) sin saltos de lectura.
  * **Blindaje Total de Paneles Laterales (`BibleNavigationSidebar.tsx` e `Inspector`):** En desktop (`lg:`), actúan como columnas fijas acopladas (`lg:static lg:h-full`). Sus cabeceras (`[Todos | AT | NT]` y `[Morfología Strong]`) son `shrink-0` y residen siempre al tope de la fila, por lo que **jamás se cortan ni se empujan fuera de pantalla**.
  * **Canvas Central de Lectura (`<main>`):** Ocupa el espacio central (`flex-1 h-full overflow-y-auto`). La lectura de versículos se desplaza a 120 FPS sin colisiones y dispara los eventos de intención de forma nativa.
  * **Footer Editorial Integrado:** El pie de página con información legal y enlaces canónicos se aloja al final del canvas de lectura (`<main>`).

### 7.9 Botones Flotantes Laterales de Cambio de Capítulo Adaptables (`ChapterNavigator.tsx`)
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

### 7.11 Los 8 Módulos Canónicos de Estudio y sus Paneles Especializados Desacoplados
* **Arquitectura de Navegación de Primer Nivel en Cabecera (`BibleHeaderNav.tsx`):**
  Cada módulo de estudio cuenta con su pestaña directa de primer nivel en la cabecera superior persistente, eliminando niveles de anidamiento artificiales:
  1. **Lectura Estándar (`/study/standard`):** Lectura editorial continua o versículo por versículo sin distracciones.
  2. **Cotejo Paralelo (`/study/parallel`):** Comparador sincrónico multi-versión (2 a 4 columnas) con cálculo diff textual.
  3. **Interlineal Inverso (`/study/interlinear`):** Desglose morfológico palabra por palabra sobre textos masoréticos (BHS) y griegos (NA28).
  4. **Análisis de Palabra (`/study/word-study`):** Diccionarios léxicos Strong (BDB, Gesenius, Thayer) y ocurrencias canónicas.
  5. **Atlas Bíblico (`/study/atlas`):** Atlas vectorial WGS84, itinerarios de peregrinación y visor 3D arquitectónico.
  6. **Cronología Sincrónica (`/study/timeline`):** Línea de tiempo sincrónica de reyes, profetas e imperios mundiales.
  7. **Arqueología Bíblica (`/study/archaeology`):** Feed de excavaciones, manuscritos milenarios y fichas epigráficas.
  8. **Evangelización y Apologética (`/study/evangelism`):** Módulo integral que agrupa Rutas Soteriológicas, Banco de Objeciones y Tratados/Bosquejos mediante sub-pestañas reactivas (`?tab=pathways | objections | tracts`).

* **Navegación Limpia y Directa sin Duplicidad:**
  Con la presencia de las pestañas directas en [BibleHeaderNav.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/%28bible%29/components/BibleHeaderNav.tsx), se eliminó el sub-conmutador secundario (`BibleViewModeSwitcher`), dejando la barra de herramientas (`ReaderToolbar` y `BiblePassageToolbar`) exclusivamente enfocada en pasaje, versión bíblica y opciones de lectura/párrafo, sin redundancias visuales pegadas bajo la cabecera.

* **Paneles Laterales e Inspectores Especializados por Módulo (`study/layout.tsx`):**
  Para erradicar la sobrecarga cognitiva y garantizar que cada herramienta cuente con interfaces adaptadas a su propósito de estudio (sin forzar un selector genérico de libros donde no aplica), el App Shell (`BibleStudyLayout`) orquesta paneles perimetrales independientes y especializados según la ruta activa (`usePathname()`):
  1. **Módulo 1: Lectura Estándar (`/study/standard`):**
     * **Panel Izquierdo (`BibleNavigationSidebar.tsx`):** Directorio de los 66 libros bíblicos organizados por testamentos (AT / NT) y categorías literarias, selector rápido de capítulos con resaltado activo y buscador reactivo instantáneo.
     * **Inspector Derecho (`BibleExegesisInspector.tsx`):** Análisis morfológico profundo Strong H/G, lemas hebreos/griegos, información gramatical y pestaña de versículos paralelos comparativos.
  2. **Módulo 2: Vista Paralela & Diff Textual (`/study/parallel`):**
     * **Panel Izquierdo (`ParallelSidebar.tsx`):** Gestor de columnas activas (2 a 4 versiones en simultáneo), presets de estudio rápido (*Equivalencia Formal, Dinámica, Textos Base Originales, Visión Panorámica*) y navegación rápida de pasaje.
     * **Inspector Derecho (`ParallelDiffInspector.tsx`):** Motor de cálculo diff textual en tiempo real (algoritmo LCS con similitud en porcentaje, resaltado cromático de adiciones en esmeralda y supresiones en ámbar), alternador de versículo de análisis y pestaña de morfología Strong.
  3. **Módulo 3: Interlineal Inverso Morfológico (`/study/interlinear`):**
     * **Panel Izquierdo (`InterlinearSidebar.tsx`):** Navegación canónica por tradición lingüística (*Torah, Nevi'im, Ketuvim* con indicación de secciones en Arameo Imperial vs *Evangelios, Hechos, Corpus Paulino, Epístolas Generales, Apocalipsis* en Griego Koiné), y controles granulares de capas morfológicas visibles (Nikkud, transliteración, glosas, números Strong y parsing).
     * **Inspector Derecho (`InterlinearInspector.tsx`):** Ficha léxica profunda del vocablo seleccionado con tipografía original a gran formato, pronunciación fonética IPA, reproductor de audio bíblico vocalizado (`biblicalAudioService`), análisis morfosintáctico y definiciones integradas de Gesenius, BDB y Thayer.
  4. **Módulo 4: Análisis de Palabra / Léxicos (`/study/word-study`):**
     * **Panel Izquierdo (`WordStudySidebar.tsx`):** Selector de corpus idiomático (Hebreo AT vs Griego NT), explorador de términos teológicos vertebrales (*Jesed, Shalom, Bara, Shuv, Kadosh, Berit, Logos, Agape, Charis, Koinonia, Pneuma, Dikaiosyne*) con conteo de ocurrencias, y buscador reactivo por código Strong, lema o glosa.
     * **Inspector Derecho (`WordStudyInspector.tsx`):** Ficha exegética del vocablo activo con lema, transliteración, glosa formal, concepto teológico central, lista interactiva de pasajes clave en el canon bíblico con enlaces directos y botón de copia formateada.
  5. **Módulo 5: Atlas Bíblico Cartográfico (`/study/atlas`):**
     * **Contexto:** `AtlasProvider` / `useAtlasContextSafe()`.
     * **Panel Izquierdo (`AtlasSidebar.tsx`):** Catálogo de lugares bíblicos agrupados por épocas y categorías (*Ciudades, Montes, Ríos y Mares, Yacimientos arqueológicos*), buscador reactivo con telemetría WGS84 y capas cartográficas.
     * **Inspector Derecho (`AtlasInspector.tsx`):** Telemetría georreferenciada WGS84 del lugar seleccionado, nombres originales (hebreo/griego), coordenadas, altitud y referencias bíblicas.
  6. **Módulo 6: Cronología Sincrónica (`/study/timeline`):**
     * **Contexto:** `TimelineProvider` / `useTimelineContextSafe()`.
     * **Panel Izquierdo (`TimelineSidebar.tsx`):** Explorador de las 8 Grandes Épocas Bíblicas (*Patriarcas, Éxodo, Monarquía Unida, Monarquía Dividida, Exilio, Segundo Templo, Apostólica*) y alternador de carriles sincrónicos (Reyes de Judá, Reyes de Israel, Profetas, Imperios Mundiales, Hitos).
     * **Inspector Derecho (`TimelineInspector.tsx`):** Ficha histórica sincrónica: fechas a.C./d.C., gobernantes contemporáneos, pasajes asociados y correlaciones políticas.
  7. **Módulo 7: Arqueología Bíblica (`/study/archaeology`):**
     * **Contexto:** `ArchaeologyProvider` / `useArchaeologyContextSafe()`.
     * **Panel Izquierdo (`ArchaeologySidebar.tsx`):** Filtro por tipos de registro (*Excavaciones Recientes, Manuscritos y Epigrafía, Confiabilidad Histórica*) y cuencas geográficas (*Jerusalén, Galilea, Jordán, Egipto, Asia Menor, Roma*).
     * **Inspector Derecho (`ArchaeologyInspector.tsx`):** Ficha arqueológica completa del hallazgo activo: datación, institución responsable, transcripción epigráfica y confirmación arqueológica del texto bíblico.
  8. **Módulo 8: Evangelización y Apologética (`/study/evangelism`):**
     * **Contexto:** `EvangelismProvider` / `useEvangelismContextSafe()`.
     * **Panel Izquierdo (`EvangelismSidebar.tsx`):** Conmutación contextual adaptada al sub-eje activo (`?tab=`):
       - *Rutas (`pathways`):* Catálogo de rutas soteriológicas secuenciales (*El Puente hacia la Vida, Las Cuatro Verdades, El Camino de Romanos*) con indicador de pasos.
       - *Objeciones (`objections`):* Filtro por categorías apologéticas temáticas (*Existencia de Dios, Confiabilidad de las Escrituras, El Problema del Mal, La Resurrección, Moralidad*) y buscador en vivo.
       - *Tratados (`tracts`):* Catálogo de tratados por público objetivo (*Jóvenes, Universitarios, Buscadores, Familia*) y bosquejos homiléticos.
     * **Inspector Derecho (`EvangelismInspector.tsx`):** Detalle exegético del paso activo, argumentación apologética rigurosa con consejos prácticos para el diálogo o bosquejo homilético completo con oración de fe y discipulado inicial.

* **Ergonomía Unificada, Redimensionamiento Interactivo Profesional y Control Total:**
  * **Sistema de Redimensionamiento Dinámico (`ResizeBorderHandle.tsx`):** Todos los módulos de estudio (los 8 entornos: Estándar, Paralelo, Interlineal, Lexicón de Palabras, Atlas Cartográfico, Cronología Sincrónica, Registro Arqueológico y Evangelización) cuentan con un divisor inteligente con soporte completo de captura de puntero (`pointer capture`, `cursor-col-resize`), permitiendo arrastrar fluidamente el ancho de los paneles laterales hacia afuera y hacia adentro en escritorio sin recortes ni latencias.
  * **Puntos de Anclaje y Protección del Canvas:** Límites elásticos protegidos mediante funciones `clamp`: el panel lateral izquierdo admite un rango entre 260px y el 45% del viewport, mientras que el inspector derecho admite entre 280px y el 48% del viewport, garantizando que el canvas central de lectura nunca colapse ni pierda legibilidad.
  * **Persistencia y Restablecimiento Rápido:** Los anchos personalizados se persisten automáticamente en `localStorage` (`bible_left_sidebar_width`, `bible_right_inspector_width`) de forma asíncrona tras el primer render para evitar desajustes de hidratación SSR. Un doble clic rápido en la zona de arrastre restablece instantáneamente el panel a su tamaño estándar de diseño (320px izquierda, 360px derecha).
  * **Sincronización Cinemática de Elementos Flotantes:** El navegador flotante de capítulos (`ChapterNavigator.tsx`) traslada dinámicamente sus botones de paginación `< Anterior` y `Siguiente >` mediante variables CSS vivas (`--desktop-left`, `--desktop-right`), manteniendo siempre una separación limpia de 20px respecto al borde visible del panel redimensionado.
  * **Coexistencia Dual de Colapso Rápido y Redimensionamiento:** La barra divisoria interactiva integra de forma limpia y sin conflictos ambos comportamientos mediante detección del delta de puntero: un clic directo (sin desplazamiento) en cualquier punto de la línea divisoria vertical o sobre el botón central estilo DIITRA `(→|←)` colapsa u oculta el panel inmediatamente; mientras que presionar y mover el cursor arrastra y redimensiona suavemente el ancho del panel.

* **Arquitectura Libre de Hardcoding e Internacionalización Total (`next-intl`):**
  * Todos los perfiles contextuales (`BookHistoricalProfile`, `EvangelismApologeticsProfile`, `StrongMorphologyInspector`, `ParallelVerseInspector`, `BibleHeaderNav`, `BiblePurposeSection`, etc.) se encuentran 100% desacoplados de cadenas literales y consumen diccionarios simétricos en `messages/es.json` y `messages/en.json`.
  * Los glosarios soteriológicos, descripciones canónicas, etiquetas de navegación y badges morfológicos son reactivos y se adaptan al idioma de estudio seleccionado en el cliente o servidor.

* **Auditoría de Calidad y Buenas Prácticas en las 8 Suites de Estudio (Cero Parches):**
  * **Tipado Estricto sin Casts Inseguros (`as any`):** Todas las suites (`Standard`, `Parallel`, `Interlinear`, `Word Study`, `Atlas`, `Timeline`, `Archaeology`, `Evangelism`) cuentan con interfaces TypeScript unívocas en sus contextos, hooks y paneles. Las claves de filtros históricos sincronizan exactamente con el estado visible (`judah`, `israel`, `prophets`, `empires`, `milestones`), eliminando desalineaciones y casts arbitrarios.
  * **Eliminación Total de Estados Iniciales Quemados (*Hardcoding*):** Se erradicaron las inicializaciones estáticas forzadas (como `'H2617'` o `'romans-road'`) en los hooks y contextos de `Evangelism` y `LexiconContext`. La selección de términos y rutas es 100% determinística y dinámica: al cargar el catálogo o cambiar de idioma bíblico (hebreo vs griego), el estado sincroniza reactivamente con el primer elemento del corpus correspondiente.
  * **Unificación de Contexto Compartido en Canvas y Paneles:** Se aseguró que los lienzos centrales (ej. `TimelineDashboard`) consuman el contexto global provisto (`TimelineContextSafe`) en lugar de instanciar copias locales redundantes del hook, garantizando reactividad instantánea entre los controles del lienzo, el sidebar y el inspector.
  * **Jerarquía Canónica y Ergonomía de Filtros:** En los selectores de modo (ej. `TimelineControls`), la opción panorámica global (`Todo Sincronizado`) se ubica siempre en la primera posición a la izquierda (`[Todo Sincronizado | Reyes vs Profetas | Biblia y Arqueología]`), manteniendo coherencia con el estándar de diseño del monorepo.
  * **Tipografía Dinámica y Contención de Desbordamiento (Diff Textual):** En el inspector de diferencias textuales (`ParallelDiffInspector`), los tokens de comparación morfológica y divergencia léxica se estructuran en un contenedor multilínea `flex flex-wrap gap-x-1 gap-y-1.5 break-words items-baseline max-w-full`, garantizando que cotejos con diferencias completas (como español vs inglés) ajusten y envuelvan naturalmente cada palabra sin desbordar los límites físicos de la tarjeta.
  * **Persistencia Resiliente y Desacoplada (`safeStorage`):** Se eliminó la duplicación dispersa de bloques `try ... catch` sobre `window.localStorage` en `BiblePassageContext`, encapsulando toda la interacción con el almacenamiento del navegador en el módulo puro `shared/utils/safeStorage.ts`. Provee tipado estricto (`getNumber`, `getBoolean`, `setItem`, `removeItem`), protección SSR automática y tolerancia a fallos en entornos de navegación privada o cuota restringida.
  * **Accesibilidad (a11y) y Semántica Web:** Todos los botones interactivos definen explícitamente su atributo `type="button"`, etiquetas descriptivas `aria-label` y roles de navegación semántica `<aside aria-label="...">` tanto en escritorio como en drawers móviles táctiles.
  * **Resiliencia ante Estados Nulos o Vacíos (Empty States):** Ningún inspector o panel lateral produce desbordamientos o lienzos en blanco cuando la selección es nula; cada entorno despliega una ficha técnica con instrucciones de uso y diseño Geist unificado cuando no hay versículo, término léxico, evento histórico, hallazgo arqueológico o ruta de evangelismo activa.

* **Sistema de Ergonomía Espacial, Medida Tipográfica y Calibración de Canvas (Spatial Grid & Line Measure):**
  * **Unificación de Cuadrícula Exterior y Centrado Geométrico Absoluto (*Grid Drift Zero*):** Se estandarizó el padding horizontal simétrico en `layout.tsx` a `px-3 sm:px-6 lg:px-8`, alineándose en el píxel exacto con la cabecera `BibleHeaderNav.tsx` (`32px` desktop, `24px` tablet, `12px` móvil). Además, en pantallas de escritorio (`lg:` en adelante) las 8 pestañas de navegación operan con **centrado geométrico absoluto** (`absolute left-1/2 -translate-x-1/2`), garantizando que el menú se posicione exactamente sobre el eje X del 50% de la pantalla sin verse afectado por la asimetría dimensional de los botones laterales (`Atrás/Logo` vs `Idioma/Tema`), con fallback elástico para resoluciones intermedias de tablet.
  * **Lector Estándar (`/study/standard`):** Contención central en `max-w-4xl mx-auto` (`896px`), erradicando el "efecto sábana" en pantallas panorámicas y manteniendo el ritmo áureo de 70 a 80 caracteres por línea en prosa continua y versículo a versículo.
  * **Cotejo Paralelo Adaptativo (`/study/parallel`):** El ancho del contenedor responde proporcionalmente a la cantidad de columnas activas (`columns.length`):
    - *1 versión:* `max-w-3xl mx-auto` (~768px, lectura enfocada).
    - *2 versiones:* `max-w-5xl mx-auto` (~1024px, ~500px por columna, eliminando el vacío central y optimizando el cotejo visual).
    - *3 versiones:* `max-w-7xl mx-auto` (~1280px).
    - *4 versiones:* `max-w-full` (aprovecha los 1780px del layout general).
  * **Interlineal Inverso (`/study/interlinear`):** Contención en `max-w-5xl mx-auto` (`1024px`), eliminando el vacío asimétrico lateral en modo hebreo masorético (RTL) y unificando el campo focal con la traducción fluida en español.
  * **Diccionario Léxico Teológico (`/study/word-study`):** Contención en `max-w-6xl mx-auto` (`1152px`), balanceando la proporción del navegador de raíces (`~360px`) y el cuerpo monográfico de exégesis filológica BDB/Gesenius (`~750px`).
  * **Arqueología Bíblica (`/study/archaeology`):** Contención en `max-w-6xl mx-auto` (`1152px`), garantizando densidad óptima de lectura tanto en artículos (`grid-cols-2`) como en el catálogo de manuscritos antiguos (`grid-cols-3`).
  * **Evangelismo y Apologética (`/study/evangelism`):** Contención en `max-w-5xl mx-auto` (`1024px`), facilitando una lectura íntima y concentrada para las rutas de versículos, diálogos apologéticos y folletos impresos.
  * **Lienzos Cartográficos y Cronográficos (`/study/atlas` y `/study/timeline`):** Mantienen el ancho total del viewport (`max-w-[1780px]`) para maximizar la telemetría espacial del mapa interactivo y el eje cronológico de imperios, profetas y reyes sin recortes.

* **Arquitectura de Paneles Laterales de Adaptación Contextual por Contenido (`Content-Adaptive Sidebars & Inspectors`):**
  * **Principio de Eficiencia Espacial Adaptada:** Los paneles no son forzados a un ancho estático rígido universal, sino que se adaptan con precisión milimétrica a la densidad y complejidad del contenido que albergan:
    - **Paneles Laterales Izquierdos (Navegación y Árboles Canónicos):**
      * *Lector Estándar (`BibleNavigationSidebar`):* `280px` (`defaultWidth`). Ancho áureo de Fitts' Law para listas de texto y cuadrícula de 5 columnas de capítulos, liberando el 100% de aire al folio de lectura.
      * *Léxicos, Arqueología y Evangelismo (`WordStudySidebar`, `ArchaeologySidebar`, `EvangelismSidebar`):* `320px` (`defaultWidth`). Espacio balanceado para buscadores semánticos, badges de categorías y conmutadores segmentados de 2 a 3 pestañas.
      * *Paralelo, Interlineal, Atlas y Cronología (`ParallelSidebar`, `InterlinearSidebar`, `AtlasSidebar`, `TimelineSidebar`):* `340px` (`defaultWidth`). Ancho expandido para fichas de presets, conmutadores de capas morfológicas (Nikkud, transliteración, glosas), selectores de 8 épocas y 5 carriles sincrónicos.
    - **Inspectores Laterales Derechos (Lectura, Fichas de Exégesis y Análisis):**
      * *Lector Estándar (`BibleExegesisInspector`):* `340px` (`defaultWidth`). Diseñado para tarjetas de versículos de comparación rápida y morfología lematizada.
      * *Módulos Avanzados (7 restantes):* `360px` (`defaultWidth`). Espacio idóneo para el motor de diff textual (`ParallelDiffInspector`), fichas léxicas completas con audio y gramática (`InterlinearInspector`), concordancia BDB (`WordStudyInspector`), telemetría WGS84 (`AtlasInspector`), biografías históricas (`TimelineInspector`), registros de excavaciones (`ArchaeologyInspector`) y asistentes de diálogo apologético (`EvangelismInspector`).
  * **Persistencia Aislada por Módulo (`storageKey`):** Cada panel almacena su dimensión redimensionada de forma estrictamente desacoplada en `localStorage` (`safeStorage.ts`), impidiendo que el ajuste manual de una herramienta afecte a las demás (`bible_parallel_sidebar_w`, `bible_interlinear_inspector_w`, etc.).
  * **Límites de Seguridad Físicos (`clamp`):** Todos los paneles operan bajo límites elásticos entre `200px` (mínimo) y `480px` (máximo) para salvaguardar la visibilidad y ergonomía del canvas central en cualquier resolución.
  * **Restablecimiento Instantáneo:** Soporte de doble clic sobre la manija de redimensionamiento (`ResizeBorderHandle`) para revertir inmediatamente cualquier panel a su valor de fábrica predeterminado.

* **Botones Flotantes de Acceso Rápido y Ergonómicos en Móvil (`DraggableEdgeTab.tsx`):**
  - **Transformación Responsiva Contextual:** En pantallas móviles (`< lg`), las lengüetas laterales a media altura se convierten en **dos botones circulares flotantes** (`w-12 h-12 rounded-full`, sombra flotante difusa, borde sutil y fondo translúcido con blur OLED) ubicados en las esquinas inferiores (`bottom: 20px left: 16px` para el panel izquierdo y `bottom: 20px right: 16px` para el inspector derecho).
  - **Física de Arrastre 2D Libre:** El usuario puede tocar y arrastrar libremente el círculo en cualquier dirección si necesita despejar u observar una línea de texto situada debajo.
  - **Snap-Back Magnético Obligatorio hacia la Base Inferior:** Al soltar el puntero (`handlePointerUp` / `handlePointerCancel`), el botón ejecuta una transición elástica suave (`320ms cubic-bezier(0.16, 1, 0.3, 1)`), **regresando siempre y de forma obligatoria a su anclaje inferior**. No se queda flotando en medio del texto bíblico.
  - **Discriminación de Tap vs Arrastre:** Un toque limpio sin desplazamiento (< 6px) abre instantáneamente el panel/drawer correspondiente. Si hubo arrastre, se ignora la apertura y solo se ejecuta el snap-back.
  - **Auto-Ocultamiento al Abrir:** Cuando el panel lateral correspondiente se encuentra abierto (`isOpen`), el botón circular se oculta con una micro-animación de escala y desvanecimiento (`opacity-0 scale-75 pointer-events-none`).
* **Sistema de Desplazamiento Ultrafino y Erradicación de Scroll Anidado (Scrollbar Architecture & Zero Nested Scroll):**
  - **Erradicación del Antipatrón de Scroll Anidado (`BibleNavigationSidebar.tsx`):** Se eliminó la contención artificial de altura fija (`max-h-48 overflow-y-auto`) dentro del acordeón de capítulos. Al expandirse cualquier libro (como Génesis o Salmos), la cuadrícula de 5 columnas fluye de manera natural dentro del contenedor padre `StudySidePanelBody`, eliminando el efecto de doble barra de desplazamiento y trampas de puntero.
  - **Utilidad Reutilizable de Calibre Hairline (`.bible-scrollbar-slim` en `globals.css`):**
    * **Espesor Minimalista (2px):** Se configuró en `2px` de espesor (`width: 2px; height: 2px;`), proporcionando una referencia visual discreta, elegante y no invasiva para la lectura prolongada acorde a la estética Geist.
    * **Riel y Cápsula:** Riel 100% transparente (`background: transparent`) con cápsula redondeada (`rounded-full`) calibrada en reposo (`rgba(161, 161, 170, 0.6)`) y acentuada en estado interactivo (`:hover` a `0.95`).
    * **Compatibilidad Multiplataforma Desacoplada (WebKit vs Firefox):**
      - *Chromium / WebKit (Chrome, Edge, Safari):* Se evitó declarar `scrollbar-width` de forma directa en el selector principal, resolviendo el conflicto de la especificación *W3C CSS Scrollbars Level 1* donde Chromium ignora `::-webkit-scrollbar` y renderiza la barra nativa gruesa de Windows (~12px).
      - *Firefox:* Reglas aisladas bajo la condición `@supports not selector(::-webkit-scrollbar)` con `scrollbar-width: thin` y `scrollbar-color`.
    * **Implementación Sistémica:** Integrado directamente en el contenedor central de lectura `<main>` en `study/layout.tsx` y en el contenedor base `StudySidePanelBody` en `StudySidePanel.tsx`, garantizando que todos los paneles laterales (los 8 módulos de estudio) y los inspectores exegéticos compartan de forma homogénea el mismo estándar visual.


