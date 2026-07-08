'use client';

import React from 'react';
import { ProjectCard } from './ProjectCard';
import { useProjects } from '../hooks/useProjects';

export const ProjectGrid: React.FC = () => {
  const { projects, loading, error } = useProjects();

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-center mb-6">
          {error}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <p className="text-center text-slate-400 py-12">No se encontraron proyectos.</p>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
