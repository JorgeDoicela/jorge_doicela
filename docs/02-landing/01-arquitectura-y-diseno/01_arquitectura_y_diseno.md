# Landing Page (jorgedoicela.com) - Arquitectura y Diseño

Este documento detalla la arquitectura macro y micro, funcionamiento, componentes y diseño de la página de aterrizaje (Landing Page) principal del ecosistema.

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Dominio / Subdominio:** Dominio raíz `jorgedoicela.com` (o `localhost:3001` sin subdominio).
> * **Enrutamiento:** Interceptado por `src/middleware.ts` en el servidor unificado Next.js 16 (puerto `3001`), optimizado para el VPS de **1 GB de RAM**.
> * **Aislamiento:** Proyecto 100% independiente del lado del cliente. No se comunica con bases de datos ni posee backend dedicado en NestJS.
>
> **Arquitectura Micro:**
> * **Aislamiento de Estilos:** Estilos independientes en `frontend/web/src/app/(landing)/globals.css` (**Bento Grid** con micro-interacciones, fuentes Inter y Outfit).
> * **Feature-Sliced Design (FSD Canónico en 6 Capas):** Estructura desacoplada y escalable:
>   * `providers/`: Envoltorios de montaje global en layout (`theme-provider`, `LanguageProvider`, `PerformanceProvider`).
>   * `shared/`: UI Kit agnóstico (`BentoCard`, `CustomSelect`, `QuitoClockBadge`, `SkipToContent`), SEO (`PersonJsonLd`), PWA (`PwaRegister`), utilitarios/hooks (`useSubdomainUrl`, `api`) y contextos/hooks globales (`useLanguage`, `usePerformanceTier`).
>   * `entities/`: Modelos del dominio (`highlights`, `profile/TypewriterRole`, `links`).
>   * `features/`: Casos de uso e interacciones (`ai-assistant`, `language-toggle`, `theme-toggle`, `share-profile`).
>   * `widgets/`: Bloques visuales complejos (`landing-header`, `landing-footer`, `highlights-carousel` con `slides/`, `highlights-explorer`, `cosmic-canvas`, `consulta-section`, `links-showcase`).
>   * `(pages)`: Enrutador físico App Router (`page.tsx`, `consulta/page.tsx`, `links/page.tsx`, `contacto/page.tsx`, `api/chat/route.ts`).

---

## 2. Descripción y Aislamiento

* **Arquitectura Server-First (Next.js App Router):** `page.tsx`, `consulta/page.tsx` y `links/page.tsx` operan como **Server Components nativos asíncronos**, entregando el 100% de la semántica HTML (Hero, titulares, Bento Grid, enlaces y metadatos con `generateMetadata()`) en el primer byte (SSR) sin spinners bloqueantes ni anti-patrones de montaje.
* **Arquitectura de Islas de Interactividad (FSD):** Los efectos dinámicos se desacoplan en componentes clientes modulares encapsulados en sus respectivas capas FSD:
  * `widgets/cosmic-canvas`: Fondos cinemáticos ThreeJS/Canvas (`LandingVisualEffects`, `ParallaxBackground`, `InteractiveParticles`, `CinematicSpiralGalaxy`).
  * `shared/ui/QuitoClockBadge`: Reloj en vivo de Quito.
  * `features/language-toggle`: Selector de idioma con `useLanguage()`.
  * `widgets/highlights-carousel`: Carrusel interactivo y Hero.
  * `widgets/highlights-explorer`: Modal/Drawer inmersivo de proyectos.
  * `features/ai-assistant`: Botón flotante y modal del asistente IA con streaming.
