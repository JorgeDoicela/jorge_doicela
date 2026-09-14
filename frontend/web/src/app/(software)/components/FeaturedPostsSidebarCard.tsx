'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { useSoftwareHub } from '../features/hub/hooks/useSoftwareHub';

interface FeaturedPostsSidebarCardProps {
  maxPosts?: number;
  className?: string;
}

export function FeaturedPostsSidebarCard({
  maxPosts = 4,
  className = '',
}: FeaturedPostsSidebarCardProps) {
  const tHome = useTranslations('Home');
  const tNav = useTranslations('Nav');
  const pathname = usePathname();
  const { featured, feed, loading } = useSoftwareHub();

  // Filtrar el post actual para que no aparezca el artículo que ya se está leyendo
  const availablePosts = (featured.length > 0 ? featured : feed).filter((item) => {
    if (!pathname) return true;
    const cleanPath = pathname.replace(/\/$/, '');
    const cleanHref = item.href.replace(/\/$/, '');
    return cleanPath !== cleanHref && !cleanPath.endsWith(cleanHref);
  });

  const displayPosts = availablePosts.slice(0, maxPosts);

  return (
    <div
      className={`p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-4 shadow-xl select-none ${className}`}
    >
      {/* Cabecera de la tarjeta */}
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
          {tHome('featuredPosts')}
        </h5>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          title={tNav('all')}
        >
          <span>{tNav('all')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Lista de Publicaciones */}
      <div className="space-y-2.5">
        {loading && displayPosts.length === 0 ? (
          // Skeletons de carga fluida
          Array.from({ length: maxPosts }).map((_, idx) => (
            <div key={idx} className="p-2.5 -mx-2.5 space-y-1.5 animate-pulse">
              <div className="h-2.5 w-20 bg-black/5 dark:bg-white/5 rounded" />
              <div className="h-3.5 w-full bg-black/5 dark:bg-white/5 rounded" />
            </div>
          ))
        ) : displayPosts.length > 0 ? (
          displayPosts.map((item) => {
            const metaText = item.categoryMeta || item.tag;

            return (
              <Link
                key={item.id || item.href}
                href={item.href}
                className="group flex items-start justify-between gap-3 p-2.5 -mx-2.5 rounded-2xl hover:bg-black/[0.035] dark:hover:bg-white/[0.035] active:scale-[0.99] transition-all duration-200"
              >
                {/* Título y metadatos */}
                <div className="flex-1 min-w-0 space-y-1">
                  {metaText && (
                    <span className="block text-[11px] font-mono font-medium text-slate-500 dark:text-zinc-400 truncate">
                      {metaText}
                    </span>
                  )}
                  <h6 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h6>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono py-2">
            {tHome('featuredPosts')}
          </p>
        )}
      </div>
    </div>
  );
}
