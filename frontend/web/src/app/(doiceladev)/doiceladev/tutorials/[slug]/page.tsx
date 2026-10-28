import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Tutorial, TutorialStepWizard } from '../../../entities/tutorials';
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
  const tutorial = await serverGet<Tutorial>(`/doiceladev/tutorials/${slug}?lang=${locale}`);

  if (!tutorial) {
    return { title: `${tCommon('notFound')} | DoicelaDev — Jorge Doicela` };
  }

  return {
    title: `${tutorial.title} | ${tNav('tutorials')} — Jorge Doicela`,
    description: tutorial.excerpt,
    openGraph: {
      title: tutorial.title,
      description: tutorial.excerpt,
      type: 'article',
      authors: [tutorial.author],
      ...(tutorial.coverImage ? { images: [{ url: tutorial.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/tutorials/${slug}`,
    },
  };
}

export default async function TutorialDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const cookieStore = await cookies();
  const readHistory = cookieStore.get('doicela_read_history')?.value || '';

  const [tutorial, glossary, recommendations] = await Promise.all([
    serverGet<Tutorial>(`/doiceladev/tutorials/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/doiceladev/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
    serverGet<RecommendationCard[]>(
      `/doiceladev/recommendations?module=tutorials&slug=${slug}&lang=${locale}${
        readHistory ? `&exclude=${encodeURIComponent(readHistory)}` : ''
      }`,
    ).catch(() => [] as RecommendationCard[]),
  ]);

  if (!tutorial) notFound();

  const formattedDate = new Date(tutorial.publishedAt || tutorial.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="tutorials"
      categoryLabel={tNav('tutorials')}
      categoryHref="/tutorials"
      title={tutorial.title}
      subtitle={tutorial.excerpt}
      date={formattedDate}
      author={tutorial.author}
      tags={tutorial.tags}
      recommendations={recommendations || []}
    >
      <div className="space-y-8">
        {tutorial.description && (
          <div className="pb-4 border-b border-black/5 dark:border-white/5">
            <MarkdownRenderer content={tutorial.description} glossaryTerms={glossary || []} />
          </div>
        )}
        <TutorialStepWizard steps={tutorial.steps || []} />
      </div>
    </DoiceladevArticleLayout>
  );
}
