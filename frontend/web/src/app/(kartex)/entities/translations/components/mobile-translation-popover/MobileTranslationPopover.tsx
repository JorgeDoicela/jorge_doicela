'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations as useI18n } from 'next-intl';
import { Languages, Check } from 'lucide-react';
import { useTranslations } from '../../hooks/useTranslations';

export interface MobileTranslationPopoverProps {
  selectedTranslationId: number | null;
  onSelectTranslation: (id: number | null) => void;
  align?: 'left' | 'right' | 'center';
  direction?: 'up' | 'down';
  className?: string;
  renderTrigger?: (props: {
    isOpen: boolean;
    toggle: () => void;
    activeAbbreviation: string;
  }) => React.ReactNode;
}

export function MobileTranslationPopover({
  selectedTranslationId,
  onSelectTranslation,
  align = 'center',
  direction = 'up',
  className = '',
  renderTrigger,
}: MobileTranslationPopoverProps) {
  const t = useI18n('Toolbar');
  const { translations, loading, error } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTranslation =
    translations.find((tr) => tr.id === selectedTranslationId) || translations[0];
  const activeAbbreviation = activeTranslation?.abbreviation || 'NTV';

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

  const alignClass =
    align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : align === 'left'
      ? 'left-0'
      : 'right-0';

  const directionClass = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-1.5';

  return (
    <div className={`relative ${isOpen ? 'z-50' : ''} ${className}`} ref={containerRef}>
      {renderTrigger ? (
        renderTrigger({
          isOpen,
          toggle: () => setIsOpen(!isOpen),
          activeAbbreviation,
        })
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={t('selectTranslation')}
          title={t('selectTranslation')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 transition-all cursor-pointer select-none active:scale-90 ${
            isOpen
              ? 'text-foreground font-semibold'
              : 'text-accents-4 hover:text-foreground'
          }`}
        >
          <Languages className="w-5 h-5 shrink-0" strokeWidth={isOpen ? 2 : 1.75} />
          <span className="text-[10px] tracking-tight font-medium leading-none truncate max-w-[64px]">
            {activeAbbreviation}
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute ${alignClass} ${directionClass} w-72 max-w-[calc(100vw-2rem)] max-h-80 overflow-y-auto overscroll-contain rounded-xl p-1.5 bg-card-bg border border-border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 kartex-scrollbar-slim space-y-1`}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 px-2 py-1 border-b border-border/60">
            {t('selectTranslation')}
          </div>

          {loading ? (
            <div className="p-3 text-center text-xs text-accents-4">...</div>
          ) : error ? (
            <div className="p-2 text-center text-xs text-red-500">{error}</div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {translations.map((tr) => {
                const isSelected = tr.id === activeTranslation?.id;
                return (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => {
                      onSelectTranslation(tr.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-foreground text-background font-semibold shadow-xs'
                        : 'text-accents-6 hover:text-foreground hover:bg-accents-1'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-mono font-bold text-xs shrink-0 w-11">
                        {tr.abbreviation}
                      </span>
                      <span className="truncate">{tr.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
