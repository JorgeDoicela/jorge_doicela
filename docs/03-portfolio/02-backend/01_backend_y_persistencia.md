# Portafolio Profesional - Backend y Persistencia (NestJS)

Este documento detalla la arquitectura macro y micro, gateways de WebSockets, controladores y persistencia del módulo de Portafolio.

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** El módulo vive en `backend/src/portfolio/` dentro del proceso único de NestJS 11 (puerto `3000`), optimizado para el VPS de **1 GB de RAM**.
> * **Aislamiento de Persistencia:** Base de datos física independiente `backend/data/portfolio.sqlite` registrada con la conexión de TypeORM `'portfolioConnection'`. Cero tablas compartidas.
> * **Aislamiento de Dominio:** Cero dependencias de `bible` o `software`.
>
> **Arquitectura Micro:**
> * **Arquitectura en Capas:**
>   1. *Presentación:* `PortfolioGateway` (WebSockets `/terminal`) y `ContactController` (`/portfolio/contact`).
>   2. *Lógica de Negocio:* `PortfolioService` y `ContactMessagesService`.
>   3. *Acceso a Datos:* Entidad `ContactMessage` en TypeORM con driver `better-sqlite3`.

---

## 2. Módulo del Backend (`PortfolioModule`)

```text
backend/src/portfolio/
├── portfolio.module.ts            # Registro del módulo, gateway, controladores y entidades
├── corpus/
│   └── projects.json              # Dataset JSON estructurado de proyectos (Fuente de Verdad)
├── cli/
│   └── seed-portfolio.ts          # Sembrado atómico CLI con better-sqlite3 en modo WAL
├── gateways/
│   └── portfolio.gateway.ts       # Gateway WebSocket para la terminal SSH
├── controllers/
│   ├── contact.controller.ts      # Endpoint REST POST y GET para mensajes de contacto
│   └── portfolio-projects.controller.ts # Endpoint REST GET /portfolio/projects y /:slug
├── events/
│   └── contact-message-created.event.ts # Evento de dominio desacoplado
├── listeners/
│   └── telegram-notification.listener.ts # Listener asíncrono que procesa el evento y despacha a Telegram
├── guards/
│   └── contact-throttle.guard.ts  # Guard de Rate Limiting en memoria para mitigar spam/DDoS
├── services/
│   ├── portfolio.service.ts       # Intérprete y procesador de comandos Unix
│   ├── contact-messages.service.ts # Servicio de persistencia y emisión de eventos
│   ├── telegram-notification.service.ts # Servicio de comunicación HTTP con la API de Telegram
│   └── portfolio-projects.service.ts # Servicio de consulta bilingüe de proyectos
├── entities/
│   ├── contact-message.entity.ts  # Entidad TypeORM para mensajes de contacto
│   └── portfolio-project.entity.ts # Entidad TypeORM con índice compuesto (slug, language)
└── dto/
    └── create-contact-message.dto.ts # DTO blindado con @MaxLength y validaciones estrictas
```

---

## 3. Gateway WebSocket de la Terminal (`PortfolioGateway`)

* **Namespace:** `terminal`
* **Configuración CORS:** `origin: true`, `credentials: true` para aceptar conexiones cruzadas desde `localhost:3001` y dominios de producción.
* **Manejo de Conexión (`handleConnection`):** Al conectarse un cliente web, el backend emite el banner SSH de bienvenida y el prompt interactivo inicial:
  ```text
  Jorge Doicela - Virtual SSH Console [Debian 13 / Arch Linux]
  Type 'help' to see available commands.
  
  jorge@vps-1gb-ram:~$ 
  ```
* **Intérprete de Comandos (`PortfolioService`):**
  * `help`: Muestra la lista de comandos disponibles.
  * `about`: Imprime la biografía, formación en IA/Ciberseguridad y valores de Jorge.
  * `skills`: Despliega el desglose del stack técnico (Frontend, Backend, DevOps, DBs).
  * `contact`: Muestra canales de contacto (correo, GitHub, LinkedIn).
  * `neofetch`: Muestra el resumen estilizado de sistema con arte ASCII.
  * `date`, `uptime`, `echo`, `cat`, `ls`, `cd`, `whoami`, `matrix`, `clear`, `exit`.

---

## 4. Endpoints REST y Modelo de Datos

### 4.1 Endpoints REST

| Dominio | Método y Ruta | Parámetros Query | Descripción |
|---|---|---|---|
| **Proyectos** | `GET /portfolio/projects` | `lang` | Catálogo de proyectos profesionales filtrables por idioma (`?lang=es|en`) |
| | `GET /portfolio/projects/:slug` | `lang` | Detalle del proyecto por slug con soporte bilingüe |
| **Contacto** | `POST /portfolio/contact` | - | Envío y validación de formulario de contacto (`CreateContactMessageDto`) |
| | `GET /portfolio/contact` | - | Historial de mensajes registrados para propósitos de auditoría interna |

### 4.2 Modelo Relacional Bilingüe (`portfolio.sqlite`)

* `portfolio_projects`:
  * `id`: Entero autoincremental (PK).
  * `slug`: Identificador URL del proyecto (`string`).
  * `title`: Nombre o título del proyecto (`string`).
  * `description`: Resumen técnico del proyecto (`string`).
  * `role`: Rol desempeñado (`string`).
  * `technologies`: Lista serializada de tecnologías (`JSON array` o `string`).
  * `language`: Idioma del registro (`'es'` o `'en'`, `DEFAULT 'es'`).
  * `repoUrl`: Enlace al repositorio GitHub (`string`, nullable).
  * `demoUrl`: Enlace a la demo en vivo (`string`, nullable).
  * `featured`: Indicador booleano de proyecto destacado (`integer` 0/1).
  * **Índice Único Compuesto:** `CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_project_slug_lang ON portfolio_projects (slug, language)`.

* `contact_messages`:
  * `id`: Entero autoincremental (PK).
  * `name`: Nombre del remitente (`string`).
  * `email`: Correo electrónico (`string`).
  * `subject`: Asunto de la comunicación (`string`, nullable).
  * `message`: Contenido del mensaje (`text`).
  * `createdAt`: Fecha y hora de creación automática (`datetime`).
  * `read`: Estado de lectura (`integer` 0/1).
