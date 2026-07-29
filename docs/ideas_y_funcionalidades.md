# Ideas y Funcionalidades Completas por Subproyecto

Este documento es el catálogo exhaustivo de **todo lo que se puede implementar** en cada uno de los cuatro subproyectos del monorepo. Las ideas están organizadas por área temática y ordenadas de menor a mayor complejidad. No todas deben implementarse al mismo tiempo; este documento sirve como hoja de ruta viva para la evolución del ecosistema completo.

## Leyenda de Plataforma

| Ícono | Significado |
|-------|-------------|
| ✅ | Aplica igual en web y app móvil |
| 🌐 | Solo web (desktop/navegador) |
| 📱 | Solo app nativa (Expo / React Native) |
| 🔀 | Funciona en ambas pero requiere implementación diferente por plataforma |

---

## Landing Page (`jorgedoicela.com`) — Solo Frontend

> Portal de bienvenida. No tiene backend ni base de datos. Toda la lógica es del lado del cliente. La landing es una web responsive; no existe app nativa para esta sección, pero debe verse impecable en móvil.

### Diseño Visual y Experiencia de Usuario (UX/UI)
- [x] 🔀 **Efecto Parallax en el fondo**: Las elipses degradadas del fondo se mueven a distinta velocidad que el contenido al hacer scroll, generando profundidad tridimensional. *(En móvil: reemplazar `mousemove` por `deviceorientation` o giroscopio; deshabilitar si no hay sensor.)*

- [x] 🔀 **Partículas interactivas de fondo**: Pequeñas partículas flotantes (tipo Three.js o Tsparticles) que reaccionan al movimiento del ratón acercándose o alejándose del cursor. *(En móvil: reaccionar a `touchmove` en lugar de `mousemove`; reducir la densidad de partículas para no saturar la GPU del dispositivo.)*

- [x] ✅ **Animación de entrada (Page Load)**: Las tarjetas y el texto de la cabecera aparecen con una animación de entrada escalonada (staggered fade-in + slide-up) al cargar la página por primera vez.

- [x] ✅ **Efecto Typewriter en el título**: El nombre o el rol ("Full Stack Developer") se escribe letra por letra con animación de máquina de escribir en la cabecera.

- [x] 🌐 **Gradiente de fondo reactivo al cursor**: El gradiente del fondo de la página se desplaza sutilmente siguiendo la posición del ratón en tiempo real. *(No aplica en móvil — desactivar por completo en viewports táctiles.)*

### Contenido y Secciones
- [ ] ✅ **Sección "Disponible para trabajo"**: Un chip de estado con indicador de color verde/rojo que cambia según si Jorge está abierto a proyectos freelance o no.

- [ ] ✅ **Contador de proyectos completados**: Estadísticas animadas con contador de cifras (número de proyectos, años de experiencia, tecnologías usadas).

- [ ] ✅ **Ticker de actividad de GitHub**: Widget que muestra en tiempo real (o con caché) los commits más recientes desde la GitHub API pública.

- Revisar [ ] ✅ **Sección de últimas entradas del Blog**: Miniaturas de los últimos artículos publicados directamente en la landing.

- [ ] ✅ **Enlace a CV/Currículum descargable**: Botón flotante o en el footer para descargar el CV en PDF, generado dinámicamente o como asset estático.

- [ ] ✅ **Mapa de tecnologías (tech wheel)**: Visualización circular o de nube interactiva de todas las tecnologías que maneja Jorge.

- Revisar [ ] ✅ **Sección de testimonios / recomendaciones**: Carrusel de citas textuales de colegas, clientes o profesores.

- [ ] ✅ **Contador de días o proyectos**: Un contador animado de días en la industria o de commits en GitHub.

- [ ] ✅ **Línea de tiempo personal**: Timeline scrolleable con los hitos más importantes de la vida y carrera profesional de Jorge.

### Funcionalidades Técnicas y de Accesibilidad
- [ ] ✅ **Soporte multiidioma (i18n)**: Botón para cambiar entre español e inglés, gestionando el idioma con localStorage y traduciendo todo el contenido de la página.

- [ ] ✅ **Metadatos SEO completos**: Etiquetas og:image, og:title, twitter:card, descripción estructurada JSON-LD de persona.

- [ ] ✅ **Sitemap dinámico**: Generación automática de sitemap.xml para todos los subproyectos y páginas desde Next.js.

- [ ] ✅ **Soporte de accesibilidad (ARIA)**: Etiquetas aria-label en todos los botones, navegación con teclado completa y compatibilidad con lectores de pantalla.

