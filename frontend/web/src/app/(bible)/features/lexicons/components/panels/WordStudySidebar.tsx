'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  BookOpen,
  Sparkles,
  Languages,
  Check,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';
import { useLexiconContextSafe, CuratedTheologicalTerm } from '../../context/LexiconContext';

export const WordStudySidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const lexicon = useLexiconContextSafe();
  const tStudio = useTranslations('Studio');

  const [filterQuery, setFilterQuery] = useState('');

  const isOpen = passageContext?.isLeftSidebarOpen ?? true;
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  const activeLanguage = lexicon?.activeLanguage ?? 'hebrew';
  const setActiveLanguage = lexicon?.setActiveLanguage ?? (() => {});
  const theologicalTerms = lexicon?.theologicalTerms ?? [];
  const selectedStrong = lexicon?.selectedStrongCode ?? 'H2617';
  const selectTerm = lexicon?.selectTerm ?? (() => {});

  const filteredTerms = useMemo(() => {
    if (!filterQuery.trim()) return theologicalTerms;
    const q = filterQuery.toLowerCase();
    return theologicalTerms.filter(
      (term) =>
        term.strong.toLowerCase().includes(q) ||
        term.lemma.includes(q) ||
        term.transliteration.toLowerCase().includes(q) ||
        term.gloss.toLowerCase().includes(q),
    );
  }, [theologicalTerms, filterQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop móvil */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Panel Lateral de Análisis de Palabra"
        className="fixed inset-y-0 left-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-88 xl:w-96 flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden"
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio Derecho (Estilo DIITRA) */}
        <div
          className="hidden lg:flex absolute top-0 -right-3 w-6 h-full cursor-pointer z-30 group/border items-center justify-center select-none"
          onClick={handleClose}
          title={tStudio('collapseSidebar') || 'Ocultar panel'}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover/border:bg-zinc-400 dark:group-hover/border:bg-zinc-500 transition-colors duration-150" />
          <div className="relative z-10 w-6 h-7 rounded-md bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-700 shadow-sm opacity-0 group-hover/border:opacity-100 hover:scale-110 hover:border-zinc-500 dark:hover:border-zinc-400 transition-all duration-150 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
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

        {/* Cabecera del Panel */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-foreground">
                <Languages className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Explorador Léxico
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {activeLanguage === 'hebrew' ? 'Léxico Hebreo BDB' : 'Léxico Griego Thayer'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Selector de Lengua */}
          <div className="grid grid-cols-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200/60 dark:border-zinc-800/60">
            <button
              type="button"
              onClick={() => setActiveLanguage('hebrew')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeLanguage === 'hebrew'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-foreground'
              }`}
            >
              Hebreo (AT)
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguage('greek')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeLanguage === 'greek'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-foreground'
              }`}
            >
              Griego (NT)
            </button>
          </div>

          {/* Buscador de Vocablos */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Buscar por Strong, lema o glosa..."
              className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-foreground placeholder:text-zinc-400 focus:outline-hidden focus:border-foreground transition-colors"
            />
          </div>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Términos Teológicos Clave ({filteredTerms.length})
            </span>
          </div>

          <div className="space-y-2">
            {filteredTerms.map((term) => {
              const isSelected = selectedStrong === term.strong;
              return (
                <button
                  key={term.strong}
                  type="button"
                  onClick={() => selectTerm(term)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-100/90 dark:bg-zinc-900/90 border-zinc-400 dark:border-zinc-600 shadow-xs'
                      : 'bg-background border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-200/70 dark:bg-zinc-800 text-foreground font-bold">
                        {term.strong}
                      </span>
                      <span
                        dir={term.language === 'hebrew' ? 'rtl' : 'ltr'}
                        className="text-base font-serif font-bold text-foreground"
                      >
                        {term.lemma}
                      </span>
                      <span className="text-xs font-mono text-zinc-500 italic">
                        ({term.transliteration})
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-400">
                      {term.occurrences}x
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-foreground mb-1">
                    {term.gloss}
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {term.concept}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};
