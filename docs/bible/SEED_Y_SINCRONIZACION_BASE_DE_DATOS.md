# Guía de Sembrado y Sincronización de Base de Datos: Biblia Modular

Documentación técnica sobre el sembrado inicial, sincronización transaccional del corpus bíblico y aprovisionamiento del catálogo canónico en `bible.sqlite` para nuevas estaciones de trabajo de desarrollo y el servidor de producción.

---

## 1. Contexto y Arquitectura de Datos

La aplicación de la **Biblia Modular** (`bible.jorgedoicela.com`) utiliza una base de datos local SQLite física (`bible.sqlite`), gestionada por `better-sqlite3` en modo WAL (`Write-Ahead Logging`) y TypeORM en NestJS.

### Catálogo Canónico vs. Corpus de Versículos
* **Catálogo Canónico (66 libros):** 39 libros del Antiguo Testamento (`OT`) y 27 libros del Nuevo Testamento (`NT`). El seeder garantiza que la tabla `books` contenga siempre los 66 libros con sus abreviaciones canónicas (ej. `GEN`, `EXO`, `MAT`, `ROM`, `APO`).
* **Corpus de Textos Bíblicos:** Archivos JSON ubicados en `backend/src/bible/corpus/<traduccion>/` que contienen capítulos y versículos indexados por lote (Batch Chunks) para las traducciones disponibles (RV1960, LBLA, NVI, KJV, BHS, LXX, JER).

---

## 2. Aprovisionamiento en una Nueva PC de Desarrollo

Cuando clones el repositorio en una nueva máquina de desarrollo, sigue estos pasos para inicializar el backend, la base de datos y el frontend:

### Paso 1: Instalar dependencias del monorepo
```powershell
pnpm install
```

### Paso 2: Ejecutar el Seeder de la Biblia
Este comando creará automáticamente la base de datos `backend/bible.sqlite` (si no existe), sembrará los 66 libros canónicos y procesará todos los versículos del corpus:
```powershell
pnpm --filter backend seed:bible
```

### Paso 3: Iniciar el entorno de desarrollo
En la raíz del proyecto:
```powershell
pnpm dev
```
O en terminales separadas si prefieres correr backend y frontend de forma aislada:
```powershell
# Terminal 1 (Backend NestJS en puerto 3000)
pnpm --filter backend start:dev

# Terminal 2 (Frontend Next.js en puerto 3001)
pnpm --filter web dev
```

---

## 3. Comportamiento y Resiliencia en el Frontend

El frontend de Next.js (`frontend/web/src/app/(bible)/features/books/hooks/useBooks.ts`) opera con una arquitectura tolerante a fallos:

1. **Con Backend Activo (`localhost:3000`):**
   * Consume `GET /bible/books` y renderiza el catálogo real persistido en la base de datos SQLite.
2. **Si el Backend está Detenido o Inaccesible:**
   * El hook captura el fallo de red silenciosamente y activa el catálogo canónico estático en memoria (`CANONICAL_BOOKS`), evitando que la interfaz se rompa o quede en blanco.

---

## 4. Sincronización Automática en Producción (CI/CD)

En el servidor VPS de producción (AWS Lightsail), la base de datos no se transfiere por Git (`.gitignore` y exclusión en rsync). En su lugar, el pipeline de GitHub Actions (`.github/workflows/deploy.yml`) ejecuta el seeder automáticamente tras cada despliegue:

```yaml
# Fragmento de .github/workflows/deploy.yml
- name: Ejecutar tareas de inicio y reiniciar PM2 por SSH
  uses: appleboy/ssh-action@v1.0.3
  with:
    script: |
      cd ${{ secrets.TARGET_DIR }}
      
      # Dependencias de producción
      cd backend && pnpm install --prod --frozen-lockfile --ignore-scripts && cd ..
      
      # Sincronización transaccional del corpus bíblico en producción
      cd backend && node dist/bible/cli/seed-corpus.js && cd ..
      
      # Reinicio de procesos consolidados en PM2
      pm2 delete all || true
      pm2 start pm2.config.js
      pm2 save
```

### Propiedades Clave del Seeder:
* **Idempotencia:** Utiliza verificaciones y transacciones de actualización/inserción seguras para no duplicar registros ni fallar si la base de datos ya contiene datos.
* **Bajo Consumo de RAM:** El proceso utiliza streaming y transacciones agrupadas `better-sqlite3`, consumiendo menos de 150 MB de memoria durante el sembrado masivo, protegiendo el límite de 1 GB de RAM del VPS.

---

## 5. Resumen de Comandos de Referencia

| Acción | Comando |
| :--- | :--- |
| **Sembrar catálogo y corpus en desarrollo** | `pnpm --filter backend seed:bible` |
| **Sembrar en entorno de producción compilado** | `pnpm --filter backend seed:bible:prod` |
| **Validar tipos TypeScript del backend** | `pnpm --filter backend typecheck` |
| **Compilar el backend NestJS** | `pnpm --filter backend build` |
