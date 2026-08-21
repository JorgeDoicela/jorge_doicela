'use client';

import React, { useState } from 'react';
import { useForum } from '../hooks/useForum';
import { TopicCard } from './TopicCard';

export function ForumSection() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const { topics, loading, error } = useForum(filterCategory, search);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'devops', label: 'DevOps & VPS' },
    { id: 'cybersecurity', label: 'Seguridad' },
    { id: 'ai', label: 'IA & Agentes' },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-convex-panel">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Debates y Comunidad</h2>
          <p className="text-xs text-zinc-400 mt-1">Preguntas, arquitectura y discusiones de ingeniería</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCategory === c.id
                  ? 'glass-btn-neumorphic text-indigo-400 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-3xl glass-convex-panel bg-zinc-900/30" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl glass-concave-panel text-center text-rose-400 text-sm">
          {error}
        </div>
      ) : topics.length === 0 ? (
        <div className="p-12 rounded-3xl glass-concave-panel text-center text-zinc-500 text-sm">
          No hay temas registrados en esta categoría aún.
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((t) => (
            <TopicCard key={t.id} topic={t} />
          ))}
        </div>
      )}
    </div>
  );
}
