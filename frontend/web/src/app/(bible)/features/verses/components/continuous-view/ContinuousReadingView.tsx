'use client';

import React, { useState } from 'react';
import { Verse, ReaderFontSize, ReaderFontFamily } from '../../types';

interface ContinuousReadingViewProps {
  verses: Verse[];
  fontSize: ReaderFontSize;
  fontFamily: ReaderFontFamily;
  showVerseNumbers: boolean;
  bookName?: string;
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
  chapter,
  translationName,
  translationAbbr,
}) => {
  const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    setToastMessage(withCitation ? '¡Cita copiada con formato!' : '¡Texto copiado!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-background rounded-2xl border border-accents-2 p-6 sm:p-10 shadow-xs relative">
      {/* Toast flotante de confirmación */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-foreground text-background text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-accents-2 animate-fade-in flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Cabecera del Capítulo */}
      {(() => {
        const firstVerseBook =
          typeof verses[0]?.book === 'object' && verses[0]?.book !== null
            ? verses[0]?.book.name
            : verses[0]?.book;
        const displayBookTitle = bookName || firstVerseBook || 'Génesis';
        return (
          <div className="text-center pb-6 mb-6 border-b border-accents-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accents-4 block mb-1">
              {translationName || translationAbbr || 'Reina-Valera 1960'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {displayBookTitle}{' '}
              {chapter !== null && (
                <span className="font-mono text-accents-5 font-normal">Capítulo {chapter}</span>
              )}
            </h2>
          </div>
        );
      })()}

      {/* Prosa Continua */}
      <div
        className={`${getFontSizeClass(fontSize)} ${getFontFamilyClass(
          fontFamily,
        )} text-foreground/90 select-text space-y-4`}
      >
        <p className="indent-6">
          {verses.map((verse) => {
            const isSelected = selectedVerseId === verse.id;
            return (
              <span
                key={verse.id}
                onClick={() => setSelectedVerseId(isSelected ? null : verse.id)}
                className={`inline transition-all duration-150 rounded px-1 py-0.5 relative group cursor-pointer ${
                  isSelected
                    ? 'bg-foreground/10 ring-1 ring-foreground/20 text-foreground font-medium'
                    : 'hover:bg-accents-1 hover:text-foreground'
                }`}
              >
                {showVerseNumbers && (
                  <sup
                    className="text-[11px] font-mono font-bold text-accents-5 select-none mr-1.5 opacity-80 group-hover:opacity-100 group-hover:text-foreground align-super"
                    title={`Versículo ${verse.verseNumber}`}
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
        <div className="mt-8 pt-4 border-t border-accents-2 bg-accents-1/50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          {(() => {
            const activeVerse = verses.find((v) => v.id === selectedVerseId);
            if (!activeVerse) return null;
            return (
              <>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-foreground">
                    {bookName} {activeVerse.chapter}:{activeVerse.verseNumber}
                  </span>
                  <span className="text-accents-4 font-mono text-[10px]">
                    [{translationAbbr || 'Biblia'}]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyVerse(activeVerse, false)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-accents-2 bg-background hover:border-foreground text-accents-6 hover:text-foreground transition-all cursor-pointer"
                  >
                    Copiar solo texto
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyVerse(activeVerse, true)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar con Cita
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Nota de Atribución Legal Oficial */}
      <div className="pt-8 mt-8 border-t border-accents-2/60 text-center">
        <p className="text-[11px] text-accents-4 font-mono leading-relaxed max-w-xl mx-auto">
          {translationAbbr === 'NBLA' && 'Nueva Biblia de las Américas ® © 2005 por The Lockman Foundation. Conectada vía API autorizada.'}
          {translationAbbr === 'NTV' && 'Santa Biblia, Nueva Traducción Viviente, © Tyndale House Foundation, 2010. Conectada vía API autorizada.'}
          {translationAbbr === 'NIV' && 'Holy Bible, NEW INTERNATIONAL VERSION ® NIV ® © 1973, 1978, 1984, 2011 by Biblica, Inc. ® Conectada vía API autorizada.'}
          {translationAbbr === 'BHS' && 'Texto Masorético WLC. J. Alan Groves Center / Open Scriptures. Licencia Abierta CC BY 4.0.'}
          {translationAbbr === 'LXX' && 'Septuaginta Griega (LXX - Swete / Rahlfs). Dominio Público Académico.'}
          {!['NBLA', 'NTV', 'NIV', 'BHS', 'LXX'].includes(translationAbbr || '') && 'Texto bíblico para propósitos de estudio y análisis exegético.'}
        </p>
      </div>
    </div>
  );
};
