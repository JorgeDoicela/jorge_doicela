'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { Verse, ReaderFontSize, ReaderFontFamily } from '../../types';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';


interface LineByLineReadingViewProps {
  verses: Verse[];
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  bookName?: string;
  bookAbbr?: string;
  chapter?: number | null;
  translationAbbr?: string;
}

export const LineByLineReadingView: React.FC<LineByLineReadingViewProps> = ({
  verses,
  fontSize,
  fontFamily,
  bookName,
  bookAbbr,
  chapter,
  translationAbbr,
}) => {
  const t = useTranslations('ReadingView');
  const tBooks = useTranslations('Books');
  const tStudio = useTranslations('Studio');
  const passageContext = useBiblePassageSafe();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const localizedBookName = (() => {
    if (rawAbbr && tBooks.has(rawAbbr as any)) {
      return tBooks(rawAbbr as any);
    }
    const firstVerseBook =
      typeof verses[0]?.book === 'object' && verses[0]?.book !== null
        ? verses[0]?.book.name
        : verses[0]?.book;
    return bookName || firstVerseBook || '';
  })();

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


  return (
    <div className="w-full space-y-3">
      {/* Cabecera compacta editorial */}
      <div className="flex justify-between items-center px-4 py-2 text-xs font-mono text-zinc-400 dark:text-zinc-500">
        <span className="font-medium text-zinc-600 dark:text-zinc-300">
          {localizedBookName} {chapter !== null ? `• ${t('chapter')} ${chapter}` : ''}
        </span>
        <span>{t('versesCountAnalytical', { count: verses.length })}</span>
      </div>

      {/* Lista versículo a versículo en tarjeta elevada */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-[#0a0a0a] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {verses.map((verse) => (
          <div
            key={verse.id}
            className="p-4 sm:p-5 transition-colors duration-150 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 flex items-start gap-4 group"
          >
            {/* Columna con número de versículo */}
            <div className="shrink-0 w-10 text-right pt-0.5">
              <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                {verse.verseNumber}
              </span>
            </div>

            {/* Contenido textual */}
            <div className="flex-1 space-y-1.5">
              <p
                className={`${getFontSizeClass(fontSize)} ${getFontFamilyClass(
                  fontFamily,
                )} text-zinc-800 dark:text-zinc-200 leading-relaxed`}
              >
                {verse.text}
              </p>
            </div>

            {/* Acciones contextuales a la derecha */}
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1">
              {passageContext && (
                <button
                  type="button"
                  onClick={() => {
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
                  }}
                  className="p-1.5 text-xs rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-all cursor-pointer"
                  title={tStudio('toggleInspector')}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleCopyVerse(verse)}
                className="p-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] hover:border-zinc-400 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all cursor-pointer"
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
        ))}
      </div>
    </div>
  );
};
