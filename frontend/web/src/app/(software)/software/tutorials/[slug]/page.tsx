import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Tutorial, TutorialStepWizard } from '../../../entities/tutorials';
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
  const tutorial = await serverGet<Tutorial>(`/software/tutorials/${slug}?lang=${locale}`);

  if (!tutorial) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
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
      canonical: `https://software.jorgedoicela.com/tutorials/${slug}`,
    },
  };
}

export default async function TutorialDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const [tutorial, glossary] = await Promise.all([
    serverGet<Tutorial>(`/software/tutorials/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/software/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
  ]);

  if (!tutorial) notFound();

  const formattedDate = new Date(tutorial.publishedAt || tutorial.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="tutorials"
      categoryLabel={tNav('tutorials')}
      categoryHref="/tutorials"
      title={tutorial.title}
      subtitle={tutorial.excerpt}
      date={formattedDate}
      author={tutorial.author}
    >
      <div className="space-y-8">
        {tutorial.description && (
          <div className="pb-4 border-b border-black/5 dark:border-white/5">
            <MarkdownRenderer content={tutorial.description} glossaryTerms={glossary || []} />
          </div>
        )}
        <TutorialStepWizard steps={tutorial.steps || []} />
      </div>
    </SoftwareArticleLayout>
  );
}
