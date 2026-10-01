'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface EdgePeekStripProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onOpen: () => void;
  openThreshold?: number;
  title?: string;
  className?: string;
}

export const EdgePeekStrip: React.FC<EdgePeekStripProps> = ({
  side,
  isOpen,
  onOpen,
  openThreshold = 50,
  title,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragInfo = useRef<{ startX: number; hasMoved: boolean; inwardDist: number } | null>(null);

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
        hasMoved: false,
        inwardDist: 0,
      };
      setIsDragging(true);
      setDragOffset(0);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragInfo.current) return;
      e.preventDefault();

      const deltaX = e.clientX - dragInfo.current.startX;
      const inwardDist = side === 'left' ? deltaX : -deltaX;

      if (Math.abs(deltaX) > 4) {
        dragInfo.current.hasMoved = true;
      }

      dragInfo.current.inwardDist = Math.max(0, inwardDist);
      setDragOffset(Math.max(0, Math.min(220, inwardDist)));
    },
    [side]
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
        const inwardDist = dragInfo.current.inwardDist;

        dragInfo.current = null;
        setIsDragging(false);
        setDragOffset(0);

        // Clic simple o arrastre que supera el umbral hacia el centro
        if (!hadMoved || inwardDist >= openThreshold) {
          onOpen();
        }
      }
    },
    [openThreshold, onOpen]
  );

  // Solo se muestra en desktop (lg:) cuando el panel está cerrado
  if (isOpen) return null;

  const isLeft = side === 'left';
  const positionClasses = isLeft ? 'left-0' : 'right-0';
  const label = title || (isLeft ? 'Expandir panel de navegación' : 'Expandir inspector exegético');

  return (
    <>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title={`${label} (Clic o arrastra hacia adentro)`}
        aria-label={label}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
        className={`hidden lg:flex fixed top-14 bottom-0 ${positionClasses} w-1.5 z-35 cursor-col-resize group select-none touch-none items-center justify-center ${className}`}
      >
        {/* Tira visible al hacer hover: pequeña, estilizada, centrada y sin ocupar toda la pantalla */}
        <div
          className={`h-28 w-[1px] rounded-full transition-all duration-200 ${
            isDragging
              ? 'bg-zinc-400 dark:bg-zinc-500 h-44'
              : 'bg-transparent group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700'
          }`}
        />
      </div>

      {/* Previsualización en vivo (Peek Ghost Bar) mientras el usuario arrastra hacia adentro */}
      {isDragging && dragOffset > 10 && (
        <div
          style={{
            [isLeft ? 'left' : 'right']: 0,
            width: `${dragOffset}px`,
          }}
          className="hidden lg:block fixed top-14 bottom-0 z-30 pointer-events-none bg-zinc-500/10 dark:bg-zinc-400/10 border-r border-zinc-300/40 dark:border-zinc-700/40 backdrop-blur-xs transition-none"
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              isLeft ? 'right-2' : 'left-2'
            } px-2 py-0.5 rounded bg-zinc-900/85 dark:bg-zinc-100/90 text-white dark:text-black text-[10px] font-mono tracking-tight`}
          >
            {dragOffset >= openThreshold ? 'Soltar para abrir' : 'Arrastra más...'}
          </div>
        </div>
      )}
    </>
  );
};
