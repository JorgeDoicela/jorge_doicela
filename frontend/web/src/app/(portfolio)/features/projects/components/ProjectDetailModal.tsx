'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PortfolioProject } from '../types';
import { ExternalLink, X, Cpu, Layers, BarChart3, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const t = useTranslations('Projects');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar con tecla Escape y bloquear scroll del body
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10"
    >
      {/* Backdrop con desenfoque de cristal oscuro global */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Contenedor Modal Dark Luxury */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface text-foreground border border-border-gold rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10">
        
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-border-gold/30 bg-surface-raised/80">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                {project.role}
              </span>
            </div>
            <h2
              id="project-modal-title"
              className="text-2xl md:text-3xl font-light text-foreground tracking-tight"
            >
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar modal de proyecto"
            className="p-2 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 border border-border/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 text-sm text-foreground/80 font-light leading-relaxed">
          
          {/* 1. Visión General del Sistema */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gold-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>Visión General del Sistema</span>
            </h3>
            <p className="text-sm md:text-base text-foreground/90 font-light leading-relaxed">
              {project.overview || project.description}
            </p>
          </div>

          {/* 2. El Reto de Ingeniería */}
          {project.challenge && (
            <div className="space-y-3 p-5 rounded-xl bg-surface-raised/30 border border-foreground/[0.06]">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gold-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>El Desafío Técnico & Restricciones</span>
              </h3>
              <p className="text-xs md:text-sm text-foreground/80 font-light leading-relaxed">
                {project.challenge}
              </p>
            </div>
          )}

          {/* 3. Decisiones de Arquitectura */}
          {project.architectureHighlights && project.architectureHighlights.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gold-300 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Arquitectura & Decisiones de Ingeniería</span>
              </h3>
              <ul className="space-y-2.5">
                {project.architectureHighlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs md:text-sm text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Stack Tecnológico */}
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
              Stack Tecnológico Empleado
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-mono px-3 py-1 rounded-lg border border-border bg-background/50 text-foreground/90 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* 5. Ficha Técnica Editorial: Especificaciones y Telemetría al final */}
          {project.metrics && project.metrics.length > 0 && (() => {
            const metricsList = project.metrics;
            return (
              <div className="p-5 rounded-xl bg-surface-raised/25 border border-foreground/[0.06] space-y-3.5">
                <div className="flex items-center justify-between border-b border-border-gold/20 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                    Especificaciones & Telemetría
                  </span>
                  <span className="text-[9px] font-mono text-muted uppercase tracking-wider">
                    Métricas Verificadas
                  </span>
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  {metricsList.map((m, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-3">
                      <span className="text-foreground/75 shrink-0">{m.label}</span>
                      <span className="grow border-b border-dotted border-border-gold/50 mb-1 opacity-60" />
                      <span className="text-foreground font-semibold shrink-0 tracking-wide">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Pie de Acciones / CTAs de Alta Gama */}
        <div className="p-4 sm:p-6 border-t border-border/40 bg-surface-raised/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono text-muted hover:text-foreground border border-transparent hover:border-border transition-colors cursor-pointer"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-raised text-xs font-mono text-foreground transition-all duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>Ver Código en GitHub</span>
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
        </div>
      </div>
    </div>,
    document.body
  );
}
