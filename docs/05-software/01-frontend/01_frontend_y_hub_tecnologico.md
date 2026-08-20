# Software Hub - Frontend y Plataforma Tecnológica (Next.js)

Este documento detalla la arquitectura macro y micro, componentes, categorías temáticas y diseño del **Software Hub** (`software.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Subdominio:** `software.jorgedoicela.com` (o `http://software.localhost:3001` en local).
> * **Enrutamiento:** `src/middleware.ts` reescribe el host hacia el grupo de rutas `frontend/web/src/app/(software)/`.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`, VPS 1 GB RAM).
> * **Aislamiento de Dominio:** Estilos independientes en `(software)/globals.css`. Cero importaciones de otros subdominios.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD):** `features/articles/` (noticias, blog, IA, seguridad, foros) y `features/projects/` (proyectos del autor).
> * **Jerarquía de Componentes:** Componentes encapsulados localmente con sus propios hooks y tipos.
> * **Estética Neumorphism UI + Glassmorphism:** Paneles táctiles cóncavos/convexos combinados con desenfoques vítreos translúcidos, reflejos esmerilados y sombras suaves superpuestas.

---

## 2. Estructura de Rutas y FSD

```text
frontend/web/src/app/(software)/
├── globals.css                # Estilos aislados del Software Hub (Neumorphism UI + Glassmorphism)
├── layout.tsx                 # Layout raíz del subdominio
├── software/
│   └── page.tsx               # Contenedor de la vista principal
│
└── features/                  # FEATURE-SLICED DESIGN (FSD)
    ├── articles/              # FEATURE: ARTÍCULOS, NOTICIAS, BLOG, IA, SEGURIDAD, FOROS
    │   ├── components/
    │   │   ├── ArticleCard.tsx    # Tarjeta táctil neumórfica con bordes vítreos
    │   │   ├── ArticleGrid.tsx    # Malla interactiva de publicaciones
    │   │   ├── CategoryNav.tsx    # Barra de navegación neumórfica por 7 categorías
    │   │   └── ForumSection.tsx   # Módulo de debates comunitarios
    │   ├── hooks/
    │   │   ├── useArticles.ts     # Petición a /software/articles
    │   │   └── useForum.ts        # Petición a /software/forum
    │   └── types.ts
    │
    └── projects/              # FEATURE: CATÁLOGO DE PROYECTOS SHOWCASE
        ├── components/
        │   ├── ProjectCard.tsx    # Tarjeta de proyecto con estética neumórfica y cristal
        │   └── ProjectGrid.tsx    # Malla de proyectos
        ├── hooks/
        │   └── useProjects.ts     # Petición a /software/projects
        └── types.ts
```

---

## 3. Las 7 Categorías del Hub

1. **Noticias:** Novedades y actualidad del desarrollo de software y tecnología.
2. **Blog:** Artículos de opinión, reflexiones y arquitectura técnica.
3. **Foros:** Espacio comunitario para debates técnicos y resolución de dudas.
4. **Inteligencia Artificial:** Agentes, modelos de lenguaje, visión artificial y herramientas de IA.
5. **Ciberseguridad:** Avisos de vulnerabilidades, guías de bastionado y seguridad defensiva/ofensiva.
6. **Tutoriales y Guías:** Manuales paso a paso con código reproducible.
7. **Proyectos:** Catálogo de sistemas, librerías y herramientas desarrolladas por Jorge.

---

## 4. Componentes de Interfaz y Estética Neumorphism UI + Glassmorphism

* **Fusión Neumórfica y Vítrea:** Contenedores y tarjetas que combinan sombras cóncavas/convexas suaves con fondos de cristal esmerilado translúcido (`backdrop-blur-md`).
* **Header Satinado Convexo:** Introducción visual con selector de tema claro/oscuro y chip de titanio grabado.
* **Barra de Navegación Neumórfica (`CategoryNav`):** Filtros rápidos interactivos entre las 7 categorías temáticas con pulsación háptica visual.
* **Buscador en Tiempo Real:** Entrada de texto con profundidad inset neumórfica y filtro instantáneo por etiquetas (`tags`), autor o texto.
