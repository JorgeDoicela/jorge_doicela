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
  const BUTTON_WIDTH = 42;
  const BUTTON_HEIGHT = 46;

  const [topPos, setTopPos] = useState<number>(defaultTop);
  const [dragX, setDragX] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
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

    // Inicializar dragX en el borde correspondiente
    setDragX(isLeft ? 0 : window.innerWidth - BUTTON_WIDTH);

    const handleResize = () => {
      if (!isDraggingRef.current) {
        setDragX(isLeft ? 0 : window.innerWidth - BUTTON_WIDTH);
        setTopPos((prev) => {
          const maxY = Math.max(64, window.innerHeight - BUTTON_HEIGHT - 16);
          return Math.min(prev, maxY);
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLeft, storageKey]);

  // Manejo de puntero para arrastre con restricción al 25% de pantalla y auto-snap al borde estilo Messenger
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedRef.current = false;

    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = {
      x: isLeft ? 0 : window.innerWidth - BUTTON_WIDTH,
      y: topPos,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // fallback
    }
  }, [isLeft, topPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - startPointerRef.current.x;
    const deltaY = e.clientY - startPointerRef.current.y;

    if (Math.hypot(deltaX, deltaY) > 5) {
      hasMovedRef.current = true;
    }

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Restricción: No puede pasar del 25% de la pantalla hacia el centro
    let newX = 0;
    if (isLeft) {
      const maxLeftX = Math.max(BUTTON_WIDTH, screenW * 0.25 - BUTTON_WIDTH);
      newX = Math.max(0, Math.min(maxLeftX, startPosRef.current.x + deltaX));
    } else {
      const minRightX = Math.min(screenW - BUTTON_WIDTH, screenW * 0.75);
      newX = Math.max(minRightX, Math.min(screenW - BUTTON_WIDTH, startPosRef.current.x + deltaX));
    }

    // Límites verticales
    const minY = 64; // Debajo del header
    const maxY = Math.max(minY, screenH - BUTTON_HEIGHT - 16);
    const newY = Math.max(minY, Math.min(maxY, startPosRef.current.y + deltaY));

    setDragX(newX);
    setTopPos(newY);
  }, [isLeft]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // fallback
    }

    // Snap obligatorio al borde estilo Messenger (siempre pegado al borde al soltarlo)
    const edgeX = isLeft ? 0 : window.innerWidth - BUTTON_WIDTH;
    setDragX(edgeX);

    if (hasMovedRef.current) {
      // Guardar posición vertical definitiva en localStorage
      try {
        localStorage.setItem(`${storageKey}_y`, topPos.toString());
        localStorage.setItem(storageKey, topPos.toString());
      } catch {
        // storage fallback
      }
    } else {
      // Clic simple sin arrastre: abrir el panel
      onOpen();
    }
  }, [isLeft, onOpen, storageKey, topPos]);

  const handlePointerCancel = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragX(isLeft ? 0 : window.innerWidth - BUTTON_WIDTH);
  }, [isLeft]);

  if (isOpen || !isMounted) return null;

  const computedTitle = title || (label ? `Abrir (${label})` : 'Abrir panel');

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        left: isLeft && !isDragging ? 0 : isLeft ? `${dragX}px` : undefined,
        right: !isLeft && !isDragging ? 0 : !isLeft ? `${window.innerWidth - dragX - BUTTON_WIDTH}px` : undefined,
        top: `${topPos}px`,
      }}
      title={computedTitle}
      aria-label={computedTitle}
      className={`fixed z-40 flex items-center justify-center select-none group touch-none print:hidden ${
        isDragging
          ? 'w-12 h-12 rounded-2xl border border-zinc-300 dark:border-zinc-700 ring-2 ring-primary/40 shadow-2xl scale-110 cursor-grabbing bg-white dark:bg-[#0a0a0a]'
          : isLeft
          ? 'w-10 sm:w-11 h-12 left-0 rounded-r-2xl border-y border-r border-l-0 border-zinc-200/90 dark:border-zinc-800 shadow-md hover:shadow-lg hover:w-12 cursor-grab active:cursor-grabbing bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md transition-[width,background-color,border-color,box-shadow]'
          : 'w-10 sm:w-11 h-12 right-0 rounded-l-2xl border-y border-l border-r-0 border-zinc-200/90 dark:border-zinc-800 shadow-md hover:shadow-lg hover:w-12 cursor-grab active:cursor-grabbing bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md transition-[width,background-color,border-color,box-shadow]'
      } text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white ${
        !isDragging ? 'transition-[left,right,top,border-radius,transform] duration-200 ease-out' : ''
      }`}
    >
      <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
    </button>
  );
};
