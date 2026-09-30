import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AiResource } from '../../../entities/ai';
import type { GlossaryTerm } from '../../../entities/glossary/types';
import { serverGet } from '../../../shared/lib/serverFetch';
import { DoiceladevArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const resource = await serverGet<AiResource>(`/doiceladev/ai/${slug}?lang=${locale}`);

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
      canonical: `https://doiceladev.jorgedoicela.com/ai/${slug}`,
    },
  };
}

export default async function AiDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const [resource, glossary] = await Promise.all([
    serverGet<AiResource>(`/doiceladev/ai/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/doiceladev/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
  ]);

  if (!resource) notFound();

  return (
    <DoiceladevArticleLayout
      category="ai"
      categoryLabel={tNav('ai')}
      categoryHref="/ai"
      title={resource.name}
      subtitle={resource.description}
      author={resource.author}
    >
      <MarkdownRenderer content={resource.contentMarkdown} glossaryTerms={glossary || []} />
    </DoiceladevArticleLayout>
  );
}
