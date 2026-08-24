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
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm">
          Cargando análisis de seguridad...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Aviso no encontrado'}</p>
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
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase text-rose-400 border border-rose-500/40">
            {post.severity}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium text-zinc-400 border border-zinc-700">
            {post.postType}
          </span>
          {post.cveId && <span className="text-xs font-mono text-rose-400">• {post.cveId}</span>}
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
          {post.excerpt}
        </p>

        <div className="text-xs text-zinc-400 border-t border-white/5 pt-4">
          Sistemas Afectados: <strong className="text-zinc-200">{post.affectedSystems || 'General Linux'}</strong>
        </div>
      </header>

      {/* Remediación y Contramedidas */}
      {post.remediation && (
        <div className="p-6 rounded-3xl glass-concave-panel border border-emerald-500/20">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Remediación Recomendada</h4>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">{post.remediation}</p>
        </div>
      )}

      <div className="p-8 md:p-12 rounded-3xl glass-convex-panel prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4">
        <div className="whitespace-pre-line text-sm md:text-base font-light">
          {post.contentMarkdown}
        </div>
      </div>
    </article>
  );
}
