'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export type SoftwareSection =
  | 'all'
  | 'news'
  | 'blog'
  | 'forum'
  | 'ai'
  | 'cybersecurity'
  | 'tutorials'
  | 'projects';

interface CategoryNavProps {
  selectedCategory: SoftwareSection;
  onSelectCategory: (cat: SoftwareSection) => void;
}

export const SOFTWARE_CATEGORY_KEYS: { id: SoftwareSection; key: string }[] = [
  { id: 'all', key: 'all' },
  { id: 'news', key: 'news' },
  { id: 'blog', key: 'blog' },
  { id: 'ai', key: 'ai' },
  { id: 'cybersecurity', key: 'cybersecurity' },
  { id: 'tutorials', key: 'tutorials' },
  { id: 'forum', key: 'forum' },
  { id: 'projects', key: 'projects' },
];

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  const t = useTranslations('Nav');


  return (
    <nav aria-label={t('all')} className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl glass-concave-panel scrollbar-none w-fit max-w-full">
        {SOFTWARE_CATEGORY_KEYS.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'glass-convex-panel text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{t(cat.key as any)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

