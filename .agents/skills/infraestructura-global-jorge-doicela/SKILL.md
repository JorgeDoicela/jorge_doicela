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

### 4.3 Internacionalización Descentralizada (next-intl + SSR & Cajas Negras)
* **Aislamiento por Subdominio:** Diccionarios encapsulados en `src/app/(subproyecto)/messages/es.json` y `en.json`.
* **Carga Perezosa en Memoria (1 GB RAM):** `src/i18n/request.ts` detecta el `host` y carga en memoria únicamente el diccionario del subdominio activo.
* **Cero Parpadeos (SSR):** El servidor entrega el HTML ya traducido con `<html lang={locale}>` dinámico según la cookie `NEXT_LOCALE` o cabecera `Accept-Language`.
* **SEO Internacional Dinámico:** Cada layout de subdominio implementa `generateMetadata()` y emite etiquetas `hreflang` (`es-EC` y `en-US`).
* **Doble Nivel de i18n:** UI Chrome mediante `useTranslations()` y datos dinámicos en SQLite (`software.sqlite` y `bible.sqlite`) mediante columna `language: 'es' | 'en'` y filtros `?lang=`.

### 4.4 Visibilidad en Inteligencia Artificial (GEO) y Arquitectura "Zero-RAM"
* **Arquitectura Multicanal `public/<proyecto>/llms.txt`:** Cada uno de los 4 proyectos tiene su propio dossier especializado servido directamente por Nginx sin tocar Node.js:
  * `public/landing/llms.txt` $\rightarrow$ `https://jorgedoicela.com/llms.txt` (Perfil general del creador)
  * `public/portfolio/llms.txt` $\rightarrow$ `https://portfolio.jorgedoicela.com/llms.txt` (Terminal SSH, proyectos)
  * `public/software/llms.txt` $\rightarrow$ `https://software.jorgedoicela.com/llms.txt` (7 categorías tecnológicas)
  * `public/bible/llms.txt` $\rightarrow$ `https://bible.jorgedoicela.com/llms.txt` (9 motores exegéticos)
* **Obligación de Sincronización:** Cuando se cree, modifique o elimine cualquier proyecto, submódulo o categoría principal en el ecosistema, es **obligatorio actualizar el `llms.txt` de su subcarpeta, su `manifest.json`, su componente `*JsonLd.tsx` y `sitemap.ts`**.
* **Manifiestos PWA Independientes (`public/<proyecto>/manifest.json`):** Cada subdominio tiene su propia identidad de aplicación instalable (nombre, tema, ícono, ruta de inicio).
* **Entrega Estática "Zero-RAM" en Nginx:** `llms.txt`, `manifest.json` y `favicon.ico` son resueltos por los mapas `$llms_file`, `$manifest_file` y `$favicon_file` según `$host`, entregando en < 1 ms con **0 MB de consumo de RAM en Node.js**.
* **Protección Quirúrgica en `robots.ts`:** Permite explícitamente los User-Agents oficiales de IA sobre contenido público y bloquea rutas de backend (`/api/`, `/_next/`, `/socket.io/`) para evitar sobrecargas de CPU y memoria.

---

## 5. Servidor, Nginx, PM2 y Despliegue CI/CD

### 5.1 Topología, Seguridad y Rate Limiting (Zero-RAM)
* **Cloudflare Edge (Proxy Naranja):** Modo Full (Strict), WAF y SSL de extremo a extremo con paso libre para bots de IA verificados.
* **Nginx mTLS (`nginx/jorgedoicela.com.conf`):** Autenticación mutua con certificado CA de Cloudflare (`ssl_verify_client on`).
* **Rate Limiting Perimetral por IP Real (`$http_cf_connecting_ip`):**
  * `api_limit_zone` (15 req/s, burst 25 nodelay): Protege las consultas a SQLite y el backend NestJS contra scraping masivo (devuelve HTTP 429).
  * `web_limit_zone` (35 req/s, burst 50 nodelay): Protege el SSR de Next.js de sobrecargas DoS.
  * Consumo de memoria: ~10 MB en Nginx para gestionar >160.000 IPs sin gastar memoria RAM en Node.js.

### 5.2 PM2 Standalone
* **`backend-nest`:** Puerto 3000, límite `300 MB`.
* **`frontend-next`:** Modo Standalone puerto 3001, consumo `~120 MB`.

### 5.3 Pipeline CI/CD (`.github/workflows/deploy.yml`)
1. Compilación y validación de tipos en GitHub Actions (`ubuntu-latest`).
2. Transferencia segura por `rsync` excluyendo `.sqlite` y `node_modules`.
3. Sincronización automática de bases de datos (`node dist/bible/cli/seed-corpus.js` y `node dist/software/cli/seed-software.js`).
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

## 7. Archivos Compartidos del Frontend (Patrón "Migration-Ready")

Los siguientes archivos son transversales al proceso Next.js consolidado pero están **estructurados para que la separación futura de cualquier proyecto sea instantánea y sin residuos**:

| Archivo | Patrón de Aislamiento | Acción al Migrar |
|---|---|---|
| `src/app/sitemap.ts` | 4 constantes independientes por proyecto | Copiar solo la constante del proyecto al nuevo servidor |
| `src/app/robots.ts` | Guía inline con la URL de sitemap a sustituir | Cambiar `sitemap` a la URL del nuevo servidor |
| `src/middleware.ts` | Bloques etiquetados `// ── PORTFOLIO ──` etc. | Eliminar el bloque del proyecto migrado |

> **Obligación de mantenimiento:** Al añadir rutas nuevas a un proyecto, actualizarlas en su bloque/constante correspondiente dentro de cada uno de estos 3 archivos.

---

## 8. Anti-Patrones Prohibidos

| Anti-Patrón | Por qué está prohibido | Solución Correcta |
|---|---|---|
| pnpm add <paquete> en la raíz | Contamina el root y rompe la portabilidad. | pnpm --filter <workspace> add <paquete> |
| Importar código entre subdominios distintos | Rompe el principio de cajas negras. | Usar eventos (@nestjs/event-emitter) o duplicar contratos. |
| Crear paquete común @shared | Acopla el frontend y backend. | Duplicar tipos en types.ts y DTOs locales. |
| Mezclar estilos globales en un layout raíz | Colisiona clases de Tailwind CSS entre subproyectos. | Cada subproyecto importa solo su propio globals.css. |
| Compilar en el VPS de producción | Agota la RAM de 1 GB y tumba los servicios. | Compilar en GitHub Actions y subir artefactos con rsync. |

---

## 8. Sincronización y Mantenimiento Continuo de la Documentación (`docs/`)

* **Actualización Mandatoria ante Cambios:** Cada vez que se implementen mejoras, nuevas herramientas, ajustes en scripts, cambios en CI/CD o en la infraestructura del servidor, es **obligatorio actualizar la documentación técnica correspondiente en `docs/01-infraestructura-global/`**.
* **Gestión Documental Proactiva:** Se autoriza agregar nuevos archivos `.md`, crear subcarpetas o eliminar/podar contenido que haya quedado obsoleto, asegurando siempre que la documentación represente con exactitud y profesionalismo el estado real del sistema.

---

## 9. Combinar con Skills de Proyecto

Según el dominio específico en el que trabajes:
* **Landing Page:** `landing-jorge-doicela`
* **Portafolio Profesional:** `portfolio-jorge-doicela`
* **Biblia Modular (Web y Móvil):** `bible-jorge-doicela`
* **Software:** `software-jorge-doicela`

