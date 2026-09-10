'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ForumSection } from '../../features/forum/components/ForumSection';

export default function ForumCategoryPage() {
  const tNav = useTranslations('Nav');
  const tForum = useTranslations('Forum');

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
          {tForum('badge')}
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--header-title)] mb-3">
          {tForum('title')}
        </h1>

        <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
          {tForum('subtitle')}
        </p>
      </header>

      <main>
        <ForumSection />
      </main>
    </div>
  );
}
