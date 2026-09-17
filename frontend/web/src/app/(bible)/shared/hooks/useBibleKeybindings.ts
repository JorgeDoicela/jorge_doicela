'use client';

import { useEffect } from 'react';

export interface BibleKeybindingActions {
  onToggleLeftSidebar?: () => void;
  onToggleRightInspector?: () => void;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  onCloseInspector?: () => void;
}

export function useBibleKeybindings({
  onToggleLeftSidebar,
  onToggleRightInspector,
  onPrevChapter,
  onNextChapter,
  onCloseInspector,
}: BibleKeybindingActions) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // No interceptar si el usuario está escribiendo en un input, textarea o elemento editable
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        // En inputs, solo permitir que Escape cierre sugerencias/foco
        if (event.key === 'Escape') {
          (activeElement as HTMLElement).blur();
        }
        return;
      }

      // Atajo '[': Alternar panel de navegación canónica izquierdo
      if (event.key === '[') {
        event.preventDefault();
        onToggleLeftSidebar?.();
        return;
      }

      // Atajo ']': Alternar panel de inspección exegética derecho
      if (event.key === ']') {
        event.preventDefault();
        onToggleRightInspector?.();
        return;
      }

      // Atajo 'Escape': Cerrar inspector exegético
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseInspector?.();
        return;
      }

      // Atajo 'ArrowLeft': Capítulo anterior
      if (event.key === 'ArrowLeft' && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        onPrevChapter?.();
        return;
      }

      // Atajo 'ArrowRight': Capítulo siguiente
      if (event.key === 'ArrowRight' && !event.altKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        onNextChapter?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onToggleLeftSidebar,
    onToggleRightInspector,
    onPrevChapter,
    onNextChapter,
    onCloseInspector,
  ]);
}
