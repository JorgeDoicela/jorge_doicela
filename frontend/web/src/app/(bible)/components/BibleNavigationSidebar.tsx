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
    if (b.abbreviation && tBooks.has(b.abbreviation as any)) {
      return tBooks(b.abbreviation as any);
    }
    return b.name;
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
        className={`fixed inset-y-0 left-0 z-50 h-screen lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 w-72 sm:w-80 flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col transition-all duration-200 shadow-xl lg:shadow-none overflow-visible print:hidden ${className}`}
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio estilo DIITRA */}
        <div
          className="hidden lg:flex absolute top-0 -right-2.5 w-5 h-full cursor-pointer z-30 group/border items-start justify-center pt-3 select-none"
          onClick={handleClose}
          title={tStudio('collapseSidebar') || 'Ocultar panel'}
        >
          {/* Línea divisoria reactiva al hover */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover/border:bg-zinc-400 dark:group-hover/border:bg-zinc-500 transition-colors duration-150" />

          {/* Botón Flotante con Símbolo DIITRA (←|→) */}
          <div
            className="relative z-10 w-5 h-6 rounded bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800 shadow-xs opacity-0 group-hover/border:opacity-100 hover:scale-110 hover:border-zinc-900 dark:hover:border-zinc-600 transition-all duration-150 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <svg
              className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="2" x2="8" y2="14" />
              <polyline points="4 6 1 8 4 10" />
              <polyline points="12 6 15 8 12 10" />
            </svg>
          </div>
        </div>

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
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Testamentos Geist Plano (Vercel Style) */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-3 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
            {(['ALL', 'OT', 'NT'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 text-xs font-medium transition-colors cursor-pointer text-center ${
                  activeTab === tab
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                    : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
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
              className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800 rounded-xl pl-8.5 pr-8 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
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
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100'
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
                  <div className="p-3 bg-zinc-50/80 dark:bg-black border-y border-zinc-100 dark:border-zinc-800/80 my-1 rounded-xl">
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
                                : 'border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
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