- [ ] 🔀 **PWA (Progressive Web App)**: Configurar manifest.json y un service worker básico para que la landing se pueda instalar como app en el móvil del visitante. *(Es específicamente valioso para móvil — alta prioridad en esa plataforma.)*

- [ ] ✅ **Analytics propio sin cookies**: Integración de Umami o Plausible (autohosteado en el mismo VPS) para rastrear visitas sin depender de Google Analytics.

- [ ] ✅ **Compartir en redes sociales**: Botones para compartir directamente el perfil de Jorge en X (Twitter), LinkedIn o WhatsApp con un mensaje predefinido.

- [ ] ✅ **Previsualización de Open Graph**: Imagen estática generada con Next.js OG Image para que cuando se comparta el enlace aparezca una miniatura visualmente atractiva.

- [ ] ✅ **Verificación de Google Search Console y Bing**: Meta tags de verificación para posicionar el sitio en buscadores.

- [ ] ✅ **Robots.txt personalizado**: Definir qué páginas o subdominios deben o no ser indexadas por los motores de búsqueda.

- [ ] Revisar ✅ **Modo sin animaciones (prefers-reduced-motion)**: Detectar la preferencia del sistema operativo del usuario para desactivar animaciones.

- [ ] Revisar (Aún estoy aprendiendo a manejar correctamente la caché) ✅ **Cache y rendimiento (Edge Config)**: Configuración de cabeceras de caché agresivas para activos estáticos y CDN de Cloudflare.

---

## Portafolio Profesional (`portfolio.jorgedoicela.com`) — Frontend + Backend

> Portafolio de alto impacto visual con terminal SSH interactiva en tiempo real. **La terminal es una feature exclusiva de desktop.** En móvil, el portafolio muestra las mismas secciones visuales en formato de tarjetas/acordeón adaptado al tacto.

### Terminal Virtual SSH (WebSockets)
> ⚠️ **Toda esta sección es 🌐 — exclusiva de escritorio.** Los teclados virtuales de iOS/Android no tienen teclas de flecha, Tab ni secuencias ANSI estándar. En viewports móviles mostrar un banner informativo ("Visita desde un ordenador para acceder a la terminal interactiva") y redireccionar al contenido visual del portafolio.

- [ ] 🌐 **Historial de comandos con tecla flecha arriba/abajo**: Navegar entre los comandos previamente escritos durante la sesión, como en una terminal real.
- [ ] 🌐 **Autocompletado con Tab**: Al presionar Tab, la terminal sugiere y completa el comando más probable o muestra las opciones disponibles.
- [ ] 🌐 **Comando `cat <archivo>`**: Simula la lectura de archivos de texto plano (ej. cat README.md devuelve un texto predefinido sobre el portafolio).
- [ ] 🌐 **Comando `ls`**: Lista los "archivos" disponibles del portafolio virtual (README.md, skills.json, experience.log, etc.).
- [ ] 🌐 **Comando `cd <carpeta>`**: Cambia el "directorio" actual del prompt, añadiendo profundidad a la simulación.
- [ ] 🌐 **Comando `whoami`**: Devuelve información del perfil del usuario.
- [ ] 🌐 **Comando `date`**: Devuelve la hora y fecha actuales del servidor.
- [ ] 🌐 **Comando `uptime`**: Devuelve cuánto tiempo lleva el servidor en línea desde el último reinicio.
- [ ] 🌐 **Comando `man <comando>`**: Devuelve una página de manual simulada con la descripción detallada del comando.
- [ ] 🌐 **Comando `echo`**: Imprime en pantalla el argumento pasado.
- [ ] 🌐 **Comando `curl <url>`**: Simula una llamada HTTP y devuelve JSON formateado de la info del portafolio.
- [ ] 🌐 **Comando `git log`**: Imprime un historial de commits ficticios con el historial de hitos de la vida de Jorge.
- [ ] 🌐 **Comando `sudo`**: Devuelve un mensaje de acceso denegado con humor (ej. "Este incidente ha sido reportado.").
- [ ] 🌐 **Comando `open`**: Abre en una nueva pestaña un enlace predefinido (LinkedIn, GitHub, etc.).
- [ ] 🌐 **Comando `matrix`**: Activa una animación de lluvia de caracteres tipo Matrix en la pantalla de la terminal durante unos segundos.
- [ ] 🌐 **Comando `clear`**: Limpia todo el historial de la terminal en pantalla.
- [ ] 🌐 **Comando `exit`**: Cierra la ventana de la terminal con una animación de desconexión SSH.
- [ ] 🌐 **Múltiples sesiones/pestañas de terminal**: Interfaz con pestañas al estilo tmux para abrir varias terminales simultáneamente.
- [ ] 🌐 **Color ANSI real**: Soporte para secuencias de escape ANSI para colorear la salida de los comandos.
- [ ] 🌐 **Indicador de conexión en tiempo real**: Semáforo visual que refleja el estado del WebSocket (verde = conectado, amarillo = reconectando, rojo = desconectado).
- [ ] 🌐 **Redimensionado de la terminal (PTY resize)**: La terminal detecta el tamaño de la ventana y ajusta las columnas de texto.
- [ ] 🌐 **Modo pantalla completa**: Botón para expandir la terminal a pantalla completa con animación.
- [ ] 🌐 **Copiar salida al portapapeles**: Botón de copiar en cada línea de salida de la terminal.
- [ ] 🌐 **Compartir sesión de terminal en modo lectura**: Generar un enlace único que permite a un visitante ver la sesión en tiempo real (modo espejo).

