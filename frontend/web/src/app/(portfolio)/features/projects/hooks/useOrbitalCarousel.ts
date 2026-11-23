'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type React from 'react';

export interface OrbitalSlideStyle {
  transform: string;
  opacity: number;
  filter: string;
  zIndex: number;
  pointerEvents: 'auto' | 'none';
  isActive: boolean;
}

interface UseOrbitalCarouselOptions {
  total: number;
  resetKey: string | number | null;
  isActive: boolean;
}

const DRAG_ACTIVATION_PX = 8;
const DRAG_COMMIT_THRESHOLD_PX = 56;
const DRAG_STEP_PX = 340;
const WHEEL_COOLDOWN_MS = 380;

/**
 * Hook de ingeniería para la pasarela orbital 3D ("arco planetario").
 * Gestiona estado activo, física de arrastre por PointerEvents, navegación
 * por rueda horizontal y teclado, y cálculo determinista de matrices 3D GPU.
 */
export function useOrbitalCarousel({
  total,
  resetKey,
  isActive,
}: UseOrbitalCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const pointerStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const isDragEngagedRef = useRef(false);
  const wasDraggingRef = useRef(false);
  const lastWheelAtRef = useRef(0);

  // Reiniciar al primer slide cuando cambia el proyecto o se reabre el visor
  useEffect(() => {
    setActiveIndex(0);
    setDragOffsetPx(0);
    setIsDragging(false);
    pointerStartRef.current = null;
    isDragEngagedRef.current = false;
  }, [resetKey, isActive]);

  const goTo = useCallback(
    (index: number) => {
      if (total <= 0) return;
      const clamped = Math.max(0, Math.min(total - 1, index));
      setActiveIndex(clamped);
    },
    [total],
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : prev));
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Navegación por teclado (← / →) mientras el visor está activo
  useEffect(() => {
    if (!isActive || total <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, total, goNext, goPrev]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      // No interceptar clics sobre enlaces o botones interactivos
      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, video')) return;

      pointerStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        pointerId: e.pointerId,
      };
      isDragEngagedRef.current = false;
      wasDraggingRef.current = false;
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStartRef.current;
      if (!start) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      if (!isDragEngagedRef.current) {
        if (Math.abs(dx) < DRAG_ACTIVATION_PX) return;
        // Si el gesto es primordialmente vertical, no activar arrastre orbital
        if (Math.abs(dy) > Math.abs(dx)) {
          pointerStartRef.current = null;
          return;
        }
        isDragEngagedRef.current = true;
        wasDraggingRef.current = true;
        setIsDragging(true);
        e.currentTarget.setPointerCapture(start.pointerId);
      }

      // Resistencia elástica en los extremos de la pasarela
      const atStartBoundary = activeIndex === 0 && dx > 0;
      const atEndBoundary = activeIndex === total - 1 && dx < 0;
      const dampedDx = atStartBoundary || atEndBoundary ? dx * 0.28 : dx;

      setDragOffsetPx(dampedDx);
    },
    [activeIndex, total],
  );

  const finishDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStartRef.current;
      if (!start) return;

      if (isDragEngagedRef.current) {
        if (e.currentTarget.hasPointerCapture(start.pointerId)) {
          e.currentTarget.releasePointerCapture(start.pointerId);
        }

        if (dragOffsetPx <= -DRAG_COMMIT_THRESHOLD_PX && activeIndex < total - 1) {
          setActiveIndex((prev) => prev + 1);
        } else if (dragOffsetPx >= DRAG_COMMIT_THRESHOLD_PX && activeIndex > 0) {
          setActiveIndex((prev) => prev - 1);
        }
      }

      pointerStartRef.current = null;
      isDragEngagedRef.current = false;
      setIsDragging(false);
      setDragOffsetPx(0);
    },
    [dragOffsetPx, activeIndex, total],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (total <= 1) return;
      const isHorizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 22;
      if (!isHorizontalIntent) return;

      const now = Date.now();
      if (now - lastWheelAtRef.current < WHEEL_COOLDOWN_MS) return;
      lastWheelAtRef.current = now;

      if (e.deltaX > 0) {
        goNext();
      } else {
        goPrev();
      }
    },
    [total, goNext, goPrev],
  );

  const handleCardSelect = useCallback(
    (index: number) => {
      if (wasDraggingRef.current) {
        wasDraggingRef.current = false;
        return;
      }
      if (index !== activeIndex) {
        goTo(index);
      }
    },
    [activeIndex, goTo],
  );

  /**
   * Calcula la transformación 3D sobre la curvatura orbital ("medio planeta")
   * para cada tarjeta en función de su distancia continua al centro.
   */
  const getSlideStyle = useCallback(
    (index: number): OrbitalSlideStyle => {
      const continuousOffset = index - activeIndex + dragOffsetPx / DRAG_STEP_PX;
      const absOffset = Math.abs(continuousOffset);
      const clampedOffset = Math.max(-2.6, Math.min(2.6, continuousOffset));

      // Arco convexo: separación horizontal + caída parabólica en Y + profundidad Z + rotación Y
      const translateXPercent = clampedOffset * 64;
      const translateYPx = Math.min(72, absOffset * absOffset * 18);
      const translateZPx = -Math.min(340, absOffset * 155);
      const rotateYDeg = clampedOffset * 20;
      const scale = Math.max(0.74, 1 - absOffset * 0.13);

      const isVisible = absOffset <= 2.35;
      const opacity = !isVisible
        ? 0
        : absOffset < 0.04
          ? 1
          : Math.max(0.18, 1 - absOffset * 0.48);

      const blurPx = absOffset < 0.06 ? 0 : Math.min(2.2, absOffset * 1.05);
      const zIndex = Math.max(1, Math.round(50 - absOffset * 20));

      return {
        transform: `perspective(1200px) translate3d(${translateXPercent}%, ${translateYPx}px, ${translateZPx}px) rotateY(${rotateYDeg}deg) scale(${scale})`,
        opacity,
        filter: blurPx > 0 ? `blur(${blurPx.toFixed(2)}px)` : 'none',
        zIndex,
        pointerEvents: isVisible ? 'auto' : 'none',
        isActive: index === activeIndex && !isDragging,
      };
    },
    [activeIndex, dragOffsetPx, isDragging],
  );

  return {
    activeIndex,
    isDragging,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < total - 1,
    goTo,
    goNext,
    goPrev,
    getSlideStyle,
    handleCardSelect,
    stageHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
      onWheel: handleWheel,
    },
  };
}
