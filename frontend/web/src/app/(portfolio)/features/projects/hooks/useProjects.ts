'use client';

import { useState, useMemo } from 'react';
import { PortfolioProject } from '../types';

export function useProjects(initialProjects: PortfolioProject[]) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
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
  }, [initialProjects, activeFilter]);

  const handleOpenDetail = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsModalOpen(false);
  };

  return {
    activeFilter,
    setActiveFilter,
    selectedProject,
    isModalOpen,
    filteredProjects,
    handleOpenDetail,
    handleCloseDetail,
  };
}
