'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BookMarked,
  Check,
  ChevronRight,
  Sparkles,
  Library,
  Layers,
  Tag,
  Search,
} from 'lucide-react';
import { useDictionaries } from '../context/DictionariesContext';
import { useKartexPassageSafe } from '../../../entities/passage';
import { StudySidePanel } from '../../../shared/ui';

export const DictionariesSidebar: React.FC = () => {
  const {
    dictionaries,
    selectedDictionaryId,
    setSelectedDictionaryId,
    entries,
    selectedEntryId,
    setSelectedEntryId,
    selectedLetter,
  } = useDictionaries();

  const passageContext = useKartexPassageSafe();
  const tStudio = useTranslations('Studio');
  const tDict = useTranslations('Dictionaries');

  const [activeTab, setActiveTab] = useState<'dictionaries' | 'terms'>('dictionaries');
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  return (
    <StudySidePanel
      side="left"
      title={tStudio('toggleDictionariesSidebar') || tDict('sidebarTitle')}
      icon={<BookMarked className="w-4 h-4 text-amber-500" />}
      storageKey="kartex_dictionaries_sidebar_w"
      defaultWidth={320}
      collapseTitle={tStudio('closeSidebar') || tDict('closeSidebar')}
    >
      {/* Barra de Sub-Pestañas: Obras y Términos */}
      <StudySidePanel.Toolbar>
        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('dictionaries')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
              activeTab === 'dictionaries'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>{tDict('tabDictionaries')} ({dictionaries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>{tDict('tabTerms')} ({entries.length})</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll Independiente */}
      <StudySidePanel.Body className="p-3 space-y-2">
        {activeTab === 'dictionaries' && (
          <div className="space-y-2">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {tDict('filterByDictionary')}
              </span>
            </div>

            {/* Opción Todos los Diccionarios */}
            <button
              type="button"
              onClick={() => {
                setSelectedDictionaryId('all');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  handleClose();
                }
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                selectedDictionaryId === 'all'
                  ? 'border-amber-500/80 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold block">
                  {tDict('allDictionaries')}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                  {tDict('allWorksComparison')}
                </span>
              </div>
              {selectedDictionaryId === 'all' && (
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
            </button>

            {/* Listado de Obras */}
            {dictionaries.map((dict) => {
              const isSelected = selectedDictionaryId === dict.id;
              return (
                <button
                  key={dict.id}
                  type="button"
                  onClick={() => {
                    setSelectedDictionaryId(dict.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      handleClose();
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 group ${
                    isSelected
                      ? 'border-amber-500/80 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold shadow-xs'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-semibold block truncate">
                      {dict.title}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
                      {dict.author} ({dict.year})
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block line-clamp-1">
                      {dict.theologicalFocus}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-2">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {selectedLetter === 'all' ? tDict('allLetters') : tDict('letterBadge', { letter: selectedLetter })} ({entries.length})
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <BookMarked className="w-6 h-6 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500">
                  {tDict('noTermsInLetter')}
                </p>
              </div>
            ) : (
              entries.map((entry) => {
                const isSelected = selectedEntryId === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        handleClose();
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                          [{entry.letter}]
                        </span>
                        <span className="text-xs font-semibold truncate">
                          {entry.term}
                        </span>
                      </div>
                      {entry.etymology && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate font-mono">
                          {entry.etymology}
                        </span>
                      )}
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected
                          ? 'text-amber-500'
                          : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>
        )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
