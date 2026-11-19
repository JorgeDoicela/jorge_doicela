import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Tutorial, TutorialStepWizard } from '../../../entities/tutorials';
import { serverGet } from '../../../shared/lib/serverFetch';
import {
  buildArticleMetadata,
  fetchArticlePageContext,
  formatArticleDates,
  parseTechStack,
} from '../../../shared/lib/articlePage';
import { ArticleMetaPanel } from '../../../shared/ui';
import { DoiceladevArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tCommon, tutorial] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<Tutorial>(`/doiceladev/tutorials/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: tutorial,
    modulePath: 'tutorials',
    moduleLabel: tNav('tutorials'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function TutorialDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, { item: tutorial, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      fetchArticlePageContext<Tutorial>('tutorials', slug, locale),
    ]);

  if (!tutorial) notFound();

  const dates = formatArticleDates(
    tutorial.publishedAt,
    tutorial.createdAt,
    tutorial.updatedAt,
    locale,
  );

  const techList = parseTechStack(tutorial.techStack);

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="tutorials"
      categoryLabel={tNav('tutorials')}
      categoryHref="/tutorials"
      title={tutorial.title}
      subtitle={tutorial.excerpt}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={tutorial.author}
      tags={tutorial.tags}
      recommendations={recommendations}
    >
      <ArticleMetaPanel
        title={tMeta('tutorialBrief')}
        rows={
          tutorial.prerequisites
            ? [{ label: tMeta('prerequisites'), value: tutorial.prerequisites }]
            : []
        }
        badges={
          techList.length > 0
            ? { label: tMeta('techStack'), items: techList }
            : undefined
        }
      />

      {tutorial.steps && tutorial.steps.length > 0 ? (
        <div className="space-y-8">
          {tutorial.contentMarkdown && (
            <div className="pb-4 border-b border-black/5 dark:border-white/5">
              <MarkdownRenderer
                content={tutorial.contentMarkdown}
                glossaryTerms={glossary}
              />
            </div>
          )}
          <TutorialStepWizard steps={tutorial.steps} />
        </div>
      ) : (
        <MarkdownRenderer
          content={tutorial.contentMarkdown}
          glossaryTerms={glossary}
        />
      )}
    </DoiceladevArticleLayout>
  );
}
