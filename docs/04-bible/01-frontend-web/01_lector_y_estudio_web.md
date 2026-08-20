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
> * **Feature-Sliced Design (FSD):** Cada una de las 12 herramientas exegéticas está encapsulada en su propia subcarpeta funcional dentro de `(bible)/features/` (`verses`, `books`, `translations`, `interlinear`, `parallel-view`, etc.).
> * **Header Unificado:** `BibleHeaderNav.tsx` en 1 sola línea horizontal fija.

---

## 2. Estructura de Rutas y Navegación

El subdominio cuenta con dos vistas principales y 12 módulos de estudio:

```text
frontend/web/src/app/(bible)/
├── globals.css                # Estilos aislados de la biblia (Vercel / shadcn Look)
├── layout.tsx                 # Layout raíz del subdominio
├── bible/
│   ├── page.tsx               # Landing Page de presentación y Live Preview
│   └── study/
│       └── page.tsx           # Espacio de trabajo exegético
│
├── components/                # COMPONENTES DEL SUBDOMINIO
│   ├── BibleHeaderNav.tsx     # Header superior en 1 sola línea horizontal fija
│   ├── BibleStudyWorkspace.tsx # Orquestador de las 9 herramientas de estudio
│   └── ...
│
└── features/                  # FEATURE-SLICED DESIGN (FSD)
    ├── verses/                # Feature: Lectura continua y selector de pasajes
    │   ├── components/
    │   │   ├── reader-toolbar/ReaderToolbar.tsx  # Barra compacta con chips de capítulos
    │   │   └── continuous-view/ContinuousReadingView.tsx # Canvas editorial de lectura
    │   └── hooks/useVerses.ts
    ├── books/                 # Feature: Catálogo de 66 libros canónicos (hooks/useBooks.ts)
    ├── translations/          # Feature: Selector de versiones (RV1960, NVI, LBLA, KJV, BHS, LXX)
    ├── parallel-view/         # Feature: Comparador multi-columna alineado por versículo
    ├── textual-diff/          # Feature: Algoritmo LCS para resaltar variantes textuales
    ├── interlinear/           # Feature: Interlineal inverso Hebreo, Arameo y Griego
    ├── literary-analysis/     # Feature: Detector de quiasmos y estructuras poéticas
    ├── lexicons/              # Feature: Diccionarios académicos BDB, Thayer, Gesenius
    ├── grammar-search/        # Feature: Búsqueda gramatical y concordancia FTS5
    ├── atlas/                 # Feature: Cartografía georreferenciada 3D
    └── timeline/              # Feature: Línea de tiempo sincrónica (reyes vs profetas)
```

---

## 3. Los 9 Motores de Estudio Exegético

1. **Lectura Continua (`features/verses/`):** Modo prosa editorial con sangría, números superíndices y copia contextual de citas.
2. **Vista Paralela (`features/parallel-view/`):** Comparación simultánea de 2 a 4 versiones sincronizadas por capítulo.
3. **Diff Textual (`features/textual-diff/`):** Algoritmo de Diferencia de Texto para resaltar adiciones, omisiones y divergencias de traducción.
4. **Interlineal Inverso (`features/interlinear/`):** Desglose palabra por palabra con Texto Masorético vocalizado (Hebreo/Arameo) y NA28 (Griego Koiné).
5. **Análisis Literario (`features/literary-analysis/`):** Detección visual de quiasmos simétricos y diagramas de discurso.
6. **Léxicos Integrados (`features/lexicons/`):** Diccionarios académicos indexados por códigos Strong.
7. **Búsqueda Gramatical (`features/grammar-search/`):** Filtros avanzados por atributos morfológicos y lemas.
8. **Atlas Bíblico 3D (`features/atlas/`):** Rutas históricas georreferenciadas (Éxodo, viajes de Pablo, ministerio de Jesús).
9. **Cronología Sincrónica (`features/timeline/`):** Sincronización histórica de Reyes de Israel/Judá con profetas e imperios.
