'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TutorialGrid } from '../../features/tutorials/components/TutorialGrid';
import { useTutorials } from '../../features/tutorials/hooks/useTutorials';

export default function TutorialsCategoryPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const { tutorials, loading, error } = useTutorials(difficulty, search);

  const difficulties = [
    { id: 'all', label: 'Todos los niveles' },
    { id: 'beginner', label: 'Principiante' },
    { id: 'intermediate', label: 'Intermedio' },
    { id: 'advanced', label: 'Avanzado' },
  ];

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver a Software
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase mb-4 text-[var(--chip-text)]">
          Paso a Paso & Código Reproducible
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--header-title)] mb-3">
          Tutoriales & Guías Prácticas
        </h1>

        <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed mb-6">
          Manuales de construcción paso a paso con código real, asistentes interactivos y explicaciones de arquitectura.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tutoriales o stack..."
              className="w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {difficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  difficulty === d.id
                    ? 'glass-btn-neumorphic text-amber-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main>
        <TutorialGrid tutorials={tutorials} loading={loading} error={error} />
      </main>
    </div>
  );
}