### Secciones del Portafolio Visual
- [ ] 🔀 **Tarjetas 3D del stack tecnológico**: Las tarjetas rotan y muestran más información al hacer hover, con efecto de profundidad. *(En móvil: reemplazar hover por tap con flip animation.)*

- [ ] ✅ **Animación de escritura en el rol profesional**: El subtítulo alterna cíclicamente entre distintos roles ("Full Stack Developer", "AI Engineer", "Security Researcher").

- [ ] ✅ **Timeline de experiencia interactiva**: Línea de tiempo animada y scrolleable donde cada punto despliega un panel de detalle expandible.

- [ ] Revisar ✅ **Sistema de filtro de proyectos por tecnología**: Botones que filtran las tarjetas por tecnología con animación de reordenamiento.

- [ ] ✅ **Lightbox de proyectos**: Al hacer clic en un proyecto, se abre un modal expandido con capturas de pantalla y descripción completa.

- [ ] ✅ **Sección de publicaciones o artículos**: Miniaturas de artículos técnicos enlazados desde el portafolio.

- [ ] ✅ **Reproductor de demo de proyectos**: Video corto o GIF que se reproduce al hacer hover sobre la tarjeta del proyecto.

- [ ] ✅ **Sección de valores y filosofía de trabajo**: Texto inspiracional con la filosofía de desarrollo guiada por valores (fe cristiana, excelencia técnica).

- [ ] ✅ **Sección de certificaciones**: Tarjetas de certificaciones obtenidas con enlace de verificación.

- [ ] ✅ **Mapa de calor de contribuciones de GitHub**: Embebido del gráfico de contribuciones directamente en la página.

- [ ] 🌐 **Modo presentación**: Modo especial activable por URL param ?present=true que oculta la navegación y amplía el contenido para proyector.

### Formulario de Contacto y Comunicación
- [ ] ✅ **Validación en tiempo real**: Cada campo del formulario valida el formato mientras el usuario escribe.

- [ ] ✅ **Anti-spam con reCAPTCHA o Turnstile (Cloudflare)**: Proteger el endpoint de contacto de bots.

- [ ] ✅ **Notificación por correo electrónico al enviar**: El backend envía un correo a Jorge via Nodemailer cuando llega un nuevo mensaje.

- [ ] ✅ **Notificación push al teléfono (Ntfy o Pushover)**: El backend llama a un servicio de push cuando llega un mensaje nuevo.

- [ ] ✅ **Auto-respuesta automática por correo al visitante**: El backend envía un correo de confirmación al visitante.

- [ ] ✅ **Panel de administración de mensajes**: Ruta protegida /admin/contact para ver, marcar como leídos y eliminar mensajes.

- [ ] ✅ **Autenticación básica del panel de admin**: Login con usuario y contraseña para proteger el panel.

- [ ] ✅ **Exportación de mensajes a CSV**: Botón en el panel de admin para exportar todos los mensajes a un archivo .csv.

- [ ] ✅ **Estado de los mensajes**: Campo status en la base de datos (nuevo, leído, archivado) gestionable desde el panel de admin.

### Visitas y Métricas
- [ ] 🌐 **Heatmap de clicks en el portafolio**: Integración ligera de un script de mapa de calor para ver en qué zonas hace clic el visitante.

---






## Biblia Modular (`bible.jorgedoicela.com`) — Frontend Web + App Nativa Expo

> Lector digital minimalista de las Sagradas Escrituras. **Esta es la sección con mayor presencia en móvil:** existe una app nativa Expo (`frontend/mobile`) dedicada exclusivamente a la Biblia. Cada idea debe evaluarse para determinar si va en la web, en la app o en ambas.

