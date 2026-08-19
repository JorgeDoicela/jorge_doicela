'use client';

import React, { useState } from 'react';
import { VerseComparisonData } from '../types';
import { computeWordDiff, TRANSLATION_APPROACHES } from '../utils/diffEngine';

interface TextualDiffViewerProps {
  comparisonData: VerseComparisonData;
}

export const TextualDiffViewer: React.FC<TextualDiffViewerProps> = ({
  comparisonData,
}) => {
  const [viewMode, setViewMode] = useState<'sideBySide' | 'inline'>('sideBySide');

  const { translationA, translationB, bookName, chapter, verseNumber } =
    comparisonData;

  const diffResult = computeWordDiff(translationA.text, translationB.text);

  const approachA = TRANSLATION_APPROACHES[translationA.abbreviation];
  const approachB = TRANSLATION_APPROACHES[translationB.abbreviation];

  return (
    <div className="space-y-6">
      {/* Barra de métricas y controles */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-accents-1 border border-accents-2">
        <div>
          <div className="text-xs font-mono text-accents-4 uppercase tracking-wider">
            Pasaje Analizado
          </div>
          <div className="text-sm font-semibold text-foreground">
            {bookName} {chapter}:{verseNumber}
          </div>
        </div>

        {/* Medidor de similitud léxica */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-mono text-accents-4">
              Similitud Léxica
            </div>
            <div className="text-sm font-bold text-foreground">
              {diffResult.similarityPercentage}%
            </div>
          </div>
          <div className="w-24 h-2 rounded-full bg-accents-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                diffResult.similarityPercentage > 75
                  ? 'bg-emerald-500'
                  : diffResult.similarityPercentage > 45
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${diffResult.similarityPercentage}%` }}
            />
          </div>
        </div>

        {/* Selector de modo visual */}
        <div className="inline-flex p-0.5 rounded-lg bg-background border border-accents-2 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-accents-2 text-foreground font-semibold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            Lado a Lado
          </button>
          <button
            type="button"
            onClick={() => setViewMode('inline')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewMode === 'inline'
                ? 'bg-accents-2 text-foreground font-semibold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            Unificado
          </button>
        </div>
      </div>

      {/* Vista Lado a Lado */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Versión A (Base) */}
          <div className="p-4 rounded-xl border border-accents-2 bg-background space-y-3">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <div>
                <span className="text-xs font-bold text-foreground">
                  {translationA.abbreviation}
                </span>
                <span className="text-xs text-accents-4 ml-1.5 hidden sm:inline">
                  ({translationA.name})
                </span>
              </div>
              {approachA && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${approachA.badgeColor}`}
                >
                  {approachA.philosophy}
                </span>
              )}
            </div>

            <div className="text-sm font-serif leading-relaxed space-x-1">
              {diffResult.tokensA.map((token, idx) => (
                <span
                  key={idx}
                  className={`inline-block ${
                    token.type === 'REMOVED'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-medium px-1 rounded'
                      : 'text-foreground'
                  }`}
                >
                  {token.value}
                </span>
              ))}
            </div>

            {approachA && (
              <p className="text-[11px] text-accents-4 italic pt-1 border-t border-accents-1">
                {approachA.description}
              </p>
            )}
          </div>

          {/* Versión B (Comparada) */}
          <div className="p-4 rounded-xl border border-accents-2 bg-background space-y-3">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <div>
                <span className="text-xs font-bold text-foreground">
                  {translationB.abbreviation}
                </span>
                <span className="text-xs text-accents-4 ml-1.5 hidden sm:inline">
                  ({translationB.name})
                </span>
              </div>
              {approachB && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${approachB.badgeColor}`}
                >
                  {approachB.philosophy}
                </span>
              )}
            </div>

            <div className="text-sm font-serif leading-relaxed space-x-1">
              {diffResult.tokensB.map((token, idx) => (
                <span
                  key={idx}
                  className={`inline-block ${
                    token.type === 'ADDED'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium px-1 rounded'
                      : 'text-foreground'
                  }`}
                >
                  {token.value}
                </span>
              ))}
            </div>

            {approachB && (
              <p className="text-[11px] text-accents-4 italic pt-1 border-t border-accents-1">
                {approachB.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Vista Unificada (Inline Diff) */}
      {viewMode === 'inline' && (
        <div className="p-5 rounded-xl border border-accents-2 bg-background space-y-4">
          <div className="flex items-center justify-between text-xs text-accents-4 border-b border-accents-2 pb-2">
            <span>
              Comparando <strong className="text-foreground">{translationA.abbreviation}</strong> vs{' '}
              <strong className="text-foreground">{translationB.abbreviation}</strong>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2 h-2 rounded bg-amber-500/30 border border-amber-500" />
                Variante {translationA.abbreviation}
              </span>
              <span className="flex items-center gap-1 text-emerald-500">
                <span className="w-2 h-2 rounded bg-emerald-500/30 border border-emerald-500" />
                Variante {translationB.abbreviation}
              </span>
            </div>
          </div>

          <div className="text-sm font-serif leading-loose space-x-1.5">
            {diffResult.inlineTokens.map((token, idx) => {
              if (token.type === 'EQUAL') {
                return (
                  <span key={idx} className="text-foreground">
                    {token.value}
                  </span>
                );
              }
              if (token.type === 'REMOVED') {
                return (
                  <span
                    key={idx}
                    className="bg-amber-500/15 text-amber-600 dark:text-amber-400 line-through px-1 py-0.5 rounded text-xs"
                    title={`Presente solo en ${translationA.abbreviation}`}
                  >
                    {token.value}
                  </span>
                );
              }
              return (
                <span
                  key={idx}
                  className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 underline font-medium px-1 py-0.5 rounded text-xs"
                  title={`Presente solo en ${translationB.abbreviation}`}
                >
                  {token.value}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
