'use client';

import React, { useState } from 'react';
import { MorphologicalTokenResult } from '../types';

interface MorphologyResultsListProps {
  results: MorphologicalTokenResult[];
}

export const MorphologyResultsList: React.FC<MorphologyResultsListProps> = ({ results }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (token: MorphologicalTokenResult) => {
    const textToCopy = `${token.bookName} ${token.chapter}:${token.verseNumber} - ${token.wordOriginal} (${token.lemma}) [${token.morphologyCode}] "${token.gloss}"`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(token.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (results.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-accents-2 rounded-xl bg-background">
        <svg
          className="w-10 h-10 mx-auto text-accents-4 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          No se encontraron tokens morfológicos
        </h3>
        <p className="text-xs text-accents-5 max-w-md mx-auto">
          Prueba ampliando los criterios de búsqueda (ej. seleccionar &quot;Cualquier Modo&quot; o &quot;Todo el Canon&quot;) o utilizando uno de los presets exegéticos superiores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header de Resultados */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-foreground">
          {results.length} {results.length === 1 ? 'coincidencia morfológica' : 'coincidencias morfológicas'}
        </span>
        <span className="text-[11px] font-mono text-accents-4">
          Orden canónico de las Escrituras
        </span>
      </div>

      {/* Lista de Tarjetas de Exégesis */}
      <div className="grid grid-cols-1 gap-3.5">
        {results.map((token) => {
          const isGreek = token.language === 'Griego';
          const isHebrew = token.language === 'Hebreo' || token.language === 'Arameo';

          return (
            <div
              key={token.id}
              className="p-4 sm:p-5 rounded-xl border border-accents-2 bg-background hover:border-accents-3 transition-all space-y-3.5 shadow-xs"
            >
              {/* Barra superior de la tarjeta */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-accents-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {token.bookName} {token.chapter}:{token.verseNumber}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                    {token.strong}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isGreek
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {token.language}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accents-1 text-accents-5 border border-accents-2 font-bold">
                    {token.morphologyCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(token)}
                    className="p-1 rounded hover:bg-accents-1 text-accents-4 hover:text-foreground transition-colors cursor-pointer"
                    title="Copiar referencia exegética"
                  >
                    {copiedId === token.id ? (
                      <span className="text-[10px] text-emerald-500 font-mono font-bold">¡Copiado!</span>
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

              {/* Contenido Principal: Palabra Original, Lema y Parsing */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Palabra original y Lema */}
                <div className="md:col-span-5 space-y-1">
                  <div className="flex items-baseline gap-2.5">
                    <span
                      dir={isHebrew ? 'rtl' : 'ltr'}
                      className={`text-2xl font-bold tracking-wide ${
                        isHebrew
                          ? 'font-serif text-amber-600 dark:text-amber-400'
                          : 'font-serif text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {token.wordOriginal}
                    </span>
                    <span className="text-xs text-accents-4 font-mono italic">
                      ({token.transliteration})
                    </span>
                  </div>
                  <div className="text-xs text-accents-5 flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">Lema:</span>
                    <span className="font-serif font-bold text-foreground">{token.lemma}</span>
                    <span className="text-accents-4">•</span>
                    <span className="italic text-foreground font-medium">&quot;{token.gloss}&quot;</span>
                  </div>
                </div>

                {/* Desglose gramatical Robinson */}
                <div className="md:col-span-7 p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 mb-0.5">
                    Desglose Morfológico Exegético
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    {token.parsingSummary}
                  </div>
                </div>
              </div>

              {/* Contexto del Versículo Completo */}
              <div className="space-y-1.5 pt-1">
                {/* Texto Original */}
                <div
                  dir={isHebrew ? 'rtl' : 'ltr'}
                  className="text-xs font-serif text-accents-5 leading-relaxed bg-background/50 p-2 rounded border border-accents-1"
                >
                  {token.fullVerseContext.originalText}
                </div>

                {/* Traducción al Español con Glosa */}
                <div className="text-xs text-foreground leading-relaxed pl-2 border-l-2 border-blue-500">
                  {token.fullVerseContext.spanishText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
