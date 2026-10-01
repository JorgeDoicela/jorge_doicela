'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, ClipboardPaste, Check, Info } from 'lucide-react';

interface TerminalClipboardFooterProps {
  onCopy: () => void | boolean | Promise<boolean | void>;
  onPaste: () => void | boolean | Promise<boolean | void>;
  copied: boolean;
  pasted: boolean;
  extraLeft?: React.ReactNode;
  extraRight?: React.ReactNode;
  className?: string;
}

export const TerminalClipboardFooter: React.FC<TerminalClipboardFooterProps> = ({
  onCopy,
  onPaste,
  copied,
  pasted,
  extraLeft,
  extraRight,
  className = '',
}) => {
  const t = useTranslations('SandboxTerminal');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  // Cerrar tooltip con tecla Escape o clic fuera
  useEffect(() => {
    if (!showTooltip) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTooltip(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showTooltip]);

  return (
    <footer
      className={`relative flex items-center justify-between gap-3 px-4 py-2 border-t border-border-gold bg-surface-raised text-xs select-none shrink-0 min-h-[48px] z-10 ${className}`}
    >
      {/* ── Lado Izquierdo: Controles de navegación y badge de modo ── */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
        {extraLeft}
      </div>

      {/* ── Lado Derecho: Icono Info + Botones Copy / Paste + Extras ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Popover flotante con tokens de diseño adaptables Dark/Light */}
        {showTooltip && (
          <div
            ref={tooltipRef}
            role="tooltip"
            className="absolute bottom-[54px] right-4 sm:right-48 w-80 sm:w-96 p-4 rounded-lg bg-surface border border-border-gold shadow-2xl z-50 text-foreground font-sans text-xs leading-relaxed animate-fade-in"
          >
            <p className="font-medium text-foreground mb-2 text-[12px]">
              {t('clipboardTooltipP1')}
            </p>
            <p className="text-muted text-[11px] leading-normal font-light">
              {t('clipboardTooltipP2')}
            </p>
            {/* Flecha indicadora */}
            <div className="absolute -bottom-1.5 right-40 sm:right-44 w-3 h-3 bg-surface border-r border-b border-border-gold transform rotate-45" />
          </div>
        )}

        {/* Botón de Información (i) */}
        <button
          ref={infoButtonRef}
          type="button"
          onClick={() => setShowTooltip((prev) => !prev)}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            showTooltip
              ? 'bg-gold-400/20 text-gold-300'
              : 'text-muted hover:text-gold-300 hover:bg-surface'
          }`}
          title={t('clipboardInfoTitle')}
          aria-label={t('clipboardInfoTitle')}
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Botón Copy from terminal */}
        <button
          type="button"
          onClick={onCopy}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border-gold/60 hover:border-gold-400/60 text-foreground/85 hover:text-gold-300 text-[11px] font-mono font-medium transition-all cursor-pointer"
          title={t('copyFromTerminal')}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-gold-400" />
              <span>{t('copyFromTerminal')}</span>
            </>
          )}
        </button>

        {/* Botón Paste into terminal */}
        <button
          type="button"
          onClick={onPaste}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border-gold/60 hover:border-gold-400/60 text-foreground/85 hover:text-gold-300 text-[11px] font-mono font-medium transition-all cursor-pointer"
          title={t('pasteIntoTerminal')}
        >
          {pasted ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">{t('pasted')}</span>
            </>
          ) : (
            <>
              <ClipboardPaste className="w-3 h-3 text-gold-400" />
              <span>{t('pasteIntoTerminal')}</span>
            </>
          )}
        </button>

        {extraRight}
      </div>
    </footer>
  );
};
