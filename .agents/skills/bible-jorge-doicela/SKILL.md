---
name: bible-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de la Biblia Modular (bible.jorgedoicela.com), incluyendo el frontend web Next.js, la app móvil nativa en Expo (frontend/mobile), el backend en NestJS y la base de datos bible.sqlite.
---
# Directrices de Desarrollo: Biblia Modular (bible.jorgedoicela.com)

Esta habilidad define los estándares técnicos, el modelo de datos, la arquitectura web y móvil para el subproyecto de la **Biblia Modular** de Jorge Doicela.

---

## 1. Arquitectura y Aislamiento

* **Subdominio Web:** `bible.jorgedoicela.com` (en desarrollo: `bible.localhost:3001`).
* **App Móvil:** `frontend/mobile/` (React Native / Expo).
* **Frontend Web:** Grupo de rutas `frontend/web/src/app/(bible)/`.
* **Backend:** Módulo modular aislado `backend/src/bible/`.
* **Persistencia:** Base de datos SQLite física independiente `bible.sqlite` conectada mediante `'bibleConnection'` en TypeORM.
* **Aislamiento de Estilos:** Utiliza exclusivamente su propio archivo `(bible)/globals.css` (estética minimalista inspirada en la consola de Vercel y shadcn/ui).
* **Aislamiento de Assets:** Recursos estáticos ubicados en `frontend/web/public/bible/`.

---

## 2. Frontend Web (Next.js 16) y App Móvil (Expo)

### 2.1 Estructura Frontend Web (Feature-Sliced Design)
```text
frontend/web/src/app/(bible)/
├── bible/
│   └── page.tsx            # Interfaz principal de lectura bíblica
├── features/
│   ├── verses/             # Lectura, renderizado y filtrado de versículos
│   │   ├── components/     # VerseList.tsx, VerseItem.tsx
│   │   ├── hooks/          # useVerses.ts
│   │   └── types.ts        # Tipado local Verse
│   ├── books/              # Selector de libros (OT / NT)
│   │   ├── components/     # BookSelector.tsx
│   │   ├── hooks/          # useBooks.ts
│   │   └── types.ts        # Tipado local Book
│   └── translations/       # Selector de traducciones bíblicas
│       ├── components/     # TranslationSelector.tsx
│       └── types.ts        # Tipado local Translation
├── components/             # Header, ModeToggle, QuickFilters
├── globals.css             # Estilos independientes de la Biblia
└── layout.tsx              # Layout independiente
```

### 2.2 App Móvil Nativa (`frontend/mobile` - React Native / Expo)
* **Arquitectura de Rutas:** Desarrollada con `expo-router` con navegación por pestañas (`app/(tabs)/`).
* **Estrategia Offline-First:**
  * Almacenamiento local de libros y capítulos descargados vía `expo-file-system`.
  * Persistencia de notas privadas, historial y versículos favoritos mediante `@react-native-async-storage/async-storage`.
* **Rendimiento de Renderizado:** Uso estricto de `FlashList` (Shopify) o `FlatList` virtualizada para renderizar versículos a 60 fps constantes.
* **Notificaciones Locales:** Versículo del día programado con `expo-notifications` (100% offline, sin dependencia de servidores externos).
* **Gestos y Hápticos:** Swipe horizontal entre capítulos con `react-native-gesture-handler` y vibración sutil con `expo-haptics`.

---

## 3. Backend y Modelo de Datos (NestJS 11)

### 3.1 Entidades de Persistencia (TypeORM en `bible.sqlite`)

1. **`Translation` (`translation.entity.ts`):**
   * `id`: Clave primaria alfanumérica (ej. `'rv1960'`, `'nvi'`).
   * `name`: Nombre descriptivo completo (ej. "Reina Valera 1960").
   * `language`: Código ISO (por defecto `'es'`).
   * `verses`: Relación `OneToMany` hacia `Verse`.

2. **`Book` (`book.entity.ts`):**
   * `id`: Clave primaria con abreviatura del libro (ej. `'gen'`, `'exo'`, `'mat'`).
   * `name`: Nombre completo (ej. "Génesis", "Mateo").
   * `testament`: Clasificación (`'OT'` para Antiguo Testamento, `'NT'` para Nuevo Testamento).
   * `verses`: Relación `OneToMany` hacia `Verse`.

