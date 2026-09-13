'use client';

import { useTranslations } from 'next-intl';
import { SoftwareHeaderNav } from '../../components/SoftwareHeaderNav';
import { SoftwareFooter } from '../../components/SoftwareFooter';
import { ForumSection } from '../../features/forum/components/ForumSection';

export default function ForumCategoryPage() {
  const tNav = useTranslations('Nav');
  const tForum = useTranslations('Forum');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-[1490px] 2xl:max-w-[1620px] px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24">
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory="forum"
          backHref="/"
          backLabel={tNav('home')}
        />

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
      </div>

      <SoftwareFooter />
    </div>
  );
}
