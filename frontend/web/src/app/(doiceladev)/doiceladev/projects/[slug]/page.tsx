import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Project, ProjectActions } from '../../../entities/projects';
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
  const [tNav, tCommon, project] = await Promise.all([
    getTranslations('Nav'),
    getTranslations('Common'),
    serverGet<Project>(`/doiceladev/projects/${slug}?lang=${locale}`),
  ]);

  return buildArticleMetadata({
    record: project,
    modulePath: 'projects',
    moduleLabel: tNav('projects'),
    notFoundLabel: tCommon('notFound'),
    slug,
  });
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const [tNav, tMeta, tFilters, { item: project, glossary, recommendations }] =
    await Promise.all([
      getTranslations('Nav'),
      getTranslations('ArticleMeta'),
      getTranslations('Filters'),
      fetchArticlePageContext<Project>('projects', slug, locale),
    ]);

  if (!project) notFound();

  const dates = formatArticleDates(
    project.publishedAt,
    project.createdAt,
    project.updatedAt,
    locale,
  );

  const techList = parseTechStack(project.techStack);

  const statusLabel =
    project.status === 'active'
      ? tFilters('active')
      : project.status === 'wip'
        ? tFilters('wip')
        : tFilters('archived');

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="projects"
      categoryLabel={tNav('projects')}
      categoryHref="/projects"
      title={project.title}
      subtitle={project.excerpt}
      date={dates.formattedPublishedDate}
      publishedAtIso={dates.publishedAtIso}
      updatedDate={dates.formattedUpdatedDate}
      updatedAtIso={dates.updatedAtIso}
      author={project.author}
      tags={project.tags}
      recommendations={recommendations}
    >
      <ArticleMetaPanel
        title={tMeta('projectBrief')}
        rows={[{ label: tMeta('status'), value: statusLabel }]}
        badges={
          techList.length > 0
            ? { label: tMeta('techStack'), items: techList }
            : undefined
        }
      />

      <MarkdownRenderer
        content={project.contentMarkdown}
        glossaryTerms={glossary}
      />

      <div className="pt-4">
        <ProjectActions liveUrl={project.liveUrl} repoUrl={project.repoUrl} />
      </div>
    </DoiceladevArticleLayout>
  );
}
