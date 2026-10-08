'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { useKartexPassageSafe } from '../../../entities/passage';
import { Book } from '../../../entities/books';
import { getChaptersForBookId } from '../../../shared/data/canonData';
import { StudySidePanel } from '../../../shared/ui';

export interface CommentariesPassageNavigatorProps {
  onChapterSelect?: (bookId: number, chapter: number) => void;
  className?: string;
}

type TestamentTab = 'ALL' | 'OT' | 'NT';

export const CommentariesPassageNavigator: React.FC<CommentariesPassageNavigatorProps> = ({
  onChapterSelect,
  className = '',
}) => {
  const tStudio = useTranslations('Studio');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();

  const books = passageContext?.books ?? [];
  const selectedBookId = passageContext?.selectedBookId ?? 1;
  const selectedChapter = passageContext?.selectedChapter ?? 1;

  const [activeTab, setActiveTab] = useState<TestamentTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBookId, setExpandedBookId] = useState<number | null>(selectedBookId || 1);

  // Sincronizar libro expandido cuando cambia el libro seleccionado en el contexto
  useEffect(() => {
    if (selectedBookId) {
      setExpandedBookId(selectedBookId);
    }
  }, [selectedBookId]);

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

  const handleSelectChapter = (bookId: number, chapter: number) => {
    if (passageContext) {
      passageContext.setPassage(bookId, chapter);
    }
    onChapterSelect?.(bookId, chapter);
  };

  return (
    <>
      {/* Barra de Herramientas Superior Anclada: Filtro de Testamentos y Buscador */}
      <StudySidePanel.Toolbar className="p-3 space-y-3">
        {/* Selector de Testamentos Geist Plano (Vercel Style) */}
        <div className="grid grid-cols-3 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
          {(['ALL', 'OT', 'NT'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 text-xs font-medium transition-colors cursor-pointer text-center truncate px-1 ${
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

        {/* Buscador Rápido de Libros */}
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
      </StudySidePanel.Toolbar>

      {/* Catálogo Canónico con Scroll Independiente y Acordeón */}
      <StudySidePanel.Body className={`p-2 space-y-0.5 ${className}`}>
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
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 w-6 text-left shrink-0">
                    {book.abbreviation}
                  </span>
                  <span className="truncate font-medium">{localizedName}</span>
                </div>
                <div className="flex items-center shrink-0 ml-1">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </div>
              </button>

              {/* Acordeón de Capítulos en Cuadrícula Ergonómica (Estilo Lector Estándar) */}
              {isExpanded && (
                <div className="p-3 bg-zinc-50/80 dark:bg-black border-y border-zinc-100 dark:border-zinc-800/80 my-1 rounded-xl">
                  <div className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chap) => {
                      const isCurrentChapter = isSelected && selectedChapter === chap;
                      return (
                        <button
                          key={chap}
                          type="button"
                          onClick={() => handleSelectChapter(book.id, chap)}
                          className={`h-8 rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center cursor-pointer ${
                            isCurrentChapter
                              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                              : 'border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-[#0a0a0a] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900'
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
      </StudySidePanel.Body>
    </>
  );
};
