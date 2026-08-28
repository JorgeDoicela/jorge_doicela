import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ConsultaHeader } from '../components/ConsultaHeader';
import { ConsultaForm } from '../components/ConsultaForm';
import ParallaxBackground from '../components/ParallaxBackground';
import InteractiveParticles from '../components/InteractiveParticles';
import CinematicSpiralGalaxy from '../components/CinematicSpiralGalaxy';
import SkipToContent from '../components/SkipToContent';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Consulta');

  return {
    title: `${t('heroTitle')} | Jorge Doicela`,
    description: t('heroSubtitle'),
    alternates: {
      canonical: 'https://jorgedoicela.com/consulta',
    },
    openGraph: {
      title: `${t('heroTitle')} | Jorge Doicela`,
      description: t('heroSubtitle'),
      url: 'https://jorgedoicela.com/consulta',
    },
  };
}

export default async function ConsultaPage() {
  const t = await getTranslations('Consulta');

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-x-hidden">
      <SkipToContent />

      {/* Capas de Fondo Cósmico y Parallax de la Landing */}
      <ParallaxBackground />
      <InteractiveParticles />
      <CinematicSpiralGalaxy />

      {/* Barra de Navegación Superior fija a los extremos */}
      <ConsultaHeader />

      {/* Contenido Principal Bento con espaciado generoso */}
      <main
        id="main-content"
        className="w-full max-w-[1440px] mx-auto px-3 sm:px-8 md:px-12 lg:px-16 z-10 flex-grow flex flex-col justify-center outline-none focus:outline-none pt-32 sm:pt-36 md:pt-40 lg:pt-44 pb-16"
        tabIndex={-1}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 xl:gap-24 items-start w-full">
          {/* Columna Izquierda: Información y los 3 pilares */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-text-subtitle mb-3 sm:mb-5">
              {t('badge')}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] sm:tracking-[-0.035em] text-foreground leading-[1.2] sm:leading-[1.1] mb-5 sm:mb-7">
              {t('heroTitle')}
            </h1>

            <p className="text-text-muted text-sm sm:text-base md:text-lg font-normal leading-relaxed tracking-[-0.011em] mb-8 sm:mb-12 max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* 3 Pilares de Especialidad Técnica */}
            <div className="space-y-7 sm:space-y-8 pt-7 sm:pt-9 border-t border-card-border/60 mb-8 lg:mb-0">
              <div>
                <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground mb-1.5">
                  {t('trust1Title')}
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md">
                  {t('trust1Desc')}
                </p>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground mb-1.5">
                  {t('trust2Title')}
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md">
                  {t('trust2Desc')}
                </p>
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground mb-1.5">
                  {t('trust3Title')}
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md">
                  {t('trust3Desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Frosted Glass con el Formulario */}
          <div className="lg:col-span-7 rounded-[2rem] sm:rounded-[2.6rem] md:rounded-[3rem] bg-card border border-card-border p-6 sm:p-10 md:p-12 lg:p-14 backdrop-blur-2xl transition-all duration-300 hover:border-card-hover-border shadow-2xl">
            <ConsultaForm />
          </div>
        </div>
      </main>

      {/* Footer Minimalista de la Landing */}
      <footer
        className="animate-fade-in-up w-full max-w-5xl mt-10 sm:mt-16 border-t border-card-border/30 pt-6 sm:pt-8 px-2 md:px-0 flex justify-center text-center text-[11px] sm:text-xs text-text-subtitle font-normal tracking-tight"
        style={{ animationDelay: '600ms' }}
      >
        <p>{t('footerText', { year: new Date().getFullYear().toString() })}</p>
      </footer>
    </div>
  );
}







