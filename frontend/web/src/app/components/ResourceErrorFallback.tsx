import React from 'react';

/**
 * ResourceErrorFallback
 * 
 * Componente de infraestructura de nivel más bajo. Inyecta un script inline nativo
 * para capturar fallas de red catastróficas (404 de chunks de Next.js por deploys)
 * antes de que React se cargue, evitando pantallas en blanco o en negro.
 */
export default function ResourceErrorFallback() {
  const inlineScript = `
    (function() {
      console.log("[ResourceErrorFallback] Inicializando script inline de protección.");
      
      // Registrar el flag de inicialización global
      window.__APP_INITIALIZED__ = false;

      // Registrar e inicializar la pantalla de error
      function showVisualError(triggerSource) {
        console.warn("[ResourceErrorFallback] showVisualError disparado por: " + triggerSource);
        if (document.getElementById('resource-error-screen')) {
          console.log("[ResourceErrorFallback] La pantalla de error ya está en el DOM. Omitiendo.");
          return;
        }

        var div = document.createElement('div');
        div.id = 'resource-error-screen';
            // Estilos ultra-premium alineados al diseño de la marca (Cosmos Etéreo del Universo)
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100vw';
        div.style.height = '100vh';
        div.style.backgroundColor = '#030303';
        div.style.backgroundImage = [
          'radial-gradient(circle at -10% -10%, rgba(168, 85, 247, 0.18) 0%, transparent 60%)', // Nebulosa Violeta
          'radial-gradient(circle at 110% 110%, rgba(99, 102, 241, 0.20) 0%, transparent 60%)', // Interestelar Indigo
          'radial-gradient(circle at 15% 75%, rgba(56, 189, 248, 0.12) 0%, transparent 50%)',   // Polvo Cian
          'radial-gradient(circle at 90% 15%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)',   // Galaxia Rosa
          'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.06) 0%, transparent 40%)'    // Polvo Solar Dorado
        ].join(', ');
        div.style.color = '#fafafa';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        div.style.zIndex = '999999999'; // Por encima de cargadores o overlays
        div.style.padding = '24px';
        div.style.textAlign = 'center';
        div.style.overflow = 'hidden';

        div.innerHTML = [
          '<style>',
            '#resource-error-screen::before {',
              'content: "";',
              'position: absolute;',
              'top: 0; left: 0; width: 100%; height: 100%;',
              'background-image: ',
                'radial-gradient(1px 1px at 30px 40px, #fff, rgba(0,0,0,0)),',
                'radial-gradient(1.5px 1.5px at 90px 180px, rgba(255,255,255,0.85), rgba(0,0,0,0)),',
                'radial-gradient(1px 1px at 220px 100px, #fff, rgba(0,0,0,0)),',
                'radial-gradient(2px 2px at 150px 300px, rgba(255,255,255,0.65), rgba(0,0,0,0)),',
                'radial-gradient(1.5px 1.5px at 280px 220px, #fff, rgba(0,0,0,0)),',
                'radial-gradient(1px 1px at 80px 290px, rgba(255,255,255,0.7), rgba(0,0,0,0)),',
                'radial-gradient(2px 2px at 310px 50px, #fff, rgba(0,0,0,0));',
              'background-size: 300px 300px;',
              'opacity: 0.45;',
              'pointer-events: none;',
              'animation: starsPulse 15s infinite alternate ease-in-out;',
            '}',
            '@keyframes starsPulse {',
              '0% { opacity: 0.3; transform: scale(0.97); }',
              '100% { opacity: 0.6; transform: scale(1.03); }',
            '}',
          '</style>',
          '<div style="position: relative; z-index: 10; max-width: 480px; background: rgba(10, 10, 15, 0.48); border: 1px solid rgba(255, 255, 255, 0.055); padding: 56px 48px; border-radius: 24px; backdrop-filter: blur(16px); box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(99, 102, 241, 0.08); display: flex; flex-direction: column; align-items: center; transition: all 0.3s;">',
            '<div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); display: flex; align-items: center; justify-content: center; margin-bottom: 32px; box-shadow: 0 0 20px rgba(239, 68, 68, 0.12);">',
              '<svg style="width: 28px; height: 28px; color: #f87171;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">',
                '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />',
              '</svg>',
            '</div>',
            '<h2 style="font-size: 22px; font-weight: 400; letter-spacing: -0.02em; margin: 0 0 16px 0; color: #ffffff; font-family: system-ui, -apple-system, sans-serif;">Interrupción Temporal del Servicio</h2>',
            '<p style="font-size: 14px; color: #d4d4d8; line-height: 1.7; margin: 0; font-weight: 300; font-family: system-ui, -apple-system, sans-serif;">',
              'Hemos detectado dificultades técnicas al inicializar la aplicación. Ya nos encontramos trabajando en la solución de cualquier inconveniente técnico para restablecer el servicio a la brevedad posible. Agradecemos tu paciencia y comprensión.',
          '</div>'
        ].join('');

        // Adjuntar de forma segura: si el body no existe aún (carga temprana en head), se inserta en documentElement
        if (document.body) {
          console.log("[ResourceErrorFallback] Adjuntando pantalla de error al document.body");
          document.body.appendChild(div);
        } else {
          console.log("[ResourceErrorFallback] document.body es nulo. Adjuntando pantalla de error a document.documentElement");
          document.documentElement.appendChild(div);
        }
      }

      // 1. Escuchar errores físicos de carga de elementos (scripts y estilos críticos)
      window.addEventListener('error', function(e) {
        if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
          var url = e.target.src || e.target.href || '';
          if (url.indexOf('_next/static') !== -1 || url.indexOf('manifest.json') !== -1) {
            console.log("[ResourceErrorFallback] Error detectado en elemento HTML crítico de carga: " + url);
            showVisualError("HTML Tag Error (" + url + ")");
          }
        }
      }, true);

      // 2. Escuchar excepciones no capturadas de ejecución (errores de compilación o runtime temprano)
      window.onerror = function(message, source, lineno, colno, error) {
        console.error("[ResourceErrorFallback] window.onerror capturado:", { message: message, source: source });
        if (source && source.indexOf('_next/static') !== -1) {
          showVisualError("window.onerror: " + message);
        }
      };

      // 3. Escuchar promesas rechazadas (fallos en importaciones dinámicas 'import()' de Turbopack/Webpack)
      window.addEventListener('unhandledrejection', function(e) {
        var reason = e.reason || {};
        var msg = reason.message || String(reason);
        console.log("[ResourceErrorFallback] unhandledrejection capturado:", msg);
        if (
          msg.indexOf('chunk') !== -1 || 
          msg.indexOf('Loading') !== -1 || 
          msg.indexOf('Failed to fetch') !== -1 ||
          msg.indexOf('dynamically') !== -1 ||
          msg.indexOf('blocked') !== -1
        ) {
          showVisualError("unhandledrejection: " + msg);
        }
      });

      // 4. Temporizador de Seguridad (Watchdog): Si la app React no se monta en 5 segundos, forzar error
      console.log("[ResourceErrorFallback] Iniciando Watchdog Timer de 5 segundos.");
      setTimeout(function() {
        console.log("[ResourceErrorFallback] Evaluando Watchdog. __APP_INITIALIZED__ =", window.__APP_INITIALIZED__);
        if (!window.__APP_INITIALIZED__) {
          console.warn("[ResourceErrorFallback] Temporizador de seguridad expirado. La app no logró inicializarse en 5 segundos.");
          showVisualError("Watchdog Timer Expiration");
        } else {
          console.log("[ResourceErrorFallback] Watchdog desactivado con éxito. La app se montó correctamente.");
        }
      }, 5000);
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
