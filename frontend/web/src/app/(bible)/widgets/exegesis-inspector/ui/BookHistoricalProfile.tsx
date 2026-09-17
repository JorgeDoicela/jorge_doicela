'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Calendar, User, MapPin, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { useBiblePassageSafe } from '../../../shared/context';
import { getBookHistoricalInfo } from '../../../entities/books';

interface BookHistoricalProfileProps {
  bookId?: number | null;
}

export const BookHistoricalProfile: React.FC<BookHistoricalProfileProps> = ({ bookId: propBookId }) => {
  const passageContext = useBiblePassageSafe();
  const tStudio = useTranslations('Studio');
  const tBooks = useTranslations('Books');

  const selectedBook = passageContext?.selectedBook;
  const bookId = propBookId ?? passageContext?.selectedBookId ?? 1;
  const chapter = passageContext?.selectedChapter ?? 1;

  const info = getBookHistoricalInfo(bookId);

  const localizedBookTitle = selectedBook?.abbreviation
    ? (tBooks.has(selectedBook.abbreviation as any) ? tBooks(selectedBook.abbreviation as any) : selectedBook.name)
    : (selectedBook?.name || (tBooks.has('GEN' as any) ? tBooks('GEN' as any) : 'Génesis'));

  if (!info) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500">
        {tStudio('historicalCataloging')}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Cabecera del Perfil Histórico */}
      <div className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/60 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            {info.era}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            {tStudio('chapterShort', { chapter })}
          </span>
        </div>
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {localizedBookTitle}
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
          {info.theologicalTheme}
        </p>
      </div>

      {/* Grid de Metadatos: Autor y Cronología */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-black/60">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mb-1">
            <User className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">{tStudio('author')}</span>
          </div>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{info.author}</span>
        </div>

        <div className="p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-black/60">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">{tStudio('approxDate')}</span>
          </div>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{info.approxDate}</span>
        </div>
      </div>

      {/* Geografía Bíblica y Lugares Clave */}
      {info.keyLocations.length > 0 && (
        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>{tStudio('notableLocations')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {info.keyLocations.map((loc) => (
              <span
                key={loc}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enfoque Ministerial y Apologético */}
      {info.practicalMinisterialFocus && (
        <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{tStudio('ministerialFocus')}</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {info.practicalMinisterialFocus}
          </p>
        </div>
      )}

      {/* Acciones Rápidas de Navegación Cruzada */}
      <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col gap-2">
        <Link
          href={`/study/standard?book=${selectedBook?.abbreviation || 'GEN'}&chapter=${chapter}`}
          className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors flex items-center justify-between group"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{tStudio('readPassageInReader', { book: localizedBookTitle, chapter })}</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
