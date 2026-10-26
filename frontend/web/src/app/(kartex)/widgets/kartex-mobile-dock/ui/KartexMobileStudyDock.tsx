'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { LucideIcon, BookOpen, Languages, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useKartexPassageSafe } from '../../../entities/passage';
import { MobileTranslationPopover } from '../../../entities/translations';
import { ReaderAppearancePopover } from '../../../features/verses';
import { getChapterCountForBook } from '../../../shared/data/canonData';

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

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Detener audio al cambiar de libro o capítulo
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [passageContext?.selectedBookId, passageContext?.selectedChapter]);

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const verseElements = document.querySelectorAll('[data-verse-item="true"]');
    let fullText = '';
    verseElements.forEach((el) => {
      fullText += (el.textContent || '') + ' ';
    });

    if (!fullText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const currentChapter = passageContext?.selectedChapter || 1;
  const maxChapters = useMemo(() => {
    return getChapterCountForBook(passageContext?.selectedBook?.abbreviation);
  }, [passageContext?.selectedBook?.abbreviation]);

  const books = passageContext?.books ?? [];
  const currentBookIdx = passageContext?.selectedBookId
    ? books.findIndex((b) => b.id === passageContext.selectedBookId)
    : -1;
  const prevBook = currentBookIdx > 0 ? books[currentBookIdx - 1] : null;
  const nextBook =
    currentBookIdx >= 0 && currentBookIdx < books.length - 1
      ? books[currentBookIdx + 1]
      : null;

  const canGoPrev = currentChapter > 1 || prevBook !== null;
  const canGoNext = currentChapter < maxChapters || nextBook !== null;

  const bookDisplayName = useMemo(() => {
    if (!passageContext?.selectedBook) return 'Génesis';
    const abbr = passageContext.selectedBook.abbreviation;
    return tBooks.has(abbr as any)
      ? tBooks(abbr as any)
      : passageContext.selectedBook.name;
  }, [passageContext?.selectedBook, tBooks]);

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
        {/* Nivel Superior: Audio y Navegación Canónica Integrada en Modo Lector (Geist UI) */}
        {isReaderView && passageContext && (
          <div className="pt-2 pb-1 px-3 flex items-center justify-between gap-2.5 select-none">
            {/* Botón Circular de Audio Geist */}
            <button
              type="button"
              onClick={handleToggleAudio}
              aria-label={isPlayingAudio ? 'Pausar audio bíblico' : 'Reproducir audio bíblico'}
              title={isPlayingAudio ? 'Pausar audio bíblico' : 'Escuchar capítulo'}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 shrink-0 border border-border/80 shadow-2xs ${
                isPlayingAudio
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'bg-accents-1 hover:bg-accents-2 text-foreground'
              }`}
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-current stroke-none" />
              ) : (
                <Play className="w-4 h-4 fill-current stroke-none ml-0.5" />
              )}
            </button>

            {/* Cápsula de Navegación Canónica Geist */}
            <div className="flex-1 h-10 rounded-full bg-accents-1 border border-border/80 hover:border-accents-3/60 flex items-center justify-between px-2 select-none shadow-2xs transition-colors">
              {/* Capítulo anterior */}
              <button
                type="button"
                onClick={() => passageContext.prevChapter()}
                disabled={!canGoPrev}
                aria-label="Capítulo anterior"
                className="p-1 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-2/80 active:scale-90 transition-all cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.25]" />
              </button>

              {/* Nombre del Libro y Capítulo (Al tocar abre el selector de libros) */}
              <button
                type="button"
                onClick={handleToggleLeft}
                className="px-2 py-1 text-xs font-mono font-bold tracking-wider uppercase truncate text-foreground hover:opacity-80 active:scale-95 transition-all cursor-pointer"
              >
                {bookDisplayName} {currentChapter}
              </button>

              {/* Capítulo siguiente */}
              <button
                type="button"
                onClick={() => passageContext.nextChapter()}
                disabled={!canGoNext}
                aria-label="Capítulo siguiente"
                className="p-1 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-2/80 active:scale-90 transition-all cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.25]" />
              </button>
            </div>
          </div>
        )}

        {/* Nivel Inferior: Herramientas del Dock */}
        <div className="px-2 pt-0.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around gap-1">
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
