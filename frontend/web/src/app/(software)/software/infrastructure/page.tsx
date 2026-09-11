'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwareHeaderNav } from '../../components/SoftwareHeaderNav';
import { SoftwareFooter } from '../../components/SoftwareFooter';
import { InfrastructureGrid } from '../../features/infrastructure/components/InfrastructureGrid';
import { useInfrastructure } from '../../features/infrastructure/hooks/useInfrastructure';

export default function InfrastructureCategoryPage() {
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
    { id: 'smart', label: '★ Relevancia Arquitectónica' },
    { id: 'recent', label: 'Más Recientes' },
    { id: 'views', label: 'Más Populares' },
    { id: 'difficulty', label: 'Mayor Complejidad' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24">
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory="infrastructure"
          backHref="/software"
          backLabel="Software"
        />

        {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
        <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-8">
          <header className="text-center space-y-4 pb-6 border-b border-white/5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase text-emerald-400">
              {tInfra('badge')}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
              {tInfra('title')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
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
                        ? 'glass-btn-neumorphic text-emerald-400 font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de Ordenación Inteligente Multi-Criterio */}
            <div className="flex items-center justify-center gap-2 pt-3 flex-wrap">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
                Ordenar por:
              </span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-bold'
                      : 'text-zinc-500 hover:text-zinc-300 bg-black/10 dark:bg-white/[0.03] border border-white/5'
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
      </div>

      <SoftwareFooter />
    </div>
  );
}
