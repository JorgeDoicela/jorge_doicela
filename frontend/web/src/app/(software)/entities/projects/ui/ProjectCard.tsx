'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Project } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const tFilters = useTranslations('Filters');
  const tCard = useTranslations('CardActions');

  const statusLabels: Record<string, string> = {
    active: tFilters('inProduction'),
    wip: tFilters('inDevelopment'),
    archived: tFilters('archived'),
  };

  const statusText = statusLabels[project.status] || project.status;
  const starsText = tCard('starsCount', { count: project.stars });
  const metaText = `${statusText} • ${starsText} • ${project.techStack}`;

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
