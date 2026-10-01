'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface ResizeBorderHandleProps {
  side: 'left' | 'right';
  currentWidth: number;
  onResize: (newWidth: number) => void;
  onReset: () => void;
  onCollapse: () => void;
  collapseThreshold?: number;
  collapseTitle?: string;
  onDragStateChange?: (isDragging: boolean) => void;
  className?: string;
}

const MIN_PANEL_WIDTH = 200;
const MAX_PANEL_WIDTH = 480;
const DEFAULT_RESTORE_LEFT = 280;
const DEFAULT_RESTORE_RIGHT = 340;

export const ResizeBorderHandle: React.FC<ResizeBorderHandleProps> = ({
  side,
  currentWidth,
  onResize,
  onReset,
  onCollapse,
  collapseThreshold = 175,
  collapseTitle,
  onDragStateChange,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{
    startX: number;
    startWidth: number;
    hasMoved: boolean;
    currentTentativeWidth: number;
  } | null>(null);

  // Limpieza defensiva de estilos globales de arrastre si se desmonta
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Solo botón primario del ratón
      if (e.button !== 0) return;

      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture fallback
      }

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      dragInfo.current = {
        startX: e.clientX,
        startWidth: currentWidth,
        hasMoved: false,
        currentTentativeWidth: currentWidth,
      };
    },
    [currentWidth]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragInfo.current) return;
      e.preventDefault();

      const deltaX = e.clientX - dragInfo.current.startX;

      // Discriminación precisa: más de 3px de desplazamiento es arrastre
      if (Math.abs(deltaX) > 3) {
        if (!dragInfo.current.hasMoved) {
          dragInfo.current.hasMoved = true;
          setIsDragging(true);
          onDragStateChange?.(true);
        }

        const rawTentativeWidth =
          side === 'left'
            ? dragInfo.current.startWidth + deltaX
            : dragInfo.current.startWidth - deltaX;

        const tentativeWidth = Math.min(MAX_PANEL_WIDTH, rawTentativeWidth);
        dragInfo.current.currentTentativeWidth = tentativeWidth;

        // Snap final solo en el extremo absoluto (< 80px pegado a la pared)
        if (tentativeWidth < 80) {
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // fallback
          }
          document.body.style.cursor = '';
          document.body.style.userSelect = '';

          const healthyRestoreWidth =
            dragInfo.current.startWidth >= MIN_PANEL_WIDTH
              ? dragInfo.current.startWidth
              : side === 'left'
              ? DEFAULT_RESTORE_LEFT
              : DEFAULT_RESTORE_RIGHT;

          dragInfo.current = null;
          setIsDragging(false);
          onDragStateChange?.(false);

          onResize(healthyRestoreWidth);
          onCollapse();
          return;
        }

        // Arrastre fluido y continuo: el panel se va difuminando gradualmente en StudySidePanel
        onResize(Math.max(90, tentativeWidth));
      }
    },
    [side, onResize, onDragStateChange, onCollapse]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragInfo.current) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // fallback
        }

        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        const hadMoved = dragInfo.current.hasMoved;
        const finalTentativeWidth = dragInfo.current.currentTentativeWidth;
        const isBelowThreshold = finalTentativeWidth < collapseThreshold;
        const healthyRestoreWidth =
          dragInfo.current.startWidth >= MIN_PANEL_WIDTH
            ? dragInfo.current.startWidth
            : side === 'left'
            ? DEFAULT_RESTORE_LEFT
            : DEFAULT_RESTORE_RIGHT;

        dragInfo.current = null;
        setIsDragging(false);
        onDragStateChange?.(false);

        // Si fue un clic simple (sin arrastre) o si se soltó bajo el umbral donde ya estaba difuminado -> colapsar
        if (!hadMoved || isBelowThreshold) {
          onResize(healthyRestoreWidth);
          onCollapse();
        } else {
          // Si soltó fuera de la zona de colapso, descansar exactamente en la posición deseada
          const clamped = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, finalTentativeWidth));
          onResize(clamped);
        }
      }
    },
    [side, collapseThreshold, onCollapse, onResize, onDragStateChange]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onReset();
    },
    [onReset]
  );

  const positionClass = side === 'left' ? '-right-3' : '-left-3';
  const defaultActionText = collapseTitle || 'Ocultar panel';

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      title={`${defaultActionText} (Clic) • Arrastra para cambiar tamaño o colapsar`}
      className={`hidden lg:flex absolute top-0 ${positionClass} w-6 h-full cursor-col-resize z-40 group/border items-center justify-center select-none touch-none ${className}`}
    >
      {/* Línea divisoria reactiva: exactamente 1px, nítida, sobria y neutra (estilo Geist / DIITRA) */}
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] transition-colors duration-150 ${
          isDragging
            ? 'bg-zinc-400 dark:bg-zinc-500'
            : 'bg-transparent group-hover/border:bg-zinc-300 dark:group-hover/border:bg-zinc-700'
        }`}
      />
    </div>
  );
};
