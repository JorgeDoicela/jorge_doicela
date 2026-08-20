# Biblia Modular - App Móvil Nativa (Expo / React Native)

Este documento detalla la estructura, rendimiento y arquitectura de la aplicación móvil de la Biblia ubicada en `frontend/mobile/`.

---

## 1. Visión y Arquitectura Móvil

* **Framework:** React Native con Expo (SDK 52+).
* **Navegación:** `expo-router` con estructura modular de pestañas `(tabs)`:
  * `index.tsx`: Pantalla principal de lectura continua.
  * `search.tsx`: Búsqueda de pasajes y concordancia.
  * `bookmarks.tsx`: Favoritos y notas guardadas.
* **Renderizado Virtualizado con FlashList:** Empleo de `@shopify/flash-list` para renderizar miles de versículos con reciclado de celdas a 60 fps constantes.
* **Arquitectura Offline-First:** Descarga de libros completos al almacenamiento del dispositivo con `expo-file-system` y preferencias en `AsyncStorage`.
* **Notificaciones Locales:** `expo-notifications` para el versículo del día 100% offline.

---

## 2. Scripts de Ejecución

Desde la raíz del monorepo (usando `--filter mobile`) o dentro de `frontend/mobile/`:

* **Iniciar Metro Bundler:**
  ```bash
  pnpm --filter mobile start
  ```
* **Ejecutar en Android:**
  ```bash
  pnpm --filter mobile android
  ```
* **Ejecutar en iOS:**
  ```bash
  pnpm --filter mobile ios
  ```
* **Chequeo de Tipos:**
  ```bash
  pnpm --filter mobile typecheck
  ```
