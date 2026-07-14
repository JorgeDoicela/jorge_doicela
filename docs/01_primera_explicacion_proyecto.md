# Arquitectura Interna de Software: NestJS y Next.js (Versión Definitiva)

Este documento define la estructura y las reglas arquitectónicas para el proyecto del Portafolio, Biblia y Software, desplegado en un VPS inicial de 1 GB de RAM, con miras a escalar a una arquitectura de servicios independientes.

> [!IMPORTANT]
> **Aislamiento Lógico vs. Consolidación Física:**
> El proyecto está compuesto por **proyectos 100% independientes y desacoplados**. La única razón por la que comparten los mismos procesos en ejecución (NestJS en puerto 3000 y Next.js en puerto 3001) es la limitación física de **1 GB de RAM** en el VPS. Ejecutar procesos de Node.js por separado para cada aplicación saturaría la memoria del servidor. Por ello, se agrupan en tiempo de ejecución bajo runtimes consolidados, pero el código, los estilos CSS y los datos deben tratarse estrictamente como cajas negras separadas sin comunicación mutua.

---

## 1. El Backend: NestJS (Arquitectura en Capas)

NestJS es un framework "Altamente Opinionado". Internamente, utiliza una Arquitectura en Capas (Layered Architecture) basada en Inyección de Dependencias.

Cada módulo de NestJS se dividirá estrictamente en tres capas:

1. **Capa de Presentación (Controladores / Gateways)**: Recibe peticiones HTTP o WebSockets. Solo valida que la petición esté bien formateada y delega el trabajo. No contiene lógica.
2. **Capa de Lógica de Negocio (Servicios)**: El cerebro que procesa las reglas de negocio. Aquí ocurren los cálculos, validaciones complejas y las decisiones.
3. **Capa de Acceso a Datos (Repositorios / ORMs)**: Se conecta a la base de datos de forma agnóstica (ej. usando Prisma o TypeORM)

## 2. El Frontend: Next.js (Arquitectura Basada en Componentes y Subdominios)

Next.js and React son frameworks flexibles. En este proyecto, se ha adoptado un esquema **Multi-Tenant/Multi-Domain** en un único servidor y un patrón de diseño basado en funcionalidades (**Feature-Sliced Design / Colocación por Funcionalidades**).

### Enrutamiento e Intercepción de Subdominios

Para evitar levantar múltiples instancias de servidores web que consumirían excesiva RAM en el VPS, se utiliza un único servidor Next.js que reescribe dinámicamente las rutas entrantes basándose en el subdominio del host mediante el archivo [middleware.ts](../frontend/web/src/middleware.ts):

* **Landing Page principal** (`jorgedoicela.com` o localhost sin subdominio): Se sirve directamente de forma convencional (`NextResponse.next()`).
* **Subdominio Portfolio** (`portfolio.*`): Se reescribe internamente a `/portfolio` y es gestionado por la carpeta `(portfolio)`.
* **Subdominio Biblia** (`bible.*`): Se reescribe internamente a `/bible` y es gestionado por la carpeta `(bible)`.
* **Subdominio Software** (`software.*`): Se reescribe internamente a `/software` y es gestionado por la carpeta `(software)`.

### Aislamiento de Estilos y Configuración CSS

Cada subproyecto dentro del frontend web cuenta con su propio archivo `globals.css` local (por ejemplo, [frontend/web/src/app/(bible)/globals.css](../frontend/web/src/app/(bible)/globals.css)). Los layouts independientes importan únicamente su archivo de estilos específico. Esto previene de forma absoluta la contaminación cruzada o colisiones de clases globales de Tailwind CSS v4.

### Colocación de Código (FSD)

Se agrupa el código estrictamente por su contexto funcional en directorios `features/`. Por ejemplo, todo lo relacionado con versículos bíblicos se encapsula bajo `(bible)/features/verses/`, el cual contiene:
- `components/`: Componentes gráficos locales de la funcionalidad (ej. `VerseList.tsx`).
- `hooks/`: Lógica de datos y llamadas de red asociadas (ej. `useVerses.ts`).
- `types.ts`: Tipados TypeScript locales.

