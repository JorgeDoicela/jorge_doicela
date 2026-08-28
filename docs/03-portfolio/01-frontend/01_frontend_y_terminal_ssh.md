# Portafolio Profesional - Frontend y Terminal SSH (Next.js)

Este documento detalla la arquitectura macro y micro, componentes y funcionamiento de la terminal SSH virtual interactiva del Portafolio (`portfolio.jorgedoicela.com`).

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Subdominio:** `portfolio.jorgedoicela.com` (o `http://portfolio.localhost:3001` en local).
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
└── features/                  # FEATURE-SLICED DESIGN (FSD)
    ├── projects/              # FEATURE: SHOWCASE DE PROYECTOS
    │   ├── components/
    │   │   └── ProjectShowcase.tsx   # Galería con filtros reactivos y badges dorados
    │   └── types.ts           # Interfaces de proyectos
    │
    ├── terminal/              # FEATURE: TERMINAL VIRTUAL SSH
    │   ├── components/
    │   │   ├── TerminalConsole.tsx   # Ventana interactiva y prompt
    │   │   ├── TerminalHeader.tsx    # Barra superior y controles
    │   │   ├── MatrixRain.tsx        # Animación de lluvia Matrix
    │   │   └── MobileTerminalBanner.tsx # Banner adaptativo para móviles
    │   ├── hooks/
    │   │   └── useTerminalSocket.ts  # Conexión WebSocket persistente
    │   ├── utils/
    │   │   └── ansiParser.tsx        # Renderizado de colores y secuencias ANSI
    │   └── types.ts
    │
    └── contact/               # FEATURE: FORMULARIO DE CONTACTO
        ├── components/
        │   └── ContactForm.tsx       # Formulario con validación en tiempo real
        ├── hooks/
        │   └── useContact.ts         # Llamada HTTP POST al backend
        └── types.ts
```

---

## 3. Terminal Virtual SSH (WebSockets)

La terminal realiza una conexión bidireccional de baja latencia con el servidor backend mediante Socket.io:

### 3.1 Hook del Cliente (`useTerminalSocket.ts`)
* **Namespace:** Conecta a `${NEXT_PUBLIC_API_URL}/terminal` (puerto 3000).
* **Transporte:** Exclusivamente WebSockets (`transports: ['websocket']`).
* **Eventos:**
  * Escucha `terminal-output`: Imprime texto devuelto por el servidor procesando secuencias ANSI.
  * Emite `execute-command`: Envía la instrucción tipada por el usuario al presionar Enter.

### 3.2 Características de la Consola
* Historial interactivo navegable con flechas arriba/abajo (`↑` / `↓`).
* Autocompletado inteligente con tecla `Tab`.
* Parser de secuencias ANSI (`ansiParser.tsx`) para colores de texto enriquecidos.
* Comando secreto `matrix` que activa animación estilo lluvia digital en pantalla completa.

---

## 4. Formulario de Contacto

* Formulario reactivo (`ContactForm.tsx`) conectado mediante el hook `useContact.ts`.
* Envía un payload JSON con `name`, `email` y `message` a `POST /portfolio/contact`.

---

## 5. Internacionalización, SEO Dinámico y Dossier para IA (next-intl, Schema.org & GEO)

* **Metadatos SEO Dinámicos (`generateMetadata`):** Conectado al namespace `Portfolio.Metadata` en `src/messages/es.json` y `src/messages/en.json`, con tarjetas completas Open Graph y Twitter.
* **Datos Estructurados Schema.org (`PortfolioJsonLd.tsx`):** Inyección de esquema `ProfilePage` y `Person` para indexación de perfil profesional y terminal en motores de búsqueda e IA.
* **Dossier Especializado para IA (`public/portfolio/llms.txt`):** Resumen detallado del perfil técnico, proyectos y comandos de terminal servido en `portfolio.jorgedoicela.com/llms.txt`.
* **Manifiesto PWA Independiente (`public/portfolio/manifest.json`):** Configuración de aplicación web independiente con tema `#08080a`.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) apuntando a `https://portfolio.jorgedoicela.com`.
* **Cero Parpadeos (SSR):** El layout raíz `(portfolio)/layout.tsx` resuelve el `locale` en el servidor con `getLocale()`, envolviendo a los hijos en `NextIntlClientProvider`.

---

## 6. Estética Visual y Dark Luxury

* **Paleta de Negros Profundos:** Fondo `#08080a` con elevaciones graduales en `#111116` y bordes oscuros de alta definición.
* **Acentos Metálicos y Dorados:** Resaltes sutiles en tonos oro suave / bronce / titanio para insignias, estado de terminal y focos de acción.
* **Tipografía de Lujo:** Uso de Geist y fuentes monoespaciadas de precisión para dar aspecto de terminal ejecutiva de élite.
* **Terminal Virtual SSH de Alta Gama:** Aspecto sobrio con parser ANSI, barra de título minimalista y controles discretos.

