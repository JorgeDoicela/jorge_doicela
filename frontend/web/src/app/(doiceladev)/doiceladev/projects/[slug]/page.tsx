import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Project, ProjectActions } from '../../../entities/projects';
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
  const project = await serverGet<Project>(`/doiceladev/projects/${slug}?lang=${locale}`);

  if (!project) {
    return { title: `${tCommon('notFound')} | DoicelaDev — Jorge Doicela` };
  }

  return {
    title: `${project.name} | ${tNav('projects')} — Jorge Doicela`,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: 'article',
      publishedTime: project.publishedAt || project.createdAt,
      ...(project.updatedAt ? { modifiedTime: project.updatedAt } : {}),
      authors: [project.author],
      ...(project.coverImage ? { images: [{ url: project.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Detail');

  const cookieStore = await cookies();
  const readHistory = cookieStore.get('doicela_read_history')?.value || '';

  const [project, glossary, recommendations] = await Promise.all([
    serverGet<Project>(`/doiceladev/projects/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/doiceladev/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
    serverGet<RecommendationCard[]>(
      `/doiceladev/recommendations?module=projects&slug=${slug}&lang=${locale}${
        readHistory ? `&exclude=${encodeURIComponent(readHistory)}` : ''
      }`,
    ).catch(() => [] as RecommendationCard[]),
  ]);

  if (!project) notFound();

  const pubRaw = project.publishedAt || project.createdAt;
  const updRaw = project.updatedAt;

  const formattedPublishedDate = pubRaw
    ? new Date(pubRaw).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : undefined;

  const isMeaningfullyUpdated = Boolean(
    pubRaw &&
      updRaw &&
      new Date(updRaw).getTime() - new Date(pubRaw).getTime() > 24 * 60 * 60 * 1000,
  );

  const formattedUpdatedDate = isMeaningfullyUpdated
    ? new Date(updRaw).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : undefined;

  const techList = project.techStack
    ? project.techStack.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="projects"
      categoryLabel={tNav('projects')}
      categoryHref="/projects"
      title={project.name}
      subtitle={project.description}
      date={formattedPublishedDate}
      publishedAtIso={pubRaw ? new Date(pubRaw).toISOString() : undefined}
      updatedDate={formattedUpdatedDate}
      updatedAtIso={isMeaningfullyUpdated ? new Date(updRaw).toISOString() : undefined}
      author={project.author}
      tags={project.techStack}
      recommendations={recommendations || []}
    >
      {/* Badges de Tecnologías */}
      {techList.length > 0 && (
        <div className="space-y-3 pb-6 border-b border-black/5 dark:border-white/5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400">
            {tDetail('techStackUsed')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {techList.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl glass-concave-panel text-slate-700 dark:text-zinc-300 text-xs font-mono border border-black/5 dark:border-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contenido Editorial en Markdown (Mismo estándar universal) */}
      <MarkdownRenderer
        content={project.contentMarkdown || project.description}
        glossaryTerms={glossary || []}
      />

      {/* Botones de Acción de Enlaces Externos al final del artículo (CTA) */}
      <div className="pt-4">
        <ProjectActions liveUrl={project.liveUrl} repoUrl={project.repoUrl} />
      </div>
    </DoiceladevArticleLayout>
  );
}
