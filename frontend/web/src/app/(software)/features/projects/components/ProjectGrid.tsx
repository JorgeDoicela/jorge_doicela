'use client';

import React from 'react';
import { ProjectCard } from './ProjectCard';
import { useProjects } from '../hooks/useProjects';

export const ProjectGrid: React.FC = () => {
  const { projects, loading, error } = useProjects();

  return (
    <div className="w-full">
      {loading && (
        <div className="flex flex-col justify-center items-center py-24 rounded-3xl glass-convex-panel max-w-md mx-auto">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zinc-500 mb-4"></div>
          <p className="text-zinc-400 text-sm tracking-wide">Cargando módulos...</p>
        </div>
      )}

      {error && (
        <div className="p-8 rounded-3xl text-center mb-8 glass-convex-panel max-w-xl mx-auto border-red-500/20">
          <p className="font-semibold text-red-400 mb-2 tracking-wide">Error del Sistema</p>
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-24 rounded-3xl glass-convex-panel max-w-xl mx-auto">
          <p className="text-zinc-400 text-base">No se han encontrado proyectos en la base de datos.</p>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
