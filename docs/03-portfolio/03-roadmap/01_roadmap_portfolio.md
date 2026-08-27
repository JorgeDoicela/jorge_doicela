# Roadmap y Funcionalidades: Portafolio Profesional

Catálogo de ideas, funcionalidades completadas y requerimientos pendientes exclusivamente para el **Portafolio Profesional** (`portfolio.jorgedoicela.com`).

---

## 1. Terminal Virtual SSH (WebSockets)
- [x] **Historial con flechas arriba/abajo:** Navegación entre comandos escritos durante la sesión.
- [x] **Autocompletado con tecla Tab:** Sugerencia y completado automático de comandos.
- [x] **Comandos Unix emulados:** `cat`, `ls`, `cd`, `whoami`, `date`, `uptime`, `echo`, `clear`, `exit`, `open`.
- [x] **Comando `neofetch`:** Resumen estilizado del sistema en arte ASCII.
- [x] **Comando `matrix`:** Lluvia digital interactiva de caracteres en la terminal.
- [x] **Soporte de secuencias de color ANSI:** Renderizado de estilos y colores en consola.
- [x] **Semáforo visual de conexión:** Indicador en tiempo real del estado de WebSocket (verde/amarillo/rojo).
- [ ] **Múltiples sesiones/pestañas:** Interfaz estilo tmux para alternar terminales.
- [ ] **Modo espejo de lectura:** Generar enlace único para compartir una sesión en tiempo real.

---

## 2. Secciones Visuales del Portafolio
- [x] **Animación de escritura de roles:** Alternancia cíclica entre títulos profesionales.
- [x] **Sección de valores y filosofía:** Texto inspiracional sobre ética de trabajo guiada por principios cristianos.
- [ ] **Tarjetas 3D del stack tecnológico:** Efecto de profundidad y rotación al hover/tap.
- [ ] **Timeline de experiencia interactiva:** Línea de tiempo scrolleable con hitos desplegables.
- [ ] **Filtro dinámico de proyectos:** Botones interactivos para clasificar proyectos por tecnología.
- [ ] **Lightbox y modal de capturas:** Vista expandida de proyectos con capturas y demos.
- [ ] **Mapa de calor de GitHub:** Gráfico interactivo de contribuciones en la página.
- [ ] **Modo presentación (`?present=true`):** Vista adaptada para proyectores o exposiciones.

---

---

## 4. Internacionalización y SEO (next-intl)
- [x] **Metadatos SEO Dinámicos (`generateMetadata`):** Emisión bilingüe de títulos y descripciones.
- [x] **Indexación Internacional (`hreflang`):** Etiquetas `es-EC` y `en-US` configuradas en `layout.tsx`.
- [x] **Cero Parpadeos (SSR):** Integración con `NextIntlClientProvider` y `messages/*.json`.

