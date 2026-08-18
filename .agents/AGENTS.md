# Reglas Maestras Inviolables del Repositorio Jorge Doicela

Este archivo se carga de forma automática en todas las interacciones dentro de este espacio de trabajo. Todo agente o desarrollador debe respetar de forma estricta las siguientes 5 reglas de oro:

---

## 1. Justificación de Infraestructura y Runtimes Consolidados
* El servidor VPS de producción en AWS Lightsail está limitado a **1 GB de RAM**.
* Por este motivo físico exclusivo, el backend corre consolidado en un solo proceso NestJS (puerto 3000) y el frontend web corre consolidado en un solo proceso Next.js (puerto 3001) mediante `middleware.ts` para resolver subdominios.
* **Principio de Cajas Negras:** A pesar de compartir procesos físicos, las 4 aplicaciones (`landing`, `portfolio`, `bible`, `software`) son **proyectos 100% aislados e independientes**. Nunca deben acoplarse ni depender entre sí.

---

## 2. Cero Importaciones Cruzadas (Aislamiento de Dominio)
* **Prohibido:** Importar código, componentes, hooks, entidades o servicios entre dominios (ej. `bible` no puede importar nada de `software` o `portfolio`).
* **Comunicación Interna:** Si se requiere interacción inter-módulos en NestJS, se debe hacer de forma desacoplada mediante `@nestjs/event-emitter`.

---

## 3. El Comando de Oro: Gestión de Dependencias con `--filter`
* **Nunca** instales paquetes en la raíz del monorepo si pertenecen a un subproyecto específico.
* Usa siempre el comando con filtro:
  ```bash
  pnpm --filter backend add <paquete>   # Dependencias del Backend
  pnpm --filter web add <paquete>       # Dependencias del Frontend Web
  pnpm --filter mobile add <paquete>    # Dependencias de la App Móvil
  ```

---

## 4. Aislamiento de Tipos y Persistencia
* **Cero paquetes `@shared`:** Cada subproyecto define sus propias interfaces TypeScript en sus carpetas locales.
* **Persistencia Aislada:** Cada módulo del backend se conecta a su propia base de datos SQLite física independiente (`bible.sqlite`, `software.sqlite`, `portfolio.sqlite`).

---

## 5. Skills Especializadas Disponibles en `.agents/skills/`
Activa la skill adecuada según el contexto de tu tarea:
1. `general-jorge-doicela`: Reglas maestras de monorepo, pnpm workspaces y calidad.
2. `infraestructura-jorge-doicela`: Despliegue en AWS Lightsail (Debian 13), Cloudflare mTLS, Nginx, PM2 y CI/CD.
3. `landing-jorge-doicela`: Landing page principal (`jorgedoicela.com`), 100% cliente Next.js, i18n, PWA, SEO.
4. `portfolio-jorge-doicela`: Portafolio (`portfolio.*`), terminal SSH por WebSockets y formulario de contacto.
5. `bible-jorge-doicela`: Biblia (`bible.*`), modelo relacional, endpoints REST y app móvil Expo (`frontend/mobile`).
6. `software-jorge-doicela`: Software Hub (`software.*`), 7 categorías temáticas, foros y catálogo de proyectos.
