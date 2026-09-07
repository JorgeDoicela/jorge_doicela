'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { BookMarked, Copy, Check } from 'lucide-react';
import { InspectedVerseData } from '../context/BiblePassageContext';
import { API_URL } from '../../config';


export interface ParallelVerseData {
  translationId: number;
  translationName: string;
  translationAbbr: string;
  language: string;
  text: string;
}

export interface ParallelVerseInspectorProps {
  verse: InspectedVerseData | null;
  translations?: Array<{
    id: number;
    name: string;
    abbreviation: string;
    language: string;
  }>;
  className?: string;
  onCopyVerse?: (text: string, translationAbbr: string) => void;
}

const DEFAULT_TARGET_TRANSLATIONS = [
  { id: 3, name: 'Nueva Biblia de las Américas', abbreviation: 'NBLA', language: 'es' },
  { id: 5, name: 'New International Version', abbreviation: 'NIV', language: 'en' },
  { id: 1, name: 'Reina Valera 1909', abbreviation: 'RV1909', language: 'es' },
];

export const ParallelVerseInspector: React.FC<ParallelVerseInspectorProps> = ({
  verse,
  translations,
  className = '',
  onCopyVerse,
}) => {
  const tStudio = useTranslations('Studio');
  const tBooks = useTranslations('Books');
  const [parallelVerses, setParallelVerses] = useState<ParallelVerseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTranslations = translations && translations.length > 0
    ? translations.slice(0, 4)
    : DEFAULT_TARGET_TRANSLATIONS;

  useEffect(() => {
    if (!verse) {
      setParallelVerses([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    Promise.all(
      activeTranslations.map(async (trans) => {
        try {
          const res = await fetch(
            `${API_URL}/bible/verses?bookId=${verse.bookId}&chapter=${verse.chapter}&translationId=${trans.id}`,
          );
          if (!res.ok) return null;
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.data || [];
          const found = list.find((v: any) => v.verseNumber === verse.verseNumber);
          return {
            translationId: trans.id,
            translationName: trans.name,
            translationAbbr: trans.abbreviation,
            language: trans.language,
            text: found?.text || '',
          };
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (isMounted) {
        const filtered = results.filter((r): r is ParallelVerseData => r !== null && r.text.length > 0);
        setParallelVerses(filtered);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [verse?.bookId, verse?.chapter, verse?.verseNumber, activeTranslations]);

  const handleCopy = (text: string, id: string, abbr: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (onCopyVerse) onCopyVerse(text, abbr);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!verse) {
    return (
      <div className={`p-8 text-center space-y-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 dark:text-zinc-500">
          <BookMarked className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Comparación Sinóptica
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
            {tStudio('noVerseSelected')}
          </p>
        </div>
      </div>
    );
  }

  const localizedBookName = (() => {
    try {
      const trans = tBooks(verse.bookName as any);
      return trans || verse.bookName;
    } catch {
      return verse.bookName;
    }
  })();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cabecera del Versículo Inspeccionado */}
      <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          {localizedBookName} {verse.chapter}:{verse.verseNumber}
        </span>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
          Comparación sincrónica de manuscritos y traducciones
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/40 animate-pulse space-y-2">
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      ) : parallelVerses.length > 0 ? (
        <div className="space-y-3">
          {parallelVerses.map((pv) => (
            <div
              key={pv.translationId}
              className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                    {pv.translationAbbr}
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate max-w-[150px]" title={pv.translationName}>
                    {pv.translationName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(pv.text, `pv-${pv.translationId}`, pv.translationAbbr)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  title="Copiar texto"
                >
                  {copiedId === `pv-${pv.translationId}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-serif">
                «{pv.text}»
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center space-y-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
          <BookMarked className="w-5 h-5 text-zinc-400 mx-auto" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {tStudio('noVerseSelected')}
          </p>
        </div>
      )}
    </div>
  );
};
