'use client';

import { useEffect, useState, type RefObject } from 'react';

const NODE_TOP_OFFSET_PX = 40;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export interface TimelineGeometry {
  nodeYs: number[];
  trackHeight: number;
  isDesktop: boolean;
  reducedMotion: boolean;
}

export interface TimelineDomBindings {
  activePathRef: RefObject<SVGPathElement | null>;
  headGroupRef: RefObject<SVGGElement | null>;
  mobileRailRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<(HTMLDivElement | null)[]>;
  nodeWrapRefs: RefObject<(HTMLDivElement | null)[]>;
  connectorRefs: RefObject<(HTMLDivElement | null)[]>;
  hoveredIndexRef: RefObject<number | null>;
  totalPathLengthRef: RefObject<number>;
  requestSyncRef: RefObject<(() => void) | null>;
}

interface CachedLayout {
  trackTopDoc: number;
  firstNodeY: number;
  lastNodeY: number;
  endScroll: number;
  focusY: number;
  range: number;
  cardCentersDoc: number[];
  isDesktop: boolean;
}

/**
 * Motor de alto rendimiento (0 re-renders de React durante el scroll).
 * Mide layout solo al montar/redimensionar y actualiza transform/SVG directo por rAF.
 */
export function useHelicalTimeline(
  trackRef: RefObject<HTMLElement | null>,
  itemRefs: RefObject<(HTMLElement | null)[]>,
  itemCount: number,
  bindings: TimelineDomBindings
): TimelineGeometry {
  const [geometry, setGeometry] = useState<TimelineGeometry>({
    nodeYs: [],
    trackHeight: 0,
    isDesktop: true,
    reducedMotion: false,
  });

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let cached: CachedLayout | null = null;
    let frameId = 0;

    const applyVisuals = () => {
      frameId = 0;
      if (!cached) return;

      const scrollY = window.scrollY;
      const {
        firstNodeY,
        lastNodeY,
        endScroll,
        focusY,
        range,
        cardCentersDoc,
        isDesktop,
      } = cached;

      const progress = prefersReduced
        ? 1
        : lastNodeY > firstNodeY
          ? Math.min(1, Math.max(0, scrollY / endScroll))
          : 1;

      // 1. Riel móvil
      if (bindings.mobileRailRef.current) {
        bindings.mobileRailRef.current.style.transform = `scaleY(${progress.toFixed(4)})`;
      }

      // 2. Curva SVG dorada + punta luminosa sin disparar re-renders
      const activePath = bindings.activePathRef.current;
      if (activePath) {
        activePath.style.strokeDashoffset = prefersReduced
          ? '0'
          : (1 - progress).toFixed(4);

        const headGroup = bindings.headGroupRef.current;
        const totalLen = bindings.totalPathLengthRef.current ?? 0;
        if (headGroup) {
          if (!prefersReduced && totalLen > 0 && progress > 0.015 && progress < 0.985) {
            const pt = activePath.getPointAtLength(progress * totalLen);
            headGroup.setAttribute(
              'transform',
              `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`
            );
            headGroup.style.opacity = '1';
          } else {
            headGroup.style.opacity = '0';
          }
        }
      }

      // 3. Tarjetas 3D y estado visual de nodos/conectores directo en DOM
      const viewportFocusDoc = scrollY + focusY;
      const hoveredIdx = bindings.hoveredIndexRef.current;

      for (let idx = 0; idx < itemCount; idx++) {
        const cardEl = bindings.cardRefs.current?.[idx];
        const nodeEl = bindings.nodeWrapRefs.current?.[idx];
        const connEl = bindings.connectorRefs.current?.[idx];

        const centerDoc = cardCentersDoc[idx] ?? viewportFocusDoc;
        const delta = isDesktop
          ? Math.min(1.25, Math.max(-1.25, (centerDoc - viewportFocusDoc) / range))
          : 0;

        const absDelta = Math.abs(delta);
        const sign = delta >= 0 ? 1 : -1;
        const isHovered = hoveredIdx === idx;
        const shouldAnimate3D = isDesktop && !prefersReduced && !isHovered;
        const orbitalAmount = shouldAnimate3D ? smoothstep(0.24, 1.0, absDelta) : 0;

        if (cardEl) {
          if (orbitalAmount < 0.004) {
            if (cardEl.style.transform !== '') cardEl.style.transform = '';
            if (cardEl.style.opacity !== '1') cardEl.style.opacity = '1';
          } else {
            const isLeft = idx % 2 === 0;
            const signedOrbit = sign * orbitalAmount;
            const rotateY = (isLeft ? -1 : 1) * orbitalAmount * 22;
            const rotateX = -signedOrbit * 8;
            const translateZ = -orbitalAmount * 64;
            const translateY = signedOrbit * 10;
            const scale = 1 - orbitalAmount * 0.08;
            const opacity = 1 - orbitalAmount * 0.36;

            cardEl.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            cardEl.style.opacity = opacity.toFixed(3);
          }

          const isFocusCard = absDelta < 0.34 || isHovered;
          cardEl.dataset.active = isFocusCard ? 'true' : 'false';
        }

        const threshold = itemCount > 1 ? idx / (itemCount - 1) : 0;
        const isReached = progress >= threshold - 0.05;
        const isLit = idx === 0 || isReached || absDelta < 0.34 || isHovered;

        if (nodeEl) {
          nodeEl.dataset.lit = isLit ? 'true' : 'false';
        }
        if (connEl) {
          connEl.dataset.lit = isLit ? 'true' : 'false';
        }
      }
    };

    const measureLayout = () => {
      const trackEl = trackRef.current;
      if (!trackEl) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isDesktop = viewportWidth >= 768;
      const trackRect = trackEl.getBoundingClientRect();
      const trackTopDoc = trackRect.top + window.scrollY;
      const trackHeight = Math.max(trackEl.offsetHeight, 1);

      const nodes = itemRefs.current ?? [];
      const nodeYs: number[] = [];
      const cardCentersDoc: number[] = [];

      for (let idx = 0; idx < itemCount; idx++) {
        const el = nodes[idx];
        if (!el) continue;
        // offsetTop/offsetHeight son inmunes a transforms 3D de hijos
        const topInTrack = el.offsetTop;
        const height = el.offsetHeight;
        nodeYs.push(topInTrack + NODE_TOP_OFFSET_PX);
        cardCentersDoc.push(trackTopDoc + topInTrack + height * 0.5);
      }

      const firstNodeY = nodeYs.length > 0 ? nodeYs[0] : 0;
      const lastNodeY = nodeYs.length > 1 ? nodeYs[nodeYs.length - 1] : trackHeight;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docHeight - viewportHeight);
      const lastNodeDocY = trackTopDoc + lastNodeY;
      const endScroll = Math.max(
        1,
        Math.min(maxScroll, lastNodeDocY - viewportHeight * 0.65)
      );

      cached = {
        trackTopDoc,
        firstNodeY,
        lastNodeY,
        endScroll,
        focusY: viewportHeight * 0.5,
        range: Math.max(viewportHeight * 0.58, 280),
        cardCentersDoc,
        isDesktop,
      };

      setGeometry((prev) => {
        const sameLength = prev.nodeYs.length === nodeYs.length;
        const sameYs =
          sameLength &&
          nodeYs.every((y, i) => Math.abs(y - prev.nodeYs[i]) < 0.5);
        if (
          sameYs &&
          Math.abs(prev.trackHeight - trackHeight) < 0.5 &&
          prev.isDesktop === isDesktop &&
          prev.reducedMotion === prefersReduced
        ) {
          return prev;
        }
        return {
          nodeYs,
          trackHeight,
          isDesktop,
          reducedMotion: prefersReduced,
        };
      });

      applyVisuals();
    };

    const scheduleFrame = () => {
      if (frameId === 0) {
        frameId = window.requestAnimationFrame(applyVisuals);
      }
    };

    bindings.requestSyncRef.current = scheduleFrame;

    const handleResize = () => {
      measureLayout();
    };

    measureLayout();
    window.addEventListener('scroll', scheduleFrame, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        measureLayout();
      });
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', scheduleFrame);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [trackRef, itemRefs, itemCount, bindings]);

  return geometry;
}
