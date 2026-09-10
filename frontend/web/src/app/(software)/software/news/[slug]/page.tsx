'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { NewsArticle } from '../../../features/news/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const t = useTranslations('News');
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const tDetail = useTranslations('Detail');
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/software/news/${slug}?lang=${locale}`);
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
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          {tCommon('loading')}
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || t('empty')}</p>
        <Link href="/software/news" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-cyan-400 hover:text-white transition-all">
          {t('back')}
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SoftwareArticleLayout
      category="news"
      categoryLabel={tNav('news')}
      categoryHref="/software/news"
      title={article.title}
      subtitle={article.excerpt}
      date={formattedDate}
      author={article.author || 'Jorge Doicela'}
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 space-y-3">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            {tDetail('exploreNews')}
          </h5>
          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            {tDetail('exploreNewsDesc')}
          </p>
          <Link
            href="/software/news"
            className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-cyan-400 hover:text-white transition-all"
          >
            {t('allNews')}
          </Link>
        </div>
      }
    >
      {/* Contenido Enriquecido en Markdown */}
      <MarkdownRenderer content={article.contentMarkdown} />

      {/* Fuente Oficial si existe */}
      {article.sourceUrl && (
        <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-concave-panel text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{tCommon('officialSource')}</span>
          </a>
        </div>
      )}
    </SoftwareArticleLayout>
  );
}
