# Roadmap y Funcionalidades: Landing Page (`jorgedoicela.com`)

Catálogo vivo de ideas, funcionalidades completadas y requerimientos pendientes exclusivamente para la **Landing Page**.

---

## 1. Diseño Visual y UX/UI
- [x] **Efecto Parallax en el fondo:** Elipses degradadas que se mueven a distinta velocidad al hacer scroll.
- [x] **Partículas interactivas:** Reacción al movimiento del cursor o toques táctiles.
- [x] **Animación de entrada (Page Load):** Entrada escalonada (staggered fade-in + slide-up) al cargar la página.
- [x] **Efecto Typewriter:** Título profesional que se escribe letra por letra.
- [x] **Gradiente reactivo al cursor:** Fondo reactivo al puntero en escritorio.

---

## 2. Contenido y Secciones
- [x] **Sección "Disponible para trabajo":** Chip verde/rojo de estado para proyectos y consultorías en `/links`.
- [x] **Portal Oficial de Enlaces & Conexiones (`/links`):** Centro de enlaces interactivo con Bento Grid de plataformas propias y vitrina de proyectos.
- [x] **Vitrina de Proyectos & Lightbox:** Media Grid interactivo con navegación cíclica por teclado y vista previa.
- [x] **Botones de contacto directo:** Accesos rápidos a WhatsApp, Telegram, Email, GitHub, LinkedIn.
- [ ] **Contador de proyectos y experiencia:** Estadísticas animadas de hitos alcanzados.
- [ ] **Ticker de actividad de GitHub:** Commits y actividad reciente desde la API pública de GitHub.
- [ ] **Miniaturas del Blog:** Últimas publicaciones destacadas directamente en la landing.
- [ ] **Descarga de CV/Currículum:** Botón flotante para descargar CV en PDF.
- [ ] **Tech Wheel / Mapa de tecnologías:** Nube interactiva de herramientas dominadas.
- [ ] **Sección de testimonios:** Carrusel con recomendaciones de colegas y clientes.
- [ ] **Línea de tiempo personal:** Timeline con los hitos de la carrera de Jorge.

---

## 3. Funcionalidades Técnicas y Accesibilidad
- [x] **Internacionalización Profesional (next-intl):** Server-Side Rendering (SSR) limpio, cero parpadeos (FOUC), cookies `NEXT_LOCALE` y cabeceras `Accept-Language`.
- [x] **Metadatos SEO Internacionales Dinámicos:** Generación bilingüe con `generateMetadata()`, Open Graph, Twitter Cards, Schema.org JSON-LD y etiquetas `hreflang` (`es-EC` y `en-US`).
- [x] **Sitemap dinámico (`sitemap.xml`):** Generación automática desde Next.js incluyendo `/links`.
- [x] **Robots.txt personalizado:** Reglas de indexación para bots.
- [x] **Accesibilidad WCAG 2.1 AA:** SkipToContent, ARIA labels y navegación completa por teclado.
- [x] **Progressive Web App (PWA):** Instalable en móvil y escritorio con Service Worker.
- [x] **Previsualización Open Graph:** Generador dinámico en servidor con `@vercel/og` (1200x630).
- [x] **Verificación Google & Bing:** Meta tags de validación de propiedad.
- [x] **Botones para compartir en redes & portapapeles:** Atajo nativo de `navigator.share` y copiado con toast interactivo.
- [ ] **Analytics sin cookies:** Integración ligera autohospedada (Umami o Plausible).
