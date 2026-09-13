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
        <Link href="/blog" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white transition-all">
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
      categoryHref="/blog"
      title={post.title}
      subtitle={post.subtitle || post.excerpt}
      date={formattedDate}
      author={post.author || 'Jorge Doicela'}
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
