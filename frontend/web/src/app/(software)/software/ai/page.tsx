'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../widgets/page-layout';
import { AiGrid, useAi, useAiCategories } from '../../entities/ai';
import { CategoryFilterBar } from '../../shared/ui';

export default function AiCategoryPage() {
  const tNav = useTranslations('Nav');
  const t = useTranslations('Ai');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const { categories, loading: categoriesLoading } = useAiCategories();
  const { resources, loading, error } = useAi(type, search);

  return (
    <SoftwarePageLayout
      activeCategory="ai"
      backHref="/"
      backLabel={tNav('home')}
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {t('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner"
              />
            </div>

            <CategoryFilterBar
              options={categories}
              selectedId={type}
              onSelect={setType}
              loading={categoriesLoading}
              accentColor="purple"
              showCount={true}
            />
          </div>
        </header>

        <main>
          <AiGrid resources={resources} loading={loading} error={error} />
        </main>
      </div>
    </SoftwarePageLayout>
  );
}
