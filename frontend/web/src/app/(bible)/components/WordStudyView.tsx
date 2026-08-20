'use client';

import React, { useState } from 'react';
import { LexiconView } from '../features/lexicons';
import { GrammarSearchDashboard } from '../features/grammar-search';
import { BookOpenCheck, GitFork } from 'lucide-react';

export type WordStudySubTab = 'lexicon' | 'morphology';

interface WordStudyViewProps {
  initialSubTab?: WordStudySubTab;
}

export const WordStudyView: React.FC<WordStudyViewProps> = ({ initialSubTab = 'lexicon' }) => {
  const [subTab, setSubTab] = useState<WordStudySubTab>(initialSubTab);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Barra de Selección de Submódulo de Estudio de Palabra */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-accents-2 bg-accents-1/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4 hidden sm:inline">
            Herramienta:
          </span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-background p-1 text-xs">
            <button
              type="button"
              onClick={() => setSubTab('lexicon')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'lexicon'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              <BookOpenCheck className="w-3.5 h-3.5" />
              <span>Diccionarios Léxicos Strong (BDB / Thayer)</span>
            </button>
            <button
              type="button"
              onClick={() => setSubTab('morphology')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'morphology'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Sintaxis & Búsqueda Morfológica</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden md:block">
          {subTab === 'lexicon'
            ? 'Definiciones etimológicas, raíces hebreas y lemas griegos'
            : 'Filtros gramaticales, densidad canónica y concordancia exhaustiva'}
        </div>
      </div>

      {/* Renderizado de la herramienta seleccionada */}
      {subTab === 'lexicon' ? <LexiconView /> : <GrammarSearchDashboard />}
    </div>
  );
};
