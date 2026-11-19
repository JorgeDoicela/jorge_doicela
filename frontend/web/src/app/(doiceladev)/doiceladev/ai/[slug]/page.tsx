import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { AiResource } from '../../../entities/ai';
import { serverGet } from '../../../shared/lib/serverFetch';
import {
  buildArticleMetadata,
  fetchArticlePageContext,
  formatArticleDates,
} from '../../../shared/lib/articlePage';
import { ArticleMetaPanel, type ArticleMetaLink } from '../../../shared/ui';
import { DoiceladevArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tCommon, resource] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<AiResource>(`/doiceladev/ai/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: resource,
    modulePath: 'ai',
    moduleLabel: tNav('ai'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function AiDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, { item: resource, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      fetchArticlePageContext<AiResource>('ai', slug, locale),
    ]);

  if (!resource) notFound();

  const dates = formatArticleDates(
    resource.publishedAt,
    resource.createdAt,
    resource.updatedAt,
    locale,
  );

  const links: ArticleMetaLink[] = [];
  if (resource.documentationUrl) {
    links.push({ label: tMeta('documentation'), href: resource.documentationUrl });
  }
  if (resource.paperUrl) {
    links.push({ label: tMeta('paper'), href: resource.paperUrl });
  }
  if (resource.githubUrl) {
    links.push({ label: tMeta('repository'), href: resource.githubUrl });
  }

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="ai"
      categoryLabel={tNav('ai')}
      categoryHref="/ai"
      title={resource.title}
      subtitle={resource.excerpt}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={resource.author}
      tags={resource.tags}
      recommendations={recommendations}
    >
      <ArticleMetaPanel
        title={tMeta('aiBrief')}
        rows={[
          ...(resource.provider
            ? [{ label: tMeta('provider'), value: resource.provider }]
            : []),
          ...(resource.license
            ? [{ label: tMeta('license'), value: resource.license }]
            : []),
        ]}
        links={links}
        align={resource.metaAlign}
      />

      <MarkdownRenderer
        content={resource.contentMarkdown}
        glossaryTerms={glossary}
      />
    </DoiceladevArticleLayout>
  );
}