### Lectura y Navegación
- [ ] ✅ **Paginación por capítulo**: Cargar capítulo por capítulo con botones de anterior/siguiente en lugar de todos los versículos de un libro.
- [ ] ✅ **Selector de capítulo con menú desplegable**: Dropdown o slider para saltar directamente a cualquier capítulo.
- [ ] ✅ **Barra de búsqueda global de versículos**: Campo de búsqueda en tiempo real que filtra versículos por texto con el término resaltado.
- [ ] ✅ **Búsqueda avanzada por referencia**: Parseo de referencias bíblicas exactas (ej. escribir "Juan 3:16" y saltar directamente a ese versículo).
- [ ] ✅ **Vista de comparación de traducciones**: Mostrar el mismo versículo lado a lado en múltiples traducciones seleccionadas.
- [ ] ✅ **Modo de lectura continua**: Modo que desactiva la separación por capítulos y permite leer el libro entero sin interrupciones.
- [ ] ✅ **Indicador de progreso de lectura del libro**: Barra de progreso que indica qué porcentaje del libro ha sido leído.
- [ ] 🔀 **Bookmarks / Marcadores**: El usuario puede marcar versículos favoritos. *(Web: localStorage. App Expo: `AsyncStorage` de `@react-native-async-storage/async-storage` o sincronización con el backend.)*
- [ ] 🔀 **Historial de lectura**: Registro del último versículo/capítulo visitado para retomar donde se dejó. *(Web: localStorage. App Expo: `AsyncStorage` para persistencia entre sesiones.)*
- [ ] ✅ **Modo de lectura nocturna (sepia)**: Además del modo oscuro, un modo sepia que simula el papel de un libro físico.
- [ ] ✅ **Versículo del día**: En la portada mostrar un versículo aleatorio o curado con una imagen de fondo hermosa.
- [ ] 🔀 **Lector de audio (Text-to-Speech)**: Botón para escuchar el capítulo leído en voz alta. *(Web: Web Speech API. App Expo: `expo-speech`.)*
- [ ] ✅ **Tamaño de fuente ajustable**: Slider de accesibilidad para aumentar o disminuir el tamaño del texto.
- [ ] ✅ **Modo pantalla completa de lectura**: Ocultar la barra de navegación para una experiencia de lectura inmersiva.
- [ ] 🔀 **Compartir versículo**: Botón en cada versículo para copiar y compartir. *(Web: Web Share API / clipboard. App Expo: `Share` de React Native o `expo-sharing`.)*
- [ ] 🔀 **Notificación de versículo del día (push web)**: El usuario puede suscribirse para recibir el versículo del día cada mañana. *(Web: Web Push Notifications. App Expo: `expo-notifications` — **mucho más efectivo y fiable en móvil**.)*

### Funcionalidades de Estudio Bíblico
- [ ] 🔀 **Sistema de Notas por Versículo**: Cada versículo puede tener una nota privada. *(Web: localStorage. App Expo: `AsyncStorage` + sincronización con backend.)*
- [ ] ✅ **Resaltado de versículos por color**: El usuario puede resaltar versículos con distintos colores (amarillo, verde, azul, rojo) para categorizar temas.
- [ ] ✅ **Panel de referencias cruzadas**: Al seleccionar un versículo, mostrar un panel lateral con otros versículos relacionados temáticamente.
- [ ] ✅ **Concordancia de palabras**: Dado un término bíblico, listar todos los versículos donde aparece dicha palabra con su contexto.
- [ ] ✅ **Plan de lectura bíblica**: Módulo que divide la Biblia en un plan de 365 días y marca el progreso diario.
- [ ] ✅ **Plan de lectura personalizable**: El usuario define los libros y el rango de tiempo de su plan a la medida.
- [ ] ✅ **Modo de memorización de versículos**: Muestra el versículo con ciertas palabras ocultas y el usuario debe completarlas, como un quiz.
- [ ] 🔀 **Generador de imágenes de versículo**: Seleccionar un versículo y generar una imagen lista para compartir en Instagram o WhatsApp. *(Web: Canvas API. App Expo: `react-native-view-shot`.)*
- [ ] ✅ **Comentarios y notas de predicaciones (devocionales)**: Sección de notas adicionales por capítulo con reflexiones teológicas que Jorge puede agregar.
- [ ] ✅ **Interlineado Griego / Hebreo (avanzado)**: Para cada versículo, mostrar el texto original con transliteración y definición de cada palabra.
- [ ] ✅ **Diccionario bíblico integrado**: Al hacer doble clic (o long-press en móvil) sobre una palabra, mostrar su definición y apariciones en la Biblia.
- [ ] ✅ **Mapa bíblico geográfico**: Mostrar en un mapa interactivo los lugares geográficos mencionados en el libro que se está leyendo.

