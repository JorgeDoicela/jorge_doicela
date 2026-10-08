'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  BookMarked,
  BookOpen,
  Calendar,
  ShieldCheck,
  Tag,
  Sparkles,
  ExternalLink,
  Layers,
  Compass,
} from 'lucide-react';
import { useDictionaries } from '../context/DictionariesContext';
import { useKartexPassageSafe } from '../../../entities/passage';
import { StudySidePanel } from '../../../shared/ui';

export const DictionariesInspector: React.FC = () => {
  const {
    activeEntry,
    activeDictionary,
    setSelectedEntryId,
    setSearchQuery,
    dictionaries,
  } = useDictionaries();

  const passageContext = useKartexPassageSafe();
  const tStudio = useTranslations('Studio');
  const tDict = useTranslations('Dictionaries');

  // Si la entrada activa tiene un diccionario específico, usarlo; si no, el activo
  const dictionary =
    dictionaries.find((d) => d.id === activeEntry?.dictionaryId) || activeDictionary;

  return (
    <StudySidePanel
      side="right"
      title={tStudio('toggleDictionariesInspector') || tDict('inspectorTitle')}
      icon={<BookMarked className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
      storageKey="kartex_dictionaries_inspector_w"
      defaultWidth={360}
      collapseTitle={tStudio('closeInspector') || tDict('closeInspector')}
    >
      <StudySidePanel.Body className="space-y-4">
        {activeEntry ? (
          <div className="space-y-4">
            {/* Ficha del Término y Etimología */}
            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                  {tDict('inspectorTitle')}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  {tDict('letterBadge', { letter: activeEntry.letter })}
                </span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-serif leading-snug">
                {activeEntry.term}
              </h3>
              {activeEntry.etymology && (
                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    {tDict('etymology')}
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-mono">
                    {activeEntry.etymology}
                  </p>
                </div>
              )}
            </div>

            {/* Ficha de la Obra de Referencia */}
            {dictionary && (
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  {tDict('dictionaryWork')}
                </span>
                <div className="space-y-1 text-zinc-600 dark:text-zinc-300">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {dictionary.title}
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                    {dictionary.author} ({dictionary.year})
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[11px]">
                    {dictionary.theologicalFocus}
                  </p>
                </div>
                <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {dictionary.license}
                  </span>
                </div>
              </div>
            )}

            {/* Pasajes Bíblicos Respaldados */}
            {activeEntry.biblicalReferences && activeEntry.biblicalReferences.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block px-1">
                  {tDict('biblicalReferences')} ({activeEntry.biblicalReferences.length})
                </span>
                <div className="space-y-1.5">
                  {activeEntry.biblicalReferences.map((ref, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {ref.reference}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {ref.context}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Términos Conceptualmente Relacionados */}
            {activeEntry.relatedTerms && activeEntry.relatedTerms.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block px-1">
                  {tDict('relatedTerms')}
                </span>
                <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-xs">
                  {activeEntry.relatedTerms.map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-500"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <BookMarked className="w-8 h-8 text-zinc-400 mx-auto" />
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {tDict('emptyInspectorTitle')}
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {tDict('emptyInspectorDesc')}
            </p>
          </div>
        )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
