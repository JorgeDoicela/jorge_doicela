'use client';

import React, { useState } from 'react';
import {
  LexiconLanguageTab,
  HebrewLexiconEntry,
  GreekLexiconEntry,
} from '../types';
import { HEBREW_LEXICONS_DATABASE } from '../data/hebrewLexiconsData';
import { GREEK_LEXICONS_DATABASE } from '../data/greekLexiconsData';
import { HebrewRootBrowser } from './HebrewRootBrowser';
import { GreekLemmaBrowser } from './GreekLemmaBrowser';
import { LexiconEntryDetail } from './LexiconEntryDetail';
import { OngoingExpansionNotice } from '../../../components/OngoingExpansionNotice';

export const LexiconView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LexiconLanguageTab>('hebrew');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHebrewEntry, setSelectedHebrewEntry] =
    useState<HebrewLexiconEntry>(HEBREW_LEXICONS_DATABASE[0]);
  const [selectedGreekEntry, setSelectedGreekEntry] =
    useState<GreekLexiconEntry>(GREEK_LEXICONS_DATABASE[0]);

  return (
    <div className="space-y-6">
      {/* Barra Superior: Selector de Lengua y Buscador Global */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-accents-2 bg-background shadow-xs">
        {/* Selector de Lengua */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-accents-4 uppercase tracking-wider">
            Lengua Bíblica:
          </span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-accents-1 p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('hebrew');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'hebrew'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Hebreo / Arameo (BDB • Gesenius • DTAT)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('greek');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === 'greek'
                  ? 'bg-foreground text-background font-bold shadow-xs'
                  : 'text-accents-4 hover:text-foreground'
              }`}
            >
              Griego Koiné (Thayer • LSJ • Robertson • Vincent)
            </button>
          </div>
        </div>

        {/* Buscador de Raíz / Lema */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'hebrew'
                ? 'Buscar raíz hebrea (ej. shalom, bara, elohim)...'
                : 'Buscar lema griego (ej. logos, agape, theos)...'
            }
            className="w-full px-3.5 py-2 rounded-lg bg-accents-1 border border-accents-2 text-xs text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-accents-4 hover:text-foreground cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Grid Principal: Navegador Lateral e Información Detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Índice / Navegador */}
        <div className="lg:col-span-4 p-4 rounded-2xl border border-accents-2 bg-accents-1/30 space-y-4">
          {activeTab === 'hebrew' ? (
            <HebrewRootBrowser
              selectedEntryId={selectedHebrewEntry.id}
              onSelectEntry={setSelectedHebrewEntry}
              searchQuery={searchQuery}
            />
          ) : (
            <GreekLemmaBrowser
              selectedEntryId={selectedGreekEntry.id}
              onSelectEntry={setSelectedGreekEntry}
              searchQuery={searchQuery}
            />
          )}
        </div>

        {/* Columna Derecha: Ficha Exegética Multifuente */}
        <div className="lg:col-span-8">
          {activeTab === 'hebrew' ? (
            <LexiconEntryDetail entry={selectedHebrewEntry} type="hebrew" />
          ) : (
            <LexiconEntryDetail entry={selectedGreekEntry} type="greek" />
          )}
        </div>
      </div>

      {/* Aviso de Expansión Continua de Diccionarios y Raíces */}
      <div className="pt-6">
        <OngoingExpansionNotice
          contextTitle="Léxicos e Índices Etimológicos en Crecimiento"
          contextDescription="Esta plataforma es un proyecto nuevo que recién comienza. Me esfuerzo por entregarte un trabajo fiel y completo, integrando progresivamente las más de 8.600 entradas del BDB/Gesenius para el hebreo-arameo y las más de 5.600 raíces de Thayer/LSJ para el griego koiné."
          activeItemsSummary="Raíces teológicas activas: B'reshit, Elohim, YHWH, Shalom, Chesed, Logos, Agape, Pneuma, Charis y más."
        />
      </div>
    </div>
  );
};