### Administración y Datos
- [ ] ✅ **Importador masivo de versículos (CSV/JSON)**: Endpoint del backend para importar miles de versículos desde archivos CSV o JSON.
- [ ] ✅ **Importador desde API pública (Bible API)**: Script en el backend que descarga versículos de una API pública y los importa automáticamente.
- [ ] 🌐 **Panel de administración de traducciones**: Ruta protegida para agregar, editar o eliminar traducciones sin tocar la API directamente.
- [ ] 🌐 **Panel de administración de libros y versículos**: CRUD visual completo desde una interfaz web.
- [ ] ✅ **Exportación de un libro o capítulo a PDF**: El usuario puede descargar un capítulo o libro completo en formato PDF.
- [ ] ✅ **API pública de la Biblia**: Exponer los endpoints con documentación Swagger/OpenAPI para que otros desarrolladores puedan consumir la base de datos.

### Estadísticas y Gamificación
- [ ] ✅ **Estadísticas de lectura del usuario**: Cuántos capítulos ha leído, racha de días consecutivos y porcentaje de la Biblia completado.
- [ ] ✅ **Sistema de logros (badges)**: Insignias desbloqueables por hitos (ej. "Leer el Nuevo Testamento completo", "7 días seguidos de lectura").
- [ ] ✅ **Ranking de versículos más marcados**: Qué versículos han marcado como favoritos la mayor cantidad de usuarios.

---

## Galería de Software (`software.jorgedoicela.com`) — Frontend + Backend

> Catálogo visual y técnico de proyectos y herramientas desarrolladas por Jorge. Principalmente web, pero debe ser completamente usable en móvil con diseño responsivo y targets táctiles adecuados (mínimo 44×44px).

### Catálogo de Proyectos
- [ ] ✅ **Filtros por tecnología o categoría**: Chips o tags clicables que filtran la malla por lenguaje, framework o tipo (web, mobile, CLI, IA, etc.).
- [ ] ✅ **Buscador en tiempo real**: Campo de búsqueda que filtra proyectos por nombre, descripción o tecnología mientras el usuario escribe.
- [ ] ✅ **Orden dinámico de proyectos**: Ordenar la malla por fecha de creación, nombre o número de estrellas en GitHub.
- [ ] ✅ **Página de detalle de proyecto**: Ruta /software/projects/:id con toda la información: descripción completa, capturas de pantalla, stack, fecha y enlaces.
- [ ] ✅ **Sistema de tags múltiples por proyecto**: Campo tags[] en la entidad Project para clasificar con múltiples etiquetas (open-source, en-producción, en-desarrollo, etc.).
- [ ] ✅ **Estado del proyecto en tiempo real**: Badge en cada tarjeta que indica el estado (En desarrollo, Producción, Archivado, Mantenimiento).
- [ ] ✅ **Contador de estrellas de GitHub**: Llamada a la API pública de GitHub para mostrar el número de estrellas del repositorio en la tarjeta.
- [ ] ✅ **Fecha de última actualización de GitHub**: Mostrar cuándo fue el último commit del repositorio.
- [ ] 🔀 **Enlace a demo en vivo con iframe preview**: Al pasar el cursor sobre una tarjeta, mostrar una miniatura de la URL en producción. *(En móvil: `hover` no existe — reemplazar con thumbnail estático o screenshot pregenerado.)*
- [ ] ✅ **Carousel de imágenes por proyecto**: Galería deslizante de capturas de pantalla dentro de la página de detalle. *(En móvil: activar swipe gesture nativo.)*
- [ ] ✅ **Video demo embebido**: Video de demostración del proyecto embebido desde YouTube o servido como asset local.

### Administración de Proyectos
- [ ] 🌐 **Panel de administración protegido**: Ruta /admin/projects con autenticación básica para gestionar los proyectos sin tocar la API directamente.
- [ ] 🌐 **CRUD visual completo**: Formularios para crear, editar y eliminar proyectos desde la interfaz de administración.
- [ ] 🌐 **Subida de imágenes de capturas de pantalla**: Endpoint de subida de archivos (multipart/form-data) en NestJS para guardar imágenes de los proyectos.
- [ ] 🌐 **Reordenación drag-and-drop de proyectos**: En el panel de admin, reordenar la posición de los proyectos arrastrando y soltando tarjetas.
- [ ] 🌐 **Programación de publicación**: Campo publishedAt en la entidad Project para agendar cuándo aparece un proyecto en la galería pública.
- [ ] 🌐 **Modo borrador de proyecto**: Campo isDraft para trabajar en el contenido de un proyecto sin publicarlo en la galería pública.

