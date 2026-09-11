'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { CategoryNav, SoftwareSection } from '../features/navigation/components/CategoryNav';
import { ArticleCover } from '../components/ArticleCover';
import { BackToPortalButton } from '../components/BackToPortalButton';
import { LanguageToggle } from '../features/navigation/components/LanguageToggle';
import { SoftwareFooter } from '../components/SoftwareFooter';
import { SoftwareHeaderNav } from '../components/SoftwareHeaderNav';

export default function SoftwarePage() {
  const tHome = useTranslations('Home');
  const tNav = useTranslations('Nav');
  const tCommon = useTranslations('Common');
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SoftwareSection>('all');
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

  // Desacoplar para no duplicar en el feed cuando está en 'all'
  const displayNews = activeCategory === 'all' ? news.slice(1) : news;
  const displayPosts = activeCategory === 'all' ? posts.slice(1) : posts;
  const displaySec = activeCategory === 'all' ? secPosts.slice(1) : secPosts;

  const isLoadingCurrent =
    activeCategory === 'all'
      ? loadingNews && loadingBlog && loadingSec && loadingInfra
      : activeCategory === 'news'
      ? loadingNews
      : activeCategory === 'blog'
      ? loadingBlog
      : activeCategory === 'ai'
      ? loadingAi
      : activeCategory === 'cybersecurity'
      ? loadingSec
      : activeCategory === 'tutorials'
      ? loadingTut
      : activeCategory === 'forum'
      ? loadingForum
      : activeCategory === 'projects'
      ? loadingProj
      : activeCategory === 'infrastructure'
      ? loadingInfra
      : false;

  const currentCategoryCount =
    activeCategory === 'all'
      ? displayNews.length +
        displayPosts.length +
        resources.length +
        displaySec.length +
        tutorials.length +
        topics.length +
        projects.length +
        infraPosts.length
      : activeCategory === 'news'
      ? displayNews.length
      : activeCategory === 'blog'
      ? displayPosts.length
      : activeCategory === 'ai'
      ? resources.length
      : activeCategory === 'cybersecurity'
      ? displaySec.length
      : activeCategory === 'tutorials'
      ? tutorials.length
      : activeCategory === 'forum'
      ? topics.length
      : activeCategory === 'projects'
      ? projects.length
      : activeCategory === 'infrastructure'
      ? infraPosts.length
      : 0;

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
            activeCategory={activeCategory}
            onSelectCategory={(cat: SoftwareSection) => setActiveCategory(cat)}
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
          />

          {/* SECCIÓN 1: FEATURED POSTS (PUBLICACIONES DESTACADAS VISIBLES EXCLUSIVAMENTE EN PORTADA GENERAL) */}
          {activeCategory === 'all' && (
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
                    <Link
                      href={`/software/news/${featuredArticle1.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={featuredArticle1.title}
                          category="news"
                          coverImage={featuredArticle1.coverImage}
                          tag="NextJS16"
                          priority={true}
                        />

                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('newsFrontend')}
                          </p>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--header-title)] group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 mt-1.5">
                            {featuredArticle1.title}
                          </h3>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {featuredArticle1.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center">
                      {tCommon('loading')}
                    </div>
                  )}

                  {/* Destacado 2: Ensayo de Arquitectura */}
                  {featuredArticle2 ? (
                    <Link
                      href={`/software/blog/${featuredArticle2.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={featuredArticle2.title}
                          category="blog"
                          coverImage={featuredArticle2.coverImage}
                          tag="NestJS"
                        />

                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('architectureBackend')}
                          </p>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug line-clamp-2 mt-1.5">
                            {featuredArticle2.title}
                          </h3>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {featuredArticle2.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center">
                      {tCommon('loading')}
                    </div>
                  )}

                  {/* Destacado 3: Ciberseguridad */}
                  {featuredArticle3 ? (
                    <Link
                      href={`/software/cybersecurity/${featuredArticle3.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={featuredArticle3.title}
                          category="cybersecurity"
                          tag={featuredArticle3.cveId || 'CVE'}
                        />

                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('cveLinux', { severity: featuredArticle3.severity })}
                          </p>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--header-title)] group-hover:text-rose-300 transition-colors leading-snug line-clamp-2 mt-1.5">
                            {featuredArticle3.title}
                          </h3>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {featuredArticle3.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-6 rounded-2xl animate-pulse text-xs font-mono text-zinc-500 min-h-[260px] flex items-center justify-center">
                      {tCommon('loading')}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* SECCIÓN 2: LATEST POSTS / CATEGORY FEED (GRILLA EDITORIAL EN CONTENEDOR UNIFICADO) */}
          <section className="animate-in fade-in duration-300">
            {/* Contenedor Único para toda la Grilla de Publicaciones */}
            <div className="p-5 sm:p-6 rounded-3xl glass-convex-panel border border-white/5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                  {activeCategory === 'all'
                    ? tHome('latestPosts')
                    : tHome('postsByCategory', { category: tNav(activeCategory as any) })}
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
                {(activeCategory === 'all' || activeCategory === 'news') &&
                  displayNews.map((item) => (
                    <Link
                      key={`news-${item.id}`}
                      href={`/software/news/${item.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={item.title}
                          category="news"
                          coverImage={item.coverImage}
                          tag={tHome('newsTag')}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('newsTag')}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-cyan-300 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Ensayos de Arquitectura */}
                {(activeCategory === 'all' || activeCategory === 'blog') &&
                  displayPosts.map((item) => (
                    <Link
                      key={`blog-${item.id}`}
                      href={`/software/blog/${item.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={item.title}
                          category="blog"
                          coverImage={item.coverImage}
                          tag={tHome('blogTag')}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('blogTag')}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Modelos IA & Inferencia */}
                {(activeCategory === 'all' || activeCategory === 'ai') &&
                  resources.map((res) => (
                    <Link
                      key={`ai-${res.id}`}
                      href={`/software/ai/${res.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={res.name}
                          category="ai"
                          tag={res.type}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {res.provider} — {res.type.toUpperCase()}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-indigo-300 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {res.name}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {res.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Ciberseguridad & CVE */}
                {(activeCategory === 'all' || activeCategory === 'cybersecurity') &&
                  displaySec.map((sec) => (
                    <Link
                      key={`sec-${sec.id}`}
                      href={`/software/cybersecurity/${sec.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={sec.title}
                          category="cybersecurity"
                          tag={sec.cveId || 'CVE'}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('advisorySecurity', { severity: sec.severity })}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-rose-300 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {sec.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {sec.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Tutoriales */}
                {(activeCategory === 'all' || activeCategory === 'tutorials') &&
                  tutorials.map((item) => (
                    <Link
                      key={`tut-${item.id}`}
                      href={`/software/tutorials/${item.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={item.title}
                          category="tutorials"
                          tag={tHome('guideTag')}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('tutorialTag')}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-slate-200 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {item.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Debates de la Comunidad */}
                {(activeCategory === 'all' || activeCategory === 'forum') &&
                  topics.map((item) => (
                    <Link
                      key={`topic-${item.id}`}
                      href={`/software/forum/${item.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={item.title}
                          category="forum"
                          tag={tHome('forumTag')}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('forumMeta', { replies: item.repliesCount })}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Proyectos Open Source */}
                {(activeCategory === 'all' || activeCategory === 'projects') &&
                  projects.map((proj) => (
                    <Link
                      key={`proj-${proj.id}`}
                      href={`/software/projects/${proj.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={proj.name}
                          category="projects"
                          tag={tHome('projectTag')}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-zinc-400">
                            {tHome('projectMeta', { stars: proj.stars })}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {proj.name}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {proj.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {/* Infraestructura, Servidores y Cloud */}
                {(activeCategory === 'all' || activeCategory === 'infrastructure') &&
                  infraPosts.map((inf) => (
                    <Link
                      key={`infra-${inf.id}`}
                      href={`/software/infrastructure/${inf.slug}`}
                      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm cursor-pointer"
                    >
                      <div className="space-y-3.5">
                        <ArticleCover
                          title={inf.title}
                          category="infrastructure"
                          tag={inf.environment.toUpperCase()}
                        />
                        <div>
                          <p className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                            {inf.category} · {inf.difficulty}
                          </p>
                          <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-emerald-400 transition-colors leading-snug mt-1.5 line-clamp-2">
                            {inf.title}
                          </h4>
                          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                            {inf.subtitle || inf.architectureOverview}
                          </p>
                        </div>
                      </div>
                    </Link>
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
