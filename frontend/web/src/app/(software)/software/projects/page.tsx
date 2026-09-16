'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../widgets/page-layout';
import { ProjectGrid } from '../../entities/projects';

export default function ProjectsCategoryPage() {
  const tNav = useTranslations('Nav');
  const tProjects = useTranslations('Projects');
  const tFilters = useTranslations('Filters');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const statuses = [
    { id: 'all', label: tFilters('allProjects') },
    { id: 'active', label: tFilters('inProduction') },
    { id: 'wip', label: tFilters('inDevelopment') },
  ];

  return (
    <SoftwarePageLayout
      activeCategory="projects"
      backHref="/"
      backLabel={tNav('home')}
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {tProjects('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {tProjects('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tProjects('searchPlaceholder')}
                className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {statuses.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatus(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    status === s.id
                      ? 'glass-btn-neumorphic text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main>
          <ProjectGrid status={status} search={search} />
        </main>
      </div>
    </SoftwarePageLayout>
  );
}
