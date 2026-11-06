'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DoiceladevPageLayout } from '../../widgets/page-layout';
import { BlogGrid, useBlog, useBlogCategories } from '../../entities/blog';
import { ModuleFilterToolbar } from '../../shared/ui';

export default function BlogCategoryPage() {
  const tNav = useTranslations('Nav');
  const tBlog = useTranslations('Blog');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { categories, loading: categoriesLoading } = useBlogCategories();
  const { posts, loading, error } = useBlog(category, search);

  return (
    <DoiceladevPageLayout
      activeCategory="blog"
      backHref="/"
      backLabel={tNav('home')}
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {tBlog('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {tBlog('subtitle')}
          </p>

          {/* Controles de Búsqueda y Categorías Unificados */}
          <ModuleFilterToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder={tBlog('searchPlaceholder')}
            options={categories}
            selectedId={category}
            onSelect={setCategory}
            loading={categoriesLoading}
            accentColor="blue"
          />
        </header>

        <main>
          <BlogGrid posts={posts} loading={loading} error={error} />
        </main>
      </div>
    </DoiceladevPageLayout>
  );
}
