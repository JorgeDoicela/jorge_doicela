'use client';

import React, { useState } from 'react';
import {
  HebrewAramaicToken,
  GreekToken,
  InterlinearVerse,
  GreekInterlinearVerse,
  InterlinearDisplaySettings,
} from '../types';
import { Volume2, Sparkles } from 'lucide-react';
import { biblicalAudioService } from '../services/biblicalAudioService';

interface ReverseInterlinearReaderProps {
  hebrewVerse?: InterlinearVerse;
  greekVerse?: GreekInterlinearVerse;
  settings: InterlinearDisplaySettings;
  activeTokenId: string | null;
  onHoverToken: (tokenId: string | null) => void;
  onSelectToken: (token: HebrewAramaicToken | GreekToken) => void;
  onOpenStrong: (strongCode: string) => void;
}

export const ReverseInterlinearReader: React.FC<ReverseInterlinearReaderProps> = ({
  hebrewVerse,
  greekVerse,
  settings,
  activeTokenId,
  onHoverToken,
  onSelectToken,
  onOpenStrong,
}) => {
  const isOT = !!hebrewVerse;
  const verse = isOT ? hebrewVerse! : greekVerse!;
  const tokens = verse.tokens;

  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayAudio = (e: React.MouseEvent, token: HebrewAramaicToken | GreekToken) => {
    e.stopPropagation();
    const isGreek = 'greek' in token;
    const text = isGreek ? (token as GreekToken).greek : (token as HebrewAramaicToken).hebrew;
    const lang = isGreek ? 'Greek' : (token as HebrewAramaicToken).language;

    setPlayingId(token.id);
    biblicalAudioService.play({
      text,
      language: lang,
      rate: settings.audioSpeed,
      onStart: () => setPlayingId(token.id),
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const activeToken = tokens.find((t) => t.id === activeTokenId);

  return (
    <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-6 shadow-xs">
      {/* Encabezado del versículo */}
      <div className="flex items-center justify-between border-b border-accents-2 pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-foreground">
            {verse.bookName} {verse.chapter}:{verse.verseNumber}
          </span>
          <span className="text-[11px] font-mono text-accents-4">
            (Interlineal Inverso Español ↔ {isOT ? 'Hebreo / Arameo' : 'Griego Koiné'})
          </span>
        </div>

        <span
          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
            isOT
              ? (verse as InterlinearVerse).language === 'Aramaic'
                ? 'text-amber-500 bg-amber-500/10 border-amber-500/30 font-bold'
                : 'text-blue-500 bg-blue-500/10 border-blue-500/30 font-semibold'
              : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 font-semibold'
          }`}
        >
          {isOT
            ? (verse as InterlinearVerse).language === 'Aramaic'
              ? 'Arameo Imperial'
              : 'Hebreo Masorético'
            : 'Griego Koiné'}
        </span>
      </div>

      {/* Vista 1: Lectura Fluida en Español con Iluminación Bidireccional */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
            Texto en Español (Pasa el cursor o toca cada palabra):
          </span>
          <span className="text-[10px] font-mono text-accents-4">
            Hover o tap sincronizado con la lengua original
          </span>
        </div>

        <div className="p-5 rounded-xl bg-accents-1/40 border border-accents-2 text-base sm:text-lg leading-loose text-foreground font-serif">
          {tokens.map((tok) => {
            if (!tok.spanishSpan || tok.spanishSpan.trim() === '') return null;
            const isHovered = activeTokenId === tok.id;
            return (
              <span
                key={tok.id}
                onMouseEnter={() => onHoverToken(tok.id)}
                onMouseLeave={() => onHoverToken(null)}
                onClick={() => onSelectToken(tok)}
                className={`inline-block px-1.5 py-0.5 mx-1 rounded-md transition-all cursor-pointer select-none ${
                  isHovered
                    ? 'bg-amber-500/20 text-amber-500 font-bold ring-2 ring-amber-500/50 shadow-xs scale-105'
                    : 'hover:bg-accents-2 hover:text-foreground text-foreground'
                }`}
                title={`Original: ${'greek' in tok ? tok.greek : tok.hebrew} (${tok.strong})`}
              >
                {tok.spanishSpan}
              </span>
            );
          })}
        </div>
      </div>

      {/* Ficha Activa Flotante / Preview Rápido con Altura Estable (Cero Salto de Diseño) */}
      <div className="min-h-[74px] rounded-xl border transition-all flex items-center justify-between p-3 sm:p-4 bg-accents-1/30">
        {activeToken ? (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-100">
            <div className="flex items-center gap-4">
              <div
                dir={'hebrew' in activeToken ? 'rtl' : 'ltr'}
                lang={'hebrew' in activeToken ? 'he' : 'el'}
                className="text-2xl sm:text-3xl font-serif font-bold text-foreground"
              >
                {'hebrew' in activeToken ? activeToken.hebrew : activeToken.greek}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-foreground">/{activeToken.transliteration}/</span>
                  {activeToken.ipa && <span className="text-accents-4">{activeToken.ipa}</span>}
                  <button
                    type="button"
                    onClick={() => onOpenStrong(activeToken.strong)}
                    className="px-2 py-0.5 rounded bg-foreground text-background font-bold text-[10px] hover:bg-foreground/80 cursor-pointer"
                  >
                    {activeToken.strong}
                  </button>
                </div>
                <p className="text-xs text-accents-5">
                  Traducción: <strong className="text-foreground">«{activeToken.gloss}»</strong> • {activeToken.partOfSpeech}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handlePlayAudio(e, activeToken)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-accents-2 hover:border-foreground text-xs font-mono text-foreground font-semibold cursor-pointer shadow-xs transition-all"
              >
                {playingId === activeToken.id ? (
                  <span className="text-amber-500">Sonando...</span>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-accents-5" />
                    <span>Pronunciar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectToken(activeToken)}
                className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 cursor-pointer transition-colors"
              >
                Ver Análisis Morfológico
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-xs font-mono text-accents-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accents-4" />
              <span>Pasa el cursor sobre cualquier palabra del texto para ver su pronunciación fonética, raíz y análisis morfológico.</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-accents-1 border border-accents-2">
              Hover Activo
            </span>
          </div>
        )}
      </div>

      {/* Vista 2: Matriz Interlineal Palabra por Palabra Sincronizada */}
      <div className="space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4 block">
          Desglose Morfológico Interlineal Alineado:
        </span>

        <div
          dir={isOT ? 'rtl' : 'ltr'}
          className="flex flex-wrap gap-2.5 items-start justify-start pt-1"
        >
          {tokens.map((tok) => {
            const isHovered = activeTokenId === tok.id;
            const isGreek = 'greek' in tok;
            const originalText = isGreek ? tok.greek : tok.hebrew;

            return (
              <div
                key={tok.id}
                dir="ltr"
                onMouseEnter={() => onHoverToken(tok.id)}
                onMouseLeave={() => onHoverToken(null)}
                onClick={() => onSelectToken(tok)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center min-w-[95px] max-w-[130px] space-y-1.5 ${
                  isHovered
                    ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/40 scale-105'
                    : 'bg-background border-accents-2 hover:border-accents-3 hover:bg-accents-1/50'
                }`}
              >
                {/* Palabra original */}
                <div
                  dir={isOT ? 'rtl' : 'ltr'}
                  className="text-lg sm:text-xl font-serif font-bold text-foreground leading-tight"
                >
                  {originalText}
                </div>

                {/* Transliteración fonética */}
                {settings.showTransliteration && (
                  <div className="text-[11px] font-mono text-accents-4 truncate max-w-full">
                    {tok.transliteration}
                  </div>
                )}

                {/* Traducción al español */}
                {settings.showGloss && (
                  <div className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
                    {tok.gloss}
                  </div>
                )}

                {/* Código Strong con click directo al léxico */}
                {settings.showStrong && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenStrong(tok.strong);
                    }}
                    className="mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-accents-2 hover:bg-foreground hover:text-background text-accents-5 transition-colors cursor-pointer"
                  >
                    {tok.strong}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
