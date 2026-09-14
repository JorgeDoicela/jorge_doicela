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
        const res = await fetch(`${API_URL}/software/infrastructure/${slug}?lang=${locale}`, {
          cache: 'no-store',
        });
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
        <Link href="/infrastructure" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-white transition-all">
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

  return (
    <SoftwareArticleLayout
      category="infrastructure"
      categoryLabel={tNav('infrastructure')}
      categoryHref="/infrastructure"
      title={post.title}
      subtitle={post.subtitle || undefined}
      date={formattedDate}
      author="Jorge Doicela"
      callout={
        post.architectureOverview ? (
          <div className="relative p-5 sm:p-6 rounded-2xl overflow-hidden glass-convex-panel border border-blue-500/20 bg-gradient-to-br from-blue-950/15 via-black/[0.02] to-slate-900/20 dark:from-blue-950/30 dark:via-zinc-900/40 dark:to-slate-950/30 space-y-2.5 shadow-md">
            <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              {tDetail('architectureOverview')}
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 font-normal dark:font-light leading-relaxed">
              {post.architectureOverview}
            </p>
          </div>
        ) : undefined
      }
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}


