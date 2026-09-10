'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwareHeaderNav } from '../../components/SoftwareHeaderNav';
import { SoftwareFooter } from '../../components/SoftwareFooter';
import { BlogGrid } from '../../features/blog/components/BlogGrid';
import { useBlog } from '../../features/blog/hooks/useBlog';

export default function BlogCategoryPage() {
  const tBlog = useTranslations('Blog');
  const [search, setSearch] = useState('');
  const { posts, loading, error } = useBlog(search);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24">
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory="blog"
          backHref="/software"
          backLabel="Software"
        />

        {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
        <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-8">
          <header className="text-center space-y-3 pb-6 border-b border-white/5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase text-[var(--chip-text)]">
              {tBlog('badge')}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
              {tBlog('title')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              {tBlog('subtitle')}
            </p>

            <div className="relative max-w-md mx-auto pt-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tBlog('searchPlaceholder')}
                className="w-full px-5 py-3 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
              />
            </div>
          </header>

          <main>
            <BlogGrid posts={posts} loading={loading} error={error} />
          </main>
        </div>
      </div>

      <SoftwareFooter />
    </div>
  );
}
