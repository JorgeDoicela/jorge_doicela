---
name: landing-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de la Landing Page principal (jorgedoicela.com), 100% en el cliente Next.js (Bento Grid, i18n, PWA, SEO Schema JSON-LD, reloj en horario Quito, accesibilidad WCAG AA y rendimiento).
---
# Directrices de Desarrollo: Landing Page Principal (jorgedoicela.com)

Esta habilidad define los estándares técnicos, estéticos, de accesibilidad y de optimización para la Landing Page de bienvenida de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_arquitectura_y_diseno.md](../../../docs/02-landing/01-arquitectura-y-diseno/01_arquitectura_y_diseno.md)
* [01_roadmap_landing.md](../../../docs/02-landing/02-roadmap/01_roadmap_landing.md)

---

## 1. Arquitectura y Aislamiento

* **Dominio:** `jorgedoicela.com` (en desarrollo: `localhost:3001` sin subdominio).
* **Frontend:** Grupo de rutas `frontend/web/src/app/(landing)/`.
* **100% Frontend del lado del Cliente (Next.js):** La Landing es completamente estática y autónoma. **No realiza consultas a NestJS ni posee backend o base de datos**.
* **Aislamiento de Estilos y Diseño:** Utiliza exclusivamente su propio archivo `(landing)/globals.css` (diseño estructurado en **Bento Grid** asimétrico, micro-animaciones interactivas, fuentes Inter y Outfit, elipses de profundidad sutil y soporte de temas claro/oscuro).
* **Aislamiento de Assets Estáticos:** Todos los assets, iconos e imágenes deben residir exclusivamente bajo `frontend/web/public/landing/`.

---

## 2. Estructura de Directorios del Proyecto (FSD Canónico en 6 Capas)

```text
frontend/web/src/app/(landing)/
├── messages/                         # Diccionarios locales de la Landing (es.json, en.json)
├── globals.css                       # Estilos específicos de la Landing Page (Apple Dark Slate / Apple Impoluto)
├── layout.tsx                        # ThemeProvider + NextIntlClientProvider + generateMetadata dinámica
│
├── providers/                        # CAPA 1 (APP): Contextos reactivos y tema local
│   ├── theme-provider.tsx            # Wrapper local de next-themes
│   ├── LanguageContext.tsx           # Adaptador reactivo conectado a next-intl y router.refresh()
│   ├── PerformanceContext.tsx        # Detección de hardware y aceleración GPU para 3D
│   └── index.ts
│
├── shared/                           # CAPA 6: UI Kit agnóstico, SEO, PWA, Utilidades y Contextos
│   ├── ui/                           # BentoCard, CustomSelect, QuitoClockBadge, SkipToContent
│   ├── seo/                          # PersonJsonLd (Schema.org Person & WebSite)
│   ├── pwa/                          # PwaRegister (Service Worker)
│   ├── lib/                          # useSubdomainUrl, api (resolución local vs producción)
│   ├── context/                      # LanguageContext (useLanguage), PerformanceContext (usePerformanceTier)
│   └── index.ts
│
├── entities/                         # CAPA 5: Modelos del Dominio y Contenido Base
│   ├── highlights/                   # Tipos y datos de los 4 proyectos de Apple Highlights
│   ├── profile/                      # Datos del autor, biografía y TypewriterRole
│   ├── links/                        # Estructura de enlaces de acción y medios
│   └── index.ts
│
├── features/                         # CAPA 4: Casos de Uso e Interacciones del Usuario
│   ├── ai-assistant/                 # AiAssistantChatModal, LinksAiAssistant (chat interactivo)
│   ├── language-toggle/              # LanguageToggleButton (ES / EN reactivo)
│   ├── theme-toggle/                 # ThemeToggle (Selector de modo claro/oscuro)
│   ├── share-profile/                # ShareProfileButton (Web Share API + fallback)
│   └── index.ts
│
├── widgets/                          # CAPA 3: Bloques Visuales Autónomos y Layouts
│   ├── landing-header/               # LandingHeader (cabecera universal con badge opcional y backLink)
│   ├── landing-footer/               # LandingFooter (variantes full y compact con LandingFooterLinks)
│   ├── highlights-carousel/          # AppleHighlightsCarousel con slides/ (Bible, Software, Portfolio)
│   ├── highlights-explorer/          # AppleDetailExplorer (Modal/Drawer inmersivo de proyectos)
│   ├── cosmic-canvas/                # LandingVisualEffects, ParallaxBackground, CinematicSpiralGalaxy, InteractiveParticles
│   ├── consulta-section/             # ConsultaForm (formulario y feedback de leads)
│   ├── links-showcase/               # LinksHeader, ActionLinksList, ProjectsMediaGrid
│   └── index.ts
│
└── (pages App Router)                # CAPAS 2 & 1: Enrutamiento Físico Next.js
    ├── page.tsx                      # Vista principal (Hero + Highlights + Bento Grid)
    ├── consulta/page.tsx             # Solicitud de consultoría
    ├── links/page.tsx                # Bio Tree y perfiles oficiales
    ├── contacto/page.tsx             # Redirección
    └── api/chat/route.ts             # API Route del Asistente IA
```

---

## 3. Funcionalidades Clave y Buenas Prácticas

