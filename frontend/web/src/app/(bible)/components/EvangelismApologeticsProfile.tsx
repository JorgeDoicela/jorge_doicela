'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Shield, BookOpen, MessageSquare, Sparkles, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useBiblePassageSafe } from '../context/BiblePassageContext';
import { getBookHistoricalInfo } from '../entities/books';



export const EvangelismApologeticsProfile: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const tStudio = useTranslations('Studio');
  const tEvangelism = useTranslations('Evangelism');
  const tBooks = useTranslations('Books');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const selectedBook = passageContext?.selectedBook;
  const bookId = passageContext?.selectedBookId ?? 45; // Romanos por defecto
  const chapter = passageContext?.selectedChapter ?? 1;

  const info = getBookHistoricalInfo(bookId);

  const localizedBookTitle = selectedBook?.abbreviation
    ? (tBooks.has(selectedBook.abbreviation as any) ? tBooks(selectedBook.abbreviation as any) : selectedBook.name)
    : (selectedBook?.name || (tBooks.has('ROM' as any) ? tBooks('ROM' as any) : 'Romanos'));

  const doctrineKeys = ['justification', 'propitiation', 'grace', 'savingFaith', 'regeneration'] as const;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Tarjeta de Principio Ministerial */}
      <div className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/60 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>{tEvangelism('apologeticsBannerTitle')}</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {tEvangelism('apologeticsBannerQuote')}
        </p>
      </div>

      {/* Relevancia del Libro Bíblico Activo */}
      {info && (
        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {tEvangelism('bookInEvangelism', { book: localizedBookTitle })}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">{tStudio('chapterShort', { chapter })}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {info.practicalMinisterialFocus || info.theologicalTheme}
          </p>
        </div>
      )}

      {/* Vocablos Teológicos Clave para no descontextualizar el Evangelio */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{tEvangelism('soteriologyGlossary')}</span>
        </div>

        <div className="space-y-1.5">
          {doctrineKeys.map((key, idx) => {
            const isExpanded = expandedIndex === idx;
            const term = tEvangelism(`doctrines.${key}.term` as any);
            const originalGreek = tEvangelism(`doctrines.${key}.originalGreek` as any);
            const definition = tEvangelism(`doctrines.${key}.definition` as any);
            const reference = tEvangelism(`doctrines.${key}.reference` as any);

            return (
              <div
                key={key}
                className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-black/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {term}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        ({originalGreek})
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-2.5 pb-2.5 pt-0 text-xs space-y-1 border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1.5">
                      {definition}
                    </p>
                    <span className="inline-block text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {tEvangelism('citationsLabel')} {reference}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Consejos Prácticos de Diálogo */}
      <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
          <span>{tEvangelism('dialogueAdviceTitle')}</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {tEvangelism('dialogueAdviceDesc')}
        </p>
      </div>

      {/* Enlace al Lector */}
      <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <Link
          href={`/study/standard?book=${selectedBook?.abbreviation || 'ROM'}&chapter=${chapter}`}
          className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors flex items-center justify-between group"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{tStudio('readPassageInReader', { book: localizedBookTitle, chapter })}</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
