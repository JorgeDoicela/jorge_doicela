import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { InfrastructurePost } from '../../../entities/infrastructure';
import { serverGet } from '../../../shared/lib/serverFetch';
import {
  buildArticleMetadata,
  fetchArticlePageContext,
  formatArticleDates,
  parseTechStack,
} from '../../../shared/lib/articlePage';
import { ArticleMetaPanel, type ArticleMetaRow } from '../../../shared/ui';
import { DoiceladevArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

function parseSpecsRows(
  rawSpecs: string | undefined,
  resolveLabel: (key: string) => string,
): ArticleMetaRow[] {
  if (!rawSpecs) return [];
  try {
    const parsed: unknown = JSON.parse(rawSpecs);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return [];
    }
    return Object.entries(parsed as Record<string, unknown>)
      .filter(([, val]) => typeof val === 'string' && val.trim().length > 0)
      .map(([key, val]) => ({
        label: resolveLabel(key),
        value: String(val),
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tCommon, post] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<InfrastructurePost>(
      `/doiceladev/infrastructure/${slug}?lang=${locale}`,
    ),
  ]);

  return buildArticleMetadata({
    record: post,
    modulePath: 'infrastructure',
    moduleLabel: tNav('infrastructure'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function InfrastructureDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, tSpecs, { item: post, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      getTranslations('ArticleMeta.specs'),
      fetchArticlePageContext<InfrastructurePost>('infrastructure', slug, locale),
    ]);

  if (!post) notFound();

  const dates = formatArticleDates(
    post.publishedAt,
    post.createdAt,
    post.updatedAt,
    locale,
  );

  const techList = parseTechStack(post.techStack);

  const specRows = parseSpecsRows(post.specs, (key) =>
    tSpecs.has(key as never)
      ? tSpecs(key as never)
      : key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim(),
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="infrastructure"
      categoryLabel={tNav('infrastructure')}
      categoryHref="/infrastructure"
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
        title={tMeta('infrastructureBrief')}
        rows={specRows}
        badges={
          techList.length > 0
            ? { label: tMeta('techStack'), items: techList }
            : undefined
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
