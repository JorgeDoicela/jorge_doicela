'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle } from 'lucide-react';
import { LinksTopBar } from '../components/links/LinksTopBar';
import { LinksHeader } from '../components/links/LinksHeader';
import { ActionLinksList } from '../components/links/ActionLinksList';
import { ProjectsMediaGrid } from '../components/links/ProjectsMediaGrid';
import { AiAssistantChatModal } from '../components/links/AiAssistantChatModal';
import ParallaxBackground from '../components/ParallaxBackground';
import InteractiveParticles from '../components/InteractiveParticles';
import CinematicSpiralGalaxy from '../components/CinematicSpiralGalaxy';
import SkipToContent from '../components/SkipToContent';

export default function LinksPage() {
  const tCommon = useTranslations('Common');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Atajos de teclado: Ctrl + K (Abrir/Cerrar) y Esc (Cerrar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K o Cmd + K para alternar chat
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAiModalOpen((prev) => !prev);
        return;
      }

      // Esc para cerrar el chat si está abierto
      if (e.key === 'Escape' && isAiModalOpen) {
        e.preventDefault();
        setIsAiModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAiModalOpen]);

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

        {/* Footer Discreto con Geist Sans */}
        <footer className="w-full text-center mt-8 mb-4">
          <p className="text-xs font-medium text-text-muted">
            {tCommon('footer', { year: new Date().getFullYear().toString() })}
          </p>
        </footer>
      </main>

      {/* Botón Flotante Circular del Asistente de IA */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsAiModalOpen((prev) => !prev)}
          className="relative p-3.5 sm:p-4 rounded-full bg-card border border-card-border hover:border-card-hover-border text-foreground shadow-2xl backdrop-blur-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group flex items-center justify-center"
          aria-label="Abrir o cerrar asistente de IA"
          title="Asistente de IA · Jorge Doicela"
        >
          <MessageCircle size={22} className="text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>

      {/* Modal Interactivo del Asistente de IA */}
      <AiAssistantChatModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
