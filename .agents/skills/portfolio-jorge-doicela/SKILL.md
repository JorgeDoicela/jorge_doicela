---
name: portfolio-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento del Portafolio Profesional (portfolio.jorgedoicela.com), incluyendo el frontend en Next.js (Linear look, terminal interactiva), backend en NestJS (WebSockets SSH, formulario de contacto) y la base de datos portfolio.sqlite.
---
# Directrices de Desarrollo: Portafolio Profesional (portfolio.jorgedoicela.com)

Esta habilidad define los estándares y la arquitectura completa para el subproyecto del **Portafolio Profesional** de Jorge Doicela.

---

## 1. Arquitectura y Aislamiento

* **Subdominio:** `portfolio.jorgedoicela.com` (en desarrollo: `portfolio.localhost:3001`).
* **Frontend:** Grupo de rutas `frontend/web/src/app/(portfolio)/`.
* **Backend:** Módulo modular aislado `backend/src/portfolio/`.
* **Persistencia:** Base de datos SQLite física independiente `portfolio.sqlite` conectada mediante `'portfolioConnection'` en TypeORM.
* **Aislamiento de Estilos:** Utiliza exclusivamente su propio archivo `(portfolio)/globals.css` (estética Linear/Minimalista oscura y elegante con tipografía Geist/Mono).
* **Aislamiento de Assets:** Recursos estáticos ubicados en `frontend/web/public/portfolio/`.

---

## 2. Frontend Web (Next.js 16)

### Estructura de Directorios (Feature-Sliced Design)
```text
frontend/web/src/app/(portfolio)/
├── portfolio/
│   └── page.tsx            # Página principal del portafolio
├── features/
│   ├── terminal/           # Terminal virtual interactiva (Desktop)
│   │   ├── components/     # TerminalUI, CommandOutput, SessionTabs
│   │   ├── hooks/          # useTerminalSocket.ts (Socket.io client)
│   │   └── types.ts        # Tipos de la terminal
│   └── contact/            # Formulario de contacto
│       ├── components/     # ContactForm.tsx
│       ├── hooks/          # useContact.ts
│       └── types.ts        # Tipos del formulario
├── components/             # Hero, ExperienceTimeline, TechStack, Education
├── globals.css             # Estilos específicos del portafolio
└── layout.tsx              # Layout independiente
```

### Secciones Principales y Adaptabilidad Móvil
1. **Hero & Biografía:** Presentación profesional con valores de fe cristiana, visión de ingeniería en IA y ciberseguridad.
2. **Stack Tecnológico:** Grid interactiva clasificada en Frontend, Backend y DevOps/Datos.
3. **Experiencia & Educación:** Línea de tiempo interactiva con historial laboral y títulos académicos.
4. **Terminal Virtual SSH (Exclusiva de Escritorio):**
   * En pantallas móviles/táctiles, **no se inicializa el WebSocket ni se renderiza la consola interactiva** debido a la falta de teclas de flecha, Tab y secuencias ANSI en teclados móviles. En su lugar, se muestra un banner explicativo y tarjetas adaptadas al tacto.
5. **Formulario de Contacto:** Envíos directos validados hacia el backend.

---

## 3. Backend y WebSockets (NestJS 11)

### 3.1 Terminal Virtual SSH (WebSockets sobre Socket.io)
* **Gateway:** `PortfolioGateway` (`backend/src/portfolio/gateways/portfolio.gateway.ts`).
* **Namespace:** `terminal` (transporte WebSocket exclusivo sobre Socket.io).
* **Flujo de Eventos:**
  * Al conectar: Servidor emite `terminal-output` con banner SSH de bienvenida y prompt `jorge@vps-1gb-ram:~$ `.
  * Cliente emite: `execute-command` enviando el texto del comando.
  * Servidor emite: `terminal-output` con el resultado procesado.
* **Comandos Soportados en `PortfolioService`:**
  * `help`, `about`, `neofetch` (resumen de OS, kernel, memoria 1GB, faith y status), `contact`, `skills`, `clear`, `matrix`, `date`, `uptime`, `ls`, `cat`, `whoami`, `exit`.

### 3.2 Formulario de Contacto (API REST)
* **Endpoints:**
  * `POST /portfolio/contact`: Recibe y valida `CreateContactMessageDto` (`name`, `email`, `message`).
  * `GET /portfolio/contact`: Listado de mensajes para auditoría administrativa.
* **Entidad `ContactMessage` (`backend/src/portfolio/entities/contact-message.entity.ts`):**
  * `id`: Clave primaria autoincremental de tipo entero.
  * `name`: Nombre del remitente (string).
  * `email`: Correo electrónico validado con `@IsEmail()`.
  * `message`: Contenido del mensaje (string, `@IsNotEmpty()`).
  * `createdAt`: Timestamp de creación automática.

---

## 4. 📊 Estado de Implementación (Hoja de Ruta)

| Funcionalidad | Estado | Ubicación / Notas |
|---|:---:|---|
| Terminal virtual SSH con WebSockets | ✅ Completado | `PortfolioGateway`, `useTerminalSocket.ts` |
| Comandos de consola (`neofetch`, `matrix`, etc.) | ✅ Completado | `PortfolioService` |
| Formulario de contacto y persistencia SQLite | ✅ Completado | `ContactController`, `ContactMessage` entity |
| Layout Linear look y tipografía Mono | ✅ Completado | `(portfolio)/globals.css` |
| Desactivación inteligente de terminal en móvil | ✅ Completado | Vista condicional por viewport |
| Tarjetas 3D del stack tecnológico | ⏳ Pendiente | Flip cards en hover / tap móvil |
| Timeline interactiva expandible | ⏳ Pendiente | Acordeón en experiencia laboral |
| Anti-spam con Cloudflare Turnstile | ⏳ Pendiente | Validación de token en backend |
| Notificación por correo al recibir mensaje | ⏳ Pendiente | Integración Nodemailer / Resend en backend |
| Panel admin protegido para ver mensajes | ⏳ Pendiente | Ruta `/admin/contact` con autenticación |
| Exportación de mensajes a CSV | ⏳ Pendiente | Endpoint y botón en panel admin |

---

## 5. ❌ Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Inyectar `TypeOrmModule` sin especificar `'portfolioConnection'` | Conectaría a la base de datos por defecto en lugar de `portfolio.sqlite`. | Usar `@InjectRepository(ContactMessage, 'portfolioConnection')`. |
| Poner bloques `try/catch` para devolver respuestas HTTP en el controlador | Duplica código y rompe el formateo estándar del filtro global. | Dejar que los errores sean capturados por `GlobalExceptionFilter`. |
| Forzar la apertura de la terminal interactiva en pantallas móviles | En móviles no hay flechas, Tab ni secuencias ANSI; degrada la experiencia. | Mostrar vista adaptada de tarjetas en viewports móviles. |
| Importar entidades de `software` o `bible` en el módulo `portfolio` | Viola la independencia estricta entre dominios. | Mantener las entidades dentro de `backend/src/portfolio/entities/`. |

---

## 6. 🔗 Combinar con
* **General:** `general-jorge-doicela` (para aislamiento, pnpm `--filter` y reglas de monorepo).
* **Infraestructura:** `infraestructura-jorge-doicela` (para configuración de proxy Nginx `/socket.io/` y WebSockets de Cloudflare).
