'use client';

import React from 'react';

export type SoftwareSection =
  | 'all'
  | 'news'
  | 'blog'
  | 'forum'
  | 'ai'
  | 'cybersecurity'
  | 'tutorials'
  | 'projects';

interface CategoryNavProps {
  selectedCategory: SoftwareSection;
  onSelectCategory: (cat: SoftwareSection) => void;
}

export const SOFTWARE_CATEGORIES: { id: SoftwareSection; label: string }[] = [
  { id: 'all', label: 'Todo el Contenido' },
  { id: 'news', label: 'Noticias' },
  { id: 'blog', label: 'Arquitectura' },
  { id: 'ai', label: 'Inteligencia Artificial' },
  { id: 'cybersecurity', label: 'Ciberseguridad' },
  { id: 'tutorials', label: 'Tutoriales' },
  { id: 'forum', label: 'Debates & Foro' },
  { id: 'projects', label: 'Proyectos' },
];

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <nav aria-label="Categorías de Software" className="w-full">
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl glass-concave-panel scrollbar-none w-fit max-w-full">
        {SOFTWARE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'glass-convex-panel text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
