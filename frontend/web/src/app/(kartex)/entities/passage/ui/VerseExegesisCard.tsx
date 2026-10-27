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
      <div className="pb-4 border-b border-border/60 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-foreground font-serif">
              {localizedBookTitle} {chapter}:{verseNumber}
            </span>
            <div className="flex items-center border border-border/80 rounded-full overflow-hidden bg-inner-card/70">
              <button
                type="button"
                disabled={verseNumber <= 1}
                onClick={() => {
                  if (verseNumber > 1) {
                    onSelectPassage?.(bookId, chapter, verseNumber - 1);
                  }
                }}
                className="px-2 py-1 hover:bg-accents-2 text-accents-5 hover:text-foreground disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
                title={tStudio('prevVerse')}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-border/60" />
              <button
                type="button"
                onClick={() => {
                  onSelectPassage?.(bookId, chapter, verseNumber + 1);
                }}
                className="px-2 py-1 hover:bg-accents-2 text-accents-5 hover:text-foreground transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full border border-border/80 bg-inner-card/70 text-foreground hover:bg-accents-1 transition-all cursor-pointer whitespace-nowrap shrink-0"
              title={tStudio('manageVersions')}
            >
              <span>{tStudio('activeTranslationsCount', { count: activeTranslationIds.length })}</span>
              <ChevronDown className="w-3 h-3 text-accents-4 shrink-0" />
            </button>

            {isVersionDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 p-2 rounded-xl border border-border bg-card shadow-xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accents-4 px-2 py-1">
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
                          ? 'bg-accents-1 text-foreground font-semibold'
                          : 'text-accents-5 hover:bg-accents-1/60 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] px-1 rounded bg-inner-card border border-border/60 text-foreground">
                          {trans.abbreviation}
                        </span>
                        <span className="truncate">{trans.name}</span>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-foreground shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chips activos de versiones */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {activeTranslationIds.map((id) => {
            const trans = availableTranslations.find((t) => t.id === id);
            if (!trans) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono bg-inner-card/80 border border-border/80 text-accents-6"
              >
                <span className="font-semibold text-foreground">{trans.abbreviation}</span>
                {activeTranslationIds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleToggleTranslation(id)}
                    className="text-accents-4 hover:text-foreground transition-colors cursor-pointer ml-0.5"
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

      {/* 2. Cotejo Multiversión Flujo Editorial */}
      <div className="space-y-3.5">
        <div className="px-0.5">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-foreground">
            {tStudio('multiverseComparison')}
          </span>
        </div>

        {parallelLoading ? (
          <div className="space-y-4 py-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="space-y-2 animate-pulse py-2">
                <div className="h-3 w-16 bg-accents-2 rounded" />
                <div className="h-10 bg-accents-1 rounded" />
              </div>
            ))}
          </div>
        ) : parallelVerses.length > 0 ? (
          <div className="space-y-4">
            {parallelVerses.map((pv) => {
              const isAncient = pv.translationAbbr === 'BHS' || pv.translationAbbr === 'NA28';
              const isHebrew = pv.translationAbbr === 'BHS';
              return (
                <div
                  key={pv.translationId}
                  className="space-y-1.5 transition-colors"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-bold text-foreground tracking-wide">
                      {pv.translationAbbr}
                    </span>
                    <span className="text-[11px] text-accents-4 truncate" title={pv.translationName}>
                      {pv.translationName}
                    </span>
                  </div>

                  <p
                    className={`leading-relaxed text-foreground select-text ${
                      isHebrew
                        ? 'font-hebrew text-[15px] leading-loose text-right pt-1'
                        : isAncient
                        ? 'font-greek text-sm'
                        : 'font-serif text-[13px]'
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
          <div className="py-4 text-center text-xs text-accents-4 italic">
            {tStudio('noVerseSelected')}
          </div>
        )}
      </div>

      {/* 3. Términos Clave del Versículo (Morfología & Strong) */}
      <div className="space-y-3.5">
        <div className="px-0.5">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-foreground">
            {tStudio('originalKeywords')}
          </span>
        </div>

        {tokensLoading ? (
          <div className="py-3 text-xs text-accents-4 animate-pulse text-center">
            {tStudio('loadingTokens')}
          </div>
        ) : tokens.length > 0 ? (
          <div className="space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {tokens.map((tk) => {
                const isSelected = activeLexiconCode === tk.strongCode;
                return (
                  <button
                    key={tk.id || `${tk.wordOrder}-${tk.strongCode}`}
                    type="button"
                    onClick={() => handleToggleStrongDefinition(tk.strongCode)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-foreground text-background border-transparent font-medium shadow-2xs'
                        : 'bg-inner-card/60 border-border/80 text-foreground hover:bg-accents-1 hover:border-accents-4'
                    }`}
                  >
                    <span
                      className={`font-bold text-sm tracking-wide ${isOldTestament ? 'font-hebrew' : 'font-greek'}`}
                      dir={isOldTestament ? 'rtl' : 'ltr'}
                    >
                      {tk.surfaceText}
                    </span>
                    <span className="font-mono text-[10px] opacity-70">
                      {tk.strongCode}
                    </span>
                    {tk.gloss && (
                      <span className="text-[10px] text-accents-4 italic max-w-[80px] truncate">
                        {tk.gloss}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Ficha Léxica Desplegable Inline */}
            {activeLexiconCode && (
              <div className="mt-3 p-3.5 rounded-xl border border-border/80 bg-inner-card/70 space-y-2.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-inner-card border border-border/60 text-foreground">
                      {activeLexiconCode}
                    </span>
                    {activeLexiconData && (
                      <span className={`text-xs font-semibold text-foreground ${isOldTestament ? 'font-hebrew' : 'font-greek'}`}>
                        {activeLexiconData.lemma}
                      </span>
                    )}
                  </div>
                  {activeLexiconData?.transliteration && (
                    <span className="text-xs font-mono text-accents-4 italic">
                      /{activeLexiconData.transliteration}/
                    </span>
                  )}
                </div>

                {lexiconLoading ? (
                  <div className="text-xs text-accents-4 py-2 animate-pulse">
                    {tStudio('loadingLexicon')}
                  </div>
                ) : activeLexiconData ? (
                  <div className="space-y-2 text-xs">
                    <p className="font-medium text-foreground/90 leading-relaxed">
                      {activeLexiconData.shortDefinition}
                    </p>
                    {activeLexiconData.partOfSpeech && (
                      <div className="text-[11px] text-accents-4 font-mono">
                        {tStudio('grammarCategory')}: {activeLexiconData.partOfSpeech}
                      </div>
                    )}
                    {activeLexiconData.occurrencesInBible !== undefined && (
                      <div className="text-[11px] text-accents-4 font-mono">
                        {tStudio('totalOccurrences')} <strong className="text-foreground">{activeLexiconData.occurrencesInBible}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-accents-4">
                    {tStudio('noDirectDefinition')}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-2.5 text-xs text-accents-4 italic">
            {tStudio('noTokensForVerse')}
          </div>
        )}
      </div>

      {/* 4. Comentarios Bíblicos Clásicos del Versículo */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-foreground">
            {tStudio('commentariesTitle')}
          </span>
          <Link
            href={`/study/commentaries?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}`}
            className="text-[11px] text-accents-4 hover:text-foreground flex items-center gap-1 font-mono hover:underline cursor-pointer"
          >
            <span>{tStudio('viewAllCommentaries')}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {commentariesLoading ? (
          <div className="p-3 rounded-xl border border-border/60 bg-inner-card/30 animate-pulse space-y-2">
            <div className="h-4 bg-accents-2 rounded w-1/3" />
            <div className="h-10 bg-accents-1 rounded w-full" />
          </div>
        ) : verseCommentaries.length > 0 ? (
          <div className="space-y-2">
            {verseCommentaries.map((comm) => (
              <Link
                key={comm.id}
                href={`/study/commentaries?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}&author=${comm.authorId}`}
                className="block p-3 rounded-xl border border-border/80 bg-inner-card/40 hover:bg-inner-card hover:border-accents-4 transition-colors space-y-1.5 group/comm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground font-serif">
                    {comm.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-inner-card border border-border/60 text-accents-5 shrink-0 uppercase">
                    {comm.authorId}
                  </span>
                </div>
                <p className="text-xs text-accents-5 leading-relaxed font-serif line-clamp-3">
                  {comm.contentMarkdown.replace(/^#+\s+/gm, '').slice(0, 260)}...
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-2.5 text-xs text-accents-4 italic">
            {tStudio('noCommentariesForVerse')}
          </div>
        )}
      </div>

      {/* 5. Referencias Cruzadas Canónicas */}
      <div className="space-y-3.5">
        <div className="px-0.5">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-foreground">
            {tStudio('crossReferencesTitle')}
          </span>
        </div>

        <div className="space-y-2">
          {crossReferences.map((ref) => {
            const targetBookTitle = tBooks.has(ref.targetBookAbbr as any)
              ? tBooks(ref.targetBookAbbr as any)
              : ref.targetBookName;
            return (
              <div
                key={ref.id}
                className="p-3 rounded-xl border border-border/80 bg-inner-card/40 hover:bg-inner-card hover:border-accents-4 transition-colors space-y-1.5"
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
                    <ExternalLink className="w-3 h-3 text-accents-4" />
                  </button>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-inner-card border border-border/60 text-accents-5">
                    {ref.relationLabel}
                  </span>
                </div>
                <p className="text-xs text-accents-5 leading-relaxed font-serif italic">
                  «{ref.snippetText}»
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Accesos Directos al Ecosistema Kartex */}
      <div className="space-y-3.5">
        <div className="px-0.5">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-foreground">
            {tStudio('quickAccessTitle')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/study/interlinear?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}`}
            className="h-8 px-2.5 rounded-full border border-border/80 bg-inner-card/60 hover:bg-foreground hover:text-background transition-all text-center text-xs font-mono font-medium text-foreground cursor-pointer flex items-center justify-center truncate"
          >
            <span className="truncate">{tStudio('openInInterlinear')}</span>
          </Link>

          <Link
            href={`/study/parallel?book=${canonicalAbbr}&chapter=${chapter}`}
            className="h-8 px-2.5 rounded-full border border-border/80 bg-inner-card/60 hover:bg-foreground hover:text-background transition-all text-center text-xs font-mono font-medium text-foreground cursor-pointer flex items-center justify-center truncate"
          >
            <span className="truncate">{tStudio('openInParallel')}</span>
          </Link>

          <Link
            href="/study/atlas"
            className="h-8 px-2.5 rounded-full border border-border/80 bg-inner-card/60 hover:bg-foreground hover:text-background transition-all text-center text-xs font-mono font-medium text-foreground cursor-pointer flex items-center justify-center truncate"
          >
            <span className="truncate">{tStudio('openInAtlas')}</span>
          </Link>

          <Link
            href="/study/timeline"
            className="h-8 px-2.5 rounded-full border border-border/80 bg-inner-card/60 hover:bg-foreground hover:text-background transition-all text-center text-xs font-mono font-medium text-foreground cursor-pointer flex items-center justify-center truncate"
          >
            <span className="truncate">{tStudio('openInTimeline')}</span>
          </Link>

          <Link
            href={`/study/commentaries?book=${canonicalAbbr}&chapter=${chapter}&verse=${verseNumber}`}
            className="h-8 px-2.5 rounded-full border border-border/80 bg-inner-card/60 hover:bg-foreground hover:text-background transition-all text-center text-xs font-mono font-medium text-foreground cursor-pointer flex items-center justify-center gap-1.5 truncate"
          >
            <Library className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tStudio('openInCommentaries')}</span>
          </Link>

          <Link
            href="/study/dictionaries"
            className="h-8 px-2.5 rounded-full border border-border/80 bg-inner-card/60 hover:bg-foreground hover:text-background transition-all text-center text-xs font-mono font-medium text-foreground cursor-pointer flex items-center justify-center gap-1.5 truncate"
          >
            <BookMarked className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tStudio('openInDictionaries')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