* **Aislamiento de Estilos:** Posee su propio archivo independiente `frontend/web/src/app/(landing)/globals.css` que configura la estructura **Bento Grid**, fuentes (Inter y Outfit) y tokens visuales de Tailwind CSS v4.
* **Enrutamiento y Subpáginas:**
  * `/`: Página principal de bienvenida y portal a los 3 proyectos con Bento Grid interactivo.
  * `/consulta` (y alias `/contacto`): Landing page de captura de leads y consultas técnicas optimizada para campañas publicitarias (Google Ads), conectada con despacho en tiempo real a Telegram.
  * `/links`: Centro oficial de enlaces y conexiones con Server Component asíncrono, metadatos SEO/OpenGraph/Twitter nativos, vitrina multimedia y asistente IA desacoplado.
* **Enrutamiento:** El middleware (`src/middleware.ts`) redirige automáticamente las peticiones sin subdominio hacia el grupo de rutas `(landing)`.

---

## 3. Características Técnicas

### 3.1 Enlaces Canónicos y Adaptabilidad Local
* **SSR (Primer Byte):** Enlaces directos a producción (`https://*.jorgedoicela.com`) garantizando máxima indexabilidad para buscadores y crawlers.
* **Entornos de Desarrollo:** En cliente, `AppleHighlightsCarousel` adapta dinámicamente los subdominios hacia `*.localhost:[port]` sin alterar el renderizado en servidor.

### 3.2 Widget de Reloj de Quito (`QuitoClockBadge`)
* **Zona Horaria:** Formateado explícitamente con `'America/Guayaquil'` (UTC-5), mostrando siempre la hora local en Quito independientemente de dónde se encuentre el visitante.
* **Aislamiento e Hidratación:** Renderizado seguro con `suppressHydrationWarning` para erradicar cualquier parpadeo de hidratación sin bloquear la pintura inicial del DOM.

### 3.3 Internacionalización Profesional (next-intl Unificado + SSR & SEO Gold Standard)
* **Unificación Total en next-intl:** Arquitectura 100% estandarizada con `useTranslations` de `next-intl`. Se eliminó por completo el archivo `translations.ts` manual obsoleto, erradicando duplicidades y garantizando paridad bilingüe estricta entre `src/messages/es.json` y `src/messages/en.json`.
* **LanguageContext Desacoplado:** El proveedor de contexto de idioma gestiona exclusivamente el estado de locale ('es' | 'en'), cookies `NEXT_LOCALE` y transiciones atómicas (`useTransition`), delegando todas las cadenas de texto a los diccionarios reactivos de `next-intl`.
* **Arquitectura de Servidor y Carga Determinista:** Configuración en `src/i18n/request.ts` integrada mediante `createNextIntlPlugin` en `next.config.ts`. Implementa un mapeo de importaciones estáticas y explícitas por proyecto e idioma (`loadProjectMessages`), eliminando expresiones dinámicas con plantillas de strings frágiles (`(${subdomain})`) y garantizando que Turbopack y Next.js Standalone empaqueten el 100% de los diccionarios `.json` en los chunks del servidor, erradicando fallos de `MISSING_MESSAGE` o 500 en SSR.
* **Cero Parpadeos (SSR):** El servidor entrega el HTML ya traducido en el primer byte evitando el fenómeno *FOUC*.
* **Detección y Negociación:** Detección automática por cookie `NEXT_LOCALE` o cabecera HTTP `Accept-Language` del visitante.
* **Persistencia Reactiva:** El selector de idioma sincroniza la cookie `NEXT_LOCALE` y ejecuta `router.refresh()` para re-renderizado instantáneo en el servidor.
* **Diccionarios Estructurados:** Archivos JSON organizados en `src/app/(subdominio)/messages/es.json` y `en.json`.

### 3.4 Progressive Web App (PWA)
* Manifiesto W3C `manifest.json` (`#09090b`, modo `standalone`).
* Service Worker nativo `sw.js` con estrategia *Network-First* para páginas y *Cache-First* para assets.
* Registro del cliente en `PwaRegister.tsx`.

