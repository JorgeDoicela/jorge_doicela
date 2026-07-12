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
    <div className="relative inline-block w-full sm:w-auto">
      <select
        value={selectedTranslationId ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onSelectTranslation(val ? Number(val) : null);
        }}
        className="w-full sm:w-auto pl-3 pr-8 py-1.5 bg-background border border-accents-2 hover:border-accents-4 text-foreground rounded-md text-xs font-medium focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all duration-150 cursor-pointer appearance-none select-none"
      >
        <option value="">Todas las Versiones</option>
        {translations.map((translation) => (
          <option key={translation.id} value={translation.id}>
            {translation.name} ({translation.abbreviation})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-accents-4">
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </div>
    </div>
  );
}

