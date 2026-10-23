'use client';

import { useRef, useCallback } from 'react';

export interface UseHeaderScrollBehaviorOptions {
  /** Zona superior donde las barras permanecen visibles en reposo (px). Default: 40 */
  reposeZonePx?: number;
  /** Desplazamiento acumulado hacia abajo para ocultar las barras con suavidad (px). Default: 30 */
  hideIntentPx?: number;
  /** Desplazamiento acumulado hacia arriba para revelar las barras (px). Default: 15 */
  revealIntentPx?: number;
  /** Margen inferior en px para revelar automáticamente las barras al final del pasaje. Default: 160 */
  bottomThresholdPx?: number;
  /** Deshabilitar el comportamiento de ocultamiento */
  disabled?: boolean;
}

/**
 * useHeaderScrollBehavior
 * Gestiona la visibilidad sincronizada de la barra superior y dock inferior
 * mediante traslación fluida por GPU sin alterar el flujo del documento ni provocar saltos de margen.
 */
export function useHeaderScrollBehavior(
  setIsVisible: ((v: boolean) => void) | undefined,
  {
    reposeZonePx = 40,
    hideIntentPx = 30,
    revealIntentPx = 15,
    bottomThresholdPx = 160,
    disabled = false,
  }: UseHeaderScrollBehaviorOptions = {},
) {
  const mainRef = useRef<HTMLElement>(null);
  const lastScrollTopRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  const handleMainScroll = useCallback(() => {
    const mainEl = mainRef.current;
    if (!mainEl || !setIsVisible || disabled) return;

    const currentScrollTop = Math.max(0, mainEl.scrollTop);
    const delta = currentScrollTop - lastScrollTopRef.current;

    // Ignorar micro-vibraciones menores a 2px
    if (Math.abs(delta) < 2) return;

    // 1. Zona de reposo inicial en la parte superior: siempre visible
    if (currentScrollTop <= reposeZonePx) {
      setIsVisible(true);
      accumulatedDeltaRef.current = 0;
      scrollDirectionRef.current = 'up';
      lastScrollTopRef.current = currentScrollTop;
      return;
    }

    // 2. Proximidad al final del capítulo: revelar barras para permitir navegación al siguiente libro/capítulo
    const scrollDistanceToBottom =
      mainEl.scrollHeight - currentScrollTop - mainEl.clientHeight;
    if (scrollDistanceToBottom <= bottomThresholdPx) {
      setIsVisible(true);
      accumulatedDeltaRef.current = 0;
      scrollDirectionRef.current = 'up';
      lastScrollTopRef.current = currentScrollTop;
      return;
    }

    // 3. Desplazamiento hacia abajo (lectura inmersiva)
    if (delta > 0) {
      if (scrollDirectionRef.current !== 'down') {
        scrollDirectionRef.current = 'down';
        accumulatedDeltaRef.current = 0;
      }
      accumulatedDeltaRef.current += delta;

      // Ocultar de forma inmediata y natural en el primer scroll deliberado
      if (accumulatedDeltaRef.current >= hideIntentPx) {
        setIsVisible(false);
      }
    } else if (delta < 0) {
      // 4. Desplazamiento hacia arriba (intención de navegación del usuario)
      if (scrollDirectionRef.current !== 'up') {
        scrollDirectionRef.current = 'up';
        accumulatedDeltaRef.current = 0;
      }
      accumulatedDeltaRef.current += Math.abs(delta);

      // Reaparecer de inmediato con un leve gesto ascendente
      if (accumulatedDeltaRef.current >= revealIntentPx) {
        setIsVisible(true);
      }
    }

    lastScrollTopRef.current = currentScrollTop;
  }, [disabled, hideIntentPx, reposeZonePx, revealIntentPx, bottomThresholdPx, setIsVisible]);

  return { mainRef, handleMainScroll };
}
