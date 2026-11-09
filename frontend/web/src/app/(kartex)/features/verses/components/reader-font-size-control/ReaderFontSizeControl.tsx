'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ReaderFontSize } from '../../types';
import {
  MIN_READER_FONT_SIZE,
  MAX_READER_FONT_SIZE,
  normalizeFontSizeToPx,
} from '../../config/readerFontSize';

interface ReaderFontSizeControlProps {
  value: ReaderFontSize;
  onChange: (size: number) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const ReaderFontSizeControl: React.FC<ReaderFontSizeControlProps> = ({
  value,
  onChange,
  className = '',
  size = 'md',
}) => {
  const t = useTranslations('Toolbar');
  const currentPx = normalizeFontSizeToPx(value);

  const handleDecrement = () => {
    onChange(Math.max(MIN_READER_FONT_SIZE, currentPx - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(MAX_READER_FONT_SIZE, currentPx + 1));
  };

  const isSmall = size === 'sm';

  return (
    <div className={`select-none ${className}`}>
      {/* Cabecera del Control: Etiqueta y Valor Numérico en Píxeles */}
      <div className={`flex items-center justify-between ${isSmall ? 'mb-1.5' : 'mb-2'}`}>
        <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider">
          {t('fontSize')}
        </span>
        <span className="text-[11px] font-mono font-medium text-foreground">
          {currentPx}px
        </span>
      </div>

      {/* Cápsula Interactiva: Stepper A- / Deslizador Continuo / Stepper A+ */}
      <div className="flex items-center gap-2.5 p-1 rounded-full border border-border/80 bg-inner-card/60">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={currentPx <= MIN_READER_FONT_SIZE}
          aria-label="Disminuir tamaño de fuente"
          title="Disminuir tamaño (A-)"
          className={`${
            isSmall ? 'w-7 h-7 text-[11px]' : 'w-8 h-8 text-xs'
          } rounded-full flex items-center justify-center font-bold text-foreground hover:bg-accents-2 active:scale-90 transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none shrink-0`}
        >
          A-
        </button>

        <div className="flex-1 px-1 relative flex items-center">
          <input
            type="range"
            min={MIN_READER_FONT_SIZE}
            max={MAX_READER_FONT_SIZE}
            step={1}
            value={currentPx}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Deslizador de tamaño de fuente"
            aria-valuemin={MIN_READER_FONT_SIZE}
            aria-valuemax={MAX_READER_FONT_SIZE}
            aria-valuenow={currentPx}
            className="reader-range-slider"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={currentPx >= MAX_READER_FONT_SIZE}
          aria-label="Aumentar tamaño de fuente"
          title="Aumentar tamaño (A+)"
          className={`${
            isSmall ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
          } rounded-full flex items-center justify-center font-bold text-foreground hover:bg-accents-2 active:scale-90 transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none shrink-0`}
        >
          A+
        </button>
      </div>
    </div>
  );
};

