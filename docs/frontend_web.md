# Frontend Web (Next.js Multi-Tenant/Multi-Domain)

Este proyecto contiene el frontend unificado para el proyecto de Jorge Doicela. Está desarrollado en **Next.js 16 (React 19)** y utiliza una arquitectura basada en subdominios para servir cuatro experiencias web completamente desacopladas desde un único servidor Node.js en el puerto `3001`.

> [!IMPORTANT]
> **Aislamiento Absoluto y Restricción de Recursos:**
> Aunque Landing, Portfolio, Bible y Software residen en el mismo repositorio y corren bajo un único servidor Next.js, son **proyectos totalmente separados y no deben conocerse en nada**. 
> Esta consolidación en un único proceso de frontend responde exclusivamente a que el servidor de despliegue (VPS) cuenta únicamente con **1 GB de RAM**. Ejecutar procesos de Node.js individuales para cada sitio web agotaría rápidamente la memoria del sistema. Por lo tanto, el enrutamiento unificado es una decisión de optimización de infraestructura física, pero lógicamente el desacoplamiento entre las aplicaciones debe ser estricto y total.

---

## 1. Arquitectura de Subdominios y Enrutamiento

Para optimizar al máximo los recursos en el VPS de 1 GB de RAM, se ejecuta un único proceso de Next.js en producción. La separación física de los diferentes sitios web se delega enteramente a nivel de enrutamiento mediante un enrutador interno basado en el host de la petición. Esto evita la sobrecarga de RAM que resultaría de levantar múltiples servidores de Node.js en paralelo, manteniendo el desacoplamiento lógico absoluto.

### Middleware de Enrutamiento (`src/middleware.ts`)

El archivo [middleware.ts](../frontend/web/src/middleware.ts) intercepta las peticiones entrantes y, según el subdominio del host, reescribe de forma transparente la URL interna hacia el grupo de rutas correspondiente:

* **Landing Page** (`jorgedoicela.com` o localhost sin subdominio): Sirve el grupo de rutas `(landing)`.
* **Portfolio** (`portfolio.jorgedoicela.com` o `portfolio.localhost`): Reescribe internamente a `/portfolio` sirviendo el grupo `(portfolio)`.
* **Bible** (`bible.jorgedoicela.com` o `bible.localhost`): Reescribe internamente a `/bible` sirviendo el grupo `(bible)`.
* **Software** (`software.jorgedoicela.com` o `software.localhost`): Reescribe internamente a `/software` sirviendo el grupo `(software)`.

Esto permite que, de cara al usuario, cada subdominio funcione de manera independiente en la barra de direcciones mientras comparten el mismo runtime.

---

## 2. Estructura de Directorios (Aislamiento y FSD)

Bajo el directorio [src/app](../frontend/web/src/app), el código está estructurado en grupos de rutas (carpetas con paréntesis `(nombre)`) que aíslan el alcance de cada subproyecto:

```text
frontend/web/src/
├── middleware.ts           # Interceptor de hosts y reescritura de subdominios
└── app/
    ├── (landing)/          # Landing Page Principal (jorgedoicela.com)
    │   ├── globals.css     # Estilos independientes de la landing
    │   ├── layout.tsx
    │   └── page.tsx
    │
    ├── (portfolio)/        # Portafolio Interactivo (portfolio.jorgedoicela.com)
    │   ├── portfolio/
    │   │   └── page.tsx    # Ruta física interna de Next.js
    │   ├── features/       # Funcionalidades del portafolio (FSD)
    │   │   ├── terminal/   # Terminal SSH simulada (Socket.io)
    │   │   └── contact/    # Formulario de contacto
    │   ├── components/     # Componentes compartidos del portafolio
    │   ├── globals.css     # Estilos independientes del portafolio
    │   └── layout.tsx
    │
    ├── (bible)/            # Biblia Modular (bible.jorgedoicela.com)
    │   ├── bible/
    │   │   └── page.tsx    # Ruta física interna de Next.js
    │   ├── features/       # Funcionalidades de la Biblia (FSD)
    │   │   ├── books/      # Selector de libros bíblicos
    │   │   ├── translations/# Selector de traducciones
    │   │   └── verses/     # Lectura y filtrado de versículos
    │   ├── components/     # Componentes compartidos de la Biblia
    │   ├── globals.css     # Estilos independientes de la Biblia
    │   └── layout.tsx
    │
    └── (software)/         # Proyectos de Software (software.jorgedoicela.com)
        ├── software/
        │   └── page.tsx    # Ruta física interna de Next.js
        ├── features/       # Funcionalidades del Hub de Software (FSD)
        │   ├── articles/   # Contenidos (Noticias, Blog, IA, Ciberseguridad, Tutoriales)
        │   ├── forum/      # Foros de discusión comunitarios
        │   └── projects/   # Catálogo y detalle de proyectos showcase
        ├── globals.css     # Estilos independientes de software
        └── layout.tsx
```

