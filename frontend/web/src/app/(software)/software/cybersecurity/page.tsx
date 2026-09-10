'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SoftwareHeaderNav } from '../../components/SoftwareHeaderNav';
import { SoftwareFooter } from '../../components/SoftwareFooter';
import { SecurityGrid } from '../../features/cybersecurity/components/SecurityGrid';
import { useCybersecurity } from '../../features/cybersecurity/hooks/useCybersecurity';

export default function CybersecurityCategoryPage() {
  const tSec = useTranslations('Cybersecurity');
  const tFilters = useTranslations('Filters');
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const { posts, loading, error } = useCybersecurity(severity, undefined, search);

  const severities = [
    { id: 'all', label: tFilters('allSeverities') },
    { id: 'CRITICAL', label: tFilters('critical') },
    { id: 'HIGH', label: tFilters('high') },
    { id: 'MEDIUM', label: tFilters('medium') },
    { id: 'LOW', label: tFilters('low') },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24">
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory="cybersecurity"
          backHref="/software"
          backLabel="Software"
        />

        {/* Contenedor Unificado Editorial Neumorphic + Glassmorphic */}
        <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-8">
          <header className="text-center space-y-4 pb-6 border-b border-white/5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase text-[var(--chip-text)]">
              {tSec('badge')}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
              {tSec('title')}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
              {tSec('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={tSec('searchPlaceholder')}
                  className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 shadow-inner"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {severities.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeverity(s.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      severity === s.id
                        ? 'glass-btn-neumorphic text-rose-400 font-bold'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main>
            <SecurityGrid posts={posts} loading={loading} error={error} />
          </main>
        </div>
      </div>

      <SoftwareFooter />
    </div>
  );
}
