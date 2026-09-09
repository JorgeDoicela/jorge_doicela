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
import { SpotlightModal } from '../features/os/components/SpotlightModal';
import { CategoryNav, SoftwareSection } from '../features/navigation/components/CategoryNav';
import { ArticleCover } from '../components/ArticleCover';
import { BackToPortalButton } from '../components/BackToPortalButton';
import { LanguageToggle } from '../features/navigation/components/LanguageToggle';

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
      />

      {/* 2. CONTENIDO PRINCIPAL ESTILO EDITORIAL TECH */}
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 py-6 md:py-10">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-12">
          

          {/* CABECERA EDITORIAL DE MARCA (CENTRALIZADA + ESTILO MALWARETECH) */}
          <header className="flex flex-col items-center justify-center pt-2 pb-4 text-center">
            {/* Título semántico accesible para SEO */}
            <h1 className="sr-only">Software | Jorge Doicela - Especialista en DevSecOps</h1>

            {/* Logotipo Central Compuesto Ampliado (Icono a la izquierda + Nombre y Rol a la derecha) */}
            <div className="flex items-center justify-center gap-3.5 sm:gap-5 select-none">
              <div className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto flex items-center justify-center shrink-0">
                <Image
                  src="/software/logo/logo_blanco.png"
                  alt="Logo Jorge Doicela"
                  width={128}
                  height={128}
                  className="h-full w-auto object-contain"
                  unoptimized
                  priority
                />
              </div>
              <div className="h-12 sm:h-15 md:h-18 lg:h-20 w-auto flex items-center justify-center">
                <Image
                  src="/software/logo/nombre_rol.png"
                  alt="Jorge Doicela - Especialista en DevSecOps"
                  width={340}
                  height={80}
                  className="h-full w-auto object-contain"
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Fila de Redes Sociales Libres y Limpias en Blanco (Pegadas al imagotipo) */}
            <div className="flex items-center justify-center gap-4 mt-0 sm:mt-0.5">
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/in/jorgedoicela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-115 p-0.5"
                  title="LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/JorgeDoicela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-115 p-0.5"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@jorge.doicela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-115 p-0.5"
                  title="YouTube"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@jorge.doicela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-115 p-0.5"
                  title="TikTok"
                  aria-label="TikTok"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.6c3.5 0 6.34-2.84 6.34-6.33V8.86c1.33.95 2.94 1.5 4.68 1.55v-3.48c-.26-.01-.52-.09-.77-.24z" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href="mailto:jorge.doicela.m@gmail.com"
                  className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-115 p-0.5"
                  title="Email"
                  aria-label="Email"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>

            {/* Barra de Navegación Píldora / Cápsula (Estilo MalwareTech) + Retorno al Portal + Búsqueda e Idioma */}
            <div className="mt-5 w-full flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
              <BackToPortalButton />
              <CategoryNav
                selectedCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSpotlightOpen(true)}
                  className="w-8 h-8 rounded-xl glass-convex-panel glass-convex-panel-interactive flex items-center justify-center text-xs text-white hover:text-blue-400 transition-colors shrink-0"
                  title="Buscar (Ctrl + K)"
                  aria-label="Buscar"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                <LanguageToggle />
              </div>
            </div>
          </header>

          {/* SECCIÓN 1: FEATURED POSTS (PUBLICACIONES DESTACADAS EN 3 COLUMNAS CON COVER 16:9) */}
          <section className="space-y-5">
            <div className="pb-3 border-b border-black/5 dark:border-white/5">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                Featured Posts
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destacado 1: Noticia */}
              {featuredArticle1 ? (
                <Link
                  href={`/software/news/${featuredArticle1.slug}`}
                  className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                >
                  <div className="space-y-3.5">
                    <ArticleCover
                      title={featuredArticle1.title}
                      category="news"
                      coverImage={featuredArticle1.coverImage}
                      tag="NextJS16"
                    />

                    <div>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {featuredArticle1.readTimeMinutes} min read — Noticias, Frontend
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-[var(--header-title)] group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 mt-1.5">
                        {featuredArticle1.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                        {featuredArticle1.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 text-[11px]">{featuredArticle1.author || 'Jorge Doicela'}</span>
                    <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Leer artículo →
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="p-6 rounded-3xl glass-convex-panel animate-pulse text-xs font-mono text-zinc-500 min-h-[300px] flex items-center justify-center">
                  Cargando...
                </div>
              )}

              {/* Destacado 2: Ensayo de Arquitectura */}
              {featuredArticle2 ? (
                <Link
                  href={`/software/blog/${featuredArticle2.slug}`}
                  className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                >
                  <div className="space-y-3.5">
                    <ArticleCover
                      title={featuredArticle2.title}
                      category="blog"
                      coverImage={featuredArticle2.coverImage}
                      tag="NestJS"
                    />

                    <div>
                      <p className="text-[11px] font-mono text-zinc-500">
                        {featuredArticle2.readTimeMinutes} min read — Arquitectura, Backend
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug line-clamp-2 mt-1.5">
                        {featuredArticle2.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                        {featuredArticle2.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 text-[11px]">{featuredArticle2.author || 'Jorge Doicela'}</span>
                    <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Leer ensayo →
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="p-6 rounded-3xl glass-convex-panel animate-pulse text-xs font-mono text-zinc-500 min-h-[300px] flex items-center justify-center">
                  Cargando...
                </div>
              )}

              {/* Destacado 3: Ciberseguridad */}
              {featuredArticle3 ? (
                <Link
                  href={`/software/cybersecurity/${featuredArticle3.slug}`}
                  className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                >
                  <div className="space-y-3.5">
                    <ArticleCover
                      title={featuredArticle3.title}
                      category="cybersecurity"
                      tag={featuredArticle3.cveId || 'CVE'}
                    />

                    <div>
                      <p className="text-[11px] font-mono text-zinc-500">
                        Aviso {featuredArticle3.severity} — Ciberseguridad, Linux
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-[var(--header-title)] group-hover:text-rose-300 transition-colors leading-snug line-clamp-2 mt-1.5">
                        {featuredArticle3.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
                        {featuredArticle3.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 text-[11px] truncate max-w-[150px]">{featuredArticle3.affectedSystems || 'Linux Kernel'}</span>
                    <span className="text-rose-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Ver aviso →
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="p-6 rounded-3xl glass-convex-panel animate-pulse text-xs font-mono text-zinc-500 min-h-[300px] flex items-center justify-center">
                  Cargando...
                </div>
              )}
            </div>
          </section>

          {/* SECCIÓN 2: LATEST POSTS (GRILLA DE 3 COLUMNAS CON COVER 16:9) */}
          <section className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                {activeCategory === 'all'
                  ? 'Latest Posts'
                  : `Posts: ${activeCategory.toUpperCase()}`}
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                {activeCategory === 'all' ? 'Feed general' : 'Filtrado'}
              </span>
            </div>

            {/* Grid Editorial de 3 Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Noticias */}
              {(activeCategory === 'all' || activeCategory === 'news') &&
                displayNews.map((item) => (
                  <Link
                    key={`news-${item.id}`}
                    href={`/software/news/${item.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={item.title}
                        category="news"
                        coverImage={item.coverImage}
                        tag="Noticia"
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          {item.readTimeMinutes} min read — Noticias
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-cyan-300 transition-colors leading-snug mt-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">{item.author || 'Jorge Doicela'}</span>
                      <span className="text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Leer →
                      </span>
                    </div>
                  </Link>
                ))}

              {/* Ensayos de Arquitectura */}
              {(activeCategory === 'all' || activeCategory === 'blog') &&
                displayPosts.map((item) => (
                  <Link
                    key={`blog-${item.id}`}
                    href={`/software/blog/${item.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={item.title}
                        category="blog"
                        coverImage={item.coverImage}
                        tag="Arquitectura"
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          {item.readTimeMinutes} min read — Arquitectura
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug mt-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">{item.author || 'Jorge Doicela'}</span>
                      <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Leer →
                      </span>
                    </div>
                  </Link>
                ))}

              {/* Modelos IA & Inferencia */}
              {(activeCategory === 'all' || activeCategory === 'ai') &&
                resources.map((res) => (
                  <Link
                    key={`ai-${res.id}`}
                    href={`/software/ai/${res.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={res.name}
                        category="ai"
                        tag={res.type}
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          {res.provider} — {res.type.toUpperCase()}
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-indigo-300 transition-colors leading-snug mt-1 line-clamp-2">
                          {res.name}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {res.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">{res.license || 'Open Source'}</span>
                      <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Ficha →
                      </span>
                    </div>
                  </Link>
                ))}

              {/* Ciberseguridad & CVE */}
              {(activeCategory === 'all' || activeCategory === 'cybersecurity') &&
                displaySec.map((sec) => (
                  <Link
                    key={`sec-${sec.id}`}
                    href={`/software/cybersecurity/${sec.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={sec.title}
                        category="cybersecurity"
                        tag={sec.cveId || 'CVE'}
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          Aviso {sec.severity} — Ciberseguridad
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-rose-300 transition-colors leading-snug mt-1 line-clamp-2">
                          {sec.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {sec.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px] truncate max-w-[130px]">{sec.affectedSystems || 'Linux'}</span>
                      <span className="text-rose-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Ver aviso →
                      </span>
                    </div>
                  </Link>
                ))}

              {/* Tutoriales */}
              {(activeCategory === 'all' || activeCategory === 'tutorials') &&
                tutorials.map((item) => (
                  <Link
                    key={`tut-${item.id}`}
                    href={`/software/tutorials/${item.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={item.title}
                        category="tutorials"
                        tag="Guía"
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          {item.estimatedMinutes} min read — Tutorial
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-slate-200 transition-colors leading-snug mt-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">{item.difficulty || 'Práctico'}</span>
                      <span className="text-slate-300 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Guía →
                      </span>
                    </div>
                  </Link>
                ))}

              {/* Debates de la Comunidad */}
              {(activeCategory === 'all' || activeCategory === 'forum') &&
                topics.map((item) => (
                  <Link
                    key={`topic-${item.id}`}
                    href={`/software/forum/${item.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={item.title}
                        category="forum"
                        tag="Foro"
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          {item.repliesCount} respuestas — Debate
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug mt-1 line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {item.content}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">{item.category || 'General'}</span>
                      <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Ver debate →
                      </span>
                    </div>
                  </Link>
                ))}

              {/* Proyectos Open Source */}
              {(activeCategory === 'all' || activeCategory === 'projects') &&
                projects.map((proj) => (
                  <Link
                    key={`proj-${proj.id}`}
                    href={`/software/projects/${proj.slug}`}
                    className="p-4 sm:p-5 rounded-3xl glass-convex-panel glass-convex-panel-interactive border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group h-full"
                  >
                    <div className="space-y-3">
                      <ArticleCover
                        title={proj.name}
                        category="projects"
                        tag="Proyecto"
                      />
                      <div>
                        <p className="text-[11px] font-mono text-zinc-500">
                          ★ {proj.stars} estrellas — Open Source
                        </p>
                        <h4 className="text-base font-bold text-[var(--header-title)] group-hover:text-blue-300 transition-colors leading-snug mt-1 line-clamp-2">
                          {proj.name}
                        </h4>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1">
                          {proj.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500 text-[11px]">GitHub Repo</span>
                      <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Ver proyecto →
                      </span>
                    </div>
                  </Link>
                ))}
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
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">Plataformas</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><a href="https://jorgedoicela.com" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Portal Principal</a></li>
                  <li><a href="https://portfolio.jorgedoicela.com" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Portafolio SSH</a></li>
                  <li><a href="https://bible.jorgedoicela.com" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Biblia Exegética</a></li>
                  <li><a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors font-mono">llms.txt</a></li>
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
