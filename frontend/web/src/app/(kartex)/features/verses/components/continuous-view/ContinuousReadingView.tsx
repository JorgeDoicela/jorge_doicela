'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Verse, ReaderFontSize, ReaderFontFamily, VerseHighlightColor } from '../../types';
import { useKartexPassageSafe } from '../../../../entities/passage';
import {
  VerseSelectionToolbar,
  VERSE_HIGHLIGHT_STYLES,
} from '../verse-action-toolbar/VerseSelectionToolbar';

interface ContinuousReadingViewProps {
  verses: Verse[];
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  showVerseNumbers: boolean;
  bookName?: string;
  bookAbbr?: string;
  chapter?: number | null;
  translationName?: string;
  translationAbbr?: string;
  getHighlight?: (bookId: number, chapter: number, verseNumber: number) => VerseHighlightColor | undefined;
  onSetHighlight?: (bookId: number, chapter: number, verseNumber: number, color: VerseHighlightColor) => void;
  onRemoveHighlight?: (bookId: number, chapter: number, verseNumber: number) => void;
}

export const ContinuousReadingView: React.FC<ContinuousReadingViewProps> = ({
  verses,
  fontSize,
  fontFamily,
  showVerseNumbers,
  bookName,
  bookAbbr,
  chapter,
  translationName,
  translationAbbr,
  getHighlight,
  onSetHighlight,
  onRemoveHighlight,
}) => {
  const t = useTranslations('ReadingView');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();

  const [selectedVerseNumbers, setSelectedVerseNumbers] = useState<number[]>([]);
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
    placement?: 'top' | 'bottom';
  } | null>(null);

  const rawAbbr =
    bookAbbr ||
    (typeof verses[0]?.book === 'object' && verses[0]?.book !== null
      ? verses[0]?.book.abbreviation
      : undefined);

  // Cerrar toolbar y limpiar selección al cambiar de pasaje
  useEffect(() => {
    setSelectedVerseNumbers([]);
    setToolbarPosition(null);
  }, [chapter, rawAbbr]);

  const localizedBookTitle = useMemo(() => {
    if (rawAbbr && tBooks.has(rawAbbr as any)) {
      return tBooks(rawAbbr as any);
    }
    const firstVerseBook =
      typeof verses[0]?.book === 'object' && verses[0]?.book !== null
        ? verses[0]?.book.name
        : verses[0]?.book;
    return bookName || firstVerseBook || 'Génesis';
  }, [rawAbbr, tBooks, verses, bookName]);

  const getFontSizeClass = (size: ReaderFontSize) => {
    switch (size) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'md':
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      case 'lg':
        return 'text-xl sm:text-2xl leading-loose';
      case 'xl':
        return 'text-2xl sm:text-3xl leading-loose';
      default:
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
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
      bookName: localizedBookTitle,
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
        bookName: localizedBookTitle,
        chapter: verse.chapter,
        verseNumber: verse.verseNumber,
        text: verse.text,
      });
    }
  };

  return (
    <article className="w-full text-foreground relative py-3 sm:py-6 px-0.5 sm:px-2 md:px-4 print:p-0 print:m-0 print:bg-transparent transition-colors duration-200">
      {/* Cabecera Editorial del Capítulo */}
      <header className="text-center pb-6 mb-8 border-b border-border/40">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {localizedBookTitle}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          {(chapter ?? verses[0]?.chapter) !== null && (
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 sepia:text-[#8C765C]">
              {t('chapter')} {chapter ?? verses[0]?.chapter}
            </span>
          )}
          {(translationAbbr || translationName) && (
            <>
              <span className="select-none text-zinc-300 dark:text-zinc-700 sepia:text-[#D4C3A3]">•</span>
              <span className="text-xs font-mono font-medium tracking-wider text-zinc-400 dark:text-zinc-500 sepia:text-[#8C765C]">
                {translationAbbr || translationName}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Prosa Continua en Ancho Completo */}
      <div
        className={`w-full ${getFontSizeClass(fontSize)} ${getFontFamilyClass(
          fontFamily,
        )} text-zinc-800 dark:text-zinc-200 sepia:text-[#2C221E] select-text leading-relaxed sm:leading-loose selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 sepia:selection:bg-[#EADAB8] sepia:selection:text-[#2C221E]`}
      >
        <p className="space-x-1 text-justify sm:text-left">
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
              <span
                key={verse.id}
                data-verse-item="true"
                data-verse-number={verse.verseNumber}
                onClick={(e) => handleVerseClick(verse, e)}
                className={`inline [box-decoration-break:clone] px-1.5 py-[2px] rounded-md sm:rounded-lg relative group cursor-pointer transition-all duration-150 ${
                  isAudioActive
                    ? 'bg-foreground/10 dark:bg-white/15 sepia:bg-[#8C765C]/20 ring-1 ring-foreground/30 shadow-2xs'
                    : highlightStyle
                    ? highlightStyle.bgClass
                    : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-900/50 sepia:hover:bg-[#F4ECE0]/60'
                }`}
              >
                {showVerseNumbers && (
                  <sup
                    className={`font-mono text-[10px] select-none mr-1.5 ml-0.5 align-super transition-colors ${
                      isSelected
                        ? 'font-bold text-zinc-900 dark:text-zinc-100 sepia:text-[#2C221E] underline decoration-dotted decoration-2 underline-offset-[2px] decoration-zinc-800/80 dark:decoration-zinc-200/80 sepia:decoration-[#6B533E]/90'
                        : highlightStyle
                        ? 'font-bold text-zinc-900 dark:text-zinc-100 sepia:text-[#2C221E]'
                        : 'text-zinc-400/80 dark:text-zinc-500 sepia:text-[#8C765C] font-semibold group-hover:text-zinc-900 dark:group-hover:text-zinc-100 sepia:group-hover:text-[#2C221E]'
                    }`}
                    title={t('verseTooltip', { number: verse.verseNumber })}
                  >
                    {verse.verseNumber}
                  </sup>
                )}
                <span
                  className={
                    isSelected
                      ? 'underline decoration-dotted decoration-2 underline-offset-[4px] decoration-zinc-800/80 dark:decoration-zinc-200/80 sepia:decoration-[#6B533E]/90'
                      : ''
                  }
                >
                  {verse.text}{' '}
                </span>
              </span>
            );
          })}
        </p>
      </div>

      {/* Barra flotante de acciones unificada para los versículos seleccionados */}
      {selectedVerses.length > 0 && toolbarPosition && (
        <VerseSelectionToolbar
          verses={selectedVerses}
          bookName={localizedBookTitle}
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

      {/* Nota de Atribución Legal Oficial */}
      <div className="pt-8 mt-8 border-t border-border/60 text-center">
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 sepia:text-[#8C765C] font-mono leading-relaxed max-w-xl mx-auto">
          {translationAbbr === 'NBLA' && t('legalNotices.NBLA')}
          {translationAbbr === 'NTV' && t('legalNotices.NTV')}
          {translationAbbr === 'NIV' && t('legalNotices.NIV')}
          {translationAbbr === 'BHS' && t('legalNotices.BHS')}
          {translationAbbr === 'NA28' && t('legalNotices.NA28')}
          {translationAbbr === 'RV1909' && t('legalNotices.RV1909')}
          {!['NBLA', 'NTV', 'NIV', 'BHS', 'NA28', 'RV1909'].includes(translationAbbr || '') && t('legalNotices.default')}
        </p>
      </div>
    </article>
  );
};
