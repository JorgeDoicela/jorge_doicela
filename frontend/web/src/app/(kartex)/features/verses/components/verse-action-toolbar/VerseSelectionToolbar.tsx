'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import {
  Copy,
  BookOpen,
  Check,
  X,
  Bookmark,
  Volume2,
} from 'lucide-react';
import { Verse, VerseHighlightColor } from '../../types';
import { useKartexPassageSafe } from '../../../../entities/passage';
import { MobileBottomSheet } from '../../../../shared/ui';

export const HIGHLIGHT_COLORS: VerseHighlightColor[] = [
  'yellow',
  'green',
  'blue',
  'purple',
  'orange',
];

export const VERSE_HIGHLIGHT_STYLES: Record<
  VerseHighlightColor,
  {
    bgClass: string;
    swatchClass: string;
    borderClass: string;
    label: string;
    checkColorClass: string;
    activeRingClass: string;
  }
> = {
  yellow: {
    bgClass: 'bg-amber-200/40 dark:bg-amber-400/25',
    swatchClass: 'bg-amber-300 border-amber-400 text-amber-950',
    borderClass: 'border-l-2 border-l-amber-400',
    label: 'Amarillo',
    checkColorClass: 'text-amber-950',
    activeRingClass: 'ring-2 ring-amber-400 ring-offset-2 ring-offset-card-bg dark:ring-amber-400',
  },
  green: {
    bgClass: 'bg-emerald-200/40 dark:bg-emerald-400/25',
    swatchClass: 'bg-emerald-300 border-emerald-400 text-emerald-950',
    borderClass: 'border-l-2 border-l-emerald-400',
    label: 'Verde',
    checkColorClass: 'text-emerald-950',
    activeRingClass: 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-card-bg dark:ring-emerald-400',
  },
  blue: {
    bgClass: 'bg-sky-200/40 dark:bg-sky-400/25',
    swatchClass: 'bg-sky-300 border-sky-400 text-sky-900',
    borderClass: 'border-l-2 border-l-sky-400',
    label: 'Azul',
    checkColorClass: 'text-sky-950',
    activeRingClass: 'ring-2 ring-sky-400 ring-offset-2 ring-offset-card-bg dark:ring-sky-400',
  },
  purple: {
    bgClass: 'bg-purple-200/40 dark:bg-purple-400/25',
    swatchClass: 'bg-purple-300 border-purple-400 text-purple-900',
    borderClass: 'border-l-2 border-l-purple-400',
    label: 'Púrpura',
    checkColorClass: 'text-purple-950',
    activeRingClass: 'ring-2 ring-purple-400 ring-offset-2 ring-offset-card-bg dark:ring-purple-400',
  },
  orange: {
    bgClass: 'bg-orange-200/40 dark:bg-orange-400/25',
    swatchClass: 'bg-orange-300 border-orange-400 text-orange-900',
    borderClass: 'border-l-2 border-l-orange-400',
    label: 'Naranja',
    checkColorClass: 'text-orange-950',
    activeRingClass: 'ring-2 ring-orange-400 ring-offset-2 ring-offset-card-bg dark:ring-orange-400',
  },
};

export interface VerseSelectionToolbarProps {
  verses: Verse[];
  bookName: string;
  translationAbbr?: string;
  currentColor?: VerseHighlightColor;
  onSetHighlight: (color: VerseHighlightColor) => void;
  onRemoveHighlight: () => void;
  onOpenExegesis: () => void;
  onClose: () => void;
  position: {
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
  };
}

