'use client';

import React, { useState } from 'react';
import { StrongLexiconEntry } from '../types';
import { biblicalAudioService } from '../services/biblicalAudioService';

interface StrongLexiconDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entry: StrongLexiconEntry | null;
  audioSpeed?: number;
}

export const StrongLexiconDrawer: React.FC<StrongLexiconDrawerProps> = ({
  isOpen,
  onClose,
  entry,
  audioSpeed = 1.0,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen || !entry) return null;

  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      biblicalAudioService.stop();
      setIsPlayingAudio(false);
      return;
    }

    biblicalAudioService.play({
      text: entry.lemma,
      language: entry.language,
      rate: audioSpeed,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const isHebrewSemitic = entry.language === 'Hebrew' || entry.language === 'Aramaic';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-background border border-accents-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header con Código Strong */}
        <div className="p-5 border-b border-accents-2 flex items-center justify-between bg-accents-1/50">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${
                entry.language === 'Greek'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : entry.language === 'Aramaic'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
              }`}
            >
              {entry.strong}
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Léxico y Diccionario Strong Exegético
              </h3>
              <p className="text-xs text-accents-4">
                Lengua: <strong className="text-foreground">{entry.language === 'Greek' ? 'Griego Koiné' : entry.language === 'Aramaic' ? 'Arameo Imperial' : 'Hebreo Bíblico'}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-accents-4 hover:text-foreground hover:bg-accents-2 transition-colors cursor-pointer"
            aria-label="Cerrar léxico"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo del Léxico */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Card Principal de la Palabra y Audio */}
          <div className="p-5 rounded-2xl bg-accents-1/60 border border-accents-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <div
                dir={isHebrewSemitic ? 'rtl' : 'ltr'}
                lang={isHebrewSemitic ? 'he' : 'el'}
                className="text-4xl font-serif font-bold text-foreground tracking-wide"
                style={{
                  fontFamily: isHebrewSemitic
                    ? '"SBL Hebrew", "Ezra SIL", serif'
                    : '"SBL Greek", "Gentium Plus", serif',
                }}
              >
                {entry.lemma}
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-mono">
                <span className="text-foreground font-semibold">/{entry.transliteration}/</span>
                <span className="text-accents-4">•</span>
                <span className="text-accents-5 font-mono">{entry.ipa}</span>
              </div>
              <div className="text-[11px] text-accents-4">
                Guía fonética: <span className="font-semibold text-foreground">{entry.pronunciationGuide}</span>
              </div>
            </div>

            {/* Botón de Reproducción Fonética Bíblica Auténtica */}
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isPlayingAudio
                  ? 'bg-amber-500 text-black animate-pulse'
                  : 'bg-foreground text-background hover:bg-foreground/90 active:scale-95'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                  </span>
                  <span>Reproduciendo...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span>Escuchar Audio</span>
                </>
              )}
            </button>
          </div>

          {/* Definición Concisa */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-accents-4">
              Definición Concisa
            </h4>
            <p className="text-sm font-semibold text-foreground bg-accents-1 p-3.5 rounded-xl border border-accents-2">
              {entry.shortDefinition}
            </p>
          </div>

          {/* Ficha Gramatical y Ocurrencias */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-accents-1 border border-accents-2">
              <span className="text-[10px] font-mono text-accents-4 block">Categoría:</span>
              <span className="font-semibold text-foreground">{entry.partOfSpeech}</span>
            </div>

            {entry.root && (
              <div className="p-3 rounded-xl bg-accents-1 border border-accents-2">
                <span className="text-[10px] font-mono text-accents-4 block">Raíz Léxica:</span>
                <span className="font-serif font-bold text-foreground" dir={isHebrewSemitic ? 'rtl' : 'ltr'}>
                  {entry.root}
                </span>
              </div>
            )}

            {entry.occurrencesInBible && (
              <div className="p-3 rounded-xl bg-accents-1 border border-accents-2">
                <span className="text-[10px] font-mono text-accents-4 block">Apariciones en Canon:</span>
                <span className="font-mono font-bold text-blue-500">{entry.occurrencesInBible} veces</span>
              </div>
            )}
          </div>

          {/* Definición Exegética Ampliada (BDB / Thayer) */}
          {entry.extendedDefinition && entry.extendedDefinition.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-accents-4">
                Acepciones y Desglose Exegético (Brown-Driver-Briggs / Thayer)
              </h4>
              <div className="space-y-2 bg-accents-1 p-4 rounded-xl border border-accents-2 text-xs leading-relaxed text-accents-5">
                {entry.extendedDefinition.map((def, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-accents-4 font-mono font-bold select-none">•</span>
                    <span>{def}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Importancia Teológica */}
          {entry.theologicalSignificance && (
            <div className="space-y-1.5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-2 font-mono font-bold text-amber-500 uppercase text-[10px]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Significado Teológico / Exegético
              </div>
              <p className="text-accents-5 leading-relaxed">
                {entry.theologicalSignificance}
              </p>
            </div>
          )}

          {/* Equivalentes de traducción */}
          {entry.translationEquivalents && (
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-mono text-accents-4 uppercase block">
                Traducciones frecuentes en Reina Valera 1960:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {entry.translationEquivalents.map((eq, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-accents-2 text-accents-5 font-medium text-[11px]"
                  >
                    «{eq}»
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-accents-2 bg-accents-1/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Cerrar Léxico
          </button>
        </div>
      </div>
    </div>
  );
};
