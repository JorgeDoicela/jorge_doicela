'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useNews } from '../features/news/hooks/useNews';
import { useBlog } from '../features/blog/hooks/useBlog';
import { useForum } from '../features/forum/hooks/useForum';
import { useAi } from '../features/ai/hooks/useAi';
import { useCybersecurity } from '../features/cybersecurity/hooks/useCybersecurity';
import { useTutorials } from '../features/tutorials/hooks/useTutorials';
import { useProjects } from '../features/projects/hooks/useProjects';
import { useInfrastructure } from '../features/infrastructure/hooks/useInfrastructure';
import { SpotlightModal } from '../features/os/components/SpotlightModal';
import { SoftwareCard } from '../components/SoftwareCard';
import { SoftwareFooter } from '../components/SoftwareFooter';
import { SoftwareHeaderNav } from '../components/SoftwareHeaderNav';

export default function SoftwarePage() {
  const tHome = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Carga asíncrona de datos desde NestJS REST API
  const { news, loading: loadingNews } = useNews(search);
  const { posts, loading: loadingBlog } = useBlog(search);
  const { resources, loading: loadingAi } = useAi(undefined, search);
  const { posts: secPosts, loading: loadingSec } = useCybersecurity(undefined, undefined, search);
  const { tutorials, loading: loadingTut } = useTutorials(undefined, search);
  const { topics, loading: loadingForum } = useForum('all', search);
  const { projects, loading: loadingProj } = useProjects(search);
  const { posts: infraPosts, loading: loadingInfra } = useInfrastructure(undefined, undefined, undefined, search);

  // Destacados (Top 3)
  const featuredArticle1 = news[0];
  const featuredArticle2 = posts[0];
  const featuredArticle3 = secPosts[0];

  // Desacoplar para no duplicar en el feed de portada general
  const displayNews = news.slice(1);
  const displayPosts = posts.slice(1);
  const displaySec = secPosts.slice(1);

  const isLoadingCurrent = loadingNews && loadingBlog && loadingSec && loadingInfra;

  const currentCategoryCount =
    displayNews.length +
    displayPosts.length +
    resources.length +
    displaySec.length +
    tutorials.length +
    topics.length +
    projects.length +
    infraPosts.length;

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('spotlight') === 'true') {
        setIsSpotlightOpen(true);
      }
    }
  }, []);

  return (
    <>
      {/* 1. SPOTLIGHT COMMAND PALETTE MODAL (CMD + K) */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        news={news}
        posts={posts}
        topics={topics}
        aiResources={resources}
        secPosts={secPosts}
        tutorials={tutorials}
        projects={projects}
        infraPosts={infraPosts}
      />

      {/* 2. CONTENIDO PRINCIPAL ESTILO EDITORIAL TECH */}
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-6 sm:px-6 lg:px-8 2xl:px-12 space-y-10 sm:space-y-12 flex-1 pb-16 md:pb-24">
          
          {/* CABECERA EDITORIAL DE MARCA REUTILIZABLE (ESTILO MALWARETECH) */}
          <SoftwareHeaderNav
            activeCategory="all"
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
          />

          {/* SECCIÓN 1: FEATURED POSTS (PUBLICACIONES DESTACADAS VISIBLES EN PORTADA GENERAL) */}
          <section className="animate-in fade-in duration-300">
            {/* Contenedor Único para las 3 Publicaciones Destacadas */}
            <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                  {tHome('featuredPosts')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Destacado 1: Noticia */}
                {featuredArticle1 ? (
                  <SoftwareCard
                    href={`/software/news/${featuredArticle1.slug}`}
                    title={featuredArticle1.title}
                    category="news"
                    coverImage={featuredArticle1.coverImage}
                    tag="NextJS16"
                    categoryMeta={tHome('newsFrontend')}
                    excerpt={featuredArticle1.excerpt}
                    priority={true}
                    accentHoverColor="group-hover:text-cyan-300"
                  />
                ) : (
                  <div className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center">
                    {tCommon('loading')}
                  </div>
                )}

                {/* Destacado 2: Ensayo de Arquitectura */}
                {featuredArticle2 ? (
                  <SoftwareCard
                    href={`/software/blog/${featuredArticle2.slug}`}
                    title={featuredArticle2.title}
                    category="blog"
                    coverImage={featuredArticle2.coverImage}
                    tag="NestJS"
                    categoryMeta={tHome('architectureBackend')}
                    excerpt={featuredArticle2.excerpt}
                    accentHoverColor="group-hover:text-blue-300"
                  />
                ) : (
                  <div className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center">
                    {tCommon('loading')}
                  </div>
                )}

                {/* Destacado 3: Ciberseguridad */}
                {featuredArticle3 ? (
                  <SoftwareCard
                    href={`/software/cybersecurity/${featuredArticle3.slug}`}
                    title={featuredArticle3.title}
                    category="cybersecurity"
                    tag={featuredArticle3.cveId || 'CVE'}
                    categoryMeta={tHome('cveLinux', { severity: featuredArticle3.severity })}
                    excerpt={featuredArticle3.excerpt}
                    accentHoverColor="group-hover:text-rose-300"
                  />
                ) : (
                  <div className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center">
                    {tCommon('loading')}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: LATEST POSTS / FEED GLOBAL (GRILLA EDITORIAL EN CONTENEDOR UNIFICADO) */}
          <section className="animate-in fade-in duration-300">
            {/* Contenedor Único para toda la Grilla de Publicaciones */}
            <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                  {tHome('latestPosts')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingCurrent && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-zinc-400">
                    <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-xs font-mono tracking-wider uppercase text-zinc-500">{tCommon('loading')}</p>
                  </div>
                )}

                {!isLoadingCurrent && currentCategoryCount === 0 && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-zinc-500 glass-concave-panel rounded-2xl border border-white/5">
                    <p className="text-sm font-medium text-zinc-400">{tCommon('notFound')}</p>
                  </div>
                )}

                {/* Noticias */}
                {displayNews.map((item) => (
                  <SoftwareCard
                    key={`news-${item.id}`}
                    href={`/software/news/${item.slug}`}
                    title={item.title}
                    category="news"
                    coverImage={item.coverImage}
                    tag={tHome('newsTag')}
                    categoryMeta={tHome('newsTag')}
                    excerpt={item.excerpt}
                    accentHoverColor="group-hover:text-cyan-300"
                  />
                ))}

                {/* Ensayos de Arquitectura */}
                {displayPosts.map((item) => (
                  <SoftwareCard
                    key={`blog-${item.id}`}
                    href={`/software/blog/${item.slug}`}
                    title={item.title}
                    category="blog"
                    coverImage={item.coverImage}
                    tag={tHome('blogTag')}
                    categoryMeta={tHome('blogTag')}
                    excerpt={item.excerpt}
                    accentHoverColor="group-hover:text-blue-300"
                  />
                ))}

                {/* Modelos IA & Inferencia */}
                {resources.map((res) => (
                  <SoftwareCard
                    key={`ai-${res.id}`}
                    href={`/software/ai/${res.slug}`}
                    title={res.name}
                    category="ai"
                    tag={res.type}
                    categoryMeta={`${res.provider} — ${res.type.toUpperCase()}`}
                    excerpt={res.description}
                    accentHoverColor="group-hover:text-indigo-300"
                  />
                ))}

                {/* Ciberseguridad & CVE */}
                {displaySec.map((sec) => (
                  <SoftwareCard
                    key={`sec-${sec.id}`}
                    href={`/software/cybersecurity/${sec.slug}`}
                    title={sec.title}
                    category="cybersecurity"
                    tag={sec.cveId || 'CVE'}
                    categoryMeta={tHome('advisorySecurity', { severity: sec.severity })}
                    excerpt={sec.excerpt}
                    accentHoverColor="group-hover:text-rose-300"
                  />
                ))}

                {/* Tutoriales */}
                {tutorials.map((item) => (
                  <SoftwareCard
                    key={`tut-${item.id}`}
                    href={`/software/tutorials/${item.slug}`}
                    title={item.title}
                    category="tutorials"
                    tag={tHome('guideTag')}
                    categoryMeta={tHome('tutorialTag')}
                    excerpt={item.excerpt}
                    accentHoverColor="group-hover:text-slate-200"
                  />
                ))}

                {/* Debates de la Comunidad */}
                {topics.map((item) => (
                  <SoftwareCard
                    key={`topic-${item.id}`}
                    href={`/software/forum/${item.slug}`}
                    title={item.title}
                    category="forum"
                    tag={tHome('forumTag')}
                    categoryMeta={tHome('forumMeta', { replies: item.repliesCount })}
                    excerpt={item.content}
                    accentHoverColor="group-hover:text-blue-300"
                  />
                ))}

                {/* Proyectos Open Source */}
                {projects.map((proj) => (
                  <SoftwareCard
                    key={`proj-${proj.id}`}
                    href={`/software/projects/${proj.slug}`}
                    title={proj.name}
                    category="projects"
                    tag={tHome('projectTag')}
                    categoryMeta={tHome('projectMeta', { stars: proj.stars })}
                    excerpt={proj.description}
                    accentHoverColor="group-hover:text-blue-300"
                  />
                ))}

                {/* Infraestructura, Servidores y Cloud */}
                {infraPosts.map((inf) => (
                  <SoftwareCard
                    key={`infra-${inf.id}`}
                    href={`/software/infrastructure/${inf.slug}`}
                    title={inf.title}
                    category="infrastructure"
                    subCategory={inf.category}
                    tag={inf.environment.toUpperCase()}
                    categoryMeta={`${inf.category}, ${inf.environment}`}
                    excerpt={inf.subtitle || inf.architectureOverview}
                    accentHoverColor="group-hover:text-emerald-300"
                  />
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* FOOTER MULTICOLUMNA ELEGANTE DE ANCHO COMPLETO (ESTILO MALWARETECH) */}
        <SoftwareFooter />
      </main>
    </>
  );
}