export const VerseSelectionToolbar: React.FC<VerseSelectionToolbarProps> = ({
  verses,
  bookName,
  translationAbbr,
  currentColor,
  onSetHighlight,
  onRemoveHighlight,
  onOpenExegesis,
  onClose,
  position,
}) => {
  const t = useTranslations('ReadingView');
  const tStudio = useTranslations('Studio');
  const tDock = useTranslations('MobileDock');
  const passageContext = useKartexPassageSafe();
  const [copied, setCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cierre en escritorio al presionar Escape o clic fuera
  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        toolbarRef.current?.contains(target) ||
        target?.closest('[data-verse-item]') ||
        target?.closest('[data-mobile-dock]') ||
        target?.closest('[data-study-panel]') ||
        target?.closest('[data-study-panel-backdrop]') ||
        target?.closest('#kartex-study-right-inspector') ||
        target?.closest('#kartex-study-left-sidebar') ||
        target?.closest('nav')
      ) {
        return;
      }
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [onClose, isMobile]);

  if (!mounted || verses.length === 0) return null;

  const sortedVerses = [...verses].sort((a, b) => a.verseNumber - b.verseNumber);
  const citationNumbers =
    sortedVerses.length === 1
      ? `${sortedVerses[0].verseNumber}`
      : `${sortedVerses[0].verseNumber}-${sortedVerses[sortedVerses.length - 1].verseNumber}`;

  const citation = `${bookName} ${verses[0]?.chapter}:${citationNumbers}${
    translationAbbr ? ` (${translationAbbr})` : ''
  }`;

  const copyText = `${sortedVerses.map((v) => `${v.verseNumber} ${v.text}`).join(' ')}\n— ${citation}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback silencioso seguro
    }
  };

  const handlePlayFromVerse = () => {
    if (sortedVerses.length === 0) return;
    const firstVerseNumber = sortedVerses[0].verseNumber;
    passageContext?.playAudioFromVerse(firstVerseNumber);
    onClose();
  };

  const headerTitle = (
    <span className="font-semibold text-xs tracking-wider uppercase text-foreground truncate">
      {bookName} {verses[0]?.chapter}:{citationNumbers}
    </span>
  );

  const headerBadge = (
    <div className="flex items-center gap-1.5 shrink-0">
      {translationAbbr && (
        <span className="text-[10px] font-mono text-accents-4 font-semibold shrink-0">
          {translationAbbr}
        </span>
      )}
      {verses.length > 1 && (
        <span className="text-[10px] font-mono text-accents-4 shrink-0">
          ({verses.length})
        </span>
      )}
    </div>
  );

  const renderActionsContent = () => (
    <>
      {/* Sección 1: Paleta de Subrayado */}
      <div>
        <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-2">
          {t('highlights')}
        </span>
        <div className="flex items-center justify-around p-2.5 rounded-2xl border border-border/80 bg-inner-card/60">
          {HIGHLIGHT_COLORS.map((color) => {
            const isSelected = currentColor === color;
            const { swatchClass, label, checkColorClass, activeRingClass } =
              VERSE_HIGHLIGHT_STYLES[color];
            return (
              <button
                key={color}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onRemoveHighlight();
                  } else {
                    onSetHighlight(color);
                  }
                }}
                title={isSelected ? `Quitar subrayado (${label})` : `Subrayar ${label}`}
                aria-label={isSelected ? `Quitar subrayado (${label})` : `Subrayar ${label}`}
                className={`w-9 h-9 rounded-full border transition-all duration-150 cursor-pointer flex items-center justify-center active:scale-90 ${swatchClass} ${
                  isSelected
                    ? `${activeRingClass} scale-110 shadow-xs`
                    : 'hover:scale-105 opacity-90'
                }`}
              >
                {isSelected && (
                  <Check className={`w-4 h-4 stroke-[2.75] ${checkColorClass}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sección 2: Acciones Principales */}
      <div>
        <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-2">
          {t('actions')}
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handlePlayFromVerse}
            className="py-2.5 px-2 rounded-xl border border-border/80 bg-inner-card hover:bg-accents-1 text-foreground transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium active:scale-95"
            title={t('listenFromHere')}
            aria-label={t('listenFromHere')}
          >
            <Volume2 className="w-4 h-4 stroke-[1.75] shrink-0" />
            <span className="truncate">{t('listen')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={`py-2.5 px-2 rounded-xl border border-border/80 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium active:scale-95 ${
              copied
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30 font-semibold'
                : 'text-foreground bg-inner-card hover:bg-accents-1'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.25] text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[1.75] shrink-0" />
                <span className="truncate">{t('copy')}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenExegesis}
            className="py-2.5 px-2 rounded-xl border border-border/80 bg-inner-card hover:bg-accents-1 text-foreground transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium active:scale-95"
          >
            <BookOpen className="w-4 h-4 stroke-[1.75] shrink-0" />
            <span className="truncate">{tDock('exegesis')}</span>
          </button>
        </div>
      </div>
    </>
  );

  // Versión móvil: Integrada mediante el primitivo MobileBottomSheet
  if (isMobile) {
    return (
      <MobileBottomSheet
        id="kartex-verse-action-sheet"
        isOpen={true}
        onClose={onClose}
        dismissMode="interactive"
        icon={<Bookmark className="w-4 h-4 text-foreground shrink-0" />}
        title={headerTitle}
        badge={headerBadge}
        closeAriaLabel="Cerrar selección"
        heightClass="max-h-[60vh]"
        bodyClassName="p-5 space-y-4 select-none"
      >
        {renderActionsContent()}
      </MobileBottomSheet>
    );
  }

  // Versión de escritorio (PC): Barra contextual horizontal de alta precisión
  // Flotando directamente sobre/bajo el versículo seleccionado (estilo Geist / Vercel)
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const halfWidth = 135;
  const clampedLeft = Math.max(
    halfWidth + 16,
    Math.min(screenWidth - halfWidth - 16, position.left),
  );

  const desktopToolbar = (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label={`Acciones para ${citation}`}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${clampedLeft}px`,
        transform:
          position.placement === 'bottom'
            ? 'translate(-50%, 0)'
            : 'translate(-50%, -100%)',
      }}
      className="z-50 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-border bg-white dark:bg-[#121214] sepia:bg-[#FAF6EE] shadow-[0_12px_36px_rgba(0,0,0,0.16)] dark:shadow-[0_16px_44px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150 select-none whitespace-nowrap"
    >
      {/* 1. Paleta de colores para subrayar */}
      <div className="flex items-center gap-1 shrink-0">
        {HIGHLIGHT_COLORS.map((color) => {
          const isSelected = currentColor === color;
          const { swatchClass, label, checkColorClass, activeRingClass } =
            VERSE_HIGHLIGHT_STYLES[color];
          return (
            <button
              key={color}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onRemoveHighlight();
                } else {
                  onSetHighlight(color);
                }
              }}
              title={isSelected ? `Quitar subrayado (${label})` : `Subrayar ${label}`}
              aria-label={isSelected ? `Quitar subrayado (${label})` : `Subrayar ${label}`}
              className={`w-5 h-5 rounded-full border transition-all duration-150 cursor-pointer flex items-center justify-center active:scale-90 ${swatchClass} ${
                isSelected
                  ? `${activeRingClass} scale-110 shadow-xs`
                  : 'hover:scale-110 opacity-85 hover:opacity-100'
              }`}
            >
              {isSelected && (
                <Check className={`w-3 h-3 stroke-[2.75] ${checkColorClass}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Separador */}
      <div className="w-px h-4 bg-border/70 shrink-0" />

      {/* 2. Acciones rápidas (Escuchar y Copiar) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handlePlayFromVerse}
          title={t('listenFromHere')}
          aria-label={t('listenFromHere')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-accents-5 hover:text-foreground hover:bg-accents-1 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Volume2 className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>{t('listen')}</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          title={copied ? t('copied') : t('copyVerseTooltip')}
          aria-label={copied ? t('copied') : t('copyVerseTooltip')}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer active:scale-95 shrink-0 ${
            copied
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
              : 'text-accents-5 hover:text-foreground hover:bg-accents-1'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.25] text-emerald-600 dark:text-emerald-400" />
              <span>{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>{t('copy')}</span>
            </>
          )}
        </button>
      </div>

      {/* Separador */}
      <div className="w-px h-4 bg-border/70 shrink-0" />

      {/* 3. Botón Cerrar selección */}
      <button
        type="button"
        onClick={onClose}
        title="Cerrar selección"
        aria-label="Cerrar selección"
        className="p-1 rounded-md text-accents-4 hover:text-foreground hover:bg-accents-1 transition-all cursor-pointer active:scale-90 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return createPortal(desktopToolbar, document.body);
};
