'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Timeline');

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
          <div className="flex items-center gap-0.5 p-0.5 bg-inner-card border border-border/80 rounded-full text-xs shadow-2xs">
            <span className="text-[10px] font-mono text-accents-4 uppercase px-2 hidden md:inline">{t('mode')}</span>
            <button
              type="button"
              onClick={() => onSetPresetMode('all')}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer active:scale-95 ${
                isAllVisible
                  ? 'bg-foreground text-background font-semibold shadow-2xs'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title={t('allSyncedTooltip')}
            >
              {t('allSynced')}
            </button>
            <button
              type="button"
              onClick={() => onSetPresetMode('kings_prophets')}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer active:scale-95 ${
                isKingsProphetsOnly
                  ? 'bg-foreground text-background font-semibold shadow-2xs'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title={t('kingsProphetsTooltip')}
            >
              {t('kingsProphets')}
            </button>
            <button
              type="button"
              onClick={() => onSetPresetMode('bible_archaeology')}
              className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer active:scale-95 ${
                isArchaeologyOnly
                  ? 'bg-foreground text-background font-semibold shadow-2xs'
                  : 'text-accents-5 hover:text-foreground'
              }`}
              title={t('bibleArchaeologyTooltip')}
            >
              {t('bibleArchaeology')}
            </button>
          </div>
        )}

        {/* Atajos de Eras Bíblicas */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-accents-4 uppercase mr-1">{t('eraLabel')}</span>
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.id}
              type="button"
              onClick={() => onSelectShortcut(shortcut)}
              className="px-2.5 py-1 rounded-full text-[11px] bg-inner-card border border-border/80 shadow-2xs hover:border-accents-4 hover:bg-inner-card text-accents-5 hover:text-foreground transition-all cursor-pointer font-medium active:scale-95"
              title={shortcut.description}
            >
              {shortcut.label}
            </button>
          ))}
        </div>

        {/* Controles de Zoom y Pantalla Completa */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-inner-card border border-border/80 p-0.5 rounded-full shadow-2xs">
            <button
              type="button"
              onClick={onZoomOut}
              className="w-6 h-6 flex items-center justify-center rounded-full text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer active:scale-95"
              title={t('zoomOutTooltip')}
            >
              −
            </button>
            <span className="text-[10px] font-mono text-accents-4 px-1.5 select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={onZoomIn}
              className="w-6 h-6 flex items-center justify-center rounded-full text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer active:scale-95"
              title={t('zoomInTooltip')}
            >
              +
            </button>
          </div>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className={`h-8 px-3 flex items-center gap-1.5 rounded-full border border-border/80 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 ${
                isFullscreen
                  ? 'bg-foreground text-background border-foreground shadow-sm hover:opacity-90'
                  : 'bg-inner-card hover:bg-accents-1 text-accents-5 hover:text-foreground hover:border-accents-4'
              }`}
              title={isFullscreen ? t('restoreNormalView') : t('expandView')}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">{t('restore')}</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="hidden sm:inline">{t('expand')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Fila 2: Toggles de Pistas Sincrónicas Individuales */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-accents-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-accents-4 mr-1">{t('tracksLabel')}</span>

          <button
            type="button"
            onClick={() => onToggleTrack('judah')}
            className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
              visibleTracks.judah
                ? 'bg-inner-card text-foreground border-border/80 shadow-2xs font-semibold'
                : 'text-accents-4 bg-inner-card/40 border-transparent hover:bg-inner-card hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{t('judahKings')}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('israel')}
            className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
              visibleTracks.israel
                ? 'bg-inner-card text-foreground border-border/80 shadow-2xs font-semibold'
                : 'text-accents-4 bg-inner-card/40 border-transparent hover:bg-inner-card hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{t('israelKings')}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('prophets')}
            className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
              visibleTracks.prophets
                ? 'bg-inner-card text-foreground border-border/80 shadow-2xs font-semibold'
                : 'text-accents-4 bg-inner-card/40 border-transparent hover:bg-inner-card hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t('biblicalProphets')}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('empires')}
            className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
              visibleTracks.empires
                ? 'bg-inner-card text-foreground border-border/80 shadow-2xs font-semibold'
                : 'text-accents-4 bg-inner-card/40 border-transparent hover:bg-inner-card hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>{t('worldEmpires')}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTrack('milestones')}
            className={`px-3 py-1 rounded-full text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
              visibleTracks.milestones
                ? 'bg-inner-card text-foreground border-border/80 shadow-2xs font-semibold'
                : 'text-accents-4 bg-inner-card/40 border-transparent hover:bg-inner-card hover:text-foreground opacity-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{t('archaeology')}</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-accents-4 hidden md:inline">
          {t('canvasHelp')}
        </span>
      </div>
    </div>
  );
};
