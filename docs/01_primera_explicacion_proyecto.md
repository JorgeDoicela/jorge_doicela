# Arquitectura Interna de Software: NestJS y Next.js (Versión Definitiva)

Este documento define la estructura y las reglas arquitectónicas para el ecosistema del Portafolio, Biblia y Software, desplegado en un VPS inicial de 1 GB de RAM, con miras a escalar a una arquitectura de servicios independientes.

Se ha optado por un Monorepo Puro sin paquetes compartidos, priorizando el aislamiento absoluto (desacoplamiento total) por encima del principio DRY (Don't Repeat Yourself).

---

## 1. El Backend: NestJS (Arquitectura en Capas)

NestJS es un framework "Altamente Opinionado". Internamente, utiliza una Arquitectura en Capas (Layered Architecture) basada en Inyección de Dependencias.

Cada módulo de NestJS se dividirá estrictamente en tres capas:

1. **Capa de Presentación (Controladores / Gateways)**: Recibe peticiones HTTP o WebSockets. Solo valida que la petición esté bien formateada y delega el trabajo. No contiene lógica de negocio.
2. **Capa de Lógica de Negocio (Servicios)**: El cerebro que procesa las reglas de negocio. Aquí ocurren los cálculos, validaciones complejas y las decisiones.
3. **Capa de Acceso a Datos (Repositorios / ORMs)**: Se conecta a la base de datos de forma agnóstica (utilizando TypeORM o Prisma).

---

## 2. El Frontend: Next.js (Arquitectura Basada en Componentes)

Next.js y React son "Cero Opinionados". Se utilizará una Arquitectura Basada en Componentes y Funcionalidades (Feature-Sliced Design).

Se agrupará el código por su contexto. Por ejemplo, todo lo relacionado a versículos irá en su propia carpeta con sus componentes, hooks y llamadas a la API correspondientes, en lugar de separar por "tipo de archivo" (una carpeta para todos los hooks, otra para todos los componentes, etc.).

---

## 3. La Estructura del Monorepo (Aislamiento Puro)

Para garantizar que ningún proyecto dependa de otro y que la migración futura sea instantánea, se utilizará una estructura de Workspaces limpia. No habrá capa de paquetes compartidos. Las interfaces de Datos de TypeScript (ej. Usuario, Versiculo) se definirán manualmente tanto en el backend como en su respectivo frontend.

```
mi-gran-monorepo/
├── package.json (Configuración maestra de Workspaces)
│
├── apps/ (Frontends Next.js - SSG Export)
│   ├── portafolio/ (100% aislado, sus propios estilos y tipos)
│   ├── biblia/ (100% aislado, define sus propias interfaces)
│   └── software/ (100% aislado, define sus propias interfaces)
│
└── backend/ (Un solo servidor NestJS)
    └── src/
        ├── app.module.ts (Módulo raíz)
        ├── portafolio/ (Módulo NestJS)
        ├── biblia/ (Módulo NestJS)
        └── software/ (Módulo NestJS)
```

**Ventaja de esta estructura**: Si mañana se extrae la Biblia a otro VPS, simplemente se copian la carpeta `apps/bible/` y la carpeta `backend/src/bible/`. Al no existir paquetes intermedios, la migración es directa y sin riesgo de arrastrar código de otros dominios.

---

## 4. El Backend "Extraíble": Preparando el salto a Microservicios

Aclaración arquitectónica: En este contexto, "Microservicios" no implica arquitecturas masivas con Kubernetes, Kafka o enrutamiento complejo en la nube. Se refiere estrictamente a **Servicios Independientes**: la capacidad de tomar una carpeta, ponerla en un nuevo VPS (ej. cuando se escale a 2 GB), y que funcione de forma autónoma sin depender del servidor original.

Para lograr esto sin romper el sistema, el servidor NestJS actual (que corre como un único proceso de Node.js para ahorrar RAM) debe programarse como un Monolito Modular, aplicando 3 Reglas de Oro:

### Regla 1: Cero Acoplamiento de Código (Aislamiento de Dominio)
Prohibido cruzar importaciones. El módulo de la Biblia no puede saber que el módulo de Software existe.
* **Incorrecto**: `import { SoftwareService } from '../software/software.service'` dentro de `biblia.service.ts`.
* **Correcto**: Son cajas negras. Si por algún motivo necesitan comunicarse, deben hacerlo a través del Event Emitter de NestJS (simulando una arquitectura orientada a eventos en red).

### Regla 2: Aislamiento de Datos (Bases de Datos Separadas)
Bajo ningún concepto se mezclarán tablas de distintos dominios en la misma base de datos física o lógica.
* **Fase 1 (SQLite)**: Archivos separados (`bible.sqlite` y `software.sqlite`).
* **Fase 2 (PostgreSQL - VPS 2GB)**: Bases de datos lógicas separadas dentro del mismo motor (`db_biblia` y `db_software`).

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
El ecosistema de Node.js ofrece varias opciones (Winston, Bunyan, Pino), pero se elige Pino (mediante `nestjs-pino`) como la herramienta definitiva a largo plazo, sin importar si el servidor tiene 1 GB o escala a recursos superiores.

**Justificación Arquitectónica (Alineación con Cloud/SaaS)**:
* **Rendimiento Máximo**: Pino es asíncrono y genera JSON con un overhead casi nulo. A diferencia de Winston, que reserva más memoria para manejar sus múltiples transportes internos, Pino asegura que el Event Loop de Node.js no se bloquee bajo tráfico pesado (vital para cuando se conecte la futura aplicación móvil).
* **Cumplimiento 12-Factor App**: La arquitectura moderna dictamina que la aplicación no debe gestionar el enrutamiento de sus propios logs (guardar archivos, enviar a la red). Pino simplemente expulsa JSON estructurado a la salida estándar (`stdout`). En el futuro (Fase VPS 2GB+), un agente de infraestructura externo leerá esa salida para enviarla a sistemas de monitoreo sin penalizar el código de NestJS.
* **Experiencia de Desarrollo**: Se utilizará `pino-pretty` en entornos locales para transformar el JSON crudo en logs legibles con colores durante el desarrollo.

---

## Estructura del Proyecto

Para estructurarlo manteniendo el aislamiento requerido:
1. **Separación Vertical (Módulos / Dominios)**: Son tus proyectos. Crearemos una carpeta principal para la biblia, otra para software y otra para portafolio. Esta es la separación que te permite "arrancar" la carpeta en el futuro y llevarla a otro VPS.
2. **Separación Horizontal (Las Capas de NestJS)**: Dentro de cada una de esas carpetas, aplicarás las reglas de NestJS (Controlador, Servicio, Repositorio).

Físicamente, la estructura de tus carpetas dentro de `backend/src/` se verá exactamente así:

```
src/
├── app.module.ts (El único archivo que junta las 3 torres para correr en 1GB de RAM)
│
├── biblia/ (Dominio 100% aislado)
│   ├── biblia.module.ts (La caja que encierra a la Biblia)
│   ├── biblia.controller.ts (Capa 1: Recibe HTTP)
│   ├── biblia.service.ts (Capa 2: Lógica de negocio)
│   └── biblia.repository.ts (Capa 3: Conexión a su propia base de datos)
│
├── software/ (Dominio 100% aislado)
│   ├── software.module.ts (La caja que encierra al Software)
│   ├── software.controller.ts (Capa 1)
│   └── software.service.ts (Capa 2)
│
└── portafolio/ (Dominio 100% aislado)
    ├── portafolio.module.ts
    ├── portafolio.gateway.ts (Capa 1: Recibe WebSockets SSH)
    └── portafolio.service.ts (Capa 2: Lógica de la terminal)
```

---

## Decisión de ORM: ¿TypeORM o Prisma?

Para el ecosistema que estamos construyendo (Portafolio, Biblia y Software aislados en 1GB de RAM), la elección oficial es **TypeORM**.

Aquí se explica por qué Prisma, a pesar de ser más moderno, no es adecuado para este caso, y por qué TypeORM es el indicado:

### 1. El Problema del Aislamiento (El "Talón de Aquiles" de Prisma)
En nuestro documento de arquitectura, establecimos la Regla 1: Cero Acoplamiento de Código.
* **Cómo funciona Prisma**: Prisma te obliga a tener un único archivo gigante llamado `schema.prisma` en la raíz de tu proyecto donde declaras todas las tablas de tu base de datos juntas. Esto rompe inmediatamente el aislamiento. Si quieres separar la Biblia en el futuro, tendrías que desenredar ese archivo a mano.
* **Cómo funciona TypeORM**: TypeORM utiliza clases separadas. Puedes crear un archivo `verse.entity.ts` y guardarlo de forma segura dentro de la carpeta `src/bible/`. Si mañana sacas la carpeta de la Biblia a otro VPS, la tabla de la base de datos se va con ella automáticamente.

### 2. Consumo de RAM en tu VPS de 1GB
* **Prisma**: Por debajo, Prisma no está escrito en Node.js, está escrito en Rust. Cada vez que inicias Prisma, este levanta un "motor" (Query Engine) en un proceso separado en tu sistema operativo. Si intentas tener múltiples bases de datos (ej. `bible.sqlite` y `software.sqlite`), Prisma levantará múltiples motores de Rust, devorando la memoria RAM.
* **TypeORM**: Es 100% TypeScript/Node.js. Corre dentro del mismo hilo de tu servidor NestJS. El consumo de memoria extra es casi nulo, ideal para mantener a raya tu VPS de 1GB.

### 3. Sinergia Total con NestJS
NestJS está fuertemente inspirado en Angular y utiliza Decoradores para todo (`@Controller`, `@Injectable`).
TypeORM funciona exactamente igual. Para crear una tabla en tu base de datos, simplemente creas una clase y le pones el decorador `@Entity()`. Esto hace que programar en NestJS con TypeORM se sienta como una experiencia unificada, nativa y muy limpia.

```typescript
// Ejemplo de cómo se ve el código en TypeORM (Totalmente aislado en src/bible/)
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Versiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;
}
```

**Veredicto**: Prisma es excelente para proyectos donde todo está mezclado (monolitos tradicionales) y tienes RAM de sobra. Pero para un Monolito Modular donde quieres bases de datos separadas (SQLite) y consumir poca memoria, TypeORM es la herramienta profesional correcta.

---

## Análisis de Stack Tecnológico (Backend y Calidad)

Las herramientas elegidas conforman un stack altamente profesional, apto para un desarrollo robusto y eficiente.

### 1. Comunicación entre Módulos: `@nestjs/event-emitter`
**Veredicto: Excelente elección (La mejor para tu fase actual)**.
* **Por qué es profesional**: Cumple a la perfección con la "Regla 1: Cero Acoplamiento". El módulo de la Biblia emite un evento `usuario.creado` y ni se entera (ni le importa) quién lo escucha. El módulo de Software puede reaccionar a él sin importar nada de la Biblia.
* **Ahorro de RAM**: En arquitecturas grandes, esto se hace con Redis o RabbitMQ. Pero levantar Redis en tu VPS de 1GB consumiría recursos valiosos. `event-emitter` ocurre en la memoria interna de Node.js (RAM casi cero, latencia cero).
* **Escalabilidad futura**: Si el día de mañana pasas a microservicios reales en varios servidores, solo cambias `event-emitter` por un Message Broker (RabbitMQ) y tu lógica de negocio queda intacta.

### 2. WebSockets (Terminal Portafolio): `@nestjs/platform-socket.io`
**Veredicto: Muy buena elección**.
* **Por qué Socket.io**: Es el estándar de la industria. Es fácil de usar, maneja salas (rooms) por defecto y si el internet del usuario es inestable, reconecta automáticamente.
* **La alternativa estricta (`@nestjs/platform-ws`)**: Socket.io es un poco más pesado porque envía metadatos extra en cada mensaje. Si quieres que tu terminal sea ultraligera y rápida (como una terminal SSH real) y ahorrar memoria en el servidor, se puede optar por `@nestjs/platform-ws` (WebSockets puros). Sin embargo, se mantiene `socket.io` por su resiliencia de conexión y facilidad de desarrollo.

### 3. Logging: `nestjs-pino` y `pino-pretty`
**Veredicto: Indiscutible (La mejor del mercado)**.
* Pino es asíncrono y genera JSON con un overhead casi nulo, asegurando que el Event Loop de Node.js no se bloquee bajo tráfico pesado.
* El uso de `pino-pretty` solo para la terminal de desarrollo (`NODE_ENV=development`) es la práctica estándar para dar formato legible a los logs en la consola.

### 4. Calidad: Husky + Pre-commit Hooks (con lint-staged)
**Veredicto: Profesional y Optimizado**.
* Configurar Husky para que ejecute el linter y typecheck en todo el monorepo en cada commit ralentizaría el flujo. La incorporación de `lint-staged` solventa esto ejecutando el linter únicamente sobre los archivos que fueron modificados en ese commit en menos de un segundo.

---

## Gestión de Paquetes: El Comando de Oro

```bash
pnpm --filter <nombre-del-proyecto> add <libreria>
```

### El Peligro de instalar en la Raíz (Global)
Si instalas una librería en la raíz del monorepo, todas tus aplicaciones tendrán acceso a ella.
* **El problema**: Si mañana sacas la carpeta de la Biblia para llevártela a un VPS nuevo, la aplicación fallará porque la librería se quedó registrada en el `package.json` de la raíz vieja, no en el de la Biblia.

### La Magia de usar `--filter`
Garantiza dos cosas:
1. **Aislamiento Total (Seguridad)**: La librería se anota única y exclusivamente en el `package.json` de la Biblia. El Portafolio no sabrá que existe y no podrá usarla por accidente.
2. **Portabilidad Perfecta (Migración)**: Como el `package.json` de la Biblia tiene su propia lista exacta de librerías, el día que la saques a otro servidor, se irá con todo lo que necesita para funcionar de forma autónoma.
