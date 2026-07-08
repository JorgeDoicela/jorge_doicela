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
    return <div className="text-slate-400 text-sm">Cargando versiones...</div>;
  }

  if (error) {
    return <div className="text-rose-400 text-sm">Error: {error}</div>;
  }

  return (
    <div className="flex gap-2">
      <select
        value={selectedTranslationId ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onSelectTranslation(val ? Number(val) : null);
        }}
        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
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
