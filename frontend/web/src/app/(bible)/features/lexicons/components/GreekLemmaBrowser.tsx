'use client';

import React from 'react';
import { GreekLexiconEntry } from '../types';
import { GREEK_LEXICONS_DATABASE } from '../data/greekLexiconsData';

interface GreekLemmaBrowserProps {
  selectedEntryId: string;
  onSelectEntry: (entry: GreekLexiconEntry) => void;
  searchQuery: string;
}

export const GreekLemmaBrowser: React.FC<GreekLemmaBrowserProps> = ({
  selectedEntryId,
  onSelectEntry,
  searchQuery,
}) => {
  const filteredEntries = GREEK_LEXICONS_DATABASE.filter((entry) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      entry.lemma.toLowerCase().includes(q) ||
      entry.transliteration.toLowerCase().includes(q) ||
      entry.strong.toLowerCase().includes(q) ||
      entry.gloss.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
          Índice de Lemas Griegos ({filteredEntries.length})
        </span>
      </div>

      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {filteredEntries.map((entry) => {
          const isSelected = selectedEntryId === entry.id;

          return (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-foreground text-background border-foreground shadow-xs'
                  : 'bg-background hover:bg-accents-1 border-accents-2'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    lang="el"
                    className="text-lg font-serif font-bold"
                    style={{ fontFamily: '"Gentium Plus", "SBL Greek", serif' }}
                  >
                    {entry.lemma}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-background/90' : 'text-foreground'
                    }`}
                  >
                    /{entry.transliteration}/
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? 'bg-background text-foreground'
                      : 'bg-accents-1 text-accents-4 border border-accents-2'
                  }`}
                >
                  {entry.strong}
                </span>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-xs">
                <span
                  className={`truncate max-w-[200px] ${
                    isSelected ? 'text-background/80' : 'text-accents-5'
                  }`}
                >
                  {entry.gloss}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isSelected ? 'text-background/70' : 'text-accents-4'
                  }`}
                >
                  {entry.occurrences}x en NT
                </span>
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="p-4 text-center text-xs text-accents-4 border border-dashed border-accents-2 rounded-xl">
            No se encontraron lemas que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};
