# Ecosistema del Monorepo: Portafolio, Biblia y Software

Este repositorio contiene la arquitectura modular para el desarrollo del Portafolio, Biblia y Software de Jorge Doicela. Está diseñado como un monorepo puro que prioriza el desacoplamiento total de sus componentes, con miras a un despliegue optimizado en un entorno de bajos recursos (VPS de 1 GB de RAM) y preparado para una futura transición a servicios independientes.

---

## Estructura del Monorepo

El monorepo está configurado utilizando los workspaces de pnpm. Cuenta con un backend modular centralizado y tres frontends independientes desarrollados en Next.js:

* **backend**: Servidor único NestJS programado como un monolito modular.
* **apps/portfolio**: Frontend Next.js para la terminal de comandos interactiva.
* **apps/bible**: Frontend Next.js para la consulta y lectura de la Biblia.
* **apps/software**: Frontend Next.js para la galería de proyectos de software.

---

## Reglas de la Arquitectura

Para asegurar que cada módulo sea extraíble a su propio servidor de forma independiente en el futuro, se aplican de forma estricta las siguientes reglas de oro:

1. **Aislamiento de Código (Cero Acoplamiento)**: No existen importaciones cruzadas de código entre módulos. La comunicación asíncrona entre ellos se realiza a través de eventos internos usando `@nestjs/event-emitter`.
2. **Aislamiento de Datos**: Cada módulo interactúa únicamente con su propia base de datos física. En desarrollo, el backend utiliza bases de datos SQLite independientes (`bible.sqlite` y `software.sqlite`).
3. **Interfaces Duplicadas**: No se comparten paquetes de tipado comunes entre backend y frontend. Las interfaces de datos se definen manualmente y por duplicado en cada proyecto para mantener su portabilidad absoluta.
4. **Feature-Sliced Design (FSD)**: En los frontends, el código se agrupa por contexto funcional (funcionalidades) en lugar de separar por tipo de archivo técnico.

---

## Stack Tecnológico

### Backend
* **NestJS**: Framework backend estructurado con inyección de dependencias.
* **TypeORM**: ORM para la interacción con bases de datos SQL (SQLite con driver `better-sqlite3` en desarrollo).
* **nestjs-pino**: Logging asíncrono y ligero en formato JSON.
* **Global Exception Filters**: Filtro centralizado para la captura y formateo de errores en respuestas JSON uniformes.
* **Socket.io**: WebSockets para la comunicación interactiva de la terminal.

### Frontend
* **Next.js y React**: Framework frontend con renderizado del lado del servidor.
* **TailwindCSS**: Estilos utilitarios rápidos y eficientes.
* **socket.io-client**: Cliente de conexión de WebSockets para la terminal SSH virtual.

---

## Cómo Empezar

### Requisitos Previos
* Node.js (versión 18 o superior)
* pnpm (versión 10 o superior)

### Instalación de Dependencias
Instala todas las dependencias del monorepo desde la raíz ejecutando:
```bash
pnpm install
```

### Ejecutar en Desarrollo
Inicia todas las aplicaciones (backend y los tres frontends) en paralelo con un único comando:
```bash
pnpm dev
```

Este comando levantará los servidores en los siguientes puertos:
* **Backend (NestJS)**: `http://localhost:3000`
* **Portfolio App (Next.js)**: `http://localhost:3001`
* **Bible App (Next.js)**: `http://localhost:3002`
* **Software App (Next.js)**: `http://localhost:3003`

### Control de Calidad y Estandarización
El repositorio tiene configurado un hook de pre-commit utilizando Husky y lint-staged. Cada vez que confirmes cambios con Git, se ejecutarán de forma automática las siguientes verificaciones:

* **Formateo y Estilo**: `eslint --fix` ejecutado localmente solo en los archivos staged correspondientes a cada subproyecto.
* **Comprobación de Tipos**: `tsc --noEmit` en todo el monorepo.

Si deseas ejecutar las pruebas de calidad de forma manual en todo el espacio de trabajo, puedes usar los siguientes comandos desde la raíz:

* **Linter**: `pnpm run lint`
* **Chequeo de Tipos**: `pnpm run typecheck`
* **Formateador**: `pnpm run format`
