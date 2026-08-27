'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { AiResource } from '../../../features/ai/types';
import { API_URL } from '../../../../config';

export default function AiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const [resource, setResource] = useState<AiResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`${API_URL}/software/ai/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error('Recurso no encontrado');
        const data = await res.json();
        setResource(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar recurso');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando ficha técnica de IA...
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Recurso no encontrado'}</p>
        <Link href="/software/ai" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver a Directorio IA
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
        <Link href="/software/ai" className="hover:text-[var(--foreground)] transition-colors">
          IA & Modelos
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{resource.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">
                {resource.type?.toUpperCase()}
              </span>
              <span className="text-zinc-500">• Por {resource.provider}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] mb-4 leading-[1.15]">
              {resource.name}
            </h1>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
              {resource.description}
            </p>
          </header>

          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel leading-relaxed space-y-4">
            <div className="whitespace-pre-line text-sm md:text-base font-light text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {resource.contentMarkdown}
            </div>
          </div>
        </div>

        {/* Columna Lateral (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-convex-panel space-y-4 sticky top-20">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5">
              Ficha Técnica del Modelo / Agente
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Proveedor:</span>
                <span className="font-bold text-[var(--foreground)]">{resource.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Licencia:</span>
                <span className="font-bold text-[var(--foreground)]">{resource.license}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Vistas:</span>
                <span className="text-[var(--foreground)]">{resource.views}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
              {resource.githubUrl && (
                <a
                  href={resource.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-indigo-600 dark:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Repositorio GitHub ↗
                </a>
              )}
              {resource.documentationUrl && (
                <a
                  href={resource.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Documentación Oficial ↗
                </a>
              )}
              <Link
                href="/software/ai"
                className="w-full py-2.5 rounded-2xl glass-btn-neumorphic text-xs font-mono font-bold text-center block text-zinc-500 hover:text-[var(--foreground)] transition-all"
              >
                ← Ver Directorio IA
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
