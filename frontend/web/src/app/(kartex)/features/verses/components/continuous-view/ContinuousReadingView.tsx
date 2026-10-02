'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Verse, ReaderFontSize, ReaderFontFamily, ReaderTone } from '../../types';
import { useKartexPassageSafe } from '../../../../entities/passage';

interface ContinuousReadingViewProps {
  verses: Verse[];
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  readerTone?: ReaderTone;
  showVerseNumbers: boolean;
  bookName?: string;
  bookAbbr?: string;
  chapter?: number | null;
  translationName?: string;
  translationAbbr?: string;
}

export const ContinuousReadingView: React.FC<ContinuousReadingViewProps> = ({
  verses,
  fontSize,
  fontFamily,
  readerTone = 'system',
  showVerseNumbers,
  bookName,
  bookAbbr,
  chapter,
  translationName,
  translationAbbr,
}) => {
  const t = useTranslations('ReadingView');
  const tBooks = useTranslations('Books');
  const passageContext = useKartexPassageSafe();

  const rawAbbr =
    bookAbbr ||
    (typeof verses[0]?.book === 'object' && verses[0]?.book !== null
      ? verses[0]?.book.abbreviation
      : undefined);

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

  const getToneContainerClass = (tone: ReaderTone) => {
    switch (tone) {
      case 'sepia':
        return 'bg-[#FAF6EE] dark:bg-[#1E1A16] border-[#E8DEC8] dark:border-[#382E24] text-[#2C221E] dark:text-[#EAE0D0] shadow-sm';
      case 'dark':
        return 'bg-black border-zinc-800 text-zinc-100 shadow-none';
      case 'system':
      default:
        return 'bg-white dark:bg-[#0a0a0a] border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]';
    }
  };

  const getToneTextClass = (tone: ReaderTone) => {
    switch (tone) {
      case 'sepia':
        return 'text-[#2C221E] dark:text-[#EAE0D0] selection:bg-[#EADAB8] selection:text-[#2C221E]';
      case 'dark':
        return 'text-zinc-200 selection:bg-zinc-800 selection:text-white';
      case 'system':
      default:
        return 'text-zinc-800 dark:text-zinc-200 selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900';
    }
  };

  const getSelectedVerseClass = (tone: ReaderTone) => {
    switch (tone) {
      case 'sepia':
        return 'bg-[#EADAB8]/90 dark:bg-[#382E24] text-[#2C221E] dark:text-[#FAF6EE] ring-1 ring-[#8C765C]/40 font-medium rounded-md shadow-xs';
      case 'dark':
        return 'bg-zinc-800 text-zinc-100 ring-1 ring-zinc-700 font-medium rounded-md shadow-xs';
      case 'system':
      default:
        return 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 ring-1 ring-zinc-300 dark:ring-zinc-700 font-medium rounded-md shadow-xs';
    }
  };

  const isVerseActive = (verse: Verse) => {
    return (
      (passageContext?.isRightInspectorOpen ?? false) &&
      passageContext?.inspectedVerse?.verseNumber === verse.verseNumber
    );
  };

  const handleToggleVerse = (verse: Verse) => {
    if (isVerseActive(verse)) {
      passageContext?.clearInspectedVerse?.();
    } else if (passageContext) {
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
    <div className={`w-full rounded-2xl border pt-8 pb-8 px-6 sm:px-10 lg:px-12 relative print:border-none print:shadow-none print:p-0 print:m-0 print:bg-transparent transition-colors duration-200 ${getToneContainerClass(readerTone)}`}>
      {/* Cabecera Editorial del Capítulo */}
      <div className={`text-center pb-6 mb-6 border-b ${readerTone === 'sepia' ? 'border-[#E8DEC8] dark:border-[#382E24]' : 'border-zinc-100 dark:border-zinc-800/80'}`}>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {localizedBookTitle}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          {chapter !== null && (
            <span className={`text-xs font-mono font-medium uppercase tracking-widest ${readerTone === 'sepia' ? 'text-[#8C765C] dark:text-[#A8947C]' : 'text-zinc-400 dark:text-zinc-500'}`}>
              {t('chapter')} {chapter}
            </span>
          )}
          {(translationAbbr || translationName) && (
            <>
              <span className={`select-none ${readerTone === 'sepia' ? 'text-[#D4C3A3] dark:text-[#524332]' : 'text-zinc-300 dark:text-zinc-700'}`}>•</span>
              <span className={`text-xs font-mono font-medium tracking-wider ${readerTone === 'sepia' ? 'text-[#8C765C] dark:text-[#A8947C]' : 'text-zinc-400 dark:text-zinc-500'}`}>
                {translationAbbr || translationName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Prosa Continua en Ancho Completo */}
      <div
        className={`w-full ${getFontSizeClass(fontSize)} ${getFontFamilyClass(
          fontFamily,
        )} ${getToneTextClass(readerTone)} select-text leading-relaxed sm:leading-loose`}
      >
        <p className="space-x-1 text-justify sm:text-left">
          {verses.map((verse) => {
            const isSelected = isVerseActive(verse);
            return (
              <span
                key={verse.id}
                onClick={() => handleToggleVerse(verse)}
                className={`inline rounded-md px-1 py-0.5 relative group cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? getSelectedVerseClass(readerTone)
                    : 'hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60'
                }`}
              >
                {showVerseNumbers && (
                  <sup
                    className={`font-mono text-[10px] font-semibold select-none mr-1.5 ml-0.5 align-super transition-colors ${
                      isSelected
                        ? 'text-zinc-600 dark:text-zinc-300 font-bold'
                        : 'text-zinc-400/80 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                    }`}
                    title={t('verseTooltip', { number: verse.verseNumber })}
                  >
                    {verse.verseNumber}
                  </sup>
                )}
                <span>{verse.text} </span>
              </span>
            );
          })}
        </p>
      </div>

      {/* Nota de Atribución Legal Oficial */}
      <div className="pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono leading-relaxed max-w-xl mx-auto">
          {translationAbbr === 'NBLA' && t('legalNotices.NBLA')}
          {translationAbbr === 'NTV' && t('legalNotices.NTV')}
          {translationAbbr === 'NIV' && t('legalNotices.NIV')}
          {translationAbbr === 'BHS' && t('legalNotices.BHS')}
          {translationAbbr === 'NA28' && t('legalNotices.NA28')}
          {translationAbbr === 'RV1909' && t('legalNotices.RV1909')}
          {!['NBLA', 'NTV', 'NIV', 'BHS', 'NA28', 'RV1909'].includes(translationAbbr || '') && t('legalNotices.default')}
        </p>
      </div>
    </div>
  );
};
