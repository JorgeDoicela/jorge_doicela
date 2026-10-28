import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AiResource } from '../../../entities/ai';
import type { GlossaryTerm } from '../../../entities/glossary/types';
import type { RecommendationCard } from '../../../entities/portal/types';
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
    return { title: `${tCommon('notFound')} | DoicelaDev — Jorge Doicela` };
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

  const cookieStore = await cookies();
  const readHistory = cookieStore.get('doicela_read_history')?.value || '';

  const [resource, glossary, recommendations] = await Promise.all([
    serverGet<AiResource>(`/doiceladev/ai/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/doiceladev/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
    serverGet<RecommendationCard[]>(
      `/doiceladev/recommendations?module=ai&slug=${slug}&lang=${locale}${
        readHistory ? `&exclude=${encodeURIComponent(readHistory)}` : ''
      }`,
    ).catch(() => [] as RecommendationCard[]),
  ]);

  if (!resource) notFound();

  const formattedDate = new Date(resource.publishedAt || resource.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="ai"
      categoryLabel={tNav('ai')}
      categoryHref="/ai"
      title={resource.name}
      subtitle={resource.description}
      date={formattedDate}
      author={resource.author}
      tags={resource.tags}
      recommendations={recommendations || []}
    >
      <MarkdownRenderer content={resource.contentMarkdown} glossaryTerms={glossary || []} />
    </DoiceladevArticleLayout>
  );
}
