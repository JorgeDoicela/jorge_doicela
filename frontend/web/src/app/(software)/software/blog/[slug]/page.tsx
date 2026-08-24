'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '../../../features/blog/types';
import { API_URL } from '../../../../config';

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/software/blog/${slug}`);
        if (!res.ok) throw new Error('Artículo no encontrado');
        const data = await res.json();
        setPost(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar artículo');
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
          Cargando ensayo...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Artículo no encontrado'}</p>
        <Link href="/software" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs">
          ← Volver a Software
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 mb-8 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver a Software
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
            {post.series || 'Blog Técnico'}
          </span>
          <span className="text-xs text-zinc-500 font-mono">• {formattedDate}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-3 leading-tight">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-sm md:text-base font-medium text-emerald-400/90 mb-4">
            {post.subtitle}
          </p>
        )}

        <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
          <span>Por {post.author}</span>
          <span>{post.readTimeMinutes} min de lectura</span>
          <span>{post.likes} likes • {post.views} vistas</span>
        </div>
      </header>

      {post.tableOfContents && (
        <div className="p-6 rounded-3xl glass-concave-panel mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Tabla de Contenidos</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono">{post.tableOfContents}</p>
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
