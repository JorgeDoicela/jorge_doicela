'use client';

import React, { useState } from 'react';
import {
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
  ReaderSettings,
  Verse,
  BookInfo,
} from '../../types';
import { UnifiedPassagePicker } from '../../../books/components/passage-picker/UnifiedPassagePicker';
import { getChaptersForBookId } from '../../../books/data/canonicCategories';
import { TranslationSelector } from '../../../translations/components/translation-selector/TranslationSelector';
import { Book } from '../../../books/hooks/useBooks';

interface ReaderToolbarProps {
  readerSettings: ReaderSettings;
  onLayoutModeChange: (mode: ReaderLayoutMode) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (family: ReaderFontFamily) => void;
  onToggleVerseNumbers: () => void;
  books?: (BookInfo | Book | { id: number; name: string; abbreviation: string; testament: string })[];
  selectedBookId?: number | null;
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
  onToggleVerseNumbers,
  books = [],
  selectedBookId,
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
  const [copied, setCopied] = useState(false);

  const totalChapters = getChaptersForBookId(selectedBookId);

  const handleCopyChapter = () => {
    if (verses.length === 0) return;
    const header = `${selectedBookName || 'Pasaje'} ${selectedChapter || ''} (${
      activeTranslationName || 'Biblia'
    })\n\n`;
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
    onSelectBook?.(bookId);
    onSelectChapter(chapter);
  };

  const normalizedBooks: Book[] = (books as any[]).map((b) => ({
    id: b.id,
    name: b.name,
    abbreviation: b.abbreviation,
    testament: b.testament === 'NT' ? 'NT' : 'OT',
  }));

  return (
    <div className="border border-accents-2 rounded-xl bg-background p-2 sm:p-2.5 shadow-xs relative z-30">
      {/* Fila Principal de Control Integrado */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 relative z-40">
        {/* Izquierda: Pasaje (Libro + Capítulo) y Versión Bíblica */}
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <UnifiedPassagePicker
            books={normalizedBooks}
            selectedBookId={selectedBookId || null}
            selectedChapter={selectedChapter}
            onSelectPassage={handlePassageSelect}
            onPrevChapter={onPrevChapter}
            onNextChapter={() => onNextChapter?.(totalChapters)}
            size="sm"
          />

          {onSelectTranslation && (
            <TranslationSelector
              selectedTranslationId={selectedTranslationId ?? null}
              onSelectTranslation={onSelectTranslation}
            />
          )}
        </div>

        {/* Controles de Formato y Tipografía a la Derecha */}
        <div className="flex items-center gap-1.5 flex-wrap justify-between sm:justify-end">
          {/* Modos de lectura */}
          <div className="flex items-center bg-accents-1 p-0.5 rounded-lg border border-accents-2">
            <button
              type="button"
              onClick={() => onLayoutModeChange('continuous')}
              className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                readerSettings.layoutMode === 'continuous'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Lectura en Párrafo Continuo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h12" />
              </svg>
              <span className="hidden sm:inline">Párrafo</span>
            </button>

            <button
              type="button"
              onClick={() => onLayoutModeChange('verse-by-verse')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                readerSettings.layoutMode === 'verse-by-verse'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Lectura Versículo a Versículo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden md:inline">Versículo</span>
            </button>
          </div>

          {/* Familia Tipográfica */}
          <div className="flex items-center bg-accents-1 p-0.5 rounded-lg border border-accents-2">
            <button
              type="button"
              onClick={() => onFontFamilyChange('serif')}
              className={`px-2 py-1 text-xs font-serif rounded-md transition-all cursor-pointer ${
                readerSettings.fontFamily === 'serif'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Tipografía Serif"
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => onFontFamilyChange('sans')}
              className={`px-2 py-1 text-xs font-sans rounded-md transition-all cursor-pointer ${
                readerSettings.fontFamily === 'sans'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Tipografía Sans"
            >
              Sans
            </button>
          </div>

          {/* Tamaño de Fuente */}
          <div className="flex items-center bg-accents-1 p-0.5 rounded-lg border border-accents-2">
            {fontSizes.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => onFontSizeChange(f.value)}
                className={`px-1.5 py-1 text-xs rounded-md transition-all cursor-pointer ${
                  readerSettings.fontSize === f.value
                    ? 'bg-background text-foreground shadow-xs font-bold'
                    : 'text-accents-5 hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Toggle Números de Versículo */}
          <button
            type="button"
            onClick={onToggleVerseNumbers}
            className={`px-2 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
              readerSettings.showVerseNumbers
                ? 'bg-foreground text-background border-foreground font-semibold'
                : 'bg-transparent text-accents-5 border-accents-2 hover:border-accents-4'
            }`}
            title="Mostrar/Ocultar Números de Versículo"
          >
            123
          </button>

          {/* Copiar Capítulo */}
          {verses.length > 0 && (
            <button
              type="button"
              onClick={handleCopyChapter}
              className="px-2 py-1 text-xs font-medium rounded-lg border border-accents-2 bg-background hover:border-foreground text-accents-6 hover:text-foreground transition-all flex items-center gap-1 cursor-pointer"
              title="Copiar texto del capítulo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