De este modo se evita crear carpetas técnicas genéricas globales (como una única carpeta `components` o `hooks` para todo el proyecto), manteniendo la portabilidad e independencia de cada módulo.

---

## 3. La Estructura del Monorepo (Aislamiento Puro)

Para garantizar que ningún proyecto dependa de otro y que la migración futura sea instantánea, se utiliza una estructura de Workspaces limpia. No existe una capa de paquetes compartidos. Las interfaces de TypeScript (ej. `Project`, `Verse`) se definen de forma duplicada tanto en el backend como en el frontend para evitar acoplamientos.

```text
jorge_doicela/ (Monorepo)
├── package.json (Configuración maestra de Workspaces)
│
├── docs/ (Toda la documentación técnica del proyecto)
│   ├── 01_primera_explicacion_proyecto.md
│   ├── backend.md            # Documentación específica del backend
│   ├── frontend_web.md       # Documentación específica del frontend
│   └── infraestructura.md    # Despliegue y seguridad en la nube (AWS / Cloudflare)
│
├── frontend/
│   ├── web/ (Un único proyecto Next.js en puerto 3001)
│   │   ├── src/
│   │   │   ├── middleware.ts   # Intercepta y reescribe subdominios
│   │   │   └── app/
│   │   │       ├── (landing)/     <-- Landing Page Principal (jorgedoicela.com)
│   │   │       ├── (portfolio)/   <-- Portfolio (portfolio.jorgedoicela.com)
│   │   │       │   ├── portfolio/page.tsx
│   │   │       │   ├── features/terminal/
│   │   │       │   └── globals.css
│   │   │       ├── (bible)/       <-- Biblia (bible.jorgedoicela.com)
│   │   │       │   ├── bible/page.tsx
│   │   │       │   ├── features/verses/
│   │   │       │   └── globals.css
│   │   │       └── (software)/    <-- Software (software.jorgedoicela.com)
│   │   │           ├── software/page.tsx
│   │   │           ├── features/projects/
│   │   │           └── globals.css
│   │
│   └── mobile/ (Cliente de React Native / Expo)
│
└── backend/ (Un solo servidor NestJS en puerto 3000)
    ├── src/
    │   ├── app.module.ts (Monolito modular consolidado)
    │   ├── portfolio/ (WebSockets de la terminal)
    │   ├── bible/     (Endpoints REST de la Biblia)
    │   └── software/  (Endpoints REST de Proyectos de Software)
```

**Ventaja de esta estructura**: Si en el futuro se desea migrar la Biblia a un VPS independiente debido a un incremento de carga, simplemente se copia la carpeta de rutas físicas del frontend `frontend/web/src/app/(bible)/` y la carpeta modular del backend `backend/src/bible/`. La migración será transparente y no requerirá desenredar dependencias ni romper el resto de servicios.

---

## 4. El Backend "Extraíble": Preparando el salto a Microservicios

Aclaración arquitectónica: En este contexto, "Microservicios" no implica arquitecturas masivas con Kubernetes, Kafka o enrutamiento complejo en la nube. Se refiere estrictamente a **Servicios Independientes**: la capacidad de tomar una carpeta, ponerla en un nuevo VPS (ej. cuando se escale a 2 GB), y que funcione de forma autónoma sin depender del servidor original.

Para lograr esto sin acoplamientos, el servidor NestJS actual (que corre consolidado en un único proceso de Node.js exclusivamente para ahorrar memoria en el VPS de 1 GB de RAM) debe programarse como un Monolito Modular, aplicando 3 Reglas de Oro:

### Regla 1: Cero Acoplamiento de Código (Aislamiento de Dominio)

Prohibido cruzar importaciones. El módulo de la Biblia no puede saber que el módulo de Software existe.

* **MAL**: `import { SoftwareService } from '../software/software.service'` dentro de `bible.service.ts`.
* **BIEN**: Son cajas negras. Si por algún motivo necesitan comunicarse, deben hacerlo a través del Event Emitter de NestJS (simulando una arquitectura orientada a eventos en red).

### Regla 2: Aislamiento de Datos (Bases de Datos Separadas)

Bajo ningún concepto se mezclarán tablas de distintos dominios en la misma base de datos física o lógica. Aunque compartan el servidor debido a la limitación de 1 GB de RAM del VPS, el aislamiento de almacenamiento debe ser total:

