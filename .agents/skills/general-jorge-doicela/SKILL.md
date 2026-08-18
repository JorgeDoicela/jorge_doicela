---
name: general-jorge-doicela
description: Activa esta skill para cualquier tarea dentro del repositorio jorge_doicela. Contiene las reglas maestras de arquitectura monorepo pnpm, aislamiento estricto de dominio por restricción de 1 GB de RAM, duplicación de contratos, comando de oro --filter, Feature-Sliced Design, estándar de respuestas API y control de calidad.
---
# Reglas Maestras de Arquitectura y Monorepo: Proyecto Jorge Doicela

Esta habilidad define los principios fundamentales e inviolables para el desarrollo, modificación, auditoría y mantenimiento del ecosistema completo **Jorge Doicela** (`jorgedoicela.com`, `portfolio.*`, `bible.*`, `software.*`).

---

## 1. Justificación de Hardware y Filosofía de Aislamiento

* **Restricción Física de Hardware:** El entorno de producción corre sobre un VPS de **1 GB de RAM** (AWS Lightsail). Por esta razón física exclusiva:
  * El **backend** corre consolidado en un solo proceso NestJS (puerto `3000`).
  * El **frontend web** corre consolidado en un solo proceso Next.js (puerto `3001`) gestionando subdominios mediante `middleware.ts`.
* **Aislamiento Lógico Total (Cajas Negras):** A pesar de compartir runtimes físicos en producción para ahorrar memoria RAM, las cuatro aplicaciones (`landing`, `portfolio`, `bible`, `software`) son proyectos 100% desacoplados. No deben conocerse, no deben importar código entre sí y no deben compartir bases de datos.
* **Diseño para la Extracción Inmediata:** Cualquier módulo del backend (`backend/src/<dominio>`) o grupo de rutas del frontend (`frontend/web/src/app/(<dominio>)`) debe poder extraerse a un repositorio o servidor independiente en el futuro y funcionar de inmediato sin refactorizaciones.

---

## 2. Gestión de Dependencias y el Comando de Oro

### Prohibición de Dependencias Globales Huérfanas
* **Nunca** instales paquetes de un subproyecto en el `package.json` de la raíz del monorepo.
* Si una librería se instala en la raíz, funcionará en el entorno local pero fallará al extraer el subproyecto a otro servidor porque no viajará registrada en su propio `package.json`.

### El Comando de Oro
Para agregar cualquier paquete, utiliza siempre la directiva `--filter` de `pnpm`:
```bash
# Backend NestJS:
pnpm --filter backend add <paquete>
pnpm --filter backend add -D <paquete>

# Frontend Web Next.js:
pnpm --filter web add <paquete>
pnpm --filter web add -D <paquete>

# App Móvil Expo:
pnpm --filter mobile add <paquete>
pnpm --filter mobile add -D <paquete>
```

### Manejo de Dependencias Nativas C++ (`better-sqlite3`)
* El backend utiliza `better-sqlite3` para maximizar el rendimiento sobre SQLite en 1 GB de RAM.
* Requiere herramientas de compilación C++ nativas (`build-essential`, `python3`, `g++`, `make`). Al desplegar o preparar entornos Linux (Debian 13 / Arch), asegúrate de que estas herramientas estén instaladas antes de ejecutar `pnpm install`.

---

## 3. Aislamiento de Tipos y Contratos (Duplicación Obligatoria)

* **Cero Paquetes `@shared`:** Está estrictamente prohibido crear carpetas o paquetes compartidos de interfaces entre frontend y backend.
* **Duplicación de Interfaces:** 
  * En el frontend: Cada subproyecto define sus tipos locales en `features/<funcionalidad>/types.ts` (ej. `(bible)/features/verses/types.ts`).
  * En el backend: Cada módulo define sus propios DTOs y Entidades (ej. `backend/src/bible/dto/create-verse.dto.ts`).
  * En la app móvil: Cada pantalla define sus tipos en `frontend/mobile/src/types/`.
* **Justificación:** Si se extrae la Biblia o el Software Hub a un repositorio independiente, viajará con su propio contrato de tipos completo sin dependencias rotas.

---

## 4. Estándar de Comunicación y Formato de Respuestas API

### Formato de Respuestas Exitosas (TransformInterceptor)
El backend cuenta con un `TransformInterceptor` global en `src/common/interceptors/transform.interceptor.ts` que estandariza todas las respuestas HTTP:
```json
{
  "success": true,
  "data": { ... }
}
```
* **En el Frontend:** Los hooks de React (`useVerses`, `useProjects`, `useArticles`) deben extraer siempre los datos desde `response.data` (o `response.data.data` al usar Axios/Fetch con envoltorio).

