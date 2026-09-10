'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { VerseComparisonData } from '../types';
import { TextualDiffViewer } from './TextualDiffViewer';
import { Translation } from '../../translations/hooks/useTranslations';
import { BibleSelect, BibleSelectOption } from '../../../components/BibleSelect';

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
  const t = useTranslations('TextualDiff');
  const [selectedIdA, setSelectedIdA] = useState<number | null>(null);
  const [selectedIdB, setSelectedIdB] = useState<number | null>(null);

  useEffect(() => {
    if (initialData) {
      setSelectedIdA(initialData.translationA.id);
      setSelectedIdB(initialData.translationB.id);
    }
  }, [initialData]);

  if (!isOpen || !initialData) return null;

  const translationA = availableTranslations.find((tr) => tr.id === selectedIdA);
  const translationB = availableTranslations.find((tr) => tr.id === selectedIdB);

  const textA =
    (selectedIdA && allVersesByTranslation[selectedIdA]?.text) ||
    (translationA?.id === initialData.translationA.id
      ? initialData.translationA.text
      : translationA?.id === initialData.translationB.id
      ? initialData.translationB.text
      : '');

  const textB =
    (selectedIdB && allVersesByTranslation[selectedIdB]?.text) ||
    (translationB?.id === initialData.translationB.id
      ? initialData.translationB.text
      : translationB?.id === initialData.translationA.id
      ? initialData.translationA.text
      : '');

  const dataA = {
    id: selectedIdA || 0,
    name: translationA?.name || '',
    abbreviation: translationA?.abbreviation || '',
    text: textA,
  };

  const dataB = {
    id: selectedIdB || 0,
    name: translationB?.name || '',
    abbreviation: translationB?.abbreviation || '',
    text: textB,
  };

  const currentComparison: VerseComparisonData = {
    bookName: initialData.bookName,
    chapter: initialData.chapter,
    verseNumber: initialData.verseNumber,
    translationA: dataA,
    translationB: dataB,
  };

  const translationOptions: BibleSelectOption<number>[] = availableTranslations.map((tr) => ({
    value: tr.id,
    label: tr.name,
    badge: tr.abbreviation,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-accents-2 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="p-4 border-b border-accents-2 flex items-center justify-between bg-accents-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t('modalTitle', {
                  book: initialData.bookName,
                  chapter: initialData.chapter,
                  verse: initialData.verseNumber,
                })}
              </h3>
              <p className="text-[11px] text-accents-4">
                {t('modalSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-accents-4 hover:text-foreground hover:bg-accents-2 transition-colors cursor-pointer"
            aria-label={t('closeModal')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controles de Selección de Traducciones con BibleSelect */}
        <div className="p-4 border-b border-accents-2 bg-background grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-xs font-semibold text-accents-4 shrink-0">{t('baseVersionLabel')}</label>
            <BibleSelect<number>
              value={selectedIdA ?? (availableTranslations[0]?.id || 1)}
              onChange={(newId) => setSelectedIdA(newId)}
              options={translationOptions}
              className="flex-1 min-w-0"
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <label className="text-xs font-semibold text-accents-4 shrink-0">{t('comparedVersionLabel')}</label>
            <BibleSelect<number>
              value={selectedIdB ?? (availableTranslations[1]?.id || availableTranslations[0]?.id || 1)}
              onChange={(newId) => setSelectedIdB(newId)}
              options={translationOptions}
              className="flex-1 min-w-0"
              size="sm"
            />
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
            {t('understood')}
          </button>
        </div>
      </div>
    </div>
  );
};