### Funcionalidades de Comunidad e Interacción
- [ ] ✅ **Sistema de reacciones por proyecto**: Botones de reacción (Me impresiona, Favorito, Increíble) que los visitantes pueden usar sin registrarse.
- [ ] ✅ **Contador de visualizaciones**: El backend registra cuántas veces se ha visitado la página de detalle de cada proyecto.
- [ ] ✅ **Sección de comentarios**: Sistema de comentarios por proyecto (sin registro, usando nombre + mensaje) almacenados en la base de datos.
- [ ] ✅ **Compartir proyecto en redes**: Botones para compartir la URL del proyecto directamente a Twitter, LinkedIn o WhatsApp.
- [ ] ✅ **Formulario de colaboración**: Formulario en la página de detalle para que otro desarrollador pueda proponer colaboración en un proyecto.
- [ ] ✅ **Newsletter / Lista de correos**: Los visitantes pueden suscribirse para recibir novedades cuando Jorge publique un nuevo proyecto.

### Integraciones Avanzadas
- [ ] ✅ **Sincronización automática con GitHub**: Tarea cron en el backend que consulta la API de GitHub y actualiza automáticamente los datos de cada repositorio.
- [ ] ✅ **Importador de repositorios de GitHub**: Endpoint que, dado el username de GitHub, importa automáticamente todos los repositorios públicos como borradores.
- [ ] ✅ **Generación automática de tarjetas de proyecto (OG Image)**: Para cada proyecto, generar una imagen Open Graph dinámica con Next.js OG.
- [ ] ✅ **Integración con npm**: Si algún proyecto es una librería npm, mostrar el número de descargas semanales en la tarjeta.
- [ ] ✅ **Notificación cuando se crea un nuevo proyecto**: El backend emite un evento por WebSocket a todos los visitantes activos anunciando en tiempo real que hay un nuevo proyecto.

---

## Funcionalidades Transversales (Aplican a varios o todos los proyectos)

> Estas ideas afectan la arquitectura del monorepo a nivel general o a varios subproyectos simultáneamente.

### Seguridad
- [ ] ✅ **Rate Limiting global en NestJS**: Limitar el número de peticiones por IP usando @nestjs/throttler para proteger todos los endpoints de abuso.
- [ ] ✅ **Helmet para cabeceras HTTP seguras**: Implementar el middleware de helmet en NestJS para agregar cabeceras de seguridad en todas las respuestas.
- [ ] ✅ **Logging de peticiones sospechosas**: El GlobalExceptionFilter registra peticiones que disparan errores 4xx/5xx con la IP del origen.
- [ ] ✅ **Sanitización de inputs (XSS)**: Sanitizar todos los campos de texto libre antes de persistirlos en la base de datos.
- [ ] ✅ **CSRF Protection**: Implementar tokens CSRF en formularios que realizan operaciones de escritura.

### Rendimiento y Escalabilidad
- [ ] ✅ **Caché de respuestas en NestJS (Cache Manager)**: Implementar @nestjs/cache-manager con TTL configurable para cachear las respuestas más frecuentes en memoria.
- [ ] ✅ **Lazy Loading de imágenes**: Activar loading="lazy" en todas las imágenes y usar el componente Image de Next.js para optimización automática.
- [ ] ✅ **Compresión Gzip/Brotli en NestJS**: Activar el middleware compression para comprimir las respuestas JSON grandes.
- [ ] ✅ **Paginación cursor-based en todos los endpoints de lista**: Paginación eficiente basada en cursor en lugar de offset.
- [ ] ✅ **Índices de base de datos optimizados**: Revisar y crear índices en las columnas más consultadas de cada SQLite.
- [ ] 🌐 **Suspense y Streaming con React Server Components**: Aprovechar el streaming de Next.js App Router para servir el esqueleto de la página inmediatamente.
- [ ] ✅ **Skeleton screens (pantallas de esqueleto)**: Reemplazar los estados de carga con placeholders animados que imitan la forma del contenido real.

### Monitoreo y Observabilidad
- [ ] ✅ **Dashboard de métricas del servidor (Prometheus + Grafana)**: Exponer un endpoint /metrics en NestJS para ser scrapado por Prometheus.
- [ ] ✅ **Alertas de caída del servidor**: Configurar UptimeRobot o Betteruptime para monitorear los cuatro subdominios.
- [ ] ✅ **Health check endpoints**: Endpoint GET /health en NestJS que verifica la conexión a las tres bases de datos SQLite.
- [ ] ✅ **Logs centralizados con Loki + Grafana**: Los logs JSON de nestjs-pino son capturados por Promtail y enviados a un servidor Loki.

