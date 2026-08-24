'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { AiResource } from '../../../features/ai/types';
import { API_URL } from '../../../../config';

export default function AiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [resource, setResource] = useState<AiResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`${API_URL}/software/ai/${slug}`);
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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm">
          Cargando ficha técnica...
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Recurso no encontrado'}</p>
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/30">
            {resource.type}
          </span>
          <span className="text-xs text-zinc-500 font-mono">Por {resource.provider}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-3 leading-tight">
          {resource.name}
        </h1>

        <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
          {resource.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 border-t border-white/5 pt-4">
          <span>Licencia: <strong className="text-zinc-200">{resource.license}</strong></span>
          <span>•</span>
          <span>{resource.views} vistas</span>
          {resource.githubUrl && (
            <>
              <span>•</span>
              <a href={resource.githubUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                GitHub Repo ↗
              </a>
            </>
          )}
          {resource.documentationUrl && (
            <>
              <span>•</span>
              <a href={resource.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                Documentación ↗
              </a>
            </>
          )}
        </div>
      </header>

      <div className="p-8 md:p-12 rounded-3xl glass-convex-panel prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4">
        <div className="whitespace-pre-line text-sm md:text-base font-light">
          {resource.contentMarkdown}
        </div>
      </div>
    </article>
  );
}
