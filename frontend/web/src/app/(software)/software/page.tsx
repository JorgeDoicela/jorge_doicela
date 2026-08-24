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

const CATEGORIES = [
  { id: 'all', label: 'Todo el Contenido' },
  { id: 'news', label: 'Noticias' },
  { id: 'blog', label: 'Arquitectura' },
  { id: 'ai', label: 'Inteligencia Artificial' },
  { id: 'cybersecurity', label: 'Ciberseguridad' },
  { id: 'tutorials', label: 'Tutoriales' },
  { id: 'forum', label: 'Debates & Foro' },
  { id: 'projects', label: 'Proyectos' },
];

export default function SoftwarePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState<string>('');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Carga asíncrona de datos desde NestJS REST API
  const { news } = useNews(search);
  const { posts } = useBlog(search);
  const { resources } = useAi(undefined, search);
  const { posts: secPosts } = useCybersecurity(undefined, undefined, search);
  const { tutorials } = useTutorials(undefined, search);
  const { topics } = useForum('all', search);
  const { projects } = useProjects(search);

  // Destacados (Top 3)
  const featuredArticle1 = news[0];
  const featuredArticle2 = posts[0];
  const featuredArticle3 = secPosts[0];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('software-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('software-theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      {/* 1. NAVBAR SUPERIOR FIJO */}
      <MenuBar
        theme={theme}
        onToggleTheme={toggleTheme}
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
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12 space-y-12">
          
          {/* SECCIÓN 1: ARTÍCULOS DESTACADOS (FEATURED POSTS AL ESTILO EDITORIAL) */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-black/5 dark:border-white/5">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--header-title)]">
                Publicaciones Destacadas
              </h2>
              <span className="text-xs font-mono text-zinc-500">Última actualización técnica</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destacado 1: Noticias Breaking */}
              {featuredArticle1 && (
                <Link
                  href={`/software/news/${featuredArticle1.slug}`}
                  className="group p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                        {featuredArticle1.isBreaking ? '● Breaking News' : 'Noticia'}
                      </span>
                      <span>{featuredArticle1.readTimeMinutes} min</span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--header-title)] group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors leading-snug">
                      {featuredArticle1.title}
                    </h3>

                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {featuredArticle1.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono">{featuredArticle1.views} vistas</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                      Leer artículo →
                    </span>
                  </div>
                </Link>
              )}

              {/* Destacado 2: Ensayo de Arquitectura */}
              {featuredArticle2 && (
                <Link
                  href={`/software/blog/${featuredArticle2.slug}`}
                  className="group p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-blue-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">
                        Arquitectura
                      </span>
                      <span>{featuredArticle2.readTimeMinutes} min</span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--header-title)] group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-snug">
                      {featuredArticle2.title}
                    </h3>

                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {featuredArticle2.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono">{featuredArticle2.likes} likes</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      Leer ensayo →
                    </span>
                  </div>
                </Link>
              )}

              {/* Destacado 3: Ciberseguridad / CVE */}
              {featuredArticle3 && (
                <Link
                  href={`/software/cybersecurity/${featuredArticle3.slug}`}
                  className="group p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-rose-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span className="text-rose-600 dark:text-rose-400 font-bold uppercase">
                        Ciberseguridad · {featuredArticle3.severity}
                      </span>
                      <span className="text-zinc-400 font-mono">{featuredArticle3.cveId || 'CVE'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[var(--header-title)] group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors leading-snug">
                      {featuredArticle3.title}
                    </h3>

                    <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                      {featuredArticle3.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono truncate max-w-[140px]">{featuredArticle3.affectedSystems || 'Linux/Web'}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform">
                      Ver aviso →
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* SECCIÓN 2: SELECTOR DE CATEGORÍAS */}
          <section className="flex flex-wrap items-center gap-2 pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'glass-convex-panel text-blue-600 dark:text-blue-400 font-bold border-blue-500/40 shadow-md'
                    : 'glass-concave-panel text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </section>

          {/* SECCIÓN 3: FEED DE PUBLICACIONES EN VIVO */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Principal: Lista de Artículos (2 columnas) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                <h3 className="text-lg font-bold text-[var(--header-title)]">
                  Últimos Artículos & Publicaciones
                </h3>
              </div>

              {/* Noticias */}
              {(activeCategory === 'all' || activeCategory === 'news') &&
                news.slice(1).map((item) => (
                  <Link
                    key={item.id}
                    href={`/software/news/${item.slug}`}
                    className="p-5 rounded-2xl glass-convex-panel hover:scale-[1.005] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase">Noticia</span>
                        <span>•</span>
                        <span>{item.readTimeMinutes} min de lectura</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold shrink-0">
                      Leer →
                    </span>
                  </Link>
                ))}

              {/* Ensayos de Arquitectura */}
              {(activeCategory === 'all' || activeCategory === 'blog') &&
                posts.slice(1).map((item) => (
                  <Link
                    key={item.id}
                    href={`/software/blog/${item.slug}`}
                    className="p-5 rounded-2xl glass-convex-panel hover:scale-[1.005] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">Arquitectura</span>
                        <span>•</span>
                        <span>{item.readTimeMinutes} min</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0">
                      Leer →
                    </span>
                  </Link>
                ))}

              {/* Tutoriales */}
              {(activeCategory === 'all' || activeCategory === 'tutorials') &&
                tutorials.map((item) => (
                  <Link
                    key={item.id}
                    href={`/software/tutorials/${item.slug}`}
                    className="p-5 rounded-2xl glass-convex-panel hover:scale-[1.005] hover:border-slate-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-slate-600 dark:text-slate-300 font-bold uppercase">Tutorial</span>
                        <span>•</span>
                        <span>{item.estimatedMinutes} min</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 font-bold shrink-0">
                      Guía →
                    </span>
                  </Link>
                ))}

              {/* Debates de la Comunidad */}
              {(activeCategory === 'all' || activeCategory === 'forum') &&
                topics.map((item) => (
                  <Link
                    key={item.id}
                    href={`/software/forum/${item.slug}`}
                    className="p-5 rounded-2xl glass-convex-panel hover:scale-[1.005] hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase">Foro Técnico</span>
                        <span>•</span>
                        <span>{item.repliesCount} respuestas</span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--header-title)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light line-clamp-2">
                        {item.content}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold shrink-0">
                      Ver debate →
                    </span>
                  </Link>
                ))}
            </div>

            {/* Barra Lateral / Showcase & Modelos IA (1 columna) */}
            <div className="space-y-6">
              
              {/* Widget: Modelos IA & Inferencia */}
              <div className="p-6 rounded-3xl glass-convex-panel space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-sm font-bold text-[var(--header-title)] font-mono uppercase">
                    Modelos IA & MCP
                  </h3>
                  <Link href="/software/ai" className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline">
                    Ver todos →
                  </Link>
                </div>

                <div className="space-y-3">
                  {resources.slice(0, 3).map((res) => (
                    <Link
                      key={res.id}
                      href={`/software/ai/${res.slug}`}
                      className="p-3 rounded-2xl glass-concave-panel hover:bg-black/5 dark:hover:bg-white/5 transition-all block space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{res.name}</span>
                        <span className="text-zinc-500">{res.provider}</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-light line-clamp-1">
                        {res.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Widget: Proyectos Open Source */}
              <div className="p-6 rounded-3xl glass-convex-panel space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                  <h3 className="text-sm font-bold text-[var(--header-title)] font-mono uppercase">
                    Showcase de Proyectos
                  </h3>
                  <Link href="/software/projects" className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline">
                    Ver todos →
                  </Link>
                </div>

                <div className="space-y-3">
                  {projects.slice(0, 3).map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 rounded-2xl glass-concave-panel space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--header-title)]">{proj.name}</span>
                        <span className="text-zinc-500 font-mono text-[10px]">{proj.stars} stars</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-light line-clamp-2">
                        {proj.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] font-mono">
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