### 3.5 Metadatos SEO Internacionales y Datos Estructurados (Schema.org JSON-LD)
* **`generateMetadata()` Dinámica:** Títulos, descripciones y Open Graph localizados por idioma.
* **Etiquetas `hreflang` para Google:** Mapeo de `alternates.languages` (`es-EC` y `en-US`) para posicionamiento bilingüe en motores de búsqueda.
* Componente `PersonJsonLd.tsx` con especificación de Schema.org (`Person`, `WebSite`, formación en `ISTPET`, áreas de conocimiento `knowsAbout` y enlaces `sameAs`).
* Archivo estático `llms.txt` normalizado para descubrimiento y consumo ultrarrápido por modelos LLM (ChatGPT, Perplexity, Claude, Gemini).
* Generador de previsualización para redes sociales en `opengraph-image.tsx` (tarjeta de 1200x630 px).
* `sitemap.ts` y `robots.ts` nativos de Next.js optimizados para rastreadores de IA sin sobrecargar la memoria RAM.


### 3.6 Accesibilidad (WCAG 2.1 AA / ARIA 1.2)
* Botón de atajo `SkipToContent.tsx` para saltar al contenido principal con la tecla Tab.
* Anillos de enfoque visibles y soporte de lectores de pantalla.

### 3.7 Asistente de Inteligencia Artificial Oficial (Route Handler & Guardrails)
* **Arquitectura:** Endpoint servidor en `(landing)/api/chat/route.ts` con streaming en tiempo real vía Groq LPU (modelos OSS de alta velocidad).
* **Frontera de Dominio Estricta:** Acotado 100% a la representación de Jorge Doicela, sus plataformas en producción (`bible`, `software`, `portfolio`, `landing`), su arquitectura en 1 GB de RAM y propuestas técnicas en `/consulta`.
* **Protección contra Consultas Fuera de Alcance:** Rechazo sistemático y profesional ante temas ajenos (cursos desde cero, tareas, cocina, entretenimiento, política) redirigiendo al [Formulario de Consulta](/consulta).
* **Seguridad y Anti-Jailbreak:** Inmunidad contra inyecciones de prompt, limitador de tasa deslizante por IP (`checkRateLimit`) y caché LRU en memoria.
* **Estilo Ejecutivo:** Prohibición absoluta de emojis, temperatura 0.2 para alta fidelidad y formato Markdown limpio.

### 3.8 Carrusel Oficial Apple Highlights (Multitarjeta con Arrastre Interactivo / Drag & Swipe)
* **Arquitectura de Interacción Unificada:** Implementado en `AppleHighlightsCarousel.tsx` mediante API estándar de *Pointer Events* (`onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`) garantizando paridad total e idéntica sensibilidad táctil en dispositivos móviles, tablets y ratón en escritorio (desktop).
* **Física y Arrastre en Tiempo Real (Drag & Swipe):**
  * Desplazamiento dinámico en vivo (`dragOffset` en píxeles) sin transiciones CSS lentas durante el agarre (`isDragging`), asegurando una respuesta instantánea a 60/120 FPS.
  * **Resistencia Elástica en Extremos:** Factor de amortiguación de `0.35x` al intentar arrastrar más allá de la primera o última diapositiva para brindar retroalimentación táctil prémium.
  * **Umbral Elástico de Transición:** Desplazamiento mínimo de 60 px (`DRAG_THRESHOLD`) para activar el avance (`nextSlide()`) o retroceso (`prevSlide()`).
* **Preservación del Scroll Vertical Móvil:** Detección direccional temprana; si el desplazamiento inicial supera 7 px y el eje vertical predomina (`|deltaY| > |deltaX|`), se cede el control inmediatamente al navegador nativo (`touch-pan-y`) para evitar bloquear el desplazamiento de la página en smartphones.
* **Inmunidad contra Clics Fantasma:** Bloqueo selectivo de eventos `onClick` y `onAuxClick` cuando se ha ejecutado un gesto de arrastre (`hasDragged.current = true`), evitando la navegación involuntaria a los proyectos al soltar el puntero.
* **Autoplay y Controles de Accesibilidad:** Temporizador de diapositivas con pausa automática durante la interacción de arrastre, controles de reproducción (`Play`/`Pause`), indicadores de posición por puntos con aria-labels y botones de acción directa internos (`Abrir Biblia`, `Entrar a Software`, `Ver Portafolio`).
* **Cero Dependencias Adicionales (Zero-RAM Overhead):** Diseñado sin librerías externas de carrusel (ni Swiper ni Embla), reduciendo a cero el consumo extra de memoria para la estricta cuota de 1 GB en VPS.

