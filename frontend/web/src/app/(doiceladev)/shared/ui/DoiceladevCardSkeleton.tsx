'use client';

import React from 'react';

interface DoiceladevCardSkeletonProps {
  className?: string;
}

/**
 * DoiceladevCardSkeleton - Skeleton con paridad estructural 1:1 con DoiceladevCard.
 * Replica fielmente el contenedor neumórfico/glassmorphic, el aspect ratio 16:9 de la portada,
 * la línea mono de metadatos (Módulo • Categoría), las dos líneas de titular y las dos líneas de extracto.
 */
export function DoiceladevCardSkeleton({ className = '' }: DoiceladevCardSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#16202c]/80 border border-slate-200/80 dark:border-white/[0.07] flex flex-col justify-between h-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none ${className}`}
    >
      <div className="space-y-3.5">
        {/* Portada 16:9 con border-radius xl idéntica a ArticleCover */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-200/70 dark:bg-white/5 animate-pulse" />

        {/* Bloque de información tipográfica */}
        <div>
          {/* Metadatos: Módulo • Categoría */}
          <div className="h-3 w-28 rounded bg-slate-200/70 dark:bg-white/10 animate-pulse mb-1.5" />

          {/* Titular (2 líneas) */}
          <div className="space-y-1 mt-1.5">
            <div className="h-4 w-11/12 rounded bg-slate-200/80 dark:bg-white/10 animate-pulse" />
            <div className="h-4 w-3/5 rounded bg-slate-200/80 dark:bg-white/10 animate-pulse" />
          </div>

          {/* Extracto editorial (2 líneas) */}
          <div className="space-y-1 mt-2">
            <div className="h-3 w-full rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