* **Fase 1 (SQLite)**: Archivos de base de datos físicos independientes (`bible.sqlite`, `software.sqlite` y `portfolio.sqlite`).
* **Fase 2 (PostgreSQL - VPS 2GB)**: Bases de datos lógicas separadas dentro del mismo motor (`db_bible`, `db_software` y `db_portfolio`).

### Regla 3: Configuración Independiente

Cada módulo debe leer sus propias variables de entorno. Si se extrae la carpeta `src/bible/` a un nuevo VPS, solo debe ser necesario conectarle su propia cadena de conexión a la base de datos para que compile.

---

## 5. Prácticas Profesionales y Calidad

Para asegurar la estabilidad del proyecto y prepararlo para escalar a un entorno empresarial/SaaS:

### 5.1 Estandarización Forzada

* **ESLint y Prettier**: Configurados para garantizar reglas de estilo uniformes en todo el repositorio.
* **Husky (Pre-commit Hooks)**: Se implementarán hooks para bloquear el comando `git commit` si el código no pasa las reglas de linting o tiene errores de TypeScript. La rama principal (main) siempre debe ser estable.

### 5.2 Manejo de Errores Global (Exception Filters)

* En NestJS, se utilizarán Global Exception Filters (esta es la herramienta definitiva, oficial y la mejor práctica en el framework para este propósito).
* Los controladores y servicios no usarán bloques `try/catch` para devolver respuestas HTTP. Si ocurre un error de negocio, se lanzará una excepción estándar (ej. `new NotFoundException()`). El filtro global atrapará esto de forma centralizada y lo formateará como un JSON unificado, manteniendo los controladores completamente limpios.

### 5.3 Logging Estructurado (Pino)

El entorno de Node.js ofrece varias opciones (Winston, Bunyan, Pino), pero se elige Pino (mediante `nestjs-pino`) como la herramienta definitiva a largo plazo, sin importar si el servidor tiene 1 GB o escala a recursos superiores.

**Justificación Arquitectónica (Alineación con Cloud/SaaS)**:

* **Rendimiento Máximo**: Pino es asíncrono y genera JSON con un overhead casi nulo. A diferencia de Winston, que reserva más memoria para manejar sus múltiples transportes internos, Pino asegura que el Event Loop de Node.js no se bloquee bajo tráfico pesado (vital para cuando se conecte la futura aplicación móvil).
* **Cumplimiento 12-Factor App**: La arquitectura moderna dictamina que la aplicación no debe gestionar el enrutamiento de sus propios logs (guardar archivos, enviar a la red). Pino simplemente expulsa JSON estructurado a la salida estándar (`stdout`). En el futuro (Fase VPS 2GB+), un agente de infraestructura externo leerá esa salida para enviarla a sistemas de monitoreo sin penalizar el código de NestJS.
* **Experiencia de Desarrollo**: Se utilizará `pino-pretty` en entornos locales para transformar el JSON crudo en logs legibles con colores durante el desarrollo.

---

## Nota:

Para estructurarlo manteniendo el aislamiento deseado, se plantea de la siguiente manera:
 
1. **Separación Vertical (Módulos / Dominios)**: Corresponde a los proyectos individuales. Se crea una carpeta principal para la Biblia (`bible`), otra para Software (`software`) y otra para Portafolio (`portfolio`). Esta separación es la que permite extraer la carpeta en el futuro y trasladarla a otro VPS.
2. **Separación Horizontal (Las Capas de NestJS)**: Dentro de cada una de esas carpetas, se aplican las reglas de NestJS (Controlador, Servicio, Repositorio).

Físicamente, la estructura de directorios dentro de `backend/src/` se verá exactamente así:

```text
src/
├── app.module.ts (El único archivo que junta las 3 torres para correr en 1GB de RAM)
│
├── bible/ (Dominio 100% aislado)
│   ├── bible.module.ts (La caja que encierra a la Biblia)
│   ├── bible.controller.ts (Capa 1: Recibe HTTP)
│   ├── bible.service.ts (Capa 2: Lógica de negocio)
│   └── bible.repository.ts (Capa 3: Conexión a su propia base de datos)
│
├── software/ (Dominio 100% aislado)
│   ├── software.module.ts (La caja que encierra al Software)
│   ├── software.controller.ts (Capa 1)
│   └── software.service.ts (Capa 2)
│
└── portfolio/ (Dominio 100% aislado)
    ├── portfolio.module.ts
    ├── portfolio.gateway.ts (Capa 1: Recibe WebSockets SSH)
    └── portfolio.service.ts (Capa 2: Lógica de la terminal)
```

