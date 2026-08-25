'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNews } from '../features/news/hooks/useNews';
import { useBlog } from '../features/blog/hooks/useBlog';
import { useForum } from '../features/forum/hooks/useForum';
import { useAi } from '../features/ai/hooks/useAi';
import { useCybersecurity } from '../features/cybersecurity/hooks/useCybersecurity';
import { useTutorials } from '../features/tutorials/hooks/useTutorials';
import { useProjects } from '../features/projects/hooks/useProjects';
import { MenuBar } from '../features/os/components/MenuBar';
import { SpotlightModal } from '../features/os/components/SpotlightModal';
import { CategoryNav, SoftwareSection } from '../features/navigation/components/CategoryNav';

export default function SoftwarePage() {
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

  // Destacados (Top 3)
  const featuredArticle1 = news[0];
  const featuredArticle2 = posts[0];
  const featuredArticle3 = secPosts[0];

  // Desacoplar para no duplicar en el feed cuando está en 'all'
  const displayNews = activeCategory === 'all' ? news.slice(1) : news;
  const displayPosts = activeCategory === 'all' ? posts.slice(1) : posts;
  const displaySec = activeCategory === 'all' ? secPosts.slice(1) : secPosts;

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      {/* 1. NAVBAR SUPERIOR FIJO */}
      <MenuBar
        theme="dark"
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
      />

      {/* 2. SPOTLIGHT COMMAND PALETTE MODAL (CMD + K) */}
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
      />

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="min-h-[calc(100vh-3.5rem)] bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 py-8 md:py-12">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-10">
          
          {/* SECCIÓN 1: ARTÍCULOS DESTACADOS (BENTO GRID ASIMÉTRICO) */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2.5 border-b border-black/5 dark:border-white/5">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                Publicaciones Destacadas
              </h2>
              <span className="text-xs font-mono text-zinc-500">Últimas publicaciones técnicas</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Destacado 1 (Hero Card - 2 Columnas) */}
              {featuredArticle1 ? (
                <Link
                  href={`/software/news/${featuredArticle1.slug}`}
                  className="lg:col-span-2 group p-7 md:p-8 rounded-3xl glass-convex-panel hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                          {featuredArticle1.isBreaking ? '● Breaking News' : 'Noticia Principal'}
                        </span>
                      </div>
                      <span>{featuredArticle1.readTimeMinutes} min de lectura</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-[var(--header-title)] group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug">
                      {featuredArticle1.title}
                    </h3>

                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {featuredArticle1.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-zinc-500 font-mono">
                      <span>{featuredArticle1.views} vistas</span>
                      <span>•</span>
                      <span>{featuredArticle1.likes || 0} likes</span>
                    </div>
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Leer artículo completo →
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="lg:col-span-2 p-8 rounded-3xl glass-convex-panel animate-pulse text-xs font-mono text-zinc-500">
                  Cargando noticia destacada...
                </div>
              )}

              {/* Columna Lateral de Destacados (2 Tarjetas Apiladas) */}
              <div className="flex flex-col gap-6">
                {/* Destacado 2: Ensayo de Arquitectura */}
                {featuredArticle2 ? (
                  <Link
                    href={`/software/blog/${featuredArticle2.slug}`}
                    className="group p-6 rounded-3xl glass-convex-panel hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between flex-1"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">
                          Arquitectura
                        </span>
                        <span>{featuredArticle2.readTimeMinutes} min</span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-snug">
                        {featuredArticle2.title}
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {featuredArticle2.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono">{featuredArticle2.likes} likes</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        Leer ensayo →
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="p-6 rounded-3xl glass-convex-panel animate-pulse text-xs font-mono text-zinc-500 flex-1">
                    Cargando ensayo...
                  </div>
                )}

                {/* Destacado 3: Ciberseguridad / CVE */}
                {featuredArticle3 ? (
                  <Link
                    href={`/software/cybersecurity/${featuredArticle3.slug}`}
                    className="group p-6 rounded-3xl glass-convex-panel hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between flex-1"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                        <span className="text-rose-600 dark:text-rose-400 font-bold uppercase">
                          {featuredArticle3.severity}
                        </span>
                        <span className="text-zinc-400 font-mono">{featuredArticle3.cveId || 'CVE'}</span>
                      </div>

                      <h3 className="text-base font-bold text-[var(--header-title)] group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors leading-snug">
                        {featuredArticle3.title}
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {featuredArticle3.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono truncate max-w-[130px]">{featuredArticle3.affectedSystems || 'Linux/Cloud'}</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                        Ver aviso →
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="p-6 rounded-3xl glass-convex-panel animate-pulse text-xs font-mono text-zinc-500 flex-1">
                    Cargando aviso...
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: SELECTOR DE CATEGORÍAS (FSD CategoryNav) */}
          <section className="pt-2">
            <CategoryNav
              selectedCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />
          </section>

          {/* SECCIÓN 3: FEED DE PUBLICACIONES Y WIDGETS */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal: Lista de Artículos (2 columnas) */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold text-[var(--header-title)]">
                  {activeCategory === 'all'
                    ? 'Últimos Artículos & Publicaciones'
                    : `Feed: ${activeCategory}`}
                </h3>
              </div>

              {/* Noticias */}
              {(activeCategory === 'all' || activeCategory === 'news') &&
                displayNews.map((item) => (
                  <Link
                    key={`news-${item.id}`}
                    href={`/software/news/${item.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
                          Noticia
                        </span>
                        <span>•</span>
                        <span>{item.readTimeMinutes} min de lectura</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Leer →
                    </span>
                  </Link>
                ))}

              {/* Ensayos de Arquitectura */}
              {(activeCategory === 'all' || activeCategory === 'blog') &&
                displayPosts.map((item) => (
                  <Link
                    key={`blog-${item.id}`}
                    href={`/software/blog/${item.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase">
                          Arquitectura
                        </span>
                        <span>•</span>
                        <span>{item.readTimeMinutes} min</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Leer →
                    </span>
                  </Link>
                ))}

              {/* Modelos IA & Inferencia */}
              {(activeCategory === 'all' || activeCategory === 'ai') &&
                resources.map((res) => (
                  <Link
                    key={`ai-${res.id}`}
                    href={`/software/ai/${res.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
                          {res.type}
                        </span>
                        <span>•</span>
                        <span>Por {res.provider}</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {res.name}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {res.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Ficha →
                    </span>
                  </Link>
                ))}

              {/* Ciberseguridad & CVE */}
              {(activeCategory === 'all' || activeCategory === 'cybersecurity') &&
                displaySec.map((sec) => (
                  <Link
                    key={`sec-${sec.id}`}
                    href={`/software/cybersecurity/${sec.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-rose-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase">
                          {sec.severity}
                        </span>
                        <span>•</span>
                        <span>{sec.cveId || 'CVE Alert'}</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {sec.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Ver aviso →
                    </span>
                  </Link>
                ))}

              {/* Tutoriales */}
              {(activeCategory === 'all' || activeCategory === 'tutorials') &&
                tutorials.map((item) => (
                  <Link
                    key={`tut-${item.id}`}
                    href={`/software/tutorials/${item.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-slate-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-slate-600 dark:text-slate-300 font-semibold uppercase">
                          Tutorial
                        </span>
                        <span>•</span>
                        <span>{item.estimatedMinutes} min</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Guía →
                    </span>
                  </Link>
                ))}

              {/* Debates de la Comunidad */}
              {(activeCategory === 'all' || activeCategory === 'forum') &&
                topics.map((item) => (
                  <Link
                    key={`topic-${item.id}`}
                    href={`/software/forum/${item.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase">
                          Foro Técnico
                        </span>
                        <span>•</span>
                        <span>{item.repliesCount} respuestas</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Ver debate →
                    </span>
                  </Link>
                ))}

              {/* Proyectos Open Source */}
              {(activeCategory === 'all' || activeCategory === 'projects') &&
                projects.map((proj) => (
                  <Link
                    key={`proj-${proj.id}`}
                    href={`/software/projects/${proj.slug}`}
                    className="p-4 sm:p-5 rounded-2xl glass-convex-panel hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block group"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase">
                          Proyecto
                        </span>
                        <span>•</span>
                        <span>{proj.stars} stars</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {proj.name}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform">
                      Ver proyecto →
                    </span>
                  </Link>
                ))}
            </div>

            {/* Barra Lateral / Widgets */}
            <div className="space-y-6">
              
              {/* Widget: Modelos IA & Inferencia */}
              <div className="p-6 rounded-3xl glass-convex-panel space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-xs font-bold text-[var(--header-title)] font-mono uppercase tracking-wider">
                    Modelos IA & MCP
                  </h3>
                  <Link href="/software/ai" className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline">
                    Ver todos →
                  </Link>
                </div>

                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {resources.slice(0, 3).map((res) => (
                    <Link
                      key={`widget-ai-${res.id}`}
                      href={`/software/ai/${res.slug}`}
                      className="py-3 px-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all block group"
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">{res.name}</span>
                        <span className="text-[10px] uppercase font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-1">
                        {res.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Widget: Proyectos Open Source */}
              <div className="p-6 rounded-3xl glass-convex-panel space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-xs font-bold text-[var(--header-title)] font-mono uppercase tracking-wider">
                    Showcase de Proyectos
                  </h3>
                  <Link href="/software/projects" className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline">
                    Ver todos →
                  </Link>
                </div>

                <div className="divide-y divide-black/5 dark:divide-white/5">
                  {projects.slice(0, 3).map((proj) => (
                    <div
                      key={`widget-proj-${proj.id}`}
                      className="py-3 px-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--header-title)]">{proj.name}</span>
                        <span className="text-zinc-500 font-mono text-[10px]">{proj.stars} stars</span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Demo ↗
                          </a>
                        )}
                        <Link href={`/software/projects/${proj.slug}`} className="text-zinc-500 hover:text-zinc-300">
                          Detalles →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* FOOTER MULTICOLUMNA ELEGANTE */}
        <footer className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 mt-16">
          <div className="p-8 md:p-10 rounded-3xl glass-convex-panel">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
              <div className="md:col-span-1 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg glass-concave-panel flex items-center justify-center p-1">
                    <Image
                      src="/software/logo/logo_fondo_circular_color_.png"
                      alt="Software"
                      width={28}
                      height={28}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="font-extrabold text-sm text-[var(--header-title)]">Software</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light">
                  Plataforma de software, arquitectura de sistemas y laboratorio de IA de Jorge Doicela.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">Contenidos</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><Link href="/software/news" className="hover:text-cyan-500 transition-colors">Noticias de Tecnología</Link></li>
                  <li><Link href="/software/blog" className="hover:text-blue-500 transition-colors">Ensayos de Arquitectura</Link></li>
                  <li><Link href="/software/tutorials" className="hover:text-slate-400 transition-colors">Tutoriales Prácticos</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">Especialidades</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><Link href="/software/ai" className="hover:text-blue-500 transition-colors">Directorio de IA & Modelos</Link></li>
                  <li><Link href="/software/cybersecurity" className="hover:text-rose-500 transition-colors">Avisos de Ciberseguridad</Link></li>
                  <li><Link href="/software/forum" className="hover:text-blue-500 transition-colors">Foros Comunitarios</Link></li>
                  <li><Link href="/software/projects" className="hover:text-blue-500 transition-colors">Showcase de Proyectos</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">Ecosistema</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><a href="https://jorgedoicela.com" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Portal Principal</a></li>
                  <li><a href="https://portfolio.jorgedoicela.com" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Portafolio SSH</a></li>
                  <li><a href="https://bible.jorgedoicela.com" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Biblia Exegética</a></li>
                </ul>
              </div>
            </div>

            <div className="text-center text-xs text-zinc-500 font-mono">
              <p>Jorge Doicela &copy; {new Date().getFullYear()} — Plataforma de Software e Ingeniería.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
