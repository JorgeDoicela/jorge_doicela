'use client';

import { useEffect, useState, type RefObject } from 'react';

export interface HelicalTimelineMetrics {
  scrollProgress: number;
  /** Distancia normalizada [-1.25..1.25] de cada tarjeta respecto al centro del viewport */
  itemDeltas: number[];
  /** Posición Y exacta (en px) del centro de cada nodo respecto al contenedor trackRef */
  nodeYs: number[];
  /** Altura total actual del contenedor trackRef en px */
  trackHeight: number;
  reducedMotion: boolean;
}

const NODE_TOP_OFFSET_PX = 38;

/**
 * Motor sincronizado por requestAnimationFrame + ResizeObserver para la línea de tiempo curva 3D.
 * Mide las coordenadas reales de cada nodo para trazar la curva Bézier exacta y calcula la fase orbital.
 */
export function useHelicalTimeline(
  trackRef: RefObject<HTMLElement | null>,
  itemRefs: RefObject<(HTMLElement | null)[]>,
  itemCount: number
): HelicalTimelineMetrics {
  const [metrics, setMetrics] = useState<HelicalTimelineMetrics>(() => ({
    scrollProgress: 0,
    itemDeltas: Array(itemCount).fill(0),
    nodeYs: [],
    trackHeight: 0,
    reducedMotion: false,
  }));

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let frameId = 0;

    const compute = () => {
      frameId = 0;
      const trackEl = trackRef.current;
      if (!trackEl) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight * 0.5;
      const trackRect = trackEl.getBoundingClientRect();
      const trackHeight = Math.max(trackEl.offsetHeight, 1);

      // Posición Y exacta de cada nodo relativa a trackEl
      const nodes = itemRefs.current ?? [];
      const nodeYs: number[] = [];
      for (let idx = 0; idx < itemCount; idx++) {
        const el = nodes[idx];
        if (!el) continue;
        const elRect = el.getBoundingClientRect();
        nodeYs.push(elRect.top - trackRect.top + NODE_TOP_OFFSET_PX);
      }

      if (prefersReduced) {
        setMetrics({
          scrollProgress: 1,
          itemDeltas: Array(itemCount).fill(0),
          nodeYs,
          trackHeight,
          reducedMotion: true,
        });
        return;
      }

      // Progreso exacto desde el primer nodo hasta el último nodo de la curva (0..1)
      const firstNodeY = nodeYs.length > 0 ? nodeYs[0] : 0;
      const lastNodeY = nodeYs.length > 1 ? nodeYs[nodeYs.length - 1] : trackHeight;
      const span = Math.max(lastNodeY - firstNodeY, 1);
      const triggerY = viewportHeight * 0.58;
      const rawProgress = (triggerY - (trackRect.top + firstNodeY)) / span;

      // Completar suavemente al 100% al llegar al final del documento si el último nodo ya es visible
      const docHeight = document.documentElement.scrollHeight;
      const remainingScroll = Math.max(0, docHeight - (window.scrollY + viewportHeight));
      const isLastNodeInView = trackRect.top + lastNodeY <= viewportHeight;
      const bottomBoost =
        isLastNodeInView && remainingScroll < 140 ? 1 - remainingScroll / 140 : 0;

      const scrollProgress = Math.min(1, Math.max(0, Math.max(rawProgress, bottomBoost)));

      // Fase orbital de cada tarjeta respecto al centro del viewport
      const range = Math.max(viewportHeight * 0.58, 280);
      const itemDeltas = Array.from({ length: itemCount }, (_, idx) => {
        const el = nodes[idx];
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const cardCenter = rect.top + rect.height * 0.5;
        const raw = (cardCenter - viewportCenter) / range;
        return Math.min(1.25, Math.max(-1.25, raw));
      });

      setMetrics({
        scrollProgress,
        itemDeltas,
        nodeYs,
        trackHeight,
        reducedMotion: false,
      });
    };

    const schedule = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resizeObserver?.disconnect();
    };
  }, [trackRef, itemRefs, itemCount]);

  return metrics;
}
