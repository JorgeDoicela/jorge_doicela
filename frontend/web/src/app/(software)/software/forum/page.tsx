'use client';

import Link from 'next/link';
import { ForumSection } from '../../features/forum/components/ForumSection';

export default function ForumCategoryPage() {
  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
      <Link
        href="/software"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
      >
        ← Volver al Software Hub
      </Link>

      <header className="p-8 md:p-12 rounded-3xl glass-convex-panel text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-concave-panel text-[10px] tracking-[0.15em] font-semibold uppercase mb-4 text-[var(--chip-text)]">
          Comunidad & Debates
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--header-title)] mb-3">
          Foros Técnicos
        </h1>

        <p className="text-sm md:text-base text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
          Espacio abierto para plantear preguntas de arquitectura, resolver dudas de ingeniería y debatir tecnologías.
        </p>
      </header>

      <main>
        <ForumSection />
      </main>
    </div>
  );
}
