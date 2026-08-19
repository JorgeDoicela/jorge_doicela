'use client';

import React from 'react';
import { GreekToken } from '../types';

interface GreekMorphologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: GreekToken | null;
}

export const GreekMorphologyModal: React.FC<GreekMorphologyModalProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-background border border-accents-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-accents-2 flex items-center justify-between bg-accents-1/50">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-background border border-accents-2 flex items-center justify-center font-mono text-xs font-bold text-foreground">
              {token.strong}
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Análisis Morfológico Griego Koiné
              </h3>
              <p className="text-xs text-accents-4">
                Novum Testamentum Graece (NA28 / SBLGNT / Textus Receptus)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-accents-4 hover:text-foreground hover:bg-accents-2 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Palabra en tamaño grande */}
          <div className="text-center p-4 rounded-xl bg-accents-1/40 border border-accents-2 space-y-2">
            <div
              lang="el"
              className="text-4xl font-serif text-foreground"
              style={{
                fontFamily:
                  '"Gentium Plus", "SBL Greek", "Cardo", "Georgia", "Times New Roman", serif',
              }}
            >
              {token.greek}
            </div>
            <div className="text-sm font-mono text-accents-5 font-medium">
              /{token.transliteration}/
            </div>
            <div className="text-base font-semibold text-foreground">
              «{token.gloss}»
            </div>
            <div className="text-xs font-mono text-accents-4 pt-1">
              Lema: <strong className="text-foreground">{token.lemma}</strong>
            </div>
          </div>

          {/* Ficha de parsing gramatical */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-accents-4">
              Desglose Gramatical (Robinson Tag: {token.morphologyCode})
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2 col-span-2">
                <span className="text-accents-4 block text-[10px] font-mono">Parsing Completo:</span>
                <span className="font-semibold text-foreground">{token.parsingSummary}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                <span className="text-accents-4 block text-[10px] font-mono">Categoría:</span>
                <span className="font-semibold text-foreground">{token.partOfSpeech}</span>
              </div>

              {token.case && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Caso Gramatical:</span>
                  <span className="font-semibold text-blue-500">{token.case}</span>
                </div>
              )}

              {token.tense && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Tiempo Verbal:</span>
                  <span className="font-semibold text-emerald-500">{token.tense}</span>
                </div>
              )}

              {token.voice && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Voz Verbal:</span>
                  <span className="font-semibold text-foreground">{token.voice}</span>
                </div>
              )}

              {token.mood && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Modo Verbal:</span>
                  <span className="font-semibold text-purple-500">{token.mood}</span>
                </div>
              )}

              {token.gender && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Género y Número:</span>
                  <span className="font-semibold text-foreground">
                    {token.gender} {token.number || ''}
                  </span>
                </div>
              )}

              {token.person && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Persona:</span>
                  <span className="font-semibold text-foreground">{token.person}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notas Exegéticas */}
          {token.notes && (
            <div className="p-3.5 rounded-xl bg-accents-1 border border-accents-2 text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-accents-5">
                Nota Exegética & Teológica:
              </span>
              <p className="text-accents-5 leading-relaxed">{token.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-accents-2 bg-accents-1/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