### 3.1 Hook Reactivo SSR-Safe de Subdominios (`useSubdomainUrl`)
Gestiona de forma unificada y segura para SSR la resolución dinámica hacia `http://*.localhost:3001` (desarrollo) o `https://*.jorgedoicela.com` (producción) sin duplicar lógica en componentes:
```typescript
import { useSubdomainUrl } from '../shared';

// Uso directo en cualquier componente cliente:
const bibleUrl = useSubdomainUrl('bible');
const softwareUrl = useSubdomainUrl('software');
const portfolioUrl = useSubdomainUrl('portfolio');
```

### 3.2 Reloj en Huso Horario de Quito y Saludo Adaptativo
* Formateado explícitamente con `'America/Guayaquil'` (UTC-5) para garantizar la hora exacta de Quito sin importar la ubicación geográfica del visitante:
```typescript
new Intl.DateTimeFormat('es-EC', {
  timeZone: 'America/Guayaquil',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(new Date());
```
* **Saludo adaptativo:**
  * `06:00` - `11:59` -> Buenos días / Good morning
  * `12:00` - `18:59` -> Buenas tardes / Good afternoon
  * `19:00` - `05:59` -> Buenas noches / Good evening

### 3.3 Modo Claro / Oscuro (Light & Dark)
* Soporte integral desacoplado (caja negra) con `providers/theme-provider.tsx` (`next-themes`) en `layout.tsx`.
* Componente modular reutilizable `ThemeToggle.tsx` en `features/theme-toggle/` consumido en `page.tsx`, `ConsultaHeader.tsx` y `LinksTopBar.tsx`.
* Cero dependencias cruzadas entre subdominios.

### 3.4 Internacionalización Profesional (next-intl + SSR & SEO Gold Standard)
* **Server-Side Rendering (SSR):** El servidor entrega el HTML ya traducido desde la primera respuesta evitando parpadeos (*FOUC*).
* **Detección Dual:** Lee la cookie `NEXT_LOCALE` o negocia automáticamente mediante la cabecera `Accept-Language` del visitante en `request.ts`.
* **Persistencia Reactiva:** El selector de idioma actualiza la cookie `NEXT_LOCALE` y ejecuta `router.refresh()` para actualizar el contenido de forma instantánea.

### 3.5 Progressive Web App (PWA)
* Manifiesto W3C (`public/manifest.json`) en modo `standalone` con theme color `#09090b`.
* Service Worker (`public/sw.js`) con estrategia *Network-First* para páginas y *Cache-First* para assets e imágenes.
* Registro asíncrono con `PwaRegister.tsx`.

### 3.6 SEO Internacional, Datos Estructurados (Schema.org) y Visibilidad en IA (GEO)
* **Metadatos Dinámicos Localizados (`generateMetadata`):** Emite títulos, descripciones y Open Graph en el idioma activo.
* **Etiquetas `hreflang` para Google:** Configura `alternates.languages` (`es-EC` y `en-US`) para indexar ambas versiones en motores de búsqueda.
* **Datos Estructurados Schema.org (`PersonJsonLd.tsx`):** Grafo con entidad `Person` (nombre completo Jorge Ismael Doicela Molina, formación en ISTPET, áreas de especialidad `knowsAbout`, redes `sameAs`) y entidad `WebSite`.
* **Dossier Maestro para LLMs (`public/landing/llms.txt`):** Resumen conciso del perfil completo del creador y enlaces a los 3 dossiers especializados de los subproyectos, servido directamente por Nginx/Cloudflare sin tocar la memoria RAM.
* `sitemap.ts` y `robots.ts` en la raíz de Next.js con reglas para bots de IA (`GPTBot`, `PerplexityBot`, etc.).
* Previsualización dinámica de Open Graph en `src/app/opengraph-image.tsx` (1200x630).
* Accesibilidad WCAG 2.1 AA con atajo para teclado `SkipToContent.tsx`, anillos de enfoque visibles y compatibilidad con lectores de pantalla.

---

## 4. Comandos de Operación

```bash
# Agregar librerías al frontend web
pnpm --filter web add <paquete>

# Verificar tipado
pnpm -r typecheck
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Hacer llamadas fetch a endpoints de backend NestJS | La Landing es 100% estática del lado del cliente y no tiene backend. | Resolver enlaces y contenido puramente en el cliente. |
| Importar componentes o estilos de (portfolio), (bible) o (software) | Rompe el aislamiento estético y añade dependencias innecesarias. | Mantener los componentes encapsulados en sus capas FSD dentro de (landing)/. |
| Olvidar la zona horaria en el reloj de Quito | El reloj mostraría la hora local del navegador del visitante en vez de la hora de Ecuador. | Usar timeZone: 'America/Guayaquil' explícitamente en Intl.DateTimeFormat. |
| Colocar imágenes en carpetas genéricas de public/ | Colisiona con assets de otros subproyectos. | Guardar assets exclusivamente en frontend/web/public/landing/. |

---

## 6. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se agreguen, modifiquen, optimicen o eliminen componentes, hooks, animaciones, esquemas SEO o estilos en la Landing Page, es **obligatorio actualizar la documentación técnica en `docs/02-landing/`**.
* **Gestión Documental Proactiva:** Se autoriza la creación de nuevos archivos `.md`, reorganización de subcarpetas en `docs/02-landing/` o eliminación de contenido en desuso para preservar siempre la coherencia total entre el código y la documentación.

---

## 7. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para estándares de monorepo, pnpm --filter web y calidad).

