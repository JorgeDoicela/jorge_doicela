'use client';

import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { ChevronDown } from 'lucide-react';

interface TranslationSelectorProps {
  selectedTranslationId: number | null;
  onSelectTranslation: (id: number | null) => void;
}

export function TranslationSelector({
  selectedTranslationId,
  onSelectTranslation,
}: TranslationSelectorProps) {
  const { translations, loading, error } = useTranslations();

  if (loading) {
    return (
      <div className="h-8 w-36 animate-pulse bg-accents-1 border border-accents-2 rounded-md" />
    );
  }

  if (error) {
    return <div className="text-red-500 text-xs font-mono">Error: {error}</div>;
  }

  return (
    <div className="relative inline-block max-w-[120px] xs:max-w-[150px] sm:max-w-[220px]">
      <select
        value={selectedTranslationId ?? (translations[0]?.id || 1)}
        onChange={(e) => {
          const val = e.target.value;
          onSelectTranslation(val ? Number(val) : (translations[0]?.id || 1));
        }}
        className="w-full pl-2 sm:pl-3 pr-6 sm:pr-8 py-1 sm:py-1.5 bg-background border border-accents-2 hover:border-accents-4 text-foreground rounded-lg text-[11px] sm:text-xs font-medium focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all duration-150 cursor-pointer appearance-none select-none truncate"
      >
        {translations.map((translation) => (
          <option key={translation.id} value={translation.id}>
            {translation.name} ({translation.abbreviation})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2.5 text-accents-4">
        <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
      </div>
    </div>
  );
}

