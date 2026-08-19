'use client';

import React, { useState } from 'react';
import { ChiasmStructure, PoeticColon } from '../types';
import { POETIC_STRUCTURES_DATABASE } from '../data/poeticStructuresData';

export const ChiasmViewer: React.FC = () => {
  const [selectedStructureId, setSelectedStructureId] = useState<string>(
    POETIC_STRUCTURES_DATABASE[0].id,
  );
  const [hoveredColonId, setHoveredColonId] = useState<string | null>(null);
  const [activeColon, setActiveColon] = useState<PoeticColon | null>(null);

  const currentStructure =
    POETIC_STRUCTURES_DATABASE.find((s) => s.id === selectedStructureId) ||
    POETIC_STRUCTURES_DATABASE[0];

  const getIndentPadding = (label: string, isCenter?: boolean) => {
    if (isCenter) return 'pl-10 sm:pl-16 border-l-4 border-amber-500 bg-amber-500/10';
    if (label.startsWith('A')) return 'pl-3 sm:pl-4 border-l-2 border-blue-500/40';
    if (label.startsWith('B')) return 'pl-6 sm:pl-8 border-l-2 border-indigo-500/50';
    if (label.startsWith('C')) return 'pl-8 sm:pl-12 border-l-2 border-purple-500/60';
    if (label.startsWith('D')) return 'pl-10 sm:pl-14 border-l-2 border-emerald-500/70';
    return 'pl-4 border-l border-accents-2';
  };

  const getBadgeStyle = (label: string, isCenter?: boolean) => {
    if (isCenter) return 'bg-amber-500 text-black font-extrabold shadow-sm';
    if (label.startsWith('A')) return 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
    if (label.startsWith('B')) return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
    if (label.startsWith('C')) return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    if (label.startsWith('D')) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    return 'bg-accents-2 text-accents-5 border border-accents-3';
  };

  const isMatchedOrHovered = (colon: PoeticColon) => {
    if (!hoveredColonId) return false;
    if (colon.id === hoveredColonId) return true;
    const hoveredColon = currentStructure.cola.find((c) => c.id === hoveredColonId);
    if (hoveredColon && hoveredColon.matchingPairId === colon.id) return true;
    if (colon.matchingPairId === hoveredColonId) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Selector de Pasaje Poético y Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-accents-2 bg-background shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4 uppercase tracking-wider">
            Pasaje Poético:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POETIC_STRUCTURES_DATABASE.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedStructureId(item.id);
                  setHoveredColonId(null);
                  setActiveColon(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedStructureId === item.id
                    ? 'bg-foreground text-background shadow-xs'
                    : 'bg-accents-1 text-accents-4 hover:text-foreground border border-accents-2'
                }`}
              >
                {item.passageRef} ({item.literaryCategory})
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-accents-4">
          Patrones semíticos y simetría concéntrica
        </div>
      </div>

      {/* Tarjeta de Encabezado y Descripción del Quiasmo */}
      <div className="p-5 sm:p-6 rounded-2xl border border-accents-2 bg-accents-1/30 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            {currentStructure.title}
          </h3>
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-foreground text-background font-bold">
            {currentStructure.passageRef}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
          {currentStructure.description}
        </p>

        {/* Foco Central / Clímax Teológico */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-500 flex items-start gap-2.5">
          <div>
            <strong className="font-semibold block uppercase text-[10px] tracking-wider mb-0.5">
              Clímax Teológico del Quiasmo:
            </strong>
            <p className="text-foreground leading-relaxed">
              {currentStructure.focalMessage}
            </p>
          </div>
        </div>

      </div>

      {/* Visualizador de la Estructura en Anillo / Concéntrica */}
      <div className="p-5 sm:p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-accents-2 pb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accents-4">
            Diagrama de Simetría Concéntrica (Pasa el cursor sobre cada elemento para ver su gemelo):
          </span>
          <span className="text-[11px] font-mono text-accents-4">
            {currentStructure.cola.length} elementos alineados
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {currentStructure.cola.map((colon) => {
            const isHighlight = isMatchedOrHovered(colon);

            return (
              <div
                key={colon.id}
                onMouseEnter={() => {
                  setHoveredColonId(colon.id);
                  setActiveColon(colon);
                }}
                onMouseLeave={() => setHoveredColonId(null)}
                onClick={() => setActiveColon(colon)}
                className={`group p-3.5 sm:p-4 rounded-xl transition-all duration-150 cursor-pointer ${getIndentPadding(
                  colon.label,
                  colon.isFocalCenter,
                )} ${
                  isHighlight
                    ? 'ring-2 ring-amber-500 bg-amber-500/15 shadow-md scale-[1.01]'
                    : 'bg-accents-1/40 hover:bg-accents-1'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Badge de Nivel y Referencia */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${getBadgeStyle(
                          colon.label,
                          colon.isFocalCenter,
                        )}`}
                      >
                        {colon.label}
                      </span>
                      <span className="text-xs font-bold text-foreground">
                        {colon.verseRef}
                      </span>
                      {colon.parallelismType && (
                        <span className="text-[10px] font-mono text-accents-4 px-1.5 py-0.2 rounded bg-accents-1 border border-accents-2">
                          Paralelismo {colon.parallelismType}
                        </span>
                      )}
                    </div>

                    {/* Texto en Español */}
                    <p
                      className={`text-sm sm:text-base font-serif leading-relaxed ${
                        colon.isFocalCenter
                          ? 'font-bold text-foreground text-base sm:text-lg'
                          : 'text-foreground'
                      }`}
                    >
                      «{colon.textSpanish}»
                    </p>

                    {/* Texto Hebreo Masorético Original */}
                    {colon.textHebrew && (
                      <div
                        dir="rtl"
                        lang="he"
                        className="text-base sm:text-lg font-serif text-accents-5 pt-0.5 select-text"
                        style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
                      >
                        {colon.textHebrew}
                      </div>
                    )}
                  </div>
                </div>

                {/* Nota Retórica / Exegética */}
                {colon.theologicalNote && (
                  <div className="mt-2.5 pt-2 border-t border-accents-2/60 text-xs text-accents-4 flex items-center gap-2">
                    <span className="font-mono font-bold text-accents-5 text-[10px] uppercase">
                      Función Retórica:
                    </span>
                    <span className="text-accents-5">{colon.theologicalNote}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel Exegético de la Correspondencia Seleccionada */}
      {activeColon && (
        <div className="p-5 rounded-2xl bg-accents-1 border border-accents-2 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-foreground uppercase">
              Análisis del Elemento {activeColon.label} ({activeColon.verseRef}):
            </span>
          </div>
          <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
            {activeColon.theologicalNote}
          </p>
        </div>
      )}
    </div>
  );
};
