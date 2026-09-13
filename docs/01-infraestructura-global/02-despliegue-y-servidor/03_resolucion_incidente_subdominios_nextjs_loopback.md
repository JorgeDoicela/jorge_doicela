# Resolución de Incidente: Enrutamiento Multi-Tenant, Loopback y Resincronización Nginx

Este documento detalla la investigación forense, el análisis técnico de causa raíz a nivel del código fuente de Next.js 16, la discrepancia en la normalización de sockets loopback y la resolución arquitectónica definitiva que restauró el 100% de la operatividad en producción para los dominios y subdominios del ecosistema **Jorge Doicela**.

---

## 1. Resumen Ejecutivo del Incidente

| Parámetro | Detalle |
| :--- | :--- |
| **Fecha del Incidente** | 8 – 9 de Septiembre de 2026 |
| **Severidad** | P1 (Crítico) — Subdominios inaccesibles |
| **Servicios Afectados** | `bible.jorgedoicela.com`, `portfolio.jorgedoicela.com`, `software.jorgedoicela.com` |
| **Servicio No Afectado** | `jorgedoicela.com` (Landing page / Dominio raíz) |
| **Síntoma Visible** | HTTP 500 (Internal Server Error) en navegador y llamadas cURL |
| **Error en Logs de Next.js** | `Error: write EPROTO: SSL routines: WRONG_VERSION_NUMBER` en `proxy-request.js` |
| **Causa Raíz** | Discrepancia interna en Next.js 16 Standalone entre `opts.hostname` en `resolve-routes.js` y la normalización de loopback de `NextURL` (`REGEX_LOCALHOST_HOSTNAME`), lo cual convertía las reescrituras de subdominios (`middleware.ts`) en llamadas de proxy externo hacia su propio socket HTTP plano por HTTPS |
| **Estado Final** | **Resuelto** — 100% de endpoints en `HTTP 200 OK`, sockets sellados en loopback IPv4/IPv6 |

---

## 2. Cronología y Síntomas Forenses

### 2.1 El Disparador
Durante la auditoría de hardening perimetral de septiembre de 2026, se identificó que Node.js escuchaba en `0.0.0.0:3000` y `0.0.0.0:3001`. Para aplicar el principio de *Defensa en Profundidad*, se configuró en `pm2.config.js`:
```javascript
// Intento original de hardening
{
  name: 'backend-nest',
  env: { HOST: '127.0.0.1', ... }
},
{
  name: 'frontend-next',
  env: { PORT: 3001, HOSTNAME: '127.0.0.1' }
}
```

### 2.2 El Síntoma Inmediato
Tras recargar PM2:
* `jorgedoicela.com` (Landing) continuó respondiendo `200 OK` porque no requiere reescritura de subdominios en `src/middleware.ts`.
* Todos los subdominios (`bible`, `portfolio`, `software`) comenzaron a devolver `500 Internal Server Error`.
* En los logs de PM2 (`~/.pm2/logs/frontend-next-error-*.log`):
```text
Failed to proxy https://localhost:3001/software Error: write EPROTO 80F2CC34637F0000:error:0A00010B:SSL routines:tls_validate_record_header:wrong version number:../deps/openssl/openssl/ssl/record/methods/tlsany_meth.c:77:
    at ignore-listed frames {
  errno: -71,
  code: 'EPROTO',
  syscall: 'write'
}
```

---

## 3. Análisis Forense de Causa Raíz (Código Interno de Next.js 16)

Para eliminar el problema de raíz sin aplicar parches ni hacks, se auditó el flujo de ejecución interno de Next.js en `node_modules/next/dist/server/`:

### 3.1 La Construcción de la URL Base (`resolve-routes.js`)
En `node_modules/next/dist/server/lib/router-utils/resolve-routes.js` (Líneas 114–116):
```javascript
const protocol = (req?.socket?.encrypted) || (req.headers['x-forwarded-proto']?.includes('https')) ? 'https' : 'http';

const initUrl = config.experimental.trustHostHeader 
  ? `https://${req.headers.host || 'localhost'}${req.url}` 
  : opts.port 
    ? `${protocol}://${formatHostname(opts.hostname || 'localhost')}:${opts.port}${req.url}` 
    : req.url || '';
```
1. Cuando Nginx o Cloudflare envían `X-Forwarded-Proto: https`, `protocol` se fija en `'https'`.
2. Al haber iniciado con `HOSTNAME: '127.0.0.1'`, `opts.hostname` es `'127.0.0.1'`.
3. `formatHostname('127.0.0.1')` devuelve `'127.0.0.1'`.
4. Por lo tanto, `initUrl` se construye literalmente como:
   $$\text{initUrl} = \text{https://127.0.0.1:3001/}$$

### 3.2 La Normalización Oculta de `NextURL` (`next-url.js`)
En `node_modules/next/dist/server/web/next-url.js` (Líneas 14–21):
```javascript
const REGEX_LOCALHOST_HOSTNAME = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;

