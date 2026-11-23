'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PortfolioProject } from '../types';
import { buildProjectSlides } from '../utils/buildProjectSlides';
import { useOrbitalCarousel } from '../hooks/useOrbitalCarousel';
import { ProjectSlideCard } from './ProjectSlideCard';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Visor modal de Caso de Estudio con Pasarela Orbital 3D independiente por proyecto.
 * Mantiene fija la cabecera del proyecto y el dock inferior de secciones/CTAs,
 * mientras las secciones técnicas y galería multimedia orbitan en arco convexo
 * navegables por arrastre de cursor, clic lateral, teclado o selector de capítulos.
 */
export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const t = useTranslations('Projects');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = useMemo(
    () => (project ? buildProjectSlides(project) : []),
    [project],
  );

  const {
    activeIndex,
    isDragging,
    canGoPrev,
    canGoNext,
    goTo,
    goNext,
    goPrev,
    getSlideStyle,
    handleCardSelect,
    stageHandlers,
  } = useOrbitalCarousel({
    total: slides.length,
    resetKey: project?.id ?? null,
    isActive: isOpen && mounted,
  });

  // Cerrar con tecla Escape y bloquear scroll del documento principal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden"
    >
      {/* Backdrop cinematográfico oscuro */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/82 backdrop-blur-md transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Cabecera Superior Fija del Proyecto */}
      <header className="relative z-20 w-full px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 pb-3 flex items-start justify-between gap-4 pointer-events-none">
        <div className="flex flex-col gap-1.5 pointer-events-auto min-w-0">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-gold-400 font-semibold">
            {project.role}
          </span>
          <h2
            id="project-modal-title"
            className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight truncate"
          >
            {project.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('modalClose')}
            className="p-2.5 rounded-xl bg-surface/85 text-foreground/80 hover:text-foreground hover:border-gold-300/60 border border-border-gold/50 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Escenario Central: Pasarela Orbital 3D ("Medio Planeta") */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
        className="relative z-10 flex-1 w-full flex items-center justify-center overflow-hidden select-none cursor-pointer"
        style={{ perspective: '1250px' }}
      >
        {/* Botón Lateral Izquierdo */}
        {slides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            disabled={!canGoPrev}
            aria-label={t('modalPrevSlide')}
            className="hidden sm:flex absolute left-4 md:left-8 z-40 items-center justify-center w-11 h-11 rounded-full bg-surface/85 border border-border-gold/50 text-foreground/80 hover:text-gold-200 hover:border-gold-300/70 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Pista 3D de Tarjetas: área delimitada de interacción táctil y arrastre */}
        <div
          {...stageHandlers}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-[700px] 2xl:max-w-[760px] h-[420px] sm:h-[450px] mx-4 sm:mx-16 touch-pan-y ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {slides.map((slide, index) => {
            const orbitalStyle = getSlideStyle(index);
            return (
              <div
                key={slide.id}
                onClick={() => handleCardSelect(index)}
                role={index === activeIndex ? 'region' : 'button'}
                tabIndex={index === activeIndex ? -1 : 0}
                aria-current={index === activeIndex ? 'step' : undefined}
                aria-label={
                  slide.kind === 'media'
                    ? `${t(slide.shortLabelKey)} ${slide.mediaIndex}`
                    : t(slide.shortLabelKey)
                }
                onKeyDown={(e) => {
                  if (index !== activeIndex && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    goTo(index);
                  }
                }}
                className={`absolute inset-0 will-change-[transform,opacity,filter] ${
                  isDragging
                    ? 'transition-none'
                    : 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
                } ${index === activeIndex ? '' : 'cursor-pointer'}`}
                style={{
                  transform: orbitalStyle.transform,
                  opacity: orbitalStyle.opacity,
                  filter: orbitalStyle.filter,
                  zIndex: orbitalStyle.zIndex,
                  pointerEvents: orbitalStyle.pointerEvents,
                }}
              >
                <ProjectSlideCard
                  slide={slide}
                  index={index}
                  total={slides.length}
                  isActive={index === activeIndex}
                />
              </div>
            );
          })}
        </div>

        {/* Botón Lateral Derecho */}
        {slides.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            disabled={!canGoNext}
            aria-label={t('modalNextSlide')}
            className="hidden sm:flex absolute right-4 md:right-8 z-40 items-center justify-center w-11 h-11 rounded-full bg-surface/85 border border-border-gold/50 text-foreground/80 hover:text-gold-200 hover:border-gold-300/70 disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dock Inferior Fijo: Selector Directo de Secciones + CTAs Globales */}
      <footer className="relative z-20 w-full px-6 sm:px-10 md:px-14 pb-6 sm:pb-8 pt-3 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Índice interactivo de secciones del proyecto */}
        <nav
          aria-label={project.title}
          className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none"
        >
          {slides.map((slide, index) => {
            const active = index === activeIndex;
            const label =
              slide.kind === 'media'
                ? `${t(slide.shortLabelKey)} ${slide.mediaIndex}`
                : t(slide.shortLabelKey);
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-gold-300 text-black font-semibold shadow-sm'
                    : 'bg-surface/70 text-foreground/70 hover:text-foreground border border-border-gold/40 hover:border-gold-300/50'
                }`}
              >
                <span className={active ? 'text-black/70' : 'text-gold-400/80'}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Acciones Globales del Proyecto */}
        <div className="flex items-center gap-2.5 shrink-0">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-gold/50 bg-surface/90 hover:bg-surface-raised hover:border-gold-300/60 text-xs font-mono text-foreground transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>{t('modalViewGithub')}</span>
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-400 hover:bg-gold-300 text-black font-semibold text-xs font-mono transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>{t('demoLabel')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </footer>
    </div>,
    document.body,
  );
}
