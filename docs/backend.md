# Backend Modular (NestJS Monolito Consolidado)

Este proyecto contiene el backend centralizado para el proyecto de Jorge Doicela. Está desarrollado utilizando **NestJS 11** y opera como un monolito modular para optimizar recursos en producción, sirviendo APIs REST y conexiones WebSockets en el puerto `3000`.

---

## 1. Arquitectura de Consolidación por Hardware

Para desplegar de manera eficiente en servidores de recursos limitados (**VPS de 1 GB de RAM**), se ejecuta un único proceso de Node.js que unifica el runtime de tres aplicaciones independientes: **Portfolio**, **Bible** (Biblia) y **Software** (Proyectos).

> [!IMPORTANT]
> **Aislamiento Lógico Estricto:**
> A pesar de correr bajo el mismo runtime, los módulos [BibleModule](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend/src/bible/bible.module.ts), [SoftwareModule](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend/src/software/software.module.ts) y [PortfolioModule](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/portfolio.module.ts) son **completamente independientes**. NINGÚN módulo debe conocer la existencia de otro, importar código de su dominio o cruzar consultas de persistencia. Esto asegura que cualquiera de las carpetas de negocio (ej. `src/bible/`) pueda ser copiada a un servidor NestJS independiente y funcionar autónomamente de forma inmediata.

---

## 2. Aislamiento de Datos (Bases de Datos Independientes)

Para cumplir con la independencia absoluta de datos entre los subproyectos y asegurar que sigan siendo **3 proyectos lógicamente desacoplados**, cada módulo registra y gestiona su propia conexión física de base de datos local SQLite utilizando **TypeORM** con el driver `better-sqlite3`:

* **Biblia**: Se conecta a la base de datos `bible.sqlite` registrando de forma exclusiva sus entidades `Verse`, `Book` y `Translation` a través de la conexión con nombre `'bibleConnection'`.
* **Software**: Se conecta a `software.sqlite` registrando la entidad `Project` a través de `'softwareConnection'`.
* **Portfolio**: Se conecta a `portfolio.sqlite` registrando la entidad `ContactMessage` a través de `'portfolioConnection'`.

> [!NOTE]
> **Justificación del Aislamiento de Datos en 1 GB de RAM:**
> Aunque NestJS se ejecute en un único proceso para no sobrecargar el VPS de 1 GB de RAM, se mantiene el uso de archivos físicos SQLite separados. Esto garantiza que la persistencia permanezca 100% aislada. Si en el futuro se decide extraer uno de los 3 proyectos a un servidor independiente, no será necesario realizar ninguna migración o separación de tablas compleja, ya que sus bases de datos son completamente independientes desde su origen.

---

## 3. Catálogo de Endpoints REST (APIs)

Dado que no se ha configurado un prefijo global (como `/api`) en NestJS, todas las rutas de la API se exponen y resuelven directamente bajo la ruta raíz del puerto `3000`.

### Módulo de Biblia (`bible`)
Gestiona el texto sagrado y la segmentación teológica:
* **Versículos (`/bible/verses`)**:
  - `GET /bible/verses`: Lista los versículos. Acepta query params opcionales: `bookId` (filtrar por libro) y `translationId` (filtrar por traducción).
  - `GET /bible/verses/:id`: Obtiene el detalle de un versículo por ID.
  - `POST /bible/verses`: Crea un nuevo versículo (requiere `CreateVerseDto` en el body).
  - `PATCH /bible/verses/:id`: Modifica un versículo existente.
  - `DELETE /bible/verses/:id`: Elimina un versículo (retorna HTTP 204).
* **Libros (`/bible/books`)**:
  - `GET /bible/books`: Retorna el catálogo completo de libros (Antiguo y Nuevo Testamento).
  - `GET /bible/books/:id`: Detalle de un libro por ID.
  - `POST /bible/books`: Registra un libro.
  - `DELETE /bible/books/:id`: Remueve un libro.
* **Traducciones (`/bible/translations`)**:
  - `GET /bible/translations`: Lista las traducciones disponibles (ej: Reina Valera, NVI).
  - `GET /bible/translations/:id`: Detalle de una traducción.
  - `POST /bible/translations`: Registra una nueva traducción.
  - `DELETE /bible/translations/:id`: Elimina una traducción.

