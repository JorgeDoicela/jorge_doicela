'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  BookOpen,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  ScrollText,
  Volume2,
  Library,
  BookMarked,
} from 'lucide-react';
import { fetchCommentariesByPassage, CommentaryEntry } from '../../../features/commentaries';
import { InspectedVerseData } from '../model/KartexPassageContext';
import {
  getCrossReferencesForVerse,
  CrossReferenceItem,
  BOOK_ID_TO_ABBR,
} from '../data/crossReferencesData';
import {
  fetchLexiconEntryDirectly,
  StrongLexiconEntryData,
} from './StrongMorphologyInspector';
import { CANONICAL_TRANSLATIONS } from '../../translations/hooks/useTranslations';
import { API_URL } from '../../../../config';

export interface TargetTranslationItem {
  id: number;
  name: string;
  abbreviation: string;
  language: string;
}

export interface ParallelVerseItem {
  translationId: number;
  translationName: string;
  translationAbbr: string;
  language: string;
  text: string;
}

export interface MorphologyVerseToken {
  id: number;
  wordOrder: number;
  surfaceText: string;
  transliteration: string;
  strongCode: string;
  morphologyCode?: string;
  gloss: string;
  verse?: {
    id: number;
    chapter: number;
    verseNumber: number;
  };
}

export interface VerseExegesisCardProps {
  verse: InspectedVerseData | null;
  translations?: TargetTranslationItem[];
  onSelectPassage?: (bookId: number, chapter: number, verseNumber?: number) => void;
  className?: string;
}

