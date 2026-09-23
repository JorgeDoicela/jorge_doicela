'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  X,
  ArrowRight,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../shared/context';
import { Book, getBookHistoricalInfo } from '../../../entities/books';
import { getChaptersForBookId } from '../../../shared/data/canonData';
import { StudySidePanel } from '../../../shared/ui';

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
  const pathname = usePathname() || '';
  const isHistoricalContext =
    pathname.includes('/atlas') ||
    pathname.includes('/timeline') ||
    pathname.includes('/archaeology');
  const isEvangelism = pathname.includes('/evangelism');

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

  const leftSidebarWidth = passageContext?.leftSidebarWidth ?? 280;
  const setLeftSidebarWidth = passageContext?.setLeftSidebarWidth ?? (() => {});
  const resetLeftSidebarWidth = passageContext?.resetLeftSidebarWidth ?? (() => {});

  return (
    <StudySidePanel
      side="left"
      title={tStudio('toggleSidebar')}
      icon={<BookOpen className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
      ariaLabel={tStudio('toggleSidebar')}
      isOpen={isOpen}
      onClose={handleClose}
      width={leftSidebarWidth}
      onResize={setLeftSidebarWidth}
      onReset={resetLeftSidebarWidth}
      collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
      className={className}
    >
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

      <StudySidePanel.Body className="p-2 space-y-0.5">
          {filteredBooks.map((book) => {
            const isExpanded = expandedBookId === book.id;
            const isSelected = selectedBookId === book.id;
            const localizedName = getBookTitle(book);
            const totalChapters = getChaptersForBookId(book.id);
            const histInfo = getBookHistoricalInfo(book.id);

            // Identificar libros clave doctrinales y evangelísticos
            const isKeyDoctrineBook = [1, 40, 42, 43, 44, 45, 48, 49, 58].includes(book.id);

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

                    {/* Insignia Contextual de Época en Historia */}
                    {isHistoricalContext && histInfo && (
                      <span className="hidden sm:inline text-[9px] font-mono font-semibold text-amber-600 dark:text-amber-400 truncate max-w-[90px]">
                        {histInfo.era.split(' ')[0]}
                      </span>
                    )}

                    {/* Insignia Contextual Doctrinal en Evangelismo */}
                    {isEvangelism && isKeyDoctrineBook && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Libro fundamental de doctrina y evangelismo" />
                    )}
                  </div>
                  <div className="flex items-center shrink-0 ml-1">
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
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chap) => {
                        const isCurrentChapter = isSelected && selectedChapter === chap;
                        return (
                          <button
                            key={chap}
                            type="button"
                            onClick={() => handleSelectPassage(book.id, chap)}
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

                    {/* Enlace Cruzado al Lector cuando se está en Historia o Evangelismo */}
                    {(isHistoricalContext || isEvangelism) && (
                      <div className="mt-2.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between">
                        <Link
                          href={`/study/standard?book=${book.abbreviation}&chapter=${selectedChapter || 1}`}
                          className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors font-medium group"
                        >
                          <BookOpen className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                          <span>Leer en Lector</span>
                          <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {totalChapters} caps
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </StudySidePanel.Body>
    </StudySidePanel>
  );
};
