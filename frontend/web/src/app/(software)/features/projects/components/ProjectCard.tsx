'use client';

import React from 'react';
import Link from 'next/link';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: 'Activo / Producción', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    wip: { label: 'En Desarrollo', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    archived: { label: 'Archivado', color: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
  };

  const statusBadge = statusLabels[project.status] || statusLabels.active;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border ${statusBadge.color}`}>
            {statusBadge.label}
          </span>
          <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <span>{project.stars} stars</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-indigo-400 transition-colors leading-snug mb-2">
          {project.name}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed font-light">
          {project.description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.split(',').map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 text-[10px] font-mono border border-white/5"
            >
              {tech.trim()}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <span>GitHub</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
              >
                <span>Demo</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          <Link
            href={`/software/projects/${project.slug}`}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Arquitectura
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
