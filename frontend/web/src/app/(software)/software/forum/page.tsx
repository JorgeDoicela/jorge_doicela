'use client';

import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../widgets/page-layout';
import { ForumSection } from '../../features/forum-reply';

export default function ForumCategoryPage() {
  const tNav = useTranslations('Nav');
  const tForum = useTranslations('Forum');

  return (
    <SoftwarePageLayout
      activeCategory="forum"
      backHref="/"
      backLabel={tNav('home')}
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-3 pb-6 border-b border-black/5 dark:border-white/5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {tForum('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {tForum('subtitle')}
          </p>
        </header>

        <main>
          <ForumSection />
        </main>
      </div>
    </SoftwarePageLayout>
  );
}
