'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { DoiceladevPageLayout } from '../../widgets/page-layout';
import { useCategoriesHub } from '../../entities/categories';

export default function CategoriesDirectoryPage() {
  const tNav = useTranslations('Nav');
  const t = useTranslations('CategoriesHub');
  const [search, setSearch] = useState('');
  const { categories, loading, error } = useCategoriesHub();

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.trim().toLowerCase();
    return categories.filter(
      (cat) =>
        cat.label.toLowerCase().includes(term) ||
        cat.slug.toLowerCase().includes(term) ||
        cat.modules.some((m) => m.toLowerCase().includes(term)),
    );
  }, [categories, search]);

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
            <div className="relative w-full max-w-md shrink-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner transition-all duration-200"
              />
            </div>
          </div>
        </header>

        <main>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-36 rounded-2xl glass-convex-panel animate-pulse p-6 space-y-3"
                >
                  <div className="h-5 w-3/4 bg-slate-300 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-zinc-800/60 rounded-md" />
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
                  className="group p-5 sm:p-6 rounded-2xl glass-convex-panel border border-slate-200/80 dark:border-white/[0.07] hover:border-blue-500/30 dark:hover:border-white/15 transition-all duration-300 shadow-md hover:shadow-xl flex items-center cursor-pointer"
                >
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {cat.label}
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
