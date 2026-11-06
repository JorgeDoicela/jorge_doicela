'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { DoiceladevPageLayout } from '../../widgets/page-layout';
import { useTagsHub } from '../../entities/tags';

export default function TagsDirectoryPage() {
  const tNav = useTranslations('Nav');
  const t = useTranslations('TagsHub');
  const [search, setSearch] = useState('');
  const { tags, loading, error } = useTagsHub();

  const filteredTags = useMemo(() => {
    if (!search.trim()) return tags;
    const term = search.trim().toLowerCase();
    return tags.filter(
      (tag) =>
        tag.label.toLowerCase().includes(term) ||
        tag.slug.toLowerCase().includes(term),
    );
  }, [tags, search]);

  return (
    <DoiceladevPageLayout
      activeCategory="tags"
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
                className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner transition-all duration-200"
              />
            </div>
          </div>
        </header>

        <main>
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-12 rounded-xl glass-convex-panel animate-pulse"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="p-6 rounded-2xl glass-concave-panel text-center text-red-500 font-mono text-sm">
              {error}
            </div>
          )}

          {!loading && !error && filteredTags.length === 0 && (
            <div className="py-16 text-center text-slate-500 dark:text-zinc-400 font-mono text-sm">
              {t('emptySearch')}
            </div>
          )}

          {!loading && !error && filteredTags.length > 0 && (
            <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
              {filteredTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-convex-panel border border-slate-200/80 dark:border-white/[0.07] hover:border-cyan-500/30 dark:hover:border-white/15 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-95 shrink-0"
                >
                  <span className="text-cyan-600/70 dark:text-cyan-400/70 font-semibold font-mono text-xs">
                    #
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-slate-800 dark:text-zinc-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {tag.label || tag.slug}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </DoiceladevPageLayout>
  );
}
