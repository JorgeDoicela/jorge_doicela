'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { SecurityPost } from '../../../features/cybersecurity/types';
import { API_URL } from '../../../../config';

export default function SecurityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<SecurityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/software/cybersecurity/${slug}`);
        if (!res.ok) throw new Error('Aviso no encontrado');
        const data = await res.json();
        setPost(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar aviso');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando análisis de seguridad...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Aviso no encontrado'}</p>
        <Link href="/software/cybersecurity" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver a Ciberseguridad
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
        <Link href="/software/cybersecurity" className="hover:text-[var(--foreground)] transition-colors">
          Ciberseguridad
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              <span className="font-bold uppercase text-rose-600 dark:text-rose-400">
                ● Severidad: {post.severity}
              </span>
              <span className="text-zinc-500">• {post.postType}</span>
              {post.cveId && <span className="text-rose-500 font-bold">• {post.cveId}</span>}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] mb-4 leading-[1.15]">
              {post.title}
            </h1>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Remediación y Contramedidas */}
          {post.remediation && (
            <div className="p-8 rounded-3xl glass-concave-panel border border-blue-500/20 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Remediación & Mitigación Recomendada
              </h4>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-light leading-relaxed">
                {post.remediation}
              </p>
            </div>
          )}

          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel leading-relaxed space-y-4">
            <div className="whitespace-pre-line text-sm md:text-base font-light text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {post.contentMarkdown}
            </div>
          </div>
        </div>

        {/* Columna Lateral (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-convex-panel space-y-4 sticky top-20">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5">
              Ficha del Aviso CVE
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Severidad:</span>
                <span className="font-bold text-rose-500">{post.severity}</span>
              </div>
              {post.cveId && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">CVE ID:</span>
                  <span className="font-bold text-[var(--foreground)]">{post.cveId}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Tipo:</span>
                <span className="text-[var(--foreground)]">{post.postType}</span>
              </div>
              <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                <span className="text-zinc-500 block">Sistemas Afectados:</span>
                <span className="font-bold text-[var(--foreground)] block text-xs">
                  {post.affectedSystems || 'General Linux / Entornos Web'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <Link
                href="/software/cybersecurity"
                className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                ← Ver Matriz de Ciberseguridad
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
