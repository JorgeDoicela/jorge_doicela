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
    isDesktop: boolean;
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
        isDesktop: true,
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

            const viewportWidth = window.innerWidth;
            const isDesktop = viewportWidth >= 768;
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
                    isDesktop,
                    reducedMotion: true,
                });
                return;
            }

            // Progreso sincronizado 1:1 con el scroll desde el primer nodo (arriba en scrollY=0) hasta el último nodo
            const firstNodeY = nodeYs.length > 0 ? nodeYs[0] : 0;
            const lastNodeY = nodeYs.length > 1 ? nodeYs[nodeYs.length - 1] : trackHeight;
            const docHeight = document.documentElement.scrollHeight;
            const maxScroll = Math.max(1, docHeight - viewportHeight);
            const lastNodeDocY = trackRect.top + window.scrollY + lastNodeY;
            const endScroll = Math.max(
                1,
                Math.min(maxScroll, lastNodeDocY - viewportHeight * 0.65)
            );
            const scrollProgress =
                lastNodeY > firstNodeY
                    ? Math.min(1, Math.max(0, window.scrollY / endScroll))
                    : 1;

            // Fase orbital de cada tarjeta respecto al centro del viewport (solo en Desktop)
            const range = Math.max(viewportHeight * 0.58, 280);
            const itemDeltas = isDesktop
                ? Array.from({ length: itemCount }, (_, idx) => {
                    const el = nodes[idx];
                    if (!el) return 0;
                    const rect = el.getBoundingClientRect();
                    const cardCenter = rect.top + rect.height * 0.5;
                    const raw = (cardCenter - viewportCenter) / range;
                    return Math.min(1.25, Math.max(-1.25, raw));
                })
                : Array(itemCount).fill(0);

            setMetrics({
                scrollProgress,
                itemDeltas,
                nodeYs,
                trackHeight,
                isDesktop,
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