3. **`Verse` (`verse.entity.ts`):**
   * `id`: Entero autoincremental.
   * `book`: Relación `ManyToOne` con `Book` (eager: true, onDelete: 'CASCADE').
   * `translation`: Relación `ManyToOne` con `Translation` (eager: true, onDelete: 'CASCADE').
   * `chapter`: Número de capítulo (entero).
   * `verseNumber`: Número de versículo (entero).
   * `text`: Contenido textual sagrado.
   * **Índice Compuesto Único Obligatorio:** `@Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true })` para garantizar integridad y evitar duplicados.

### 3.2 Catálogo de Endpoints REST (`/bible/*`)
* **Versículos:**
  * `GET /bible/verses`: Lista de versículos con filtros query params opcionales `bookId` y `translationId`.
  * `GET /bible/verses/:id`: Detalle de un versículo individual.
  * `POST /bible/verses`: Crear versículo (`CreateVerseDto`).
  * `PATCH /bible/verses/:id`: Actualizar versículo.
  * `DELETE /bible/verses/:id`: Eliminar versículo.
* **Libros:**
  * `GET /bible/books`: Catálogo completo de libros ordenados.
  * `GET /bible/books/:id`: Detalle de un libro.
  * `POST /bible/books`: Registrar nuevo libro.
  * `DELETE /bible/books/:id`: Eliminar libro.
* **Traducciones:**
  * `GET /bible/translations`: Listar versiones disponibles.
  * `GET /bible/translations/:id`: Detalle de traducción.
  * `POST /bible/translations`: Agregar traducción.
  * `DELETE /bible/translations/:id`: Eliminar traducción.

---

## 4. 📊 Estado de Implementación (Hoja de Ruta)

| Funcionalidad | Estado | Ubicación / Notas |
|---|:---:|---|
| CRUD base de Versículos, Libros y Traducciones | ✅ Completado | `backend/src/bible/` |
| Selector de libros y traducciones en web | ✅ Completado | `BookSelector.tsx`, `TranslationSelector.tsx` |
| Conexión TypeORM con `bible.sqlite` | ✅ Completado | `bibleConnection` configurada |
| Aislamiento de estilos FSD en web | ✅ Completado | `(bible)/globals.css` |
| Paginación y navegación fluida por capítulos | ⏳ Pendiente | Botones Anterior / Siguiente en web |
| Búsqueda Full-Text rápida (FTS5) | ⏳ Pendiente | Barra de búsqueda con operadores y resaltado |
| Motor Interlineal Morfológico (Hebreo, Arameo, Griego) | ⏳ Pendiente | Desglose morfológico, Strong, audio fonético |
| Sistema de Resaltado Semántico y Notas | ⏳ Pendiente | `localStorage` / `IndexedDB` y exportación |
| Red de Referencias Cruzadas (TSK - 340k enlaces) | ⏳ Pendiente | Grafo visual y panel de pasajes paralelos |
| Atlas Bíblico y Rutas Históricas Interactivas | ⏳ Pendiente | Mapas vectoriales, viajes de Pablo, Éxodo |
| Feed de Noticias Arqueológicas y Manuscritos | ⏳ Pendiente | Artículos de descubrimientos en Tierra Santa |
| App móvil nativa completa con Expo Router | ⏳ Pendiente | Estructura en `frontend/mobile/` |
| Notificaciones locales de versículo del día | ⏳ Pendiente | `expo-notifications` en app móvil |
| Importador masivo de versículos (JSON/CSV) | ⏳ Pendiente | Script de siembra / seeder en backend |

---

## 5. ❌ Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Omitir el índice único compuesto en `Verse` | Permite insertar duplicados del mismo versículo para un libro y capítulo. | Asegurar `@Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true })`. |
| Instalar librerías de Expo (`expo-*`) en `frontend/web` | Contamina el bundle web con módulos móviles incompatibles. | Usar `pnpm --filter mobile add <paquete-expo>`. |
| Inyectar repositorios sin `'bibleConnection'` | Falla en runtime o consulta la base de datos equivocada. | Usar `@InjectRepository(Verse, 'bibleConnection')`. |
| Compartir interfaces entre la app móvil y el backend | Acopla la app móvil al monorepo en vez de mantenerla autónoma. | Definir los tipos locales en `frontend/mobile/src/types/`. |
| Traer todos los versículos de la Biblia en una sola petición | Provoca bloqueos de memoria y saturación en 1 GB de RAM. | Filtrar siempre por libro (`bookId`) y capítulo (`chapter`). |

---

## 6. 🔗 Combinar con
* **General:** `general-jorge-doicela` (para el uso estricto de `--filter` y duplicación de interfaces).
* **Infraestructura:** `infraestructura-jorge-doicela` (para el proxy Nginx en `/bible` y despliegues).
