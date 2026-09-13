'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Project } from '../../../features/projects/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MermaidBlock, CalloutBlock } from '../../../components/markdown';

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tProjects = useTranslations('Projects');
  const tDetail = useTranslations('Detail');
  const tCard = useTranslations('CardActions');
  const tFilters = useTranslations('Filters');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_URL}/software/projects/${slug}?lang=${locale}`);
        if (!res.ok) throw new Error(tDetail('projectNotFound'));
        const data = await res.json();
        setProject(data.data || data);
      } catch (err: any) {
        setError(err.message || tDetail('projectNotFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug, locale, tDetail]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          {tDetail('loadingProject')}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || tDetail('projectNotFound')}</p>
        <Link href="/projects" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white transition-all">
          {tProjects('back')}
        </Link>
      </div>
    );
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: tFilters('inProduction'), color: 'text-emerald-600 dark:text-emerald-400 font-bold' },
    wip: { label: tFilters('inDevelopment'), color: 'text-amber-600 dark:text-amber-400 font-bold' },
    archived: { label: tFilters('archived'), color: 'text-zinc-500 dark:text-zinc-400 font-medium' },
  };
  const statusBadge = statusLabels[project.status] || { label: project.status, color: 'text-emerald-600 dark:text-emerald-400 font-bold' };

  const techList = project.techStack ? project.techStack.split(',').map((t) => t.trim()) : [];

  return (
    <SoftwareArticleLayout
      category="projects"
      categoryLabel={tNav('projects')}
      categoryHref="/projects"
      title={project.name}
      subtitle={project.description}
      author="Jorge Doicela"
      callout={
        (project.repoUrl || project.liveUrl) ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md hover:shadow-blue-500/25"
              >
                <span>{tCard('openLiveApp')}</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold inline-flex items-center gap-2 text-slate-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm"
              >
                <span>{tCard('viewGithub')}</span>
              </a>
            )}
          </div>
        ) : undefined
      }
    >
      {/* Badges de Tecnologías */}
      {techList.length > 0 && (
        <div className="space-y-3 pb-6 border-b border-black/5 dark:border-white/5">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
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
      </div>
    </SoftwareArticleLayout>
  );
}
