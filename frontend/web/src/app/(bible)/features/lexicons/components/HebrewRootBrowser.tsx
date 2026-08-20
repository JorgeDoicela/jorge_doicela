'use client';

import React from 'react';
import { HebrewLexiconEntry } from '../types';
import { HEBREW_LEXICONS_DATABASE } from '../data/hebrewLexiconsData';

interface HebrewRootBrowserProps {
  entries?: HebrewLexiconEntry[];
  selectedEntryId: string;
  onSelectEntry: (entry: HebrewLexiconEntry) => void;
  searchQuery: string;
}

export const HebrewRootBrowser: React.FC<HebrewRootBrowserProps> = ({
  entries = HEBREW_LEXICONS_DATABASE,
  selectedEntryId,
  onSelectEntry,
  searchQuery,
}) => {
  const sourceList = entries.length > 0 ? entries : HEBREW_LEXICONS_DATABASE;
  const filteredEntries = sourceList.filter((entry) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      entry.root.includes(q) ||
      entry.rootTransliteration.toLowerCase().includes(q) ||
      entry.lemma.includes(q) ||
      entry.strongPrimary.toLowerCase().includes(q) ||
      entry.gloss.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
          Índice de Raíces Triconsonánticas ({filteredEntries.length})
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
                    dir="rtl"
                    lang="he"
                    className="text-lg font-serif font-bold"
                    style={{ fontFamily: '"SBL Hebrew", "Ezra SIL", serif' }}
                  >
                    {entry.root}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-background/90' : 'text-foreground'
                    }`}
                  >
                    ({entry.rootTransliteration})
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isSelected
                      ? 'bg-background text-foreground'
                      : 'bg-accents-1 text-accents-4 border border-accents-2'
                  }`}
                >
                  {entry.strongPrimary}
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
                  {entry.derivedWords.length} derivados
                </span>
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="p-4 text-center text-xs text-accents-4 border border-dashed border-accents-2 rounded-xl">
            No se encontraron raíces que coincidan con la búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};