### Autenticación y Gestión de Usuarios (Futuro)
- [ ] ✅ **Sistema de autenticación (JWT + Refresh Token)**: Módulo auth en el backend con registro, login, refresh y revocación de tokens JWT.
- [ ] ✅ **Login con proveedores OAuth**: Autenticación con Google, GitHub o Discord para los paneles de administración.
- [ ] ✅ **Cuentas de usuario básicas**: Permitir a los lectores registrarse para guardar marcadores, notas y preferencias en la nube.
- [ ] ✅ **Roles y permisos**: Sistema de roles (admin, editor, reader) para controlar el acceso a los distintos paneles de gestión.

### CI/CD y DevOps
- [ ] ✅ **Tests unitarios con Jest**: Pruebas unitarias para los servicios del backend con cobertura mínima del 80%.
- [ ] ✅ **Tests de integración con Supertest**: Probar los controladores de la API con peticiones HTTP reales sobre una base de datos SQLite en memoria.
- [ ] 🌐 **Tests E2E del frontend con Playwright**: Automatizar los flujos críticos del usuario (navegar por la Biblia, enviar formulario de contacto, ejecutar comandos en la terminal).
- [ ] ✅ **Análisis estático de código con SonarQube**: Integrar SonarQube en el pipeline de GitHub Actions para detectar code smells y vulnerabilidades.
- [ ] ✅ **Revisión automática de dependencias (Dependabot)**: Configurar GitHub Dependabot para recibir PRs automáticos de actualización de dependencias.
- [ ] ✅ **Entorno de staging**: Un segundo VPS o rama staging para probar los cambios antes de desplegarlos en producción.
- [ ] ✅ **Docker y Docker Compose**: Containerizar cada subproyecto para replicar el entorno de producción de forma fiel en cualquier máquina local.
- [ ] ✅ **Rollback automático**: El pipeline de GitHub Actions guarda la versión anterior del dist y la restaura automáticamente si PM2 detecta que el nuevo despliegue falla.

---

## 📱 App Nativa Expo — Biblia Móvil (`frontend/mobile`)

> Esta sección documenta las funcionalidades **exclusivas** de la app nativa en React Native + Expo que no tienen equivalente directo en la web. El scaffolding existe en `frontend/mobile/`; todo lo de aquí es trabajo nuevo.

### Experiencia Nativa de Lectura
- [ ] 📱 **Navegación nativa con Expo Router**: Implementar `expo-router` con una estructura de rutas `(tabs)` para la navegación principal (Inicio, Libros, Búsqueda, Favoritos, Perfil).
- [ ] 📱 **Gestos de swipe entre capítulos**: Con `react-native-gesture-handler` and `react-native-reanimated`, deslizar horizontalmente para avanzar o retroceder capítulos, igual que en una app de lectura profesional.
- [ ] 📱 **Scroll de versículos con FlatList virtualizada**: Usar `FlatList` o `FlashList` de Shopify para renderizar únicamente los versículos visibles y garantizar 60fps en libros largos.
- [ ] 📱 **Feedback háptico en acciones**: Vibración sutil al marcar un favorito, al completar un capítulo o al activar un logro, usando `expo-haptics`.
- [ ] 📱 **Modo de lectura en paisaje (landscape)**: Optimizar el layout para orientación horizontal mostrando dos columnas de texto cuando el dispositivo está en horizontal, detectado con `expo-screen-orientation`.
- [ ] 📱 **Selector de fuente tipográfica**: Permitir al usuario elegir entre al menos 3 fuentes tipográficas distintas (serif, sans-serif, monoespaciada) cargadas con `expo-font`.
- [ ] 📱 **Control de brillo de pantalla**: Slider en la app para ajustar el brillo de la pantalla directamente desde la lectura sin salir de la app, usando `expo-brightness`.

### Notificaciones y Engagement
- [ ] 📱 **Versículo del día con push notification nativa**: Usando `expo-notifications`, programar una notificación local diaria a la hora preferida del usuario con el versículo del día. No requiere servidor — funciona 100% offline.
- [ ] 📱 **Recordatorio de plan de lectura**: Notificación local recurrente recordando al usuario completar su lectura diaria si no lo ha hecho antes de las 9pm.
- [ ] 📱 **Notificación de logro desbloqueado**: Cuando el usuario completa un hito (7 días seguidos, libro completo), mostrar una notificación nativa de felicitación con sonido.
- [ ] 📱 **Badge en el ícono de la app**: Mostrar el número de días de racha activa en el badge del ícono de la app en iOS/Android.

