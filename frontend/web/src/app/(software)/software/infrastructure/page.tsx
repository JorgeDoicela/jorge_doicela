'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../widgets/page-layout';
import {
  InfrastructureGrid,
  useInfrastructure,
  useInfrastructureCategories,
} from '../../entities/infrastructure';
import { CategoryFilterBar } from '../../shared/ui';

export default function InfrastructureCategoryPage() {
  const tNav = useTranslations('Nav');
  const tInfra = useTranslations('Infrastructure');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { categories, loading: categoriesLoading } = useInfrastructureCategories();
  const { posts, loading, error } = useInfrastructure(category, undefined, undefined, search);

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

            <CategoryFilterBar
              options={categories}
              selectedId={category}
              onSelect={setCategory}
              loading={categoriesLoading}
              accentColor="emerald"
              showCount={true}
            />
          </div>
        </header>

        {/* Grilla de Guías de Infraestructura */}
        <InfrastructureGrid posts={posts} loading={loading} error={error} />
      </div>
    </SoftwarePageLayout>
  );
}
