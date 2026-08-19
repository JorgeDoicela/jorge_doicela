'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Book } from '../../hooks/useBooks';
import {
  CANONICAL_CATEGORIES,
  getChaptersForBookId,
} from '../../data/canonicCategories';

interface UnifiedPassagePickerProps {
  books: Book[];
  selectedBookId: number | null;
  selectedChapter: number | null;
  onSelectPassage: (bookId: number, chapter: number) => void;
  onPrevChapter?: () => void;
  onNextChapter?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

type TestamentTab = 'ALL' | 'OT' | 'NT';

export const UnifiedPassagePicker: React.FC<UnifiedPassagePickerProps> = ({
  books,
  selectedBookId,
  selectedChapter,
  onSelectPassage,
  onPrevChapter,
  onNextChapter,
  className = '',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TestamentTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForChapters, setSelectedBookForChapters] = useState<Book | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) || books[0],
    [books, selectedBookId],
  );

  const totalChapters = useMemo(
    () => getChaptersForBookId(selectedBookForChapters?.id || currentBook?.id),
    [selectedBookForChapters, currentBook],
  );

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedBookForChapters(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Enfocar input al abrir
  useEffect(() => {
    if (isOpen && !selectedBookForChapters) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, selectedBookForChapters]);

  // Filtro de libros y parseo inteligente de pasaje (ej. "Juan 3", "Sal 23")
  const parsedSearch = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    if (!raw) return { text: '', chapter: null as number | null };
    const match = raw.match(/^([a-záéíóúñ1-3\s]+?)\s*(\d+)?$/i);
    if (match) {
      const bookPart = match[1].trim();
      const chapterPart = match[2] ? parseInt(match[2], 10) : null;
      return { text: bookPart, chapter: chapterPart };
    }
    return { text: raw, chapter: null };
  }, [searchQuery]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'OT' && b.testament === 'OT') ||
        (activeTab === 'NT' && b.testament === 'NT');

      if (!parsedSearch.text) return matchesTab;

      const matchesText =
        b.name.toLowerCase().includes(parsedSearch.text) ||
        b.abbreviation.toLowerCase().includes(parsedSearch.text);

      return matchesTab && matchesText;
    });
  }, [books, activeTab, parsedSearch.text]);

  const handleBookClick = (book: Book) => {
    if (parsedSearch.chapter) {
      const maxCh = getChaptersForBookId(book.id);
      const safeCh = Math.min(Math.max(1, parsedSearch.chapter), maxCh);
      onSelectPassage(book.id, safeCh);
      setIsOpen(false);
      setSearchQuery('');
      setSelectedBookForChapters(null);
    } else {
      setSelectedBookForChapters(book);
    }
  };

  const handleChapterClick = (ch: number) => {
    if (!selectedBookForChapters && !currentBook) return;
    const targetBookId = selectedBookForChapters?.id || currentBook.id;
    onSelectPassage(targetBookId, ch);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedBookForChapters(null);
  };

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredBooks.length > 0) {
      handleBookClick(filteredBooks[0]);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedBookForChapters(null);
    }
  };

  return (
    <div className={`relative inline-flex items-center gap-1 ${className}`} ref={containerRef}>
      {/* Botón de capítulo anterior si está disponible */}
      {onPrevChapter && (
        <button
          type="button"
          onClick={onPrevChapter}
          disabled={selectedChapter !== null && selectedChapter <= 1}
          className={`h-8 w-8 rounded-lg border border-accents-2 bg-background flex items-center justify-center transition-all cursor-pointer ${
            selectedChapter !== null && selectedChapter <= 1
              ? 'opacity-30 cursor-not-allowed text-accents-4'
              : 'hover:border-foreground text-accents-6 hover:text-foreground shadow-xs'
          }`}
          title="Capítulo Anterior (←)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Botón Principal Selector de Pasaje */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSelectedBookForChapters(null);
        }}
        className={`px-3 h-8 rounded-lg border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
          isOpen
            ? 'border-foreground bg-accents-1 text-foreground ring-2 ring-foreground/10'
            : 'border-accents-2 bg-background hover:border-foreground text-foreground'
        } ${size === 'sm' ? 'text-xs' : 'text-xs sm:text-sm font-semibold'}`}
      >
        <svg className="w-3.5 h-3.5 text-accents-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>

        <span className="font-bold tracking-tight">
          {currentBook ? `${currentBook.name} ${selectedChapter || 1}` : 'Seleccionar Pasaje'}
        </span>

        <svg
          className={`w-3 h-3 text-accents-4 transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Botón de capítulo siguiente si está disponible */}
      {onNextChapter && (
        <button
          type="button"
          onClick={onNextChapter}
          disabled={selectedChapter !== null && selectedChapter >= totalChapters}
          className={`h-8 w-8 rounded-lg border border-accents-2 bg-background flex items-center justify-center transition-all cursor-pointer ${
            selectedChapter !== null && selectedChapter >= totalChapters
              ? 'opacity-30 cursor-not-allowed text-accents-4'
              : 'hover:border-foreground text-accents-6 hover:text-foreground shadow-xs'
          }`}
          title="Capítulo Siguiente (→)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Modal Desplegable / Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-96 p-3 rounded-2xl border border-accents-2 bg-background/95 backdrop-blur-md shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-100">
          {/* Vista 1: Selector de Libros */}
          {!selectedBookForChapters ? (
            <>
              {/* Buscador Rápido */}
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar libro o pasaje (ej. Juan 3, Sal 23)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDownSearch}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-accents-2 bg-accents-1 text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all"
                />
                <svg
                  className="w-3.5 h-3.5 text-accents-4 absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Tabs Canónicos */}
              <div className="flex gap-1 bg-accents-1 p-0.5 rounded-xl border border-accents-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('ALL')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    activeTab === 'ALL'
                      ? 'bg-background text-foreground font-bold shadow-xs'
                      : 'text-accents-5 hover:text-foreground'
                  }`}
                >
                  Todos (66)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('OT')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    activeTab === 'OT'
                      ? 'bg-background text-foreground font-bold shadow-xs'
                      : 'text-accents-5 hover:text-foreground'
                  }`}
                >
                  Antiguo (39)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('NT')}
                  className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    activeTab === 'NT'
                      ? 'bg-background text-foreground font-bold shadow-xs'
                      : 'text-accents-5 hover:text-foreground'
                  }`}
                >
                  Nuevo (27)
                </button>
              </div>

              {/* Lista de libros estructurada */}
              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {searchQuery.trim() !== '' ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredBooks.length === 0 ? (
                      <div className="col-span-2 text-center py-6 text-xs text-accents-4">
                        No se encontraron libros para &quot;{searchQuery}&quot;
                      </div>
                    ) : (
                      filteredBooks.map((book) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => handleBookClick(book)}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer border ${
                            currentBook?.id === book.id
                              ? 'bg-foreground text-background font-bold border-foreground shadow-xs'
                              : 'border-transparent bg-accents-1/40 hover:bg-accents-1 hover:border-accents-2 text-foreground'
                          }`}
                        >
                          <span className="truncate">{book.name}</span>
                          <span className="text-[10px] font-mono opacity-60 ml-1 shrink-0">
                            {book.abbreviation}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  CANONICAL_CATEGORIES.filter((cat) => {
                    if (activeTab === 'OT') return cat.testament === 'OT';
                    if (activeTab === 'NT') return cat.testament === 'NT';
                    return true;
                  }).map((cat) => {
                    const catBooks = books.filter((b) => cat.bookIds.includes(b.id));
                    if (catBooks.length === 0) return null;
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="text-[10px] font-bold tracking-wider uppercase text-accents-4 px-1">
                          {cat.name}
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {catBooks.map((book) => (
                            <button
                              key={book.id}
                              type="button"
                              onClick={() => handleBookClick(book)}
                              className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer border ${
                                currentBook?.id === book.id
                                  ? 'bg-foreground text-background font-bold border-foreground shadow-xs'
                                  : 'border-transparent hover:bg-accents-1 hover:border-accents-2 text-foreground'
                              }`}
                            >
                              <span className="truncate">{book.name}</span>
                              <span className="text-[10px] font-mono opacity-60 ml-1 shrink-0">
                                {book.abbreviation}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* Vista 2: Selector de Capítulos */
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-accents-2 pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookForChapters(null)}
                  className="px-2 py-1 text-xs text-accents-5 hover:text-foreground flex items-center gap-1 rounded-md hover:bg-accents-1 transition-all cursor-pointer font-medium"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Libros</span>
                </button>

                <div className="text-xs font-bold text-foreground">
                  {selectedBookForChapters.name}
                </div>

                <span className="text-[10px] font-mono text-accents-4">
                  {totalChapters} Caps.
                </span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-72 overflow-y-auto pr-1">
                {Array.from({ length: totalChapters }).map((_, i) => {
                  const ch = i + 1;
                  const isCurrent =
                    currentBook?.id === selectedBookForChapters.id && selectedChapter === ch;
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleChapterClick(ch)}
                      className={`h-8 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center cursor-pointer border ${
                        isCurrent
                          ? 'bg-foreground text-background font-bold border-foreground shadow-xs'
                          : 'border-accents-2 bg-background hover:bg-accents-1 hover:border-foreground text-foreground'
                      }`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
