'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import type { GlossaryTerm } from '../../../entities/glossary/types';

interface GlossaryTermPopoverProps {
  displayText: string;
  termData: GlossaryTerm;
  isCode?: boolean;
}

interface PopoverCoords {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
  arrowLeft: number;
  maxHeight?: number;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function GlossaryTermPopover({
  displayText,
  termData,
  isCode = false,
}: GlossaryTermPopoverProps) {
  const t = useTranslations('Glossary');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<PopoverCoords | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryMap: Record<string, string> = {
    networking: t('catNetworking'),
    linux: t('catLinux'),
    security: t('catSecurity'),
    database: t('catDatabase'),
    ai: t('catAi'),
    architecture: t('catArchitecture'),
  };

  const categoryLabel =
    categoryMap[termData.category.toLowerCase()] ||
    termData.category.toUpperCase();
  const triggerTitle = t('definition', { term: termData.term });
  const dialogAriaLabel = t('definitionOf', { term: termData.term });
  const closeAriaLabel = t('close');
  const technicalInsightLabel = t('technicalInsight');

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Medición y cálculo de coordenadas basado 100% en dimensiones reales del DOM
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();

    if (triggerRect.width === 0 && triggerRect.height === 0) return;

    const popoverEl = popoverRef.current;
    const popoverWidth = popoverEl.offsetWidth;
    const popoverHeight = popoverEl.offsetHeight;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;
    const gap = 12;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;

    // Decisión de placement estricta basada en la altura real medida
    let placement: 'top' | 'bottom' = 'top';
    if (spaceAbove >= popoverHeight + gap + margin) {
      placement = 'top';
    } else if (spaceBelow >= popoverHeight + gap + margin) {
      placement = 'bottom';
    } else {
      placement = spaceBelow > spaceAbove ? 'bottom' : 'top';
    }

    let top = 0;
    let maxHeight: number | undefined = undefined;

    if (placement === 'top') {
      top = triggerRect.top - popoverHeight - gap;
      // Invariante absoluto: jamás permitir que la base del popover tape el disparador
      if (top < margin) {
        top = margin;
        maxHeight = Math.max(120, triggerRect.top - gap - margin);
      }
    } else {
      top = triggerRect.bottom + gap;
      // Invariante absoluto: jamás permitir que el inicio del popover suba sobre el disparador
      if (top + popoverHeight > viewportHeight - margin) {
        maxHeight = Math.max(120, viewportHeight - margin - top);
      }
    }

    // Posicionamiento horizontal alineado al centro del trigger
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenterX - popoverWidth / 2;

    // Clamp horizontal defensivo
    left = Math.max(margin, Math.min(viewportWidth - popoverWidth - margin, left));

    // Flecha indicadora apuntando directamente al trigger
    const rawArrowLeft = triggerCenterX - left;
    const arrowLeft = Math.max(20, Math.min(popoverWidth - 20, rawArrowLeft));

    setCoords((prev) => {
      if (
        prev &&
        prev.top === top &&
        prev.left === left &&
        prev.placement === placement &&
        prev.arrowLeft === arrowLeft &&
        prev.maxHeight === maxHeight
      ) {
        return prev;
      }
      return {
        top,
        left,
        placement,
        arrowLeft,
        maxHeight,
      };
    });
  }, []);

  // Medición síncrona en el ciclo de layout antes del primer paint
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }

    updatePosition();
  }, [isOpen, updatePosition]);

  // Sincronización continua de posición con scroll, resize y mutaciones de tamaño (ResizeObserver)
  useEffect(() => {
    if (!isOpen) return;

    const popoverEl = popoverRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (popoverEl && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });
      resizeObserver.observe(popoverEl);
    }

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Cierre interactivo al hacer click fuera del Popover o presionar Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  const isPositioned = coords !== null;

  const popoverElement = isOpen && mounted && (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label={dialogAriaLabel}
      style={{
        position: 'fixed',
        top: coords ? `${coords.top}px` : '0px',
        left: coords ? `${coords.left}px` : '0px',
        visibility: isPositioned ? 'visible' : 'hidden',
        pointerEvents: isPositioned ? 'auto' : 'none',
      }}
      className={`z-[9999] w-72 sm:w-84 max-w-[calc(100vw-2rem)] rounded-2xl glass-convex-panel border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-white/95 dark:bg-zinc-950/95 text-left select-text overflow-visible ${
        isPositioned ? 'animate-in fade-in zoom-in-95 duration-150' : 'opacity-0'
      } block`}
    >
      {/* Contenedor desplazable interno: maneja contenido extenso sin recortar el rombo exterior */}
      <div
        style={{
          maxHeight: coords?.maxHeight ? `${coords.maxHeight}px` : undefined,
        }}
        className="p-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-3rem)] rounded-2xl scrollbar-none"
      >
        {/* Cabecera del Popover: Término, Categoría y Botón Cerrar */}
        <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-2">
          <div className="min-w-0">
            <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate block">
              {termData.term}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-semibold tracking-wider">
              {categoryLabel}
            </span>

            <button
              type="button"
              onClick={close}
              aria-label={closeAriaLabel}
              className="w-5 h-5 rounded-full inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Definición Didáctica y Concisa */}
        <div className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
          {termData.shortDefinition}
        </div>

        {/* Criterio Técnico con Acento Lateral Elegante */}
        {termData.keyDifference && (
          <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-2.5 py-0.5 space-y-0.5">
            <span className="block text-[9.5px] font-mono uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
              {technicalInsightLabel}
            </span>
            <div className="text-[11.5px] text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
              {termData.keyDifference}
            </div>
          </div>
        )}
      </div>

      {/* Rombo indicador exterior: nunca recortado por overflow */}
      {coords && (
        <div
          style={{
            left: `${coords.arrowLeft}px`,
          }}
          className={`absolute w-3 h-3 bg-white dark:bg-zinc-950 border-black/10 dark:border-white/10 rotate-45 pointer-events-none z-20 ${
            coords.placement === 'top'
              ? '-bottom-1.5 -translate-x-1/2 border-r border-b'
              : '-top-1.5 -translate-x-1/2 border-l border-t'
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  );

  return (
    <>
      {/* Palabra interactiva con subrayado punteado semántico W3C */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title={triggerTitle}
        className={
          isCode
            ? "inline-flex items-baseline font-mono text-[12px] px-1.5 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] border-b-2 border-b-blue-500/80 hover:border-b-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-900 dark:text-zinc-100 font-semibold cursor-help transition-colors select-text focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            : "inline-flex items-baseline font-semibold text-slate-900 dark:text-zinc-100 border-b-2 border-dotted border-blue-500/70 hover:border-solid hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-help px-0.5 rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
        }
      >
        <span>{displayText}</span>
      </button>

      {/* Popover Flotante en Portal desacoplado de contenedores ancestros */}
      {mounted && typeof document !== 'undefined' && popoverElement && createPortal(popoverElement, document.body)}
    </>
  );
}