function parseURL(url, base) {
    const parsed = new URL(String(url), base && String(base));
    if (REGEX_LOCALHOST_HOSTNAME.test(parsed.hostname)) {
        parsed.hostname = 'localhost'; // <-- Next.js fuerza 127.0.0.1 a 'localhost'
    }
    return parsed;
}
```
1. Cuando el servidor invoca `middleware(request: NextRequest)`, `NextRequest` parsea la URL usando `NextURL`.
2. Como `initUrl` contiene `127.0.0.1`, la expresión regular `REGEX_LOCALHOST_HOSTNAME` hace match y **fuerza el hostname a `'localhost'`**.
3. En consecuencia, en `src/middleware.ts`:
   * `request.nextUrl.origin` queda fijado en `https://localhost:3001`.
   * Al ejecutar `url.pathname = resolvedPath; return NextResponse.rewrite(url);`, la cabecera `x-middleware-rewrite` se emite como:
   $$\text{x-middleware-rewrite} = \text{https://localhost:3001/software}$$

### 3.3 El Juicio de Relatividad (`relativize-url.js`)
En `node_modules/next/dist/shared/lib/router/utils/relativize-url.js`:
```javascript
function parseRelativeURL(url, base) {
    const baseURL = typeof base === 'string' ? new URL(base) : base;
    const relative = new URL(url, base);
    const isRelative = relative.origin === baseURL.origin;
    return {
        url: isRelative ? relative.toString().slice(baseURL.origin.length) : relative.toString(),
        isRelative
    };
}
```
Al llegar la respuesta del middleware a `resolve-routes.js` (Línea 464):
```javascript
const destination = getRelativeURL(middlewareHeaders['x-middleware-rewrite'], initUrl);
```
Se comparan los orígenes:
* `baseURL.origin` $\rightarrow$ `https://127.0.0.1:3001` (proveniente de `initUrl`).
* `relative.origin` $\rightarrow$ `https://localhost:3001` (proveniente de `NextURL`).
* **`baseURL.origin === relative.origin` $\rightarrow$ ¡FALSO!**

### 3.4 El Disparo Fatal de `proxyRequest` (`router-server.js`)
Dado que `isRelative` es `false`:
1. `destination` no se convierte en una ruta relativa (`/software`), sino que se mantiene como una URL absoluta completa con esquema: `https://localhost:3001/software`.
2. En `router-server.js` (Línea 374):
   ```javascript
   if (finished && parsedUrl.protocol) {
       return await proxyRequest(req, res, parsedUrl, ...);
   }
   ```
3. Next.js asume erróneamente que la reescritura es hacia un servidor proxy externo.
4. `proxyRequest` inicializa un cliente HTTP/HTTPS proxy e intenta negociar un apretón de manos SSL/TLS (`https://`) contra el puerto `3001`.
5. Como el puerto `3001` es un socket HTTP en texto plano, OpenSSL rechaza la conexión con `EPROTO 100000f7: wrong version number`.
6. La petición aborta y el cliente recibe `500 Internal Server Error`.

---

## 4. Matriz de Comportamiento por Configuración

| Configuración en PM2 | `initUrl` en Router | `request.nextUrl` en Middleware | ¿Coinciden Orígenes? | Resultado |
| :--- | :--- | :--- | :---: | :--- |
| `HOSTNAME: '127.0.0.1'` | `https://127.0.0.1:3001` | `https://localhost:3001` | No | **500 Error** (`EPROTO` proxy) |
| Sin `HOSTNAME` (`0.0.0.0`) | `https://0.0.0.0:3001` | `https://localhost:3001` | No | **500 Error** (`EPROTO` proxy) |
| **`HOSTNAME: 'localhost'`** | **`https://localhost:3001`** | **`https://localhost:3001`** | **Sí** | **200 OK** (Ruta local interna) |

---

## 5. El Comportamiento Dual de Red en Debian 13

Al fijar `HOSTNAME: 'localhost'` en `pm2.config.js`:
1. Node.js en Debian 13 resuelve `localhost` vía `dns.lookup()`. En Linux moderno, `/etc/hosts` asocia `localhost` prioritariamente a `::1` (IPv6 loopback).
2. El socket del servidor Next.js pasa a escuchar en:
   ```text
   LISTEN 0 511 [::1]:3001 [::]:* users:(("next-server",pid=...,fd=23))
   ```
3. **Implicación en Nginx:** 
   * La configuración original de Nginx tenía `proxy_pass http://127.0.0.1:3001;` (IPv4 loopback).
   * Al estar Next.js escuchando en `[::1]:3001`, las peticiones hacia `127.0.0.1:3001` recibían `111: Connection refused` y Nginx devolvía `502 Bad Gateway`.
   * Al actualizar Nginx para comunicarse explícitamente con `http://[::1]:3001;`, la comunicación fluye de inmediato a velocidad de memoria local.

---

## 6. Arquitectura Definitiva Implementada

### 6.1 Orquestación en PM2 (`pm2.config.js`)
```javascript
module.exports = {
  apps: [
    {
      name: 'backend-nest',
      script: './dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env_file: './backend/.env',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1', // IPv4 loopback estricto para APIs y SQLite
        DATABASE_PORTFOLIO_PATH: './data/portfolio.sqlite',
        DATABASE_BIBLE_PATH: './data/bible.sqlite',
        DATABASE_SOFTWARE_PATH: './data/software.sqlite',
      },
    },
    {
      name: 'frontend-next',
      script: './server.js',
      cwd: './frontend/web/.next/standalone/frontend/web',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: 'localhost', // IPv6 loopback [::1], alineado con NextURL
      },
    },
  ],
};
```

### 6.2 Enrutador Nginx (`nginx/jorgedoicela.com.conf`)
```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name jorgedoicela.com *.jorgedoicela.com;

    # 1. API REST Backend NestJS (Puerto 3000) - Namespace canónico /api/
    location /api/ {
        limit_req zone=api_limit_zone burst=25 nodelay;
        proxy_pass http://127.0.0.1:3000;
        # ...
    }

    # 2. Frontend Next.js Standalone (Páginas y RSC)
    location / {
        limit_req zone=web_limit_zone burst=50 nodelay;
        proxy_pass http://[::1]:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        # ...
    }
}
```

### 6.3 Modelo de Defensa en Profundidad (Seguridad Perimetral)

```text
[ Internet ]
     │
     ▼ (HTTPS / Cloudflare Edge Proxy)
[ Cloudflare WAF / SSL ]
     │
     ▼ (mTLS Authenticated Origin Pulls)
[ AWS Lightsail Firewall + Linux UFW ]
  - Puerto 22 (SSH con fail2ban)
  - Puerto 80 (Redirect a 443)
  - Puerto 443 (Nginx mTLS)
  - Puertos 3000 y 3001: DROP a nivel de Kernel (eth0)
     │
     ▼
[ Nginx Reverse Proxy (443) ]
     ├── http://127.0.0.1:3000  ──► [ NestJS (IPv4 Loopback) ]
     └── http://[::1]:3001      ──► [ Next.js (IPv6 Loopback) ]
```

---

## 7. Verificación de Producción

Comprobación empírica ejecutada directamente contra el servidor web de producción:

```bash
curl -s -o /dev/null -w "público bible: %{http_code}\n" https://bible.jorgedoicela.com/
curl -s -o /dev/null -w "público landing: %{http_code}\n" https://jorgedoicela.com/
curl -s -o /dev/null -w "público software: %{http_code}\n" https://software.jorgedoicela.com/
curl -s -o /dev/null -w "público portfolio: %{http_code}\n" https://portfolio.jorgedoicela.com/
```

**Salida obtenida:**
```text
público bible: 200
público landing: 200
público software: 200
público portfolio: 200
```

Sockets activos en el host Debian 13 (`ss -tlnp`):
```text
LISTEN  127.0.0.1:3000   users:(("node",pid=1327,fd=32))        ← NestJS sellado
LISTEN  [::1]:3001       users:(("next-server",pid=1649,fd=23))  ← Next.js sellado
```

---

## 8. Lecciones de Arquitectura y Buenas Prácticas

1. **Evitar parches en capas intermedias:** No se debe forzar a Nginx a falsificar cabeceras `Host` ni usar variables experimentales no soportadas (`trustHostHeader`) en Next.js. El enrutamiento debe ser natural y canónico.
2. **Conocer la normalización de URLs del framework:** En Next.js Standalone, `process.env.HOSTNAME` no solo define la interfaz de escucha del socket TCP, sino que altera la semántica de origen de la aplicación.
3. **El Kernel como primera barrera:** El aislamiento de red principal de un servidor debe recaer siempre en el firewall de infraestructura (AWS Security Groups) y el firewall del kernel (UFW/Netfilter). La vinculación a loopback en los procesos de Node.js es una segunda línea de defensa complementaria.
