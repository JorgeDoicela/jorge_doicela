'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MenuBarProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenSpotlight: () => void;
}

const NAV_LINKS = [
  { label: 'Noticias', href: '/software/news' },
  { label: 'Blog', href: '/software/blog' },
  { label: 'IA & Modelos', href: '/software/ai' },
  { label: 'Ciberseguridad', href: '/software/cybersecurity' },
  { label: 'Tutoriales', href: '/software/tutorials' },
  { label: 'Foro', href: '/software/forum' },
  { label: 'Proyectos', href: '/software/projects' },
];

export function MenuBar({
  theme = 'dark',
  onToggleTheme,
  onOpenSpotlight,
}: MenuBarProps) {
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-EC', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--background)]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors duration-400">
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 h-14 flex items-center justify-between gap-4">
        {/* Izquierda: Logotipo y Marca */}
        <Link
          href="/software"
          className="flex items-center gap-2.5 group shrink-0"
          title="Software - Inicio"
        >
          <div className="w-7 h-7 rounded-xl glass-concave-panel flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
            <Image
              src="/software/logo/logo_fondo_circular_color_.png"
              alt="Software"
              width={24}
              height={24}
              className="object-contain"
              unoptimized
            />
          </div>
          <span className="font-extrabold text-sm md:text-base tracking-tight text-[var(--header-title)]">
            Software
          </span>
        </Link>

        {/* Centro: Enlaces de Navegación de los 7 Dominios */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Derecha: Spotlight Trigger, Reloj y Selector de Tema */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Spotlight Button */}
          <button
            onClick={onOpenSpotlight}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-concave-panel text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer text-xs font-medium"
            title="Buscar en todo el catálogo (Cmd + K)"
            aria-label="Abrir buscador"
          >
            <svg
              className="w-3.5 h-3.5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="hidden sm:inline">Buscar...</span>
            <kbd className="px-1.5 py-0.5 rounded-md glass-btn-neumorphic text-[10px] font-mono text-zinc-400">
              ⌘K
            </kbd>
          </button>

          {/* Reloj */}
          {mounted && time && (
            <span className="font-mono text-xs text-zinc-400 hidden sm:inline-block tabular-nums pl-1">
              {time}
            </span>
          )}

          {/* Selector de Tema con Iconos SVG (Oculto si no se provee onToggleTheme) */}
          {mounted && onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-xl glass-btn-neumorphic flex items-center justify-center cursor-pointer focus:outline-none transition-all duration-300 active:scale-95 text-zinc-400 hover:text-[var(--foreground)]"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <svg
                  className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-indigo-600 transition-transform duration-300 -rotate-12 hover:rotate-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
