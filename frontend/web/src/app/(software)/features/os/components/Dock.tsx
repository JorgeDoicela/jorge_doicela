'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DockProps {
  onOpenSpotlight: () => void;
}

interface DockItemDef {
  label: string;
  shortLabel: string;
  href: string;
  badge?: string;
}

const DOCK_ITEMS: DockItemDef[] = [
  { label: 'Inicio', shortLabel: 'HOME', href: '/software' },
  { label: 'Noticias', shortLabel: 'NEWS', href: '/software/news', badge: '1' },
  { label: 'Blog', shortLabel: 'BLOG', href: '/software/blog', badge: '2' },
  { label: 'IA & Modelos', shortLabel: 'AI', href: '/software/ai', badge: '3' },
  { label: 'Ciberseguridad', shortLabel: 'SEC', href: '/software/cybersecurity', badge: '4' },
  { label: 'Tutoriales', shortLabel: 'TUTS', href: '/software/tutorials', badge: '5' },
  { label: 'Foros', shortLabel: 'FORUM', href: '/software/forum', badge: '6' },
  { label: 'Proyectos', shortLabel: 'PROJ', href: '/software/projects', badge: '7' },
];

export function Dock({ onOpenSpotlight }: DockProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-3">
      <nav
        aria-label="Dock de Navegación de Software"
        className="pointer-events-auto p-1.5 sm:p-2 rounded-3xl glass-convex-panel border border-white/15 shadow-2xl flex items-center gap-1 sm:gap-1.5 backdrop-blur-2xl max-w-full overflow-x-auto scrollbar-none"
      >
        {DOCK_ITEMS.map((item) => {
          const isActive =
            item.href === '/software'
              ? pathname === '/software'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'glass-concave-panel text-indigo-400 font-black scale-105 border border-indigo-500/40'
                  : 'glass-btn-neumorphic text-zinc-400 hover:text-zinc-100 hover:scale-110 hover:-translate-y-1'
              }`}
              title={item.label}
            >
              {/* Short code / Label del dock */}
              <span className="text-[10px] sm:text-[11px] font-mono font-extrabold tracking-tight">
                {item.shortLabel}
              </span>

              {/* Indicador activo estilo macOS (punto inferior) */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400" />
              )}

              {/* Tooltip flotante en hover para escritorio */}
              <span className="absolute -top-9 px-2 py-0.5 rounded-lg glass-convex-panel text-[10px] font-bold text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block border border-white/10 shadow-lg">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Separador vertical estilo macOS */}
        <div className="w-[1px] h-6 bg-white/10 mx-0.5" />

        {/* Botón de Spotlight en el Dock */}
        <button
          onClick={onOpenSpotlight}
          className="group relative flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl glass-btn-neumorphic text-zinc-400 hover:text-indigo-400 hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          title="Buscador Spotlight (Cmd + K)"
          aria-label="Buscador Spotlight"
        >
          <span className="text-[10px] sm:text-xs font-mono font-bold">⌥K</span>

          {/* Tooltip */}
          <span className="absolute -top-9 px-2 py-0.5 rounded-lg glass-convex-panel text-[10px] font-bold text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block border border-white/10 shadow-lg">
            Buscar (⌘K)
          </span>
        </button>
      </nav>
    </div>
  );
}
