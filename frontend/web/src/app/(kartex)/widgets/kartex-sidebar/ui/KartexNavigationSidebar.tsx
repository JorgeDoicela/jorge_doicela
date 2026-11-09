'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  X,
  ArrowRight,
} from 'lucide-react';
import { useKartexPassageSafe } from '../../../entities/passage';
import { Book, getBookHistoricalInfo } from '../../../entities/books';
import { getChaptersForBookId, getVersesCountForChapter } from '../../../shared/data/canonData';
import { StudySidePanel } from '../../../shared/ui';

export interface KartexNavigationSidebarProps {
  books?: Book[];
  selectedBookId?: number | null;
  selectedChapter?: number | null;
  selectedVerse?: number | null;
  isOpen?: boolean;
  onClose?: () => void;
  onSelectPassage?: (bookId: number, chapter: number, verse?: number | null) => void;
  className?: string;
}

type TestamentTab = 'ALL' | 'OT' | 'NT';

export const KartexNavigationSidebar: React.FC<KartexNavigationSidebarProps> = ({
  books: propBooks,
  selectedBookId: propSelectedBookId,
  selectedChapter: propSelectedChapter,
  selectedVerse: propSelectedVerse,
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
  const tNav = useTranslations('Nav');
  const passageContext = useKartexPassageSafe();

  // Soporte Dual: Props explícitas con fallback transparente a KartexPassageContext
  const books = propBooks ?? passageContext?.books ?? [];
  const selectedBookId = propSelectedBookId !== undefined ? propSelectedBookId : (passageContext?.selectedBookId ?? 1);
  const selectedChapter = propSelectedChapter !== undefined ? propSelectedChapter : (passageContext?.selectedChapter ?? 1);
  const selectedVerse = propSelectedVerse !== undefined ? propSelectedVerse : (passageContext?.selectedVerse ?? null);
  const isOpen = propIsOpen !== undefined ? propIsOpen : (passageContext?.isLeftSidebarOpen ?? false);
  const handleClose = propOnClose ?? passageContext?.toggleLeftSidebar ?? (() => {});

  const [activeTab, setActiveTab] = useState<TestamentTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBookId, setExpandedBookId] = useState<number | null>(selectedBookId || 1);
  const [selectedChapterForVerses, setSelectedChapterForVerses] = useState<{ bookId: number; chapter: number } | null>(null);

  const onPanelClose = () => {
    setSearchQuery('');
    setSelectedChapterForVerses(null);
    handleClose();
  };

  const handleSelectPassage = (bookId: number, chapter: number, verse: number | null = null) => {
    setSearchQuery('');
    setSelectedChapterForVerses(null);
    if (propOnSelectPassage) {
      propOnSelectPassage(bookId, chapter, verse);
    } else if (passageContext) {
      passageContext.setPassage(bookId, chapter, verse);
    }
    // En pantallas táctiles móviles (< 1024px), cerrar el sidebar para mostrar el texto
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      handleClose();
    }
  };

  // Limpiar texto de búsqueda automáticamente cada vez que el sidebar se cierra o se sale de él
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedChapterForVerses(null);
    }
  }, [isOpen]);

  // Sincronizar libro expandido cuando cambia selectedBookId
  useEffect(() => {
    if (selectedBookId) {
      setExpandedBookId(selectedBookId);
    }
  }, [selectedBookId]);

  // Al cambiar el libro expandido, reiniciar la vista de versículos para mostrar los capítulos del nuevo libro
  useEffect(() => {
    setSelectedChapterForVerses(null);
  }, [expandedBookId]);

  // Obtener nombre localizado de libro
  const getBookTitle = (b: Book): string => {
    if (b.abbreviation && tBooks.has(b.abbreviation as any)) {
      return tBooks(b.abbreviation as any);
    }
    return b.name;
  };

  // Parseo inteligente de búsqueda canónica (ej. "Juan 3:16", "Jn 3 16", "Sal 23", "Génesis 1:5")
  const parsedSearch = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase();
    if (!raw) return { text: '', chapter: null as number | null, verse: null as number | null };
    const match = raw.match(/^([a-záéíóúñ1-3\s]+?)\s*(\d+)?(?:[:,\s](\d+))?$/i);
    if (match) {
      const bookPart = match[1].trim();
      const chapterPart = match[2] ? parseInt(match[2], 10) : null;
      const versePart = match[3] ? parseInt(match[3], 10) : null;
      return { text: bookPart, chapter: chapterPart, verse: versePart };
    }
    return { text: raw, chapter: null, verse: null };
  }, [searchQuery]);

  // Filtrado de libros por tab y texto de búsqueda
  const filteredBooks = useMemo(() => {
    const q = parsedSearch.text;
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
  }, [books, activeTab, parsedSearch.text, tBooks]);

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredBooks.length > 0) {
      const targetBook = filteredBooks[0];
      const maxCh = getChaptersForBookId(targetBook.id);
      const safeCh = parsedSearch.chapter ? Math.min(Math.max(1, parsedSearch.chapter), maxCh) : 1;
      const maxVerses = getVersesCountForChapter(targetBook.id, safeCh);
      const safeVerse = parsedSearch.verse ? Math.min(Math.max(1, parsedSearch.verse), maxVerses) : null;
      handleSelectPassage(targetBook.id, safeCh, safeVerse);
    }
  };

  const leftSidebarWidth = passageContext?.leftSidebarWidth ?? 280;
  const setLeftSidebarWidth = passageContext?.setLeftSidebarWidth ?? (() => {});
  const resetLeftSidebarWidth = passageContext?.resetLeftSidebarWidth ?? (() => {});

  return (
    <StudySidePanel
      side="left"
      title={tStudio('toggleSidebar')}
      icon={<BookOpen className="w-4 h-4 text-foreground" />}
      ariaLabel={tStudio('toggleSidebar')}
      isOpen={isOpen}
      onClose={onPanelClose}
      width={leftSidebarWidth}
      onResize={setLeftSidebarWidth}
      onReset={resetLeftSidebarWidth}
      collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
      className={className}
    >
      <StudySidePanel.Toolbar className="p-3 space-y-3">
        {/* Selector de Testamentos Geist Plano (Vercel Style) */}
        <div className="grid grid-cols-3 rounded-lg border border-border divide-x divide-border overflow-hidden">
          {(['ALL', 'OT', 'NT'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 text-xs font-medium transition-colors cursor-pointer text-center truncate px-1 ${
                activeTab === tab
                  ? 'bg-accents-2 text-foreground font-semibold'
                  : 'bg-transparent text-accents-5 hover:text-foreground hover:bg-accents-1'
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
          <Search className="absolute left-3 w-3.5 h-3.5 text-accents-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDownSearch}
            placeholder={tStudio('searchBook')}
            className="w-full bg-inner-card border border-border rounded-xl pl-8.5 pr-8 py-2 text-xs text-foreground placeholder:text-accents-4 focus:outline-none focus:border-accents-5 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 text-accents-4 hover:text-foreground cursor-pointer"
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
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all cursor-pointer ${
                    isExpanded
                      ? 'bg-accents-2 text-foreground font-semibold rounded-t-xl'
                      : isSelected
                      ? 'bg-accents-2 text-foreground font-semibold rounded-xl'
                      : 'text-accents-6 hover:bg-accents-1 hover:text-foreground rounded-xl'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <span className="font-mono text-[11px] text-accents-4 w-6 text-left shrink-0">
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
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title={tNav('keyDoctrinalBook')} />
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

                {/* Acordeón de Capítulos / Versículos en Fusión Cromática Continua */}
                {isExpanded && (
                  <div className="p-2.5 bg-accents-2 rounded-b-xl">
                    {selectedChapterForVerses && selectedChapterForVerses.bookId === book.id ? (
                      /* Vista de Versículos */
                      (() => {
                        const viewingChapter = selectedChapterForVerses.chapter;
                        const totalVerses = getVersesCountForChapter(book.id, viewingChapter);
                        return (
                          <div className="space-y-2 animate-in fade-in duration-150">
                            {/* Barra de Retorno y Título del Capítulo con 'Leer completo' alineado a las columnas 3 a 5 */}
                            <div className="grid grid-cols-5 gap-1.5 items-center pb-1.5 border-b border-border/50">
                              <div className="col-span-2 flex items-center gap-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => setSelectedChapterForVerses(null)}
                                  className="p-1 -ml-0.5 rounded-md text-foreground hover:bg-accents-1 active:scale-90 transition-all cursor-pointer shrink-0"
                                  title="Volver a capítulos"
                                  aria-label="Volver a capítulos"
                                >
                                  <ChevronLeft className="w-4 h-4 stroke-[2.25] text-foreground" />
                                </button>
                                <span className="text-xs font-bold text-foreground truncate">
                                  {localizedName} {viewingChapter}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleSelectPassage(book.id, viewingChapter, null)}
                                className="col-span-3 h-7.5 px-2 rounded-lg text-xs font-medium bg-white dark:bg-card-bg text-foreground border border-white/60 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-accents-4 flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                                title={`Leer ${localizedName} ${viewingChapter} completo`}
                              >
                                <BookOpen className="w-3.5 h-3.5 text-accents-4 group-hover:text-foreground shrink-0" />
                                <span className="truncate">Leer completo</span>
                              </button>
                            </div>

                            {/* Cuadrícula de Versículos */}
                            <div className="grid grid-cols-5 gap-1.5 max-h-60 overflow-y-auto pr-0.5 pt-0.5">
                              {Array.from({ length: totalVerses }, (_, i) => i + 1).map((vNum) => {
                                const isCurrentVerse =
                                  isSelected &&
                                  selectedChapter === viewingChapter &&
                                  selectedVerse === vNum;
                                return (
                                  <button
                                    key={vNum}
                                    type="button"
                                    onClick={() => handleSelectPassage(book.id, viewingChapter, vNum)}
                                    className={`h-8 rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center cursor-pointer ${
                                      isCurrentVerse
                                        ? 'bg-foreground text-background font-bold shadow-xs'
                                        : 'bg-white dark:bg-card-bg text-foreground border border-white/60 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-accents-4'
                                    }`}
                                  >
                                    {vNum}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      /* Vista de Capítulos */
                      <div className="grid grid-cols-5 gap-1.5 animate-in fade-in duration-150">
                        {Array.from({ length: totalChapters }, (_, i) => i + 1).map((chap) => {
                          const isCurrentChapter = isSelected && selectedChapter === chap;
                          return (
                            <button
                              key={chap}
                              type="button"
                              onClick={() => setSelectedChapterForVerses({ bookId: book.id, chapter: chap })}
                              className={`h-8 rounded-lg text-xs font-mono font-medium transition-colors flex items-center justify-center cursor-pointer ${
                                isCurrentChapter
                                  ? 'bg-foreground text-background font-bold shadow-xs'
                                  : 'bg-white dark:bg-card-bg text-foreground border border-white/60 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-accents-4'
                              }`}
                            >
                              {chap}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Enlace Cruzado al Lector cuando se está en Historia o Evangelismo */}
                    {(isHistoricalContext || isEvangelism) && (
                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between">
                        <Link
                          href={`/study/standard?book=${book.id}&chapter=${selectedChapter || 1}`}
                          onClick={() => {
                            setSearchQuery('');
                            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                              handleClose();
                            }
                          }}
                          className="text-[11px] text-accents-5 hover:text-foreground flex items-center gap-1 transition-colors font-medium group"
                        >
                          <BookOpen className="w-3 h-3 text-accents-4 group-hover:text-foreground" />
                          <span>{tNav('readInReader')}</span>
                          <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <span className="text-[10px] font-mono text-accents-4">
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
