'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwareHeaderNav } from '../../components/SoftwareHeaderNav';
import { SoftwareFooter } from '../../components/SoftwareFooter';
import { AiGrid } from '../../features/ai/components/AiGrid';
import { useAi } from '../../features/ai/hooks/useAi';

export default function AiCategoryPage() {
  const tNav = useTranslations('Nav');
  const t = useTranslations('Ai');
  const tFilters = useTranslations('Filters');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const { resources, loading, error } = useAi(type, search);

  const filterTypes = [
    { id: 'all', label: tFilters('allTypes') },
    { id: 'llm', label: tFilters('llmModels') },
    { id: 'agent', label: tFilters('agenticFrameworks') },
    { id: 'mcp_server', label: tFilters('mcpServers') },
    { id: 'tool', label: tFilters('tools') },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-[1490px] 2xl:max-w-[1620px] px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24">
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory="ai"
          backHref="/"
          backLabel={tNav('home')}
        />

        {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
        <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
          <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
              {t('title')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-4xl lg:max-w-5xl mx-auto font-normal dark:font-light leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {filterTypes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setType(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      type === item.id
                        ? 'glass-btn-neumorphic text-purple-600 dark:text-purple-400 font-bold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main>
            <AiGrid resources={resources} loading={loading} error={error} />
          </main>
        </div>
      </div>

      <SoftwareFooter />
    </div>
  );
}
