import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { NewsArticle } from '../../../entities/news';
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
  const [tNav, tCommon, article] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<NewsArticle>(`/doiceladev/news/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: article,
    modulePath: 'news',
    moduleLabel: tNav('news'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, { item: article, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      fetchArticlePageContext<NewsArticle>('news', slug, locale),
    ]);

  if (!article) notFound();

  const dates = formatArticleDates(
    article.publishedAt,
    article.createdAt,
    article.updatedAt,
    locale,
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="news"
      categoryLabel={tNav('news')}
      categoryHref="/news"
      title={article.title}
      subtitle={article.excerpt}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={article.author}
      tags={article.tags}
      recommendations={recommendations}
    >
      <MarkdownRenderer
        content={article.contentMarkdown}
        glossaryTerms={glossary}
      />

      <ArticleMetaPanel
        title={tMeta('newsBrief')}
        placement="footer"
        links={
          article.sourceUrl
            ? [{ label: tMeta('primarySource'), href: article.sourceUrl }]
            : []
        }
      />
    </DoiceladevArticleLayout>
  );
}
