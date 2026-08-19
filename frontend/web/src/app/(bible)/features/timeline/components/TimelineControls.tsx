'use client';

import React from 'react';
import { TimelineEraShortcut } from '../hooks/useBiblicalTimeline';

interface TimelineControlsProps {
  shortcuts: TimelineEraShortcut[];
  onSelectShortcut: (shortcut: TimelineEraShortcut) => void;
  visibleTracks: {
    judah: boolean;
    israel: boolean;
    prophets: boolean;
    empires: boolean;
    milestones: boolean;
  };
  onToggleTrack: (trackKey: 'judah' | 'israel' | 'prophets' | 'empires' | 'milestones') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomLevel: number;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  shortcuts,
  onSelectShortcut,
  visibleTracks,
  onToggleTrack,
  onZoomIn,
  onZoomOut,
  zoomLevel,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md">
      {/* Fila 1: Atajos de Eras Bíblicas Clave */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-accents-4 uppercase mr-1">Épocas:</span>
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => onSelectShortcut(shortcut)}
              className="px-2.5 py-1 rounded-md text-xs bg-accents-1 hover:bg-accents-2 text-accents-5 hover:text-foreground transition-all cursor-pointer font-medium"
              title={shortcut.description}
            >
              {shortcut.label}
            </button>
          ))}
        </div>

        {/* Controles de Zoom */}
        <div className="flex items-center gap-1 bg-accents-1 border border-accents-2 p-1 rounded-lg">
          <button
            type="button"
            onClick={onZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer"
            title="Alejar escala temporal"
          >
            −
          </button>
          <span className="text-[10px] font-mono text-accents-4 px-1.5 select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer"
            title="Acercar escala temporal"
          >
            +
          </button>
        </div>
      </div>

      {/* Fila 2: Toggles de Pistas Sincrónicas */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-accents-2/70 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-accents-4 mr-1">Pistas Sincronizadas:</span>

          <button
            type="button"
            onClick={() => onToggleTrack('judah')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              visibleTracks.judah
                ? 'bg-blue-900/40 text-blue-300 border border-blue-500/50'
                : 'text-accents-4 bg-accents-1/40 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Reyes de Judá
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('israel')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              visibleTracks.israel
                ? 'bg-red-900/40 text-red-300 border border-red-500/50'
                : 'text-accents-4 bg-accents-1/40 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Reyes de Israel
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('prophets')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              visibleTracks.prophets
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/50'
                : 'text-accents-4 bg-accents-1/40 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Profetas Bíblicos
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('empires')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              visibleTracks.empires
                ? 'bg-purple-900/40 text-purple-300 border border-purple-500/50'
                : 'text-accents-4 bg-accents-1/40 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Imperios Mundiales
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('milestones')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              visibleTracks.milestones
                ? 'bg-amber-900/40 text-amber-300 border border-amber-500/50'
                : 'text-accents-4 bg-accents-1/40 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Hitos Arqueológicos
          </button>
        </div>

        <span className="text-[10px] font-mono text-accents-4 hidden md:block">
          Arrastra horizontalmente o haz clic para sincronizar
        </span>
      </div>
    </div>
  );
};
