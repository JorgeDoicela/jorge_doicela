'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Sparkles } from 'lucide-react';

import { Verse, ReaderFontSize, ReaderFontFamily } from '../../types';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';

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
}) => {
  const t = useTranslations('ReadingView');
  const tBooks = useTranslations('Books');
  const tStudio = useTranslations('Studio');
  const passageContext = useBiblePassageSafe();
  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);


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

  const handleCopyVerse = (verse: Verse, withCitation: boolean) => {
    const bookTitle =
      typeof verse.book === 'object' && verse.book !== null
        ? verse.book.name
        : verse.book || bookName || '';
    const abbr = verse.translation?.abbreviation || translationAbbr || '';

    const textToCopy = withCitation
      ? `«${verse.text}» — ${bookTitle} ${verse.chapter}:${verse.verseNumber}${
          abbr ? ` (${abbr})` : ''
        }`
      : verse.text;

    void navigator.clipboard.writeText(textToCopy);
    setToastMessage(withCitation ? t('citationCopied') : t('textCopied'));
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2500);
  };  return (
    <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] pt-8 pb-8 px-6 sm:px-10 lg:px-12 relative print:border-none print:shadow-none print:p-0 print:m-0 print:bg-transparent transition-all">
      {/* Toast flotante de confirmación */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-zinc-200/20 animate-fade-in flex items-center gap-2 print:hidden">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Cabecera Editorial del Capítulo */}
      <div className="text-center pb-6 mb-6 border-b border-zinc-100 dark:border-zinc-800/80">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          {localizedBookTitle}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          {chapter !== null && (
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t('chapter')} {chapter}
            </span>
          )}
          {(translationAbbr || translationName) && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">•</span>
              <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500 tracking-wider">
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
        )} text-zinc-800 dark:text-zinc-200 select-text leading-relaxed sm:leading-loose`}
      >
        <p className="space-x-1 text-justify sm:text-left">
          {verses.map((verse) => {
            const isSelected = selectedVerseId === verse.id;
            return (
              <span
                key={verse.id}
                onClick={() => setSelectedVerseId(isSelected ? null : verse.id)}
                className={`inline rounded-md px-1 py-0.5 relative group cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                }`}
              >
                {showVerseNumbers && (
                  <sup
                    className={`font-mono text-[10px] font-semibold select-none mr-1.5 ml-0.5 align-super transition-colors ${
                      isSelected
                        ? 'text-zinc-300 dark:text-zinc-700'
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

      {/* Menú Contextual de Versículo Seleccionado */}
      {selectedVerseId && (
        <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-black rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 animate-fade-in print:hidden">
          {(() => {
            const activeVerse = verses.find((v) => v.id === selectedVerseId);
            if (!activeVerse) return null;
            return (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {bookName} {activeVerse.chapter}:{activeVerse.verseNumber}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[10px]">
                    [{translationAbbr || 'Biblia'}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {passageContext && (
                    <button
                      type="button"
                      onClick={() => {
                        const bId =
                          typeof activeVerse.book === 'object' && activeVerse.book !== null
                            ? activeVerse.book.id
                            : passageContext.selectedBookId || 1;
                        passageContext.openInspectorWithVerse({
                          bookId: bId,
                          bookName: localizedBookTitle,
                          chapter: activeVerse.chapter,
                          verseNumber: activeVerse.verseNumber,
                          text: activeVerse.text,
                        });
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{tStudio('toggleInspector')}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopyVerse(activeVerse, false)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-300 transition-all cursor-pointer"
                  >
                    {t('copyTextOnly')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyVerse(activeVerse, true)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {t('copyWithCitation')}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

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
