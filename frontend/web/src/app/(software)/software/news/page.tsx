'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { NewsGrid } from '../../features/news/components/NewsGrid';
import { useNews } from '../../features/news/hooks/useNews';

export default function NewsCategoryPage() {
  const t = useTranslations('News');
  const tNav = useTranslations('Nav');
  const [search, setSearch] = useState('');
  const { news, loading, error } = useNews(search);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-8">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        {tNav('backToSoftware')}
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase mb-4 text-[var(--chip-text)]">
          {t('badge')}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--header-title)] mb-3">
          {t('title')}
        </h1>

        <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed mb-6">
          {t('subtitle')}
        </p>

        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full px-5 py-3 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </header>

      <main>
        <NewsGrid news={news} loading={loading} error={error} />
      </main>
    </div>
  );
}
