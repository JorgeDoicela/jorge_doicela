'use client';

import React from 'react';
import { ExegeticalPreset } from '../types';

interface MorphologyQuickPresetsProps {
  presets: ExegeticalPreset[];
  activePresetId: string | null;
  onSelectPreset: (preset: ExegeticalPreset) => void;
}

export const MorphologyQuickPresets: React.FC<MorphologyQuickPresetsProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accents-5 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Presets Exegéticos Rápidos (1-Click)
        </span>
        <span className="text-[10px] font-mono text-accents-4 hidden sm:inline">
          Consultas gramaticales canónicas preconfiguradas
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {presets.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`p-3 rounded-lg text-left transition-all border cursor-pointer flex flex-col justify-between gap-1.5 ${
                isActive
                  ? 'bg-blue-500/10 border-blue-500/50 shadow-xs'
                  : 'bg-background hover:bg-accents-1 border-accents-2 hover:border-accents-3'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground line-clamp-1">
                  {preset.title}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-accents-1 text-accents-5 border border-accents-2'
                  }`}
                >
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-accents-5 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
