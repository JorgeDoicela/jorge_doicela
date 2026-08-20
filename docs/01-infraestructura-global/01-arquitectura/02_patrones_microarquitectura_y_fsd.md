# Patrones de Microarquitectura y Feature-Sliced Design (FSD)

Este documento define los **estándares de codificación y diseño interno** que rigen para cualquier desarrollador o agente de Inteligencia Artificial que trabaje en el código de este repositorio. Cualquier nuevo módulo, endpoint, pantalla o componente debe construirse siguiendo estrictamente estos patrones.

---

## 1. Microarquitectura del Backend: Arquitectura en Capas (NestJS)

Cada dominio dentro de `backend/src/` (`bible`, `software`, `portfolio`, o nuevos dominios futuros) debe operar como un **módulo aislado** dividido internamente en tres capas con Inversión de Control (IoC):

```text
backend/src/<dominio>/
├── <dominio>.module.ts        # Módulo raíz del dominio con TypeOrmModule.forRoot({ name: '<dominio>Connection' })
├── controllers/               # CAPA 1: Presentación REST (HTTP / WebSockets)
│   └── <recurso>.controller.ts
├── services/                  # CAPA 2: Lógica de negocio y reglas
│   └── <recurso>.service.ts
├── entities/                  # CAPA 3: Acceso a datos y esquemas SQLite
│   └── <recurso>.entity.ts
└── dto/                       # Objetos de Transferencia de Datos validados
    └── create-<recurso>.dto.ts
```

### Reglas Inviolables del Backend:
1. **Los Controladores no contienen lógica:** Solo reciben la petición, aplican validaciones de DTO con `class-validator` y delegan inmediatamente al servicio.
2. **Cero `try/catch` manuales para respuestas HTTP:** Los servicios lanzan excepciones estándar de NestJS (`NotFoundException`, `BadRequestException`), las cuales son interceptadas por el `GlobalExceptionFilter` para formatear respuestas JSON uniformes.
3. **Persistencia Aislada por Dominio:** Cada módulo debe interactuar únicamente con su propia conexión física de SQLite nombrada (`<dominio>Connection`). Prohibido cruzar consultas o llaves foráneas hacia tablas de otros dominios.
4. **Cero importaciones entre módulos de distinto dominio:** Si se requiere interacción, se realiza mediante `@nestjs/event-emitter`.

---

## 2. Microarquitectura del Frontend: Feature-Sliced Design (FSD en Next.js)

Cada subproyecto dentro de `frontend/web/src/app/` (`(landing)`, `(portfolio)`, `(bible)`, `(software)`) organiza su código por **funcionalidades de negocio**, no por carpetas técnicas genéricas:

```text
frontend/web/src/app/(subproyecto)/
├── globals.css                # Estilos aislados del subdominio (Tailwind CSS v4)
├── layout.tsx                 # Layout raíz del subdominio (importa ÚNICAMENTE su globals.css)
├── <subproyecto>/
│   └── page.tsx               # Ruta física interna de Next.js
│
├── components/                # Componentes compartidos EXCLUSIVAMENTE dentro del subdominio
│   └── <ComponenteGeneral>.tsx
│
└── features/                  # FEATURE-SLICED DESIGN (FSD)
    └── <nombre-feature>/      # Módulo funcional autocontenido
        ├── components/        # Componentes visuales locales de la feature
        │   └── <FeatureCard>.tsx
        ├── hooks/             # Estado reactivo y llamadas de red
        │   └── use<Feature>.ts
        ├── utils/             # Funciones de parseo o helpers locales
        │   └── <featureParser>.ts
        └── types.ts           # Interfaces y tipos TypeScript locales
```

### Reglas Inviolables del Frontend:
1. **Cero carpetas técnicas globales desordenadas:** Queda prohibido crear carpetas como `/src/components/` o `/src/hooks/` compartidas para todo el monorepo. Todo vive dentro de su respectivo subdominio y feature.
2. **Aislamiento Estricto de Estilos:** Cada subproyecto tiene su propio archivo `globals.css`. Nunca se importan estilos globales en un layout raíz compartido para evitar colisiones de Tailwind CSS.
3. **Cero importaciones cruzadas entre subdominios:** `(bible)` jamás debe importar componentes, hooks o utilidades de `(portfolio)` o `(software)`.
4. **Consumo de Assets:** Toda imagen o video en `public/` debe consumirse con el prefijo de la carpeta del subdominio (`/portfolio/images/...`, `/bible/images/...`).

---

## 3. Checklist de Seguridad y Calidad para IAs y Desarrolladores

Antes de confirmar cualquier cambio con Git, se debe garantizar:
* [x] **Comando con filtro:** Toda dependencia se instaló usando `pnpm --filter <proyecto> add <libreria>`.
* [x] **Cero acoplamiento:** No existen importaciones cruzadas entre carpetas de dominios distintos.
* [x] **Tipos duplicados:** Las interfaces de datos están definidas localmente en el subproyecto sin depender de un paquete `@shared`.
* [x] **Chequeo de Tipos:** `pnpm -r typecheck` ejecuta con **0 errores** en todos los workspaces.
