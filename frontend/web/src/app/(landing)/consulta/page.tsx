import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ConsultaForm } from '../widgets/consulta-section';
import { LandingHeader } from '../widgets/landing-header';
import { LandingFooter } from '../widgets/landing-footer';
import { LandingVisualEffects } from '../widgets/cosmic-canvas';
import { SkipToContent, BentoCard } from '../shared';

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
      <LandingVisualEffects />

      {/* Barra de Navegación Superior Unificada */}
      <LandingHeader sectionBadge={t('badge')} />

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
          <BentoCard className="lg:col-span-7 p-6 sm:p-10 md:p-12 lg:p-14 shadow-2xl">
            <ConsultaForm />
          </BentoCard>
        </div>
      </main>

      {/* Footer Minimalista de la Landing */}
      <LandingFooter variant="compact" />
    </div>
  );
}







