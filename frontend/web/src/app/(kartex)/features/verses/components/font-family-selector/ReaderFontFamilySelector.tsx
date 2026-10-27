'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { READER_FONTS, ReaderFontFamily } from '../../config/readerFonts';

export interface ReaderFontFamilySelectorProps {
  value: ReaderFontFamily;
  onChange: (family: ReaderFontFamily) => void;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Selector Universal de Familias Tipográficas de Kartex.
 * Consume automáticamente el registro de fuentes `READER_FONTS`.
 * Cualquier fuente añadida al catálogo se renderiza automáticamente aquí con preview real.
 */
export const ReaderFontFamilySelector: React.FC<ReaderFontFamilySelectorProps> = ({
  value,
  onChange,
  className = '',
  size = 'md',
}) => {
  const t = useTranslations('Toolbar');

  const paddingClass = size === 'sm' ? 'py-1 px-2.5 text-xs' : 'py-1.5 px-3 text-xs';

  return (
    <div
      role="radiogroup"
      aria-label={t('fontFamily')}
      className={`flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-0.5 sm:gap-1 ${className}`}
    >
      {READER_FONTS.map((font) => {
        const isSelected = value === font.id;
        const label = t.has(font.labelKey as any) ? t(font.labelKey as any) : font.defaultLabel;
        const tooltip = t.has(`${font.labelKey}Tooltip` as any)
          ? t(`${font.labelKey}Tooltip` as any)
          : font.description;

        return (
          <button
            key={font.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(font.id as ReaderFontFamily)}
            title={tooltip}
            className={`flex-1 ${paddingClass} rounded-full ${font.cssClass} transition-all cursor-pointer text-center select-none active:scale-95 ${
              isSelected
                ? 'bg-foreground text-background font-semibold shadow-2xs'
                : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
