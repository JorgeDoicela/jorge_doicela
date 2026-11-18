'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useProjects } from '../api/useProjects';
import { ProjectCard } from './ProjectCard';
import { DoiceladevCardSkeleton } from '../../../shared/ui/DoiceladevCardSkeleton';

interface ProjectGridProps {
  category?: string;
  status?: string;
  search?: string;
}

export function ProjectGrid({ category, status, search }: ProjectGridProps) {
  const t = useTranslations('Projects');
  const { projects, loading, error } = useProjects(category, search, status);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: 6 }).map((_, idx) => (
          <DoiceladevCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl glass-concave-panel text-center text-rose-400">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {projects.map((proj, idx) => (
        <ProjectCard key={proj.id} project={proj} priority={idx < 3} />
      ))}
    </div>
  );
}
