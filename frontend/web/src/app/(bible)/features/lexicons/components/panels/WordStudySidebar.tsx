'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  Languages,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useLexiconContextSafe, CuratedTheologicalTerm } from '../../context/LexiconContext';
import { StudySidePanel } from '../../../../shared/ui';

export const WordStudySidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const lexicon = useLexiconContextSafe();
  const tStudio = useTranslations('Studio');

  const [filterQuery, setFilterQuery] = useState('');

  const activeLanguage = lexicon?.activeLanguage ?? 'hebrew';
  const setActiveLanguage = lexicon?.setActiveLanguage ?? (() => {});
  const theologicalTerms = lexicon?.theologicalTerms ?? [];
  const selectedStrong = lexicon?.selectedStrongCode ?? theologicalTerms[0]?.strong ?? '';
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

  return (
    <StudySidePanel
      side="left"
      title="Explorador Léxico"
      icon={<Languages className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />}
      badge={activeLanguage === 'hebrew' ? 'Léxico Hebreo BDB' : 'Léxico Griego Thayer'}
      storageKey="bible_lexicon_sidebar_w"
      defaultWidth={320}
      ariaLabel="Panel Lateral de Análisis de Palabra"
      collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
    >
      <StudySidePanel.Toolbar className="p-4 space-y-3">
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
      </StudySidePanel.Toolbar>

      <StudySidePanel.Body className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                      <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
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
        </StudySidePanel.Body>
    </StudySidePanel>
  );
};
