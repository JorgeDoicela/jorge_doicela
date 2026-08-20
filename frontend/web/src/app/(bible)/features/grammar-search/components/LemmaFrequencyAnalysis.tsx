'use client';

import React from 'react';
import { useLemmaFrequency } from '../hooks/useLemmaFrequency';
import { CanonicalScatterPlot } from './CanonicalScatterPlot';

export const LemmaFrequencyAnalysis: React.FC = () => {
  const {
    selectedLemmaId,
    setSelectedLemmaId,
    searchQuery,
    setSearchQuery,
    scale,
    setScale,
    availableLemmas,
    activeLemmaData,
  } = useLemmaFrequency();

  const isHebrew = activeLemmaData
    ? activeLemmaData.language === 'Hebreo' || activeLemmaData.language === 'Arameo'
    : false;

  if (!activeLemmaData) {
    return (
      <div className="p-8 text-center rounded-xl border border-accents-2 bg-background space-y-2">
        <h3 className="text-sm font-semibold text-foreground">
          Análisis de Raíz & Scatter Plot Canónico
        </h3>
        <p className="text-xs text-accents-4 max-w-md mx-auto">
          Utiliza el buscador morfológico o realiza consultas léxicas para visualizar la distribución cuantitativa de lemas a lo largo de los 66 libros de la Biblia.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Buscador y Selector de Lemas / Raíces */}
      <div className="p-4 sm:p-5 rounded-xl border border-accents-2 bg-background space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar Lema (ej. logos, bara, agapao, pistis, chesed, G3056, H1254)..."
              className="w-full px-3.5 py-2 pl-9 rounded-lg text-xs bg-accents-1 border border-accents-2 text-foreground placeholder:text-accents-4 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <svg
              className="w-4 h-4 text-accents-4 absolute left-3 top-2.5"
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

          <div className="text-[11px] font-mono text-accents-4 shrink-0">
            {availableLemmas.length} lemas disponibles
          </div>
        </div>

        {/* Carrusel de Lemas rápidos */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {availableLemmas.map((item) => {
            const isSelected = selectedLemmaId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedLemmaId(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-500 shadow-xs'
                    : 'bg-accents-1 hover:bg-accents-2 text-foreground border-accents-2'
                }`}
              >
                <span className="font-serif font-bold text-sm">{item.originalScript}</span>
                <span className="text-[10px] font-mono opacity-80">({item.transliteration})</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-background text-accents-5'
                  }`}
                >
                  {item.strong}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner Principal del Lema Activo */}
      <div className="p-5 sm:p-6 rounded-xl border border-accents-2 bg-gradient-to-br from-background via-background to-accents-1 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span
                dir={isHebrew ? 'rtl' : 'ltr'}
                className={`text-3xl sm:text-4xl font-bold font-serif ${
                  isHebrew
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                {activeLemmaData.originalScript}
              </span>
              <span className="text-sm font-mono text-accents-5 italic">
                /{activeLemmaData.transliteration}/
              </span>
              <span className="text-xs font-mono text-accents-4">
                {activeLemmaData.ipa}
              </span>
            </div>
            <p className="text-xs text-accents-5 max-w-xl">
              <span className="font-semibold text-foreground">Significado exegético:</span>{' '}
              &quot;{activeLemmaData.primaryGloss}&quot;
            </p>
            {activeLemmaData.rootFamily && (
              <p className="text-[11px] font-mono text-accents-4">
                {activeLemmaData.rootFamily}
              </p>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
              {activeLemmaData.strong}
            </span>
            <span className="text-[11px] font-mono text-accents-4">
              {activeLemmaData.partOfSpeech} • {activeLemmaData.language}
            </span>
          </div>
        </div>

        {/* 4 Tarjetas de Métricas Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* 1. Total Ocurrencias */}
          <div className="p-3.5 rounded-lg bg-background border border-accents-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 mb-1">
              Ocurrencias Totales
            </div>
            <div className="text-xl font-bold text-foreground">
              {activeLemmaData.totalOccurrences}
            </div>
            <div className="text-[10px] text-accents-5 font-mono">
              en los 66 libros canónicos
            </div>
          </div>

          {/* 2. Distribución Testamental */}
          <div className="p-3.5 rounded-lg bg-background border border-accents-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 mb-1">
              Testamentos
            </div>
            <div className="text-sm font-bold text-foreground">
              AT: {activeLemmaData.otOccurrences} • NT: {activeLemmaData.ntOccurrences}
            </div>
            <div className="text-[10px] text-accents-5 font-mono">
              {activeLemmaData.language === 'Griego'
                ? 'Exclusivo del Nuevo Testamento'
                : 'Exclusivo del Antiguo Testamento'}
            </div>
          </div>

          {/* 3. Libro de Mayor Concentración */}
          <div className="p-3.5 rounded-lg bg-background border border-accents-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 mb-1">
              Pico de Frecuencia
            </div>
            <div className="text-sm font-bold text-foreground truncate">
              {activeLemmaData.peakBook.bookName} ({activeLemmaData.peakBook.bookAbbr})
            </div>
            <div className="text-[10px] text-blue-500 font-mono font-semibold">
              {activeLemmaData.peakBook.count} veces ({activeLemmaData.peakBook.percentage}% del total)
            </div>
          </div>

          {/* 4. Género Literario Predominante */}
          <div className="p-3.5 rounded-lg bg-background border border-accents-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 mb-1">
              Género Principal
            </div>
            <div className="text-sm font-bold text-foreground">
              {Object.entries(activeLemmaData.distributionByGenre).reduce((a, b) =>
                b[1] > a[1] ? b : a,
              )[0]}
            </div>
            <div className="text-[10px] text-accents-5 font-mono">
              Mayor densidad teológica
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Dispersión Canónico (Scatter Plot) */}
      <CanonicalScatterPlot
        lemmaData={activeLemmaData}
        scale={scale}
        onToggleScale={setScale}
      />

      {/* Versículos Clave de Muestra */}
      <div className="p-4 sm:p-5 rounded-xl border border-accents-2 bg-background space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
          Pasajes Exegéticos Clave con &quot;{activeLemmaData.originalScript}&quot;
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeLemmaData.sampleVerses.map((verse, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-accents-2 bg-accents-1/40 hover:bg-accents-1 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground">
                  {verse.reference}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  {verse.wordInContext}
                </span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">
                {verse.spanishText}
              </p>
              <div className="text-[11px] text-accents-4 italic font-mono">
                Glosa contextual: &quot;{verse.gloss}&quot;
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
