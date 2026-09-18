'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, BookOpen } from 'lucide-react';
import type { GlossaryTerm } from '../../../entities/glossary/types';

interface GlossaryTermPopoverProps {
  displayText: string;
  termData: GlossaryTerm;
  isCode?: boolean;
}

export function GlossaryTermPopover({
  displayText,
  termData,
  isCode = false,
}: GlossaryTermPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Cierre interactivo al hacer click fuera del Popover
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
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

  return (
    <span className="relative inline-block">
      {/* Palabra interactiva con subrayado punteado semántico W3C */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title={`Definición: ${termData.term}`}
        className={
          isCode
            ? "inline-flex items-baseline font-mono text-[12px] px-1.5 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] border-b-2 border-b-blue-500/80 hover:border-b-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-900 dark:text-zinc-100 font-semibold cursor-help transition-colors select-text focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
            : "inline-flex items-baseline font-semibold text-slate-900 dark:text-zinc-100 border-b-2 border-dotted border-blue-500/70 hover:border-solid hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-help px-0.5 rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
        }
      >
        <span>{displayText}</span>
      </button>

      {/* Popover Flotante Neumórfico / Glassmorphism */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={`Definición de ${termData.term}`}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-84 p-4 rounded-2xl glass-convex-panel border border-black/10 dark:border-white/10 shadow-2xl space-y-2.5 backdrop-blur-2xl bg-white/95 dark:bg-zinc-950/95 text-left select-text animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Cabecera del Popover: Término, Categoría y Botón Cerrar */}
          <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {termData.term}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold tracking-wider">
                {termData.category}
              </span>

              <button
                type="button"
                onClick={close}
                aria-label="Cerrar definición"
                className="w-5 h-5 rounded-full inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Definición Didáctica y Concisa */}
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
            {termData.shortDefinition}
          </p>

          {/* Diferencia Clave / Caso de Borde (Opcional) */}
          {termData.keyDifference && (
            <div className="text-[11px] p-2 rounded-xl bg-blue-500/[0.06] dark:bg-blue-400/[0.07] border border-blue-500/20 text-slate-700 dark:text-zinc-300 leading-normal font-sans">
              <strong className="font-semibold text-blue-700 dark:text-blue-300">
                Clave de Arquitectura:{' '}
              </strong>
              {termData.keyDifference}
            </div>
          )}

          {/* Flecha indicadora inferior hacia la palabra */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2.5 h-2.5 rotate-45 border-r border-b border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950"
            aria-hidden="true"
          />
        </div>
      )}
    </span>
  );
}
