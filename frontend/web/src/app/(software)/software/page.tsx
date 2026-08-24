'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryNav, SoftwareSection } from '../features/navigation/components/CategoryNav';
import { NewsGrid } from '../features/news/components/NewsGrid';
import { useNews } from '../features/news/hooks/useNews';
import { BlogGrid } from '../features/blog/components/BlogGrid';
import { useBlog } from '../features/blog/hooks/useBlog';
import { ForumSection } from '../features/forum/components/ForumSection';
import { AiGrid } from '../features/ai/components/AiGrid';
import { useAi } from '../features/ai/hooks/useAi';
import { SecurityGrid } from '../features/cybersecurity/components/SecurityGrid';
import { useCybersecurity } from '../features/cybersecurity/hooks/useCybersecurity';
import { TutorialGrid } from '../features/tutorials/components/TutorialGrid';
import { useTutorials } from '../features/tutorials/hooks/useTutorials';
import { ProjectGrid } from '../features/projects/components/ProjectGrid';

const QUICK_TAGS = ['Next.js 16', 'Monolito Modular', 'MCP Servers', 'Ciberseguridad CVE', 'Tutoriales'];

export default function SoftwarePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [section, setSection] = useState<SoftwareSection>('all');
  const [search, setSearch] = useState<string>('');

  // Carga asíncrona de datos desde NestJS REST API
  const { news, loading: loadingNews, error: errorNews } = useNews(search);
  const { posts, loading: loadingBlog, error: errorBlog } = useBlog(search);
  const { resources, loading: loadingAi, error: errorAi } = useAi(undefined, search);
  const { posts: secPosts, loading: loadingSec, error: errorSec } = useCybersecurity(undefined, undefined, search);
  const { tutorials, loading: loadingTut, error: errorTut } = useTutorials(undefined, search);

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
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center overflow-x-hidden transition-colors duration-400">

        {/* ══════════════════════════════════════════════════════════
            1. NAVBAR FLOTANTE GLASSMORPHISM
        ══════════════════════════════════════════════════════════ */}
        <nav className="sticky top-4 z-50 w-full max-w-6xl px-4 md:px-6 mb-6">
          <div className="w-full h-16 rounded-2xl glass-convex-panel px-4 md:px-6 flex items-center justify-between backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Logotipo y Título */}
            <Link href="/software" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden glass-concave-panel flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                <Image
                  src="/software/logo/logo_fondo_circular_color_.png"
                  alt="Software"
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm md:text-base tracking-tight text-[var(--header-title)]">
                  Software
                </span>
                <span className="text-[10px] text-zinc-400 font-medium">Plataforma Tecnológica</span>
              </div>
            </Link>

            {/* Enlaces Rápidos de Navegación */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Noticias', href: '/software/news' },
                { label: 'Blog', href: '/software/blog' },
                { label: 'IA & Agentes', href: '/software/ai' },
                { label: 'Ciberseguridad', href: '/software/cybersecurity' },
                { label: 'Tutoriales', href: '/software/tutorials' },
                { label: 'Foro', href: '/software/forum' },
                { label: 'Proyectos', href: '/software/projects' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Acciones del Navbar */}
            <div className="flex items-center gap-2.5">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1.5 rounded-xl glass-btn-neumorphic cursor-pointer focus:outline-none transition-all duration-300 active:scale-95 text-xs font-mono font-semibold text-zinc-400 hover:text-white"
                  title="Cambiar tema"
                  aria-label="Cambiar tema"
                >
                  {theme === 'dark' ? 'LIGHT' : 'DARK'}
                </button>
              )}

              <a
                href="#explorar"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                Explorar ↓
              </a>
            </div>
          </div>
        </nav>

        {/* ══════════════════════════════════════════════════════════
            2. HERO SECTION DE ALTO IMPACTO VISUAL
        ══════════════════════════════════════════════════════════ */}
        <header className="relative z-10 w-full max-w-6xl px-4 md:px-6 mb-12 text-center">
          <div className="relative p-8 md:p-16 rounded-3xl glass-convex-panel overflow-hidden">
            {/* Título Principal de Impacto */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--header-title)] mb-6 leading-[1.08]">
              Ingeniería de Software,{' '}
              <span className="block mt-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Arquitectura & IA
              </span>
            </h1>

            {/* Subtítulo Descriptivo para el Usuario */}
            <p className="text-[var(--header-p)] max-w-3xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed font-normal mb-8">
              Ensayos técnicos de arquitectura, noticias del sector, directorio de modelos de Inteligencia Artificial, avisos de ciberseguridad, tutoriales prácticos paso a paso y proyectos open-source.
            </p>

            {/* Buscador Inteligente en Tiempo Real */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar noticias, tutoriales, modelos IA, ciberseguridad o proyectos..."
                  className="w-full px-5 py-4 pl-5 pr-24 rounded-2xl glass-concave-panel text-sm md:text-base text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Tags de Búsqueda Rápida */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                <span className="text-[11px] text-zinc-500 mr-1 font-medium">Búsquedas rápidas:</span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearch(tag)}
                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium glass-concave-panel text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs Principales */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#dominios"
                className="px-6 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
              >
                Explorar los 7 Dominios ↓
              </a>
              <Link
                href="/software/blog"
                className="px-6 py-3 rounded-2xl text-xs font-bold glass-concave-panel text-zinc-300 hover:text-white hover:border-white/20 transition-all"
              >
                Leer Ensayos de Arquitectura →
              </Link>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════
            3. BENTO GRID DE LOS 7 DOMINIOS (SHOWCASE ASIMÉTRICO)
        ══════════════════════════════════════════════════════════ */}
        <section id="dominios" className="w-full max-w-6xl px-4 md:px-6 mb-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-concave-panel text-[10px] tracking-widest uppercase font-bold text-indigo-400 mb-2">
                Áreas Temáticas
              </div>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[var(--header-title)]">
                Los 7 Dominios de Software
              </h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-md md:text-right font-light">
              Explora artículos, tutoriales interactivos, catálogo de IA, foros y proyectos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 1. NOTICIAS */}
            <Link
              href="/software/news"
              className="md:col-span-2 p-7 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-cyan-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> 1. Noticias & Tendencias
                  </span>
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-cyan-400 transition-colors">/software/news →</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[var(--header-title)] mb-2 group-hover:text-cyan-300 transition-colors">
                  Actualidad y Alertas Breaking del Sector
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light mb-4">
                  Lanzamientos de frameworks, cambios en estándares web, análisis de mercado y tendencias de ingeniería de software con alertas de última hora.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">{news.length} artículos publicados</span>
                <span className="font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">Entrar al catálogo →</span>
              </div>
            </Link>

            {/* 2. BLOG DE ARQUITECTURA */}
            <Link
              href="/software/blog"
              className="md:col-span-1 lg:col-span-2 p-7 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-rose-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> 2. Blog de Arquitectura
                  </span>
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-rose-400 transition-colors">/software/blog →</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[var(--header-title)] mb-2 group-hover:text-rose-300 transition-colors">
                  Ensayos Técnicos & Patrones Enterprise
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light mb-4">
                  Análisis profundos sobre diseño de sistemas, monolitos modulares, Domain-Driven Design, microfrontends y optimización.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">{posts.length} ensayos editoriales</span>
                <span className="font-bold text-rose-400 group-hover:translate-x-1 transition-transform">Leer ensayos →</span>
              </div>
            </Link>

            {/* 3. IA & AGENTES */}
            <Link
              href="/software/ai"
              className="p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-violet-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-violet-400 border border-violet-500/30">
                    3. IA & Agentes
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 group-hover:text-violet-400">/ai →</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[var(--header-title)] mb-2 group-hover:text-violet-300 transition-colors">
                  Modelos, MCP & Agentes
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                  Directorio técnico de modelos LLM, servidores MCP y herramientas de inferencia con fichas técnicas detalladas.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">{resources.length} recursos</span>
                <span className="font-bold text-violet-400">Ver directorio →</span>
              </div>
            </Link>

            {/* 4. CIBERSEGURIDAD */}
            <Link
              href="/software/cybersecurity"
              className="p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-blue-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/30">
                    4. Ciberseguridad
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 group-hover:text-blue-400">/security →</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[var(--header-title)] mb-2 group-hover:text-blue-300 transition-colors">
                  Avisos & Bastionado
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                  Matriz de severidad (LOW a CRITICAL), análisis de vulnerabilidades CVE y guías prácticas de remediación.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">{secPosts.length} avisos</span>
                <span className="font-bold text-blue-400">Ver matriz →</span>
              </div>
            </Link>

            {/* 5. TUTORIALES */}
            <Link
              href="/software/tutorials"
              className="p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-amber-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                    5. Tutoriales
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 group-hover:text-amber-400">/tutorials →</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[var(--header-title)] mb-2 group-hover:text-amber-300 transition-colors">
                  Guías Paso a Paso
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                  Manuales reproducibles con StepWizard interactivo, snippets de código y filtrado por nivel de dificultad.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">{tutorials.length} guías</span>
                <span className="font-bold text-amber-400">Iniciar guía →</span>
              </div>
            </Link>

            {/* 6. FORO */}
            <Link
              href="/software/forum"
              className="p-6 rounded-3xl glass-convex-panel hover:scale-[1.01] hover:border-emerald-500/30 transition-all group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                    6. Foros Técnicos
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 group-hover:text-emerald-400">/forum →</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[var(--header-title)] mb-2 group-hover:text-emerald-300 transition-colors">
                  Debates Comunitarios
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                  Espacio de discusión técnica, preguntas y respuestas anidadas con validación de solución y resolución.
                </p>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">Hilos activos</span>
                <span className="font-bold text-emerald-400">Entrar al foro →</span>
              </div>
            </Link>

            {/* 7. SHOWCASE DE PROYECTOS (Banner ancho inferior) */}
            <Link
              href="/software/projects"
              className="md:col-span-3 lg:col-span-4 p-7 rounded-3xl glass-convex-panel hover:scale-[1.005] hover:border-indigo-500/30 transition-all group flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 7. Showcase de Proyectos
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[var(--header-title)] group-hover:text-indigo-300 transition-colors">
                  Sistemas, Herramientas & Arquitectura Open-Source
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 font-light">
                  Explora las arquitecturas completas creadas por Jorge Doicela con demos interactivas y enlaces a repositorios oficiales.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-indigo-600 group-hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all">
                  Ver Showcase Completo →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. EXPLORADOR EN VIVO MULTICATEGORÍA (FSD)
        ══════════════════════════════════════════════════════════ */}
        <section id="explorar" className="w-full max-w-6xl px-4 md:px-6 mb-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-concave-panel text-[10px] tracking-widest uppercase font-bold text-cyan-400 mb-2">
                Explorador Integrado
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--header-title)]">
                Feed en Vivo por Categoría
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono">Consume contenido sin salir de la landing</span>
          </div>

          <div className="mb-8">
            <CategoryNav selectedCategory={section} onSelectCategory={setSection} />
          </div>

          {/* Renderizado Condicional del Explorador */}
          <div className="space-y-12">
            {section === 'all' && (
              <div className="space-y-12">
                {/* Sección: Noticias */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <h3 className="text-lg font-bold">Últimas Noticias</h3>
                    </div>
                    <Link href="/software/news" className="text-xs font-semibold text-cyan-400 hover:underline">
                      Ver todas →
                    </Link>
                  </div>
                  <NewsGrid news={news.slice(0, 2)} loading={loadingNews} error={errorNews} />
                </div>

                {/* Sección: Blog */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <h3 className="text-lg font-bold">Ensayos de Arquitectura</h3>
                    </div>
                    <Link href="/software/blog" className="text-xs font-semibold text-rose-400 hover:underline">
                      Ver todos →
                    </Link>
                  </div>
                  <BlogGrid posts={posts.slice(0, 2)} loading={loadingBlog} error={errorBlog} />
                </div>

                {/* Sección: IA */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-400" />
                      <h3 className="text-lg font-bold">Modelos & Recursos IA</h3>
                    </div>
                    <Link href="/software/ai" className="text-xs font-semibold text-violet-400 hover:underline">
                      Ver directorio →
                    </Link>
                  </div>
                  <AiGrid resources={resources.slice(0, 2)} loading={loadingAi} error={errorAi} />
                </div>
              </div>
            )}

            {section === 'news' && <NewsGrid news={news} loading={loadingNews} error={errorNews} />}
            {section === 'blog' && <BlogGrid posts={posts} loading={loadingBlog} error={errorBlog} />}
            {section === 'forum' && <ForumSection />}
            {section === 'ai' && <AiGrid resources={resources} loading={loadingAi} error={errorAi} />}
            {section === 'cybersecurity' && <SecurityGrid posts={secPosts} loading={loadingSec} error={errorSec} />}
            {section === 'tutorials' && <TutorialGrid tutorials={tutorials} loading={loadingTut} error={errorTut} />}
            {section === 'projects' && <ProjectGrid search={search} />}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. COMUNIDAD, OPEN SOURCE & RECURSOS
        ══════════════════════════════════════════════════════════ */}
        <section className="w-full max-w-6xl px-4 md:px-6 mb-16">
          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-concave-panel text-[10px] tracking-widest uppercase font-bold text-indigo-400 mb-2">
                Comunidad & Recursos
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[var(--header-title)] tracking-tight mb-2">
                Aprende, Colabora y Construye Software
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                Únete a las discusiones de ingeniería, replica tutoriales en tu entorno y accede al código fuente abierto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tarjeta 1: Foros */}
              <div className="p-6 rounded-2xl glass-concave-panel flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-[var(--header-title)] mb-2">Foros Técnicos</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                    Formula dudas sobre arquitectura, debate patrones de diseño y ayuda a otros desarrolladores resolviendo preguntas.
                  </p>
                </div>
                <Link
                  href="/software/forum"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  Ir al foro de debate →
                </Link>
              </div>

              {/* Tarjeta 2: Tutoriales */}
              <div className="p-6 rounded-2xl glass-concave-panel flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-[var(--header-title)] mb-2">Guías Paso a Paso</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                    Tutoriales detallados con código fuente reproducible y el asistente interactivo StepWizard para guiar tu aprendizaje.
                  </p>
                </div>
                <Link
                  href="/software/tutorials"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  Explorar tutoriales →
                </Link>
              </div>

              {/* Tarjeta 3: Proyectos */}
              <div className="p-6 rounded-2xl glass-concave-panel flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-[var(--header-title)] mb-2">Código Open Source</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                    Inspecciona repositorios reales, diagramas de arquitectura y demos en producción creados por Jorge Doicela.
                  </p>
                </div>
                <Link
                  href="/software/projects"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                >
                  Ver proyectos open source →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. FOOTER MULTICOLUMNA DE ALTA GAMA
        ══════════════════════════════════════════════════════════ */}
        <footer className="relative z-10 w-full max-w-6xl px-4 md:px-6 mb-8">
          <div className="p-8 md:p-12 rounded-3xl glass-convex-panel">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/5">
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
                  Plataforma de ingeniería de software, arquitectura de sistemas y laboratorio de IA de Jorge Doicela.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Contenidos</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><Link href="/software/news" className="hover:text-cyan-400 transition-colors">Noticias de Tecnología</Link></li>
                  <li><Link href="/software/blog" className="hover:text-rose-400 transition-colors">Ensayos de Arquitectura</Link></li>
                  <li><Link href="/software/tutorials" className="hover:text-amber-400 transition-colors">Tutoriales Prácticos</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Especialidades</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><Link href="/software/ai" className="hover:text-violet-400 transition-colors">Directorio de IA & Modelos</Link></li>
                  <li><Link href="/software/cybersecurity" className="hover:text-blue-400 transition-colors">Avisos de Ciberseguridad</Link></li>
                  <li><Link href="/software/forum" className="hover:text-emerald-400 transition-colors">Foros Comunitarios</Link></li>
                  <li><Link href="/software/projects" className="hover:text-indigo-400 transition-colors">Showcase de Proyectos</Link></li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Ecosistema</p>
                <ul className="space-y-1 text-xs text-zinc-500">
                  <li><a href="https://jorgedoicela.com" className="hover:text-zinc-300 transition-colors">Portal Principal</a></li>
                  <li><a href="https://portfolio.jorgedoicela.com" className="hover:text-zinc-300 transition-colors">Portafolio SSH</a></li>
                  <li><a href="https://bible.jorgedoicela.com" className="hover:text-zinc-300 transition-colors">Biblia Exegética</a></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
              <p>Jorge Doicela &copy; {new Date().getFullYear()} — Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}


