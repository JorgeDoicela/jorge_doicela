# Arquitectura Interna de Software: NestJS y Next.js (Versión Definitiva)

Este documento define la estructura y las reglas arquitectónicas para el ecosistema del Portafolio, Biblia y Software, desplegado en un VPS inicial de 1 GB de RAM, con miras a escalar a una arquitectura de servicios independientes.

Se ha optado por un Monorepo Puro sin paquetes compartidos, priorizando el aislamiento absoluto (desacoplamiento total) por encima del principio DRY (Don't Repeat Yourself).

---

## 1. El Backend: NestJS (Arquitectura en Capas)

NestJS es un framework "Altamente Opinionado". Internamente, utiliza una Arquitectura en Capas (Layered Architecture) basada en Inyección de Dependencias.

Cada módulo de NestJS se dividirá estrictamente en tres capas:

1. **Capa de Presentación (Controladores / Gateways)**: Recibe peticiones HTTP o WebSockets. Solo valida que la petición esté bien formateada y delega el trabajo. No contiene lógica.
2. **Capa de Lógica de Negocio (Servicios)**: El cerebro que procesa las reglas de negocio. Aquí ocurren los cálculos, validaciones complejas y las decisiones.
3. **Capa de Acceso a Datos (Repositorios / ORMs)**: Se conecta a la base de datos de forma agnóstica (ej. usando Prisma o TypeORM).

---

## 2. El Frontend: Next.js (Arquitectura Basada en Componentes)

Next.js y React son "Cero Opinionados". Se utilizará una Arquitectura Basada en Componentes y Funcionalidades (Feature-Sliced Design).

Se agrupará el código por su contexto. Por ejemplo, todo lo relacionado a versículos irá en su propia carpeta con sus componentes, hooks y llamadas a la API correspondientes, en lugar de separar por "tipo de archivo" (una carpeta para todos los hooks, otra para todos los componentes, etc.).

---

## 3. La Estructura del Monorepo (Aislamiento Puro)

Para garantizar que ningún proyecto dependa de otro y que la migración futura sea instantánea, se utilizará una estructura de Workspaces limpia. No habrá capa de paquetes compartidos. Las interfaces de TypeScript (ej. User, Verse) se definirán manualmente tanto en el backend como en su respectivo frontend.

```text
mi-gran-monorepo/
├── package.json (Configuración maestra de Workspaces)
│
├── apps/ (Frontends Next.js - SSG Export)
│   ├── portfolio/ (100% aislado, sus propios estilos y tipos)
│   ├── bible/ (100% aislado, define sus propias interfaces)
│   └── software/ (100% aislado, define sus propias interfaces)
│
└── backend/ (Un solo servidor NestJS)
    └── src/
        ├── app.module.ts (Módulo raíz)
        ├── portfolio/ (Módulo NestJS)
        ├── bible/ (Módulo NestJS)
        └── software/ (Módulo NestJS)
```

**Ventaja de esta estructura**: Si mañana se extrae la Biblia a otro VPS, simplemente se copian la carpeta `apps/bible/` y la carpeta `backend/src/bible/`. Al no existir paquetes intermedios, la migración es directa y sin riesgo de arrastrar código de otros dominios.

---

## 4. El Backend "Extraíble": Preparando el salto a Microservicios

Aclaración arquitectónica: En este contexto, "Microservicios" no implica arquitecturas masivas con Kubernetes, Kafka o enrutamiento complejo en la nube. Se refiere estrictamente a **Servicios Independientes**: la capacidad de tomar una carpeta, ponerla en un nuevo VPS (ej. cuando se escale a 2 GB), y que funcione de forma autónoma sin depender del servidor original.

Para lograr esto sin romper el sistema, el servidor NestJS actual (que corre como un único proceso de Node.js para ahorrar RAM) debe programarse como un Monolito Modular, aplicando 3 Reglas de Oro:

### Regla 1: Cero Acoplamiento de Código (Aislamiento de Dominio)

Prohibido cruzar importaciones. El módulo de la Biblia no puede saber que el módulo de Software existe.

* **MAL**: `import { SoftwareService } from '../software/software.service'` dentro de `bible.service.ts`.
* **BIEN**: Son cajas negras. Si por algún motivo necesitan comunicarse, deben hacerlo a través del Event Emitter de NestJS (simulando una arquitectura orientada a eventos en red).

### Regla 2: Aislamiento de Datos (Bases de Datos Separadas)

Bajo ningún concepto se mezclarán tablas de distintos dominios en la misma base de datos física o lógica.

* **Fase 1 (SQLite)**: Archivos separados (`bible.sqlite` y `software.sqlite`).
* **Fase 2 (PostgreSQL - VPS 2GB)**: Bases de datos lógicas separadas dentro del mismo motor (`db_bible` y `db_software`).

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

## Nota:

Para estructurarlo manteniendo el aislamiento que quieres, lo imaginas así:

1. **Separación Vertical (Módulos / Dominios)**: Son tus proyectos. Crearemos una carpeta principal para la Biblia (`bible`), otra para Software (`software`) y otra para Portafolio (`portfolio`). Esta es la separación que te permite "arrancar" la carpeta en el futuro y llevarla a otro VPS.
2. **Separación Horizontal (Las Capas de NestJS)**: Dentro de cada una de esas carpetas, aplicarás las reglas de NestJS (Controlador, Servicio, Repositorio).

Físicamente, la estructura de tus carpetas dentro de `backend/src/` se verá exactamente así:

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

Para el ecosistema que estamos construyendo (Portafolio, Biblia y Software aislados en 1GB de RAM), la elección oficial debe ser **TypeORM**.

Aquí te explico por qué Prisma, a pesar de ser más moderno, es una mala idea para tu caso, y por qué TypeORM brilla aquí.

### 1. El Problema del Aislamiento (El "Talón de Aquiles" de Prisma)

En nuestro documento de arquitectura, establecimos la Regla 1: Cero Acoplamiento de Código.

* **Cómo funciona Prisma**: Prisma te obliga a tener un único archivo gigante llamado `schema.prisma` en la raíz de tu proyecto donde declaras TODAS las tablas de tu base de datos juntas. Esto rompe inmediatamente nuestro aislamiento. Si quieres separar la Biblia en el futuro, tendrías que "desenredar" ese archivo a mano.
* **Cómo funciona TypeORM**: TypeORM utiliza clases separadas. Puedes crear un archivo `verse.entity.ts` y guardarlo de forma segura dentro de la carpeta `src/bible/`. Si mañana sacas la carpeta de la Biblia a otro VPS, la tabla de la base de datos se va con ella automáticamente.

### 2. Consumo de RAM en tu VPS de 1GB

* **Prisma**: Por debajo, Prisma no está escrito en Node.js, está escrito en Rust. Cada vez que inicias Prisma, este levanta un "motor" (Query Engine) en un proceso separado en tu sistema operativo. Si intentas tener múltiples bases de datos (ej. `bible.sqlite` y `software.sqlite`), Prisma levantará múltiples motores de Rust, devorando la poca RAM que tienes.
* **TypeORM**: Es 100% TypeScript/Node.js. Corre dentro del mismo hilo de tu servidor NestJS. El consumo de memoria extra es casi nulo, ideal para mantener a raya tu VPS de 1GB.

### 3. Sinergia Total con NestJS

NestJS está fuertemente inspirado en Angular y utiliza Decoradores para todo (`@Controller`, `@Injectable`).

TypeORM funciona exactamente igual. Para crear una tabla en tu base de datos, simplemente creas una clase y le pones el decorador `@Entity()`. Esto hace que programar en NestJS con TypeORM se sienta como una experiencia unificada, nativa y muy limpia.

```typescript
// Ejemplo de cómo se verá tu código en TypeORM (Totalmente aislado en src/bible/)
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

Prisma es excelente para proyectos donde todo está mezclado (monolitos tradicionales) y tienes RAM de sobra. Pero para un Monolito Modular donde quieres bases de datos separadas (SQLite) y consumir poca memoria, TypeORM es la herramienta profesional correcta.

---

## Análisis de Stack Tecnológico (Backend y Calidad)

Las herramientas que has mencionado conforman un stack altamente profesional. De hecho, es exactamente el conjunto de tecnologías que elegiría un desarrollador Senior para arrancar un proyecto de este tipo.

A continuación, el análisis de cada una y un pequeño "ajuste fino" para que sean perfectas.

### 1. Comunicación entre Módulos: `@nestjs/event-emitter`

**Veredicto: Excelente elección (La mejor para tu fase actual)**.

* **¿Por qué es profesional?** Cumple a la perfección con la "Regla 1: Cero Acoplamiento". El módulo de la Biblia emite un evento `user.created` y ni siquiera sabe (ni le importa) quién lo escucha. El módulo de Software puede reaccionar a él sin importar nada de la Biblia.
* **Ahorro de RAM**: En arquitecturas gigantes, esto se hace con Redis o RabbitMQ. Pero levantar Redis en tu VPS de 1GB consumiría recursos valiosos. `event-emitter` ocurre en la memoria interna de Node.js (RAM casi cero, latencia cero).
* **Escalabilidad futura**: Si el día de mañana pasas a microservicios reales en varios servidores, solo cambias `event-emitter` por un Message Broker (`RabbitMQ`) y tu lógica de negocio queda intacta.

### 2. WebSockets (Terminal Portafolio): `@nestjs/platform-socket.io`

**Veredicto: Muy buena elección, pero hay una alternativa más ligera**.

* **¿Por qué Socket.io?** Es el estándar de la industria. Es facilísimo de usar, maneja "salas" (rooms) por defecto y si el internet del usuario es inestable, reconecta automáticamente.
* **La alternativa estricta (`@nestjs/platform-ws`)**: Socket.io es un poco pesado porque envía metadatos extra en cada mensaje. Si quieres que tu terminal sea ultraligera y rápida (literalmente como una terminal SSH real) y ahorrar hasta el último megabyte de RAM en el servidor, deberías usar `@nestjs/platform-ws`. Esta librería usa WebSockets puros y crudos.
* **Mi recomendación**: Quédate con `socket.io`. La diferencia de RAM hoy en día es mínima, y la facilidad que te da Socket.io para manejar desconexiones te ahorrará horas de programación.

### 3. Logging: `nestjs-pino` y `pino-pretty`

**Veredicto: Indiscutible (La mejor del mercado)**.

* Como analizamos anteriormente, para un entorno con recursos limitados (1GB a 2GB de RAM), Pino destroza a la competencia (Winston, Morgan) en velocidad y bajo consumo de memoria, al ser 100% asíncrono.
* El uso de `pino-pretty` solo para la terminal de desarrollo (`NODE_ENV=development`) es la práctica estándar para no volverte loco leyendo JSONs crudos mientras programas.

### 4. Calidad: Husky + Pre-commit Hooks (Linting y Typecheck)

**Veredicto: Profesional, pero necesita una optimización crucial (lint-staged)**.

* **El problema**: Si configuras Husky para que ejecute `npm run lint` y `tsc --noEmit` en TODO el monorepo (Portafolio, Biblia, Software y Backend) cada vez que haces un `git commit`, hacer un simple commit te va a tardar entre 15 y 30 segundos. Te vas a desesperar rápidamente.
* **La solución profesional (lint-staged)**: Es una librería que se usa siempre junto a Husky. Lo que hace es analizar qué archivos modificaste exactamente en ese commit, y solo le pasa el linter a esos archivos.
* **El flujo perfecto**: Haces un cambio en un archivo de la Biblia -> Haces `git commit` -> Husky despierta a `lint-staged` -> Revisa solo ese archivo en 0.5 segundos -> Commit exitoso.

### Resumen del Stack Backend

Las herramientas elegidas son robustas, de grado empresarial y respetan totalmente tu restricción de memoria (1GB RAM). El único cambio sugerido es agregar `lint-staged` a tu configuración de Husky para no ralentizar tu flujo de trabajo diario.

---

## El Comando de Oro

```bash
pnpm --filter <nombre-del-proyecto> add <libreria>
```

### El Peligro de instalar en la Raíz (Global)

Si instalas una librería en la raíz del monorepo, todas tus aplicaciones (Portafolio, Biblia, Software) tendrán acceso a ella.

* **El desastre**: Si mañana sacas la carpeta de la Biblia para llevártela a un VPS nuevo, la aplicación explotará. ¿Por qué? Porque la librería se quedó registrada en el `package.json` de la raíz vieja, no en el de la Biblia.

### La Magia de usar `--filter`

Usar `--filter` es exactamente lo mismo que hacer `cd apps/bible`, instalar la librería, y hacer `cd ../..` para salir, pero sin la molestia de navegar por la terminal. Garantiza dos cosas:

1. **Aislamiento Total (Seguridad)**: La librería se anota única y exclusivamente en el `package.json` de la Biblia. El Portafolio no sabrá que existe y no podrá usarla por accidente.
2. **Portabilidad Perfecta (Migración)**: Como el `package.json` de la Biblia tiene su propia lista exacta de librerías, el día que la saques a otro servidor, se irá con todo lo que necesita para funcionar de forma autónoma.

En una frase: El `--filter` es el seguro de vida que garantiza que tus proyectos estén juntos en tu computadora, pero sigan siendo 100% independientes para el futuro.
