---
name: infraestructura-global-jorge-doicela
description: Activa esta skill para cualquier tarea global del ecosistema, reglas maestras de monorepo pnpm, arquitectura en 1 GB de RAM, aislamiento de dominios, estándares de microarquitectura (FSD y 3 capas), despliegue en AWS Lightsail (Debian 13), Cloudflare mTLS, Nginx, PM2, pipeline CI/CD de GitHub Actions y seguridad pre-commit (Husky y check-secrets).
---
# Infraestructura Global, Arquitectura y Despliegue: Proyecto Jorge Doicela

Esta habilidad define las directrices maestras, la arquitectura de hardware/software, los estándares de codificación, la seguridad y el pipeline de operaciones de todo el monorepo Jorge Doicela.

---

## Documentación Técnica Oficial
* [01_arquitectura_macro_y_hardware.md](../../../docs/01-infraestructura-global/01-arquitectura/01_arquitectura_macro_y_hardware.md)
* [02_patrones_microarquitectura_y_fsd.md](../../../docs/01-infraestructura-global/01-arquitectura/02_patrones_microarquitectura_y_fsd.md)
* [01_despliegue_pm2_y_cicd.md](../../../docs/01-infraestructura-global/02-despliegue-y-servidor/01_despliegue_pm2_y_cicd.md)

---

## 1. Justificación de Hardware y Filosofía de Aislamiento

* **Restricción Física de Hardware:** El servidor en producción en AWS Lightsail está limitado a **1 GB de RAM** (Debian 13). Por este motivo:
  * El **backend** corre consolidado en un solo proceso NestJS (puerto `3000`).
  * El **frontend web** corre consolidado en un solo proceso Next.js (puerto `3001`) mediante `src/middleware.ts` para resolver subdominios.
* **Principio de Cajas Negras:** Las 4 aplicaciones (`landing`, `portfolio`, `bible`, `software`) son **proyectos 100% aislados e independientes**. Nunca deben acoplarse ni depender entre sí.
* **Diseño para la Extracción Inmediata:** Cualquier módulo o subproyecto debe poder extraerse a su propio repositorio o servidor en el futuro y funcionar sin refactorizaciones.

---

## 2. Gestión de Dependencias con `--filter` (El Comando de Oro)

* **Prohibido:** Instalar paquetes en la raíz del monorepo si pertenecen a un subproyecto específico.
* **Comando con filtro:**
  ```bash
  pnpm --filter backend add <paquete>   # Dependencias del Backend NestJS
  pnpm --filter web add <paquete>       # Dependencias del Frontend Web Next.js
  pnpm --filter mobile add <paquete>    # Dependencias de la App Móvil Expo
  ```
* **Compilación C++ (`better-sqlite3`):** El driver SQLite compila extensiones nativas C++ y requiere `build-essential`, `python3`, `g++`, `make` en Linux.

---

## 3. Aislamiento de Tipos y Contratos (Cero `@shared`)

* **Cero paquetes `@shared`:** Cada subproyecto define sus propias interfaces TypeScript en sus carpetas locales (`types.ts`, DTOs).
* **Persistencia Aislada:** Cada módulo del backend interactúa con su propia base de datos SQLite física (`bible.sqlite`, `software.sqlite`, `portfolio.sqlite`) bajo conexiones nombradas (`'bibleConnection'`, etc.).

---

## 4. Estándares de Microarquitectura

### 4.1 Backend: Arquitectura en 3 Capas (NestJS)
* **Capa 1 (Presentación):** Controladores REST y Gateways WebSockets. Sin lógica de negocio, solo validan DTOs con `class-validator`.
* **Capa 2 (Negocio):** Servicios inyectables con reglas de dominio y lanzamiento de excepciones estándar.
* **Capa 3 (Datos):** Entidades TypeORM y repositorios SQLite.
* **Manejo Global:** `GlobalExceptionFilter` intercepta errores y `TransformInterceptor` unifica salidas en `{ success: true, data: ... }`.

### 4.2 Frontend: Feature-Sliced Design (FSD en Next.js)
* Estructurado por funcionalidades dentro de `src/app/(<dominio>)/features/<feature_name>/` (`components/`, `hooks/`, `utils/`, `types.ts`).
* Aislamiento estricto de estilos: cada subdominio importa exclusivamente su propio `globals.css`.

---

## 5. Servidor, Nginx, PM2 y Despliegue CI/CD

### 5.1 Topología y Seguridad
* **Cloudflare Edge (Proxy Naranja):** Modo Full (Strict), WAF y SSL de extremo a extremo.
* **Nginx mTLS (`nginx/jorgedoicela.com.conf`):** Autenticación mutua con certificado CA de Cloudflare (`ssl_verify_client on`).

### 5.2 PM2 Standalone
* **`backend-nest`:** Puerto 3000, límite `300 MB`.
* **`frontend-next`:** Modo Standalone puerto 3001, consumo `~120 MB`.

### 5.3 Pipeline CI/CD (`.github/workflows/deploy.yml`)
1. Compilación y validación de tipos en GitHub Actions (`ubuntu-latest`).
2. Transferencia segura por `rsync` excluyendo `.sqlite` y `node_modules`.
3. Sincronización automática del corpus bíblico (`node dist/bible/cli/seed-corpus.js`).
4. Sincronización de `nginx/jorgedoicela.com.conf` y recarga en caliente de Nginx.
5. Reinicio de procesos en PM2.

---

## 6. Seguridad Local y Validación Pre-Commit

Hooks automáticos de Git con **Husky** (`.husky/pre-commit`):

```bash
# 1. Auditoría de seguridad contra fuga de secretos (.env, .sqlite, .pem, llaves SSH)
pnpm check-secrets

# 2. Comprobación estricta de tipos TypeScript en todo el monorepo (0 errores)
pnpm -r typecheck

# 3. Validación de formato y estilo
pnpm run lint && pnpm run format

# 4. Compilación para producción
pnpm run build
```

---

## 7. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| pnpm add <paquete> en la raíz | Contamina el root y rompe la portabilidad. | pnpm --filter <workspace> add <paquete> |
| Importar código entre subdominios distintos | Rompe el principio de cajas negras. | Usar eventos (@nestjs/event-emitter) o duplicar contratos. |
| Crear paquete común @shared | Acopla el frontend y backend. | Duplicar tipos en types.ts y DTOs locales. |
| Mezclar estilos globales en un layout raíz | Colisiona clases de Tailwind CSS entre subproyectos. | Cada subproyecto importa solo su propio globals.css. |
| Compilar en el VPS de producción | Agota la RAM de 1 GB y tumba los servicios. | Compilar en GitHub Actions y subir artefactos con rsync. |

---

## 8. Combinar con Skills de Proyecto

Según el dominio específico en el que trabajes:
* **Landing Page:** `landing-jorge-doicela`
* **Portafolio Profesional:** `portfolio-jorge-doicela`
* **Biblia Modular (Web y Móvil):** `bible-jorge-doicela`
* **Software Hub:** `software-jorge-doicela`
