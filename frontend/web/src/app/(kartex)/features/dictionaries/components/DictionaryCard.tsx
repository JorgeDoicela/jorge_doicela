'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BibleDictionaryEntry, BibleDictionary } from '../types';

interface DictionaryCardProps {
  entry: BibleDictionaryEntry;
  dictionary?: BibleDictionary | null;
  isSelected?: boolean;
  onSelect?: () => void;
  onSelectRelatedTerm?: (term: string) => void;
}

function renderFormattedText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-zinc-800 dark:text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({
  entry,
  dictionary,
  isSelected = false,
  onSelect,
  onSelectRelatedTerm,
}) => {
  const tDict = useTranslations('Dictionaries');

  // Mapeo accesible y armónico de colores de categorías
  const categoryConfig: Record<string, { label: string; text: string }> = {
    theology: {
      label: tDict('catTheology'),
      text: 'text-purple-600 dark:text-purple-400',
    },
    person: {
      label: tDict('catPerson'),
      text: 'text-blue-600 dark:text-blue-400',
    },
    place: {
      label: tDict('catPlace'),
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    artifact: {
      label: tDict('catArtifact'),
      text: 'text-amber-600 dark:text-amber-400',
    },
    custom: {
      label: tDict('catCustom'),
      text: 'text-rose-600 dark:text-rose-400',
    },
    flora_fauna: {
      label: tDict('catFloraFauna'),
      text: 'text-teal-600 dark:text-teal-400',
    },
  };

  const currentCat = categoryConfig[entry.category] || {
    label: entry.category,
    text: 'text-zinc-600 dark:text-zinc-400',
  };

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
          <span className={`font-semibold ${currentCat.text}`}>
            {currentCat.label}
          </span>
          {dictionary && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700 select-none">·</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                {dictionary.author} ({dictionary.year})
              </span>
            </>
          )}
        </div>
        <span className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
          {tDict('letterBadge', { letter: entry.letter })}
        </span>
      </div>

      {/* Término Principal */}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors mb-2 font-serif leading-snug">
        {entry.term}
      </h3>

      {/* Etimología / Raíz */}
      {entry.etymology && (
        <div className="mb-4 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 mr-1.5">
            {tDict('etymology')}:
          </span>
          {entry.etymology}
        </div>
      )}

      {/* Definición en Markdown Formateado */}
      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3 font-serif">
        {entry.definitionMarkdown.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-sm font-sans font-semibold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
                {paragraph.replace('### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('* ') || paragraph.startsWith('1. ')) {
            return (
              <div key={idx} className="pl-4 border-l-2 border-zinc-300 dark:border-zinc-700 space-y-1.5 text-zinc-700 dark:text-zinc-300">
                {paragraph.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="leading-relaxed">
                    {renderFormattedText(line.replace(/^(\* |\d+\. )/, ''))}
                  </p>
                ))}
              </div>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {renderFormattedText(paragraph)}
            </p>
          );
        })}
      </div>

      {/* Citas Bíblicas y Términos Relacionados en el pie de la tarjeta */}
      {(entry.biblicalReferences?.length || entry.relatedTerms?.length) ? (
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          {/* Citas Bíblicas */}
          {entry.biblicalReferences && entry.biblicalReferences.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold mr-0.5">
                {tDict('citationsLabel')}:
              </span>
              {entry.biblicalReferences.map((ref, rIdx) => (
                <span
                  key={rIdx}
                  title={ref.context}
                  className="font-mono text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-700 transition-colors"
                >
                  {ref.reference}
                </span>
              ))}
            </div>
          )}

          {/* Términos Relacionados */}
          {entry.relatedTerms && entry.relatedTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-semibold mr-0.5">
                {tDict('relatedTerms')}:
              </span>
              {entry.relatedTerms.map((term, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRelatedTerm?.(term);
                  }}
                  className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-500"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
};
