'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen, User, Tag, Sparkles } from 'lucide-react';
import { CommentaryEntry, CommentaryAuthor } from '../types';
import { renderLinkedScriptureText, ScriptureClickOptions } from '../utils/bibleReferenceParser';
import { useKartexPassageSafe } from '../../../entities/passage';

interface CommentaryCardProps {
  entry: CommentaryEntry;
  author?: CommentaryAuthor;
  isSelected?: boolean;
  onSelect?: () => void;
  onSelectPassage?: (bookId: number, chapter: number, verse?: number) => void;
  bookName?: string;
}

function renderFormattedText(
  text: string,
  options?: ScriptureClickOptions,
): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {renderLinkedScriptureText(part.slice(2, -2), options)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-zinc-800 dark:text-zinc-200">
          {renderLinkedScriptureText(part.slice(1, -1), options)}
        </em>
      );
    }
    return renderLinkedScriptureText(part, options);
  });
}

export const CommentaryCard: React.FC<CommentaryCardProps> = ({
  entry,
  author,
  isSelected = false,
  onSelect,
  onSelectPassage,
  bookName,
}) => {
  const tComm = useTranslations('Commentaries');
  const passageContext = useKartexPassageSafe();

  const handleSelectPassage = onSelectPassage || passageContext?.setPassage;
  const scriptureOptions: ScriptureClickOptions = {
    onSelectPassage: handleSelectPassage,
  };
  const verseRangeText = entry.verseEnd && entry.verseEnd !== entry.verseStart
    ? `${entry.verseStart}-${entry.verseEnd}`
    : `${entry.verseStart}`;

  return (
    <article
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-amber-500/5 dark:bg-zinc-900/90 border-amber-500/60 dark:border-amber-500/60 shadow-lg shadow-amber-500/5 dark:shadow-black/40 ring-1 ring-amber-500/40'
          : 'bg-white dark:bg-[#121214] border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs'
      }`}
    >
      {/* Cabecera de la tarjeta */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            {bookName || entry.bookId} {entry.chapter}:{verseRangeText}
          </span>
          {author && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
              <User className="w-3 h-3 text-zinc-400" />
              {author.author}
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
          {author?.era || tComm('classicalExegesisFallback')}
        </span>
      </div>

      {/* Título de la Perícopa */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-3 leading-snug">
        {entry.title}
      </h3>

      {/* Cuerpo en Markdown formateado con estilo sobrio */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3 font-serif">
        {entry.contentMarkdown.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm font-sans font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
                {renderFormattedText(paragraph.replace('### ', ''), scriptureOptions)}
              </h4>
            );
          }
          if (paragraph.startsWith('* ') || paragraph.startsWith('1. ')) {
            return (
              <div key={idx} className="pl-4 border-l-2 border-amber-500/30 space-y-1.5 text-zinc-700 dark:text-zinc-300">
                {paragraph.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="leading-relaxed">
                    {renderFormattedText(line.replace(/^(\* |\d+\. )/, ''), scriptureOptions)}
                  </p>
                ))}
              </div>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {renderFormattedText(paragraph, scriptureOptions)}
            </p>
          );
        })}
      </div>

      {/* Tags de clasificación temática */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-1.5">
          <Tag className="w-3 h-3 text-zinc-400 mr-1" />
          {entry.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