### Manejo de Errores Global (GlobalExceptionFilter)
* El backend utiliza `GlobalExceptionFilter` en `src/common/filters/http-exception.filter.ts`.
* **Prohibido:** Usar bloques `try/catch` en los controladores para retornar errores HTTP manuales.
* **Obligatorio:** Lanzar excepciones nativas de NestJS (`NotFoundException`, `BadRequestException`, `ForbiddenException`). El filtro global formateará automáticamente la respuesta con código, mensaje y marca de tiempo.

### Comunicación Inter-Módulos en Backend
* **Prohibido:** Importar servicios o entidades de un dominio dentro de otro (ej. `BibleService` importando `SoftwareEntity`).
* **Permitido:** Si se requiere interacción asíncrona entre módulos, se realiza exclusivamente a través de eventos con `@nestjs/event-emitter`.

---

## 5. Feature-Sliced Design (FSD) en el Frontend

Para asegurar la portabilidad y organización en `frontend/web/src/app/`, el código se organiza por funcionalidad:

```text
src/app/(<dominio>)/
├── <dominio>/
│   └── page.tsx            # Página principal servida tras la reescritura del subdominio
├── features/               # Lógica y componentes agrupados por contexto
│   └── <feature_name>/
│       ├── components/     # Componentes visuales exclusivos de esta feature
│       ├── hooks/          # Hooks con llamadas a red y estado local
│       └── types.ts        # Tipado TypeScript exclusivo de esta feature
├── components/             # Componentes compartidos dentro del mismo dominio (Header, Nav, etc.)
├── globals.css             # Estilos CSS aislados de este subproyecto
└── layout.tsx              # Layout que importa exclusivamente su globals.css
```

---

## 6. Variables de Entorno y Puertos por Entorno

| Variable | Descripción | Entorno Local | Producción (VPS) |
|---|---|---|---|
| `PORT` (Backend) | Puerto del servidor NestJS | `3000` | `3000` |
| `PORT` (Frontend Web) | Puerto del servidor Next.js | `3001` | `3001` |
| `NEXT_PUBLIC_API_URL` | URL base de la API REST | `http://localhost:3000` | `https://jorgedoicela.com` |
| `DATABASE_PORTFOLIO_PATH` | Ruta de SQLite Portfolio | `./portfolio.sqlite` | `/var/data/portfolio.sqlite` |
| `DATABASE_BIBLE_PATH` | Ruta de SQLite Bible | `./bible.sqlite` | `/var/data/bible.sqlite` |
| `DATABASE_SOFTWARE_PATH` | Ruta de SQLite Software | `./software.sqlite` | `/var/data/software.sqlite` |

---

## 7. Control de Calidad y Checklist Pre-Entrega

Antes de finalizar cualquier tarea, el agente debe verificar que se cumplan las siguientes validaciones:

```bash
# 1. Comprobación estricta de tipos en todo el monorepo (0 errores)
pnpm run typecheck

# 2. Validación de formato y estilo con ESLint
pnpm run lint

# 3. Formateo de código con Prettier
pnpm run format

# 4. Verificación de compilación limpia para producción
pnpm run build
```

---

## 8. ❌ Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| `pnpm add <paquete>` en la raíz | Contamina el root y rompe la portabilidad del subproyecto al extraerlo. | `pnpm --filter <workspace> add <paquete>` |
| `import { SoftwareService } from '../software/...'` dentro de `bible.service.ts` | Rompe el principio de cajas negras y acopla dominios distintos. | Usar `@nestjs/event-emitter` para comunicación basada en eventos. |
| Crear una carpeta compartida `@shared` con interfaces | Acopla el frontend y el backend a un paquete monorepo dependiente. | Duplicar la interfaz en `features/<name>/types.ts` y en los DTOs/Entities. |
| Importar componentes de `(bible)` en `(portfolio)` | Contamina los estilos y la lógica de subproyectos distintos. | Mantener los componentes aislados en la carpeta de su propio dominio. |
| Poner bloques `try/catch` para devolver errores en controladores | Duplica código y rompe el formateo centralizado del filtro global. | Lanzar excepciones nativas de NestJS (`NotFoundException`, etc.). |
| Lanzar `next build` o `nest build` en el VPS de producción | Satura la CPU y consume la RAM de 1 GB tumbando los servicios. | Compilar en GitHub Actions y subir únicamente los artefactos listos. |

---

## 9. 🔗 Combinar con Skills Específicas

Según el área donde vayas a trabajar, combina esta skill general con:
* **Portafolio:** `portfolio-jorge-doicela`
* **Biblia (Web y Móvil):** `bible-jorge-doicela`
* **Software Hub:** `software-jorge-doicela`
* **Landing Page:** `landing-jorge-doicela`
* **Infraestructura y Despliegue:** `infraestructura-jorge-doicela`
