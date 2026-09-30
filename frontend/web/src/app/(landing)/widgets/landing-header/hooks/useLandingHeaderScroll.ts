'use client';

import { useState, useEffect, useRef } from 'react';

export interface UseLandingHeaderScrollOptions {
  /**
   * Zona de reposo superior en píxeles donde la cabecera permanece fija y visible.
   * Por defecto: 80 px.
   */
  reposeZonePx?: number;
  /**
   * Desplazamiento acumulado hacia abajo necesario para ocultar la cabecera.
   * Evita ocultamientos por micro-scrolls accidentales o deslizamientos leves.
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
 * useLandingHeaderScroll
 * Hook de ingeniería para control dinámico de visibilidad de cabecera con aceleración por hardware.
 *
 * Principios de diseño:
 * 1. Zona de reposo superior: la cabecera se mantiene siempre visible cuando scrollY <= reposeZonePx.
 * 2. Filtrado de ruido: ignora variaciones menores a 2px y rebotes elásticos (iOS Rubber-Banding).
 * 3. Histeresis de intención: acumula desplazamiento direccional antes de alternar estado.
 * 4. 60/120 FPS: sincronizado mediante requestAnimationFrame y listener pasivo.
 */
export function useLandingHeaderScroll({
  reposeZonePx = 80,
  hideIntentPx = 100,
  revealIntentPx = 25,
}: UseLandingHeaderScrollOptions = {}): boolean {
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Inicializar con la posición real actual del navegador
    lastScrollYRef.current = Math.max(0, window.scrollY);

    const updateVisibility = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollYRef.current;

      // Descartar micro-vibraciones menores a 2px
      if (Math.abs(delta) < 2) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // 1. Zona de reposo superior: en el tope siempre permanece 100% visible
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

        // Ocultar únicamente tras una intención de descenso deliberada
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

        // Revelar con sensibilidad ágil ante cualquier intención de retorno
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
