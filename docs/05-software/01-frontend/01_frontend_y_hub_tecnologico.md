# Software - Frontend y Plataforma Tecnológica (Next.js)

Este documento detalla la arquitectura macro y micro, componentes, categorías temáticas y diseño de **Software** (`software.jorgedoicela.com`).

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
> * **Feature-Sliced Design (FSD):** `features/news/`, `features/blog/`, `features/forum/`, `features/ai/`, `features/cybersecurity/`, `features/tutorials/`, `features/projects/`, `features/navigation/`.
> * **Internacionalización Integral (i18n):** Soporte bilingüe completo (`es` / `en`) mediante `next-intl` en `messages/{es,en}.json` para las 7 categorías, barras de navegación (`MenuBar`, `Dock`), badges, metadatos, y consumo bilingüe dinámico hacia el backend vía `?lang=${locale}`.
> * **Jerarquía de Componentes:** Componentes encapsulados localmente con sus propios hooks y tipos.
> * **Estética Neumorphism UI + Glassmorphism:** Paneles táctiles cóncavos/convexos combinados con desenfoques vítreos translúcidos, reflejos esmerilados y sombras suaves superpuestas.

---

## 2. Estructura de Rutas y FSD

```text
frontend/web/src/app/(software)/
├── globals.css                       # Estilos aislados de Software (Neumorphism UI + Glassmorphism)
├── layout.tsx                        # Layout raíz del subdominio
├── software/                         # SUBRUTAS DE PÁGINAS INDIVIDUALES
│   ├── page.tsx                      # Vista principal de Software (Bento Grid + filtro dinámico de 7 categorías)
│   ├── news/
│   │   ├── page.tsx                  # Catálogo de noticias con buscador en tiempo real
│   │   └── [slug]/page.tsx           # Lector de noticia con fuente oficial
│   ├── blog/
│   │   ├── page.tsx                  # Catálogo de artículos del blog
│   │   └── [slug]/page.tsx           # Lector de ensayo con tabla de contenidos
│   ├── forum/
│   │   ├── page.tsx                  # Lista de temas del foro con filtros de estado
│   │   └── [slug]/page.tsx           # Hilo de discusión con árbol de respuestas y formulario
│   ├── ai/
│   │   ├── page.tsx                  # Directorio de modelos IA, agentes y MCP servers con filtro por tipo
│   │   └── [slug]/page.tsx           # Ficha técnica de modelo / agente / MCP server
│   ├── cybersecurity/
│   │   ├── page.tsx                  # Matriz de avisos con filtro por severidad (LOW a CRITICAL)
│   │   └── [slug]/page.tsx           # Aviso de seguridad con severidad y remediación
│   ├── tutorials/
│   │   ├── page.tsx                  # Malla de tutoriales con filtro por dificultad
│   │   └── [slug]/page.tsx           # Tutorial interactivo paso a paso (StepWizard)
│   └── projects/
│       ├── page.tsx                  # Galería showcase con filtro por estado (activo / en desarrollo)
│       └── [slug]/page.tsx           # Caso de estudio y arquitectura de proyecto
│
└── features/                         # FEATURE-SLICED DESIGN (FSD)
    ├── navigation/                   # CategoryNav (filtro de las 7 categorías)
    ├── news/                         # NewsCard, NewsGrid, useNews, types
    ├── blog/                         # BlogCard, BlogGrid, useBlog, types
    ├── forum/                        # TopicCard, ForumSection, useForum, types
    ├── ai/                           # AiCard, AiGrid, useAi, types
    ├── cybersecurity/                # SecurityCard, SecurityGrid, useCybersecurity, types
    ├── tutorials/                    # TutorialCard, TutorialGrid, useTutorials, types
    └── projects/                     # ProjectCard, ProjectGrid, useProjects, types
```

---

## 3. Las 7 Categorías de Software

1. **Noticias (`news`):** Novedades y actualidad del desarrollo de software y tecnología con alertas breaking.
2. **Blog (`blog`):** Ensayos profundos sobre arquitectura de software, patrones de diseño y buenas prácticas.
3. **Foros (`forum`):** Espacio comunitario para debates técnicos, preguntas y respuestas anidadas.
4. **Inteligencia Artificial (`ai`):** Modelos de razonamiento, agentes, servidores MCP y herramientas de IA.
5. **Ciberseguridad (`cybersecurity`):** Avisos con matriz de severidad (LOW a CRITICAL), guías de bastionado y remediación.
6. **Tutoriales y Guías (`tutorials`):** Manuales paso a paso con código reproducible y asistente StepWizard.
7. **Proyectos (`projects`):** Catálogo de sistemas, librerías y herramientas desarrolladas por Jorge con enlaces demo/repo.

---

## 4. Internacionalización y SEO Dinámico (next-intl)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Software.Metadata` en `src/messages/es.json` y `src/messages/en.json`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://software.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(software)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.
* **Diccionarios UI Localizados:** Soporte para traducción de nombres de las 7 categorías, placeholders del buscador y etiquetas de estado.

---

## 5. Componentes de Interfaz y Estética Neumorphism UI + Glassmorphism

* **Fusión Neumórfica y Vítrea:** Contenedores y tarjetas que combinan sombras cóncavas/convexas suaves con fondos de cristal esmerilado translúcido (`backdrop-blur-md`).
* **Header Satinado Convexo:** Introducción visual con selector de tema claro/oscuro y chip de titanio grabado.
* **Barra de Navegación Neumórfica (`CategoryNav`):** Filtros rápidos interactivos entre las 7 categorías temáticas con pulsación háptica visual.
* **Buscador en Tiempo Real:** Entrada de texto con profundidad inset neumórfica y filtro instantáneo por etiquetas (`tags`), autor o texto.

