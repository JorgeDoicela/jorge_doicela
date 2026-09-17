'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwarePageLayout } from '../../widgets/page-layout';
import { useForum, useForumCategories, TopicCard } from '../../entities/forum';
import { CategoryFilterBar } from '../../shared/ui';

export default function ForumCategoryPage() {
  const tNav = useTranslations('Nav');
  const tForum = useTranslations('Forum');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { categories, loading: categoriesLoading } = useForumCategories();
  const { topics, loading, error } = useForum(category, search);

  return (
    <SoftwarePageLayout
      activeCategory="forum"
      backHref="/"
      backLabel={tNav('home')}
    >
      {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {tForum('title')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
            {tForum('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tForum('searchPlaceholder')}
                className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner"
              />
            </div>

            <CategoryFilterBar
              options={categories}
              selectedId={category}
              onSelect={setCategory}
              loading={categoriesLoading}
              accentColor="purple"
            />
          </div>
        </header>

        <main>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 rounded-3xl glass-convex-panel bg-zinc-900/30" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl glass-concave-panel text-center text-rose-400 text-sm">
              {error}
            </div>
          ) : topics.length === 0 ? (
            <div className="p-12 rounded-3xl glass-concave-panel text-center text-zinc-500 text-sm">
              {tForum('noTopics')}
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((t) => (
                <TopicCard key={t.id} topic={t} />
              ))}
            </div>
          )}
        </main>
      </div>
    </SoftwarePageLayout>
  );
}
