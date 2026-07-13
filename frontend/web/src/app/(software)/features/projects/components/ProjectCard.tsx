import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const techs = project.techStack.split(',').map((t) => t.trim());

  // Determinar color de LED y etiqueta según el tipo de sistema
  let ledColorClass = 'tech-led-cyan';
  let statusText = 'Active Service';
  
  if (project.name.toLowerCase().includes('portafolio')) {
    ledColorClass = 'tech-led-violet';
    statusText = 'Web SSH Virtual';
  } else if (project.name.toLowerCase().includes('biblia')) {
    ledColorClass = 'tech-led-indigo';
    statusText = 'SQLite Sync';
  }

  return (
    <div className="p-8 rounded-3xl glass-convex-panel glass-convex-panel-interactive flex flex-col justify-between h-full relative overflow-hidden group">
      <div>
        {/* Barra superior con LED e información técnica de sistema */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-600 dark:text-zinc-400">
            SYS-ID // {project.id.toString().padStart(3, '0')}
          </span>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full glass-concave-panel text-[9px] font-bold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
            <span className={`tech-led ${ledColorClass}`}></span>
            {statusText}
          </div>
        </div>

        <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2.5 tracking-tight group-hover:text-black dark:group-hover:text-zinc-100 transition-colors duration-200">
          {project.name}
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-6 font-normal transition-colors duration-400">
          {project.description}
        </p>
      </div>

      <div>
        {/* Chips de titanio grabado (Cóncavos) */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {techs.map((tech) => (
            <span key={tech} className="px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wide glass-concave-panel text-[var(--chip-text)]">
              {tech}
            </span>
          ))}
        </div>

        {/* Acciones de hardware minimalistas (Botones convexos neumórficos) */}
        <div className="flex gap-4 pt-5 border-t border-zinc-200 dark:border-zinc-800/40 transition-colors duration-400">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold glass-btn-neumorphic"
            >
              Código
              <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold glass-btn-neumorphic"
            >
              Demo en Vivo
              <span className="transform group-hover:translate-x-0.5 transition-transform duration-200">&rarr;</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
