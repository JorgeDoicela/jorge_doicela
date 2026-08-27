'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { InterlinearDisplaySettings } from '../types';

interface InterlinearControlsProps {
  settings: InterlinearDisplaySettings;
  onChangeSettings: (newSettings: InterlinearDisplaySettings) => void;
}

export const InterlinearControls: React.FC<InterlinearControlsProps> = ({
  settings,
  onChangeSettings,
}) => {
  const t = useTranslations('Interlinear');

  const toggleSetting = (
    key: keyof Omit<InterlinearDisplaySettings, 'fontSize' | 'layout' | 'audioSpeed'>,
  ) => {
    onChangeSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-sm text-xs">
      {/* Selector de Modo de Estudio */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-accents-4 uppercase tracking-wider">
          {t('mode')}
        </span>
        <div className="inline-flex rounded-lg border border-accents-2 bg-accents-1 p-1">
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, layout: 'reverse_interlinear' })}
            className={`px-3 py-1 rounded-md font-medium text-xs transition-all cursor-pointer ${
              settings.layout === 'reverse_interlinear'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            {t('reverseInterlinear')}
          </button>
          <button
            type="button"
            onClick={() => onChangeSettings({ ...settings, layout: 'cards' })}
            className={`px-3 py-1 rounded-md font-medium text-xs transition-all cursor-pointer ${
              settings.layout === 'cards'
                ? 'bg-foreground text-background font-bold shadow-xs'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            {t('morphologyCards')}
          </button>
        </div>
      </div>

      {/* Opciones de visualización */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-accents-4 uppercase tracking-wider mr-1 hidden lg:inline">
          {t('layers')}
        </span>

        <button
          type="button"
          onClick={() => toggleSetting('showNikkud')}
          className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            settings.showNikkud
              ? 'bg-foreground text-background font-semibold border-foreground'
              : 'bg-accents-1 text-accents-4 border-accents-2 hover:text-foreground'
          }`}
          title="Puntos vocálicos masoréticos y cantilación"
        >
          {t('nikkud')}
        </button>

        <button
          type="button"
          onClick={() => toggleSetting('showTransliteration')}
          className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            settings.showTransliteration
              ? 'bg-foreground text-background font-semibold border-foreground'
              : 'bg-accents-1 text-accents-4 border-accents-2 hover:text-foreground'
          }`}
          title="Transliteración fonética internacional"
        >
          {t('transliteration')}
        </button>

        <button
          type="button"
          onClick={() => toggleSetting('showGloss')}
          className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            settings.showGloss
              ? 'bg-foreground text-background font-semibold border-foreground'
              : 'bg-accents-1 text-accents-4 border-accents-2 hover:text-foreground'
          }`}
          title="Traducción literal"
        >
          {t('gloss')}
        </button>

        <button
          type="button"
          onClick={() => toggleSetting('showStrong')}
          className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            settings.showStrong
              ? 'bg-foreground text-background font-semibold border-foreground'
              : 'bg-accents-1 text-accents-4 border-accents-2 hover:text-foreground'
          }`}
          title="Códigos de concordancia Strong"
        >
          {t('strong')}
        </button>

        <button
          type="button"
          onClick={() => toggleSetting('showMorphologyTag')}
          className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            settings.showMorphologyTag
              ? 'bg-foreground text-background font-semibold border-foreground'
              : 'bg-accents-1 text-accents-4 border-accents-2 hover:text-foreground'
          }`}
          title="Etiqueta morfológica condensada"
        >
          {t('morphology')}
        </button>
      </div>

      {/* Velocidad de Audio y Tamaño de Fuente */}
      <div className="flex items-center gap-3">
        {/* Velocidad de Audio */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono text-accents-4">{t('audio')}</span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-accents-1 p-0.5">
            {[1.0, 0.75].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onChangeSettings({ ...settings, audioSpeed: speed })}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                  settings.audioSpeed === speed
                    ? 'bg-background text-foreground font-bold shadow-xs'
                    : 'text-accents-4 hover:text-foreground'
                }`}
                title={`Velocidad de pronunciación ${speed}x`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Tamaño de fuente */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-mono text-accents-4">{t('fontSize')}</span>
          <div className="inline-flex rounded-lg border border-accents-2 bg-accents-1 p-0.5">
            {(['base', 'lg', 'xl', '2xl'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChangeSettings({ ...settings, fontSize: size })}
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all ${
                  settings.fontSize === size
                    ? 'bg-background text-foreground font-bold shadow-xs'
                    : 'text-accents-4 hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

