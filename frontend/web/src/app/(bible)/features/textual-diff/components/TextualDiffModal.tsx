'use client';

import React, { useState, useEffect } from 'react';
import { VerseComparisonData } from '../types';
import { TextualDiffViewer } from './TextualDiffViewer';
import { Translation } from '../../translations/hooks/useTranslations';

interface TextualDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: VerseComparisonData | null;
  availableTranslations: Translation[];
  allVersesByTranslation?: Record<number, { text: string; name: string; abbreviation: string }>;
}

export const TextualDiffModal: React.FC<TextualDiffModalProps> = ({
  isOpen,
  onClose,
  initialData,
  availableTranslations,
  allVersesByTranslation = {},
}) => {
  const [selectedIdA, setSelectedIdA] = useState<number | null>(null);
  const [selectedIdB, setSelectedIdB] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setSelectedIdA(initialData.translationA.id);
      setSelectedIdB(initialData.translationB.id);
    }
  }, [initialData]);

  if (!isOpen || !initialData) return null;

  // Construir datos actualizados si el usuario cambia el selector de traducción
  const dataA = (selectedIdA && allVersesByTranslation[selectedIdA]) || initialData.translationA;
  const dataB = (selectedIdB && allVersesByTranslation[selectedIdB]) || initialData.translationB;

  const currentComparison: VerseComparisonData = {
    bookName: initialData.bookName,
    chapter: initialData.chapter,
    verseNumber: initialData.verseNumber,
    translationA: {
      id: selectedIdA || initialData.translationA.id,
      abbreviation: dataA.abbreviation,
      name: dataA.name,
      text: dataA.text,
    },
    translationB: {
      id: selectedIdB || initialData.translationB.id,
      abbreviation: dataB.abbreviation,
      name: dataB.name,
      text: dataB.text,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Contenedor del Modal */}
      <div className="w-full max-w-4xl max-h-[90vh] bg-background border border-accents-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header del Modal */}
        <div className="p-5 border-b border-accents-2 flex items-center justify-between bg-accents-1/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-background border border-accents-2 flex items-center justify-center font-mono text-sm font-bold text-foreground">
              ±
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Comparador de Variantes Textuales
              </h3>
              <p className="text-xs text-accents-4">
                Análisis exegético y diferencial de redacción palabra por palabra
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-accents-4 hover:text-foreground hover:bg-accents-2 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controles de Selección de Traducciones */}
        <div className="p-4 border-b border-accents-2 bg-background grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-accents-4">Versión Base (A):</label>
            <select
              value={selectedIdA || ''}
              onChange={(e) => setSelectedIdA(parseInt(e.target.value, 10))}
              className="flex-1 bg-accents-1 border border-accents-2 rounded-md px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors cursor-pointer"
            >
              {availableTranslations.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.abbreviation} - {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-accents-4">Comparada con (B):</label>
            <select
              value={selectedIdB || ''}
              onChange={(e) => setSelectedIdB(parseInt(e.target.value, 10))}
              className="flex-1 bg-accents-1 border border-accents-2 rounded-md px-2.5 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-colors cursor-pointer"
            >
              {availableTranslations.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.abbreviation} - {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          <TextualDiffViewer comparisonData={currentComparison} />
        </div>

        {/* Footer del Modal */}
        <div className="p-4 border-t border-accents-2 bg-accents-1/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
