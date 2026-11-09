'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

import { Verse, Pericope, ReaderFontSize, ReaderFontFamily, VerseHighlightColor } from '../../types';
import { getReaderFontClass } from '../../config/readerFonts';
import { normalizeFontSizeToPx } from '../../config/readerFontSize';
import { useKartexPassageSafe } from '../../../../entities/passage';
import { mobileSheetCoordinator } from '../../../../shared/ui';
import {
  VerseSelectionToolbar,
  VERSE_HIGHLIGHT_STYLES,
} from '../verse-action-toolbar/VerseSelectionToolbar';

interface ContinuousReadingViewProps {
  verses: Verse[];
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  showVerseNumbers: boolean;
  pericopes?: Pericope[];
  showPericopes?: boolean;
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
  pericopes = [],
  showPericopes = true,
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
  const locale = useLocale();
  const isEn = locale === 'en';
  const pericopesByStartVerse = useMemo(() => {
    const map = new Map<number, Pericope>();
    if (pericopes && Array.isArray(pericopes)) {
      for (const p of pericopes) {
        map.set(p.startVerse, p);
      }
    }
    return map;
  }, [pericopes]);


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

  // Cerrar toolbar y limpiar selección al cambiar de pasaje o abrir paneles laterales en móvil
  useEffect(() => {
    setSelectedVerseNumbers([]);
    setToolbarPosition(null);
  }, [chapter, rawAbbr, passageContext?.isLeftSidebarOpen, passageContext?.isRightInspectorOpen]);

  // Desplazamiento automático y animación visual al versículo objetivo (seleccionado o vía URL)
  useEffect(() => {
    const targetVerseNum = passageContext?.selectedVerse;
    if (targetVerseNum && verses.length > 0) {
      const timer = setTimeout(() => {
        const verseEl = document.querySelector(`[data-verse-number="${targetVerseNum}"]`);
        if (verseEl) {
          verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          verseEl.classList.remove('verse-target-pulse');
          void (verseEl as HTMLElement).offsetWidth;
          verseEl.classList.add('verse-target-pulse');
          setTimeout(() => {
            verseEl.classList.remove('verse-target-pulse');
          }, 2200);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [passageContext?.selectedVerse, verses, chapter]);

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

  const fontSizePx = normalizeFontSizeToPx(fontSize);

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

  // Reiniciar selección al cambiar de capítulo o libro
  useEffect(() => {
    setSelectedVerseNumbers([]);
    setToolbarPosition(null);
  }, [chapter, passageContext?.selectedBookId, passageContext?.selectedChapter]);

  const handleVerseClick = (verse: Verse, e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    // En pantallas móviles (< 1024px), cerrar cualquier otra lámina abierta (sidebar, audio, tipografía)
    // para que la barra de acciones de versículo tenga exclusión mutua limpia
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      mobileSheetCoordinator.dismissAllExcept('kartex-verse-action-sheet');
    }
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
    setSelectedVerseNumbers([]);
    setToolbarPosition(null);
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

  const currentChapterNum = chapter ?? verses[0]?.chapter ?? 1;
  const isFirstChapter = currentChapterNum === 1;

  return (
    <article className="w-full text-foreground relative py-3 sm:py-6 px-0.5 sm:px-2 md:px-4 print:p-0 print:m-0 print:bg-transparent transition-colors duration-200">
      {/* Cabecera Editorial del Libro (Exclusiva del Capítulo 1) */}
      {isFirstChapter && (
        <header className="text-center pb-2 mb-6 sm:mb-8 select-none">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {localizedBookTitle}
          </h2>
        </header>
      )}

      {/* Prosa Continua en Ancho Completo */}
      <div
        style={{
          fontSize: `${fontSizePx}px`,
          lineHeight: 1.75,
        }}
        className={`w-full ${!isFirstChapter ? 'pt-6 sm:pt-10' : ''} ${getReaderFontClass(
          fontFamily,
        )} text-zinc-800 dark:text-zinc-200 sepia:text-[#2C221E] select-text selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 sepia:selection:bg-[#EADAB8] sepia:selection:text-[#2C221E]`}
      >
        <p className="space-x-1 text-justify sm:text-left">
          {verses.map((verse, idx) => {
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
            const verseKey = verse.id
              ? `crv_verse_${verse.id}`
              : `crv_verse_${bId}_${verse.chapter || currentChapterNum}_${verse.verseNumber || idx + 1}_${idx}`;

            return (
              <React.Fragment key={verseKey}>
                {/* Subtítulo Temático (Perícopa) */}
                {showPericopes && pericopesByStartVerse.has(verse.verseNumber) && (
                  idx === 0 ? (
                    <span className="block w-full pb-3.5 mb-2 text-left select-none clear-both">
                      <span className={`block text-base sm:text-lg ${getReaderFontClass(fontFamily)} font-bold italic tracking-tight text-zinc-900 dark:text-zinc-100 sepia:text-[#2C221E]`}>
                        {isEn && pericopesByStartVerse.get(verse.verseNumber)?.titleEn
                          ? pericopesByStartVerse.get(verse.verseNumber)!.titleEn
                          : pericopesByStartVerse.get(verse.verseNumber)!.title}
                      </span>
                    </span>
                  ) : (
                    <span className="block w-full pt-6 pb-2.5 my-3 text-left select-none clear-both border-t border-border/30">
                      <span className={`block text-base sm:text-lg ${getReaderFontClass(fontFamily)} font-bold italic tracking-tight text-zinc-900 dark:text-zinc-100 sepia:text-[#2C221E]`}>
                        {isEn && pericopesByStartVerse.get(verse.verseNumber)?.titleEn
                          ? pericopesByStartVerse.get(verse.verseNumber)!.titleEn
                          : pericopesByStartVerse.get(verse.verseNumber)!.title}
                      </span>
                    </span>
                  )
                )}

                {/* Número Capitular Editorial al inicio de cada capítulo (Drop-cap estilizado de 3 líneas) */}
                {idx === 0 && (
                  <span
                    className={`float-left ${getReaderFontClass(
                      fontFamily,
                    )} text-7xl sm:text-8xl font-medium text-foreground mr-4 sm:mr-5 mt-0.5 sm:mt-1 mb-2 select-none leading-none tracking-tight`}
                    title={`${t('chapter')} ${currentChapterNum}`}
                    aria-label={`${t('chapter')} ${currentChapterNum}`}
                  >
                    {currentChapterNum}
                  </span>
                )}
                <span
                  data-verse-item="true"
                  data-verse-number={verse.verseNumber}
                  onClick={(e) => handleVerseClick(verse, e)}
                  className={`inline [box-decoration-break:clone] px-1.5 py-[2px] rounded-md sm:rounded-lg relative group cursor-pointer transition-all duration-150 ${
                  isAudioActive
                    ? `${highlightStyle ? highlightStyle.bgClass : ''} ring-1 ring-foreground/35`
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
            </React.Fragment>
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
      <div className="pt-6 mt-6 text-center">
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
