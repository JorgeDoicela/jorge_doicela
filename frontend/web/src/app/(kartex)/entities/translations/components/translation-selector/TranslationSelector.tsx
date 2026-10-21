'use client';

import React from 'react';
import { useTranslations as useI18n } from 'next-intl';
import { useTranslations } from '../../hooks/useTranslations';
import { KartexSelect, KartexSelectOption } from '../../../../shared/ui';

interface TranslationSelectorProps {
  selectedTranslationId: number | null;
  onSelectTranslation: (id: number | null) => void;
  align?: 'left' | 'right';
  className?: string;
}

export function TranslationSelector({
  selectedTranslationId,
  onSelectTranslation,
  align = 'right',
  className = 'w-fit sm:w-56 shrink-0',
}: TranslationSelectorProps) {
  const t = useI18n('Toolbar');
  const { translations, loading, error } = useTranslations();

  if (loading) {
    return (
      <div className="h-8 w-16 sm:w-36 animate-pulse bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-lg" />
    );
  }

  if (error) {
    return <div className="text-red-500 text-xs font-mono">Error: {error}</div>;
  }

  const options: KartexSelectOption<number>[] = translations.map((tr) => ({
    value: tr.id,
    label: tr.name,
    badge: tr.abbreviation,
  }));

  const activeId = selectedTranslationId ?? (translations[0]?.id || 1);

  return (
    <KartexSelect<number>
      value={activeId}
      onChange={(newId: number) => onSelectTranslation(newId)}
      options={options}
      className={className}
      align={align}
      hideLabelOnMobile={true}
      size="sm"
      title={t('selectTranslation')}
      ariaLabel={t('selectTranslation')}
    />
  );
}