---

## Decisión de ORM: ¿TypeORM o Prisma?

Para el proyecto en desarrollo (Portafolio, Biblia y Software aislados en 1GB de RAM), la elección oficial es **TypeORM**.
 
A continuación, se detalla por qué Prisma, a pesar de ser una alternativa moderna, no resulta conveniente en este escenario, y por qué TypeORM resulta superior.

### 1. El Problema del Aislamiento (El "Talón de Aquiles" de Prisma)

En el documento de arquitectura, se estableció la Regla 1: Cero Acoplamiento de Código.
 
* **Cómo funciona Prisma**: Prisma obliga a mantener un único archivo unificado llamado `schema.prisma` en la raíz del proyecto donde se declaran todas las tablas de las bases de datos de forma conjunta. Esto rompe inmediatamente el aislamiento. Si se requiere separar la Biblia en el futuro, es necesario desagrupar ese archivo manualmente.
* **Cómo funciona TypeORM**: TypeORM utiliza clases separadas. Se puede crear un archivo `verse.entity.ts` y guardarlo de forma segura dentro de la carpeta `src/bible/`. Si mañana se extrae la carpeta de la Biblia a otro VPS, la tabla de la base de datos se traslada con ella automáticamente.

### 2. Consumo de RAM en el VPS de 1GB
 
* **Prisma**: Internamente, Prisma se ejecuta sobre binarios en Rust. Al iniciar la base de datos, se levanta un motor de consultas (Query Engine) en un proceso separado del sistema operativo. Si se configuran múltiples bases de datos independientes (ej. `bible.sqlite` y `software.sqlite`), Prisma levantará múltiples motores de Rust, consumiendo la memoria RAM disponible.
* **TypeORM**: Desarrollado en TypeScript/Node.js. Se ejecuta dentro del mismo hilo de ejecución del servidor NestJS. El consumo de memoria adicional es mínimo, lo que ayuda a conservar los recursos del VPS de 1GB.

### 3. Sinergia Total con NestJS

NestJS está fuertemente inspirado en Angular y utiliza Decoradores para todo (`@Controller`, `@Injectable`).

TypeORM opera bajo un esquema similar. Para declarar una tabla en la base de datos, se define una clase y se le asigna el decorador `@Entity()`. Esto permite que el desarrollo en NestJS con TypeORM se integre de forma unificada, nativa y limpia.

```typescript
// Ejemplo de implementación de código en TypeORM (Aislado en src/bible/)
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Verse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
}
```

**Veredicto**

Prisma es una opción para proyectos unificados (monolitos tradicionales) sin restricciones estrictas de hardware. Sin embargo, para un Monolito Modular que requiere bases de datos separadas (SQLite) y bajo consumo de memoria, TypeORM es la alternativa técnica adecuada.

---

## Análisis de Stack Tecnológico (Backend y Calidad)

Las herramientas analizadas conforman un stack altamente profesional. De hecho, corresponden al conjunto de tecnologías idóneo para un proyecto de este tipo.
 
A continuación, se detalla el análisis de cada una y los ajustes necesarios para optimizar su funcionamiento.

### 1. Comunicación entre Módulos: `@nestjs/event-emitter`

**Veredicto: Elección idónea para los requerimientos del proyecto**.

* **¿Por qué es profesional?** Cumple a la perfección con la "Regla 1: Cero Acoplamiento". El módulo de la Biblia emite un evento `user.created` y no necesita conocer ni le importa quién lo escucha. El módulo de Software puede reaccionar a él sin depender de la Biblia.
* **Ahorro de RAM**: En infraestructuras de gran escala, la comunicación se realiza mediante Redis o RabbitMQ. Sin embargo, instanciar servicios adicionales en un VPS de 1GB consumiría memoria crítica. El uso de `event-emitter` se resuelve en la memoria interna de Node.js (con impacto mínimo en memoria y latencia cero).
* **Escalabilidad futura**: Si en fases posteriores se migra a microservicios en servidores independientes, solo se requiere sustituir el despachador de eventos (`event-emitter`) por un gestor de colas (`RabbitMQ`), manteniendo intacta la lógica de negocio.

