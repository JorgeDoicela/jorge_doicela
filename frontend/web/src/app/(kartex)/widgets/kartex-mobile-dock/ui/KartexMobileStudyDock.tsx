'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { LucideIcon, BookOpen, Languages } from 'lucide-react';
import { useKartexPassageSafe } from '../../../entities/passage';
import { MobileTranslationPopover } from '../../../entities/translations';
import { ReaderAppearancePopover } from '../../../features/verses';

export interface KartexMobileStudyDockProps {
  isVisible?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  leftTitle?: string;
  rightTitle?: string;
  leftLabel?: string;
  rightLabel?: string;
  isReaderView?: boolean;
  onOpenLeft?: () => void;
  onOpenRight?: () => void;
  className?: string;
}

export const KartexMobileStudyDock: React.FC<KartexMobileStudyDockProps> = ({
  isVisible = true,
  leftIcon: LeftIcon = BookOpen,
  rightIcon: RightIcon = Languages,
  leftTitle,
  rightTitle,
  leftLabel,
  rightLabel,
  isReaderView = false,
  onOpenLeft,
  onOpenRight,
  className = '',
}) => {
  const tDock = useTranslations('MobileDock');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();

  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const isRightOpen = passageContext?.isRightInspectorOpen ?? false;



  const handleToggleLeft = () => {
    if (onOpenLeft) {
      onOpenLeft();
    } else {
      passageContext?.toggleLeftSidebar();
    }
  };

  const handleToggleRight = () => {
    if (onOpenRight) {
      onOpenRight();
    } else {
      passageContext?.toggleRightInspector();
    }
  };

  const displayLeftLabel =
    leftLabel || (isReaderView ? tDock('books') : tDock('navigation'));
  const displayRightLabel =
    rightLabel || (isReaderView ? tDock('exegesis') : tDock('details'));

  const showTranslation = isReaderView;

  return (
    <nav
      aria-label="Navegación móvil de estudio bíblico"
      data-mobile-dock="true"
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden print:hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } ${className}`}
    >
      {/* Contenedor Unificado Integrado (Estilo Geist / Vercel Style) */}
      <div className="w-full pointer-events-auto bg-background/95 dark:bg-black/95 sepia:bg-[#FAF6EE]/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)] max-w-lg mx-auto sm:rounded-t-2xl sm:border-x">
        {/* Nivel de Herramientas del Dock */}
        <div className="px-2 pt-1 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around gap-1">
        {/* 1. Selector de Libros / Navegación del Módulo */}
        <button
          type="button"
          onClick={handleToggleLeft}
          aria-label={leftTitle || displayLeftLabel}
          aria-expanded={isLeftOpen}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 transition-all select-none cursor-pointer flex-1 min-w-0 active:scale-90 ${
            isLeftOpen
              ? 'text-foreground font-semibold'
              : 'text-accents-4 hover:text-foreground'
          }`}
          title={leftTitle || displayLeftLabel}
        >
          <LeftIcon className="w-5 h-5 shrink-0" strokeWidth={isLeftOpen ? 2.25 : 1.75} />
          <span className="text-[10px] tracking-tight font-medium leading-none truncate max-w-full">
            {displayLeftLabel}
          </span>
        </button>

        {/* 2. Selector de Traducción Bíblica (Despliegue hacia arriba) */}
        {showTranslation && passageContext && (
          <MobileTranslationPopover
            selectedTranslationId={passageContext.selectedTranslationId}
            onSelectTranslation={passageContext.setSelectedTranslationId}
            align="center"
            direction="up"
            className="flex-1 flex justify-center"
            renderTrigger={({ isOpen, toggle, activeAbbreviation }) => (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen}
                aria-label={tDock('version')}
                title={tDock('version')}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 transition-all select-none cursor-pointer w-full active:scale-90 ${
                  isOpen
                    ? 'text-foreground font-semibold'
                    : 'text-accents-4 hover:text-foreground'
                }`}
              >
                <Languages className="w-5 h-5 shrink-0" strokeWidth={isOpen ? 2.25 : 1.75} />
                <span className="text-[10px] tracking-tight font-mono font-medium leading-none truncate max-w-full">
                  {activeAbbreviation}
                </span>
              </button>
            )}
          />
        )}

        {/* 3. Control de Apariencia y Tipografía (Solo en Lector Estándar) */}
        {isReaderView && (
          <ReaderAppearancePopover
            align="center"
            direction="up"
            className="flex-1 flex justify-center"
            renderTrigger={({ isOpen, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen}
                aria-label={tDock('format')}
                title={tDock('format')}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 transition-all select-none cursor-pointer w-full active:scale-90 ${
                  isOpen
                    ? 'text-foreground font-semibold'
                    : 'text-accents-4 hover:text-foreground'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <span className="text-[13px] font-mono font-bold leading-none">Aa</span>
                </div>
                <span className="text-[10px] tracking-tight font-medium leading-none truncate max-w-full">
                  {tDock('format')}
                </span>
              </button>
            )}
          />
        )}

        {/* 4. Inspector Exegético / Ficha del Módulo */}
        <button
          type="button"
          onClick={handleToggleRight}
          aria-label={rightTitle || displayRightLabel}
          aria-expanded={isRightOpen}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1.5 transition-all select-none cursor-pointer flex-1 min-w-0 relative active:scale-90 ${
            isRightOpen
              ? 'text-foreground font-semibold'
              : 'text-accents-4 hover:text-foreground'
          }`}
          title={rightTitle || displayRightLabel}
        >
          <RightIcon className="w-5 h-5 shrink-0" strokeWidth={isRightOpen ? 2.25 : 1.75} />
          <span className="text-[10px] tracking-tight font-medium leading-none truncate max-w-full">
            {displayRightLabel}
          </span>
        </button>
        </div>
      </div>
    </nav>
  );
};
