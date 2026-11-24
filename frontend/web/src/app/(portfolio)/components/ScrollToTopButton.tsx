'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';
import { isPortfolioSandboxPath } from '../shared';

export interface ScrollToTopButtonProps {
  /** Distancia mínima de scroll vertical (en px) para mostrar el botón */
  threshold?: number;
  className?: string;
  id?: string;
}

/**
 * ScrollToTopButton
 * Botón flotante reutilizable Dark/Light Luxury para regresar suavemente al inicio de la página.
 * Se oculta automáticamente en rutas de terminal a pantalla completa (/sandbox).
 */
export function ScrollToTopButton({
  threshold = 320,
  className = '',
  id = 'portfolio-scroll-to-top',
}: ScrollToTopButtonProps) {
  const pathname = usePathname();
  const tNav = useTranslations('Nav');
  const [isVisible, setIsVisible] = useState(false);

  const isSandboxRoute = isPortfolioSandboxPath(pathname);

  useEffect(() => {
    if (isSandboxRoute) {
      setIsVisible(false);
      return;
    }

    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setIsVisible(window.scrollY > threshold);
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [threshold, isSandboxRoute]);

  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  if (isSandboxRoute) return null;

  return (
    <button
      id={id}
      type="button"
      onClick={scrollToTop}
      aria-label={tNav('scrollToTop')}
      title={tNav('scrollToTop')}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`group fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center border border-border-gold/70 bg-surface/90 backdrop-blur-md text-gold-300 hover:text-gold-100 hover:border-gold-300 hover:bg-surface-raised shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)] active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${className}`}
    >
      <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
