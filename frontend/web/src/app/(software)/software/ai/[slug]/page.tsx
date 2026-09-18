import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AiResource } from '../../../entities/ai';
import type { GlossaryTerm } from '../../../entities/glossary/types';
import { serverGet } from '../../../shared/lib/serverFetch';
import { SoftwareArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const resource = await serverGet<AiResource>(`/software/ai/${slug}?lang=${locale}`);

  if (!resource) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
  }

  return {
    title: `${resource.name} | ${tNav('ai')} — Jorge Doicela`,
    description: resource.description,
    openGraph: {
      title: resource.name,
      description: resource.description,
      type: 'article',
      authors: [resource.author],
      ...(resource.coverImage ? { images: [{ url: resource.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/ai/${slug}`,
    },
  };
}

export default async function AiDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const [resource, glossary] = await Promise.all([
    serverGet<AiResource>(`/software/ai/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/software/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
  ]);

  if (!resource) notFound();

  return (
    <SoftwareArticleLayout
      category="ai"
      categoryLabel={tNav('ai')}
      categoryHref="/ai"
      title={resource.name}
      subtitle={resource.description}
      author={resource.author}
      badge={
        <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
          {resource.provider} • {resource.type.toUpperCase()}
        </span>
      }
    >
      <MarkdownRenderer content={resource.contentMarkdown} glossaryTerms={glossary || []} />
    </SoftwareArticleLayout>
  );
}