### 2. WebSockets (Terminal Portafolio): `@nestjs/platform-socket.io`

**Veredicto: Muy buena elección, pero hay una alternativa más ligera**.

* **¿Por qué Socket.io?** Es el estándar de la industria. Es fácil de usar, maneja "salas" (rooms) por defecto y si el internet del usuario es inestable, reconecta automáticamente.
* **La alternativa estricta (`@nestjs/platform-ws`)**: Socket.io transmite metadatos adicionales en cada paquete de datos. Si se requiere que la terminal SSH simulada sea ligera y rápida con el mínimo consumo de memoria RAM en el servidor, se puede optar por `@nestjs/platform-ws`, la cual implementa WebSockets puros sin capas intermedias.
* **Recomendación**: Mantener el uso de `socket.io`. La diferencia de consumo en memoria es marginal y las ventajas operativas para el manejo automático de reconexiones agilizan el desarrollo.

### 3. Logging: `nestjs-pino` y `pino-pretty`

**Veredicto: Indiscutible (La mejor del mercado)**.

* Como se analizó anteriormente, para un entorno con recursos limitados (1GB a 2GB de RAM), Pino supera a la competencia (Winston, Morgan) en velocidad y bajo consumo de memoria, al ser 100% asíncrono.
* El uso de `pino-pretty` solo para la terminal de desarrollo (`NODE_ENV=development`) es la práctica estándar para no afectar la lectura de logs en entornos de producción.

### 4. Calidad: Husky + Pre-commit Hooks (Linting y Typecheck)

**Veredicto: Profesional, pero necesita una optimización crucial (lint-staged)**.

* **El problema**: Si se configura Husky para ejecutar tareas de linteado y compilación sintáctica en la totalidad del monorepo (Portafolio, Biblia, Software y Backend) en cada confirmación de cambio (`git commit`), el tiempo de espera por commit se incrementará considerablemente.
* **La solución profesional (lint-staged)**: Es una librería que se usa siempre junto a Husky. Lo que hace es analizar qué archivos fueron modificados exactamente en ese commit, y solo le pasa el linter a esos archivos.
* **El flujo perfecto**: Se realiza un cambio en un archivo de la Biblia -> Se ejecuta `git commit` -> Husky despierta a `lint-staged` -> Revisa solo ese archivo en 0.5 segundos -> Commit exitoso.

### Resumen del Stack Backend

Las herramientas seleccionadas son robustas, de grado empresarial y respetan la restricción de memoria física (1GB de RAM). La única sugerencia de mejora es la incorporación de `lint-staged` en la configuración de Husky para analizar únicamente los archivos modificados.

---

## El Comando de Oro

```bash
pnpm --filter <nombre-del-proyecto> add <libreria>
```

### El Peligro de instalar en la Raíz (Global)

Si se instala una librería en la raíz del monorepo, todas las aplicaciones (Portafolio, Biblia, Software) tendrán acceso a ella.
 
* **El desastre**: Si mañana se extrae la carpeta de la Biblia para trasladarla a un VPS nuevo, la aplicación fallará. ¿Por qué? Porque la librería se quedó registrada en el `package.json` de la raíz original, no en el de la Biblia.

### La Magia de usar `--filter`

Usar `--filter` es exactamente lo mismo que hacer `cd apps/bible`, instalar la librería, y hacer `cd ../..` para salir, pero sin la molestia de navegar por la terminal. Garantiza dos cosas:

2. **Portabilidad Perfecta (Migración)**: Como el `package.json` de la Biblia tiene su propia lista exacta de librerías, el día que la saques a otro servidor, se irá con todo lo que necesita para funcionar de forma autónoma.

En síntesis: La directiva `--filter` garantiza que los proyectos puedan coexistir en el mismo monorepo local pero mantengan su total independencia para futuras separaciones físicas.
