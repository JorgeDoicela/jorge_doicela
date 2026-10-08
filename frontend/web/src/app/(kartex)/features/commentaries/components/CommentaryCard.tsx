'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
          ? 'bg-zinc-100/80 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-xs ring-1 ring-zinc-300 dark:ring-zinc-700'
          : 'bg-white dark:bg-[#121214] border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs'
      }`}
    >
      {/* Metadatos Editoriales Limpios (Sin pastillas ni cajas) */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
            {bookName || entry.bookId} {entry.chapter}:{verseRangeText}
          </span>
          {author && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">·</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                {author.author}
              </span>
            </>
          )}
        </div>
        <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
          {author?.era || tComm('classicalExegesisFallback')}
        </span>
      </div>

      {/* Título de la Perícopa */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors mb-3 leading-snug">
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
              <div key={idx} className="pl-4 border-l-2 border-zinc-300 dark:border-zinc-700 space-y-1.5 text-zinc-700 dark:text-zinc-300">
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
        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 dark:text-zinc-500">
          {entry.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

