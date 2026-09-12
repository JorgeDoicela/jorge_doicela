'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BlogPost } from '../../../features/blog/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tBlog = useTranslations('Blog');
  const tDetail = useTranslations('Detail');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/software/blog/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error(tDetail('articleNotFound'));
        const data = await res.json();
        setPost(data.data || data);
      } catch (err: any) {
        setError(err.message || tDetail('articleNotFound'));
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
          {tDetail('loadingEssay')}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || tDetail('articleNotFound')}</p>
        <Link href="/software/blog" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-blue-400 hover:text-white transition-all">
          {tBlog('back')}
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
      category="blog"
      categoryLabel={tNav('blog')}
      categoryHref="/software/blog"
      title={post.title}
      subtitle={post.subtitle || post.excerpt}
      date={formattedDate}
      author={post.author || 'Jorge Doicela'}
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-3">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pb-2 border-b border-black/5 dark:border-white/5">
            {tDetail('softwareArchitecture')}
          </h5>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            {tDetail('softwareArchitectureDesc')}
          </p>
          <Link
            href="/software/blog"
            className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white transition-all"
          >
            {tDetail('allEssays')}
          </Link>
        </div>
      }
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
