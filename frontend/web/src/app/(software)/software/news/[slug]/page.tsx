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
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-sm">
          Cargando noticia...
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-16 px-4 flex flex-col justify-center items-center gap-4">
        <p className="text-rose-400 font-semibold">{error || 'Noticia no encontrada'}</p>
        <Link href="/software" className="px-4 py-2 rounded-xl glass-btn-neumorphic text-xs">
          ← Volver al Hub
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
    <article className="min-h-screen py-16 px-4 md:px-8 max-w-4xl mx-auto">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 mb-8 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver al Software Hub
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel mb-8">
        <div className="flex items-center gap-2 mb-4">
          {article.isBreaking && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Breaking News
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Noticia
          </span>
          <span className="text-xs text-zinc-500 font-mono">• {formattedDate}</span>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-[var(--foreground)] mb-4 leading-tight">
          {article.title}
        </h1>

        <p className="text-base text-zinc-300 font-light leading-relaxed mb-6">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-white/5 pt-4">
          <span>Por {article.author}</span>
          <span>{article.readTimeMinutes} min de lectura</span>
          <span>{article.views} vistas</span>
        </div>
      </header>

      <div className="p-8 md:p-12 rounded-3xl glass-convex-panel prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-4">
        <div className="whitespace-pre-line text-sm md:text-base font-light">
          {article.contentMarkdown}
        </div>

        {article.sourceUrl && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>Fuente Oficial de la Noticia</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
