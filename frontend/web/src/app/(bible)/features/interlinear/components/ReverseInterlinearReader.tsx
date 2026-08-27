'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Interlinear');
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
            ({t('interlinearWith', { language: isOT ? (verse as InterlinearVerse).language === 'Aramaic' ? t('aramaic') : t('masoreticHebrew') : t('koineGreek') })})
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
              ? t('aramaic')
              : t('masoreticHebrew')
            : t('koineGreek')}
        </span>
      </div>

      {/* Vista 1: Lectura Fluida con Iluminación Bidireccional */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
            {t('textInLanguage')}
          </span>
          <span className="text-[10px] font-mono text-accents-4">
            {t('hoverActive')}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-accents-1/40 border border-accents-2 text-base sm:text-lg leading-loose text-foreground font-serif">
          {tokens.map((tok) => {
            const isHovered = activeTokenId === tok.id;
            const isSelected = activeTokenId === tok.id;

            return (
              <span
                key={tok.id}
                onMouseEnter={() => onHoverToken(tok.id)}
                onMouseLeave={() => onHoverToken(null)}
                onClick={() => onSelectToken(tok)}
                className={`inline-block px-1.5 py-0.5 rounded-md cursor-pointer transition-all duration-150 mx-0.5 ${
                  isHovered || isSelected
                    ? 'bg-amber-500/20 text-foreground font-bold underline decoration-amber-500 decoration-2 underline-offset-4 shadow-xs'
                    : 'hover:bg-accents-2'
                }`}
              >
                {tok.gloss}
              </span>
            );
          })}
        </div>
      </div>

      {/* Panel Flotante de Inspección Rápida de la Palabra Activa */}
      <div className="min-h-[56px] p-3 rounded-xl border border-accents-2 bg-accents-1/30 flex items-center">
        {activeToken ? (
          <div className="w-full flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span
                dir={isOT ? 'rtl' : 'ltr'}
                className="text-2xl font-serif font-bold text-foreground"
              >
                {'greek' in activeToken ? activeToken.greek : activeToken.hebrew}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-accents-5">
                  /{activeToken.transliteration}/
                </span>
                <span className="text-xs font-semibold text-foreground">
                  «{activeToken.gloss}»
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handlePlayAudio(e, activeToken)}
                className="px-2.5 py-1.5 rounded-lg border border-accents-2 bg-background hover:bg-accents-1 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Escuchar pronunciación"
              >
                {playingId === activeToken.id ? (
                  <span className="text-amber-500">...</span>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-accents-5" />
                    <span>Audio</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectToken(activeToken)}
                className="px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 cursor-pointer transition-colors"
              >
                {t('seeMorphology')}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between text-xs font-mono text-accents-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accents-4" />
              <span>{t('hoverPrompt')}</span>
            </div>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-accents-1 border border-accents-2">
              {t('hoverActive')}
            </span>
          </div>
        )}
      </div>

      {/* Vista 2: Matriz Interlineal Palabra por Palabra Sincronizada */}
      <div className="space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4 block">
          {t('morphologyBreakdown')}
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
