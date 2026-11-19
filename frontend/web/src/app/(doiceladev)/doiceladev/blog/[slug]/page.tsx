import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BlogPost } from '../../../entities/blog';
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
  const [tNav, tCommon, post] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<BlogPost>(`/doiceladev/blog/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: post,
    modulePath: 'blog',
    moduleLabel: tNav('blog'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, { item: post, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      fetchArticlePageContext<BlogPost>('blog', slug, locale),
    ]);

  if (!post) notFound();

  const dates = formatArticleDates(
    post.publishedAt,
    post.createdAt,
    post.updatedAt,
    locale,
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="blog"
      categoryLabel={tNav('blog')}
      categoryHref="/blog"
      title={post.title}
      subtitle={post.subtitle || post.excerpt}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={post.author}
      tags={post.tags}
      recommendations={recommendations}
    >
      <ArticleMetaPanel
        title={tMeta('blogBrief')}
        rows={
          post.series ? [{ label: tMeta('series'), value: post.series }] : []
        }
        align={post.metaAlign}
      />

      <MarkdownRenderer
        content={post.contentMarkdown}
        glossaryTerms={glossary}
      />
    </DoiceladevArticleLayout>
  );
}
