# Portafolio, Biblia y Software

Este repositorio contiene la arquitectura modular para el desarrollo del Portafolio, Biblia y Software de Jorge Doicela. Está diseñado como un monorepo puro que prioriza el desacoplamiento total de sus componentes, con miras a un despliegue optimizado en un entorno de bajos recursos (VPS de 1 GB de RAM) y preparado para una futura transición a servicios independientes.

> [!IMPORTANT]
> **Justificación de Infraestructura y Aislamiento Estricto:**
> Las aplicaciones (Landing, Portfolio, Biblia, Software) son **proyectos totalmente separados que no deben conocerse en nada**. 
> La única razón por la que el backend NestJS corre consolidado en un solo proceso (puerto 3000) y el frontend Next.js corre unificado (puerto 3001) es porque el servidor de producción (VPS) está limitado a **1 GB de RAM**. Correr procesos individuales de Node.js para cada aplicación consumiría la RAM por completo, provocando inestabilidad. Se agrupan bajo el mismo runtime por optimización de recursos físicos, pero el aislamiento lógico, de estilos y de datos se mantiene absoluto para permitir su separación instantánea en el futuro.

---

## Estructura del Monorepo

El monorepo está configurado utilizando los workspaces de pnpm. Cuenta con un backend modular centralizado y un frontend Next.js unificado en el puerto 3001 que administra los subdominios de forma aislada:

* **[backend](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/backend)**: Servidor único NestJS programado como un monolito modular (puerto 3000). Ver [backend.md](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/docs/backend.md).
* **[frontend/web](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/frontend/web)**: Único servidor Next.js que ejecuta los cuatro frontends de forma desacoplada y los resuelve mediante subdominios (puerto 3001). Ver [frontend_web.md](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/docs/frontend_web.md):
  * **Landing Page**: `jorgedoicela.com`
  * **Portfolio (Terminal)**: `portfolio.jorgedoicela.com`
  * **Bible (Biblia)**: `bible.jorgedoicela.com`
  * **Software (Proyectos)**: `software.jorgedoicela.com`
