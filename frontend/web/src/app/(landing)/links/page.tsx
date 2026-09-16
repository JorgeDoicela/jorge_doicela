import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LinksHeader, ActionLinksList, ProjectsMediaGrid } from '../widgets/links-showcase';
import { LandingHeader } from '../widgets/landing-header';
import { LandingFooter } from '../widgets/landing-footer';
import { ShareProfileButton } from '../features/share-profile';
import { LinksAiAssistant } from '../features/ai-assistant';
import { LandingVisualEffects } from '../widgets/cosmic-canvas';
import { SkipToContent } from '../shared';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Links');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://jorgedoicela.com/links',
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: 'https://jorgedoicela.com/links',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
  };
}

export default async function LinksPage() {
  const tLinks = await getTranslations('Links');

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden p-4 sm:p-8 md:p-12">
      <SkipToContent />

      {/* Capas de Fondo Cósmico y Partículas Nativas */}
      <LandingVisualEffects />

      {/* Barra de Navegación Superior Unificada */}
      <LandingHeader showBackLink backLabel={tLinks('backHome')} />

      {/* Contenedor Principal Amplio */}
      <main
        id="main-content"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 z-10 flex-grow flex flex-col items-center outline-none focus:outline-none pt-24 sm:pt-28 md:pt-32 pb-12"
        tabIndex={-1}
      >
        {/* Cabecera con Avatar Circular, Título, Subtítulo y Redes */}
        <LinksHeader />

        {/* Botón de Compartir Perfil con Web Share API y Copiar Enlace */}
        <ShareProfileButton />

        {/* Botones de Enlace Limpios y Grandes */}
        <ActionLinksList />

        {/* Cuadrícula 3x3 estilo Instagram de Proyectos con Modal */}
        <ProjectsMediaGrid />

        {/* Footer Compacto */}
        <LandingFooter variant="compact" />
      </main>

      {/* Asistente de IA (Botón Flotante y Modal) */}
      <LinksAiAssistant />
    </div>
  );
}
