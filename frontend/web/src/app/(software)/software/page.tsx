'use client';

import { useState, useEffect } from 'react';
import { SoftwareCategory } from '../features/articles/types';
import { CategoryNav } from '../features/articles/components/CategoryNav';
import { ArticleGrid } from '../features/articles/components/ArticleGrid';
import { ForumSection } from '../features/articles/components/ForumSection';
import { ProjectGrid } from '../features/projects/components/ProjectGrid';
import { useArticles } from '../features/articles/hooks/useArticles';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [category, setCategory] = useState<SoftwareCategory>('all');
  const [search, setSearch] = useState<string>('');

  const { articles, loading, error } = useArticles(category, search);

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
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center py-16 px-4 md:px-8 overflow-hidden transition-colors duration-400">

      {/* Header Satinado Convexo */}
      <header className="relative z-10 w-full max-w-5xl mb-12 text-center p-8 md:p-12 rounded-3xl glass-convex-panel">
        {/* Toggle de tema minimalista */}
        {mounted && (
          <button 
            onClick={toggleTheme} 
            className="absolute top-6 right-6 p-2.5 rounded-full glass-btn-neumorphic cursor-pointer focus:outline-none transition-all duration-300 active:scale-95"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <svg className="w-4.5 h-4.5 text-zinc-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707-.707m0-12.728l.707.707m12.728 12.728l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5 text-zinc-500 hover:text-zinc-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        )}

        {/* Chip Grabado (Cóncavo) de Titanio */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase mb-5 text-[var(--chip-text)]">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Software Hub & Comunidad
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--header-title)] mb-4 transition-colors duration-400">
          Software & Tech Portal
        </h1>
        
        <p className="text-[var(--header-p)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-normal mb-8 transition-colors duration-400">
          Plataforma de contenidos sobre desarrollo de software, noticias de actualidad, artículos de opinión, Inteligencia Artificial, ciberseguridad, tutoriales y foros comunitarios.
        </p>

        {/* Buscador en Tiempo Real */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar noticias, tutoriales, IA, ciberseguridad..."
            className="w-full px-5 py-3.5 pl-12 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
          <svg className="w-5 h-5 absolute left-4 top-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-3.5 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
            >
              Limpiar
            </button>
          )}
        </div>
      </header>

      {/* Navegación por Categorías */}
      <div className="w-full max-w-5xl mb-10">
        <CategoryNav selectedCategory={category} onSelectCategory={setCategory} />
      </div>

      {/* Contenido Dinámico según la Categoría Seleccionada */}
      <main className="relative z-10 w-full max-w-5xl flex-grow">
        {category === 'forum' ? (
          <ForumSection />
        ) : category === 'projects' ? (
          <ProjectGrid />
        ) : (
          <ArticleGrid articles={articles} loading={loading} error={error} />
        )}
      </main>

      {/* Pie de página minimalista */}
      <footer className="relative z-10 mt-20 px-6 py-2.5 rounded-full glass-concave-panel text-zinc-500 text-xs tracking-wider uppercase">
        Jorge Doicela &copy; {new Date().getFullYear()} — Software Hub
      </footer>
    </div>
  );
}
