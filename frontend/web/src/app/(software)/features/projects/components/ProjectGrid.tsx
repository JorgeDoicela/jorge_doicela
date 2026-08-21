'use client';

import React from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  status?: string;
  search?: string;
}

export function ProjectGrid({ status, search }: ProjectGridProps) {
  const { projects, loading, error } = useProjects(status, search);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-56 rounded-3xl glass-convex-panel bg-zinc-900/30" />
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
        <p className="text-base font-medium">No se encontraron proyectos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {projects.map((proj) => (
        <ProjectCard key={proj.id} project={proj} />
      ))}
    </div>
  );
}
