'use client';

import React from 'react';
import { useConcordance } from '../hooks/useConcordance';

export const ExhaustiveConcordanceSearch: React.FC = () => {
  const {
    query,
    setQuery,
    selectedTranslation,
    setSelectedTranslation,
    results,
    stats,
    insertOperatorSnippet,
  } = useConcordance();

  const translationsList = [
    { abbr: 'all', name: 'Todas las Versiones' },
    { abbr: 'BHS', name: 'Texto Hebreo Masorético (BHS)' },
    { abbr: 'NA28', name: 'Texto Crítico Griego (NA28)' },
    { abbr: 'NBLA', name: 'Nueva Biblia de las Américas' },
    { abbr: 'NTV', name: 'Nueva Traducción Viviente' },
    { abbr: 'NIV', name: 'New International Version' },
    { abbr: 'RV1909', name: 'Reina-Valera 1909' },
  ];

  const highlightText = (text: string, matchedSpans: string[]) => {
    if (!matchedSpans || matchedSpans.length === 0) return text;

    // Crear expresión regular con escape
    const escapedTerms = matchedSpans
      .filter((s) => s.trim().length > 0)
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escapedTerms.length === 0) return text;

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = escapedTerms.some((term) =>
        part.toLowerCase().includes(term.toLowerCase()),
      );
      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-yellow-400/30 dark:bg-yellow-500/30 text-foreground font-bold px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-5">
      {/* Contenedor del Buscador FTS5 */}
      <div className="p-4 sm:p-5 rounded-xl border border-accents-2 bg-background space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Input principal */}
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={"Escribe operadores FTS5 (ej. 'gracia AND fe', '\"el Verbo\"', 'amor* NOT temor')..."}
              className="w-full px-3.5 py-2.5 pl-9 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground placeholder:text-accents-4 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
            <svg
              className="w-4 h-4 text-blue-500 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Selector de Traducción */}
          <div className="sm:w-56 shrink-0">
            <select
              value={selectedTranslation}
              onChange={(e) => setSelectedTranslation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            >
              {translationsList.map((t) => (
                <option key={t.abbr} value={t.abbr}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Píldoras de Sintaxis FTS5 de Ayuda Rápida */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-accents-4 uppercase font-semibold mr-1">
            Insertar Operador FTS5:
          </span>
          <button
            type="button"
            onClick={() => insertOperatorSnippet('AND')}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 transition-all cursor-pointer font-bold"
          >
            + AND
          </button>
          <button
            type="button"
            onClick={() => insertOperatorSnippet('OR')}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 transition-all cursor-pointer font-bold"
          >
            + OR
          </button>
          <button
            type="button"
            onClick={() => insertOperatorSnippet('NOT')}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer font-bold"
          >
            + NOT
          </button>
          <button
            type="button"
            onClick={() => insertOperatorSnippet('"frase exacta"')}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition-all cursor-pointer font-bold"
          >
            + &quot;Frase Exacta&quot;
          </button>
          <button
            type="button"
            onClick={() => insertOperatorSnippet('patern*')}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer font-bold"
          >
            + comodín*
          </button>
          <button
            type="button"
            onClick={() => insertOperatorSnippet('NEAR/5')}
            className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 transition-all cursor-pointer font-bold"
          >
            + NEAR/5
          </button>
        </div>
      </div>

      {/* Barra de Métricas de Rendimiento SQLite FTS5 */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 rounded-lg bg-accents-1 border border-accents-2 text-[11px] font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {stats.totalResults} {stats.totalResults === 1 ? 'resultado' : 'resultados'}
          </span>
          <span className="text-accents-4">•</span>
          <span className="text-accents-5">
            Tiempo de búsqueda:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
              {stats.executionTimeMs} ms
            </strong>
          </span>
        </div>

        {stats.operatorsUsed.length > 0 && (
          <div className="flex items-center gap-1.5 text-accents-4">
            <span>Operadores activos:</span>
            {stats.operatorsUsed.map((op) => (
              <span
                key={op}
                className="px-1.5 py-0.2 rounded bg-background border border-accents-2 text-[10px] text-foreground font-bold"
              >
                {op}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Versículos Coincidentes */}
      {results.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-accents-2 rounded-xl bg-background">
          <p className="text-xs text-accents-4 font-mono">
            No se encontraron versículos para la consulta indicada. Prueba modificando los operadores o la traducción.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {results.map((verse) => (
            <div
              key={verse.id}
              className="p-4 sm:p-4.5 rounded-xl border border-accents-2 bg-background hover:border-accents-3 transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-accents-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-foreground">
                    {verse.bookName} {verse.chapter}:{verse.verseNumber}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accents-1 text-accents-5 border border-accents-2">
                    {verse.translationAbbr}
                  </span>
                  <span className="text-[10px] font-mono text-accents-4 hidden sm:inline">
                    {verse.category} • {verse.testament}
                  </span>
                </div>
              </div>

              <div className="text-xs text-foreground leading-relaxed">
                {highlightText(verse.text, verse.matchedSpans)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
