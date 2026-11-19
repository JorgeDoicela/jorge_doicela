import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SecurityPost } from '../../../entities/cybersecurity';
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
    serverGet<SecurityPost>(`/doiceladev/cybersecurity/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: post,
    modulePath: 'cybersecurity',
    moduleLabel: tNav('cybersecurity'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function CybersecurityDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, { item: post, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      fetchArticlePageContext<SecurityPost>('cybersecurity', slug, locale),
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
      category="cybersecurity"
      categoryLabel={tNav('cybersecurity')}
      categoryHref="/cybersecurity"
      title={post.title}
      subtitle={post.excerpt}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={post.author}
      tags={post.tags}
      recommendations={recommendations}
    >
      <ArticleMetaPanel
        title={tMeta('securityBrief')}
        rows={[
          ...(post.cveId ? [{ label: tMeta('cveId'), value: post.cveId }] : []),
          ...(post.affectedSystems
            ? [{ label: tMeta('affectedSystems'), value: post.affectedSystems }]
            : []),
          ...(post.remediation
            ? [{ label: tMeta('remediation'), value: post.remediation }]
            : []),
        ]}
      />

      <MarkdownRenderer
        content={post.contentMarkdown}
        glossaryTerms={glossary}
      />
    </DoiceladevArticleLayout>
  );
}
