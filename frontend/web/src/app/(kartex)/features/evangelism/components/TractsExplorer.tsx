'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EvangelismTract } from '../types';
import { Copy, Check } from 'lucide-react';

interface TractsExplorerProps {
  tracts: EvangelismTract[];
  selectedTract: EvangelismTract | null;
  onSelectTract: (id: string) => void;
  isLoading: boolean;
}

export const TractsExplorer: React.FC<TractsExplorerProps> = ({
  tracts,
  selectedTract,
  onSelectTract,
  isLoading,
}) => {
  const t = useTranslations('Evangelism');
  const [copied, setCopied] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-accents-2/40 rounded-xl w-64" />
        <div className="h-72 bg-accents-2/30 rounded-2xl" />
      </div>
    );
  }

  if (!selectedTract) {
    return (
      <div className="p-8 text-center border border-accents-2 rounded-xl text-accents-4">
        {t('noTracts')}
      </div>
    );
  }

  const handleCopyFullTract = () => {
    const text = [
      selectedTract.title,
      '---',
      selectedTract.summary,
      '',
      ...(selectedTract.fullOutline || []).map(
        (p) => `${p.heading}\nPasaje: ${p.passage}\n${p.exposition}\n${p.illustration ? `Ilustración: ${p.illustration}\n` : ''}`,
      ),
      '---',
      `Oración de fe: "${selectedTract.prayerOfFaith}"`,
      '',
      'Próximos pasos:',
      ...(selectedTract.nextSteps || []).map((s) => `- ${s}`),
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Selector de Tratados y Bosquejos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-accents-2 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {tracts.map((tract) => {
            const isSelected = tract.id === selectedTract.id;
            return (
              <button
                key={tract.id}
                type="button"
                onClick={() => onSelectTract(tract.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'bg-accents-1 text-accents-5 hover:text-foreground hover:bg-accents-2 border border-accents-2'
                }`}
              >
                {tract.title}
              </button>
            );
          })}
        </div>

        {/* Botón de Copiar Tratado Completo */}
        <button
          type="button"
          onClick={handleCopyFullTract}
          className="h-8 px-3 rounded-lg border border-accents-2 bg-background hover:bg-accents-1 text-xs font-medium text-foreground flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-foreground" />
              <span className="font-semibold">{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t('copyOutlineBtn')}</span>
            </>
          )}
        </button>
      </div>

      {/* Encabezado del Tratado */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-accents-4 block">
          {selectedTract.targetAudience || t('generalAudience')}
        </span>
        <h2 className="text-xl font-bold text-foreground">
          {selectedTract.title}
        </h2>
        <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
          {selectedTract.summary}
        </p>
      </div>

      {/* Puntos del Bosquejo / Tratado */}
      <div className="space-y-4">
        {(selectedTract.fullOutline || []).map((point, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-accents-2 bg-background space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2 border-b border-accents-2/60 pb-2">
              <h3 className="text-sm font-bold text-foreground">
                {point.heading}
              </h3>
              <span className="text-[11px] font-mono font-semibold text-foreground shrink-0">
                {point.passage}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {point.exposition}
            </p>

            {point.illustration && (
              <p className="text-xs text-accents-5 italic pt-1 border-t border-accents-2/60">
                <span className="font-mono text-[10px] uppercase font-semibold text-accents-4 not-italic mr-1.5">
                  Ilustración:
                </span>
                {point.illustration}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modelo de Oración de Fe */}
      {selectedTract.prayerOfFaith && (
        <div className="space-y-2 pt-4 border-t border-accents-2">
          <h3 className="text-xs font-mono uppercase font-semibold text-accents-4 tracking-wider">
            {t('prayerOfFaithTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-foreground font-serif italic leading-relaxed border-l-2 border-foreground pl-4 py-1">
            "{selectedTract.prayerOfFaith}"
          </p>
          <span className="text-[10px] text-accents-4 block font-mono">
            {t('prayerDisclaimer')}
          </span>
        </div>
      )}

      {/* Próximos Pasos para el Crecimiento Espiritual */}
      {selectedTract.nextSteps && selectedTract.nextSteps.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-accents-2">
          <h3 className="text-xs font-mono uppercase font-semibold text-accents-4 tracking-wider">
            {t('nextStepsTitle')}
          </h3>
          <ul className="space-y-2">
            {selectedTract.nextSteps.map((step, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-2">
                <span className="text-xs font-mono font-bold text-accents-4 shrink-0">
                  {i + 1}.
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
