import { useRef } from 'react';

interface UseHeaderScrollBehaviorOptions {
  /** Zona superior donde la cabecera es inamovible (px). Default: 200 */
  reposeZonePx?: number;
  /** Desplazamiento acumulado hacia abajo para ocultar la cabecera (px). Default: 80 */
  hideIntentPx?: number;
  /** Desplazamiento acumulado hacia arriba para revelar la cabecera (px). Default: 25 */
  revealIntentPx?: number;
}

/**
 * useHeaderScrollBehavior
 * Gestiona la visibilidad de la cabecera en función del comportamiento de scroll
 * del elemento de contenido principal del workspace de estudio bíblico.
 *
 * - Zona de reposo superior: la cabecera permanece fija en los primeros reposeZonePx.
 * - Scroll sostenido hacia abajo: oculta la cabecera tras hideIntentPx acumulados.
 * - Cualquier intento de subir: revela la cabecera de forma inmediata y sensible.
 */
export function useHeaderScrollBehavior(
  setIsHeaderVisible: ((v: boolean) => void) | undefined,
  {
    reposeZonePx = 200,
    hideIntentPx = 80,
    revealIntentPx = 25,
  }: UseHeaderScrollBehaviorOptions = {},
) {
  const mainRef = useRef<HTMLElement>(null);
  const lastScrollTopRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');

  const handleMainScroll = () => {
    const mainEl = mainRef.current;
    if (!mainEl || !setIsHeaderVisible) return;

    const currentScrollTop = Math.max(0, mainEl.scrollTop);
    const delta = currentScrollTop - lastScrollTopRef.current;

    // Ignorar micro-vibraciones (< 2px)
    if (Math.abs(delta) < 2) return;

    // 1. Zona de reposo superior: la cabecera permanece fija y serena
    if (currentScrollTop <= reposeZonePx) {
      setIsHeaderVisible(true);
      accumulatedDeltaRef.current = 0;
      scrollDirectionRef.current = 'up';
    } else if (delta > 0) {
      // Desplazamiento hacia abajo más allá de la zona de reposo
      if (scrollDirectionRef.current !== 'down') {
        scrollDirectionRef.current = 'down';
        accumulatedDeltaRef.current = 0;
      }

      const effectiveDelta =
        lastScrollTopRef.current <= reposeZonePx
          ? currentScrollTop - reposeZonePx
          : delta;

      if (effectiveDelta > 0) {
        accumulatedDeltaRef.current += effectiveDelta;
      }

      // Ocultar únicamente tras una intención de lectura sostenida y deliberada
      if (accumulatedDeltaRef.current >= hideIntentPx) {
        setIsHeaderVisible(false);
      }
    } else if (delta < 0) {
      // Desplazamiento hacia arriba
      if (scrollDirectionRef.current !== 'up') {
        scrollDirectionRef.current = 'up';
        accumulatedDeltaRef.current = 0;
      }
      accumulatedDeltaRef.current += Math.abs(delta);

      // Reaparecer con intención de navegación hacia arriba ágil
      if (accumulatedDeltaRef.current >= revealIntentPx) {
        setIsHeaderVisible(true);
      }
    }

    lastScrollTopRef.current = currentScrollTop;
  };

  return { mainRef, handleMainScroll };
}