### Reglas de Diseño Frontend:
1. **Aislamiento de Estilos**: Cada grupo de rutas tiene su propio archivo `globals.css`. Los layouts correspondientes importan únicamente su archivo de estilos local, lo que previene que los estilos de un subproyecto afecten a otro.
2. **Feature-Sliced Design (FSD)**: El código dentro de cada proyecto se agrupa en torno a su contexto funcional (`features/`). Una feature agrupa su interfaz de usuario (`components/`), lógica de datos (`hooks/`) y tipado (`types.ts`), facilitando enormemente la extracción individual del subproyecto en el futuro.
3. **Cero Importaciones Cruzadas**: Está prohibido importar componentes o utilidades de un subproyecto (ej: `(bible)`) dentro de otro (ej: `(portfolio)`).

---

## 3. Integración con el Backend

El frontend se conecta al backend monolítico modular NestJS (`http://localhost:3000` en desarrollo) resolviendo las siguientes interacciones de red a través de hooks y flujos dedicados por subproyecto:

### Subproyecto Biblia (`bible`)
* **Versículos**: Consumidos mediante el hook [useVerses.ts](../frontend/web/src/app/(bible)/features/verses/hooks/useVerses.ts), el cual realiza una petición `GET` a `${NEXT_PUBLIC_API_URL}/bible/verses` enviando parámetros opcionales de filtro `bookId` y `translationId`.
* **Libros**: Consumidos mediante el hook [useBooks.ts](../frontend/web/src/app/(bible)/features/books/hooks/useBooks.ts) a través de una petición `GET` a `${NEXT_PUBLIC_API_URL}/bible/books`.
* **Traducciones**: Consumidas en el selector de traducción del header a través de una petición `GET` a `${NEXT_PUBLIC_API_URL}/bible/translations`.

### Subproyecto Software (`software`)
* **Catálogo de Proyectos**: Consumido mediante el hook [useProjects.ts](../frontend/web/src/app/(software)/features/projects/hooks/useProjects.ts) que realiza una petición `GET` a `${NEXT_PUBLIC_API_URL}/software/projects`.

### Subproyecto Portafolio (`portfolio`)
* **Formulario de Contacto**: Envía el payload con la información del formulario mediante una petición `POST` a `${NEXT_PUBLIC_API_URL}/portfolio/contact`.
* **Terminal Virtual SSH**: Mantiene una conexión WebSocket permanente de baja latencia con el backend en `${NEXT_PUBLIC_API_URL}/terminal` (puerto 3000) a través del hook [useTerminalSocket.ts](../frontend/web/src/app/(portfolio)/features/terminal/hooks/useTerminalSocket.ts), emitiendo el evento `'execute-command'` y escuchando las respuestas bajo el evento `'terminal-output'`.

---

## 4. Gestión de Assets Estáticos Aislados

Para mantener el aislamiento lógico absoluto y facilitar una futura migración independiente, los recursos estáticos (imágenes y videos) se organizan en subdirectorios específicos dentro del directorio unificado `public/` en la raíz del frontend:

* **Landing**: `public/landing/`
* **Portfolio**: `public/portfolio/`
* **Biblia**: `public/bible/`
* **Software**: `public/software/`

Dado que el middleware (`src/middleware.ts`) excluye de la reescritura de subdominios cualquier petición con punto (`.`), todas las solicitudes a extensiones estáticas se dirigen directamente a la carpeta `public/` global de Next.js.

### Regla de Oro para el Consumo:
Para evitar colisiones entre proyectos en el runtime compartido, toda referencia a imágenes o videos debe prefijarse explícitamente con la subcarpeta del proyecto:
* `<img src="/portfolio/images/profile.jpg" />`
* `<video src="/portfolio/videos/demo.mp4" />`
* `<img src="/bible/cover.png" />`

---

## 5. Desarrollo Local y Scripts

### Subdominios de Desarrollo
Para probar el comportamiento de los subdominios localmente sin necesidad de configurar un servidor DNS local, puedes usar el puerto local con la sintaxis de localhost:
* **Landing**: `http://localhost:3001`
* **Portfolio**: `http://portfolio.localhost:3001`
* **Biblia**: `http://bible.localhost:3001`
* **Software**: `http://software.localhost:3001`

*(Nota: En desarrollo local, la landing page detecta automáticamente si el host incluye `localhost` y mapea los enlaces internos usando el puerto correspondiente de Next.js).*

### Scripts Disponibles
Ejecuta los siguientes comandos desde la raíz del monorepo (usando `--filter web`) o dentro del directorio `frontend/web`:

* **Iniciar Servidor de Desarrollo**:
  ```bash
  pnpm dev
  ```
  *(Inicia Next.js en el puerto 3001 por defecto).*

* **Construir para Producción**:
  ```bash
  pnpm build
  ```

* **Auditar Tipos de TypeScript**:
  ```bash
  pnpm typecheck
  ```

* **Linter de Código**:
  ```bash
  pnpm lint
  ```

* **Dar Formato al Código**:
  ```bash
  pnpm format
  ```
