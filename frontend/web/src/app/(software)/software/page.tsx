'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSoftwareHub, SoftwareHubFeed } from '../entities/hub';
import { SpotlightModal } from '../features/spotlight-search';
import { SoftwareFooter } from '../widgets/software-footer';
import { SoftwareHeaderNav } from '../widgets/software-header';
import { FeaturedCarousel } from '../widgets/featured-carousel';

export default function SoftwarePage() {
  const tHome = useTranslations('Home');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Consulta consolidada de alto rendimiento (1 única petición HTTP)
  const {
    featured: topFeatured,
    feed: latestFeed,
    spotlightData,
    loading: isLoadingCurrent,
    error: hubError,
    refetch: refetchHub,
  } = useSoftwareHub();

  useEffect(() => {
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
        <div className="w-full max-w-[1490px] 2xl:max-w-[1620px] px-6 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 flex-1 pb-16 md:pb-24">
          
          {/* CABECERA EDITORIAL DE MARCA REUTILIZABLE (ESTILO MALWARETECH) */}
          <SoftwareHeaderNav
            activeCategory="all"
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
          />

          {/* SECCIÓN 1: CARRUSEL DE PUBLICACIONES DESTACADAS (SMARTSCORE DINÁMICO) */}
          <FeaturedCarousel
            items={topFeatured}
            title={tHome('featuredPosts')}
            isLoading={isLoadingCurrent}
          />

          {/* SECCIÓN 2: LATEST POSTS / FEED CRONOLÓGICO UNIFICADO (FEATURE HUB) */}
          <SoftwareHubFeed
            feed={latestFeed}
            isLoading={isLoadingCurrent}
            error={hubError}
            onRetry={refetchHub}
          />

        </div>

        {/* FOOTER MULTICOLUMNA ELEGANTE DE ANCHO COMPLETO (ESTILO MALWARETECH) */}
        <SoftwareFooter />
      </main>
    </>
  );
}