export const VerseExegesisCard: React.FC<VerseExegesisCardProps> = ({
  verse,
  translations = [],
  onSelectPassage,
  className = '',
}) => {
  const tStudio = useTranslations('Studio');
  const tBooks = useTranslations('Books');
  const locale = useLocale();

  const availableTranslations = useMemo(() => {
    return translations && translations.length > 0 ? translations : CANONICAL_TRANSLATIONS;
  }, [translations]);

  // Versiones activas para comparar
  const isOldTestament = (verse?.bookId || 1) <= 39;
  const initialTranslationIds = useMemo(() => {
    // Si es AT: BHS (1), NBLA (3), NTV (4)
    // Si es NT: NA28 (2), NBLA (3), NTV (4)
    return isOldTestament ? [1, 3, 4] : [2, 3, 4];
  }, [isOldTestament]);

  const [activeTranslationIds, setActiveTranslationIds] = useState<number[]>(initialTranslationIds);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados de datos
  const [parallelVerses, setParallelVerses] = useState<ParallelVerseItem[]>([]);
  const [parallelLoading, setParallelLoading] = useState(false);
  const [tokens, setTokens] = useState<MorphologyVerseToken[]>([]);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [activeLexiconCode, setActiveLexiconCode] = useState<string | null>(null);
  const [activeLexiconData, setActiveLexiconData] = useState<StrongLexiconEntryData | null>(null);
  const [lexiconLoading, setLexiconLoading] = useState(false);
  const [verseCommentaries, setVerseCommentaries] = useState<CommentaryEntry[]>([]);
  const [commentariesLoading, setCommentariesLoading] = useState(false);

  const bookId = verse?.bookId || 1;
  const chapter = verse?.chapter || 1;
  const verseNumber = verse?.verseNumber || 1;

  // Cerrar selector de versiones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsVersionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Actualizar versiones base cuando cambia de testamento si el usuario no ha personalizado
  useEffect(() => {
    setActiveTranslationIds((prev) => {
      const sourceId = isOldTestament ? 1 : 2;
      const otherSourceId = isOldTestament ? 2 : 1;
      const filtered = prev.filter((id) => id !== otherSourceId);
      if (!filtered.includes(sourceId)) {
        return [sourceId, ...filtered.filter((id) => id !== sourceId)];
      }
      return filtered;
    });
  }, [isOldTestament]);

  // Carga de versículos paralelos para las traducciones seleccionadas
  useEffect(() => {
    if (!verse || !bookId || !chapter || !verseNumber || activeTranslationIds.length === 0) {
      setParallelVerses([]);
      setParallelLoading(false);
      return;
    }

    let isMounted = true;
    setParallelLoading(true);

    Promise.all(
      activeTranslationIds.map(async (transId) => {
        try {
          const res = await fetch(
            `${API_URL}/kartex/verses?bookId=${bookId}&chapter=${chapter}&translationId=${transId}`,
          );
          if (!res.ok) return null;
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.data || [];
          const found = list.find((v: any) => v.verseNumber === verseNumber);
          if (!found) return null;

          const meta = availableTranslations.find((t) => t.id === transId);
          return {
            translationId: transId,
            translationName: meta?.name || found.translation?.name || `Traducción ${transId}`,
            translationAbbr: meta?.abbreviation || found.translation?.abbreviation || `T${transId}`,
            language: meta?.language || found.translation?.language || 'es',
            text: found.text || '',
          };
        } catch {
          return null;
        }
      }),
    ).then((results) => {
      if (isMounted) {
        const valid = results.filter((r): r is ParallelVerseItem => r !== null && r.text.length > 0);
        setParallelVerses(valid);
        setParallelLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [bookId, chapter, verseNumber, activeTranslationIds, availableTranslations]);

  // Abreviatura canónica oficial para consultas de backend y referencias
  const canonicalAbbr = BOOK_ID_TO_ABBR[verse?.bookId || bookId] || 'GEN';

  // Carga de tokens morfológicos del versículo activo
  useEffect(() => {
    if (!verse) {
      setTokens([]);
      setTokensLoading(false);
      return;
    }

    let isMounted = true;
    setTokensLoading(true);
    setActiveLexiconCode(null);
    setActiveLexiconData(null);

    fetch(`${API_URL}/kartex/morphology/passage?book=${encodeURIComponent(canonicalAbbr)}&chapter=${chapter}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : data?.data || [];
        const verseTokens = list.filter((t: any) => {
          const vNum = t.verse?.verseNumber || t.verseNumber;
          return vNum === verseNumber;
        });
        setTokens(verseTokens);
        setTokensLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setTokens([]);
          setTokensLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [bookId, chapter, verseNumber, canonicalAbbr]);

  // Carga de notas exegéticas de comentarios bíblicos para el versículo
  useEffect(() => {
    if (!canonicalAbbr || !chapter || !verseNumber) {
      setVerseCommentaries([]);
      return;
    }

    let isMounted = true;
    setCommentariesLoading(true);

    fetchCommentariesByPassage(canonicalAbbr, chapter, verseNumber, locale)
      .then((data) => {
        if (isMounted) {
          setVerseCommentaries(data);
          setCommentariesLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVerseCommentaries([]);
          setCommentariesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [canonicalAbbr, chapter, verseNumber, locale]);

  // Carga de ficha léxica al hacer clic en un código Strong
  const handleToggleStrongDefinition = (strongCode: string) => {
    if (activeLexiconCode === strongCode) {
      setActiveLexiconCode(null);
      setActiveLexiconData(null);
      return;
    }

    setActiveLexiconCode(strongCode);
    setLexiconLoading(true);

    fetchLexiconEntryDirectly(strongCode)
      .then((data) => {
        setActiveLexiconData(data);
        setLexiconLoading(false);
      })
      .catch(() => {
        setActiveLexiconData(null);
        setLexiconLoading(false);
      });
  };

  const handleToggleTranslation = (id: number) => {
    setActiveTranslationIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Mantener al menos 1
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  // Referencias cruzadas canónicas
  const crossReferences: CrossReferenceItem[] = useMemo(() => {
    return getCrossReferencesForVerse(bookId, canonicalAbbr, chapter, verseNumber, locale);
  }, [bookId, canonicalAbbr, chapter, verseNumber, locale]);

  const localizedBookTitle = useMemo(() => {
    if (tBooks.has(canonicalAbbr as any)) {
      return tBooks(canonicalAbbr as any);
    }
    return verse?.bookName || (locale === 'en' ? 'Genesis' : 'Génesis');
  }, [canonicalAbbr, verse?.bookName, tBooks, locale]);

  if (!verse) {
    return (
      <div className={`py-16 px-4 text-center space-y-4 my-auto ${className}`}>
        <BookOpen className="w-8 h-8 stroke-[1.5] mx-auto text-zinc-400 dark:text-zinc-500" />
        <div className="space-y-1.5 max-w-xs mx-auto">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-serif">
            {tStudio('selectVerseToInspect')}
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
            {tStudio('noVerseSelectedDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-7 text-sm ${className}`}>
      {/* 1. Cabecera del Versículo y Gestión de Versiones */}
      <div className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-serif">
              {localizedBookTitle} {chapter}:{verseNumber}
            </span>
            <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900">
              <button
                type="button"
                disabled={verseNumber <= 1}
                onClick={() => {
                  if (verseNumber > 1) {
                    onSelectPassage?.(bookId, chapter, verseNumber - 1);
                  }
                }}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
                title={tStudio('prevVerse')}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectPassage?.(bookId, chapter, verseNumber + 1);
                }}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-foreground transition-colors cursor-pointer"
                title={tStudio('nextVerse')}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Menú Selector de Traducciones */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={tStudio('manageVersions')}
            >
              <span>{tStudio('activeTranslationsCount', { count: activeTranslationIds.length })}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>

            {isVersionDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0d] shadow-xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-2 py-1">
                  {tStudio('manageVersions')}
                </div>
                {availableTranslations.map((trans) => {
                  const isChecked = activeTranslationIds.includes(trans.id);
                  return (
                    <button
                      key={trans.id}
                      type="button"
                      onClick={() => handleToggleTranslation(trans.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                        isChecked
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-foreground font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] px-1 rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {trans.abbreviation}
                        </span>
                        <span className="truncate">{trans.name}</span>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chips activos de versiones */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {activeTranslationIds.map((id) => {
            const trans = availableTranslations.find((t) => t.id === id);
            if (!trans) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                <span>{trans.abbreviation}</span>
                {activeTranslationIds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleToggleTranslation(id)}
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    title={tStudio('removeVersion')}
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* 2. Cotejo Multiversión Scrolleable */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3.5">
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
            {tStudio('multiverseComparison')}
          </span>
        </div>

        {parallelLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] animate-pulse space-y-2"
              >
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-6 bg-zinc-100 dark:bg-zinc-900 rounded" />
              </div>
            ))}
          </div>
        ) : parallelVerses.length > 0 ? (
          <div className="space-y-2.5">
            {parallelVerses.map((pv) => {
              const isAncient = pv.translationAbbr === 'BHS' || pv.translationAbbr === 'NA28';
              const isHebrew = pv.translationAbbr === 'BHS';
              return (
                <div
                  key={pv.translationId}
                  className="p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10.5px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-800">
                      {pv.translationAbbr}
                    </span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate" title={pv.translationName}>
                      {pv.translationName}
                    </span>
                  </div>

                  <p
                    className={`text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 ${
                      isHebrew
                        ? 'font-serif text-[15px] leading-loose text-right'
                        : isAncient
                        ? 'font-serif text-[13.5px]'
                        : 'font-serif text-xs'
                    }`}
                    dir={isHebrew ? 'rtl' : 'ltr'}
                  >
                    «{pv.text}»
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            {tStudio('noVerseSelected')}
          </div>
        )}
      </div>

      {/* 3. Términos Clave del Versículo (Morfología & Strong) */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3.5">
        <div className="px-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 dark:bg-amber-400/80 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
              {tStudio('originalKeywords')}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-3.5">
            {tStudio('originalKeywordsSubtitle')}
          </p>
        </div>

        {tokensLoading ? (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-400 animate-pulse text-center">
            {tStudio('loadingTokens')}
          </div>
        ) : tokens.length > 0 ? (
          <div className="p-3.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/25 border border-zinc-200/70 dark:border-zinc-800/70 space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {tokens.map((tk) => {
                const isSelected = activeLexiconCode === tk.strongCode;
                return (
                  <button
                    key={tk.id || `${tk.wordOrder}-${tk.strongCode}`}
                    type="button"
                    onClick={() => handleToggleStrongDefinition(tk.strongCode)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent font-medium shadow-xs'
                        : 'bg-white dark:bg-[#0a0a0a] border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <span className="font-serif font-bold text-sm tracking-wide" dir={isOldTestament ? 'rtl' : 'ltr'}>
                      {tk.surfaceText}
                    </span>
                    <span className="font-mono text-[10px] opacity-70">
                      {tk.strongCode}
                    </span>
                    {tk.gloss && (
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 italic max-w-[80px] truncate">
                        {tk.gloss}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Ficha Léxica Desplegable Inline */}
            {activeLexiconCode && (
              <div className="mt-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-zinc-200/70 dark:border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-foreground">
                      {activeLexiconCode}
                    </span>
                    {activeLexiconData && (
                      <span className="text-xs font-serif font-semibold text-foreground">
                        {activeLexiconData.lemma}
                      </span>
                    )}
                  </div>
                  {activeLexiconData?.transliteration && (
                    <span className="text-xs font-mono text-zinc-400 italic">
                      /{activeLexiconData.transliteration}/
                    </span>
                  )}
                </div>

                {lexiconLoading ? (
                  <div className="text-xs text-zinc-400 py-2 animate-pulse">
                    {tStudio('loadingLexicon')}
                  </div>
                ) : activeLexiconData ? (
                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                      {activeLexiconData.shortDefinition}
                    </p>
                    {activeLexiconData.partOfSpeech && (
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {tStudio('grammarCategory')}: {activeLexiconData.partOfSpeech}
                      </div>
                    )}
                    {activeLexiconData.occurrencesInBible !== undefined && (
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {tStudio('totalOccurrences')} <strong className="text-foreground">{activeLexiconData.occurrencesInBible}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400">
                    {tStudio('noDirectDefinition')}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 text-xs text-zinc-400">
            {tStudio('noTokensForVerse')}
          </div>
        )}
      </div>

      {/* 4. Comentarios Bíblicos Clásicos del Versículo */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 dark:bg-amber-400/80 shrink-0" />
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                {tStudio('commentariesTitle')}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-3.5">
              {tStudio('commentariesSubtitle')}
            </p>
          </div>
          <Link
            href={`/study/commentaries?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}`}
            className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-foreground flex items-center gap-1 font-mono hover:underline cursor-pointer"
          >
            <span>{tStudio('viewAllCommentaries')}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {commentariesLoading ? (
          <div className="p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/20 animate-pulse space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
            <div className="h-10 bg-zinc-100 dark:bg-zinc-800/40 rounded w-full" />
          </div>
        ) : verseCommentaries.length > 0 ? (
          <div className="space-y-2.5">
            {verseCommentaries.map((comm) => (
              <Link
                key={comm.id}
                href={`/study/commentaries?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}&author=${comm.authorId}`}
                className="block p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-colors space-y-2 group/comm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-serif group-hover/comm:text-amber-600 dark:group-hover/comm:text-amber-400 transition-colors">
                    {comm.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 shrink-0 uppercase">
                    {comm.authorId}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif line-clamp-3">
                  {comm.contentMarkdown.replace(/^#+\s+/gm, '').slice(0, 260)}...
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/20 text-xs text-zinc-400">
            {tStudio('noCommentariesForVerse')}
          </div>
        )}
      </div>

      {/* 4. Referencias Cruzadas Canónicas */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3.5">
        <div className="px-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 dark:bg-blue-400/80 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
              {tStudio('crossReferencesTitle')}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pl-3.5">
            {tStudio('crossReferencesSubtitle')}
          </p>
        </div>

        <div className="space-y-2">
          {crossReferences.map((ref) => {
            const targetBookTitle = tBooks.has(ref.targetBookAbbr as any)
              ? tBooks(ref.targetBookAbbr as any)
              : ref.targetBookName;
            return (
              <div
                key={ref.id}
                className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectPassage?.(ref.targetBookId, ref.chapter, ref.verseNumber)}
                    className="font-serif font-bold text-xs text-foreground hover:underline cursor-pointer flex items-center gap-1.5"
                  >
                    <span>
                      {targetBookTitle} {ref.chapter}:{ref.verseNumber}
                    </span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </button>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500">
                    {ref.relationLabel}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-serif italic">
                  «{ref.snippetText}»
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Accesos Directos al Ecosistema Kartex */}
      <div className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 dark:bg-emerald-400/80 shrink-0" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
            {tStudio('quickAccessTitle')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/study/interlinear?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}`}
            className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-foreground/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center text-xs font-medium text-foreground cursor-pointer shadow-xs"
          >
            <span className="truncate">{tStudio('openInInterlinear')}</span>
          </Link>

          <Link
            href={`/study/parallel?book=${canonicalAbbr}&chapter=${chapter}`}
            className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-foreground/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center text-xs font-medium text-foreground cursor-pointer shadow-xs"
          >
            <span className="truncate">{tStudio('openInParallel')}</span>
          </Link>

          <Link
            href="/study/atlas"
            className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-foreground/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center text-xs font-medium text-foreground cursor-pointer shadow-xs"
          >
            <span className="truncate">{tStudio('openInAtlas')}</span>
          </Link>

          <Link
            href="/study/timeline"
            className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-foreground/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center text-xs font-medium text-foreground cursor-pointer shadow-xs"
          >
            <span className="truncate">{tStudio('openInTimeline')}</span>
          </Link>

          <Link
            href={`/study/commentaries?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}`}
            className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-foreground/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center text-xs font-medium text-foreground cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <Library className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate">{tStudio('openInCommentaries')}</span>
          </Link>

          <Link
            href="/study/dictionaries"
            className="p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0a0a0a] hover:border-foreground/30 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center text-xs font-medium text-foreground cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <BookMarked className="w-3.5 h-3.5 text-zinc-400" />
            <span className="truncate">{tStudio('openInDictionaries')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
