'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../components/SoftwarePageLayout';
import { BlogGrid } from '../../features/blog/components/BlogGrid';
import { useBlog } from '../../features/blog/hooks/useBlog';

export default function BlogCategoryPage() {
  const tBlog = useTranslations('Blog');
  const [search, setSearch] = useState('');
  const { posts, loading, error } = useBlog(search);

  return (
    <SoftwarePageLayout
      activeCategory="blog"
      backHref="/software"
      backLabel="Software"
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel shadow-2xl space-y-8">
        <header className="text-center space-y-3 pb-6 border-b border-black/5 dark:border-white/5">

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {tBlog('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-light leading-relaxed">
            {tBlog('subtitle')}
          </p>

          <div className="relative max-w-md mx-auto pt-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tBlog('searchPlaceholder')}
              className="w-full px-5 py-3 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </header>

        <main>
          <BlogGrid posts={posts} loading={loading} error={error} />
        </main>
      </div>
    </SoftwarePageLayout>
  );
}
