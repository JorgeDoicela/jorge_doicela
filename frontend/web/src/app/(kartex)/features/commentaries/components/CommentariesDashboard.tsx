'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  Search,
  X,
} from 'lucide-react';
import { useCommentaries } from '../context/CommentariesContext';
import { CommentaryCard } from './CommentaryCard';
import { useKartexPassageSafe } from '../../../entities/passage';

export const CommentariesDashboard: React.FC = () => {
  const tComm = useTranslations('Commentaries');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();

  const {
    authors,
    selectedEntryId,
    setSelectedEntryId,
    searchQuery,
    setSearchQuery,
    searchScope,
    setSearchScope,
    entries,
    isLoading,
  } = useCommentaries();

  const currentBook = passageContext?.selectedBook;
  const currentChapter = passageContext?.selectedChapter;

  const localizedBookName = currentBook
    ? tBooks.has(currentBook.abbreviation as any)
      ? tBooks(currentBook.abbreviation as any)
      : currentBook.name
    : tComm('selectedPassageFallback');

  const hasSearchQuery = searchQuery.trim().length > 0;

  const handleSelectAndScrollEntry = (entryId: string) => {
    setSelectedEntryId(entryId);
    if (typeof document !== 'undefined') {
      const el = document.getElementById(`commentary-entry-${entryId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner Superior Exegético */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#121214]/80 p-6 sm:p-8 backdrop-blur-sm shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block">
              {tComm('title')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
              {localizedBookName} {currentChapter ? `· ${tComm('chapterPrefix')} ${currentChapter}` : ''}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {tComm('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Selector de Alcance de Búsqueda (Capítulo actual vs Toda la Biblia) */}
            <div className="inline-flex rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setSearchScope('chapter')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  searchScope === 'chapter'
                    ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {tComm('scopeChapter')}
              </button>
              <button
                type="button"
                onClick={() => setSearchScope('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  searchScope === 'all'
                    ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {tComm('scopeAllBible')}
              </button>
            </div>

            {/* Buscador FTS5 en tiempo real */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tComm('searchPlaceholder')}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
              {hasSearchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Barra Rápida de Secciones del Capítulo (Navegación por Bloques de Versículos) */}
        {!isLoading && !hasSearchQuery && entries.length > 1 && (
          <div className="pt-3 border-t border-zinc-200/70 dark:border-zinc-800/70 flex items-center gap-1.5 overflow-x-auto pb-1 kartex-scrollbar-slim">
            {entries.map((entry) => {
              const isSelected = selectedEntryId === entry.id;
              const isIntro = entry.entryType === 'chapter_intro' || entry.verseStart === 0;
              const label = isIntro
                ? tComm('chapterOverview')
                : entry.verseEnd && entry.verseEnd !== entry.verseStart
                  ? `v.${entry.verseStart}-${entry.verseEnd}`
                  : `v.${entry.verseStart}`;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleSelectAndScrollEntry(entry.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold'
                      : 'bg-zinc-50 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Listado de Notas Exegéticas */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/40 animate-pulse space-y-3"
            >
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800/60 rounded w-1/4" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800/40 rounded w-1/2" />
              <div className="h-16 bg-zinc-100 dark:bg-zinc-900/40 rounded w-full" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/40 space-y-3">
          <BookOpen className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-300">
            {tComm('noEntries')}
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            {tComm('noEntriesDesc')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const author = authors.find((a) => a.id === entry.authorId);
            return (
              <CommentaryCard
                key={entry.id}
                entry={entry}
                author={author}
                isSelected={selectedEntryId === entry.id}
                onSelect={() => setSelectedEntryId(entry.id)}
                bookName={localizedBookName}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
