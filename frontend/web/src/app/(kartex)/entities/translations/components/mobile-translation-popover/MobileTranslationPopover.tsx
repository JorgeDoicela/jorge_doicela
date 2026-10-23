'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations as useI18n } from 'next-intl';
import { Languages, Check, X } from 'lucide-react';
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

  const activeTranslation =
    translations.find((tr) => tr.id === selectedTranslationId) || translations[0];
  const activeAbbreviation = activeTranslation?.abbreviation || 'NTV';

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

  const alignClass =
    align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : align === 'left'
      ? 'left-0'
      : 'right-0';

  const directionClass = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-1.5';

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
            <Languages className="w-4 h-4 text-foreground shrink-0" />
            <span className="font-semibold text-xs tracking-wider uppercase text-foreground truncate">
              {t('selectTranslation')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar selector de versiones"
            className="p-1.5 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1.5 kartex-scrollbar-slim">
          {loading ? (
            <div className="p-4 text-center text-xs text-accents-4">...</div>
          ) : error ? (
            <div className="p-3 text-center text-xs text-red-500">{error}</div>
          ) : (
            translations.map((tr) => {
              const isSelected = tr.id === activeTranslation?.id;
              return (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => {
                    onSelectTranslation(tr.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-xs transition-all cursor-pointer text-left active:scale-[0.98] ${
                    isSelected
                      ? 'bg-foreground text-background font-semibold shadow-xs'
                      : 'text-foreground hover:bg-accents-1 bg-inner-card/50 border border-border/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-mono font-bold text-xs shrink-0 w-14">
                      {tr.abbreviation}
                    </span>
                    <span className="truncate text-xs font-medium">{tr.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );

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

      {/* Renderizado en Móvil a través de Portal directo al body */}
      {isOpen && isMobile && mounted && typeof document !== 'undefined'
        ? createPortal(mobileSheet, document.body)
        : null}

      {/* Renderizado en Escritorio / Tablet (Popover clásico con posicionamiento relativo) */}
      {isOpen && !isMobile && (
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
