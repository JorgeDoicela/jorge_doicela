'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Verse, ReaderFontSize, ReaderFontFamily } from '../../types';

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
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const rawAbbr =
    bookAbbr ||
    (typeof verses[0]?.book === 'object' && verses[0]?.book !== null
      ? verses[0]?.book.abbreviation
      : undefined);

  const localizedBookName = (() => {
    if (rawAbbr) {
      try {
        const translated = tBooks(rawAbbr as any);
        if (translated) return translated;
      } catch {
        // fallback
      }
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
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2">
      {/* Cabecera compacta */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-accents-2 text-xs font-mono text-accents-4">
        <span>
          {localizedBookName} {chapter !== null ? `• ${t('chapter')} ${chapter}` : ''}
        </span>
        <span>{t('versesCountAnalytical', { count: verses.length })}</span>
      </div>

      {/* Lista versículo a versículo */}
      <div className="divide-y divide-accents-2 border border-accents-2 rounded-xl bg-background overflow-hidden shadow-xs">
        {verses.map((verse) => (
          <div
            key={verse.id}
            className="p-4 sm:p-5 transition-colors duration-150 hover:bg-accents-1/40 flex items-start gap-4 group"
          >
            {/* Columna con número de versículo */}
            <div className="shrink-0 w-10 text-right pt-0.5">
              <span className="font-mono text-xs font-semibold text-accents-5 group-hover:text-foreground">
                {verse.verseNumber}
              </span>
            </div>

            {/* Contenido textual */}
            <div className="flex-1 space-y-1.5">
              <p
                className={`${getFontSizeClass(fontSize)} ${getFontFamilyClass(
                  fontFamily,
                )} text-foreground/90 leading-relaxed`}
              >
                {verse.text}
              </p>
            </div>

            {/* Acciones contextuales a la derecha */}
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleCopyVerse(verse)}
                className="p-1.5 text-xs rounded-md border border-accents-2 bg-background hover:border-foreground text-accents-5 hover:text-foreground transition-all cursor-pointer"
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
