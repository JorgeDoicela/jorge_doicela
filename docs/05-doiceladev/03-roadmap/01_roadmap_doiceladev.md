# Roadmap y Funcionalidades: DoicelaDev

Catálogo de requerimientos completados y objetivos futuros para **DoicelaDev** (`doiceladev.jorgedoicela.com`).

---

## 1. Arquitectura y Módulos Completados
- [x] **Monolito Modular Backend (14 Submódulos):** 7 módulos editoriales homologados de solo lectura (`news`, `blog`, `ai`, `cybersecurity`, `tutorials`, `projects`, `infrastructure`), `forum`, `glossary` y 5 submódulos transversales (`portal`, `recommendations`, `categories`, `tags`, `newsletter`).
- [x] **Fuente de Verdad en `corpus/*.json`:** 9 datasets JSON estructurados y bilingües que alimentan la base de datos de forma desacoplada.
- [x] **Seeder Atómico Transaccional:** Script CLI (`seed-doiceladev.ts`) que recrea y siembra las 15 tablas en SQLite en < 100 ms.
- [x] **Modelo Relacional Físico (`doiceladev.sqlite`):** 15 tablas registradas bajo `doiceladevConnection` con núcleo común unificado (`title`, `excerpt`, `contentMarkdown`, `tags`, `likes`, `views`, `publishedAt`), encuestas del foro (`forum_poll_options`), relaciones foráneas e índices B-Tree alineados a `publishedAt`.
- [x] **Homologación Editorial y FSD:** Utilidades compartidas (`articlePage.ts`, `ArticleMetaPanel.tsx`, `category-aggregation.util.ts`) y especialización sobria por dominio en los 7 módulos editoriales (incluyendo Blog Personal en primera persona).
- [x] **Servicio Real e Idempotente de Suscripciones Técnicas (Newsletter):** Backend `POST /doiceladev/newsletter/subscribe`, validación RFC 5322, prevención de duplicados, soporte bilingüe (`es`/`en`) y segmentación analítica (`source`, `topicCategory`).
- [x] **Frontend Web Next.js 16 (FSD Canónico en 6 Capas):** Capas desacopladas `providers/`, `shared/` (UI, suite Markdown, SEO, lib, types), `entities/` (8 dominios temáticos + feed consolidado), `features/` (spotlight-search, forum-reply, newsletter-subscription, language-toggle, theme-toggle) y `widgets/` (header-nav, footer, category-nav, featured-carousel, article-layout, page-layout).
- [x] **Páginas de Catálogo Dedicadas:** `/doiceladev/news`, `/doiceladev/blog`, `/doiceladev/forum`, `/doiceladev/ai`, `/doiceladev/cybersecurity`, `/doiceladev/tutorials`, `/doiceladev/projects`, `/doiceladev/infrastructure` (o rutas raíz en subdominio `doiceladev.jorgedoicela.com`).
- [x] **Lector Individual y Modo Interactivo `[slug]`:** Vistas individuales por categoría, incluyendo `StepWizard` interactivo para tutoriales, hilo de discusión para foros y visor de especificaciones de hardware/servidor (`specs`) para infraestructura.
- [x] **Página Principal (`/doiceladev` o subdominio):** Bento Grid interactivo, ticker de tecnologías, métricas de arquitectura, spotlight command palette (`Cmd+K`) y buscador en tiempo real con estética Neumorphism UI + Glassmorphism.
- [x] **Sistema de Borradores Markdown (`drafts/` en FSD):** Carpetas `drafts/` co-localizadas en las 8 entidades de frontend para redacción y edición nativa en Markdown puro antes de la ingesta en el corpus JSON.
- [x] **Publicación Inaugural de Infraestructura:** Publicación bilingüe de ingeniería sobre *Firewall en Linux: De Netfilter y UFW a la Seguridad Perimetral de Servidores* (`firewall-linux-ufw-netfilter-seguridad-servidores`).
- [x] **Publicación Inaugural de Tutoriales:** Guía práctica bilingüe sobre *Autenticación SSH en Linux y Git: De Claves Ed25519 a la Gestión de Identidades y Bastionado* (`configuracion-ssh-claves-ed25519-alias-tuneles`).
- [x] **Publicación Inaugural de Noticias:** Análisis técnico bilingüe sobre *Escalada de Ransomware Impulsado por IA: Del Récord de Octubre al Cifrado Híbrido y Respaldos Inmutables* (`ransomware-ia-cifrado-hibrido-respaldos-inmutables`).
- [x] **Publicación Inaugural de Inteligencia Artificial:** Arquitectura de seguridad bilingüe sobre *Inyección de Prompts en Sistemas de IA (OWASP LLM01): De los Engaños a Chatbots a la Inyección Indirecta y el Aislamiento en Backend* (`inyeccion-prompts-owasp-llm01-seguridad-agentes`).

---

## 2. Especialización de Infraestructura y Servidores Linux
- [x] **Delimitación Estricta al Ecosistema Debian / Ubuntu:** Enfoque técnico exclusivo en **Ubuntu Server (LTS 22.04 / 24.04)** y **Debian GNU/Linux (12 / 13)** para servidores en la nube, garantizando coherencia con el 70%+ del mercado cloud, UFW en Netfilter, `apt` y systemd.
- [ ] **Producción Audiovisual (YouTube & Shorts/TikTok):** Adaptación de publicaciones de infraestructura (`firewall-linux-ufw`, Docker bypass, hardening de SSH) en guías paso a paso de terminal y cápsulas técnicas de alto impacto orientadas a la familia Debian/Ubuntu.

---

## 3. Internacionalización y SEO (next-intl)
- [x] **Metadatos SEO Dinámicos (`generateMetadata`):** Títulos, descripciones y Open Graph en español e inglés.
- [x] **Indexación Internacional (`hreflang`):** Etiquetas `es-EC` y `en-US` configuradas en `layout.tsx`.
- [x] **Cero Parpadeos (SSR):** Integración con `NextIntlClientProvider` y `messages/*.json`.
- [x] **Diccionarios UI Localizados:** Soporte para traducción de nombres de categorías y navegación.

