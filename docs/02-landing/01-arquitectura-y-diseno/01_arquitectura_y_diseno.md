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
> * **Aislamiento de Estilos:** Estilos independientes en `frontend/web/src/app/(landing)/globals.css`.
> * **Componentes Locales:** Modularizados dentro de `(landing)/components/` (reloj de Quito, i18n, PWA, SEO).

---

## 2. Descripción y Aislamiento

* **100% del Lado del Cliente (Next.js):** La Landing Page no posee base de datos ni endpoints dedicados en NestJS. Es un portal de bienvenida ultra-rápido y optimizado.
* **Aislamiento de Estilos:** Posee su propio archivo independiente `frontend/web/src/app/(landing)/globals.css` que configura fuentes (Inter y Outfit) y tokens visuales de Tailwind CSS v4.
* **Enrutamiento:** El middleware (`src/middleware.ts`) redirige automáticamente las peticiones sin subdominio hacia el grupo de rutas `(landing)`.

---

## 3. Características Técnicas

### 3.1 Resolutor Dinámico de Enlaces
Un script en React (`useEffect`) evalúa el host de navegación:
* **Local:** Si detecta `localhost`, enlaza hacia `http://*.localhost:3001`.
* **Producción:** Enlaza hacia `https://*.jorgedoicela.com` con SSL.

### 3.2 Widget de Reloj de Quito y Saludo Dinámico
* **Zona Horaria:** Formateado explícitamente con `'America/Guayaquil'` (UTC-5), mostrando siempre la hora local en Quito independientemente de dónde se encuentre el visitante.
* **Saludo Dinámico:**
  * 06:00 - 11:59 $\rightarrow$ *Buenos días*
  * 12:00 - 18:59 $\rightarrow$ *Buenas tardes*
  * 19:00 - 05:59 $\rightarrow$ *Buenas noches*

### 3.3 Soporte Multiidioma (i18n ES/EN)
* Diccionario bilingüe tipado en `translations.ts`.
* Contexto ligero en React (`LanguageContext.tsx`) con persistencia en `localStorage` (`'landing-lang'`) y detección de idioma del navegador.

### 3.4 Progressive Web App (PWA)
* Manifiesto W3C `manifest.json` (`#09090b`, modo `standalone`).
* Service Worker nativo `sw.js` con estrategia *Network-First* para páginas y *Cache-First* para assets.
* Registro del cliente en `PwaRegister.tsx`.

### 3.5 Metadatos SEO y Datos Estructurados (Schema.org JSON-LD)
* Componente `PersonJsonLd.tsx` con especificación de Schema.org para indexación de perfil en Google.
* Generador de previsualización para redes sociales en `opengraph-image.tsx` (tarjeta de 1200x630 px).
* `sitemap.ts` y `robots.ts` nativos de Next.js.

### 3.6 Accesibilidad (WCAG 2.1 AA / ARIA 1.2)
* Botón de atajo `SkipToContent.tsx` para saltar al contenido principal con la tecla Tab.
* Anillos de enfoque visibles y soporte de lectores de pantalla.

---

## 4. Estética Visual y Glassmorphism

* **Static Glass Cards:** Paneles con fondo translúcido, desenfoque de alta densidad y bordes ultra-finos que simulan cristal templado.
* **Interactive Glass Cards:** Micro-animaciones al hacer hover (iluminación de bordes y desplazamiento vectorial en flechas).
* **Fondo Dinámico Sutil:** Elipses degradadas con desenfoque de 130px (`blur-[130px]`) que aportan profundidad 3D con consumo nulo de GPU.
