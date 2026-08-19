'use client';

import React, { useState } from 'react';
import { LiteraryViewSubMode } from '../types';
import { ChiasmViewer } from './ChiasmViewer';
import { PaulineDiscourseViewer } from './PaulineDiscourseViewer';

export const LiteraryAnalysisView: React.FC = () => {
  const [subMode, setSubMode] = useState<LiteraryViewSubMode>('poetic_chiasm');

  return (
    <div className="space-y-6">
      {/* Selector de Submódulo Literario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-accents-2 bg-accents-1/40">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4">
            Eje de Análisis:
          </span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => setSubMode('poetic_chiasm')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                subMode === 'poetic_chiasm'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Quiasmos y Paralelismos Semíticos (Salmos/Profetas)
            </button>
            <button
              type="button"
              onClick={() => setSubMode('pauline_discourse')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                subMode === 'pauline_discourse'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Marcadores de Discurso y Cláusulas (Epístolas Paulinas)
            </button>

          </div>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden md:block">
          {subMode === 'poetic_chiasm'
            ? 'Estructuras concéntricas semíticas (A-B-C-B\'-A\')'
            : 'Diagramación de bloques y conectores lógicos griegos'}
        </div>
      </div>

      {/* Renderizado del Submódulo */}
      {subMode === 'poetic_chiasm' ? (
        <ChiasmViewer />
      ) : (
        <PaulineDiscourseViewer />
      )}
    </div>
  );
};
