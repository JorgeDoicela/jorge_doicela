'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  BookMarked,
  Search,
  Filter,
  Sparkles,
  Layers,
  BookOpen,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useDictionaries } from '../context/DictionariesContext';
import { DictionaryCard } from './DictionaryCard';
import { DictionaryCategory } from '../types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const DictionariesDashboard: React.FC = () => {
  const tDict = useTranslations('Dictionaries');

  const {
    dictionaries,
    selectedDictionaryId,
    setSelectedDictionaryId,
    selectedLetter,
    setSelectedLetter,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    entries,
    selectedEntryId,
    setSelectedEntryId,
    availableLetters,
    isLoading,
    page,
    setPage,
    totalPages,
    totalEntries,
    activeDictionary,
  } = useDictionaries();

  const lettersWithCountMap = React.useMemo(() => {
    const map = new Map<string, number>();
    availableLetters.forEach((l) => map.set(l.letter.toUpperCase(), l.count));
    return map;
  }, [availableLetters]);

  const categories: { id: DictionaryCategory; label: string }[] = [
    { id: 'all', label: tDict('catAll') },
    { id: 'theology', label: tDict('catTheology') },
    { id: 'person', label: tDict('catPerson') },
    { id: 'place', label: tDict('catPlace') },
    { id: 'artifact', label: tDict('catArtifact') },
    { id: 'custom', label: tDict('catCustom') },
    { id: 'flora_fauna', label: tDict('catFloraFauna') },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Banner Superior Enciclopédico */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#121214]/80 p-6 sm:p-8 backdrop-blur-sm shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold block">
              {tDict('title')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
              {activeDictionary?.title || tDict('allDictionaries')}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {tDict('subtitle')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Buscador en tiempo real */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tDict('searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Selector Horizontal Alfabético A-Z */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setSelectedLetter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedLetter === 'all'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {tDict('allLetters')}
            </button>
            {ALPHABET.map((letter) => {
              const count = lettersWithCountMap.get(letter) || 0;
              const isSelected = selectedLetter === letter;
              const hasItems = count > 0;
              return (
                <button
                  key={letter}
                  type="button"
                  disabled={!hasItems}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold shrink-0 transition-all flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs scale-105'
                      : hasItems
                      ? 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                      : 'bg-zinc-50 dark:bg-zinc-950/50 text-zinc-300 dark:text-zinc-700 border border-transparent cursor-not-allowed opacity-40'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Filtros de Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              {tDict('filterByCategory')}
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-semibold shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listado de Entradas Enciclopédicas */}
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
          <BookMarked className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-300">
            {tDict('noEntries')}
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            {tDict('noEntriesDesc')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const dict = dictionaries.find((d) => d.id === entry.dictionaryId);
            return (
              <DictionaryCard
                key={entry.id}
                entry={entry}
                dictionary={dict}
                isSelected={selectedEntryId === entry.id}
                onSelect={() => setSelectedEntryId(entry.id)}
                onSelectRelatedTerm={(term) => setSearchQuery(term)}
              />
            );
          })}

          {/* Paginación si hay más de 1 página */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <span className="text-xs font-mono text-zinc-500">
                {tDict('pageOf', { page, total: totalPages })} ({totalEntries} {tDict('entriesCountSuffix')})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  aria-label={tDict('previousPage')}
                  title={tDict('previousPage')}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  aria-label={tDict('nextPage')}
                  title={tDict('nextPage')}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
