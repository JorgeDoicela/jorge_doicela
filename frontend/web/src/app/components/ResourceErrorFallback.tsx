import React from 'react';

/**
 * ResourceErrorFallback
 * 
 * Componente de infraestructura de nivel más bajo. Inyecta un script inline nativo
 * para capturar fallas de red catastróficas (404 de chunks de Next.js por deploys)
 * antes de que React se cargue, evitando pantallas en blanco o en negro.
 * 
 * NOTA DE SEGURIDAD Y GEO: El contenido visual de error está codificado en Base64
 * para evitar que crawlers o bots de Inteligencia Artificial que extraen texto plano
 * del HTML inicial confundan este modal de emergencia con el estado real de la aplicación.
 */
export default function ResourceErrorFallback() {
  const inlineScript = `
    (function() {
      // Registrar el flag de inicialización global
      window.__APP_INITIALIZED__ = false;

      // Plantilla de error visual codificada en Base64 para aislamiento de crawlers e IA
      var _EB64 = "PHN0eWxlPiNyZXNvdXJjZS1lcnJvci1zY3JlZW46OmJlZm9yZSB7IGNvbnRlbnQ6ICIiOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogMDsgbGVmdDogMDsgd2lkdGg6IDEwMCU7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZC1pbWFnZTogcmFkaWFsLWdyYWRpZW50KDFweCAxcHggYXQgMzBweCA0MHB4LCAjZmZmLCByZ2JhKDAsMCwwLDApKSwgcmFkaWFsLWdyYWRpZW50KDEuNXB4IDEuNXB4IGF0IDkwcHggMTgwcHgsIHJnYmEoMjU1LDI1NSwyNTUsMC44NSksIHJnYmEoMCwwLDAsMCkpLCByYWRpYWwtZ3JhZGllbnQoMXB4IDFweCBhdCAyMjBweCAxMDBweCwgI2ZmZiwgcmdiYSgwLDAsMCwwKSksIHJhZGlhbC1ncmFkaWVudCgycHggMnB4IGF0IDE1MHB4IDMwMHB4LCByZ2JhKDI1NSwyNTUsMjU1LDAuNjUpLCByZ2JhKDAsMCwwLDApKSwgcmFkaWFsLWdyYWRpZW50KDEuNXB4IDEuNXB4IGF0IDI4MHB4IDIyMHB4LCAjZmZmLCByZ2JhKDAsMCwwLDApKSwgcmFkaWFsLWdyYWRpZW50KDFweCAxcHggYXQgODBweCAyOTBweCwgcmdiYSgyNTUsMjU1LDI1NSwwLjcpLCByZ2JhKDAsMCwwLDApKSwgcmFkaWFsLWdyYWRpZW50KDJweCAycHggYXQgMzEwcHggNTBweCwgI2ZmZiwgcmdiYSgwLDAsMCwwKSk7IGJhY2tncm91bmQtc2l6ZTogMzAwcHggMzAwcHg7IG9wYWNpdHk6IDAuNDU7IHBvaW50ZXItZXZlbnRzOiBub25lOyBhbmltYXRpb246IHN0YXJzUHVsc2UgMTVzIGluZmluaXRlIGFsdGVybmF0ZSBlYXNlLWluLW91dDsgfSBAa2V5ZnJhbWVzIHN0YXJzUHVsc2UgeyAwJTIwJTcgb3BhY2l0eTogMC4zOyB0cmFuc2Zvcm06IHNjYWxlKDAuOTcpOyB9IDEwMCUgeyBvcGFjaXR5OiAwLjY7IHRyYW5zZm9ybTogc2NhbGUoMS4wMyk7IH0gfTwvc3R5bGU+PGRpdiBzdHlsZT0icG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAxMDsgbWF4LXdpZHRoOiA0ODBweDsgYmFja2dyb3VuZDogcmdiYSgxMCwgMTAsIDE1LCAwLjQ4KTsgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1NSk7IHBhZGRpbmc6IDU2cHggNDhweDsgYm9yZGVyLXJhZGl1czogMjRweDsgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDE2cHgpOyBib3gtc2hhZG93OiAwIDMwcHggNjBweCAtMTVweCByZ2JhKDAsIDAsIDAsIDAuOSksIDAgMCA1MHB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjA4KTsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgYWxpZ24taXRlbXM6IGNlbnRlcjsiPjxkaXYgc3R5bGU9IndpZHRoOiA2NHB4OyBoZWlnaHQ6IDY0cHg7IGJvcmRlci1yYWRpdXM6IDUwJTsgYmFja2dyb3VuZDogcmdiYSgyMzksIDY4LCA2OCwgMC4wOCk7IGJvcmRlZXI6IDFweCBzb2xpZCByZ2JhKDIzOSwgNjgsIDY4LCAwLjI1KTsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IG1hcmdpbi1ib3R0b206IDMycHg7IGJveC1zaGFkb3c6IDAgMCAyMHB4IHJnYmEoMjM5LCA2OCwgNjgsIDAuMTIpOyI+PHN2ZyBzdHlsZT0id2lkdGg6IDI4cHg7IGhlaWdodDogMjhweDsgY29sb3I6ICNmODcxNzE7IiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNMTIgOXYybTAgNGguMDFtLTYuOTM4IDRoMTMuODU2YzEuNTQgMCAyLjUwMi0xLjY2NyAxLjczMi0zTDEzLjczMiA0Yy0uNzctMS4zMzMtMi42OTQtMS4zMzMtMy40NjQgMEwzLjM0IDE2Yy0uNzcgMS4zMzMuMTkyIDMgMS43MzIgM3oiIC8+PC9zdmc+PC9kaXY+PGgyIHN0eWxlPSJmb250LXNpemU6IDIycHg7IGZvbnQtd2VpZ2h0OiA0MDA7IGxldHRlci1zcGFjaW5nOiAtMC4wMmVtOyBtYXJnaW46IDAgMCAxNnB4IDA7IGNvbG9yOiAjZmZmZmZmOyBmb250LWZhbWlseTogc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBzYW5zLXNlcmlmOyI+SW50ZXJydXBjacOzbiBUZW1wb3JhbCBkZWwgU2VydmljaW88L2gyPjxwIHN0eWxlPSJmb250LXNpemU6IDE0cHg7IGNvbG9yOiAjZDRkNGR4OyBsaW5lLWhlaWdodDogMS43OyBtYXJnaW46IDA7IGZvbnQtd2VpZ2h0OiAzMDA7IGZvbnQtZmFtaWx5OiBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIHNhbnMtc2VyaWY7Ij5IZW1vcyBkZXRlY3RhZG8gZGlmaWN1bHRhZGVzIHTDqWNuaWNhcyBhbCBpbmljaWFsaXphciBsYSBhcGxpY2FjacOzbi4gWWEgbm9zIGVuY29udHJhbW9zIHRyYWJhamFuZG8gZW4gbGEgc29sdWNpw7NuIGRlIGN1YWxxdWllciBpbmNvbnZlbmllbnRlIHTDqWNuaWNvIHBhcmEgcmVzdGFibGVjZXIgZWwgc2VydmljaW8gYSBsYSBicmV2ZWRhZCBwb3NpYmxlLiBBZ3JhZGVjZW1vcyB0dSBwYWNpZW5jaWEgeSBjb21wcmVuc2nDs24uPC9wPjwvZGl2Pg==";

      // Registrar e inicializar la pantalla de error visual
      function showVisualError(triggerSource) {
        if (window.__APP_INITIALIZED__) {
          return;
        }

        if (document.getElementById('resource-error-screen')) {
          return;
        }

        console.warn("[ResourceErrorFallback] Disparando pantalla de error por fallo crítico:", triggerSource);

        var div = document.createElement('div');
        div.id = 'resource-error-screen';
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100vw';
        div.style.height = '100vh';
        div.style.backgroundColor = '#030303';
        div.style.backgroundImage = [
          'radial-gradient(circle at -10% -10%, rgba(168, 85, 247, 0.18) 0%, transparent 60%)',
          'radial-gradient(circle at 110% 110%, rgba(99, 102, 241, 0.20) 0%, transparent 60%)',
          'radial-gradient(circle at 15% 75%, rgba(56, 189, 248, 0.12) 0%, transparent 50%)',
          'radial-gradient(circle at 90% 15%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 40%)'
        ].join(', ');
        div.style.color = '#fafafa';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        div.style.zIndex = '999999999';
        div.style.padding = '24px';
        div.style.textAlign = 'center';
        div.style.overflow = 'hidden';

        try {
          div.innerHTML = decodeURIComponent(escape(window.atob(_EB64)));
        } catch (e) {
          div.innerHTML = '<p style="color:#fff;font-family:sans-serif;">Error temporal de carga. Por favor recarga la página.</p>';
        }

        if (document.body) {
          document.body.appendChild(div);
        } else {
          document.documentElement.appendChild(div);
        }
      }

      // 1. Escuchar errores físicos de carga exclusivamente en chunks principales de Next.js
      window.addEventListener('error', function(e) {
        if (window.__APP_INITIALIZED__) return;
        if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
          var url = e.target.src || e.target.href || '';
          // Solo reaccionar ante scripts que pertenezcan a la carpeta de chunks del framework propio
          if (url.indexOf('/_next/static/chunks/') !== -1 && url.indexOf('cloudflare') === -1 && url.indexOf('extension') === -1) {
            showVisualError("HTML Chunk Load Error (" + url + ")");
          }
        }
      }, true);

      // 2. Escuchar excepciones no capturadas de ejecución en chunks de Next.js
      window.onerror = function(message, source) {
        if (window.__APP_INITIALIZED__) return;
        if (source && source.indexOf('/_next/static/chunks/') !== -1 && source.indexOf('cloudflare') === -1) {
          showVisualError("window.onerror: " + message);
        }
      };

      // 3. Escuchar fallos de importación dinámica de chunks exclusivamente de Next.js
      window.addEventListener('unhandledrejection', function(e) {
        if (window.__APP_INITIALIZED__) return;
        var reason = e.reason || {};
        var msg = reason.message || String(reason);
        // Exclusivamente para ChunkLoadError de Webpack/Turbopack
        if (msg.indexOf('ChunkLoadError') !== -1 || (msg.indexOf('Loading chunk') !== -1 && msg.indexOf('_next') !== -1)) {
          showVisualError("unhandledrejection: " + msg);
        }
      });
    })();
  `;

  return (
    <script
      id="resource-error-fallback"
      dangerouslySetInnerHTML={{
        __html: inlineScript,
      }}
    />
  );
}
