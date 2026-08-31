'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { LinksTopBar } from '../components/links/LinksTopBar';
import { LinksHeader } from '../components/links/LinksHeader';
import { ActionLinksList } from '../components/links/ActionLinksList';
import { ProjectsMediaGrid } from '../components/links/ProjectsMediaGrid';
import ParallaxBackground from '../components/ParallaxBackground';
import InteractiveParticles from '../components/InteractiveParticles';
import CinematicSpiralGalaxy from '../components/CinematicSpiralGalaxy';
import SkipToContent from '../components/SkipToContent';

export default function LinksPage() {
  const tCommon = useTranslations('Common');

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden p-4 sm:p-8 md:p-12">
      <SkipToContent />

      {/* Capas de Fondo Cósmico y Partículas Nativas */}
      <ParallaxBackground />
      <InteractiveParticles />
      <CinematicSpiralGalaxy />

      {/* Barra de Navegación Superior fija a los extremos de la pantalla */}
      <LinksTopBar />

      {/* Contenedor Principal Amplio */}
      <main
        id="main-content"
        className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 z-10 flex-grow flex flex-col items-center outline-none focus:outline-none pt-24 sm:pt-28 md:pt-32 pb-12"
        tabIndex={-1}
      >
        {/* Cabecera con Avatar Circular, Título, Subtítulo y Redes */}
        <LinksHeader />

        {/* Botones de Enlace Limpios y Grandes */}
        <ActionLinksList />

        {/* Cuadrícula 3x3 estilo Instagram de Proyectos con Modal */}
        <ProjectsMediaGrid />

        {/* Footer Discreto */}
        <footer className="w-full text-center mt-8 mb-4 text-text-muted">
          <p className="text-xs font-mono text-text-subtitle/70 uppercase tracking-widest">
            {tCommon('footer', { year: new Date().getFullYear().toString() })}
          </p>
        </footer>
      </main>

      {/* Botón Flotante Circular de Contacto Directo */}
      <Link
        href="/consulta"
        className="fixed bottom-6 right-6 z-50 p-3.5 sm:p-4 rounded-full bg-gradient-to-tr from-[#0d152e] via-[#1a174d] to-[#551b94] hover:from-[#141f45] hover:to-[#6b21a8] text-white shadow-2xl shadow-indigo-950/60 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/15"
        aria-label="Abrir consulta directa"
        title="Solicitar Consulta / Contacto"
      >
        <MessageCircle size={24} className="fill-current" />
      </Link>
    </div>
  );
}