* **[frontend/mobile](file:///c:/Users/jorge/Desktop/Proyectos/jorge_doicela/frontend/mobile)**: Cliente móvil independiente en React Native / Expo.

---

## Reglas de la Arquitectura

Para asegurar que cada módulo sea extraíble a su propio servidor de forma independiente en el futuro (desacoplamiento total), se aplican de forma estricta las siguientes reglas de oro, teniendo en cuenta que la unificación de los procesos físicos en un solo runtime de NestJS y Next.js responde exclusivamente a la restricción de **1 GB de RAM** en el VPS:

1. **Aislamiento de Código (Cero Acoplamiento)**: No existen importaciones cruzadas de código entre módulos ni entre subproyectos del frontend. Cada aplicación opera como una caja negra; en el backend, si se requiere comunicación interna, se simula de forma orientada a eventos usando `@nestjs/event-emitter`.
2. **Aislamiento de Datos (Persistencia Independiente)**: Cada módulo interactúa únicamente con su propia base de datos física. En desarrollo, el backend utiliza archivos de base de datos SQLite separados (`bible.sqlite`, `software.sqlite` y `portfolio.sqlite`) para asegurar que sigan siendo proyectos independientes a nivel de almacenamiento.
3. **Interfaces Duplicadas**: No se comparten paquetes de tipado comunes entre backend y frontend. Las interfaces de datos se definen manualmente y por duplicado en cada proyecto para mantener su portabilidad absoluta.
4. **Feature-Sliced Design (FSD)**: En los frontends, el código se agrupa por contexto funcional (funcionalidades) en lugar de separar por tipo de archivo técnico, aislando interfaces, lógica (hooks) y estilos por funcionalidad.
5. **Aislamiento de Estilos en Frontend**: Cada subproyecto de Next.js cuenta con su propio archivo `globals.css` independiente, evitando la colisión de clases de estilos globales.

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

### Clonar el Proyecto
Clona el repositorio en tu máquina local e ingresa al directorio del proyecto:
```bash
git clone https://github.com/JorgeDoicela/jorge_doicela.git
cd jorge_doicela
```

### Requisitos Previos por Plataforma

#### Windows
1. **Node.js**: Descarga e instala la versión LTS (18 o superior) desde [nodejs.org](https://nodejs.org/).
2. **pnpm**: Instálalo ejecutando en tu terminal (CMD o PowerShell):
   ```bash
   npm install -g pnpm
   ```
3. **Git**: Asegúrate de tener Git instalado y disponible en tu terminal.

#### Debian
1. **Node.js**: Instala la versión 18 o superior. Se recomienda usar un manejador de versiones (como `nvm` o `fnm`).
2. **Herramientas de Compilación**: Dado que el backend utiliza `better-sqlite3` (que requiere compilar extensiones nativas C++), instala las herramientas de compilación esenciales:
   ```bash
   sudo apt update
   sudo apt install -y build-essential python3 g++ make
   ```
3. **pnpm**: Instálalo globalmente:
   ```bash
   npm install -g pnpm
   ```

#### Arch Linux
1. **Node.js**: Instala Node.js y npm desde los repositorios oficiales:
   ```bash
   sudo pacman -Syu nodejs npm
   ```
2. **Herramientas de Compilación**: Instala el grupo de herramientas de desarrollo `base-devel` y `python` para la compilación de módulos nativos:
   ```bash
   sudo pacman -S base-devel python
   ```
3. **pnpm**: Instálalo globalmente:
   ```bash
   npm install -g pnpm
   ```

### Instalación de Dependencias
Instala todas las dependencias del monorepo desde la raíz ejecutando:
```bash
pnpm install
```

#### El Comando de Oro: Agregar Dependencias Específicas
Para agregar una nueva librería a un proyecto específico sin ensuciar la raíz global (manteniendo el aislamiento y la portabilidad), utiliza:
```bash
pnpm --filter <nombre-del-proyecto> add <libreria>
```

* **El peligro de instalar en la raíz (Global)**: Si instalas una librería en la raíz del monorepo, todas tus aplicaciones tendrán acceso a ella. Si en el futuro extraes la carpeta de un proyecto (ej. `bible`) a un VPS nuevo, la aplicación fallará porque la librería se quedó registrada en el `package.json` de la raíz vieja, no en el del subproyecto.
* **La ventaja de `--filter`**: Garantiza aislamiento (se registra únicamente en el subproyecto) y portabilidad perfecta (cada aplicación viaja con su propia lista exacta de librerías para funcionar de forma autónoma).

### Ejecutar en Desarrollo
Inicia el backend y el frontend en paralelo con un único comando:
```bash
pnpm dev
```

Este comando levantará los servidores en los siguientes puertos:
* **Backend (NestJS)**: `http://localhost:3000`
* **Frontend Next.js (SSR)**: `http://localhost:3001`
  * Subdominios de prueba (resueltos localmente):
    * `http://portfolio.localhost:3001`
    * `http://bible.localhost:3001`
    * `http://software.localhost:3001`
    * `http://localhost:3001` (Landing)

### Control de Calidad y Estandarización
El repositorio tiene configurado un hook de pre-commit utilizando Husky y lint-staged. Cada vez que confirmes cambios con Git, se ejecutarán de forma automática las siguientes verificaciones:

* **Formateo y Estilo**: `eslint --fix` ejecutado localmente solo en los archivos staged correspondientes a cada subproyecto.
* **Comprobación de Tipos**: `tsc --noEmit` en todo el monorepo.

Si deseas ejecutar las pruebas de calidad de forma manual en todo el espacio de trabajo, puedes usar los siguientes comandos desde la raíz:

* **Linter**: `pnpm run lint`
* **Chequeo de Tipos**: `pnpm run typecheck`
* **Formateador**: `pnpm run format`