### Offline First y Sincronización
- [ ] 📱 **Descarga offline de libros completos**: El usuario puede descargar cualquier libro de la Biblia para leerlo sin conexión. Los archivos JSON se guardan en el sistema de archivos del dispositivo con `expo-file-system`.
- [ ] 📱 **Modo offline completo**: La app funciona sin conexión a internet para la lectura, marcadores, notas y plan de lectura. Solo requiere red para sincronizar con el backend.
- [ ] 📱 **Sincronización de progreso en segundo plano**: Cuando recupera la conexión, la app sincroniza automáticamente los marcadores, notas y progreso del plan de lectura con el backend usando `expo-background-fetch`.
- [ ] 📱 **Indicador de estado de sincronización**: Icono discreto en la UI que indica si los datos están sincronizados, pendientes de sincronizar o en error.

### Compartir y Redes Sociales
- [ ] 📱 **Compartir versículo como imagen nativa**: Generar una imagen bonita del versículo con `react-native-view-shot` y compartirla directamente al sheet nativo de iOS/Android (WhatsApp, Instagram Stories, etc.).
- [ ] 📱 **Widget de versículo del día en pantalla de inicio**: Implementar un widget nativo para iOS (WidgetKit) y Android (Glance) que muestre el versículo del día sin abrir la app. *(Requiere Expo SDK 50+ con módulos nativos o EAS Build.)*
- [ ] 📱 **Deep links desde notificaciones**: Al tocar una notificación de versículo del día, la app navega directamente al versículo correspondiente usando Expo Router deep links.

### Accesibilidad Nativa
- [ ] 📱 **Compatibilidad completa con VoiceOver (iOS) y TalkBack (Android)**: Todas las pantallas tienen `accessibilityLabel`, `accessibilityHint` y `accessibilityRole` correctamente definidos para usuarios con discapacidad visual.
- [ ] 📱 **Respeto a la fuente del sistema (Dynamic Type en iOS)**: El texto escala automáticamente según la configuración de tamaño de fuente del sistema operativo del usuario.
- [ ] 📱 **Modo de alto contraste**: Detectar `useColorScheme` y la configuración de accesibilidad del sistema para ofrecer un tema de alto contraste optimizado.

### Configuración y Personalización
- [ ] 📱 **Pantalla de configuración nativa**: Pantalla Settings con: idioma preferido, hora de notificación diaria, tamaño de fuente, tema visual, traducción por defecto y preferencias de sincronización.
- [ ] 📱 **Soporte para múltiples traducciones offline**: El usuario puede descargar varias traducciones (RVR60, NVI, LBLA) y cambiar entre ellas sin conexión.
- [ ] 📱 **Bloqueo con biometría (FaceID / Huella)**: Opción para proteger el acceso a las notas privadas con autenticación biométrica usando `expo-local-authentication`.
- [ ] 📱 **Importar/Exportar notas personales**: Exportar todas las notas y marcadores del usuario a un archivo JSON y restaurarlos en otro dispositivo.

### Rendimiento y Calidad
- [ ] 📱 **Splash screen animado**: Reemplazar el splash screen estático de Expo por una animación de entrada con `expo-splash-screen` y `react-native-reanimated`.
- [ ] 📱 **App icon y assets adaptivos**: Configurar iconos adaptativos para Android (monochrome icon) y el set completo de tamaños para iOS con `expo-icons`.
- [ ] 📱 **EAS Build y distribución por canales**: Configurar Expo Application Services (EAS) para builds automáticos con canales `production`, `staging` y `preview` desde GitHub Actions.
- [ ] 📱 **Over-the-Air updates (OTA)**: Usar `expo-updates` para publicar actualizaciones de JavaScript sin pasar por el proceso de revisión de la App Store / Google Play.
- [ ] 📱 **Tests con Jest + React Native Testing Library**: Pruebas unitarias y de componentes específicas para React Native, separadas de los tests de la web.

---

> **Nota de uso:** Este documento es un inventario de posibilidades. Cada checkbox `[ ]` representa una funcionalidad pendiente de implementación. Los íconos de plataforma (✅ 🌐 📱 🔀) indican en qué entorno implementar cada funcionalidad. El orden de prioridad debe ser definido por Jorge en función de los objetivos de cada fase del proyecto. Se recomienda revisar y actualizar este documento periódicamente a medida que el ecosistema evolucione.
