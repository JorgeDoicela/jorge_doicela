'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { InfrastructurePost } from '../../../features/infrastructure/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function InfrastructureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tInfra = useTranslations('Infrastructure');
  const tDetail = useTranslations('Detail');
  const [post, setPost] = useState<InfrastructurePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/software/infrastructure/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error(tDetail('postNotFound'));
        const data = await res.json();
        setPost(data.data || data);
      } catch (err: any) {
        setError(err.message || tDetail('postNotFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, locale, tDetail]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          {tDetail('loadingInfrastructure')}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || tDetail('postNotFound')}</p>
        <Link href="/software/infrastructure" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-emerald-400 hover:text-white transition-all">
          {tInfra('back')}
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  let parsedSpecs: Record<string, string> = {};
  if (post.specs) {
    try {
      parsedSpecs = JSON.parse(post.specs);
    } catch {
      // Ignorar error si no es JSON válido
    }
  }

  return (
    <SoftwareArticleLayout
      category="infrastructure"
      categoryLabel={tNav('infrastructure')}
      categoryHref="/software/infrastructure"
      title={post.title}
      subtitle={post.subtitle || undefined}
      date={formattedDate}
      author="Jorge Doicela"
      callout={
        post.architectureOverview ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/20 border-l-4 border-emerald-600 dark:border-emerald-400 space-y-1.5 shadow-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {tDetail('architectureOverview')}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200/90 font-medium dark:font-light leading-relaxed">
              {post.architectureOverview}
            </p>
          </div>
        ) : undefined
      }
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pb-2 border-b border-black/5 dark:border-white/5">
            {tDetail('serverSpecs')}
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('environment')}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{post.environment}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('difficulty')}</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 capitalize">{post.difficulty}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('category')}</span>
              <span className="text-slate-800 dark:text-zinc-300 capitalize">{post.category}</span>
            </div>
            {Object.entries(parsedSpecs).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-zinc-500 capitalize">{key}</span>
                <span className="text-slate-900 dark:text-zinc-200 truncate max-w-[140px] text-right font-medium">{val}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-black/5 dark:border-white/5">
            <Link
              href="/software/infrastructure"
              className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-white transition-all"
            >
              {tDetail('allInfrastructure')}
            </Link>
          </div>
        </div>
      }
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
