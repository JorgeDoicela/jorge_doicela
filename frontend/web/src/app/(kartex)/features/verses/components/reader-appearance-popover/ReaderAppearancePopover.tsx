'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Type, AlignLeft, ListOrdered } from 'lucide-react';
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

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera o presionar escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
  }, [isOpen]);

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

      {isOpen && (
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
