---
name: portfolio-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento del Portafolio Profesional (portfolio.jorgedoicela.com), incluyendo el frontend en Next.js (estética Dark Luxury, terminal interactiva), backend en NestJS (WebSockets SSH, formulario de contacto) y la base de datos portfolio.sqlite.
---
# Directrices de Desarrollo: Portafolio Profesional (portfolio.jorgedoicela.com)

Esta habilidad define los estándares y la arquitectura completa para el subproyecto del Portafolio Profesional de Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_frontend_y_terminal_ssh.md](../../../docs/03-portfolio/01-frontend/01_frontend_y_terminal_ssh.md)
* [02_backend_y_persistencia.md](../../../docs/03-portfolio/02-backend/01_backend_y_persistencia.md)
* [02_terminal_real_sandbox_linux.md](../../../docs/03-portfolio/03-roadmap/02_terminal_real_sandbox_linux.md)
* [03_tunnel_cloudflare_setup.md](../../../docs/03-portfolio/03-roadmap/03_tunnel_cloudflare_setup.md)

---

## 1. Arquitectura y Aislamiento

* **Subdominio:** `portfolio.jorgedoicela.com` (en desarrollo: `portfolio.localhost:3001`).
* **Frontend:** Grupo de rutas `frontend/web/src/app/(portfolio)/`.
* **Backend:** Módulo modular aislado `backend/src/portfolio/`.
* **Sandbox Docker Encapsulado:** `backend/src/portfolio/docker/` (`Dockerfile` Alpine 3.20 hardened, `sandbox_profile.sh` y `welcome.txt`).
* **Persistencia:** Base de datos SQLite física independiente `portfolio.sqlite` conectada mediante `'portfolioConnection'` en TypeORM.
* **Aislamiento de Estilos y Diseño:** Utiliza exclusivamente su propio archivo `(portfolio)/globals.css` (estética **Dark Luxury** con fondos oscuros profundos, toques metálicos/dorados refinados, tipografía Geist/Mono de alta gama y contrastes de lujo).
* **Aislamiento de Assets:** Recursos estáticos ubicados en `frontend/web/public/portfolio/`.

---

## 2. Frontend Web (Next.js 16)

### Estructura de Directorios (Feature-Sliced Design)
```text
frontend/web/src/app/(portfolio)/
├── messages/               # Diccionarios locales del portafolio (es.json, en.json)
├── portfolio/
│   └── page.tsx            # Página principal del portafolio (9 secciones editoriales + SSR fallback)
├── features/
│   ├── projects/           # Feature: Showcase y catálogo de proyectos
│   │   ├── components/     # ProjectShowcase.tsx, ProjectDetailModal.tsx
│   │   └── types.ts        # Tipos e interfaces de proyectos y casos de estudio
│   ├── terminal/           # Feature: Terminal virtual interactiva
│   │   ├── components/     # TerminalConsole.tsx, TerminalHeader.tsx, MatrixRain.tsx, MobileTerminalBanner.tsx
│   │   ├── hooks/          # useTerminalSocket.ts (Socket.io client)
│   │   ├── utils/          # ansiParser.tsx
│   │   └── types.ts        # Tipos de la terminal
│   └── contact/            # Feature: Formulario de contacto
│       ├── components/     # ContactForm.tsx
│       ├── hooks/          # useContact.ts
│       └── types.ts        # Tipos del formulario
├── components/             # ThemeToggle.tsx, LanguageToggle.tsx, TypewriterRole.tsx, ValuesPhilosophySection.tsx
├── globals.css             # Estilos específicos del portafolio
└── layout.tsx              # Layout independiente con NextIntlClientProvider y generateMetadata dinámico
```

### Internacionalización, SEO y Datos Estructurados (next-intl & Schema.org)
* **Diccionarios Encapsulados:** Textos de UI gestionados en `(portfolio)/messages/es.json` y `en.json`.
* **Metadatos Dinámicos Localizados:** `generateMetadata()` consume `getTranslations("Metadata")` para emitir títulos y descripciones en español e inglés.
* **Datos Estructurados Schema.org (`PortfolioJsonLd.tsx`):** Inyección de esquema `ProfilePage` y `Person` vinculado al portafolio, terminal SSH sobre WebSockets y proyectos.
* **Etiquetas `hreflang`:** Emite `alternates.languages` (`es-EC` y `en-US`) para posicionar el portafolio en motores de búsqueda internacionales.
* **Cero Parpadeos (SSR):** `<html lang={locale}>` dinámico según la cookie `NEXT_LOCALE` o cabecera `Accept-Language`.
* **Sincronización con IA:** Cuando se agreguen nuevos proyectos o comandos de terminal, reflejarlos en `public/portfolio/llms.txt` y en `public/landing/llms.txt`.


### Secciones Principales y Adaptabilidad Móvil
1. **Hero & Biografía:** Presentación profesional con valores de fe cristiana, visión de ingeniería en IA y ciberseguridad.
2. **Showcase de Proyectos y Casos de Estudio (`ProjectShowcase.tsx` & `ProjectDetailModal.tsx`):**
   * **Tarjetas:** Filtros dinámicos, botón primario en oro satinado (`Demostración ↗`), botón secundario con SVG GitHub (`Código`) y disparador de lectura técnica (`Caso de estudio`).
   * **Modal In-Page (`createPortal(document.body)`):** Preserva la sesión SSH sin cortes y sigue la jerarquía editorial estricta:
     1. *Visión General del Sistema:* Propósito y alcance del software.
     2. *El Desafío Técnico & Restricciones:* Problemas de escala, memoria o concurrencia superados.
     3. *Arquitectura & Decisiones de Ingeniería:* Justificaciones técnicas de diseño.
     4. *Stack Tecnológico Empleado:* Herramientas y frameworks.
     5. *Especificaciones & Telemetría (al final):* Ficha técnica editorial de precisión con líneas punteadas continuas (`border-dotted`).