### 3.9 Motor de Rendimiento Adaptativo Multi-Nivel (PerformanceContext & Tiers)
* **Arquitectura Determinista W3C:** Administrado en `shared/context/PerformanceContext.tsx`, clasifica de forma determinista y estable al cliente en 3 niveles de potencia física (`high`, `mid`, `low`):
  * **Tier `high` (Desktops y Laptops Potentes):** Experiencia cinemática completa a 120-144 Hz (1,600 partículas en `InteractiveParticles.tsx`, 48 nebulosas cósmicas y 16 rayos en `CinematicSpiralGalaxy.tsx`, parallax 3D multicapa con inercia física en `ParallaxBackground.tsx`).
  * **Tier `mid` (Smartphones y Tablets):** Optimizado para pantallas táctiles y dispositivos móviles a 60 FPS estables (350 partículas, 12 nebulosas, 6 rayos suaves, reposo inteligente de parallax), preservando la GPU y evitando el recalentamiento de la batería.
  * **Tier `low` (Accesibilidad, Ahorro de Datos y Hardware Limitado):** Activación si el usuario solicita `prefers-reduced-motion: reduce`, `saveData: true`, si la conexión es lenta (2G) o si el hardware posee $\le$ 2 núcleos o $<$ 3 GB RAM.
* **Estándares W3C Interaction:** Detección de dispositivos táctiles móviles mediante `window.matchMedia('(pointer: coarse) and (hover: none)')`, evitando falsos positivos en laptops o pantallas táctiles con puntero de precisión.
* **Estabilidad sin Penalizaciones de Pestaña:** Se erradicó el monitor de fotogramas artificial que penalizaba al usuario por cambiar de ventana o durante la hidratación inicial. La adaptación es 100% determinista basada en capacidades del dispositivo.
* **Integración con Battery Status API:** Si el navegador reporta batería crítica ($\le 20\%$ y desconectado del cargador), escala de inmediato a `mid` para proteger la autonomía del visitante.
* **Sincronización DOM:** Emite `data-tier="high|mid|low"` en `<html>` consumido reactivamente por `globals.css`.

---

## 4. Estética Visual y Bento Grid

* **Disposición Modular Bento Grid:** Cuadrícula asimétrica y responsiva con tarjetas de tamaños jerárquicos (`col-span-*`, `row-span-*`) que presentan de forma balanceada las diferentes facetas, enlaces a subdominios y proyectos.
* **Apple Highlights Carousel:** Vitrina central de proyectos con estilo oficial Apple, tarjetas centradas y asomadas en los bordes (`[--card-w:78vw] sm:[--card-w:82vw] md:[--card-w:min(82vw,960px)]`), soporte de arrastre por ratón/touch y tipografía refinada.
* **Static & Interactive Bento Cards:** Tarjetas modulares con micro-animaciones al hacer hover (elevación sutil, iluminación de bordes y desplazamiento interactivo de flechas).
* **Fondo de Profundidad Sutil:** Elipses degradadas con desenfoque suave (`blur-[130px]`) que aportan tridimensionalidad moderna sin penalizar el rendimiento ni la GPU.
* **Compatibilidad de Temas (Dark & Light Mode):** Soporte integral y desacoplado para modo oscuro (`dark`, Apple Dark Slate & Deep Cosmos) y modo claro (`light`, Apple Impoluto #fafafc) mediante `ThemeProvider` local (`next-themes`) en `layout.tsx` y el componente unificado `LandingHeader` (con `ThemeToggle` y `QuitoClockBadge`) en todas las páginas (`/`, `/consulta`, `/links`).
