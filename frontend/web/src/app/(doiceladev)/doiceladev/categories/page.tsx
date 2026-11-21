'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { DoiceladevPageLayout } from '../../widgets/page-layout';
import { useCategoriesDirectory } from '../../entities/categories';
import { useFuzzyFilter } from '../../shared';
import { DoiceladevSearchInput } from '../../shared/ui';

function formatFallbackCategoryLabel(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoriesDirectoryPage() {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');
  const t = useTranslations('CategoriesDirectory');
  const [search, setSearch] = useState('');
  const { categories, loading, error } = useCategoriesDirectory();

  const localizedCategories = useMemo(
    () =>
      categories.map((cat) => {
        const key = cat.slug.trim().toLowerCase();
        const displayLabel = tFilters.has(key as never)
          ? tFilters(key as never)
          : formatFallbackCategoryLabel(key);
        return {
          ...cat,
          displayLabel,
        };
      }),
    [categories, tFilters],
  );

  const filteredCategories = useFuzzyFilter(localizedCategories, {
    search,
    searchKeys: [
      { name: 'displayLabel', weight: 2.5 },
      { name: 'slug', weight: 1.5 },
      { name: 'modules', weight: 1.0 },
    ],
  });

  return (
    <DoiceladevPageLayout
      activeCategory="categories"
      backHref="/"
      backLabel={tNav('home')}
    >
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {t('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="flex items-center justify-center pt-2">
            <DoiceladevSearchInput
              value={search}
              onChange={setSearch}
              placeholder={t('searchPlaceholder')}
              accentColor="blue"
            />
          </div>
        </header>

        <main>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  aria-hidden="true"
                  className="p-5 sm:p-6 rounded-2xl glass-convex-panel border border-slate-200/80 dark:border-white/[0.07] flex items-center min-h-[68px] sm:min-h-[76px]"
                >
                  <div className="h-5 w-3/5 bg-slate-200/70 dark:bg-white/10 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-6 rounded-2xl glass-concave-panel text-center text-red-500 font-mono text-sm">
              {error}
            </div>
          )}

          {!loading && !error && filteredCategories.length === 0 && (
            <div className="py-16 text-center text-slate-500 dark:text-zinc-400 font-mono text-sm">
              {t('emptySearch')}
            </div>
          )}

          {!loading && !error && filteredCategories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group p-5 sm:p-6 rounded-2xl glass-convex-panel border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 shadow-md hover:shadow-xl flex items-center cursor-pointer"
                >
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {cat.displayLabel}
                  </h2>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </DoiceladevPageLayout>
  );
}
