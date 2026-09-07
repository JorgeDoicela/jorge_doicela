'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { useBiblePassageSafe } from '../context/BiblePassageContext';
import { getChaptersForBookId } from '../features/books/data/canonicCategories';
import { Book } from '../features/books';

export interface BibleNavigationSidebarProps {
  books?: Book[];
  selectedBookId?: number | null;
  selectedChapter?: number | null;
  isOpen?: boolean;
  onClose?: () => void;
  onSelectPassage?: (bookId: number, chapter: number) => void;
  className?: string;
}

type TestamentTab = 'ALL' | 'OT' | 'NT';

export const BibleNavigationSidebar: React.FC<BibleNavigationSidebarProps> = ({
  books: propBooks,
  selectedBookId: propSelectedBookId,
  selectedChapter: propSelectedChapter,
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSelectPassage: propOnSelectPassage,
  className = '',
}) => {
  const tStudio = useTranslations('Studio');
  const tBooks = useTranslations('Books');
  const passageContext = useBiblePassageSafe();

  // Soporte Dual: Props explícitas con fallback transparente a BiblePassageContext
  const books = propBooks ?? passageContext?.books ?? [];
  const selectedBookId = propSelectedBookId !== undefined ? propSelectedBookId : (passageContext?.selectedBookId ?? 1);
  const selectedChapter = propSelectedChapter !== undefined ? propSelectedChapter : (passageContext?.selectedChapter ?? 1);
  const isOpen = propIsOpen !== undefined ? propIsOpen : (passageContext?.isLeftSidebarOpen ?? false);
  const handleClose = propOnClose ?? passageContext?.toggleLeftSidebar ?? (() => {});

  const handleSelectPassage = (bookId: number, chapter: number) => {
    if (propOnSelectPassage) {
      propOnSelectPassage(bookId, chapter);
    } else if (passageContext) {
      passageContext.setPassage(bookId, chapter);
    }
    // En pantallas táctiles móviles (< 1024px), cerrar el sidebar para mostrar el texto
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      handleClose();
    }
  };

  const [activeTab, setActiveTab] = useState<TestamentTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBookId, setExpandedBookId] = useState<number | null>(selectedBookId || 1);

  // Obtener nombre localizado de libro
  const getBookTitle = (b: Book): string => {
    try {
      const trans = tBooks(b.abbreviation as any);
      return trans || b.name;
    } catch {
      return b.name;
    }
  };

  // Filtrado de libros por tab y texto de búsqueda
  const filteredBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return books.filter((b) => {
      const matchTab =
        activeTab === 'ALL' ||
        (activeTab === 'OT' && b.testament === 'OT') ||
        (activeTab === 'NT' && b.testament === 'NT');

      if (!q) return matchTab;

      const localized = getBookTitle(b).toLowerCase();
      const original = b.name.toLowerCase();
      const abbr = b.abbreviation.toLowerCase();

      return matchTab && (localized.includes(q) || original.includes(q) || abbr.includes(q));
    });
  }, [books, activeTab, searchQuery, tBooks]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop en Móviles / Tablets (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />
      <aside
        id="bible-navigation-sidebar"
        aria-label={tStudio('toggleSidebar')}
        className={`fixed inset-y-0 left-0 z-50 h-screen lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 w-72 sm:w-80 flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md flex flex-col transition-all duration-200 shadow-xl lg:shadow-none overflow-hidden print:hidden ${className}`}
      >
        {/* Cabecera del Panel (visible solo en móvil como Drawer modal) */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              {tStudio('toggleSidebar')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            title={tStudio('collapseSidebar')}
            aria-label={tStudio('collapseSidebar')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Testamentos Geist Segmented Control */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-3 p-1 bg-zinc-100/90 dark:bg-zinc-800/80 rounded-xl gap-1">
            {(['ALL', 'OT', 'NT'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {tab === 'ALL' && tStudio('allBooks')}
                {tab === 'OT' && 'AT (39)'}
                {tab === 'NT' && 'NT (27)'}
              </button>
            ))}
          </div>
        </div>

        {/* Buscador Rápido de Libros */}
        <div className="px-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tStudio('searchBook')}
              className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 rounded-xl pl-8.5 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Libros con Scroll Independiente */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredBooks.map((book) => {
            const isExpanded = expandedBookId === book.id;
            const isSelected = selectedBookId === book.id;
            const localizedName = getBookTitle(book);
            const totalChapters = getChaptersForBookId(book.id);

            return (
              <div key={book.id} className="rounded-xl overflow-hidden transition-colors">
                {/* Fila del Libro */}
                <button
                  type="button"
                  onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 w-6 text-left">
                      {book.abbreviation}
                    </span>
                    <span className="truncate font-medium">{localizedName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {totalChapters}c
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Acordeón de Capítulos en Cuadrícula Ergonómica DIITRA Style */}
                {isExpanded && (
                  <div className="p-3 bg-zinc-50/80 dark:bg-zinc-800/30 border-y border-zinc-100 dark:border-zinc-800/60 my-1 rounded-xl">
                    <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chap) => {
                        const isCurrentChapter = isSelected && selectedChapter === chap;
                        return (
                          <button
                            key={chap}
                            type="button"
                            onClick={() => handleSelectPassage(book.id, chap)}
                            className={`w-8 h-8 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center cursor-pointer ${
                              isCurrentChapter
                                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs font-bold'
                                : 'border border-zinc-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {chap}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

