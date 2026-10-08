'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Library,
  BookOpen,
  Check,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  ScrollText,
  User,
} from 'lucide-react';
import { useCommentaries } from '../context/CommentariesContext';
import { useKartexPassageSafe } from '../../../entities/passage';
import { StudySidePanel } from '../../../shared/ui';

export const CommentariesInspector: React.FC = () => {
  const {
    authors,
    selectedAuthorId,
    setSelectedAuthorId,
    entries,
    selectedEntryId,
    setSelectedEntryId,
    activeAuthor,
    activeEntry,
  } = useCommentaries();

  const passageContext = useKartexPassageSafe();
  const tStudio = useTranslations('Studio');
  const tComm = useTranslations('Commentaries');

  const [activeTab, setActiveTab] = useState<'authors' | 'pericopes' | 'profile'>('authors');
  const handleClose = passageContext?.toggleRightInspector ?? (() => {});

  const currentBook = passageContext?.selectedBook;
  const currentChapter = passageContext?.selectedChapter;

  const rightInspectorWidth = passageContext?.rightInspectorWidth ?? 380;
  const setRightInspectorWidth = passageContext?.setRightInspectorWidth ?? (() => {});
  const resetRightInspectorWidth = passageContext?.resetRightInspectorWidth ?? (() => {});

  // Si la entrada activa tiene un autor específico, usarlo; si no, el activo
  const author = authors.find((a) => a.id === activeEntry?.authorId) || activeAuthor;

  return (
    <StudySidePanel
      side="right"
      title={tStudio('toggleCommentariesInspector') || tComm('inspectorTitle')}
      icon={<ScrollText className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
      ariaLabel={tStudio('toggleCommentariesInspector') || tComm('inspectorTitle')}
      isOpen={passageContext?.isRightInspectorOpen ?? false}
      onClose={handleClose}
      width={rightInspectorWidth}
      onResize={setRightInspectorWidth}
      onReset={resetRightInspectorWidth}
      collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
    >
      {/* Barra de Herramientas: Pasaje Activo + 3 Sub-Pestañas */}
      <StudySidePanel.Toolbar className="p-2.5 space-y-2">
        {/* Cabecera de Pasaje con Saltos Rápidos de Capítulo */}
        <div className="flex items-center justify-between gap-1 w-full pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-left min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {currentBook?.name || tComm('selectedPassageFallback')} {currentChapter ? `· Cap. ${currentChapter}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={passageContext?.prevChapter}
              disabled={currentChapter !== undefined && currentChapter !== null && currentChapter <= 1}
              className={`h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center transition-all ${
                currentChapter !== undefined && currentChapter !== null && currentChapter <= 1
                  ? 'opacity-30 cursor-not-allowed text-zinc-400'
                  : 'hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-300 shadow-xs cursor-pointer active:scale-95'
              }`}
              title="Capítulo anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={passageContext?.nextChapter}
              className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-300 shadow-xs cursor-pointer transition-all active:scale-95"
              title="Capítulo siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Barra de 3 Sub-Pestañas: Autores, Perícopas y Ficha */}
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('authors')}
            className={`py-1.5 px-2 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 min-w-0 ${
              activeTab === 'authors'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
            title={`${tComm('tabAuthors')} (${authors.length})`}
          >
            <Library className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tComm('tabAuthors')} ({authors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pericopes')}
            className={`py-1.5 px-2 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 min-w-0 ${
              activeTab === 'pericopes'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
            title={`${tComm('tabPericopes')} (${entries.length})`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tComm('tabPericopes')} ({entries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-1.5 px-2 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 min-w-0 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
            title={tComm('tabProfile')}
          >
            <ScrollText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tComm('tabProfile')}</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll Independiente */}
      <StudySidePanel.Body className="p-3 space-y-2">
        {/* Sección 1: Autores / Fuentes Clásicas */}
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
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
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
                <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
              )}
            </button>

            {/* Listado de Autores */}
            {authors.map((item) => {
              const isSelected = selectedAuthorId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedAuthorId(item.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      handleClose();
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 group ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-semibold block truncate">
                      {item.author}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
                      {item.era}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block line-clamp-1">
                      {item.theologicalFocus}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Sección 2: Perícopas del Capítulo */}
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
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <span className="text-[11px] font-mono font-bold text-zinc-900 dark:text-zinc-100 block">
                        v.{entry.verseStart}
                        {entry.verseEnd && entry.verseEnd !== entry.verseStart ? `-${entry.verseEnd}` : ''}
                      </span>
                      <span className="text-xs font-medium block truncate">
                        {entry.title}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isEntrySelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'}`} />
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Sección 3: Ficha Histórico-Exegética del Comentarista y Pasaje Activo */}
        {activeTab === 'profile' && (
          <div className="space-y-3">
            {author ? (
              <div className="space-y-3">
                {/* Ficha del Autor y de la Obra */}
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                      {tComm('commentator')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      {author.era}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-serif leading-snug">
                    {author.author}
                  </h3>
                  <div className="space-y-1 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      {tComm('canonicalWork')}
                    </span>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium italic">
                      {author.historicalWork}
                    </p>
                  </div>
                </div>

                {/* Enfoque Hermenéutico */}
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    {tComm('hermeneuticalFocus')}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {author.theologicalFocus}
                  </p>
                </div>

                {/* Perfil Biográfico */}
                <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    {tComm('biographicalProfile')}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-serif">
                    {author.biography}
                  </p>
                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {author.license}
                    </span>
                  </div>
                </div>

                {/* Pasaje Seleccionado */}
                {activeEntry && (
                  <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold block">
                      {tComm('activePassage')}
                    </span>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono block">
                        {currentBook?.name || activeEntry.bookId} {activeEntry.chapter}:{activeEntry.verseStart}
                        {activeEntry.verseEnd && activeEntry.verseEnd !== activeEntry.verseStart
                          ? `-${activeEntry.verseEnd}`
                          : ''}
                      </span>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2">
                        {activeEntry.title}
                      </p>
                    </div>

                    {activeEntry.tags && activeEntry.tags.length > 0 && (
                      <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                        {activeEntry.tags.map((tag, idx) => (
                          <span key={idx} className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <ScrollText className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {tComm('emptyInspectorTitle')}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {tComm('emptyInspectorDesc')}
                </p>
              </div>
            )}
          </div>
        )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
