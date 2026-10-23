'use client';

import { useRef, useCallback } from 'react';

export interface UseTouchSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  maxPerpendicular?: number;
  disabled?: boolean;
}

export function useTouchSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 64,
  maxPerpendicular = 48,
  disabled = false,
}: UseTouchSwipeOptions) {
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isHorizontalGestureRef = useRef<boolean | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || e.touches.length !== 1) {
        startXRef.current = null;
        startYRef.current = null;
        isHorizontalGestureRef.current = null;
        return;
      }

      // Evitar interceptar toques en inputs, selectores o áreas con scroll horizontal propio
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, button, [data-no-swipe], .overflow-x-auto')) {
        startXRef.current = null;
        startYRef.current = null;
        isHorizontalGestureRef.current = null;
        return;
      }

      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
      isHorizontalGestureRef.current = null;
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || startXRef.current === null || startYRef.current === null) {
        return;
      }

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startXRef.current;
      const deltaY = currentY - startYRef.current;

      // Determinar si el gesto es primariamente horizontal
      if (isHorizontalGestureRef.current === null) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (absX > 10 || absY > 10) {
          isHorizontalGestureRef.current = absX > absY * 1.4;
        }
      }
    },
    [disabled]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (
        disabled ||
        startXRef.current === null ||
        startYRef.current === null ||
        isHorizontalGestureRef.current !== true
      ) {
        startXRef.current = null;
        startYRef.current = null;
        isHorizontalGestureRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startXRef.current;
      const deltaY = touch.clientY - startYRef.current;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX >= threshold && absY <= maxPerpendicular) {
        if (deltaX < 0) {
          onSwipeLeft?.();
        } else {
          onSwipeRight?.();
        }
      }

      startXRef.current = null;
      startYRef.current = null;
      isHorizontalGestureRef.current = null;
    },
    [disabled, threshold, maxPerpendicular, onSwipeLeft, onSwipeRight]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
