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
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando ensayo...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Artículo no encontrado'}</p>
        <Link href="/software/blog" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver al Blog
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
    <article className="min-h-screen py-10 md:py-14 px-4 sm:px-6 lg:px-8 2xl:px-12 max-w-7xl 2xl:max-w-[1500px] mx-auto space-y-8">
      {/* Breadcrumb de navegación */}
      <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
        <Link href="/software" className="hover:text-[var(--foreground)] transition-colors">
          Software
        </Link>
        <span>/</span>
        <Link href="/software/blog" className="hover:text-[var(--foreground)] transition-colors">
          Blog de Arquitectura
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{post.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              <span className="font-bold uppercase text-blue-600 dark:text-blue-400">
                {post.series || 'Arquitectura & Patrones'}
              </span>
              <span className="text-zinc-500">• {formattedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] mb-3 leading-[1.15]">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-sm md:text-base font-medium text-blue-600 dark:text-blue-400/90 mb-4">
                {post.subtitle}
              </p>
            )}

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
              {post.excerpt}
            </p>
          </header>

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
              Ficha del Ensayo
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Autor:</span>
                <span className="font-bold text-[var(--foreground)]">{post.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Lectura:</span>
                <span className="text-[var(--foreground)]">{post.readTimeMinutes} minutos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Interacciones:</span>
                <span className="text-[var(--foreground)]">{post.likes} likes · {post.views} vistas</span>
              </div>
            </div>

            {post.tableOfContents && (
              <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                  Tabla de Contenidos
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-mono whitespace-pre-line">
                  {post.tableOfContents}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <Link
                href="/software/blog"
                className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                ← Ver Todos los Ensayos
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
