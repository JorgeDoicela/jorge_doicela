'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface DoiceladevTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorTooltip?: string | null;
  onClearError?: () => void;
  containerClassName?: string;
}

export const DoiceladevTextarea = forwardRef<
  HTMLTextAreaElement,
  DoiceladevTextareaProps
>(function DoiceladevTextarea(
  {
    errorTooltip,
    onClearError,
    containerClassName = '',
    className = '',
    onChange,
    onFocus,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-cierre temporal tras 4 segundos si el usuario no interactúa
  useEffect(() => {
    if (!errorTooltip || !onClearError) return;
    const timer = setTimeout(() => {
      onClearError();
    }, 4000);
    return () => clearTimeout(timer);
  }, [errorTooltip, onClearError]);

  // Cierre inmediato al hacer clic en cualquier lugar fuera del contenedor
  useEffect(() => {
    if (!errorTooltip || !onClearError) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClearError();
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [errorTooltip, onClearError]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (errorTooltip && onClearError) {
      onClearError();
    }
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (errorTooltip && onClearError) {
      onClearError();
    }
    onFocus?.(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${containerClassName}`}
    >
      <textarea
        ref={ref}
        onChange={handleChange}
        onFocus={handleFocus}
        aria-invalid={Boolean(errorTooltip)}
        aria-describedby={errorTooltip ? 'textarea-error-tooltip' : undefined}
        className={`w-full px-4 py-3 rounded-2xl glass-concave-panel border outline-none text-xs sm:text-[13px] font-sans text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 resize-none leading-relaxed transition-all block ${
          errorTooltip
            ? 'border-amber-500/60 dark:border-amber-400/60 ring-1 ring-amber-500/30'
            : 'border-slate-200/80 dark:border-white/[0.06] focus:border-blue-500/40 dark:focus:border-cyan-400/40'
        } ${className}`}
        {...props}
      />

      {/* Globo / Tooltip Neumórfico Flotante Centrado con auto-cierre */}
      {errorTooltip && (
        <div
          id="textarea-error-tooltip"
          role="alert"
          onClick={() => onClearError?.()}
          className="absolute z-30 -bottom-2.5 left-1/2 -translate-x-1/2 translate-y-full animate-in fade-in slide-in-from-top-1 zoom-in-95 duration-150 select-none cursor-pointer"
        >
          {/* Rombo / Flecha apuntando hacia arriba al borde del textarea, centrado */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white/95 dark:bg-[#12161f]/95 border-l border-t border-slate-200/90 dark:border-white/10"
            aria-hidden="true"
          />

          {/* Panel Flotante Neumórfico Glass */}
          <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-convex-panel border border-slate-200/90 dark:border-white/10 shadow-[var(--btn-shadow)] text-slate-800 dark:text-zinc-100 text-[11.5px] font-mono font-medium backdrop-blur-xl hover:opacity-90 transition-opacity">
            <span className="w-4 h-4 rounded-full bg-amber-500/15 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 inline-flex items-center justify-center shrink-0">
              <AlertCircle className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap">{errorTooltip}</span>
          </div>
        </div>
      )}
    </div>
  );
});