### Módulo de Software (`software`)
Gestiona el catálogo de proyectos y herramientas de desarrollo:
* **Proyectos (`/software/projects`)**:
  - `GET /software/projects`: Lista los proyectos registrados en el catálogo.
  - `GET /software/projects/:id`: Obtiene el detalle de un proyecto.
  - `POST /software/projects`: Registra un nuevo proyecto.
  - `PATCH /software/projects/:id`: Actualiza campos específicos del proyecto.
  - `DELETE /software/projects/:id`: Elimina un proyecto de software.

### Módulo de Portafolio (`portfolio`)
Gestiona los mensajes de contacto recibidos en el portafolio:
* **Contacto (`/portfolio/contact`)**:
  - `POST /portfolio/contact`: Registra un nuevo mensaje de contacto enviado por un visitante.
  - `GET /portfolio/contact`: Lista todos los mensajes registrados (para auditoría).

---

## 4. Arquitectura en Capas por Módulo

Cada dominio de negocio sigue estrictamente el patrón de **Arquitectura en Capas** nativo de NestJS:

1. **Capa de Presentación (Controllers / Gateways)**: Captura las peticiones externas, realiza validaciones sintácticas básicas y delega la ejecución al servicio.
2. **Capa de Negocio (Services)**: Contiene la lógica, las reglas de negocio, y coordina las transacciones.
3. **Capa de Datos (Entities / Repositories)**: Define el mapeo de tablas a través de entidades de TypeORM y gestiona las consultas SQL.

---

## 5. Componentes y Middlewares Globales (`src/common/` y `main.ts`)

El archivo de arranque [main.ts](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend/src/main.ts) configura políticas y filtros globales para estandarizar el comportamiento del servidor:

* **Filtro de Excepciones Global (`GlobalExceptionFilter`)**: Captura cualquier error HTTP lanzado en los servicios de forma centralizada y devuelve una respuesta estructurada JSON uniforme, evitando el uso redundante de bloques `try/catch` en los controladores.
* **Interceptor de Respuestas (`TransformInterceptor`)**: Formatea de forma unificada todas las respuestas exitosas de los endpoints REST en un JSON con estructura `{ success: true, data: ... }`.
* **Pipe de Validación (`ValidationPipe`)**: Configurado con `whitelist: true` y `transform: true` para filtrar automáticamente propiedades no declaradas en los DTOs y mapear tipos de datos entrantes.
* **Logging Estructurado (`nestjs-pino`)**: Implementa un registro asíncrono ultraligero que escribe logs en formato JSON estruturado a `stdout`. En desarrollo, utiliza `pino-pretty` para formatear los logs con colores legibles en consola.
* **CORS**: Habilitado globalmente para autorizar peticiones asíncronas desde los subdominios de Next.js (puerto 3001).

---

## 6. WebSockets de la Terminal (Portfolio SSH)

El módulo de Portfolio expone una terminal virtual interactiva mediante WebSockets usando el componente [PortfolioGateway](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend/src/portfolio/gateways/portfolio.gateway.ts):

* **Namespace**: `terminal`
* **Protocolo**: Socket.io (con WebSocket como transporte exclusivo).
* **Flujo de Comunicación**:
  1. Al conectarse, el backend emite al cliente el evento `terminal-output` con el banner de bienvenida SSH y el prompt local (`jorge@vps-1gb-ram:~$ `).
  2. El cliente emite el evento `execute-command` enviando el texto del comando.
  3. El gateway ejecuta el comando a través del servicio y devuelve la respuesta al cliente emitiendo nuevamente `terminal-output`.

---

## 7. Configuración y Scripts de Desarrollo

Los comandos de ejecución se gestionan a través de los scripts registrados en [package.json](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend/package.json):

* **Instalación de Dependencias**:
  ```bash
  pnpm install
  ```
  *(Nota: Se requieren herramientas de compilación C++ nativas instaladas en el sistema para compilar el driver de `better-sqlite3`).*

* **Ejecutar en Desarrollo (con recarga rápida)**:
  ```bash
  pnpm run start:dev
  ```

* **Construir para Producción**:
  ```bash
  pnpm run build
  ```

* **Ejecutar Servidor en Producción**:
  ```bash
  pnpm run start:prod
  ```

* **Pruebas Unitarias**:
  ```bash
  pnpm run test
  ```
