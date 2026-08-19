'use client';

import React from 'react';
import { HebrewAramaicToken } from '../types';

interface MorphologyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: HebrewAramaicToken | null;
}

export const MorphologyDetailModal: React.FC<MorphologyDetailModalProps> = ({
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
                Análisis Morfológico Léxico
              </h3>
              <p className="text-xs text-accents-4">
                Lengua: <strong className="text-foreground">{token.language === 'Aramaic' ? 'Arameo Bíblico' : 'Hebreo Bíblico'}</strong>
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
              dir="rtl"
              lang="he"
              className="text-4xl font-serif text-foreground"
              style={{
                fontFamily:
                  '"SBL Hebrew", "Ezra SIL", "Frank Ruehl CLM", "David CLM", serif',
              }}
            >
              {token.hebrew}
            </div>
            <div className="text-sm font-mono text-accents-5 font-medium">
              /{token.transliteration}/
            </div>
            <div className="text-base font-semibold text-foreground">
              «{token.gloss}»
            </div>
          </div>

          {/* Ficha de parsing gramatical */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-accents-4">
              Desglose Gramatical
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                <span className="text-accents-4 block text-[10px] font-mono">Categoría:</span>
                <span className="font-semibold text-foreground">{token.partOfSpeech}</span>
              </div>

              {token.root && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Raíz Semítica:</span>
                  <span className="font-serif font-bold text-foreground" dir="rtl">
                    {token.root}
                  </span>
                </div>
              )}

              {token.binyan && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">
                    {token.language === 'Aramaic' ? 'Tema Verbal (Arameo):' : 'Binyan (Tallo):'}
                  </span>
                  <span className="font-semibold text-blue-500">{token.binyan}</span>
                </div>
              )}

              {token.aspect && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Tiempo / Aspecto:</span>
                  <span className="font-semibold text-foreground">{token.aspect}</span>
                </div>
              )}

              {token.person && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Persona:</span>
                  <span className="font-semibold text-foreground">{token.person}</span>
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

              {token.state && (
                <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                  <span className="text-accents-4 block text-[10px] font-mono">Estado Nominal:</span>
                  <span className="font-semibold text-foreground">{token.state}</span>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
                <span className="text-accents-4 block text-[10px] font-mono">Código Morfológico:</span>
                <span className="font-mono font-semibold text-emerald-500">
                  {token.morphologyCode}
                </span>
              </div>
            </div>
          </div>

          {/* Notas Exegéticas */}
          {token.notes && (
            <div className="p-3.5 rounded-xl bg-accents-1 border border-accents-2 text-xs space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-accents-5">
                Nota Exegética / Sintáctica:
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
