'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { AiResource } from '../../../features/ai/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function AiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const tDetail = useTranslations('Detail');
  const tNav = useTranslations('Nav');
  const tCard = useTranslations('CardActions');
  const tAi = useTranslations('Ai');
  const tCommon = useTranslations('Common');
  const [resource, setResource] = useState<AiResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`${API_URL}/software/ai/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error(tAi('empty'));
        const data = await res.json();
        setResource(data.data || data);
      } catch (err: any) {
        setError(err.message || tAi('empty'));
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [slug, locale, tAi]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          {tCommon('loading')}
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || tAi('empty')}</p>
        <Link href="/ai" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-white transition-all">
          {tAi('back')}
        </Link>
      </div>
    );
  }

  return (
    <SoftwareArticleLayout
      category="ai"
      categoryLabel={tNav('ai')}
      categoryHref="/ai"
      title={resource.name}
      subtitle={resource.description}
      author={resource.provider}
    >
      <MarkdownRenderer content={resource.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
