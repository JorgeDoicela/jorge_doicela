'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';
import { HubFeedItem } from '../../../entities/hub/types';

export interface FeaturedCarouselProps {
  items: HubFeedItem[];
  title: string;
  isLoading?: boolean;
}

export function FeaturedCarousel({
  items,
  title,
  isLoading = false,
}: FeaturedCarouselProps) {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [offset, setOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // 1. Detección responsiva de tarjetas visibles por pantalla
  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount, { passive: true });
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  // Ajusta el índice si se reduce el tamaño de ventana
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // 2. Cálculo exacto del desplazamiento con ResizeObserver (sin depender únicamente de window resize)
  const calculateOffset = useCallback(() => {
    if (trackRef.current && trackRef.current.children.length > 0) {
      const firstChild = trackRef.current.children[0] as HTMLElement;
      const cardWidth = firstChild.getBoundingClientRect().width;
      const style = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(style.columnGap || style.gap || '24') || 24;
      setOffset(currentIndex * (cardWidth + gap));
    }
  }, [currentIndex]);

  useEffect(() => {
    calculateOffset();
    if (!trackRef.current) return;
    const observer = new ResizeObserver(() => {
      calculateOffset();
    });
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [calculateOffset]);

  // 3. Handlers de navegación con bucle circular infinito
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // 4. Autoplay con respeto a 'prefers-reduced-motion' y pausa en hover/focus
  useEffect(() => {
    if (isPaused || items.length <= visibleCount) return;

    // Respetar accesibilidad de usuario (reduce motion)
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, items.length, visibleCount, handleNext]);

  // 5. Navegación por teclado (Flechas Izquierda / Derecha)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // 6. Skeleton de carga
  if (isLoading && items.length === 0) {
    return (
      <section className="animate-in fade-in duration-300" aria-busy="true">
        <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
              {title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`feat-pulse-${i}`}
                className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center glass-concave-panel"
              >
                {tCommon('loading')}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section
      className="animate-in fade-in duration-300"
      role="region"
      aria-roledescription="carousel"
      aria-label={tHome('carouselAria')}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel space-y-5">
        {/* Cabecera: Título a la izquierda, 2 Botones Neumórficos a la derecha */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
            {title}
          </h2>

          {/* 2 Botones de Navegación Neumórficos (Anterior / Siguiente) */}
          {items.length > visibleCount && (
            <div className="flex items-center gap-2">
              {/* Botón Anterior */}
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl glass-convex-panel border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/30 dark:hover:border-white/25 active:scale-90 transition-all shadow-sm cursor-pointer select-none"
                title={tHome('prevFeatured')}
                aria-label={tHome('prevFeatured')}
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Botón Siguiente */}
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl glass-convex-panel border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500/30 dark:hover:border-white/25 active:scale-90 transition-all shadow-sm cursor-pointer select-none"
                title={tHome('nextFeatured')}
                aria-label={tHome('nextFeatured')}
              >
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Contenedor del Carrusel con Máscara de Desbordamiento y Desplazamiento Fluido */}
        <div
          ref={containerRef}
          className="w-full overflow-hidden select-none"
          onTouchStart={(e) => {
            setTouchStartX(e.touches[0].clientX);
            setIsPaused(true);
          }}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (diff > 40) handleNext();
            else if (diff < -40) handlePrev();
            setTouchStartX(null);
            setIsPaused(false);
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-6 will-change-transform"
            style={{
              transform: `translateX(-${offset}px)`,
              transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {items.map((item, idx) => (
              <div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} / ${items.length}`}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 flex flex-col"
              >
                <SoftwareCard
                  href={item.href}
                  title={item.title}
                  category={item.category}
                  coverImage={item.coverImage}
                  tag={item.tag}
                  categoryMeta={item.categoryMeta}
                  excerpt={item.excerpt}
                  priority={idx < 3}
                  accentHoverColor={item.accentHoverColor}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
