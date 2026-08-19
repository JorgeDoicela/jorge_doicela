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
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  shortcuts,
  onSelectShortcut,
  visibleTracks,
  onToggleTrack,
  onZoomIn,
  onZoomOut,
  zoomLevel,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md shadow-xs">
      {/* Fila 1: Atajos de Eras Bíblicas Clave */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {isFullscreen ? (
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wide font-mono">
                Cronología Bíblica
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-mono text-accents-4 uppercase mr-1">Épocas:</span>
          )}
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

        {/* Controles de Zoom y Pantalla Completa */}
        <div className="flex items-center gap-2">
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

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`h-9 px-2.5 flex items-center gap-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isFullscreen
                  ? 'bg-foreground text-background border-foreground shadow-sm hover:opacity-90'
                  : 'bg-background hover:bg-accents-1 text-accents-5 hover:text-foreground border-accents-2 shadow-2xs'
              }`}
              title={isFullscreen ? 'Restaurar vista normal (Esc)' : 'Expandir vista en la ventana'}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Restaurar</span>
                  <kbd className="hidden sm:inline-block text-[9px] font-mono px-1 rounded bg-background/20 ml-0.5">
                    ESC
                  </kbd>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="hidden sm:inline">Vista Ampliada</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Fila 2: Toggles de Pistas Sincrónicas */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-accents-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-accents-4 mr-1">Pistas Sincronizadas:</span>

          <button
            type="button"
            onClick={() => onToggleTrack('judah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
              visibleTracks.judah
                ? 'bg-background text-foreground border-accents-2 shadow-2xs font-semibold'
                : 'text-accents-4 bg-transparent border-transparent hover:bg-accents-1 hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Reyes de Judá</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('israel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
              visibleTracks.israel
                ? 'bg-background text-foreground border-accents-2 shadow-2xs font-semibold'
                : 'text-accents-4 bg-transparent border-transparent hover:bg-accents-1 hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Reyes de Israel</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('prophets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
              visibleTracks.prophets
                ? 'bg-background text-foreground border-accents-2 shadow-2xs font-semibold'
                : 'text-accents-4 bg-transparent border-transparent hover:bg-accents-1 hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Profetas Bíblicos</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('empires')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
              visibleTracks.empires
                ? 'bg-background text-foreground border-accents-2 shadow-2xs font-semibold'
                : 'text-accents-4 bg-transparent border-transparent hover:bg-accents-1 hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Imperios Mundiales</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('milestones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
              visibleTracks.milestones
                ? 'bg-background text-foreground border-accents-2 shadow-2xs font-semibold'
                : 'text-accents-4 bg-transparent border-transparent hover:bg-accents-1 hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Hitos Arqueológicos</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-accents-4 hidden sm:inline">
          Arrastra horizontalmente o haz clic para sincronizar
        </span>
      </div>
    </div>
  );
};
