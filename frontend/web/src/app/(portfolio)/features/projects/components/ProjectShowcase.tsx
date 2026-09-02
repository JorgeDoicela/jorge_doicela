'use client';

import React, { useState } from 'react';
import { PortfolioProject } from '../types';
import { ExternalLink, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectShowcaseProps {
  projects: PortfolioProject[];
}

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const t = useTranslations('Projects');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: t('filterAll') },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'cloud', label: 'Cloud & DevSecOps' },
    { id: 'ai', label: 'IA & Sistemas' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'fullstack') {
      return p.technologies.some((tech) =>
        ['Next.js 16', 'NestJS 11', 'React', 'Expo'].includes(tech)
      );
    }
    if (activeFilter === 'cloud') {
      return p.technologies.some((tech) =>
        ['AWS Lightsail', 'Debian 13', 'Nginx', 'PM2', 'GitHub Actions', 'Docker'].includes(tech)
      );
    }
    if (activeFilter === 'ai') {
      return p.technologies.some((tech) =>
        ['SQLite', 'TypeScript', 'ANSI Parser', 'AI'].includes(tech)
      );
    }
    return true;
  });

  const handleOpenDetail = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section className="flex flex-col gap-8">
      {/* Encabezado de Sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gold-300">
            <span className="text-[10px] font-mono tracking-widest uppercase">
              {t('eyebrow')}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-foreground">
            {t('title')}
          </h2>
          <p className="text-xs text-muted font-light max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-gold-300 text-black font-semibold shadow-sm'
                  : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-border/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Tarjetas Luxury */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            onClick={() => handleOpenDetail(project)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenDetail(project);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Ver caso de estudio de ${project.title}`}
            className="group relative flex flex-col justify-between p-6 rounded-xl border border-border/60 bg-surface/40 hover:bg-surface hover:border-gold-300/40 transition-all duration-300 cursor-pointer select-none"
          >
            <div className="flex flex-col gap-4">
              {/* Top Row: Rol */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-gold-400/90 font-medium">
                  {project.role}
                </span>
              </div>

              {/* Título y Descripción */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-lg md:text-xl font-light text-foreground group-hover:text-gold-200 transition-colors flex items-center justify-between"
                  title="Ver caso de estudio detallado"
                >
                  <span>{project.title}</span>
                </h3>
                <p className="text-xs md:text-sm text-muted font-light leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Stack de Tecnologías */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-border/40 bg-background/50 text-foreground/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Acciones & Enlaces de Alta Gama */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-4 border-t border-border/30">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDetail(project);
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-gold-300 transition-colors cursor-pointer group/btn"
                title="Ver caso de estudio y arquitectura"
              >
                <BookOpen className="w-3.5 h-3.5 text-gold-400/80 group-hover/btn:text-gold-300 transition-colors" />
                <span className="underline decoration-border/60 underline-offset-4 group-hover/btn:decoration-gold-300">
                  {t('caseStudyLabel')}
                </span>
              </button>

              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-surface/60 hover:bg-surface-raised hover:border-gold-300/40 text-xs font-mono text-foreground/80 hover:text-foreground transition-all duration-200 cursor-pointer"
                    title={t('viewRepo')}
                    aria-label={`Ver código fuente de ${project.title}`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span>{t('codeLabel')}</span>
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold-400/15 border border-gold-400/40 hover:bg-gold-400 hover:text-black text-xs font-mono text-gold-300 font-semibold transition-all duration-200 shadow-sm cursor-pointer"
                    title={t('viewDemo')}
                    aria-label={`Ver demo en vivo de ${project.title}`}
                  >
                    <span>{t('demoLabel')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal Interactivo de Caso de Estudio */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
