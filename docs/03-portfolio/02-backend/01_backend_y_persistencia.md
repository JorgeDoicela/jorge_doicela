# Portafolio Profesional - Backend y Persistencia (NestJS)

Este documento detalla la arquitectura macro y micro, gateways de WebSockets, controladores y persistencia del módulo de Portafolio.

---

## 1. Contexto Arquitectónico Macro y Micro

> [!IMPORTANT]
> **Arquitectura Macro:**
> * **Monolito Modular:** El módulo vive en `backend/src/portfolio/` dentro del proceso único de NestJS 11 (puerto `3000`), optimizado para el VPS de **1 GB de RAM**.
> * **Aislamiento de Persistencia:** Base de datos física independiente `portfolio.sqlite` registrada con la conexión de TypeORM `'portfolioConnection'`. Cero tablas compartidas.
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
├── portfolio.module.ts        # Registro del módulo, gateway, controladores y entidades
├── gateways/
│   └── portfolio.gateway.ts   # Gateway WebSocket para la terminal SSH
├── controllers/
│   └── contact.controller.ts  # Endpoint REST POST y GET para mensajes de contacto
├── services/
│   ├── portfolio.service.ts   # Intérprete y procesador de comandos Unix
│   └── contact-messages.service.ts # Servicio de persistencia de mensajes
├── entities/
│   └── contact-message.entity.ts   # Entidad TypeORM
└── dto/
    └── create-contact-message.dto.ts # DTO con validación sintáctica
```

---

## 3. Gateway WebSocket de la Terminal (`PortfolioGateway`)

* **Namespace:** `terminal`
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

### 4.1 Endpoints (`/portfolio/contact`)
* **`POST /portfolio/contact`**: Recibe un mensaje de contacto, lo valida con `CreateContactMessageDto` y lo guarda en la base de datos.
* **`GET /portfolio/contact`**: Retorna el historial de mensajes registrados para propósitos de auditoría.

### 4.2 Entidad `ContactMessage` (`portfolio.sqlite`)
* `id`: Entero autoincremental (Clave Primaria).
* `name`: Nombre del remitente (string).
* `email`: Correo electrónico (string).
* `message`: Contenido del mensaje (text).
* `createdAt`: Fecha y hora de creación automática.
