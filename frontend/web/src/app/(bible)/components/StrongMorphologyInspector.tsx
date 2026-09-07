'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Languages, Volume2 } from 'lucide-react';
import { fetchStrongLexiconEntry } from '../features/interlinear/services/interlinearApiService';
import { StrongLexiconEntry } from '../features/interlinear/types';
import { InspectedWordData } from '../context/BiblePassageContext';

export interface StrongMorphologyInspectorProps {
  word: InspectedWordData | null;
  className?: string;
  onSelectRelatedStrong?: (strongCode: string) => void;
}

export const StrongMorphologyInspector: React.FC<StrongMorphologyInspectorProps> = ({
  word,
  className = '',
}) => {
  const tStudio = useTranslations('Studio');
  const [lexiconDetails, setLexiconDetails] = useState<StrongLexiconEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!word?.strongNumber) {
      setLexiconDetails(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchStrongLexiconEntry(word.strongNumber)
      .then((entry: StrongLexiconEntry) => {
        if (isMounted) {
          setLexiconDetails(entry);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [word?.strongNumber]);


  if (!word) {
    return (
      <div className={`py-12 px-4 text-center space-y-3 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400 dark:text-zinc-400">
          <Languages className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {tStudio('inspectedWordTitle')}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
            {tStudio('inspectedWordDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cabecera del Lema */}
      <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold">
            {word.strongNumber}
          </span>
          {word.language && (
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 capitalize">
              {word.language}
            </span>
          )}
        </div>

        {/* Lema original */}
        <div className="text-center py-2">
          <div
            className={`text-3xl font-serif text-zinc-900 dark:text-zinc-100 ${
              word.language === 'hebrew' ? 'direction-rtl' : ''
            }`}
          >
            {word.lemma || lexiconDetails?.lemma || word.wordText}
          </div>
          {(word.transliteration || lexiconDetails?.transliteration) && (
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 italic mt-1">
              /{word.transliteration || lexiconDetails?.transliteration}/
            </div>
          )}
        </div>

        {/* Palabra en contexto */}
        <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center border-t border-zinc-100 dark:border-zinc-800/80 pt-2.5">
          <span className="text-zinc-400">En el texto: </span>
          <strong className="text-zinc-800 dark:text-zinc-200">«{word.wordText}»</strong>
        </div>
      </div>

      {/* Datos Léxicos */}
      <div className="space-y-3">
        {/* Categoría Gramatical */}
        {(word.grammar || lexiconDetails?.partOfSpeech) && (
          <div>
            <h4 className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {tStudio('grammarCategory')}
            </h4>
            <p className="mt-1 text-xs text-zinc-800 dark:text-zinc-200 bg-white dark:bg-[#0a0a0a] px-3 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
              {word.grammar || lexiconDetails?.partOfSpeech}
            </p>
          </div>
        )}

        {/* Pronunciación */}
        {(word.pronunciation || lexiconDetails?.pronunciationGuide) && (
          <div>
            <h4 className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {tStudio('pronunciation')}
            </h4>
            <div className="mt-1 flex items-center justify-between text-xs text-zinc-800 dark:text-zinc-200 bg-white dark:bg-[#0a0a0a] px-3 py-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
              <span>{word.pronunciation || lexiconDetails?.pronunciationGuide}</span>
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
        )}

        {/* Definición Léxica BDB / Thayer */}
        <div>
          <h4 className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            {tStudio('definition')}
          </h4>
          {loading ? (
            <div className="p-4 bg-zinc-50 dark:bg-[#0a0a0a] rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 text-xs text-zinc-400 animate-pulse">
              Cargando léxico...
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] text-xs leading-relaxed space-y-2.5">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {lexiconDetails?.shortDefinition || word.definition || 'Sin definición directa disponible.'}
              </p>
              {lexiconDetails?.extendedDefinition && lexiconDetails.extendedDefinition.length > 0 && (
                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-2.5 space-y-1.5 text-zinc-600 dark:text-zinc-300">
                  {lexiconDetails.extendedDefinition.map((def: string, idx: number) => (
                    <p key={idx} className="text-[11px] leading-normal">
                      {def}
                    </p>
                  ))}
                </div>
              )}

              {lexiconDetails?.occurrencesInBible !== undefined && (
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  Total de apariciones canónicas: <strong className="text-zinc-800 dark:text-zinc-200">{lexiconDetails.occurrencesInBible}</strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
