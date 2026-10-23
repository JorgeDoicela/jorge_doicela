'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Copy, Check, BookOpen, X, Eraser } from 'lucide-react';
import { Verse, VerseHighlightColor } from '../../types';

export const VERSE_HIGHLIGHT_STYLES: Record<
  VerseHighlightColor,
  {
    bgClass: string;
    label: string;
    swatchClass: string;
  }
> = {
  yellow: {
    bgClass:
      'bg-amber-200/60 dark:bg-amber-400/25 sepia:bg-[#fde047]/50 text-zinc-950 dark:text-amber-100 sepia:text-[#2C221E]',
    label: 'Amarillo',
    swatchClass: 'bg-[#fef08a] border-amber-400 dark:bg-amber-400 dark:border-amber-500',
  },
  green: {
    bgClass:
      'bg-emerald-200/60 dark:bg-emerald-400/25 sepia:bg-[#86efac]/50 text-zinc-950 dark:text-emerald-100 sepia:text-[#2C221E]',
    label: 'Verde',
    swatchClass: 'bg-[#bbf7d0] border-emerald-400 dark:bg-emerald-400 dark:border-emerald-500',
  },
  blue: {
    bgClass:
      'bg-sky-200/60 dark:bg-sky-400/25 sepia:bg-[#93c5fd]/50 text-zinc-950 dark:text-sky-100 sepia:text-[#2C221E]',
    label: 'Azul',
    swatchClass: 'bg-[#bfdbfe] border-sky-400 dark:bg-sky-400 dark:border-sky-500',
  },
  purple: {
    bgClass:
      'bg-purple-200/60 dark:bg-purple-400/25 sepia:bg-[#d8b4fe]/50 text-zinc-950 dark:text-purple-100 sepia:text-[#2C221E]',
    label: 'Púrpura',
    swatchClass: 'bg-[#e9d5ff] border-purple-400 dark:bg-purple-400 dark:border-purple-500',
  },
  orange: {
    bgClass:
      'bg-orange-200/60 dark:bg-orange-400/25 sepia:bg-[#fdba74]/50 text-zinc-950 dark:text-orange-100 sepia:text-[#2C221E]',
    label: 'Naranja',
    swatchClass: 'bg-[#fed7aa] border-orange-400 dark:bg-orange-400 dark:border-orange-500',
  },
};

const HIGHLIGHT_COLORS: VerseHighlightColor[] = ['yellow', 'green', 'blue', 'purple', 'orange'];

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
  const [copied, setCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cierre al presionar Escape o clic fuera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        toolbarRef.current?.contains(target) ||
        target?.closest('[data-verse-item]')
      ) {
        return;
      }
      onClose();
    };

    const handleScroll = () => {
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handlePointerDownOutside);
    document.addEventListener('touchstart', handlePointerDownOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handlePointerDownOutside);
      document.removeEventListener('touchstart', handlePointerDownOutside);
    };
  }, [onClose]);

  const handleCopy = () => {
    if (verses.length === 0) return;

    const sorted = [...verses].sort((a, b) => a.verseNumber - b.verseNumber);
    const abbr = sorted[0]?.translation?.abbreviation || translationAbbr || '';
    const chapter = sorted[0].chapter;

    let textToCopy = '';
    if (sorted.length === 1) {
      const v = sorted[0];
      textToCopy = `«${v.text}» — ${bookName} ${chapter}:${v.verseNumber}${abbr ? ` (${abbr})` : ''}`;
    } else {
      const isConsecutive = sorted.every(
        (v, i) => i === 0 || v.verseNumber === sorted[i - 1].verseNumber + 1,
      );
      const referenceRange = isConsecutive
        ? `${sorted[0].verseNumber}-${sorted[sorted.length - 1].verseNumber}`
        : sorted.map((v) => v.verseNumber).join(', ');

      const combinedText = sorted
        .map((v) => `${v.verseNumber} ${v.text}`)
        .join(' ');

      textToCopy = `«${combinedText}» — ${bookName} ${chapter}:${referenceRange}${abbr ? ` (${abbr})` : ''}`;
    }

    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted || typeof document === 'undefined' || verses.length === 0) return null;

  const placement = position.placement || 'top';
  const clampedLeft = Math.max(130, Math.min(window.innerWidth - 130, position.left));

  return createPortal(
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Acciones de versículo"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${clampedLeft}px`,
        transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
        zIndex: 60,
      }}
      className="flex items-center gap-1.5 p-1 px-2.5 rounded-full bg-background/95 dark:bg-[#121214]/95 sepia:bg-[#FAF6EE]/95 backdrop-blur-md border border-border shadow-xl select-none animate-in fade-in zoom-in-95 duration-150 text-foreground"
    >
      {/* 1. Paleta de colores de subrayado */}
      <div className="flex items-center gap-1">
        {HIGHLIGHT_COLORS.map((color) => {
          const isSelected = currentColor === color;
          const { swatchClass, label } = VERSE_HIGHLIGHT_STYLES[color];
          return (
            <button
              key={color}
              type="button"
              onClick={() => onSetHighlight(color)}
              title={`Subrayar ${label}`}
              aria-label={`Subrayar ${label}`}
              className={`w-5 h-5 rounded-full border transition-all duration-150 cursor-pointer active:scale-90 ${swatchClass} ${
                isSelected
                  ? 'ring-2 ring-foreground scale-110 shadow-xs'
                  : 'hover:scale-115 opacity-90 hover:opacity-100'
              }`}
            />
          );
        })}

        {/* Botón para remover subrayado si hay versículos coloreados */}
        {currentColor && (
          <button
            type="button"
            onClick={onRemoveHighlight}
            title="Quitar subrayado"
            aria-label="Quitar subrayado"
            className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-accents-4 hover:text-red-500 hover:border-red-400 hover:bg-red-500/10 transition-all cursor-pointer ml-0.5 active:scale-90"
          >
            <Eraser className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 2. Botón Copiar */}
      <button
        type="button"
        onClick={handleCopy}
        title={t('copyVerseTooltip')}
        aria-label={t('copyVerseTooltip')}
        className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
          copied
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-accents-4 hover:text-foreground hover:bg-accents-1'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-semibold px-0.5">{t('copied')}</span>
          </>
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {/* 3. Botón Exégesis (Icono BookOpen) */}
      <button
        type="button"
        onClick={onOpenExegesis}
        title={tStudio('verseExegesisTitle')}
        aria-label={tStudio('verseExegesisTitle')}
        className="p-1.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-foreground hover:bg-accents-1 transition-all cursor-pointer active:scale-95"
      >
        <BookOpen className="w-3.5 h-3.5" />
      </button>

      {/* 4. Botón Cerrar selección */}
      <button
        type="button"
        onClick={onClose}
        title="Cerrar selección"
        aria-label="Cerrar selección"
        className="p-1 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-1 transition-all cursor-pointer active:scale-90 ml-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </div>,
    document.body,
  );
};
