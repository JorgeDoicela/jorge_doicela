'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  Search,
} from 'lucide-react';
import { useCommentaries } from '../context/CommentariesContext';
import { CommentaryCard } from './CommentaryCard';
import { useKartexPassageSafe } from '../../../entities/passage';

export const CommentariesDashboard: React.FC = () => {
  const tStudio = useTranslations('Studio');
  const tComm = useTranslations('Commentaries');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();

  const {
    authors,
    selectedEntryId,
    setSelectedEntryId,
    searchQuery,
    setSearchQuery,
    entries,
    isLoading,
  } = useCommentaries();

  const currentBook = passageContext?.selectedBook;
  const currentChapter = passageContext?.selectedChapter;

  return (
    <div className="w-full space-y-6">
      {/* Banner Superior Exegético */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#121214]/80 p-6 sm:p-8 backdrop-blur-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block">
              {tComm('title')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
              {currentBook?.name || tComm('selectedPassageFallback')} {currentChapter ? `· ${tComm('chapterPrefix')} ${currentChapter}` : ''}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {tComm('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Buscador en tiempo real */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tComm('searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>
        </div>
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
                bookName={currentBook?.name}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

