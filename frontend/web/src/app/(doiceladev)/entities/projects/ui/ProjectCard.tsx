'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Project } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const moduleLabel = tNav('projects');
  const catKey = project.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' '))
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <DoiceladevCard
      href={`/projects/${project.slug}`}
      title={project.title}
      category="projects"
      coverImage={project.coverImage}
      categoryMeta={metaText}
      topicCategory={project.category}
      excerpt={project.excerpt}
      priority={priority}
      accentHoverColor="group-hover:text-blue-300"
    />
  );
}
