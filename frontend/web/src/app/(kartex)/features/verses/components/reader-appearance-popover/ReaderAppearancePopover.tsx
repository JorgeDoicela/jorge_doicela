'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Type, AlignLeft, ListOrdered, X } from 'lucide-react';
import {
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  ReaderSettings,
} from '../../types';
import { useReaderAppearanceSettings } from '../../hooks/useReaderAppearanceSettings';

export interface ReaderAppearancePopoverProps {
  readerSettings?: ReaderSettings;
  onLayoutModeChange?: (mode: ReaderLayoutMode) => void;
  onFontSizeChange?: (size: ReaderFontSize) => void;
  onFontFamilyChange?: (family: ReaderFontFamily) => void;
  onToggleVerseNumbers?: () => void;
  onTogglePericopes?: () => void;
  align?: 'left' | 'right' | 'center';
  direction?: 'up' | 'down';
  className?: string;
  buttonClassName?: string;
  renderTrigger?: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
}

export const ReaderAppearancePopover: React.FC<ReaderAppearancePopoverProps> = ({
  readerSettings: propSettings,
  onLayoutModeChange: propOnLayoutModeChange,
  onFontSizeChange: propOnFontSizeChange,
  onFontFamilyChange: propOnFontFamilyChange,
  onToggleVerseNumbers: propOnToggleVerseNumbers,
  onTogglePericopes: propOnTogglePericopes,
  align = 'right',
  direction = 'down',
  className = '',
  buttonClassName,
  renderTrigger,
}) => {
  const t = useTranslations('Toolbar');
  const hook = useReaderAppearanceSettings();

  const settings = propSettings ?? hook.settings;
  const onLayoutModeChange = propOnLayoutModeChange ?? hook.setLayoutMode;
  const onFontSizeChange = propOnFontSizeChange ?? hook.setFontSize;
  const onFontFamilyChange = propOnFontFamilyChange ?? hook.setFontFamily;
  const onToggleVerseNumbers = propOnToggleVerseNumbers ?? hook.toggleVerseNumbers;
  const onTogglePericopes = propOnTogglePericopes ?? hook.togglePericopes;

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Bloqueo de scroll de la página de fondo en móvil mientras el Bottom Sheet está abierto
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isMobile]);

  // Cerrar al hacer clic fuera o presionar escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | PointerEvent) => {
      if (!isMobile && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMobile]);

  // Soporte de arrastre táctil hacia abajo (swipe down) para cerrar Bottom Sheet en móvil
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (deltaY > 50) {
      setIsOpen(false);
    }
    touchStartYRef.current = null;
  };

  const fontSizes: { value: ReaderFontSize; label: string }[] = [
    { value: 'sm', label: 'S' },
    { value: 'md', label: 'M' },
    { value: 'lg', label: 'L' },
    { value: 'xl', label: 'XL' },
  ];

  const alignClass =
    align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : align === 'left'
      ? 'left-0'
      : 'right-0';

  const directionClass = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-1.5';

  const defaultButtonClass = `px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95 ${
    isOpen
      ? 'bg-accents-2 text-foreground font-semibold shadow-2xs'
      : 'text-accents-5 hover:text-foreground hover:bg-accents-1'
  }`;

  // Contenido modal para móvil renderizado a través de Portal en document.body (100% libre de containing blocks)
  const mobileSheet = (
    <>
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 animate-in fade-in duration-200"
      />
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-x-0 bottom-0 z-50 w-full max-h-[75vh] flex flex-col rounded-t-3xl border-t border-border/80 bg-card-bg shadow-[0_-12px_48px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] overflow-hidden"
      >
        <div className="w-full pt-3 pb-1 flex justify-center items-center cursor-grab shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-border/80 dark:bg-zinc-700" />
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-border/60 shrink-0 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <Type className="w-4 h-4 text-foreground shrink-0" />
            <span className="font-semibold text-xs tracking-wider uppercase text-foreground truncate">
              {t('typographySettings')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar ajustes de tipografía"
            className="p-1.5 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 kartex-scrollbar-slim">
          {/* Modo de Lectura */}
          <div>
            <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-2">
              {t('readingMode')}
            </span>
            <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-1">
              <button
                type="button"
                onClick={() => onLayoutModeChange('continuous')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  settings.layoutMode === 'continuous'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>{t('continuous')}</span>
              </button>
              <button
                type="button"
                onClick={() => onLayoutModeChange('verse-by-verse')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  settings.layoutMode === 'verse-by-verse'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>{t('verseByVerse')}</span>
              </button>
            </div>
          </div>

          {/* Familia Tipográfica */}
          <div>
            <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-2">
              {t('fontFamily')}
            </span>
            <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-1">
              <button
                type="button"
                onClick={() => onFontFamilyChange('serif')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-serif transition-all cursor-pointer text-center ${
                  settings.fontFamily === 'serif'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                {t('serif')}
              </button>
              <button
                type="button"
                onClick={() => onFontFamilyChange('sans')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-sans transition-all cursor-pointer text-center ${
                  settings.fontFamily === 'sans'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                {t('sans')}
              </button>
            </div>
          </div>

          {/* Tamaño de Fuente */}
          <div>
            <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-2">
              {t('fontSize')}
            </span>
            <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-1">
              {fontSizes.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => onFontSizeChange(f.value)}
                  className={`flex-1 py-1.5 px-2 rounded-full text-xs transition-all cursor-pointer text-center ${
                    settings.fontSize === f.value
                      ? 'bg-foreground text-background font-bold shadow-2xs'
                      : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

                    {/* Alternar Subtítulos Temáticos */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-accents-6 font-medium">
              {t('pericopes')}
            </span>
            <button
              type="button"
              onClick={onTogglePericopes}
              className={`px-3 py-1 text-xs font-mono rounded-full border transition-all cursor-pointer active:scale-95 ${
                settings.showPericopes
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                  : 'bg-inner-card text-accents-4 border-border/80 hover:border-accents-4'
              }`}
            >
              {settings.showPericopes ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Alternar Números de Versículo */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-accents-6 font-medium">
              {t('verseNumbers')}
            </span>
            <button
              type="button"
              onClick={onToggleVerseNumbers}
              className={`px-3 py-1 text-xs font-mono rounded-full border transition-all cursor-pointer active:scale-95 ${
                settings.showVerseNumbers
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                  : 'bg-inner-card text-accents-4 border-border/80 hover:border-accents-4'
              }`}
            >
              {settings.showVerseNumbers ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className={`relative ${isOpen ? 'z-50' : ''} ${className}`} ref={containerRef}>
      {renderTrigger ? (
        renderTrigger({ isOpen, toggle: () => setIsOpen(!isOpen) })
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={t('typographySettings')}
          title={t('typographySettings')}
          className={
            buttonClassName
              ? `${buttonClassName} ${isOpen ? 'bg-foreground text-background border-transparent font-semibold shadow-xs' : ''}`
              : defaultButtonClass
          }
        >
          <Type className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold text-[11px] font-mono">Aa</span>
        </button>
      )}

      {/* Renderizado en Móvil a través de Portal directo al body */}
      {isOpen && isMobile && mounted && typeof document !== 'undefined'
        ? createPortal(mobileSheet, document.body)
        : null}

      {/* Renderizado en Escritorio / Tablet (Popover clásico con posicionamiento relativo) */}
      {isOpen && !isMobile && (
        <div
          className={`absolute ${alignClass} ${directionClass} w-64 max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl border border-border/80 bg-card-bg/95 backdrop-blur-md shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5`}
        >
          {/* Modo de Lectura */}
          <div>
            <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-1.5">
              {t('readingMode')}
            </span>
            <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-0.5">
              <button
                type="button"
                onClick={() => onLayoutModeChange('continuous')}
                className={`flex-1 py-1 px-2.5 rounded-full text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  settings.layoutMode === 'continuous'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>{t('continuous')}</span>
              </button>
              <button
                type="button"
                onClick={() => onLayoutModeChange('verse-by-verse')}
                className={`flex-1 py-1 px-2.5 rounded-full text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                  settings.layoutMode === 'verse-by-verse'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>{t('verseByVerse')}</span>
              </button>
            </div>
          </div>

          {/* Familia Tipográfica */}
          <div>
            <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-1.5">
              {t('fontFamily')}
            </span>
            <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-0.5">
              <button
                type="button"
                onClick={() => onFontFamilyChange('serif')}
                className={`flex-1 py-1 px-2.5 rounded-full text-xs font-serif transition-all cursor-pointer text-center ${
                  settings.fontFamily === 'serif'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                {t('serif')}
              </button>
              <button
                type="button"
                onClick={() => onFontFamilyChange('sans')}
                className={`flex-1 py-1 px-2.5 rounded-full text-xs font-sans transition-all cursor-pointer text-center ${
                  settings.fontFamily === 'sans'
                    ? 'bg-foreground text-background font-semibold shadow-2xs'
                    : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                {t('sans')}
              </button>
            </div>
          </div>

          {/* Tamaño de Fuente */}
          <div>
            <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-1.5">
              {t('fontSize')}
            </span>
            <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-0.5">
              {fontSizes.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => onFontSizeChange(f.value)}
                  className={`flex-1 py-1 px-1.5 rounded-full text-xs transition-all cursor-pointer text-center ${
                    settings.fontSize === f.value
                      ? 'bg-foreground text-background font-bold shadow-2xs'
                      : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

                    {/* Alternar Subtítulos Temáticos */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-accents-6 font-medium">
              {t('pericopes')}
            </span>
            <button
              type="button"
              onClick={onTogglePericopes}
              className={`px-3 py-0.5 text-xs font-mono rounded-full border transition-all cursor-pointer active:scale-95 ${
                settings.showPericopes
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                  : 'bg-inner-card text-accents-4 border-border/80 hover:border-accents-4'
              }`}
            >
              {settings.showPericopes ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Alternar Números de Versículo */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-accents-6 font-medium">
              {t('verseNumbers')}
            </span>
            <button
              type="button"
              onClick={onToggleVerseNumbers}
              className={`px-3 py-0.5 text-xs font-mono rounded-full border transition-all cursor-pointer active:scale-95 ${
                settings.showVerseNumbers
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                  : 'bg-inner-card text-accents-4 border-border/80 hover:border-accents-4'
              }`}
            >
              {settings.showVerseNumbers ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
