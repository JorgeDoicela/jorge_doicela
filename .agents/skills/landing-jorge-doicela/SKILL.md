---
name: landing-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de la Landing Page principal (jorgedoicela.com), 100% en el cliente Next.js (Bento Grid, i18n, PWA, SEO Schema JSON-LD, reloj en horario Quito, accesibilidad WCAG AA y rendimiento).
---
# Directrices de Desarrollo: Landing Page Principal (jorgedoicela.com)

Esta habilidad define los estándares técnicos, estéticos, de accesibilidad y de optimización para la Landing Page de bienvenida de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_arquitectura_y_diseno.md](../../../docs/02-landing/01-arquitectura-y-diseno/01_arquitectura_y_diseno.md)

---

## 1. Arquitectura y Aislamiento

* **Dominio:** `jorgedoicela.com` (en desarrollo: `localhost:3001` sin subdominio).
* **Frontend:** Grupo de rutas `frontend/web/src/app/(landing)/`.
* **100% Frontend del lado del Cliente (Next.js):** La Landing es completamente estática y autónoma. **No realiza consultas a NestJS ni posee backend o base de datos**.
* **Aislamiento de Estilos y Diseño:** Utiliza exclusivamente su propio archivo `(landing)/globals.css` (diseño estructurado en **Bento Grid** asimétrico, micro-animaciones interactivas, fuentes Inter y Outfit, elipses de profundidad sutil y soporte de temas claro/oscuro).
* **Aislamiento de Assets Estáticos:** Todos los assets, iconos e imágenes deben residir exclusivamente bajo `frontend/web/public/landing/`.

---

## 2. Estructura de Directorios del Proyecto

```text
frontend/web/src/app/(landing)/
├── components/
│   ├── Header.tsx              # Cabecera con selector i18n (ES/EN), theme toggle y reloj Quito
│   ├── PwaRegister.tsx         # Registro del Service Worker de la PWA
│   ├── PersonJsonLd.tsx        # Datos estructurados Schema.org (SEO)
│   ├── SkipToContent.tsx       # Atajo de accesibilidad por teclado (WCAG AA)
│   ├── TypewriterRole.tsx      # Animación de máquina de escribir accesible (aria-live)
│   └── GlassCard.tsx           # Tarjetas interactivas con micro-animaciones
├── context/
│   └── LanguageContext.tsx     # Proveedor de estado de idioma reactivo (ES/EN)
├── i18n/
│   └── translations.ts         # Diccionario bilingüe tipado estrictamente
├── globals.css                 # Estilos específicos de la Landing Page
├── layout.tsx                  # Metadatos SEO, Open Graph y contenedor
└── page.tsx                    # Estructura principal y resolutor de subdominios
```

---

## 3. Funcionalidades Clave y Buenas Prácticas

### 3.1 Resolutor Dinámico de Subdominios (Local vs Producción)
Detecta si la petición proviene de `localhost` o producción para mapear automáticamente los enlaces hacia `http://*.localhost:3001` o `https://*.jorgedoicela.com`:
```typescript
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1'));

const getUrl = (subdomain: string) => 
  isLocal ? `http://${subdomain}.localhost:3001` : `https://${subdomain}.jorgedoicela.com`;
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
* Conmutador en el header que añade o quita la clase `.light` en `document.documentElement`.
* Persistencia en `localStorage` bajo la clave `'landing-theme'`.

### 3.4 Soporte Multiidioma (i18n ES/EN)
* Alternancia instantánea entre Español e Inglés sin librerías externas pesadas.
* Persistencia en `localStorage` bajo `'landing-lang'` y detección automática del idioma preferido del navegador.

### 3.5 Progressive Web App (PWA)
* Manifiesto W3C (`public/manifest.json`) en modo `standalone` con theme color `#09090b`.
* Service Worker (`public/sw.js`) con estrategia *Network-First* para páginas y *Cache-First* para assets e imágenes.
* Registro asíncrono con `PwaRegister.tsx`.

### 3.6 SEO, Datos Estructurados y Accesibilidad
* Script Schema.org de tipo `Person` y `WebSite` (`PersonJsonLd.tsx`).
* `sitemap.ts` y `robots.ts` en la raíz de Next.js.
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
| Importar componentes o estilos de (portfolio), (bible) o (software) | Rompe el aislamiento estético y añade dependencias innecesarias. | Mantener los componentes encapsulados en (landing)/components/. |
| Olvidar la zona horaria en el reloj de Quito | El reloj mostraría la hora local del navegador del visitante en vez de la hora de Ecuador. | Usar timeZone: 'America/Guayaquil' explícitamente en Intl.DateTimeFormat. |
| Colocar imágenes en carpetas genéricas de public/ | Colisiona con assets de otros subproyectos. | Guardar assets exclusivamente en frontend/web/public/landing/. |

---

## 6. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para estándares de monorepo, pnpm --filter web y calidad).
