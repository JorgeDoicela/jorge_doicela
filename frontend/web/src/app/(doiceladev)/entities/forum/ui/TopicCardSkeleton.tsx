'use client';

import React from 'react';

/**
 * TopicCardSkeleton - Skeleton con paridad estructural 1:1 con TopicCard.
 * Modela el contenedor neumórfico horizontal, etiquetas meta, título, extracto
 * y el bloque lateral de contadores (respuestas, vistas y acción).
 */
export function TopicCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl glass-convex-panel gap-4"
    >
      <div className="flex-1 space-y-2">
        {/* Metadatos (categoría • autor • fecha) */}
        <div className="flex items-center gap-2.5">
          <div className="h-3 w-20 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse" />
          <div className="h-3 w-28 rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="h-3 w-20 rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
        </div>

        {/* Titular */}
        <div className="h-4.5 w-4/5 rounded bg-slate-200/80 dark:bg-white/10 animate-pulse mt-1" />

        {/* Extracto */}
        <div className="space-y-1 pt-0.5">
          <div className="h-3 w-full rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Bloque lateral de estadísticas y acción */}
      <div className="flex items-center gap-3.5 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-200/70 dark:border-white/5 shrink-0">
        <div className="h-8 w-24 rounded-xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
        <div className="h-4 w-14 rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
        <div className="h-8 w-24 rounded-xl bg-slate-200/60 dark:bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}
