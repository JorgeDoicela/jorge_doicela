'use client';

import { useState, useEffect } from 'react';
import { ProjectGrid } from '../features/projects/components/ProjectGrid';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

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
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center py-20 px-4 md:px-8 overflow-hidden transition-colors duration-400">


      {/* Header Satinado Convexo */}
      <header className="relative z-10 w-full max-w-5xl mb-16 text-center p-10 md:p-14 rounded-3xl glass-convex-panel">
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase mb-6 text-[var(--chip-text)]">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse"></span>
          Proyecto Modular
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[var(--header-title)] mb-6 transition-colors duration-400">
          Software Projects
        </h1>
        
        <p className="text-[var(--header-p)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-normal transition-colors duration-400">
          Galería de herramientas, sistemas y utilidades avanzadas. Un entorno construido bajo rigurosos principios de aislamiento de código, persistencia modular y diseño de interfaces de alta fidelidad.
        </p>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 w-full max-w-5xl flex-grow">
        <ProjectGrid />
      </main>

      {/* Pie de página minimalista - Grabado */}
      <footer className="relative z-10 mt-24 px-6 py-2.5 rounded-full glass-concave-panel text-zinc-500 text-xs tracking-wider uppercase">
        Jorge Doicela &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
