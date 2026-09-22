'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  ReaderTone,
  ReaderSettings,
  Verse,
  BookInfo,
} from '../../types';
import { UnifiedPassagePicker, getChaptersForBookId, Book } from '../../../../entities/books';
import { TranslationSelector } from '../../../../entities/translations';
import { Printer, Copy, Check, Type, AlignLeft, ListOrdered, Maximize2, Minimize2, MoreHorizontal } from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';

interface ReaderToolbarProps {
  readerSettings: ReaderSettings;
  onLayoutModeChange: (mode: ReaderLayoutMode) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (family: ReaderFontFamily) => void;
  onReaderToneChange?: (tone: ReaderTone) => void;
  onToggleFocusMode?: () => void;
  onToggleVerseNumbers: () => void;
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
}

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  readerSettings,
  onLayoutModeChange,
  onFontSizeChange,
  onFontFamilyChange,
  onReaderToneChange,
  onToggleFocusMode,
  onToggleVerseNumbers,
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
}) => {
  const t = useTranslations('Toolbar');
  const tBooks = useTranslations('Books');
  const passageContext = useBiblePassageSafe();
  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const [copied, setCopied] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);

  // Cerrar popovers al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appearanceRef.current && !appearanceRef.current.contains(e.target as Node)) {
        setAppearanceOpen(false);
      }
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(e.target as Node)) {
        setMoreOptionsOpen(false);
      }
    };
    if (appearanceOpen || moreOptionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [appearanceOpen, moreOptionsOpen]);

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
    <div className="relative z-30 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl bg-white/95 dark:bg-black/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-xs transition-all print:hidden">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 w-full">
        {/* Lado Izquierdo: Pasaje Principal y Versión Bíblica */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          {/* Selector de pasaje: se oculta en desktop cuando el panel lateral está abierto para evitar duplicidad */}
          <div className={isLeftOpen ? 'lg:hidden' : 'flex items-center animate-in fade-in duration-200'}>
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
            <TranslationSelector
              selectedTranslationId={selectedTranslationId ?? null}
              onSelectTranslation={onSelectTranslation}
            />
          )}
        </div>

        {/* Lado Derecho: Apariencia Tipográfica y Acciones */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Menú Flotante de Apariencia Tipográfica (Popover Geist Aa) */}
          <div className={`relative ${appearanceOpen ? 'z-50' : ''}`} ref={appearanceRef}>
            <button
              type="button"
              onClick={() => setAppearanceOpen(!appearanceOpen)}
              className={`px-2 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                appearanceOpen
                  ? 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title="Ajustes de Tipografía y Lectura"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px] font-mono">Aa</span>
            </button>

            {/* Panel Popover Desplegable */}
            {appearanceOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                {/* Modo de Lectura (Especialmente accesible en móvil) */}
                <div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Modo de Lectura
                  </span>
                  <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onLayoutModeChange('continuous')}
                      className={`py-1.5 text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        readerSettings.layoutMode === 'continuous'
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                      <span>{t('continuous')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onLayoutModeChange('verse-by-verse')}
                      className={`py-1.5 text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                        readerSettings.layoutMode === 'verse-by-verse'
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                      <span>{t('verseByVerse')}</span>
                    </button>
                  </div>
                </div>

                {/* Familia Tipográfica */}
                <div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Familia Tipográfica
                  </span>
                  <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onFontFamilyChange('serif')}
                      className={`py-1.5 text-xs font-serif transition-colors cursor-pointer text-center ${
                        readerSettings.fontFamily === 'serif'
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      {t('serif')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onFontFamilyChange('sans')}
                      className={`py-1.5 text-xs font-sans transition-colors cursor-pointer text-center ${
                        readerSettings.fontFamily === 'sans'
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      {t('sans')}
                    </button>
                  </div>
                </div>

                {/* Tamaño de Fuente */}
                <div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Tamaño de Fuente
                  </span>
                  <div className="grid grid-cols-4 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
                    {fontSizes.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => onFontSizeChange(f.value)}
                        className={`py-1.5 text-xs transition-colors cursor-pointer text-center ${
                          readerSettings.fontSize === f.value
                            ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold'
                            : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tono de Lienzo Editorial */}
                <div>
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Tono de Lectura
                  </span>
                  <div className="grid grid-cols-3 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden text-[11px]">
                    <button
                      type="button"
                      onClick={() => onReaderToneChange?.('system')}
                      className={`py-1.5 transition-colors cursor-pointer text-center ${
                        (readerSettings.readerTone || 'system') === 'system'
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => onReaderToneChange?.('sepia')}
                      className={`py-1.5 transition-colors cursor-pointer text-center ${
                        readerSettings.readerTone === 'sepia'
                          ? 'bg-[#FAF6EE] dark:bg-[#2A231C] text-[#5F4B32] dark:text-[#F3E5AB] font-bold border border-amber-300/40'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      Sepia
                    </button>
                    <button
                      type="button"
                      onClick={() => onReaderToneChange?.('dark')}
                      className={`py-1.5 transition-colors cursor-pointer text-center ${
                        readerSettings.readerTone === 'dark'
                          ? 'bg-black text-white font-bold'
                          : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                      }`}
                    >
                      OLED
                    </button>
                  </div>
                </div>

                {/* Alternar Números de Versículo */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Números de Versículo
                  </span>
                  <button
                    type="button"
                    onClick={onToggleVerseNumbers}
                    className={`px-2 py-0.5 text-xs font-mono rounded-md border transition-all cursor-pointer ${
                      readerSettings.showVerseNumbers
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-semibold shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    123
                  </button>
                </div>

                {/* Guía Rápida de Atajos de Teclado */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80 text-[10px] text-zinc-400 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Navegar capítulos:</span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-bold">← / → ó J / K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modo Enfoque:</span>
                    <span className="text-zinc-600 dark:text-zinc-300 font-bold">F</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamaño de fuente:</span>
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
              className={`hidden sm:flex p-1.5 rounded-lg transition-colors cursor-pointer ${
                readerSettings.focusMode
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title={readerSettings.focusMode ? 'Salir de Modo Enfoque [Esc]' : 'Modo Enfoque Inmersivo [F]'}
            >
              {readerSettings.focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Desktop-only: Copiar Capítulo */}
          {verses.length > 0 && (
            <button
              type="button"
              onClick={handleCopyChapter}
              className="hidden sm:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
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
            className="hidden sm:flex p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            title="Imprimir o exportar pasaje a PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Mobile-only: Menú Compacto de Acciones Adicionales (...) */}
          <div className={`relative sm:hidden ${moreOptionsOpen ? 'z-50' : ''}`} ref={moreOptionsRef}>
            <button
              type="button"
              onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-center ${
                moreOptionsOpen
                  ? 'bg-zinc-200/80 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
              title="Más acciones"
              aria-label="Más acciones"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {moreOptionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                {verses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyChapter();
                      setMoreOptionsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-left font-medium"
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
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-left font-medium"
                  >
                    {readerSettings.focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    <span>{readerSettings.focusMode ? 'Salir de Enfoque' : 'Modo Enfoque'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMoreOptionsOpen(false);
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-left font-medium"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
