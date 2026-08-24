'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { NewsArticle } from '../../../features/news/types';
import { API_URL } from '../../../../config';

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/software/news/${slug}`);
        if (!res.ok) throw new Error('Noticia no encontrada');
        const data = await res.json();
        setArticle(data.data || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar noticia');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex justify-center items-center">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm font-mono">
          Cargando noticia...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-500 font-semibold">{error || 'Noticia no encontrada'}</p>
        <Link href="/software/news" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono">
          ← Volver a Noticias
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('es-ES', {
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
        <Link href="/software/news" className="hover:text-[var(--foreground)] transition-colors">
          Noticias
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)] truncate max-w-xs">{article.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal de Contenido (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <header className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="flex items-center gap-3 mb-4 text-xs font-mono">
              {article.isBreaking && (
                <span className="font-bold uppercase text-rose-600 dark:text-rose-400 animate-pulse">
                  ● Breaking News
                </span>
              )}
              <span className="font-bold uppercase text-cyan-600 dark:text-cyan-400">
                Noticia
              </span>
              <span className="text-zinc-500">• {formattedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] mb-5 leading-[1.15]">
              {article.title}
            </h1>

            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-300 font-light leading-relaxed">
              {article.excerpt}
            </p>
          </header>

          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel leading-relaxed space-y-4">
            <div className="whitespace-pre-line text-sm md:text-base font-light text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {article.contentMarkdown}
            </div>

            {article.sourceUrl && (
              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Fuente Oficial de la Noticia ↗</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Columna Lateral / Ficha Técnica (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-convex-panel space-y-4 sticky top-20">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-black/5 dark:border-white/5">
              Metadatos del Artículo
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Autor:</span>
                <span className="font-bold text-[var(--foreground)]">{article.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Lectura:</span>
                <span className="text-[var(--foreground)]">{article.readTimeMinutes} minutos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Publicado:</span>
                <span className="text-[var(--foreground)]">{formattedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Vistas:</span>
                <span className="text-[var(--foreground)]">{article.views} lecturas</span>
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
              <Link
                href="/software/news"
                className="w-full py-2.5 rounded-2xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                ← Ver Todas las Noticias
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
