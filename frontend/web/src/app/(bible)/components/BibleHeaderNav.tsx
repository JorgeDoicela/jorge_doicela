'use client';

import React from 'react';
import Link from 'next/link';
import { BibleLogo } from './BibleLogo';
import { BibleStudyMode } from '../features/parallel-view';
import { TranslationSelector } from '../features/translations';
import { Translation } from '../features/translations/hooks/useTranslations';
import { ThemeToggle } from './ThemeToggle';

interface BibleHeaderNavProps {
  studyMode: BibleStudyMode;
  onChangeStudyMode: (mode: BibleStudyMode) => void;
  selectedTranslationId: number | null;
  onSelectTranslation: (id: number | null) => void;
  columnCount: number;
  availableTranslations: Translation[];
  activeTranslationIds: number[];
  onAddColumn: (translationId: number) => void;
}

interface NavTabItem {
  id: BibleStudyMode;
  label: string;
  dotColor?: string;
}

const NAV_TABS: NavTabItem[] = [
  { id: 'standard', label: 'Estándar' },
  { id: 'parallel', label: 'Paralelo', dotColor: 'bg-blue-500' },
  { id: 'interlinear', label: 'Interlineal', dotColor: 'bg-amber-500' },
  { id: 'literary', label: 'Quiasmos', dotColor: 'bg-emerald-500' },
  { id: 'lexicon', label: 'Léxicos', dotColor: 'bg-purple-500' },
  { id: 'grammar-search', label: 'Morfología', dotColor: 'bg-cyan-500' },
  { id: 'atlas', label: 'Atlas & 3D', dotColor: 'bg-rose-500' },
  { id: 'timeline', label: 'Cronología', dotColor: 'bg-amber-400' },
  { id: 'archaeology', label: 'Arqueología', dotColor: 'bg-teal-400' },
];

export const BibleHeaderNav: React.FC<BibleHeaderNavProps> = ({
  studyMode,
  onChangeStudyMode,
  selectedTranslationId,
  onSelectTranslation,
  columnCount,
  availableTranslations,
  activeTranslationIds,
  onAddColumn,
}) => {
  const nextAvailableTranslation = availableTranslations.find(
    (t) => !activeTranslationIds.includes(t.id),
  ) || availableTranslations[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Izquierda: Logotipo e Identidad (Link a Landing) */}
        <Link
          href="/bible"
          className="shrink-0 flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          title="Volver a la Presentación"
        >
          <BibleLogo size={20} />
          <span className="text-accents-2 font-mono select-none">/</span>
          <span className="text-xs font-bold tracking-wider uppercase text-foreground">
            Bible
          </span>
        </Link>

        {/* Centro: Pestañas de Navegación en 1 sola línea con scroll horizontal suave */}
        <nav
          className="flex-1 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none select-none px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {NAV_TABS.map((tab) => {
            const isActive = studyMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeStudyMode(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                {tab.dotColor && (
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${tab.dotColor} ${
                      isActive ? 'ring-1 ring-background' : ''
                    }`}
                  />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Derecha: Selector de Traducción, Acciones y Tema */}
        <div className="shrink-0 flex items-center gap-2">
          {/* Botón rápido Añadir Columna solo en Vista Paralela */}
          {studyMode === 'parallel' && columnCount < 4 && nextAvailableTranslation && (
            <button
              type="button"
              onClick={() => onAddColumn(nextAvailableTranslation.id)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-accents-2 bg-background hover:border-foreground text-foreground transition-all flex items-center gap-1 cursor-pointer shadow-xs"
              title="Añadir otra columna para comparar"
            >
              <svg className="w-3.5 h-3.5 text-accents-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:inline">+ Versión</span>
            </button>
          )}

          {/* Selector de Traducción en Vista Estándar */}
          {studyMode === 'standard' && (
            <TranslationSelector
              selectedTranslationId={selectedTranslationId}
              onSelectTranslation={onSelectTranslation}
            />
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
