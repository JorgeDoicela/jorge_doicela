'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ScrollToTopButtonProps {
  /** Cantidad de píxeles de scroll vertical antes de mostrar el botón (por defecto 300) */
  threshold?: number;
  /** Clases CSS adicionales para personalización */
  className?: string;
}

/**
 * Botón flotante profesional para volver a la parte superior de la página.
 * Estilizado con Neumorphism UI + Glassmorphism y micro-interacciones suaves.
 */
export function ScrollToTopButton({
  threshold = 300,
  className = '',
}: ScrollToTopButtonProps) {
  const t = useTranslations('Nav');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('scrollToTop')}
      title={t('scrollToTop')}
      id="software-scroll-to-top"
      className={`group fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl glass-convex-panel border border-black/10 dark:border-white/10 shadow-lg hover:shadow-xl dark:shadow-black/50 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${className}`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
