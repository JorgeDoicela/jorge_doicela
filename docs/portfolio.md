# Portafolio Profesional (portfolio.jorgedoicela.com)

Este documento detalla la arquitectura, el funcionamiento y el flujo de datos del Portafolio Profesional de Jorge Doicela, accesible mediante el subdominio `portfolio.jorgedoicela.com`.

---

## 1. Descripción General
El Portafolio es una aplicación interactiva híbrida que combina un diseño web tradicional de alta costura (Linear Look) con un emulador de terminal Unix interactivo en tiempo real conectado por WebSockets. Sirve para presentar la biografía, formación académica, experiencia laboral y habilidades de Jorge.

---

## 2. Frontend (Next.js)

El frontend está encapsulado en el grupo de rutas `(portfolio)`. 

### 2.1 Secciones Principales
* **Sobre Mí / Biografía**: Resumen del enfoque del desarrollador guiado por valores cristianos y estudios en IA y ciberseguridad.
* **Stack Principal**: Grid interactiva que agrupa las tecnologías en tres segmentos: Frontend, Backend y DevOps/Datos.
* **Experiencia Laboral**: Línea de tiempo que detalla puestos recientes (como Full-Stack Developer en Emplifi y CNC).
* **Educación**: Resumen académico que incluye la Ingeniería en Inteligencia Artificial y Ciberseguridad.
* **Entorno y Flujo**: Detalla su stack diario (Arch Linux, Debian, Neovim, tmux, Hyprland, etc.).
* **Módulo Interactivo (Terminal)**: Una consola virtual que permite a los usuarios interactuar con el portafolio mediante comandos Unix habituales.

### 2.2 Archivos del Frontend
* [(portfolio)/portfolio/page.tsx](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/portfolio/page.tsx): El componente contenedor que renderiza la estructura visual principal.
* [(portfolio)/features/terminal/](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/features/terminal/): Contiene la interfaz de la consola y el hook de comunicación por sockets.
* [(portfolio)/features/contact/](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/features/contact/): Gestiona el componente del formulario de contacto.
* [(portfolio)/globals.css](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/globals.css): Define la tipografía, variables y clases utilitarias personalizadas para lograr una estética sofisticada.

---

## 3. Terminal Virtual SSH (WebSockets)

La terminal del portafolio no es un simulador local estático de Javascript; realiza una conexión WebSocket persistente contra el servidor NestJS para procesar comandos.

### 3.1 Cliente (Next.js)
El hook [useTerminalSocket.ts](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/frontend/web/src/app/(portfolio)/features/terminal/hooks/useTerminalSocket.ts) controla la conexión con el backend:
* **Conexión**: Se conecta al servidor backend utilizando la librería `socket.io-client` bajo el namespace `terminal`.
* **Escucha de Salida**: Escucha el evento `terminal-output` proveniente del servidor para imprimir el contenido en pantalla.
* **Envío de Comandos**: Cuando el usuario escribe un comando y presiona Enter, el cliente emite el evento `execute-command` enviando el string de entrada.

### 3.2 Servidor (NestJS)
El backend procesa la entrada en el módulo `portfolio`:
* [PortfolioGateway](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/gateways/portfolio.gateway.ts): Administra las conexiones bajo el namespace `'terminal'`.
  * `handleConnection`: Al establecerse la conexión, envía un banner de bienvenida de SSH y el prompt inicial (`jorge@vps-1gb-ram:~$ `).
  * `execute-command`: Intercepta la petición y delega la ejecución al servicio.
* [PortfolioService](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/services/portfolio.service.ts): El intérprete de comandos que procesa la entrada:
  * `help`: Retorna los comandos disponibles.
  * `about`: Imprime información detallada sobre Jorge (biografía e ingeniería).
  * `neofetch`: Imprime un resumen estilizado del sistema operativo (Arch Linux, Debian), kernel, memoria, hardware virtual (VPS de 1GB), faith y status.
  * `contact`: Muestra enlaces de redes y contacto profesional.
  * `skills`: Lista detallada del stack tecnológico.
  * *Comando desconocido*: Retorna un error indicando que el comando no existe.

---

## 4. Formulario de Contacto y Persistencia

El portafolio permite enviar mensajes al administrador, los cuales se almacenan localmente.

### 4.1 Flujo de Datos
1. El usuario completa el formulario de contacto en el frontend.
2. El cliente hace una petición HTTP `POST` a `${NEXT_PUBLIC_API_URL}/portfolio/contact`.
3. El endpoint es procesado en [ContactController](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/controllers/contact.controller.ts) en el backend.
4. El backend valida el cuerpo del mensaje utilizando un DTO (`CreateContactMessageDto`).
5. El servicio [ContactMessagesService](file:///c:/Users/DESARROLLADOR/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/services/contact-messages.service.ts) persiste el registro en la base de datos local SQLite (`portfolio.sqlite`) a través de la entidad de TypeORM.

### 4.2 Modelo de Datos (`ContactMessage`)
* `id`: Entero auto-incremental (clave primaria).
* `name`: Nombre del remitente.
* `email`: Dirección de correo electrónico.
* `message`: Texto del mensaje enviado.
* `createdAt`: Marca de tiempo de inserción automática.