3. **Terminal Virtual SSH (Desktop):**
   * En pantallas móviles/táctiles, **no se inicializa el WebSocket ni se renderiza la consola interactiva** debido a la falta de teclas de flecha, Tab y secuencias ANSI en teclados móviles. En su lugar, se muestra un banner explicativo (`MobileTerminalBanner.tsx`).
4. **Formulario de Contacto:** Envíos directos validados hacia `POST /portfolio/contact`.

---

## 3. Backend, Corpus y Persistencia (NestJS 11)

### 3.1 Corpus Maestro, Sembrado Atómico y Ciclo de Datos
* **Corpus:** `backend/src/portfolio/corpus/projects.json` (Fuente de verdad en Git con 8 proyectos bilingües y casos de estudio).
* **Seeder:** `backend/src/portfolio/cli/seed-portfolio.ts` (Sembrado atómico en `portfolio.sqlite` usando `better-sqlite3` en modo WAL y transacción con `INSERT OR REPLACE`).
* **Ciclo Obligatorio de Extensión de Datos de Proyectos:**
  Ante cualquier nuevo campo o cambio en los proyectos (ej. métricas, retos, arquitectura, enlaces):
  1. Actualizar el dataset en `corpus/projects.json` (ES y EN).
  2. Actualizar la entidad TypeORM `portfolio-project.entity.ts`.
  3. Actualizar el esquema y sentencias en `seed-portfolio.ts`.
  4. Actualizar el parseo en `portfolio-projects.service.ts`.
  5. Ejecutar `pnpm --filter backend seed:portfolio` para reflejar en `portfolio.sqlite`.
  6. Actualizar la interfaz TypeScript en `frontend/web/src/app/(portfolio)/features/projects/types.ts` y su fallback en `page.tsx`.

### 3.2 Terminal Virtual SSH (WebSockets sobre Socket.io)
* **Gateway:** `PortfolioGateway` (`backend/src/portfolio/gateways/portfolio.gateway.ts`).
* **Namespace:** `terminal` (transporte WebSocket exclusivo sobre Socket.io).
* **Flujo de Eventos:**
  * Al conectar: Servidor emite `terminal-output` con banner SSH de bienvenida y prompt `jorge@vps-1gb-ram:~$ `.
  * Cliente emite: `execute-command` enviando el texto del comando.
  * Servidor emite: `terminal-output` con el resultado procesado.
* **Comandos Soportados en `PortfolioService`:**
  * `help`, `about`, `neofetch`, `contact`, `skills`, `clear`, `matrix`, `date`, `uptime`, `ls`, `cat`, `whoami`, `exit`.

### 3.3 Endpoints REST y Entidades TypeORM
* **Proyectos:**
  * `GET /portfolio/projects?lang=es|en`: Listado bilingüe con tecnologías, métricas y puntos de arquitectura parseados.
  * `GET /portfolio/projects/:slug`: Detalle individual por slug.
  * **Entidad:** `PortfolioProject` (`portfolio-project.entity.ts`) con índice único compuesto `@Index(['slug', 'language'], { unique: true })`.
* **Contacto:**
  * `POST /portfolio/contact`: Recibe y valida `CreateContactMessageDto` (`name`, `email`, `message`).
  * `GET /portfolio/contact`: Listado de mensajes para auditoría administrativa.
  * **Entidad:** `ContactMessage` (`contact-message.entity.ts`).

---

## 4. Comandos de Operación

```bash
# Dependencias para backend o frontend
pnpm --filter backend add <paquete>
pnpm --filter web add <paquete>

# Sembrado de datos en portfolio.sqlite
pnpm --filter backend seed:portfolio

# Chequeo de tipos
pnpm -r typecheck
```

---

## 5. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Modificar tipos o datos en el frontend sin actualizar el corpus y seeder del backend | Desincroniza el contrato de datos; el backend SQLite responde con datos obsoletos ignorando el fallback del cliente. | Ejecutar siempre el ciclo completo de datos: `corpus/projects.json` -> `entity` -> `seed-portfolio.ts` -> `seed:portfolio`. |
| Inyectar TypeOrmModule sin especificar 'portfolioConnection' | Conectaría a la base de datos por defecto en lugar de portfolio.sqlite. | Usar @InjectRepository(ContactMessage, 'portfolioConnection'). |
| Poner bloques try/catch para devolver respuestas HTTP en el controlador | Duplica código y rompe el formateo estándar del filtro global. | Dejar que los errores sean capturados por GlobalExceptionFilter. |
| Forzar la apertura de la terminal interactiva en pantallas móviles | En móviles no hay flechas, Tab ni secuencias ANSI; degrada la experiencia. | Mostrar vista adaptada de tarjetas en viewports móviles. |
| Importar entidades de software o bible en el módulo portfolio | Viola la independencia estricta entre dominios. | Mantener las entidades dentro de backend/src/portfolio/entities/. |

---

## 6. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se agreguen, modifiquen, refactoricen o eliminen comandos de la terminal SSH, endpoints REST, entidades TypeORM, esquemas en `portfolio.sqlite`, datasets en `corpus/projects.json` o componentes del portafolio, es **obligatorio actualizar la documentación técnica en `docs/03-portfolio/`**.
* **Gestión Documental Proactiva:** Se autoriza agregar nuevos archivos `.md`, estructurar nuevas subcarpetas en `docs/03-portfolio/` o podar contenido obsoleto, preservando el orden y la fidelidad técnica con el código implementado.

---

## 7. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para reglas de monorepo, FSD, configuración de Nginx /socket.io/ y PM2).

