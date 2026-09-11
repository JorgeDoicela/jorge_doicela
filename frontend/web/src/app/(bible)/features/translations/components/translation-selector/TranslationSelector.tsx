'use client';

import React from 'react';
import { useTranslations as useI18n } from 'next-intl';
import { useTranslations } from '../../hooks/useTranslations';
import { BibleSelect, BibleSelectOption } from '../../../../components/BibleSelect';

interface TranslationSelectorProps {
  selectedTranslationId: number | null;
  onSelectTranslation: (id: number | null) => void;
}

export function TranslationSelector({
  selectedTranslationId,
  onSelectTranslation,
}: TranslationSelectorProps) {
  const t = useI18n('Toolbar');
  const { translations, loading, error } = useTranslations();

  if (loading) {
    return (
      <div className="h-8 w-36 animate-pulse bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-lg" />
    );
  }

  if (error) {
    return <div className="text-red-500 text-xs font-mono">Error: {error}</div>;
  }

  const options: BibleSelectOption<number>[] = translations.map((tr) => ({
    value: tr.id,
    label: tr.name,
    badge: tr.abbreviation,
  }));

  const activeId = selectedTranslationId ?? (translations[0]?.id || 1);

  return (
    <BibleSelect<number>
      value={activeId}
      onChange={(newId) => onSelectTranslation(newId)}
      options={options}
      className="w-36 sm:w-56 shrink-0"
      size="sm"
      title={t('selectTranslation')}
      ariaLabel={t('selectTranslation')}
    />
  );
}
