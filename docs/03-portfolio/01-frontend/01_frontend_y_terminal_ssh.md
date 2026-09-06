# Portafolio Profesional - Frontend y Terminal SSH (Next.js)

Este documento detalla la arquitectura macro y micro, componentes y funcionamiento de la terminal SSH virtual interactiva del Portafolio (`portfolio.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Subdominio:** `portfolio.jorgedoicela.com` (o `http://localhost:3001` en local — **nunca** `portfolio.localhost:3001`).
> * **Enrutamiento:** `src/middleware.ts` reescribe el host hacia el grupo de rutas `frontend/web/src/app/(portfolio)/`.
> * **Consolidación Física:** Se ejecuta en el único servidor Next.js 16 (puerto `3001`) para optimizar el límite de **1 GB de RAM** del VPS.
> * **Aislamiento:** Cero importaciones de otros subdominios (`bible`, `software`, `landing`). Estilos encapsulados en `(portfolio)/globals.css`.
>
> **Arquitectura Micro:**
> * **Feature-Sliced Design (FSD):** El código se organiza en `features/terminal/` (consola SSH) y `features/contact/` (formulario).
> * **Jerarquía de Componentes:** Componentes compartidos del subdominio en `(portfolio)/components/` vs componentes específicos en `features/<feature>/components/`.
> * **Estética Dark Luxury:** Fondos oscuros premium, acentos metálicos y dorados sutiles, tipografía Geist/Mono y alto contraste elegante.

---

## 2. Estructura de Directorios (Feature-Sliced Design)

```text
frontend/web/src/app/(portfolio)/
├── globals.css                # Estilos aislados del portafolio (Dark Luxury Look)
├── layout.tsx                 # Layout raíz con ThemeProvider local
├── theme-provider.tsx         # Proveedor de tema claro/oscuro
├── portfolio/
│   └── page.tsx               # Contenedor principal de vistas
│
├── components/                # COMPONENTES COMPARTIDOS DEL SUBDOMINIO
│   ├── ThemeToggle.tsx        # Conmutador de tema visual
│   ├── TypewriterRole.tsx     # Animación de escritura de roles
│   └── ValuesPhilosophySection.tsx # Sección de valores y ética
│
├── features/                  # FEATURE-SLICED DESIGN (FSD)
│   ├── projects/              # FEATURE: SHOWCASE DE PROYECTOS Y CASOS DE ESTUDIO
│   │   ├── components/
│   │   │   ├── ProjectShowcase.tsx     # Galería con filtros reactivos y botones Dark Luxury
│   │   │   └── ProjectDetailModal.tsx  # Modal in-page de Casos de Estudio (createPortal)
│   │   └── types.ts           # Interfaces de proyectos, métricas y casos de estudio
│   │
│   ├── terminal/              # FEATURE: SISTEMA TRI-MODAL DE TERMINAL
│   │   ├── components/
│   │   │   ├── TerminalConsole.tsx       # Conmutador de modo y ventana interactiva
│   │   │   ├── SandboxTerminal.tsx       # Terminal Linux Real en Vivo (xterm.js + FitAddon)
│   │   │   ├── ServerOfflineBanner.tsx   # Banner Dark Luxury de Servidor Offline y Solicitud Telegram
│   │   │   ├── TerminalHeader.tsx        # Barra superior tmux y controles
│   │   │   ├── MatrixRain.tsx            # Animación de lluvia Matrix
│   │   │   └── MobileTerminalBanner.tsx  # Banner adaptativo para móviles
│   │   ├── hooks/
│   │   │   ├── useTerminalSocket.ts      # WebSocket de la terminal guiada (/terminal)
│   │   │   └── useSandboxTerminal.ts     # WebSocket + xterm.js del Sandbox (/sandbox)
│   │   ├── utils/
│   │   │   └── ansiParser.tsx            # Renderizado de colores y secuencias ANSI
│   │   └── types.ts
│   │
│   └── contact/               # FEATURE: FORMULARIO DE CONTACTO
│       ├── components/
│       │   └── ContactForm.tsx       # Formulario con validación en tiempo real
│       ├── hooks/
│       │   └── useContact.ts         # Llamada HTTP POST al backend
│       └── types.ts
```

---

## 3. Showcase de Proyectos y Casos de Estudio de Ingeniería (`features/projects/`)

### 3.1 Tarjetas de Catálogo (`ProjectShowcase.tsx`)
* **Filtrado por Categorías:** Clasificación dinámica por etiquetas técnicas (`Full Stack`, `Cloud & DevSecOps`, `IA & Sistemas`).
* **Botones Táctiles de Alta Gama:**
  * **Demostración ↗ (Acción Principal):** Botón cápsula en oro satinado (`bg-gold-400/15 border border-gold-400/40 text-gold-300 hover:bg-gold-400 hover:text-black font-semibold`).
  * **Código (Acción Secundaria):** Botón estilizado con icono SVG de GitHub y superficie elevada.
  * **Caso de estudio (Disparador Inmersivo):** Enlace interactivo que abre el caso de estudio técnico al hacer clic.

### 3.2 Modal de Caso de Estudio (`ProjectDetailModal.tsx`)
* **Aislamiento en `createPortal`:** Se inyecta como hijo directo de `document.body` con `z-[9999]`, evitando que cualquier propiedad `transform` o animación de contenedores padre atrape el modal.
* **Preservación de Conexiones WebSocket:** Al ser un modal in-page, el usuario puede inspeccionar detalles arquitectónicos sin desmontar la página ni desconectar la sesión interactiva de la terminal.
* **Jerarquía Editorial Aprobada:**
  1. *Visión General del Sistema:* Propósito y valor que aporta el software.
  2. *El Desafío Técnico & Restricciones:* Problemas complejos de memoria, concurrencia o indexación resueltos.
  3. *Arquitectura & Decisiones de Ingeniería:* Patrones en capas, persistencia SQLite WAL y microarquitectura.
  4. *Stack Tecnológico Empleado:* Badges de herramientas y frameworks.
  5. *Especificaciones & Telemetría:* Ficha técnica con líneas punteadas continuas que unen métrica con su valor verificado.

---

## 4. Sistema Tri-Modal de Terminal Interactiva (WebSockets)

El Portafolio implementa un selector de 3 vías conmutado mediante `TerminalConsole.tsx`, con estética Dark Luxury, soporte de pantalla completa mediante `createPortal` y multitarea Unix.

### 4.1 Modo 1: Terminal Guiada (`useTerminalSocket.ts`)
* **Namespace:** Conecta a `${API_URL}/terminal` (puerto 3000) sobre WebSockets bidireccionales con Socket.io.
* **Propósito:** Navegación guiada sin fricción para conocer proyectos, biografía, habilidades y comandos Unix preprogramados (`skills`, `about`, `projects`, `contact`, `neofetch`, `matrix`, `tmux`).
* **Multiplexor de Terminal (Modo tmux):**
  * División en dos columnas (`split-v` / `Ctrl+B %` / botón `[split]`) o dos filas (`split-h` / `Ctrl+B "`).
  * Paneles independientes con su propio historial, autocompletado y prompt `jorge@debian:~$`.
  * Foco inteligente inmediato al hacer clic en cualquier parte del panel.
* **Pantalla Completa Inmersiva (`createPortal`):**
  * Teletransporta la terminal como hijo directo de `document.body` con `z-[99999]`.
  * Tecla de escape rápida (`Esc`) para salir del modo pantalla completa.
* **Seguridad en el Frontend:**
  * `window.open(payload, '_blank', 'noopener,noreferrer')` — aislamiento de contexto en apertura de URLs externas.
  * Ningún input del usuario se imprime en la consola del navegador (`console.log` de teclado eliminado).

### 4.2 Modo 2: Terminal en la Nube — AWS Lightsail (`useSandboxTerminal.ts?mode=vps`)
* **Namespace:** Conecta a `${API_URL}/sandbox` con `targetMode: 'vps'`.
* **Badge e Identidad en terminal:** `EN VIVO • AWS CLOUD`.
* **Banner de bienvenida dinámico en shell:**
  * Subtítulo: `Servidor Cloud en AWS (Amazon Web Services) • Entorno Aislado y Seguro`
  * Prompt: `guest@aws-cloud:~$`
  * Mensaje: Explica al visitante que está en un servidor cloud en AWS Lightsail con aislamiento seguro.
* **Hardware y Aislamiento:** 64 MB RAM, 0.25 vCPU, `pids-limit=50` (ver sección de seguridad en backend).
* **Lanzamiento:** Botón `[ ▶ Iniciar Terminal en la Nube ↗ ]` → `/sandbox?mode=vps`.
* **Comandos Interactivos Nativos del Servidor:**
  * `about`, `projects`, `skills`, `contact`: Fichas del perfil profesional y proyectos destacados.
  * `architecture`: Demostración del reto de consolidación en 1 GB de RAM.
  * `benchmark`: Test de velocidad matemática de CPU y lectura de memoria en tiempo real.
  * `api-live`: Respuesta JSON estructurada de telemetría del sistema.
  * `matrix`: Efecto visual de lluvia digital de código.
  * `neofetch`, `htop`, `nano`, `tree`: Herramientas completas del sistema Linux.
  * `help`: Listado completo con descripción de todos los comandos disponibles.

### 4.3 Modo 3: Terminal en Servidor Propio (`useSandboxTerminal.ts?mode=tunnel`)
* **Namespace:** Conecta a `${SANDBOX_TUNNEL_URL}/sandbox` (`https://tunnel.jorgedoicela.com/sandbox` o variable `NEXT_PUBLIC_SANDBOX_TUNNEL_URL`) con `targetMode: 'tunnel'`.
* **Badge e Identidad en terminal:** `EN VIVO • SERVIDOR LOCAL`.
* **Banner de bienvenida dinámico en shell:**
  * Subtítulo: `Servidor Físico Propio • Conexión Cifrada mediante Túnel`
  * Prompt: `guest@servidor-local:~$`
  * Mensaje: Explica que el visitante está conectado a hardware físico privado a través de un túnel cifrado punto a punto sin intermediarios en AWS.
* **Hardware y Aislamiento:** 256 MB RAM, 1.0 CPU, `pids-limit=100`.
* **Lanzamiento:** Botón `[ Iniciar Terminal en Servidor Propio ]` → `/sandbox?mode=tunnel`.
* **Pre-flight Health Probe con AbortSignal:** Antes de inicializar el WebSocket en modo túnel, `startSession()` realiza una consulta previa ultraliviana `GET ${SANDBOX_TUNNEL_URL}/portfolio/sandbox/health` con timeout estricto de 3 segundos (`AbortSignal.timeout(3000)`). Si el túnel de Cloudflare está caído (Error 1033 o host apagado), la petición falla en menos de 400 ms sin colgar el cliente Socket.IO ni dejar conexiones zombis.
* **Mismos comandos interactivos nativos que el Modo 2**, con la diferencia de identidad del host y recursos expandidos.

### 4.4 Barra de Control Inferior (Footer Consolidado estilo AWS CloudShell)
* **Apertura de Ventana Emergente Dedicada:** El botón de lanzamiento calcula el centro de la pantalla del usuario (`1080x680px`) y abre una ventana popup independiente con `toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,noopener,noreferrer`, aislando el proceso y evitando colisiones de atajos de teclado de Linux (`Ctrl+W`, `Ctrl+T`) con el navegador.
* **Consola Superior Pura:** El canvas xterm.js inicia desde el pixel superior del viewport sin barras distractoras arriba.
* **Barra de Herramientas Inferior (Footer Adaptativo sin Saltos de Layout):**
  * **Ocultamiento Condicional Inteligente:** El footer se oculta por completo (`{!isSecurityState && !isTunnelOffline && (<footer ... />)}`) cuando se despliega un modal de seguridad o el banner de servidor físico apagado, garantizando máxima pureza visual e impidiendo estados contradictorios (como indicadores de "EN VIVO" cuando la máquina no está disponible).
  * Izquierda: Botón de retorno/cierre inteligente (`← Volver al Portafolio`), badge del modo (`EN VIVO • AWS CLOUD` / `EN VIVO • SERVIDOR LOCAL`).
  * Derecha:
    * Botón `[📋 Copiar selección]` y `[📥 Pegar en terminal]`.
    * Temporizador dinámico de sesión activa (`⏱ 04:33`).
    * Botón de salida `[ ✕ Finalizar ]` / `[ ▶ Reconectar ]`, y selectores `LanguageToggle` / `ThemeToggle`.

### 4.5 Seguridad y Sincronización en el Hook `useSandboxTerminal.ts`
* **Sincronización Multiventana Local (`BroadcastChannel`):** Canal `portfolio_sandbox_multitab` que coordina pestañas locales en tiempo real con `senderTabId` inmutable. Cuando una pestaña inicia o transfiere la terminal, las demás pestañas abiertas lo detectan inmediatamente y pasan al estado `replaced` sin generar llamadas redundantes al servidor.
* **Modal Dark Luxury de Seguridad y Concurrencia (`SandboxSecurityModal.tsx`):** Cuando la sesión entra en un estado de seguridad (`concurrency_limit`, `replaced`, `cooldown`, `rate_limited` o `blocked`), la interfaz renderiza una tarjeta centrada con estética Dark Luxury idéntica a `ServerOfflineBanner.tsx` (resplandor ambiental dorado, badge superior, título claro, reloj regresivo en cooldown, botón de acción y enlace directo `[ ← Volver al Portafolio ]`).
* **Handover PTY en Caliente y Replay de Scrollback:** Al confirmar la transferencia, el socket emite `{ forceReplace: true }`. El backend transfiere el stream interactivo del contenedor Docker sin destruirlo, y la nueva pestaña recibe el buffer de salida previo (`scrollback`), restaurando instantáneamente el prompt, comandos y texto sin parpadeos ni pérdidas de datos.
* **Privacidad de input:** El evento `onData` de xterm.js **no loguea** el contenido de las pulsaciones del visitante (`console.log` eliminado) para proteger datos privados en la consola del navegador.
* **Filtrado de secuencias de ratón:** Se ignoran secuencias `\x1b[<` y `\x1b[M` (SGR / X10 Mouse events) para evitar basura en el stream PTY al hacer clic en la terminal.
* **Limpieza en desmontaje:** `socket.disconnect()` + `xterm.dispose()` + `channel.close()` garantizan cero fugas de memoria o listeners huérfanos.
* **Reconexión limitada:** `reconnectionAttempts: 5` para evitar tempestades de reconexión en sesiones caídas.

### 4.6 Manejo de Servidor Físico Fuera de Línea (`ServerOfflineBanner.tsx`)
* **Detección sin Fallback Forzado a AWS:** Cuando el visitante selecciona el Modo 3 (`targetMode === 'tunnel'`) y el servidor físico privado está apagado o inaccesible, el sistema **no** redirige silenciosamente a AWS. Se respeta la transparencia del hardware físico propio.
* **Presentación Dark Luxury & Light Luxury Unificada:**
  * Renderiza `ServerOfflineBanner.tsx` como un modal overlay centrado sobre la terminal (`absolute inset-0 z-20`), manteniendo el canvas xterm montado debajo sin destruirlo.
  * Oculta el footer inferior para evitar mostrar indicadores de "EN VIVO" o controles de sesión cuando el hardware está inactivo.
  * Cabecera editorial limpia con punto de estado dorado (`bg-gold-400`) y título directo `SERVIDOR PRIVADO`.
  * **Navegación Intuitiva de Retorno:** Incluye un botón secundario `[ ← Volver al Portafolio ]` ubicado estratégicamente al lado de la acción principal tanto en el formulario inicial como en el estado de aviso entregado.
  * Lenguaje directo y comprensible: Cero jerga técnica inaccesible para el público general (eliminados términos como *"on-premises"*, *"on-demand"*, *"bajo demanda"* o *"fuera de servicio"*).
* **Solicitud de Aviso y Notificación Desacoplada:**
  * El visitante puede enviar un aviso de interés con su nombre, correo/teléfono y nota opcional mediante el botón `[ Enviar Aviso de Conexión ]`.
  * Despacha una petición HTTP `POST /portfolio/sandbox/wake-request` protegida por rate limiting (`ContactThrottleGuard`).
* **Protección Anti-Bucle y Persistencia de Estado (`sessionStorage`):**
  * Al completar el envío, el banner pasa al estado de confirmación (`AVISO ENTREGADO`) con mensaje cortés y educado, sin promesas falsas de encendido inmediato.
  * **Ciclo de Reintento con Retroalimentación Visual Estable:** Al pulsar `[ Entrar a la Terminal ]`, el banner se mantiene visible mostrando el botón en estado de carga animada (`Comprobando conexión...` con `Loader2`) mientras Socket.IO fuerza un nuevo handshake limpio (`forceNew: true`, `multiplex: false`). Si el enlace falla porque el hardware o el túnel aún no responden, el banner no parpadea ni se desmonta: muestra una alerta informativa amigable (`retryFailedDesc`) invitando al usuario a aguardar o volver a pulsar cuando el arranque termine.
  * **Transición y Limpieza Exitosa:** En cuanto el backend emite `session-ready`, el hook limpia la clave `portfolio_wake_requested` de `sessionStorage` y desmonta el banner para dar paso directo a la consola interactiva.

---

## 5. Formulario de Contacto

* Formulario reactivo (`ContactForm.tsx`) conectado mediante el hook `useContact.ts`.
* Envía un payload JSON con `name`, `email` y `message` a `POST /portfolio/contact`.

---

## 6. Internacionalización, SEO Dinámico y Dossier para IA (next-intl, Schema.org & GEO)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Portfolio.Metadata` en `src/messages/es.json` y `src/messages/en.json`, con tarjetas completas Open Graph y Twitter.
* **Datos Estructurados Schema.org (`PortfolioJsonLd.tsx`):** Inyección de esquema `ProfilePage` y `Person` para indexación de perfil profesional y terminal en motores de búsqueda e IA.
* **Dossier Especializado para IA (`public/portfolio/llms.txt`):** Resumen detallado del perfil técnico, proyectos y comandos de terminal en `portfolio.jorgedoicela.com/llms.txt`.
* **Manifiesto PWA Independiente (`public/portfolio/manifest.json`):** Configuración de aplicación web independiente con tema `#08080a`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://portfolio.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(portfolio)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.

---

## 7. Estética Visual y Dark Luxury

* **Paleta de Negros Profundos:** Fondo `#08080a` con elevaciones graduales en `#111116` y bordes oscuros de alta definición.
* **Acentos Metálicos y Dorados:** Resaltes sutiles en tonos oro suave / bronce / titanio para insignias, estado de terminal y focos de acción.
* **Tipografía de Lujo:** Uso de Geist y fuentes monoespaciadas de precisión para dar aspecto de terminal ejecutiva de élite.
* **Terminal xterm.js de Alta Gama (Dark Luxury Theme):**
  * Fondo `#080705`, cursor dorado `#c5a87a`, selección semitransparente dorada.
  * `cursorBlink: true`, `cursorStyle: 'block'`, `scrollback: 1000`.
  * Paleta de colores ANSI completamente mapeada al vocabulario Gold & Dark Gray del portafolio.
