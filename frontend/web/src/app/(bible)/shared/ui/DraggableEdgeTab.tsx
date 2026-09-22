'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LucideIcon, ChevronRight, ChevronLeft } from 'lucide-react';

interface DraggableEdgeTabProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onOpen: () => void;
  icon: LucideIcon;
  label?: string;
  storageKey: string;
  defaultTop?: number;
  title?: string;
  hideOnDesktop?: boolean;
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
  hideOnDesktop = false,
}) => {
  const isLeft = side === 'left';
  const BUTTON_HEIGHT = 96; // Altura del tirador vertical esbelto h-24 (96px)

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [topPos, setTopPos] = useState<number>(defaultTop);
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const startPointerRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef({ y: 0 });
  const hasMovedRef = useRef(false);

  // Detección responsiva de móvil (< 1024px) y carga de posición en escritorio
  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia('(max-width: 1023.98px)');
    const checkMobile = () => {
      setIsMobile(mql.matches);
    };
    checkMobile();

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
      // storage fallback
    }

    const handleResize = () => {
      checkMobile();
      if (!isDraggingRef.current) {
        setTopPos((prev) => {
          const maxY = Math.max(64, window.innerHeight - BUTTON_HEIGHT - 16);
          return Math.min(prev, maxY);
        });
      }
    };

    mql.addEventListener('change', checkMobile);
    window.addEventListener('resize', handleResize);
    return () => {
      mql.removeEventListener('change', checkMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, [storageKey]);

  // Manejo de puntero para el tirador de escritorio (Pointer Events)
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

      if (!hasMovedRef.current) {
        if (distance <= 6) return;
        hasMovedRef.current = true;
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      // En escritorio: Arrastre vertical acotado y translación X hacia adentro
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      const maxInward = Math.max(120, screenW * 0.45);
      const inwardX = isLeft
        ? Math.max(0, Math.min(maxInward, deltaX))
        : Math.min(0, Math.max(-maxInward, deltaX));

      const minY = 64;
      const maxY = Math.max(minY, screenH - BUTTON_HEIGHT - 16);
      const newY = Math.max(minY, Math.min(maxY, startPosRef.current.y + deltaY));

      setDragOffsetX(inwardX);
      setTopPos(newY);
    },
    [isLeft]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const wasDeliberateDrag = hasMovedRef.current;

      startPointerRef.current = null;
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragOffsetX(0);

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // fallback
      }

      if (wasDeliberateDrag) {
        // En escritorio se persiste la posición vertical si hubo arrastre deliberado
        try {
          localStorage.setItem(`${storageKey}_y`, topPos.toString());
          localStorage.setItem(storageKey, topPos.toString());
        } catch {
          // storage fallback
        }
      }
    },
    [storageKey, topPos]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      // Si el usuario realizó un arrastre deliberado, no abrir el panel
      if (hasMovedRef.current) {
        hasMovedRef.current = false;
        return;
      }
      onOpen();
    },
    [onOpen]
  );

  const handlePointerCancel = useCallback(() => {
    startPointerRef.current = null;
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragOffsetX(0);
  }, []);

  if (!isMounted) return null;

  const computedTitle = title || (label ? `Abrir (${label})` : 'Abrir panel');

  // En móvil: Botones flotantes inferiores ergonómicos con respuesta táctil inmediata
  if (isMobile) {
    return (
      <button
        type="button"
        onClick={onOpen}
        style={{
          left: isLeft ? 'calc(16px + env(safe-area-inset-left, 0px))' : undefined,
          right: !isLeft ? 'calc(16px + env(safe-area-inset-right, 0px))' : undefined,
          bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        }}
        title={computedTitle}
        aria-label={computedTitle}
        className={`fixed z-40 w-12 h-12 rounded-full flex items-center justify-center select-none print:hidden border shadow-lg cursor-pointer transition-[opacity,transform,background-color,border-color,box-shadow] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] text-foreground hover:scale-105 active:scale-90 ${
          isOpen
            ? 'opacity-0 pointer-events-none scale-75'
            : 'opacity-100 pointer-events-auto scale-100'
        }`}
      >
        <Icon className="w-5 h-5 text-foreground shrink-0 transition-transform" />
      </button>
    );
  }

  // En escritorio (lg:): Si hideOnDesktop está activo (Enfoque A), el lienzo queda 100% limpio
  if (hideOnDesktop) return null;

  // En escritorio (lg:): Tirador vertical esbelto y estilizado en el borde (proporción 1:3)
  const DesktopIcon = isLeft ? ChevronRight : ChevronLeft;

  return (
    <button
      type="button"
      onClick={handleClick}
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
          : 'transition-[opacity,transform,background-color,border-color,color,border-radius,box-shadow] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]'
      } ${
        isOpen
          ? `opacity-0 pointer-events-none ${isLeft ? '-translate-x-full' : 'translate-x-full'}`
          : 'opacity-100 pointer-events-auto'
      } ${
        isDragging
          ? 'w-10 h-10 rounded-xl border-zinc-300 dark:border-zinc-600 shadow-xl cursor-grabbing bg-white dark:bg-[#18181b] text-zinc-900 dark:text-white scale-105'
          : isLeft
          ? 'w-5 h-24 rounded-r-md border-l-0 border-r border-y pl-0.5 shadow-2xs border-zinc-200 dark:border-zinc-800 cursor-grab active:cursor-grabbing bg-white dark:bg-[#121214] hover:w-5.5 hover:border-zinc-400/80 dark:hover:border-zinc-600/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          : 'w-5 h-24 rounded-l-md border-r-0 border-l border-y pr-0.5 shadow-2xs border-zinc-200 dark:border-zinc-800 cursor-grab active:cursor-grabbing bg-white dark:bg-[#121214] hover:w-5.5 hover:border-zinc-400/80 dark:hover:border-zinc-600/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`}
    >
      <DesktopIcon
        className={`shrink-0 transition-all duration-200 ${
          isDragging
            ? 'w-4 h-4'
            : isLeft
            ? 'w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:scale-110'
            : 'w-3.5 h-3.5 group-hover:-translate-x-0.5 group-hover:scale-110'
        }`}
      />
    </button>
  );
};
