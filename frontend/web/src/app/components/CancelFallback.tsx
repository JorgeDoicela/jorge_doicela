'use client';

import { useEffect } from 'react';

/**
 * CancelFallback
 * 
 * Componente cliente ligero. Su único propósito es marcar la aplicación como
 * montada con éxito en el navegador una vez que React se inicializa,
 * cancelando el temporizador de la pantalla de error de recursos.
 */
export default function CancelFallback() {
  useEffect(() => {
    // Indicar que la app React cargó e hidrató con éxito
    (window as any).__APP_INITIALIZED__ = true;
    
    // Si la pantalla de error se inyectó preventivamente por lentitud pero React ya cargó, removerla
    const errorScreen = document.getElementById('resource-error-screen');
    if (errorScreen) {
      errorScreen.remove();
    }
  }, []);

  return null;
}
