'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Project } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tFilters = useTranslations('Filters');
  const tCard = useTranslations('CardActions');

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: tFilters('inProduction'), color: 'text-emerald-400 font-bold' },
    wip: { label: tFilters('inDevelopment'), color: 'text-amber-400 font-bold' },
    archived: { label: tFilters('archived'), color: 'text-zinc-400 font-medium' },
  };

  const statusBadge = statusLabels[project.status] || statusLabels.active;

  return (
    <Link
      href={`/software/projects/${project.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={project.name}
          category="projects"
          coverImage={project.coverImage}
          tag={statusBadge.label}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[11px] font-mono tracking-wide ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              <span>{tCard('starsCount', { count: project.stars })}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
            {project.name}
          </h3>

          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
            {project.description}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-white/5 space-y-2.5">
        <div className="flex flex-wrap gap-1.5 text-zinc-400 text-[10px] font-mono">
          {project.techStack.split(',').slice(0, 4).map((tech, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5">
              #{tech.trim()}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            {project.repoUrl && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.repoUrl, '_blank');
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-0.5 cursor-pointer"
              >
                GitHub ↗
              </span>
            )}
            {project.liveUrl && (
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.liveUrl, '_blank');
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
              >
                Demo ↗
              </span>
            )}
          </div>

          <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            {tCard('viewProject')}
          </span>
        </div>
      </div>
    </Link>
  );
}
