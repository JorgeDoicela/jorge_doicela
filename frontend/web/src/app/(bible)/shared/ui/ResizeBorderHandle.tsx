'use client';

import React, { useState, useCallback, useRef } from 'react';

export interface ResizeBorderHandleProps {
  side: 'left' | 'right';
  currentWidth: number;
  onResize: (newWidth: number) => void;
  onReset: () => void;
  onCollapse: () => void;
  collapseTitle?: string;
  className?: string;
}

export const ResizeBorderHandle: React.FC<ResizeBorderHandleProps> = ({
  side,
  currentWidth,
  onResize,
  onReset,
  onCollapse,
  collapseTitle,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{ startX: number; startWidth: number; hasMoved: boolean } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Solo botón izquierdo primario
      if (e.button !== 0) return;

      // Si el clic fue directamente en el botón de colapso o sus hijos, el botón se encarga
      const target = e.target as HTMLElement;
      if (target.closest('[data-collapse-btn]')) {
        return;
      }

      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragInfo.current = {
        startX: e.clientX,
        startWidth: currentWidth,
        hasMoved: false,
      };
    },
    [currentWidth]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragInfo.current) return;
      e.preventDefault();

      const deltaX = e.clientX - dragInfo.current.startX;

      // Solo si el desplazamiento supera el umbral de 3px se considera arrastre de redimensionamiento
      if (Math.abs(deltaX) > 3) {
        if (!dragInfo.current.hasMoved) {
          dragInfo.current.hasMoved = true;
          setIsDragging(true);
        }

        const newWidth =
          side === 'left'
            ? dragInfo.current.startWidth + deltaX
            : dragInfo.current.startWidth - deltaX;

        onResize(newWidth);
      }
    },
    [side, onResize]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragInfo.current) {
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Fallback silencioso si el puntero ya se liberó
        }

        const hadMoved = dragInfo.current.hasMoved;
        dragInfo.current = null;
        setIsDragging(false);

        // Si el usuario presionó y soltó sin arrastrar (clic en el borde divisorio), ocultar automáticamente
        if (!hadMoved) {
          onCollapse();
        }
      }
    },
    [onCollapse]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-collapse-btn]')) return;
      e.preventDefault();
      e.stopPropagation();
      onReset();
    },
    [onReset]
  );

  const handleCollapseClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onCollapse();
    },
    [onCollapse]
  );

  // Posicionamiento en el borde:
  // Lateral izquierdo: borde derecho (-right-3)
  // Lateral derecho: borde izquierdo (-left-3)
  const positionClass = side === 'left' ? '-right-3' : '-left-3';
  const defaultActionText = collapseTitle || 'Ocultar panel';

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      title={`${defaultActionText} (Clic) • Arrastra para cambiar tamaño`}
      className={`hidden lg:flex absolute top-0 ${positionClass} w-6 h-full cursor-col-resize z-40 group/border items-center justify-center select-none touch-none ${className}`}
    >
      {/* Línea divisoria reactiva al hover y activa durante el arrastre */}
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 transition-colors duration-150 ${
          isDragging
            ? 'w-1 bg-zinc-500 dark:bg-zinc-400'
            : 'w-0.5 bg-transparent group-hover/border:bg-zinc-400 dark:group-hover/border:bg-zinc-500'
        }`}
      />

      {/* Botón Flotante con Símbolo DIITRA (→|←) para Colapso Rápido */}
      <div
        data-collapse-btn="true"
        onClick={handleCollapseClick}
        title={collapseTitle || 'Ocultar panel'}
        className="relative z-10 w-6 h-7 rounded-md bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-700 shadow-xs opacity-0 group-hover/border:opacity-100 hover:scale-110 hover:border-zinc-500 dark:hover:border-zinc-400 transition-all duration-150 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200 pointer-events-none"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="2" x2="8" y2="14" />
          <polyline points="12 6 9 8 12 10" />
          <polyline points="4 6 7 8 4 10" />
        </svg>
      </div>
    </div>
  );
};
