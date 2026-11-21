'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { DoiceladevPageLayout } from '../../widgets/page-layout';
import { useTagsDirectory } from '../../entities/tags';
import { useFuzzyFilter } from '../../shared';
import { DoiceladevSearchInput } from '../../shared/ui';

export default function TagsDirectoryPage() {
  const tNav = useTranslations('Nav');
  const t = useTranslations('TagsDirectory');
  const [search, setSearch] = useState('');
  const { tags, loading, error } = useTagsDirectory();

  const filteredTags = useFuzzyFilter(tags, {
    search,
    searchKeys: [
      { name: 'label', weight: 2.5 },
      { name: 'slug', weight: 2.0 },
    ],
  });

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
            <DoiceladevSearchInput
              value={search}
              onChange={setSearch}
              placeholder={t('searchPlaceholder')}
              accentColor="cyan"
            />
          </div>
        </header>

        <main>
          {loading && (
            <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center">
              {[
                'w-24',
                'w-32',
                'w-20',
                'w-28',
                'w-36',
                'w-24',
                'w-28',
                'w-20',
                'w-32',
                'w-24',
                'w-28',
                'w-36',
                'w-20',
                'w-28',
                'w-24',
                'w-32',
              ].map((wClass, idx) => (
                <div
                  key={idx}
                  aria-hidden="true"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-convex-panel border border-slate-200/80 dark:border-white/[0.07] shrink-0"
                >
                  <span className="text-cyan-600/50 dark:text-cyan-400/50 font-semibold font-mono text-xs select-none">
                    #
                  </span>
                  <div
                    className={`h-3.5 ${wClass} rounded bg-slate-200/70 dark:bg-white/10 animate-pulse`}
                  />
                </div>
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
                  className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-convex-panel border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-95 shrink-0"
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
