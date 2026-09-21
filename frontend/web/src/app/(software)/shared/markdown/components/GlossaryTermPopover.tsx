'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
}

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

  // Cálculo de posicionamiento geométrico inmune a contenedores ancestros y desbordamientos de viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();

    if (triggerRect.width === 0 && triggerRect.height === 0) return;

    const popoverEl = popoverRef.current;
    const popoverWidth = popoverEl ? popoverEl.offsetWidth : Math.min(336, window.innerWidth - 32);
    const popoverHeight = popoverEl ? popoverEl.offsetHeight : 240;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 16;
    const gap = 10;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;

    // Detección de colisión vertical inteligente
    let placement: 'top' | 'bottom' = 'top';
    if (spaceAbove < popoverHeight + gap + margin && spaceBelow > spaceAbove) {
      placement = 'bottom';
    } else if (spaceAbove >= popoverHeight + gap + margin) {
      placement = 'top';
    } else {
      placement = spaceBelow > spaceAbove ? 'bottom' : 'top';
    }

    let top = placement === 'top'
      ? triggerRect.top - popoverHeight - gap
      : triggerRect.bottom + gap;

    // Clamp vertical defensivo para asegurar visibilidad 100% dentro del viewport
    top = Math.max(margin, Math.min(viewportHeight - popoverHeight - margin, top));

    // Posicionamiento horizontal alineado al centro del trigger
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    let left = triggerCenterX - popoverWidth / 2;

    // Clamp horizontal defensivo
    left = Math.max(margin, Math.min(viewportWidth - popoverWidth - margin, left));

    // Flecha indicadora apuntando directamente al trigger
    const rawArrowLeft = triggerCenterX - left;
    const arrowLeft = Math.max(16, Math.min(popoverWidth - 16, rawArrowLeft));

    setCoords({
      top,
      left,
      placement,
      arrowLeft,
    });
  }, []);

  // Sincronización continua de posición con scroll y resize
  useEffect(() => {
    if (!isOpen) {
      setCoords(null);
      return;
    }

    updatePosition();

    // Re-medición tras primer render en el DOM para obtener el offsetHeight exacto
    const frameId = requestAnimationFrame(() => {
      updatePosition();
    });

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      cancelAnimationFrame(frameId);
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

  const popoverElement = isOpen && mounted && coords && (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label={dialogAriaLabel}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      className="z-[9999] w-72 sm:w-84 max-w-[calc(100vw-2rem)] p-4 rounded-2xl glass-convex-panel border border-black/10 dark:border-white/10 shadow-2xl space-y-2.5 backdrop-blur-2xl bg-white/95 dark:bg-zinc-950/95 text-left select-text animate-in fade-in zoom-in-95 duration-150 block"
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

      {/* Flecha indicadora orientada dinámicamente según placement */}
      <div
        style={{
          left: `${coords.arrowLeft}px`,
          transform: 'translateX(-50%) rotate(45deg)',
        }}
        className={`absolute w-2.5 h-2.5 bg-white dark:bg-zinc-950 block ${
          coords.placement === 'top'
            ? 'top-full -mt-[5px] border-r border-b border-black/10 dark:border-white/10'
            : 'bottom-full -mb-[5px] border-l border-t border-black/10 dark:border-white/10'
        }`}
        aria-hidden="true"
      />
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
