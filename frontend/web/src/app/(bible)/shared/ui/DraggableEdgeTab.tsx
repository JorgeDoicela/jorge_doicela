'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LucideIcon } from 'lucide-react';

interface DraggableEdgeTabProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onOpen: () => void;
  icon: LucideIcon;
  label?: string;
  storageKey: string;
  defaultTop?: number;
  title?: string;
}

export const DraggableEdgeTab: React.FC<DraggableEdgeTabProps> = ({
  side,
  isOpen,
  onOpen,
  icon: Icon,
  label,
  storageKey,
  defaultTop = 180,
  title,
}) => {
  const isLeft = side === 'left';
  const BUTTON_HEIGHT = 44;

  const [topPos, setTopPos] = useState<number>(defaultTop);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const startPointerRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef({ y: 0 });
  const hasMovedRef = useRef(false);

  // Cargar posición vertical guardada desde localStorage
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    try {
      const savedY = localStorage.getItem(`${storageKey}_y`) || localStorage.getItem(storageKey);
      if (savedY) {
        const parsedY = Number(savedY);
        const minY = 64;
        const maxY = Math.max(minY, window.innerHeight - BUTTON_HEIGHT - 16);
        if (!isNaN(parsedY)) {
          setTopPos(Math.max(minY, Math.min(maxY, parsedY)));
        }
      }
    } catch {
      // fallback
    }

    const handleResize = () => {
      if (!isDraggingRef.current) {
        setTopPos((prev) => {
          const maxY = Math.max(64, window.innerHeight - BUTTON_HEIGHT - 16);
          return Math.min(prev, maxY);
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [storageKey]);

  // Manejo de puntero: discriminación estricta entre clic (apertura instantánea) y arrastre deliberado (> 8px)
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;

      isDraggingRef.current = false;
      hasMovedRef.current = false;

      startPointerRef.current = { x: e.clientX, y: e.clientY };
      startPosRef.current = { y: topPos };
      setDragOffsetX(0);

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // fallback
      }
    },
    [topPos]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!startPointerRef.current) return;

      const deltaX = e.clientX - startPointerRef.current.x;
      const deltaY = e.clientY - startPointerRef.current.y;
      const distance = Math.hypot(deltaX, deltaY);

      // Solo si el desplazamiento supera 8px se entra en modo arrastre
      if (!hasMovedRef.current) {
        if (distance <= 8) return;
        hasMovedRef.current = true;
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Movimiento libre en X hacia adentro de la pantalla (hasta 45% del ancho de pantalla)
      const maxInward = Math.max(120, screenW * 0.45);
      const inwardX = isLeft
        ? Math.max(0, Math.min(maxInward, deltaX))
        : Math.min(0, Math.max(-maxInward, deltaX));

      // Movimiento libre en Y acotado a la altura visible
      const minY = 64; // Debajo del header de estudio
      const maxY = Math.max(minY, screenH - BUTTON_HEIGHT - 16);
      const newY = Math.max(minY, Math.min(maxY, startPosRef.current.y + deltaY));

      setDragOffsetX(inwardX);
      setTopPos(newY);
    },
    [isLeft]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const wasDragging = hasMovedRef.current;

      startPointerRef.current = null;
      isDraggingRef.current = false;
      setIsDragging(false);

      // Snap-back magnético al borde: vuelve a translateX(0)
      setDragOffsetX(0);

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // fallback
      }

      if (wasDragging) {
        // Solo si realmente hubo arrastre deliberado, persistir posición
        try {
          localStorage.setItem(`${storageKey}_y`, topPos.toString());
          localStorage.setItem(storageKey, topPos.toString());
        } catch {
          // storage fallback
        }
      } else {
        // Clic limpio: abrir inmediatamente el panel
        onOpen();
      }
    },
    [onOpen, storageKey, topPos]
  );

  const handlePointerCancel = useCallback(() => {
    startPointerRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffsetX(0);
  }, []);

  if (!isMounted) return null;

  const computedTitle = title || (label ? `Abrir (${label})` : 'Abrir panel');

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        left: isLeft ? 0 : undefined,
        right: !isLeft ? 0 : undefined,
        top: `${topPos}px`,
        transform:
          isDragging && dragOffsetX !== 0
            ? `translate3d(${dragOffsetX}px, 0, 0)`
            : 'translate3d(0, 0, 0)',
      }}
      title={computedTitle}
      aria-label={computedTitle}
      className={`fixed z-40 flex items-center justify-center select-none group touch-none print:hidden border ${
        isDragging
          ? 'transition-none'
          : 'transition-[opacity,transform,background-color,border-color,color,border-radius,box-shadow] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)]'
      } ${
        isOpen
          ? `opacity-0 pointer-events-none ${isLeft ? '-translate-x-full' : 'translate-x-full'}`
          : 'opacity-100 pointer-events-auto'
      } ${
        isDragging
          ? 'w-11 h-11 rounded-2xl border-zinc-300 dark:border-zinc-600 shadow-xl cursor-grabbing bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white scale-105'
          : isLeft
          ? 'w-9 h-11 rounded-r-xl border-l-0 border-r border-y pl-1 shadow-xs border-zinc-200/90 dark:border-zinc-800/90 cursor-grab active:cursor-grabbing bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md hover:border-zinc-400/80 dark:hover:border-zinc-600/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm'
          : 'w-9 h-11 rounded-l-xl border-r-0 border-l border-y pr-1 shadow-xs border-zinc-200/90 dark:border-zinc-800/90 cursor-grab active:cursor-grabbing bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md hover:border-zinc-400/80 dark:hover:border-zinc-600/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm'
      }`}
    >
      <Icon
        className={`shrink-0 transition-transform duration-200 ${
          isDragging
            ? 'w-4.5 h-4.5'
            : 'w-4 h-4 group-hover:scale-110'
        }`}
      />
    </button>
  );
};
