'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Project } from '../../../features/projects/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

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
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          Cargando caso de estudio de arquitectura...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || 'Proyecto no encontrado'}</p>
        <Link href="/software/projects" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-blue-400 hover:text-white transition-all">
          ← Volver a Proyectos
        </Link>
      </div>
    );
  }

  const techList = project.techStack ? project.techStack.split(',').map((t) => t.trim()) : [];

  return (
    <SoftwareArticleLayout
      category="projects"
      categoryLabel="Proyectos"
      categoryHref="/software/projects"
      title={project.name}
      subtitle={project.description}
      author="Jorge Doicela"
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-white/5">
            Ficha del Proyecto
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Estado:</span>
              <span className="font-bold text-emerald-400">
                {project.status === 'active' ? 'Activo' : project.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Estrellas:</span>
              <span className="text-amber-400 font-bold">★ {project.stars}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Licencia:</span>
              <span className="text-zinc-300">Open Source</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-400 hover:text-white transition-all shadow-sm"
              >
                Ver en GitHub ↗
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs text-center block transition-all shadow-md hover:shadow-blue-500/25"
              >
                Abrir Aplicación en Vivo ↗
              </a>
            )}
          </div>
        </div>
      }
    >
      {/* Badges de Tecnologías */}
      {techList.length > 0 && (
        <div className="space-y-3 pb-6 border-b border-white/5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Stack Tecnológico Utilizado
          </h4>
          <div className="flex flex-wrap gap-2">
            {techList.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl glass-concave-panel text-zinc-300 text-xs font-mono border border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Caso de Estudio y Arquitectura */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-mono">
          Arquitectura y Principios de Diseño
        </h3>
        <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
          Este sistema está construido bajo el principio de <strong>cajas negras independientes</strong> (desacoplamiento total de dependencias y tipos locales), optimizado para ejecutarse en entornos de memoria controlada (1 GB de RAM) con persistencia física SQLite y arquitectura basada en <strong>Feature-Sliced Design (FSD)</strong> en Next.js.
        </p>
      </div>
    </SoftwareArticleLayout>
  );
}
