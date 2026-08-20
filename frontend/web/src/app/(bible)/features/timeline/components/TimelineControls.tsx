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
  onSetPresetMode?: (mode: 'kings_prophets' | 'bible_archaeology' | 'all') => void;
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
  onSetPresetMode,
  onZoomIn,
  onZoomOut,
  zoomLevel,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const isKingsProphetsOnly =
    visibleTracks.judah &&
    visibleTracks.israel &&
    visibleTracks.prophets &&
    !visibleTracks.empires &&
    !visibleTracks.milestones;

  const isArchaeologyOnly =
    visibleTracks.judah &&
    !visibleTracks.israel &&
    !visibleTracks.prophets &&
    visibleTracks.empires &&
    visibleTracks.milestones;

  const isAllVisible =
    visibleTracks.judah &&
    visibleTracks.israel &&
    visibleTracks.prophets &&
    visibleTracks.empires &&
    visibleTracks.milestones;

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md shadow-xs">
      {/* Fila 1: Modos de Estudio y Controles de Zoom */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Modos Predefinidos de Visualizacion */}
        {onSetPresetMode && (
          <div className="flex items-center gap-1 p-1 bg-accents-1 border border-accents-2 rounded-lg text-xs">
            <span className="text-[10px] font-mono text-accents-4 uppercase px-1.5 hidden md:inline">Modo:</span>
            <button
              type="button"
              onClick={() => onSetPresetMode('kings_prophets')}
              className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                isKingsProphetsOnly
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Ver unicamente tronos y profetas biblicos"
            >
              Reyes vs Profetas
            </button>
            <button
              type="button"
              onClick={() => onSetPresetMode('bible_archaeology')}
              className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                isArchaeologyOnly
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Comparar Juda con potencias e hitos arqueologicos"
            >
              Biblia y Arqueologia
            </button>
            <button
              type="button"
              onClick={() => onSetPresetMode('all')}
              className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                isAllVisible
                  ? 'bg-background text-foreground font-semibold shadow-xs'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title="Ver todas las 5 pistas sincronizadas"
            >
              Todo Sincronizado
            </button>
          </div>
        )}

        {/* Atajos de Eras Bíblicas */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] font-mono text-accents-4 uppercase mr-1">Época:</span>
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => onSelectShortcut(shortcut)}
              className="px-2 py-0.5 rounded-md text-[11px] bg-accents-1/80 hover:bg-accents-2 text-accents-5 hover:text-foreground transition-all cursor-pointer font-medium"
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
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="hidden sm:inline">Ampliar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Fila 2: Toggles de Pistas Sincrónicas Individuales */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-accents-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-accents-4 mr-1">Pistas:</span>

          <button
            type="button"
            onClick={() => onToggleTrack('judah')}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
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
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
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
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
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
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
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
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
              visibleTracks.milestones
                ? 'bg-background text-foreground border-accents-2 shadow-2xs font-semibold'
                : 'text-accents-4 bg-transparent border-transparent hover:bg-accents-1 hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Arqueología</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-accents-4 hidden md:inline">
          Haz clic o arrastra sobre el lienzo para sincronizar el año
        </span>
      </div>
    </div>
  );
};
