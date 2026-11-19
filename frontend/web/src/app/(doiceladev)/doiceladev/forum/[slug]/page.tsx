import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ForumTopic } from '../../../entities/forum';
import { ForumDiscussionSection } from '../../../features/forum-reply';
import { serverGet } from '../../../shared/lib/serverFetch';
import {
  buildArticleMetadata,
  fetchArticlePageContext,
  formatArticleDates,
} from '../../../shared/lib/articlePage';
import { ArticleMetaPanel } from '../../../shared/ui';
import { DoiceladevArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tCommon, topic] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<ForumTopic>(`/doiceladev/forum/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: topic
      ? {
          slug: topic.slug,
          title: topic.title,
          excerpt: topic.content.slice(0, 160),
          author: topic.author,
          coverImage: topic.coverImage,
          publishedAt: topic.createdAt,
          createdAt: topic.createdAt,
          updatedAt: topic.updatedAt,
        }
      : null,
    modulePath: 'forum',
    moduleLabel: tNav('forum'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function ForumTopicDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, tCard, { item: topic, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      getTranslations('CardActions'),
      fetchArticlePageContext<ForumTopic>('forum', slug, locale),
    ]);

  if (!topic) notFound();

  const dates = formatArticleDates(
    topic.createdAt,
    topic.createdAt,
    topic.updatedAt,
    locale,
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="forum"
      categoryLabel={tNav('forum')}
      categoryHref="/forum"
      title={topic.title}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={topic.author}
      tags={topic.tags || topic.category}
      recommendations={recommendations}
    >
      <ArticleMetaPanel
        title={tMeta('forumBrief')}
        rows={[
          {
            label: tMeta('status'),
            value: topic.isSolved ? tCard('solved') : tCard('open'),
          },
          {
            label: tMeta('replies'),
            value: String(topic.replies?.length ?? topic.repliesCount ?? 0),
          },
        ]}
      />

      <MarkdownRenderer content={topic.content} glossaryTerms={glossary} />

      <ForumDiscussionSection topic={topic} locale={locale} />
    </DoiceladevArticleLayout>
  );
}
