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
import { getChapterCountForBook } from '../../data/bookChapters';

interface ReaderToolbarProps {
  readerSettings: ReaderSettings;
  onLayoutModeChange: (mode: ReaderLayoutMode) => void;
  onFontSizeChange: (size: ReaderFontSize) => void;
  onFontFamilyChange: (family: ReaderFontFamily) => void;
  onToggleVerseNumbers: () => void;
  books?: (BookInfo | { id: number; name: string; abbreviation: string; testament: string })[];
  selectedBookId?: number | null;
  onSelectBook?: (id: number | null) => void;
  selectedBookAbbr?: string;
  selectedBookName?: string;
  selectedChapter: number | null;
  onSelectChapter: (chapter: number | null) => void;
  verses: Verse[];
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
  verses,
  activeTranslationName,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookPickerOpen, setBookPickerOpen] = useState(false);
  const [activeTestament, setActiveTestament] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totalChapters = getChapterCountForBook(selectedBookAbbr);

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

  const filteredBooks = books.filter((b) => {
    const matchesTestament =
      activeTestament === 'ALL' || b.testament === activeTestament;
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  return (
    <div className="border border-accents-2 rounded-xl bg-background p-2.5 sm:p-3 shadow-xs relative z-30">
      {/* Overlay transparente para cerrar el dropdown al hacer clic fuera */}
      {bookPickerOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setBookPickerOpen(false)}
        />
      )}

      {/* Fila Principal de Control Integrado */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 relative z-40">
        {/* Selector de Libro y Capítulos */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Botón selector de Libro */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setBookPickerOpen(!bookPickerOpen)}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border border-accents-2 bg-accents-1 hover:border-foreground text-foreground transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-accents-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-bold truncate max-w-[110px] sm:max-w-[160px]">{selectedBookName || 'Seleccionar Libro'}</span>
              <svg className={`w-3 h-3 text-accents-4 transition-transform duration-150 shrink-0 ${bookPickerOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown flotante con buscador y tabs limpios */}
            {bookPickerOpen && (
              <div className="absolute top-full left-0 mt-2 z-50 w-[calc(100vw-2.5rem)] max-w-xs sm:w-80 p-3 rounded-xl border border-accents-2 bg-background shadow-2xl space-y-2.5">
                {/* Input de búsqueda rápida */}
                <input
                  type="text"
                  placeholder="Buscar libro (ej. Génesis, Juan)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-accents-2 bg-accents-1 text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground"
                  autoFocus
                />

                {/* Tabs AT / NT */}
                <div className="flex gap-1 bg-accents-1 p-0.5 rounded-lg border border-accents-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTestament('ALL')}
                    className={`flex-1 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                      activeTestament === 'ALL' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-accents-5 hover:text-foreground'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTestament('OT')}
                    className={`flex-1 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                      activeTestament === 'OT' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-accents-5 hover:text-foreground'
                    }`}
                  >
                    Antiguo Test.
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTestament('NT')}
                    className={`flex-1 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                      activeTestament === 'NT' ? 'bg-background text-foreground font-bold shadow-xs' : 'text-accents-5 hover:text-foreground'
                    }`}
                  >
                    Nuevo Test.
                  </button>
                </div>

                {/* Lista de libros */}
                <div className="grid grid-cols-2 gap-1 max-h-56 overflow-y-auto pr-1">
                  {filteredBooks.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-xs text-accents-4">
                      No se encontraron libros
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => {
                          onSelectBook?.(book.id);
                          setBookPickerOpen(false);
                          setSearchQuery('');
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer truncate ${
                          selectedBookId === book.id
                            ? 'bg-foreground text-background font-bold'
                            : 'hover:bg-accents-1 text-accents-6 hover:text-foreground'
                        }`}
                      >
                        {book.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Chips de Capítulos Horizontales Compactos */}
          {selectedBookName && (
            <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 py-0.5 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {Array.from({ length: totalChapters }).map((_, i) => {
                const ch = i + 1;
                const isSelected = selectedChapter === ch;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => onSelectChapter(ch)}
                    className={`min-w-6 h-6 px-1.5 text-[11px] font-mono font-medium rounded-md border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-foreground text-background border-foreground font-bold shadow-xs'
                        : 'bg-background text-accents-5 border-accents-2 hover:border-accents-4 hover:text-foreground'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
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
