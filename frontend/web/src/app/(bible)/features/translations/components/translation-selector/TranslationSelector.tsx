'use client';

import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';

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
    return <div className="text-accents-5 text-sm animate-pulse">Cargando versiones...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm font-medium">Error: {error}</div>;
  }

  return (
    <div className="flex gap-2">
      <select
        value={selectedTranslationId ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onSelectTranslation(val ? Number(val) : null);
        }}
        className="px-3 py-1.5 bg-background border border-border rounded-md text-foreground focus:outline-none focus:border-accents-5 text-xs transition-colors duration-200 cursor-pointer"
      >
        <option value="">Todas las Versiones</option>
        {translations.map((translation) => (
          <option key={translation.id} value={translation.id}>
            {translation.name} ({translation.abbreviation})
          </option>
        ))}
      </select>
    </div>
  );
}

