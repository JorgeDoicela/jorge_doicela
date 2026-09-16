'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../widgets/page-layout';
import { InfrastructureGrid, useInfrastructure } from '../../entities/infrastructure';

export default function InfrastructureCategoryPage() {
  const tNav = useTranslations('Nav');
  const tInfra = useTranslations('Infrastructure');
  const tFilters = useTranslations('Filters');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'smart' | 'recent' | 'views' | 'difficulty'>('smart');
  const { posts, loading, error } = useInfrastructure(category, undefined, undefined, search, sortBy);

  const categories = [
    { id: 'all', label: tFilters('allCategories') },
    { id: 'servers', label: tInfra('catServers') },
    { id: 'cloud', label: tInfra('catCloud') },
    { id: 'containers', label: tInfra('catContainers') },
    { id: 'networking', label: tInfra('catNetworking') },
    { id: 'ci_cd', label: tInfra('catCiCd') },
    { id: 'hardening', label: tInfra('catHardening') },
  ];

  const sortOptions = [
    { id: 'smart', label: tFilters('sortSmart') },
    { id: 'recent', label: tFilters('sortRecent') },
    { id: 'views', label: tFilters('sortViews') },
    { id: 'difficulty', label: tFilters('sortDifficulty') },
  ];

  return (
    <SoftwarePageLayout
      activeCategory="infrastructure"
      backHref="/"
      backLabel={tNav('home')}
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {tInfra('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {tInfra('subtitle')}
          </p>

          {/* Controles de Búsqueda y Categorías */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tInfra('searchPlaceholder')}
                className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none max-w-full">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    category === c.id
                      ? 'glass-btn-neumorphic text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barra de Ordenación Inteligente Multi-Criterio */}
          <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
            <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mr-1 font-medium">
              {tFilters('sortBy')}
            </span>
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id as 'smart' | 'recent' | 'views' | 'difficulty')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                  sortBy === opt.id
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-600/30 dark:border-emerald-500/40 shadow-sm shadow-emerald-500/10 dark:shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.08] border border-black/10 dark:border-white/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </header>

        {/* Grilla de Guías de Infraestructura */}
        <InfrastructureGrid posts={posts} loading={loading} error={error} />
      </div>
    </SoftwarePageLayout>
  );
}
