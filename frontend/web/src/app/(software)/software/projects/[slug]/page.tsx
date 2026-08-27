'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Project } from '../../../features/projects/types';
import { API_URL } from '../../../../config';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/software/projects/${slug}?lang=${locale}`);
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
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando caso de estudio de arquitectura...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Proyecto no encontrado'}</p>
        <Link href="/software/projects" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver a Proyectos
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-10 md:py-14 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-[1500px] mx-auto space-y-8">
      {/* Breadcrumb de navegación */}
      <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
        <Link href="/software" className="hover:text-[var(--foreground)] transition-colors">
          Software
        </Link>
        <span>/</span>
        <Link href="/software/projects" className="hover:text-[var(--foreground)] transition-colors">
          Proyectos
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{project.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center justify-between gap-2 mb-4 text-xs font-mono">
              <span className="font-bold uppercase text-blue-600 dark:text-blue-400">
                Estado: {project.status === 'active' ? 'Producción Activa' : project.status}
              </span>
              <span className="text-amber-500 font-bold">{project.stars} stars</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] mb-4 leading-[1.15]">
              {project.name}
            </h1>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.techStack.split(',').map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl glass-concave-panel text-zinc-700 dark:text-zinc-300 text-xs font-mono"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </header>

          {/* Panel de Arquitectura */}
          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel space-y-4">
            <h3 className="text-xl font-bold text-[var(--header-title)] font-mono">
              Arquitectura y Principios de Diseño
            </h3>
            <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
              Este sistema está construido bajo el principio de **cajas negras independientes** (desacoplamiento total de dependencias y tipos locales), optimizado para ejecutarse en entornos de memoria controlada con persistencia física SQLite y arquitectura basada en **Feature-Sliced Design (FSD)** en Next.js.
            </p>
          </div>
        </div>

        {/* Columna Lateral: Enlaces y Ficha (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-convex-panel space-y-4 sticky top-20">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5">
              Acciones & Repositorios
            </h3>

            <div className="space-y-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold text-center block shadow-lg shadow-blue-600/30 transition-all"
                >
                  Abrir Demo en Vivo ↗
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Ver Repositorio GitHub ↗
                </a>
              )}

              <Link
                href="/software/projects"
                className="w-full py-2.5 rounded-2xl glass-btn-neumorphic text-xs font-mono font-bold text-center block text-zinc-500 hover:text-[var(--foreground)] transition-all"
              >
                ← Ver Todos los Proyectos
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
