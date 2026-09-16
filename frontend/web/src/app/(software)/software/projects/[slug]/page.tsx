import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Project, ProjectActions } from '../../../entities/projects';
import { serverGet } from '../../../shared/lib/serverFetch';
import { SoftwareArticleLayout } from '../../../widgets/article-layout';
import { MermaidBlock, CalloutBlock } from '../../../shared/markdown';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const project = await serverGet<Project>(`/software/projects/${slug}?lang=${locale}`);

  if (!project) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
  }

  return {
    title: `${project.name} | ${tNav('projects')} — Jorge Doicela`,
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

  const project = await serverGet<Project>(`/software/projects/${slug}?lang=${locale}`);

  if (!project) notFound();

  const formattedDate = new Date(project.publishedAt || project.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

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
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight font-mono">
            {tDetail('architecturePrinciples')}
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-light leading-relaxed">
            {tDetail('architecturePrinciplesDesc')}
          </p>
        </div>

        <MermaidBlock
          chart={
            locale === 'es'
              ? `graph TD
    subgraph Edge ["Perímetro Seguro (AWS Lightsail)"]
        CF["Cloudflare Edge (SSL / DNS)"]
        Nginx["Nginx Reverse Proxy (:80 / :443)"]
    end

    subgraph Runtimes ["Runtimes Consolidados (1 GB RAM)"]
        Next["Next.js 16 (App Router + FSD)<br/>Puerto 3001"]
        Nest["NestJS 11 (Modular Monolith)<br/>Puerto 3000"]
    end

    subgraph Storage ["Persistencia Aislada (Cajas Negras)"]
        DBSw[("software.sqlite (WAL)")]
        DBBib[("bible.sqlite (WAL)")]
        DBPort[("portfolio.sqlite (WAL)")]
    end

    CF --> Nginx
    Nginx -->|Web Traffic| Next
    Nginx -->|API Traffic| Nest
    Nest --> DBSw
    Nest --> DBBib
    Nest --> DBPort`
              : `graph TD
    subgraph Edge ["Secure Perimeter (AWS Lightsail)"]
        CF["Cloudflare Edge (SSL / DNS)"]
        Nginx["Nginx Reverse Proxy (:80 / :443)"]
    end

    subgraph Runtimes ["Consolidated Runtimes (1 GB RAM)"]
        Next["Next.js 16 (App Router + FSD)<br/>Port 3001"]
        Nest["NestJS 11 (Modular Monolith)<br/>Port 3000"]
    end

    subgraph Storage ["Isolated Persistence (Black-Box)"]
        DBSw[("software.sqlite (WAL)")]
        DBBib[("bible.sqlite (WAL)")]
        DBPort[("portfolio.sqlite (WAL)")]
    end

    CF --> Nginx
    Nginx -->|Web Traffic| Next
    Nginx -->|API Traffic| Nest
    Nest --> DBSw
    Nest --> DBBib
    Nest --> DBPort`
          }
        />

        <CalloutBlock type="note">
          {locale === 'es'
            ? 'Las 4 aplicaciones (landing, portfolio, bible, software) conviven en un único monorepo pnpm pero mantienen aislamiento absoluto de dependencias locales y bases de datos físicas independientes en backend/data/.'
            : 'All 4 sub-applications (landing, portfolio, bible, software) reside within a unified pnpm monorepo while enforcing strict zero-cross-import isolation and discrete physical SQLite files in backend/data/.'}
        </CalloutBlock>

        {/* Botones de Acción de Enlaces Externos al final del artículo (CTA) */}
        <ProjectActions liveUrl={project.liveUrl} repoUrl={project.repoUrl} />
      </div>
    </SoftwareArticleLayout>
  );
}
