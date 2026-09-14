import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Project } from '../../../features/projects/types';
import { serverGet } from '../../../utils/serverFetch';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const project = await serverGet<Project>(`/software/projects/${slug}?lang=${locale}`);

  if (!project) {
    return { title: 'Proyecto no encontrado | Software — Jorge Doicela' };
  }

  return {
    title: `${project.name} | Proyectos — Jorge Doicela`,
    description: project.description,
    openGraph: {
      title: project.name,
      description: project.description,
      type: 'article',
      authors: ['Jorge Doicela'],
      ...(project.coverImage ? { images: [{ url: project.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/projects/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Detail');
  const tCard = await getTranslations('CardActions');
  const tFilters = await getTranslations('Filters');

  const project = await serverGet<Project>(`/software/projects/${slug}?lang=${locale}`);

  if (!project) notFound();

  const formattedDate = new Date(project.publishedAt || project.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: tFilters('inProduction'), color: 'text-emerald-500 dark:text-emerald-400 font-bold' },
    wip: { label: tFilters('inDevelopment'), color: 'text-amber-500 dark:text-amber-400 font-bold' },
    archived: { label: tFilters('archived'), color: 'text-zinc-500 dark:text-zinc-400 font-medium' },
  };
  const statusBadge = statusLabels[project.status] || { label: project.status, color: 'text-emerald-500 dark:text-emerald-400 font-bold' };

  const techList = project.techStack
    ? project.techStack.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <SoftwareArticleLayout
      category="projects"
      categoryLabel={tNav('projects')}
      categoryHref="/projects"
      title={project.name}
      subtitle={project.description}
      date={formattedDate}
      author="Jorge Doicela"
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400 pb-2 border-b border-black/5 dark:border-white/5">
            {tDetail('projectSpec')}
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-zinc-500">{tDetail('status')}</span>
              <span className={statusBadge.color}>
                {statusBadge.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-zinc-500">{tDetail('stars')}</span>
              <span className="text-amber-500 dark:text-amber-400 font-bold">★ {project.stars}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-zinc-500">{tDetail('views')}</span>
              <span className="text-slate-700 dark:text-zinc-300 font-semibold">{project.views.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-zinc-500">{tDetail('license')}</span>
              <span className="text-slate-700 dark:text-zinc-300">{tDetail('openSourceLicense')}</span>
            </div>
          </div>

          {(project.repoUrl || project.liveUrl) && (
            <div className="pt-3 border-t border-black/5 dark:border-white/5 space-y-2">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  {tCard('viewGithub')}
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs text-center block transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer"
                >
                  {tCard('openLiveApp')}
                </a>
              )}
            </div>
          )}
        </div>
      }
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

      {/* Caso de Estudio y Arquitectura */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
          {tDetail('architecturePrinciples')}
        </h3>
        <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-light leading-relaxed">
          {tDetail('architecturePrinciplesDesc')}
        </p>

        {project.architectureDiagramUrl && (
          <div className="pt-4">
            <div className="relative w-full rounded-2xl overflow-hidden glass-concave-panel border border-black/5 dark:border-white/5 p-4 flex items-center justify-center">
              <Image
                src={project.architectureDiagramUrl}
                alt={`Diagrama de Arquitectura — ${project.name}`}
                width={1200}
                height={675}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </SoftwareArticleLayout>
  );
}
