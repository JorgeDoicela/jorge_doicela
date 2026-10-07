'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Library,
  BookOpen,
  User,
  Check,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCommentaries } from '../context/CommentariesContext';
import { useKartexPassageSafe } from '../../../entities/passage';
import { StudySidePanel } from '../../../shared/ui';

export const CommentariesSidebar: React.FC = () => {
  const {
    authors,
    selectedAuthorId,
    setSelectedAuthorId,
    entries,
    selectedEntryId,
    setSelectedEntryId,
  } = useCommentaries();

  const passageContext = useKartexPassageSafe();
  const tStudio = useTranslations('Studio');
  const tComm = useTranslations('Commentaries');

  const [activeTab, setActiveTab] = useState<'authors' | 'pericopes'>('authors');
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  const currentBook = passageContext?.selectedBook;
  const currentChapter = passageContext?.selectedChapter;

  return (
    <StudySidePanel
      side="left"
      title={tStudio('toggleCommentariesSidebar') || 'Obras & Comentaristas'}
      icon={<Library className="w-4 h-4 text-amber-500" />}
      storageKey="kartex_commentaries_sidebar_w"
      defaultWidth={320}
      collapseTitle={tStudio('closeSidebar') || 'Ocultar panel'}
    >
      {/* Barra de Sub-Pestañas: Comentaristas y Perícopas */}
      <StudySidePanel.Toolbar>
        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('authors')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
              activeTab === 'authors'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>{tComm('tabAuthors')} ({authors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pericopes')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
              activeTab === 'pericopes'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{tComm('tabPericopes')} ({entries.length})</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll Independiente */}
      <StudySidePanel.Body className="p-3 space-y-2">
        {activeTab === 'authors' && (
          <div className="space-y-2">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {tComm('filterBySource')}
              </span>
            </div>

            {/* Opción Todas las Fuentes */}
            <button
              type="button"
              onClick={() => {
                setSelectedAuthorId('all');
                if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                  handleClose();
                }
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                selectedAuthorId === 'all'
                  ? 'border-amber-500/80 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold shadow-xs'
                  : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold block">
                  {tComm('allAuthors')}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                  {tComm('multiAuthorComparison')}
                </span>
              </div>
              {selectedAuthorId === 'all' && (
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
            </button>

            {/* Listado de Autores */}
            {authors.map((author) => {
              const isSelected = selectedAuthorId === author.id;
              return (
                <button
                  key={author.id}
                  type="button"
                  onClick={() => {
                    setSelectedAuthorId(author.id);
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
                      {author.author}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
                      {author.era}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block line-clamp-1">
                      {author.theologicalFocus}
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

        {activeTab === 'pericopes' && (
          <div className="space-y-2">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {currentBook?.name || tComm('selectedPassageFallback')} {currentChapter ? `· ${tComm('chapterPrefix')} ${currentChapter}` : ''}
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                <BookOpen className="w-6 h-6 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500">
                  {tComm('noPericopesInChapter')}
                </p>
              </div>
            ) : (
              entries.map((entry) => {
                const isEntrySelected = selectedEntryId === entry.id;
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
                      isEntrySelected
                        ? 'border-amber-500/80 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 block">
                        v.{entry.verseStart}
                        {entry.verseEnd && entry.verseEnd !== entry.verseStart ? `-${entry.verseEnd}` : ''}
                      </span>
                      <span className="text-xs font-medium block truncate">
                        {entry.title}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isEntrySelected ? 'text-amber-500' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'}`} />
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

