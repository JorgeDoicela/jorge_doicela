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
  { id: 'all', label: 'Todo el Hub' },
  { id: 'news', label: 'Noticias' },
  { id: 'blog', label: 'Blog' },
  { id: 'forum', label: 'Foros' },
  { id: 'ai', label: 'Inteligencia Artificial' },
  { id: 'cybersecurity', label: 'Ciberseguridad' },
  { id: 'tutorials', label: 'Tutoriales' },
  { id: 'projects', label: 'Proyectos' },
];

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return (
    <nav aria-label="Categorías de Software" className="w-full">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 px-1 scrollbar-none">
        {SOFTWARE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'glass-btn-neumorphic text-[var(--accent-glow)] font-bold scale-[1.03]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
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
