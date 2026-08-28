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

## 3. Microarquitectura de Internacionalización Descentralizada (next-intl + SSR & Cajas Negras)

La internacionalización en el frontend web sigue una arquitectura de **descentralización pura** basada en Server-Side Rendering (SSR) y carga perezosa en memoria:

```text
frontend/web/src/
├── app/
│   ├── (landing)/messages/     # Diccionarios encapsulados exclusivamente para Landing (es.json, en.json)
│   ├── (portfolio)/messages/   # Diccionarios encapsulados exclusivamente para Portafolio (es.json, en.json)
│   ├── (software)/messages/    # Diccionarios encapsulados exclusivamente para Software (es.json, en.json)
│   └── (bible)/messages/       # Diccionarios encapsulados exclusivamente para Biblia (es.json, en.json)
├── i18n/
│   └── request.ts              # Configuración de servidor: importa dinámicamente solo el JSON del subdominio activo
└── middleware.ts               # Detección y persistencia de idioma (?lang= sync a NEXT_LOCALE)
```

### Reglas de Internacionalización:
1. **Aislamiento Total por Subdominio (Cajas Negras):** Cada subproyecto gestiona sus propios archivos `messages/es.json` y `en.json` dentro de su carpeta. Queda prohibido centralizar traducciones en carpetas raíz globales.
2. **Carga Perezosa y Ahorro de Memoria (1 GB RAM):** `request.ts` inspecciona la cabecera `host` de la petición y carga en memoria RAM **únicamente el archivo JSON del subdominio solicitado**, ahorrando recursos en el VPS.
3. **Cero Parpadeos (SSR):** El idioma se resuelve en el servidor por petición, entregando el `<html lang={locale}>` y las etiquetas de texto ya traducidas desde el primer byte.
4. **SEO Internacional Dinámico:** Cada layout de subdominio exporta `generateMetadata()` con títulos y descripciones traducidas, e inyecta etiquetas `alternates.languages` (`hreflang="es-EC"` y `hreflang="en-US"`).
5. **Doble Nivel de i18n (UI vs. Base de Datos):**
   * *Nivel 1 (UX/UI Chrome):* Textos de interfaz y navegación leídos con `useTranslations()` / `getTranslations()`.
   * *Nivel 2 (Datos Dinámicos en SQLite):* Tablas de contenidos (`software.sqlite` y entidades explicativas de `bible.sqlite`) incorporan la columna `language: 'es' | 'en'` y soportan filtrado por query param `?lang=`.

---

## 4. Checklist de Seguridad y Calidad para IAs y Desarrolladores

Antes de confirmar cualquier cambio con Git, se debe garantizar:
* [x] **Comando con filtro:** Toda dependencia se instaló usando `pnpm --filter <proyecto> add <libreria>`.
* [x] **Cero acoplamiento:** No existen importaciones cruzadas entre carpetas de dominios distintos.
* [x] **Tipos duplicados:** Las interfaces de datos están definidas localmente en el subproyecto sin depender de un paquete `@shared`.
* [x] **Sincronización GEO, PWA y LLMs:** Si se agregan, modifican o eliminan proyectos, herramientas o features principales en cualquiera de las 4 plataformas, se actualizó su dossier especializado `public/<proyecto>/llms.txt`, su `manifest.json`, su componente `*JsonLd.tsx` y `sitemap.ts`.
* [x] **Documentación técnica sincronizada:** Se actualizó, amplió o depuró la documentación en `docs/` reflejando con exactitud los cambios realizados en el código.
* [x] **Chequeo de Tipos:** `pnpm -r typecheck` ejecuta con **0 errores** en todos los workspaces.



