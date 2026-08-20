---
name: portfolio-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento del Portafolio Profesional (portfolio.jorgedoicela.com), incluyendo el frontend en Next.js (Linear look, terminal interactiva), backend en NestJS (WebSockets SSH, formulario de contacto) y la base de datos portfolio.sqlite.
---
# Directrices de Desarrollo: Portafolio Profesional (portfolio.jorgedoicela.com)

Esta habilidad define los estándares y la arquitectura completa para el subproyecto del Portafolio Profesional de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_frontend_y_terminal_ssh.md](../../../docs/03-portfolio/01-frontend/01_frontend_y_terminal_ssh.md)
* [02_backend_y_persistencia.md](../../../docs/03-portfolio/02-backend/01_backend_y_persistencia.md)

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
│   ├── terminal/           # Feature: Terminal virtual interactiva
│   │   ├── components/     # TerminalConsole.tsx, TerminalHeader.tsx, MatrixRain.tsx, MobileTerminalBanner.tsx
│   │   ├── hooks/          # useTerminalSocket.ts (Socket.io client)
│   │   ├── utils/          # ansiParser.tsx
│   │   └── types.ts        # Tipos de la terminal
│   └── contact/            # Feature: Formulario de contacto
│       ├── components/     # ContactForm.tsx
│       ├── hooks/          # useContact.ts
│       └── types.ts        # Tipos del formulario
├── components/             # ThemeToggle.tsx, TypewriterRole.tsx, ValuesPhilosophySection.tsx
├── globals.css             # Estilos específicos del portafolio
└── layout.tsx              # Layout independiente
```

### Secciones Principales y Adaptabilidad Móvil
1. **Hero & Biografía:** Presentación profesional con valores de fe cristiana, visión de ingeniería en IA y ciberseguridad.
2. **Terminal Virtual SSH (Desktop):**
   * En pantallas móviles/táctiles, **no se inicializa el WebSocket ni se renderiza la consola interactiva** debido a la falta de teclas de flecha, Tab y secuencias ANSI en teclados móviles. En su lugar, se muestra un banner explicativo (`MobileTerminalBanner.tsx`).
3. **Formulario de Contacto:** Envíos directos validados hacia `POST /portfolio/contact`.

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
  * `help`, `about`, `neofetch`, `contact`, `skills`, `clear`, `matrix`, `date`, `uptime`, `ls`, `cat`, `whoami`, `exit`.

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

## 4. Comandos de Operación

```bash
# Dependencias para backend o frontend
pnpm --filter backend add <paquete>
pnpm --filter web add <paquete>

# Chequeo de tipos
pnpm -r typecheck
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Inyectar TypeOrmModule sin especificar 'portfolioConnection' | Conectaría a la base de datos por defecto en lugar de portfolio.sqlite. | Usar @InjectRepository(ContactMessage, 'portfolioConnection'). |
| Poner bloques try/catch para devolver respuestas HTTP en el controlador | Duplica código y rompe el formateo estándar del filtro global. | Dejar que los errores sean capturados por GlobalExceptionFilter. |
| Forzar la apertura de la terminal interactiva en pantallas móviles | En móviles no hay flechas, Tab ni secuencias ANSI; degrada la experiencia. | Mostrar vista adaptada de tarjetas en viewports móviles. |
| Importar entidades de software o bible en el módulo portfolio | Viola la independencia estricta entre dominios. | Mantener las entidades dentro de backend/src/portfolio/entities/. |

---

## 6. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para reglas de monorepo, FSD, configuración de Nginx /socket.io/ y PM2).
