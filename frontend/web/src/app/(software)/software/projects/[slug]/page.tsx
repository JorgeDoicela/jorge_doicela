'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Project } from '../../../features/projects/types';
import { API_URL } from '../../../../config';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/software/projects/${slug}`);
        if (!res.ok) throw new Error('Proyecto no encontrado');
        const data = await res.json();
        setProject(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar proyecto');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm">
          Cargando caso de estudio de arquitectura...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Proyecto no encontrado'}</p>
        <Link href="/software" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs">
          ← Volver a Software
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver a Software
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/30">
            {project.status === 'active' ? 'Producción' : project.status}
          </span>
          <span className="text-xs text-amber-400 font-semibold">{project.stars} stars</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-3 leading-tight">
          {project.name}
        </h1>

        <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.split(',').map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-xl bg-zinc-800/80 text-zinc-300 text-xs font-mono border border-white/5"
            >
              {tech.trim()}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-bold text-zinc-200 hover:text-white inline-flex items-center gap-2"
            >
              <span>Repositorio en GitHub ↗</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-2"
            >
              <span>Ver en Vivo ↗</span>
            </a>
          )}
        </div>
      </header>

      {/* Panel de Arquitectura */}
      <div className="p-8 md:p-12 rounded-3xl glass-convex-panel space-y-4">
        <h3 className="text-xl font-bold text-[var(--foreground)]">Arquitectura y Desacoplamiento</h3>
        <p className="text-sm text-zinc-300 font-light leading-relaxed">
          Este proyecto está diseñado siguiendo el principio de cajas negras desacopladas y optimizado para ejecutarse en entornos de memoria restringida (1 GB RAM VPS) con persistencia física SQLite en modo WAL y Feature-Sliced Design (FSD).
        </p>
      </div>
    </article>
  );
}
