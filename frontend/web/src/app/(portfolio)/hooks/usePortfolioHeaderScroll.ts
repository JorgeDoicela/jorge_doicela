'use client';

import { useState, useEffect, useRef } from 'react';

export interface UsePortfolioHeaderScrollOptions {
  /**
   * Zona de reposo superior en píxeles donde la cabecera permanece fija y visible.
   * Por defecto: 80 px.
   */
  reposeZonePx?: number;
  /**
   * Desplazamiento acumulado hacia abajo necesario para ocultar la cabecera.
   * Por defecto: 100 px.
   */
  hideIntentPx?: number;
  /**
   * Desplazamiento acumulado hacia arriba necesario para revelar la cabecera.
   * Por defecto: 25 px.
   */
  revealIntentPx?: number;
}

/**
 * usePortfolioHeaderScroll
 * Hook de ingeniería para control dinámico de visibilidad de cabecera con aceleración por hardware.
 */
export function usePortfolioHeaderScroll({
  reposeZonePx = 80,
  hideIntentPx = 100,
  revealIntentPx = 25,
}: UsePortfolioHeaderScrollOptions = {}): boolean {
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    lastScrollYRef.current = Math.max(0, window.scrollY);

    const updateVisibility = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollYRef.current;

      // Descartar micro-vibraciones menores a 2px
      if (Math.abs(delta) < 2) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // 1. Zona de reposo superior: siempre visible en el tope
      if (currentScrollY <= reposeZonePx) {
        setIsVisible(true);
        accumulatedDeltaRef.current = 0;
        scrollDirectionRef.current = 'up';
      } else if (delta > 0) {
        // 2. Desplazamiento hacia abajo
        if (scrollDirectionRef.current !== 'down') {
          scrollDirectionRef.current = 'down';
          accumulatedDeltaRef.current = 0;
        }

        const effectiveDelta =
          lastScrollYRef.current <= reposeZonePx
            ? currentScrollY - reposeZonePx
            : delta;

        if (effectiveDelta > 0) {
          accumulatedDeltaRef.current += effectiveDelta;
        }

        if (accumulatedDeltaRef.current >= hideIntentPx) {
          setIsVisible(false);
        }
      } else if (delta < 0) {
        // 3. Desplazamiento hacia arriba
        if (scrollDirectionRef.current !== 'up') {
          scrollDirectionRef.current = 'up';
          accumulatedDeltaRef.current = 0;
        }

        accumulatedDeltaRef.current += Math.abs(delta);

        if (accumulatedDeltaRef.current >= revealIntentPx) {
          setIsVisible(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        updateVisibility();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [reposeZonePx, hideIntentPx, revealIntentPx]);

  return isVisible;
}
