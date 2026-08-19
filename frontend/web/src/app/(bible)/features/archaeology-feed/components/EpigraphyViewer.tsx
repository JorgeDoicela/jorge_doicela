'use client';

import React from 'react';
import { EpigraphicTranscription } from '../types';

interface EpigraphyViewerProps {
  epigraphy?: EpigraphicTranscription;
}

export const EpigraphyViewer: React.FC<EpigraphyViewerProps> = ({ epigraphy }) => {
  if (!epigraphy) return null;

  return (
    <div className="p-4 rounded-xl border border-accents-2 bg-accents-1/40 space-y-2.5 my-4">
      <div className="flex items-center justify-between border-b border-accents-2 pb-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-semibold">
          Registro Epigráfico Original
        </span>
        <span className="text-[10px] font-mono text-accents-4">
          {epigraphy.language} • {epigraphy.dateEstimate}
        </span>
      </div>

      <div className="text-center py-2 bg-background/80 rounded-lg border border-accents-2">
        <span className="font-serif text-lg md:text-xl font-bold text-amber-400 tracking-wider">
          {epigraphy.originalScript}
        </span>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-accents-4 font-mono text-[11px] shrink-0">Transliteración:</span>
          <span className="font-mono text-foreground">{epigraphy.transliteration}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-accents-4 font-mono text-[11px] shrink-0">Traducción:</span>
          <span className="text-foreground italic font-medium">"{epigraphy.translation}"</span>
        </div>
      </div>
    </div>
  );
};
