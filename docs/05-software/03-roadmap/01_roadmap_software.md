# Roadmap y Funcionalidades: Software

Catálogo de requerimientos completados y objetivos futuros para **Software** (`software.jorgedoicela.com`).

---

## 1. Arquitectura y Módulos Completados
- [x] **Monolito Modular Backend (7 Submódulos):** `news`, `blog`, `forum`, `ai`, `cybersecurity`, `tutorials`, `projects` con controladores, servicios y entidades TypeORM independientes.
- [x] **Fuente de Verdad en `corpus/*.json`:** 7 datasets JSON estructurados que alimentan la base de datos de forma desacoplada.
- [x] **Seeder Atómico Transaccional:** Script CLI (`seed-software.ts`) que recrea y siembra 8 tablas en SQLite en 22 ms.
- [x] **Modelo Relacional Físico (`software.sqlite`):** 9 entidades registradas bajo `softwareConnection` con relaciones foráneas reales (`forum_replies` a `forum_topics`, `tutorial_steps` a `tutorials`).
- [x] **Frontend Web Next.js 16 (FSD):** 8 features modulares (`navigation`, `news`, `blog`, `forum`, `ai`, `cybersecurity`, `tutorials`, `projects`) con componentes, hooks y tipos desacoplados.
- [x] **Páginas de Catálogo Dedicadas:** `/software/news`, `/software/blog`, `/software/forum`, `/software/ai`, `/software/cybersecurity`, `/software/tutorials`, `/software/projects`.
- [x] **Lector Individual y Modo Interactivo `[slug]`:** Vistas individuales por categoría, incluyendo `StepWizard` interactivo para tutoriales e hilo de discusión para foros.
- [x] **Página Principal (`/software`):** Bento Grid interactivo, ticker de tecnologías, métricas de arquitectura y buscador en tiempo real con estética Neumorphism UI + Glassmorphism.

---

---

## 3. Internacionalización y SEO (next-intl)
- [x] **Metadatos SEO Dinámicos (`generateMetadata`):** Títulos, descripciones y Open Graph en español e inglés.
- [x] **Indexación Internacional (`hreflang`):** Etiquetas `es-EC` y `en-US` configuradas en `layout.tsx`.
- [x] **Cero Parpadeos (SSR):** Integración con `NextIntlClientProvider` y `messages/*.json`.
- [x] **Diccionarios UI Localizados:** Soporte para traducción de nombres de categorías y navegación.

