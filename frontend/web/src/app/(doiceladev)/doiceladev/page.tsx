'use client';

import { useTranslations } from 'next-intl';
import { useDoiceladevHub, DoiceladevHubFeed } from '../entities/hub';
import { DoiceladevFooter } from '../widgets/doiceladev-footer';
import { DoiceladevHeaderNav } from '../widgets/doiceladev-header';
import { FeaturedCarousel } from '../widgets/featured-carousel';

export default function DoiceladevPage() {
  const tHome = useTranslations('Home');

  // Consulta consolidada de alto rendimiento (1 única petición HTTP)
  const {
    featured: topFeatured,
    feed: latestFeed,
    spotlightData,
    loading: isLoadingCurrent,
    error: hubError,
    refetch: refetchHub,
  } = useDoiceladevHub();

  return (
    <>
      {/* 1. CONTENIDO PRINCIPAL ESTILO EDITORIAL TECH */}
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
        <div className="w-full max-w-[1490px] 2xl:max-w-[1620px] px-6 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 flex-1 pb-16 md:pb-24">
          
          {/* CABECERA EDITORIAL DE MARCA REUTILIZABLE (ESTILO MALWARETECH) */}
          <DoiceladevHeaderNav activeCategory="all" />

          {/* SECCIÓN 1: CARRUSEL DE PUBLICACIONES DESTACADAS (SMARTSCORE DINÁMICO) */}
          <FeaturedCarousel
            items={topFeatured}
            title={tHome('featuredPosts')}
            isLoading={isLoadingCurrent}
          />

          {/* SECCIÓN 2: LATEST POSTS / FEED CRONOLÓGICO UNIFICADO (FEATURE HUB) */}
          <DoiceladevHubFeed
            feed={latestFeed}
            isLoading={isLoadingCurrent}
            error={hubError}
            onRetry={refetchHub}
          />

        </div>

        {/* FOOTER MULTICOLUMNA ELEGANTE DE ANCHO COMPLETO (ESTILO MALWARETECH) */}
        <DoiceladevFooter />
      </main>
    </>
  );
}
