'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';
import { Verse, ReaderFontSize, ReaderFontFamily, VerseHighlightColor } from '../../types';
import { useKartexPassageSafe } from '../../../../entities/passage';
import {
  VerseSelectionToolbar,
  VERSE_HIGHLIGHT_STYLES,
} from '../verse-action-toolbar/VerseSelectionToolbar';

interface LineByLineReadingViewProps {
  verses: Verse[];
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  bookName?: string;
  bookAbbr?: string;
  chapter?: number | null;
  translationAbbr?: string;
  getHighlight?: (bookId: number, chapter: number, verseNumber: number) => VerseHighlightColor | undefined;
  onSetHighlight?: (bookId: number, chapter: number, verseNumber: number, color: VerseHighlightColor) => void;
  onRemoveHighlight?: (bookId: number, chapter: number, verseNumber: number) => void;
}

export const LineByLineReadingView: React.FC<LineByLineReadingViewProps> = ({
  verses,
  fontSize,
  fontFamily,
  bookName,
  bookAbbr,
  chapter,
  translationAbbr,
  getHighlight,
  onSetHighlight,
  onRemoveHighlight,
}) => {
  const t = useTranslations('ReadingView');
  const tBooks = useTranslations('Books');
  const tStudio = useTranslations('Studio');
  const passageContext = useKartexPassageSafe();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>([]);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
  } | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  const rawAbbr =
    bookAbbr ||
    (typeof verses[0]?.book === 'object' && verses[0]?.book !== null
      ? verses[0]?.book.abbreviation
      : undefined);

  // Cerrar toolbar y limpiar selección al cambiar de libro o capítulo
  useEffect(() => {
    setSelectedVerseNumbers([]);
    setToolbarPosition(null);
  }, [chapter, rawAbbr]);

  const localizedBookName = useMemo(() => {
    if (rawAbbr && tBooks.has(rawAbbr as any)) {
      return tBooks(rawAbbr as any);
    }
    const firstVerseBook =
      typeof verses[0]?.book === 'object' && verses[0]?.book !== null
        ? verses[0]?.book.name
        : verses[0]?.book;
    return bookName || firstVerseBook || '';
  }, [rawAbbr, tBooks, verses, bookName]);

  const getFontSizeClass = (size: ReaderFontSize) => {
    switch (size) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'md':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-lg leading-relaxed';
      case 'xl':
        return 'text-xl leading-relaxed';
      default:
        return 'text-base leading-relaxed';
    }
  };

  const getFontFamilyClass = (family: ReaderFontFamily) => {
    return family === 'serif' ? 'font-serif' : 'font-sans';
  };

  const selectedVerses = useMemo(() => {
    return verses.filter((v) => selectedVerseNumbers.includes(v.verseNumber));
  }, [verses, selectedVerseNumbers]);

  const bookIdFallback =
    typeof verses[0]?.book === 'object' && verses[0]?.book !== null
      ? verses[0]?.book.id
      : passageContext?.selectedBookId || 1;

  const sharedHighlightColor = useMemo(() => {
    if (selectedVerses.length === 0) return undefined;
    const colors = selectedVerses.map((v) =>
      getHighlight?.(
        typeof v.book === 'object' && v.book !== null ? v.book.id : bookIdFallback,
        v.chapter,
        v.verseNumber,
      ),
    );
    const first = colors[0];
    return colors.every((c) => c === first) ? first : undefined;
  }, [selectedVerses, getHighlight, bookIdFallback]);

  const handleCopyVerse = (verse: Verse) => {
    const bookTitle = localizedBookName;
    const abbr = verse.translation?.abbreviation || translationAbbr || '';

    const textToCopy = `«${verse.text}» — ${bookTitle} ${verse.chapter}:${verse.verseNumber}${
      abbr ? ` (${abbr})` : ''
    }`;

    void navigator.clipboard.writeText(textToCopy);
    setCopiedId(verse.id);
    if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    copiedTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerseClick = (verse: Verse, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const isAlreadySelected = selectedVerseNumbers.includes(verse.verseNumber);

    let nextSelected: number[];
    if (isAlreadySelected) {
      // Toggle off: deseleccionar
      nextSelected = selectedVerseNumbers.filter((n) => n !== verse.verseNumber);
    } else {
      // Toggle on: sumar a la selección de versículos
      nextSelected = [...selectedVerseNumbers, verse.verseNumber];
    }

    setSelectedVerseNumbers(nextSelected);

    if (nextSelected.length === 0) {
      setToolbarPosition(null);
      passageContext?.clearInspectedVerse();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const placement: 'top' | 'bottom' = rect.top < 90 ? 'bottom' : 'top';
    const top = placement === 'top' ? rect.top - 8 : rect.bottom + 8;
    const left = rect.left + rect.width / 2;

    setToolbarPosition({ top, left, placement });

    const activeVerseNumber = isAlreadySelected
      ? nextSelected[nextSelected.length - 1]
      : verse.verseNumber;
    const activeVerse = verses.find((v) => v.verseNumber === activeVerseNumber) || verse;
    const bId =
      typeof activeVerse.book === 'object' && activeVerse.book !== null
        ? activeVerse.book.id
        : passageContext?.selectedBookId || 1;

    // Sincronizar siempre el versículo seleccionado en el contexto para que el dock móvil o inspector lateral tengan el versículo activo
    passageContext?.setInspectedVerse({
      bookId: bId,
      bookName: localizedBookName,
      chapter: activeVerse.chapter,
      verseNumber: activeVerse.verseNumber,
      text: activeVerse.text,
    });
  };

  const handleOpenExegesis = (verse: Verse) => {
    if (passageContext) {
      const bId =
        typeof verse.book === 'object' && verse.book !== null
          ? verse.book.id
          : passageContext.selectedBookId || 1;
      passageContext.openInspectorWithVerse({
        bookId: bId,
        bookName: localizedBookName,
        chapter: verse.chapter,
        verseNumber: verse.verseNumber,
        text: verse.text,
      });
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Cabecera compacta editorial */}
      <div className="px-3 sm:px-4 py-1.5 text-xs font-mono text-zinc-400 dark:text-zinc-500 sepia:text-[#8C765C]">
        <span className="font-medium text-zinc-700 dark:text-zinc-300 sepia:text-[#2C221E]">
          {localizedBookName} {(chapter ?? verses[0]?.chapter) !== null ? `• ${t('chapter')} ${chapter ?? verses[0]?.chapter}` : ''}
        </span>
      </div>

      {/* Lista versículo a versículo en lienzo continuo */}
      <div className="divide-y divide-border/40 transition-colors duration-200 text-foreground">
        {verses.map((verse) => {
          const bId =
            typeof verse.book === 'object' && verse.book !== null
              ? verse.book.id
              : passageContext?.selectedBookId || 1;

          const highlight = getHighlight?.(bId, verse.chapter, verse.verseNumber);
          const isSelected = selectedVerseNumbers.includes(verse.verseNumber);
          const isInspected =
            (passageContext?.isRightInspectorOpen ?? false) &&
            passageContext?.inspectedVerse?.verseNumber === verse.verseNumber;

          const isAudioActive =
            Boolean(passageContext?.isPlayingAudio) &&
            passageContext?.currentAudioVerse === verse.verseNumber;

          const highlightStyle = highlight ? VERSE_HIGHLIGHT_STYLES[highlight] : null;

          return (
            <div
              key={verse.id}
              data-verse-item="true"
              data-verse-number={verse.verseNumber}
              onClick={(e) => handleVerseClick(verse, e)}
              className={`relative py-3 sm:py-4 px-1 sm:px-3 lg:px-4 transition-colors duration-150 flex items-start gap-2.5 sm:gap-4 group cursor-pointer border-l-2 ${
                isAudioActive
                  ? 'bg-foreground/5 dark:bg-white/10 sepia:bg-[#8C765C]/15 border-foreground'
                  : isSelected
                  ? 'border-foreground'
                  : 'border-transparent hover:bg-zinc-500/5 sepia:hover:bg-[#F4ECE0]/60'
              }`}
            >
              {/* Columna con número de versículo compacta y ergonómica */}
              <div className="shrink-0 w-6 sm:w-8 text-right pt-0.5 select-none">
                <span
                  className={`font-mono text-xs select-none transition-colors ${
                    isSelected
                      ? 'font-bold text-zinc-950 dark:text-zinc-50 sepia:text-[#1F1713] underline decoration-dotted decoration-2 underline-offset-[2px] decoration-zinc-800/80 dark:decoration-zinc-200/80 sepia:decoration-[#6B533E]/90'
                      : 'text-zinc-400 dark:text-zinc-500 sepia:text-[#8C765C] font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100 sepia:group-hover:text-[#2C221E]'
                  }`}
                >
                  {verse.verseNumber}
                </span>
              </div>

              {/* Contenido textual que aprovecha todo el ancho disponible */}
              <div className="flex-1 min-w-0 pr-1 sm:group-hover:pr-14 transition-[padding] duration-150">
                <p
                  className={`${getFontSizeClass(fontSize)} ${getFontFamilyClass(fontFamily)} ${
                    highlightStyle
                      ? `${highlightStyle.bgClass} px-2 py-0.5 rounded-md sm:rounded-lg`
                      : 'text-zinc-800 dark:text-zinc-200 sepia:text-[#2C221E]'
                  } ${
                    isSelected
                      ? 'underline decoration-dotted decoration-2 underline-offset-[4px] decoration-zinc-800/80 dark:decoration-zinc-200/80 sepia:decoration-[#6B533E]/90'
                      : ''
                  } leading-relaxed selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 sepia:selection:bg-[#EADAB8] sepia:selection:text-[#2C221E]`}
                >
                  {verse.text}
                </p>
              </div>

              {/* Acciones contextuales flotantes en hover en desktop */}
              <div className="absolute right-2 sm:right-3 top-2.5 sm:top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hidden sm:flex items-center gap-1 bg-card-bg/95 backdrop-blur-xs p-0.5 rounded-lg border border-border/60 shadow-xs">
                {passageContext && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenExegesis(verse);
                    }}
                    className="p-1.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-foreground transition-all cursor-pointer"
                    title={tStudio('toggleInspector')}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyVerse(verse);
                  }}
                  className="p-1.5 text-xs rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
                  title={t('copyVerseTooltip')}
                >
                  {copiedId === verse.id ? (
                    <span className="text-[10px] text-emerald-500 font-mono px-1">{t('copied')}</span>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra flotante de acciones unificada para los versículos seleccionados */}
      {selectedVerses.length > 0 && toolbarPosition && (
        <VerseSelectionToolbar
          verses={selectedVerses}
          bookName={localizedBookName}
          translationAbbr={translationAbbr}
          currentColor={sharedHighlightColor}
          onSetHighlight={(color) => {
            selectedVerses.forEach((v) => {
              const bId =
                typeof v.book === 'object' && v.book !== null
                  ? v.book.id
                  : passageContext?.selectedBookId || 1;
              onSetHighlight?.(bId, v.chapter, v.verseNumber, color);
            });
          }}
          onRemoveHighlight={() => {
            selectedVerses.forEach((v) => {
              const bId =
                typeof v.book === 'object' && v.book !== null
                  ? v.book.id
                  : passageContext?.selectedBookId || 1;
              onRemoveHighlight?.(bId, v.chapter, v.verseNumber);
            });
          }}
          onOpenExegesis={() => handleOpenExegesis(selectedVerses[0])}
          onClose={() => {
            setSelectedVerseNumbers([]);
            setToolbarPosition(null);
          }}
          position={toolbarPosition}
        />
      )}
    </div>
  );
};

