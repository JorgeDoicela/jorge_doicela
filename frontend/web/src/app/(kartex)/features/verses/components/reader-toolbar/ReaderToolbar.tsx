'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  ReaderSettings,
  Verse,
  BookInfo,
} from '../../types';
import { UnifiedPassagePicker, getChaptersForBookId, Book } from '../../../../entities/books';
import { TranslationSelector } from '../../../../entities/translations';
import { Printer, Copy, Check, Type, AlignLeft, ListOrdered, Maximize2, Minimize2, MoreHorizontal, Volume2 } from 'lucide-react';
import { useKartexPassageSafe } from '../../../../entities/passage';
import { KartexAudioControlsPopover } from '../audio-controls';
import { ReaderFontFamilySelector } from '../font-family-selector/ReaderFontFamilySelector';

interface ReaderToolbarProps {
  readerSettings: ReaderSettings;
  onLayoutModeChange: (mode: ReaderLayoutMode) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (family: ReaderFontFamily) => void;
  onToggleFocusMode?: () => void;
  onToggleVerseNumbers: () => void;
  onTogglePericopes?: () => void;
  books?: (BookInfo | Book | { id: number; name: string; abbreviation: string; testament: string })[];
  selectedBookId?: number | null;
  onSelectPassage?: (bookId: number, chapter: number) => void;
  onSelectBook?: (id: number | null) => void;
  selectedBookAbbr?: string;
  selectedBookName?: string;
  selectedChapter: number | null;
  onSelectChapter: (chapter: number | null) => void;
  onPrevChapter?: () => void;
  onNextChapter?: (maxChapters?: number) => void;
  verses: Verse[];
  selectedTranslationId?: number | null;
  onSelectTranslation?: (id: number | null) => void;
  activeTranslationName?: string;
  className?: string;
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  readerSettings,
  onLayoutModeChange,
  onFontSizeChange,
  onFontFamilyChange,
  onToggleFocusMode,
  onToggleVerseNumbers,
  onTogglePericopes,
  books = [],
  selectedBookId,
  onSelectPassage,
  onSelectBook,
  selectedBookAbbr,
  selectedBookName,
  selectedChapter,
  onSelectChapter,
  onPrevChapter,
  onNextChapter,
  verses = [],
  selectedTranslationId,
  onSelectTranslation,
  activeTranslationName,
  className = '',
}) => {
  const t = useTranslations('Toolbar');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();
  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const [copied, setCopied] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  // Cerrar popovers al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appearanceRef.current && !appearanceRef.current.contains(e.target as Node)) {
        setAppearanceOpen(false);
      }
      if (audioRef.current && !audioRef.current.contains(e.target as Node)) {
        setAudioOpen(false);
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(e.target as Node)) {
        setMoreOptionsOpen(false);
      }
    };
    if (appearanceOpen || audioOpen || moreOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [appearanceOpen, audioOpen, moreOptionsOpen]);

  const totalChapters = useMemo(() => {
    if (!selectedBookId) return 50;
    return getChaptersForBookId(selectedBookId) || 50;
  }, [selectedBookId]);

  const handleCopyChapter = () => {
    if (!verses.length) return;
    const localizedBookTitle = selectedBookAbbr
      ? (tBooks.has(selectedBookAbbr as any) ? tBooks(selectedBookAbbr as any) : selectedBookName)
      : selectedBookName;
    const header = `${localizedBookTitle || ''} ${selectedChapter || ''} (${activeTranslationName || ''})\n\n`;
    const body = verses.map((v) => `${v.verseNumber}. ${v.text}`).join('\n');
    void navigator.clipboard.writeText(header + body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontSizes: { label: string; value: ReaderFontSize }[] = [
    { label: 'A-', value: 'sm' },
    { label: 'A', value: 'md' },
    { label: 'A+', value: 'lg' },
    { label: 'A++', value: 'xl' },
  ];

  const handlePassageSelect = (bookId: number, chapter: number) => {
    if (onSelectPassage) {
      onSelectPassage(bookId, chapter);
    } else {
      onSelectBook?.(bookId);
      onSelectChapter(chapter);
    }
  };

  const normalizedBooks: Book[] = (books as any[]).map((b) => ({
    id: b.id,
    name: b.name,
    abbreviation: b.abbreviation,
    testament: b.testament === 'NT' ? 'NT' : 'OT',
  }));

  return (
    <div className={`relative z-30 border border-border/80 rounded-xl bg-card-bg/95 backdrop-blur-md px-2 sm:px-3 py-1.5 sm:py-2 shadow-xs transition-all print:hidden ${className}`}>
      <div className="flex items-center justify-between gap-1 sm:gap-2.5 w-full">
        {/* Lado Izquierdo: Pasaje Principal y Versión Bíblica */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink">
          {/* Selector de pasaje: se oculta en desktop cuando el panel lateral está abierto para evitar duplicidad */}
          <div className={isLeftOpen ? 'lg:hidden' : 'flex items-center min-w-0 shrink'}>
            <UnifiedPassagePicker
              books={normalizedBooks}
              selectedBookId={selectedBookId || null}
              selectedChapter={selectedChapter}
              onSelectPassage={handlePassageSelect}
              onPrevChapter={onPrevChapter}
              onNextChapter={() => onNextChapter?.(totalChapters)}
              size="sm"
            />
          </div>

          {onSelectTranslation && (
            <div className="shrink-0">
              <TranslationSelector
                selectedTranslationId={selectedTranslationId ?? null}
                onSelectTranslation={onSelectTranslation}
                align="right"
              />
            </div>
          )}
        </div>

        {/* Lado Derecho: Audio Bíblico, Apariencia Tipográfica y Acciones */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0 pl-1">
          {/* Menú Flotante de Audio Bíblico Nativo (Popover Geist) */}
          <div className={`relative ${audioOpen ? 'z-50' : ''}`} ref={audioRef}>
            <button
              type="button"
              onClick={() => setAudioOpen((prev) => !prev)}
              className={`px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 ${
                audioOpen || passageContext?.isPlayingAudio
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title="Audio Bíblico"
              aria-label="Controles de audio bíblico"
            >
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              {passageContext?.isPlayingAudio && (
                <span className="font-semibold text-[11px] font-mono">
                  {passageContext.currentAudioVerse ? `v.${passageContext.currentAudioVerse}` : 'Audio'}
                </span>
              )}
            </button>

            <KartexAudioControlsPopover
              isOpen={audioOpen}
              onClose={() => setAudioOpen(false)}
              align="right"
            />
          </div>

          {/* Menú Flotante de Apariencia Tipográfica (Popover Geist Aa) */}
          <div className={`relative ${appearanceOpen ? 'z-50' : ''}`} ref={appearanceRef}>
            <button
              type="button"
              onClick={() => setAppearanceOpen(!appearanceOpen)}
              className={`px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 ${
                appearanceOpen
                  ? 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title={t('typographySettings')}
            >
              <Type className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-[11px] font-mono">Aa</span>
            </button>

            {/* Panel Popover Desplegable */}
            {appearanceOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 max-w-[calc(100vw-2rem)] p-3.5 rounded-2xl border border-border/80 bg-card-bg/95 backdrop-blur-md shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5">
                {/* Modo de Lectura (Especialmente accesible en móvil) */}
                <div>
                  <span className="text-[10px] font-semibold text-accents-4 uppercase tracking-wider block mb-1.5">
                    {t('readingMode')}
                  </span>
                  <div className="flex p-0.5 rounded-full border border-border/80 bg-inner-card/60 gap-0.5">
                    <button
                      type="button"
                      onClick={() => onLayoutModeChange('continuous')}
                      className={`flex-1 py-1 px-2.5 rounded-full text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        readerSettings.layoutMode === 'continuous'
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
                        readerSettings.layoutMode === 'verse-by-verse'
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
                  <ReaderFontFamilySelector
                    value={readerSettings.fontFamily}
                    onChange={(family) => onFontFamilyChange(family)}
                    size="sm"
                  />
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
                          readerSettings.fontSize === f.value
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
                {onTogglePericopes && (
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-medium">
                      {t('pericopes')}
                    </span>
                    <button
                      type="button"
                      onClick={onTogglePericopes}
                      className={`px-3 py-0.5 text-xs font-mono rounded-full border transition-all cursor-pointer active:scale-95 ${
                        readerSettings.showPericopes
                          ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                          : 'bg-inner-card text-accents-4 border-border/80 hover:border-accents-4'
                      }`}
                    >
                      {readerSettings.showPericopes ? 'ON' : 'OFF'}
                    </button>
                  </div>
                )}

                {/* Alternar Números de Versículo */}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-accents-6 font-medium">
                    {t('verseNumbers')}
                  </span>
                  <button
                    type="button"
                    onClick={onToggleVerseNumbers}
                    className={`px-3 py-0.5 text-xs font-mono rounded-full border transition-all cursor-pointer active:scale-95 ${
                      readerSettings.showVerseNumbers
                        ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                        : 'bg-inner-card text-accents-4 border-border/80 hover:border-accents-4'
                    }`}
                  >
                    123
                  </button>
                </div>

                {/* Guía Rápida de Atajos de Teclado */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 text-[10px] text-zinc-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>{t('navigateChapters')}</span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-bold">{t('shortcutNavKeys')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('focusMode')}</span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-bold">F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('fontSizeLabel')}</span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-bold">+ / -</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block h-4 w-px bg-zinc-200 dark:bg-zinc-800 select-none mx-0.5" />

          {/* Desktop-only: Modo Enfoque Inmersivo */}
          {onToggleFocusMode && (
            <button
              type="button"
              onClick={onToggleFocusMode}
              className={`hidden sm:flex p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 ${
                readerSettings.focusMode
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title={readerSettings.focusMode ? t('exitFocusKey') : t('focusModeKey')}
            >
              {readerSettings.focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Desktop-only: Copiar Capítulo */}
          {verses.length > 0 && (
            <button
              type="button"
              onClick={handleCopyChapter}
              className="hidden sm:flex p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
              title={copied ? t('copied') : t('copyTooltip')}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Desktop-only: Imprimir / Exportar Pasaje */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') window.print();
            }}
            className="hidden sm:flex p-1.5 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer active:scale-95"
            title={t('printOrPdf')}
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Mobile-only: Menú Compacto de Acciones Adicionales (...) */}
          <div className={`relative sm:hidden ${moreOptionsOpen ? 'z-50' : ''}`} ref={moreOptionsRef}>
            <button
              type="button"
              onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
              className={`p-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center justify-center active:scale-95 ${
                moreOptionsOpen
                  ? 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title={t('moreActions')}
              aria-label={t('moreActions')}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {moreOptionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 max-w-[calc(100vw-2rem)] p-1.5 rounded-2xl border border-border/80 bg-card-bg/95 backdrop-blur-md shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                {verses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyChapter();
                      setMoreOptionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-accents-1 transition-colors cursor-pointer text-left font-medium active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('copied') : t('copyTooltip')}</span>
                  </button>
                )}

                {onToggleFocusMode && (
                  <button
                    type="button"
                    onClick={() => {
                      onToggleFocusMode();
                      setMoreOptionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-accents-1 transition-colors cursor-pointer text-left font-medium active:scale-95"
                  >
                    {readerSettings.focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span>{readerSettings.focusMode ? t('exitFocus') : t('focusModeShort')}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMoreOptionsOpen(false);
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-accents-1 transition-colors cursor-pointer text-left font-medium active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printPdf')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
