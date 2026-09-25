'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Project } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tNav = useTranslations('Nav');
  const tFilters = useTranslations('Filters');

  const statusLabels: Record<string, string> = {
    active: tFilters('inProduction'),
    wip: tFilters('inDevelopment'),
    archived: tFilters('archived'),
  };

  const statusText = statusLabels[project.status] || project.status;
  const moduleLabel = tNav('projects').toUpperCase();
  const catKey = project.category?.toLowerCase() || '';
  const catLabel = catKey
    ? (tFilters.has(catKey as any) ? tFilters(catKey as any) : catKey.replace(/_/g, ' ')).toUpperCase()
    : '';
  const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

  return (
    <SoftwareCard
      href={`/projects/${project.slug}`}
      title={project.name}
      category="projects"
      coverImage={project.coverImage}
      tag={statusText.toUpperCase()}
      categoryMeta={metaText}
      excerpt={project.description}
      accentHoverColor="group-hover:text-blue-300"
    />
  );
}
