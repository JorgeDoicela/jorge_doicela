import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const techs = project.techStack.split(',').map((t) => t.trim());

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-2xl flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {project.description}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {techs.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Código &rarr;
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Demo en Vivo &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
