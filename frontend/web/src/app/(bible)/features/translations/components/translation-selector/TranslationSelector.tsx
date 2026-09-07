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
    <div className="relative inline-block max-w-[140px] sm:max-w-[240px]">
      <select
        value={selectedTranslationId ?? (translations[0]?.id || 1)}
        onChange={(e) => {
          const val = e.target.value;
          onSelectTranslation(val ? Number(val) : (translations[0]?.id || 1));
        }}
        className="w-full pl-2.5 sm:pl-3 pr-7 sm:pr-8 py-1.5 bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-xs font-medium focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer appearance-none select-none truncate"
        title="Seleccionar traducción bíblica"
      >
        {translations.map((translation) => (
          <option key={translation.id} value={translation.id}>
            {translation.abbreviation} · {translation.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400">
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
      </div>
    </div>
  );
}

