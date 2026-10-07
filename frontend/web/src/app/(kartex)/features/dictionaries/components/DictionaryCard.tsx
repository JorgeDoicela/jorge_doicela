'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  BookMarked,
  Tag,
  BookOpen,
  Sparkles,
  ExternalLink,
  Layers,
  Compass,
} from 'lucide-react';
import { BibleDictionaryEntry, BibleDictionary } from '../types';

interface DictionaryCardProps {
  entry: BibleDictionaryEntry;
  dictionary?: BibleDictionary | null;
  isSelected?: boolean;
  onSelect?: () => void;
  onSelectRelatedTerm?: (term: string) => void;
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
  const categoryConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    theology: {
      label: tDict('catTheology'),
      bg: 'bg-purple-500/10 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500/20',
    },
    person: {
      label: tDict('catPerson'),
      bg: 'bg-blue-500/10 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-500/20',
    },
    place: {
      label: tDict('catPlace'),
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/20',
    },
    artifact: {
      label: tDict('catArtifact'),
      bg: 'bg-amber-500/10 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/20',
    },
    custom: {
      label: tDict('catCustom'),
      bg: 'bg-rose-500/10 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-500/20',
    },
    flora_fauna: {
      label: tDict('catFloraFauna'),
      bg: 'bg-teal-500/10 dark:bg-teal-950/30',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-500/20',
    },
  };

  const currentCat = categoryConfig[entry.category] || {
    label: entry.category,
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    border: 'border-zinc-200 dark:border-zinc-700',
  };

  return (
    <article
      onClick={onSelect}
      className={`group relative p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-amber-500/5 dark:bg-zinc-900/90 border-amber-500/60 dark:border-amber-500/60 shadow-lg shadow-amber-500/5 dark:shadow-black/40 ring-1 ring-amber-500/40'
          : 'bg-white dark:bg-[#121214] border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xs'
      }`}
    >
      {/* Cabecera de la Entrada */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${currentCat.bg} ${currentCat.text} ${currentCat.border}`}
          >
            <Tag className="w-3 h-3" />
            {currentCat.label}
          </span>
          {dictionary && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
              <BookMarked className="w-3 h-3 text-zinc-400" />
              {dictionary.author} ({dictionary.year})
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
          {tDict('letterBadge', { letter: entry.letter })}
        </span>
      </div>

      {/* Término Principal */}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2 font-serif leading-snug">
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
              <div key={idx} className="pl-4 border-l-2 border-amber-500/30 space-y-1.5 text-zinc-700 dark:text-zinc-300">
                {paragraph.split('\n').map((line, lIdx) => (
                  <p key={lIdx} className="leading-relaxed">
                    {line.replace(/^(\* |\d+\. )/, '')}
                  </p>
                ))}
              </div>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Citas Bíblicas y Términos Relacionados en el pie de la tarjeta */}
      {(entry.biblicalReferences?.length || entry.relatedTerms?.length) ? (
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
          {/* Citas Bíblicas */}
          {entry.biblicalReferences && entry.biblicalReferences.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-zinc-400 mr-1 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-amber-500" />
                {tDict('citationsLabel')}
              </span>
              {entry.biblicalReferences.map((ref, rIdx) => (
                <span
                  key={rIdx}
                  title={ref.context}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20"
                >
                  {ref.reference}
                </span>
              ))}
            </div>
          )}

          {/* Términos Relacionados */}
          {entry.relatedTerms && entry.relatedTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-zinc-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-zinc-400" />
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
                  className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer"
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
