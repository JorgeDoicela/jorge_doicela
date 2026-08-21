'use client';

import React from 'react';
import { Tutorial } from '../types';
import { TutorialCard } from './TutorialCard';

interface TutorialGridProps {
  tutorials: Tutorial[];
  loading: boolean;
  error: string | null;
}

export function TutorialGrid({ tutorials, loading, error }: TutorialGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-48 rounded-3xl glass-convex-panel bg-zinc-900/30" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl glass-concave-panel text-center text-rose-400">
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (!tutorials || tutorials.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">No se encontraron tutoriales con este filtro.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {tutorials.map((tut) => (
        <TutorialCard key={tut.id} tutorial={tut} />
      ))}
    </div>
  );
}
