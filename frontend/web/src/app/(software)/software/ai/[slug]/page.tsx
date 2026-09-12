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
        <Link href="/software/ai" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-purple-400 hover:text-white transition-all">
          {tAi('back')}
        </Link>
      </div>
    );
  }

  return (
    <SoftwareArticleLayout
      category="ai"
      categoryLabel={tNav('ai')}
      categoryHref="/software/ai"
      title={resource.name}
      subtitle={resource.description}
      author={resource.provider}
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pb-2 border-b border-black/5 dark:border-white/5">
            {tDetail('aiSpec')}
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('provider')}</span>
              <span className="font-bold text-slate-900 dark:text-white">{resource.provider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('type')}</span>
              <span className="text-indigo-600 dark:text-indigo-400 uppercase font-semibold">{resource.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('license')}</span>
              <span className="text-slate-800 dark:text-zinc-300">{resource.license}</span>
            </div>
          </div>

          {(resource.documentationUrl || resource.githubUrl || resource.paperUrl) && (
            <div className="pt-2 border-t border-black/5 dark:border-white/5">
              <a
                href={resource.documentationUrl || resource.githubUrl || resource.paperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white transition-all shadow-sm"
              >
                {tCard('accessModel')}
              </a>
            </div>
          )}
        </div>
      }
    >
      <MarkdownRenderer content={resource.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
