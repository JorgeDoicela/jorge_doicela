'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSoftwareHub } from '../features/hub/hooks/useSoftwareHub';
import { SpotlightModal } from '../features/os/components/SpotlightModal';
import { SoftwareCard } from '../components/SoftwareCard';
import { SoftwareFooter } from '../components/SoftwareFooter';
import { SoftwareHeaderNav } from '../components/SoftwareHeaderNav';

export default function SoftwarePage() {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Consulta consolidada de alto rendimiento (1 única petición HTTP)
  const {
    featured: topFeatured,
    feed: latestFeed,
    spotlightData,
    loading: isLoadingCurrent,
  } = useSoftwareHub(search);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('spotlight') === 'true') {
        setIsSpotlightOpen(true);
      }
    }
  }, []);

  return (
    <>
      {/* 1. SPOTLIGHT COMMAND PALETTE MODAL (CMD + K) */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        news={spotlightData.news}
        posts={spotlightData.posts}
        topics={spotlightData.topics}
        aiResources={spotlightData.aiResources}
        secPosts={spotlightData.secPosts}
        tutorials={spotlightData.tutorials}
        projects={spotlightData.projects}
        infraPosts={spotlightData.infraPosts}
      />

      {/* 2. CONTENIDO PRINCIPAL ESTILO EDITORIAL TECH */}
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-6 sm:px-6 lg:px-8 2xl:px-12 space-y-10 sm:space-y-12 flex-1 pb-16 md:pb-24">
          
          {/* CABECERA EDITORIAL DE MARCA REUTILIZABLE (ESTILO MALWARETECH) */}
          <SoftwareHeaderNav
            activeCategory="all"
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
          />

          {/* SECCIÓN 1: FEATURED POSTS (PODIO GLOBAL TOP 3 POR SMARTSCORE) */}
          <section className="animate-in fade-in duration-300">
            {/* Contenedor Único para las 3 Publicaciones Destacadas */}
            <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                  {tHome('featuredPosts')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoadingCurrent && topFeatured.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`feat-pulse-${i}`}
                      className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center glass-concave-panel"
                    >
                      {tCommon('loading')}
                    </div>
                  ))
                ) : (
                  topFeatured.map((item) => (
                    <SoftwareCard
                      key={item.id}
                      href={item.href}
                      title={item.title}
                      category={item.category}
                      subCategory={item.subCategory}
                      coverImage={item.coverImage}
                      tag={item.tag}
                      categoryMeta={item.categoryMeta}
                      excerpt={item.excerpt}
                      priority={true}
                      accentHoverColor={item.accentHoverColor}
                    />
                  ))
                )}
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: LATEST POSTS / FEED CRONOLÓGICO UNIFICADO */}
          <section className="animate-in fade-in duration-300">
            {/* Contenedor Único para toda la Grilla de Publicaciones */}
            <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                  {tHome('latestPosts')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingCurrent && latestFeed.length === 0 && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-zinc-400">
                    <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs font-mono tracking-wider uppercase text-zinc-500">{tCommon('loading')}</p>
                  </div>
                )}

                {!isLoadingCurrent && latestFeed.length === 0 && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-zinc-500 glass-concave-panel rounded-2xl border border-white/5">
                    <p className="text-sm font-medium text-zinc-400">{tCommon('notFound')}</p>
                  </div>
                )}

                {latestFeed.map((item) => (
                  <SoftwareCard
                    key={item.id}
                    href={item.href}
                    title={item.title}
                    category={item.category}
                    subCategory={item.subCategory}
                    coverImage={item.coverImage}
                    tag={item.tag}
                    categoryMeta={item.categoryMeta}
                    excerpt={item.excerpt}
                    accentHoverColor={item.accentHoverColor}
                  />
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* FOOTER MULTICOLUMNA ELEGANTE DE ANCHO COMPLETO (ESTILO MALWARETECH) */}
        <SoftwareFooter />
      </main>
    </>
  );
}
