'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

export interface DoiceladevHoverPreviewProps {
  children: React.ReactNode;
  content: React.ReactNode;
  enabled?: boolean;
  delayMs?: number;
  maxWidth?: number;
  className?: string;
}

export function DoiceladevHoverPreview({
  children,
  content,
  enabled = true,
  delayMs = 220,
  maxWidth = 420,
  className = '',
}: DoiceladevHoverPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewId = useId();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || typeof window === 'undefined') return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Decidir si ubicar arriba o abajo según espacio disponible
    const spaceBelow = viewportHeight - rect.bottom;
    const placeAbove = spaceBelow < 220 && rect.top > 220;

    const width = Math.min(maxWidth, viewportWidth - 32);
    let left = rect.left + rect.width / 2 - width / 2;

    // Delimitar dentro de los bordes de la pantalla
    left = Math.max(16, Math.min(viewportWidth - width - 16, left));

    const top = placeAbove ? rect.top - 10 : rect.bottom + 10;

    setCoords({ top, left, placeAbove });
  }, [maxWidth]);

  const handleMouseEnter = () => {
    if (!enabled || !content) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      calculatePosition();
      setIsOpen(true);
    }, delayMs);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
  };

  // Actualizar coordenadas si cambia el scroll o resize mientras esté abierto
  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => {
      calculatePosition();
    };
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, calculatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
        aria-describedby={isOpen ? previewId : undefined}
      >
        {children}
      </div>

      {mounted && isOpen && coords && typeof document !== 'undefined' && createPortal(
        <div
          id={previewId}
          role="tooltip"
          className="fixed pointer-events-none z-[999999] transition-opacity duration-150 animate-in fade-in zoom-in-95"
          style={{
            top: coords.placeAbove ? undefined : `${coords.top}px`,
            bottom: coords.placeAbove ? `${window.innerHeight - coords.top}px` : undefined,
            left: `${coords.left}px`,
            width: `min(${maxWidth}px, calc(100vw - 32px))`,
          }}
        >
          <div className="p-3.5 sm:p-4 rounded-2xl glass-convex-panel border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#121620]/95 shadow-[0_12px_32px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-[var(--foreground)]">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

