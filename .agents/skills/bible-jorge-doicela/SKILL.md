---
name: bible-jorge-doicela
description: Activa esta skill para tareas de desarrollo, diseño o mantenimiento de la Biblia Modular (bible.jorgedoicela.com), incluyendo el frontend web Next.js (FSD), la app móvil nativa en Expo (frontend/mobile), el backend en NestJS, los 9 motores de estudio exegético, la morfología Strong y la persistencia escalable en bible.sqlite.
---
# Directrices de Desarrollo: Biblia Modular (bible.jorgedoicela.com)

Esta habilidad define los estándares técnicos, el modelo de datos relacional, la arquitectura web (Next.js 16), la app móvil (Expo) y la estrategia de persistencia y escalabilidad para la plataforma de la Biblia Modular.

---

## Documentación Técnica Oficial
* [01_lector_y_estudio_web.md](../../../docs/04-bible/01-frontend-web/01_lector_y_estudio_web.md)
* [02_backend_y_morfologia.md](../../../docs/04-bible/02-backend/01_backend_y_morfologia.md)
* [03_base_datos_y_seeder.md](../../../docs/04-bible/03-base-de-datos/01_base_datos_y_seeder.md)
* [04_app_movil_expo.md](../../../docs/04-bible/04-mobile-expo/01_app_movil_expo.md)

---

## 1. Arquitectura y Aislamiento (Principio de Cajas Negras)

* **Subdominio Web:** `bible.jorgedoicela.com` (en desarrollo: `bible.localhost:3001` o subruta `/bible`).
* **App Móvil:** `frontend/mobile/` (React Native / Expo SDK 52+).
* **Frontend Web:** Grupo de rutas `frontend/web/src/app/(bible)/`.
* **Backend:** Módulo aislado `backend/src/bible/`.
* **Persistencia:** Base de datos SQLite física independiente `bible.sqlite` conectada mediante `'bibleConnection'` en TypeORM.
* **Restricción de Hardware en VPS (1 GB de RAM):** Paginación por capítulo (`limit: 200`), consultas indexadas, cero carga masiva en memoria y sembrado transaccional por lotes (< 20 MB RAM).
* **Aislamiento de Estilos y Assets:** Estilos en `(bible)/globals.css` y assets en `frontend/web/public/bible/`.

---

## 2. Frontend Web: Enrutamiento y Feature-Sliced Design (FSD)

### 2.1 Enrutamiento
1. **Landing Page (`/bible` - `bible/page.tsx`):**
   - Presentación general de la plataforma y corpus textual.
   - Live Preview interactivo con comparación de textos (Salmos 23 en RV1960 vs BHS Hebreo).
   - Vitrina de los 9 motores de exégesis con iconos SVG.
2. **Espacio de Estudio (`/bible/study` - `bible/study/page.tsx`):**
   - Aloja `BibleStudyWorkspace.tsx`.
   - Header unificado en **1 sola línea horizontal** (`BibleHeaderNav.tsx`) con 9 pestañas de estudio.
   - Barra de control de pasaje integrada (`ReaderToolbar.tsx`) con buscador de libros y chips de capítulos.
   - Canvas de lectura editorial (`ContinuousReadingView.tsx`).

### 2.2 Catálogo de los 9 Motores de Estudio Exegético (`(bible)/features/`)
`verses`, `parallel-view`, `textual-diff`, `interlinear`, `literary-analysis`, `lexicons`, `grammar-search`, `atlas`, `timeline`.

---

## 3. App Móvil Nativa (`frontend/mobile` - React Native / Expo)

* **Arquitectura de Rutas:** Desarrollada con `expo-router` con navegación por pestañas (`app/(tabs)/`).
* **Estrategia Offline-First:**
  * Almacenamiento local de libros y capítulos descargados vía `expo-file-system`.
  * Persistencia de notas privadas e historial con `AsyncStorage`.
* **Rendimiento de Renderizado:** Uso estricto de `FlashList` (Shopify) para renderizar versículos a 60 fps constantes.
* **Notificaciones Locales:** Versículo del día con `expo-notifications` (100% offline).

---

## 4. Backend y Modelo de Persistencia (`NestJS 11` & `bible.sqlite`)

### 4.1 Entidades Relacionales (`TypeORM` en `bibleConnection`)
* **`Translation` (`translation.entity.ts`):** `id`, `name`, `abbreviation`, `language`.
* **`Book` (`book.entity.ts`):** `id`, `name`, `abbreviation`, `testament`.
* **`Verse` (`verse.entity.ts`):** `id`, `bookId`, `translationId`, `chapter`, `verseNumber`, `text`.
* **`LexiconEntry` (`lexicon-entry.entity.ts`):** `id`, `strongCode`, `language`, `lemma`, `shortDefinition`, `extendedDefinition`.
* **`MorphologyToken` (`morphology-token.entity.ts`):** `id`, `verseId`, `wordOrder`, `surfaceText`, `strongCode`, `morphologyCode`, `gloss`.

### 4.2 Catálogo de Endpoints REST (`/bible/*`)
* `GET /bible/books` (filtro `?testament=OT|NT`)
* `GET /bible/translations`
* `GET /bible/verses` (filtro `?bookId=GEN&translationId=rv1960&chapter=1&limit=200`)
* `GET /bible/morphology/verse/:verseId`
* `GET /bible/morphology/lexicon/:strong`

---

## 5. Comandos de Operación

```bash
# 1. Sembrado masivo transaccional del corpus bíblico
pnpm --filter backend seed:bible

# 2. Iniciar cliente móvil Expo
pnpm --filter mobile start

# 3. Comprobación estricta de tipos
pnpm -r typecheck
```

---

## 6. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| Omitir el índice único compuesto en Verse o MorphologyToken | Permite insertar duplicados del mismo versículo o palabra. | Asegurar @Index(['translation', 'book', 'chapter', 'verseNumber'], { unique: true }). |
| Hardcodear arrays masivos de 31.000 versículos en código TypeScript | Agota la memoria de tsc y satura la compilación en 1 GB de RAM. | Almacenar en backend/src/bible/corpus/<version>/ y sembrar con seed:bible. |
| Traer toda la Biblia o libros completos sin filtrar por capítulo | Bloquea el event loop de NestJS y satura el ancho de banda. | Filtrar siempre por libro (bookId) y capítulo (chapter). |
| Instalar librerías de Expo (expo-*) en frontend/web | Contamina el bundle web con módulos nativos incompatibles. | Usar pnpm --filter mobile add <paquete-expo>. |
| Compartir interfaces entre la app móvil y el backend | Rompe el principio de autonomía de la aplicación móvil. | Definir los tipos locales en frontend/mobile/src/types/. |
| Inyectar repositorios sin 'bibleConnection' | Falla en runtime o consulta la base de datos equivocada. | Usar @InjectRepository(Verse, 'bibleConnection'). |

---

## 7. Combinar con
* **Infraestructura Global:** `infraestructura-global-jorge-doicela` (para monorepo, pnpm --filter, FSD, proxy Nginx y despliegues).
