'use client';

import React from 'react';
import { AiResource } from '../types';
import { AiCard } from './AiCard';

interface AiGridProps {
  resources: AiResource[];
  loading: boolean;
  error: string | null;
}

export function AiGrid({ resources, loading, error }: AiGridProps) {
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

  if (!resources || resources.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">No se encontraron modelos o agentes en este filtro.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {resources.map((res) => (
        <AiCard key={res.id} resource={res} />
      ))}
    </div>
  );
}
