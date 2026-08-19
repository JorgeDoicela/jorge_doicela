'use client';

import React, { useState } from 'react';
import { GreekToken, InterlinearDisplaySettings } from '../types';
import { biblicalAudioService } from '../services/biblicalAudioService';

interface GreekWordCardProps {
  token: GreekToken;
  settings: InterlinearDisplaySettings;
  isHighlighted?: boolean;
  onSelectToken: (token: GreekToken) => void;
  onOpenStrong?: (strongCode: string) => void;
  onHover?: (tokenId: string) => void;
  onLeave?: () => void;
}

export const GreekWordCard: React.FC<GreekWordCardProps> = ({
  token,
  settings,
  isHighlighted = false,
  onSelectToken,
  onOpenStrong,
  onHover,
  onLeave,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'base':
        return 'text-lg';
      case 'lg':
        return 'text-xl';
      case 'xl':
        return 'text-2xl';
      case '2xl':
        return 'text-3xl';
      default:
        return 'text-2xl';
    }
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      biblicalAudioService.stop();
      setIsPlaying(false);
      return;
    }

    biblicalAudioService.play({
      text: token.greek,
      language: 'Greek',
      rate: settings.audioSpeed,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <div
      onMouseEnter={() => onHover && onHover(token.id)}
      onMouseLeave={() => onLeave && onLeave()}
      onClick={() => onSelectToken(token)}
      className={`group relative flex flex-col items-center justify-between p-3 rounded-xl border transition-all duration-150 cursor-pointer min-w-[125px] max-w-[175px] text-center ${
        isHighlighted
          ? 'bg-amber-500/10 border-amber-500 shadow-lg ring-2 ring-amber-500/40 scale-105'
          : 'border-accents-2 bg-background hover:border-foreground hover:bg-accents-1/60 hover:shadow-md'
      }`}
      title="Haz clic para ver el desglose morfológico del griego"
    >
      {/* Orden de palabra y botón de audio */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-accents-4 mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] px-1 py-0.2 rounded bg-accents-1 border border-accents-2">
          #{token.order}
        </span>

        <div className="flex items-center gap-1">
          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
            Griego
          </span>

          {/* Botón de Audio Rápido */}
          <button
            type="button"
            onClick={handlePlayAudio}
            className={`p-1 rounded hover:bg-accents-2 transition-colors ${
              isPlaying ? 'text-amber-500 animate-pulse' : 'text-accents-4 hover:text-foreground'
            }`}
            title="Escuchar pronunciación bíblica auténtica"
            aria-label="Reproducir audio griego"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Texto Griego Politónico */}
      <div
        lang="el"
        className={`w-full font-serif font-medium tracking-normal text-foreground my-1 leading-snug select-text ${getFontSizeClass()}`}
        style={{
          fontFamily:
            '"Gentium Plus", "SBL Greek", "Cardo", "Georgia", "Times New Roman", serif',
        }}
      >
        {token.greek}
      </div>

      {/* Capas interlineales inferiores */}
      <div className="w-full space-y-1 mt-2 pt-2 border-t border-accents-1">
        {/* Lema */}
        <div className="text-[10px] font-serif text-accents-4 italic">
          lema: {token.lemma}
        </div>

        {/* Transliteración fonética */}
        {settings.showTransliteration && (
          <div className="text-[11px] font-mono text-accents-5 truncate font-medium">
            {token.transliteration}
          </div>
        )}

        {/* Glosa en Español */}
        {settings.showGloss && (
          <div className="text-xs text-foreground font-semibold leading-tight line-clamp-2">
            {token.gloss}
          </div>
        )}

        {/* Código Strong Griego con click directo */}
        {settings.showStrong && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenStrong) onOpenStrong(token.strong);
            }}
            className="text-[10px] font-mono text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            title="Abrir definición Strong exegética"
          >
            {token.strong}
          </button>
        )}

        {/* Tag morfológico Robinson */}
        {settings.showMorphologyTag && (
          <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accents-1 text-accents-4 border border-accents-2 truncate">
            {token.morphologyCode}
          </div>
        )}
      </div>
    </div>
  );
};

