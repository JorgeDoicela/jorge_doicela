'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { useSoftwareHub } from '../features/hub/hooks/useSoftwareHub';
import { HubFeedItem } from '../features/hub/types';

interface ExploreTopicsSidebarCardProps {
  className?: string;
}

export function ExploreTopicsSidebarCard({ className = '' }: ExploreTopicsSidebarCardProps) {
  const tNav = useTranslations('Nav');
  const { featured, feed, spotlightData, loading } = useSoftwareHub();

  // Estado para la categoría actualmente abierta en el acordeón
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const toggleCategory = (catId: string) => {
    setOpenCategoryId((prev) => (prev === catId ? null : catId));
  };

  // Mapeo ordenado de todas las publicaciones por categoría
  const postsByCategory = useMemo(() => {
    const map: Record<string, HubFeedItem[]> = {
      cybersecurity: [],
      infrastructure: [],
      ai: [],
      tutorials: [],
      projects: [],
      blog: [],
      news: [],
      forum: [],
    };

    const seenIds = new Set<string>();
    const combined = [...featured, ...feed];

    for (const item of combined) {
      if (item?.category && map[item.category] && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        map[item.category].push(item);
      }
    }

    return map;
  }, [featured, feed]);

  const categories = [
    {
      id: 'cybersecurity',
      label: tNav('cybersecurity'),
      href: '/cybersecurity',
      spotlightKey: 'secPosts',
    },
    {
      id: 'infrastructure',
      label: tNav('infrastructure'),
      href: '/infrastructure',
      spotlightKey: 'infraPosts',
    },
    {
      id: 'ai',
      label: tNav('ai'),
      href: '/ai',
      spotlightKey: 'aiResources',
    },
    {
      id: 'tutorials',
      label: tNav('tutorials'),
      href: '/tutorials',
      spotlightKey: 'tutorials',
    },
    {
      id: 'projects',
      label: tNav('projects'),
      href: '/projects',
      spotlightKey: 'projects',
    },
    {
      id: 'blog',
      label: tNav('blog'),
      href: '/blog',
      spotlightKey: 'posts',
    },
    {
      id: 'news',
      label: tNav('news'),
      href: '/news',
      spotlightKey: 'news',
    },
    {
      id: 'forum',
      label: tNav('forum'),
      href: '/forum',
      spotlightKey: 'topics',
    },
  ];

  return (
    <div
      className={`p-6 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-3.5 shadow-xl select-none ${className}`}
    >
      {/* Cabecera de la tarjeta */}
      <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
        {tNav('exploreTopics')}
      </h5>

      {/* Lista de Secciones Colapsables (Acordeón de Especialidades) */}
      <div className="space-y-1">
        {categories.map((cat) => {
          const isOpen = openCategoryId === cat.id;
          const categoryPosts = postsByCategory[cat.id] || [];
          const count =
            categoryPosts.length ||
            (spotlightData as any)?.[cat.spotlightKey]?.length ||
            0;

          // Mostrar un máximo de 5 publicaciones dentro del acordeón para no saturar
          const displayedPosts = categoryPosts.slice(0, 5);
          const hasMorePosts = categoryPosts.length > 5;

          return (
            <div key={cat.id} className="rounded-xl overflow-hidden transition-colors">
              {/* Botón de la Especialidad (Toggle del Acordeón) */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`group flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all duration-200 text-left cursor-pointer active:scale-[0.99] ${
                  isOpen
                    ? 'bg-black/[0.04] dark:bg-white/[0.04]'
                    : 'hover:bg-black/[0.035] dark:hover:bg-white/[0.035]'
                }`}
                aria-expanded={isOpen}
              >
                {/* Lado izquierdo: Chevron indicador + Nombre */}
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ${
                      isOpen
                        ? 'rotate-90 text-blue-600 dark:text-blue-400'
                        : 'group-hover:text-slate-700 dark:group-hover:text-zinc-300'
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-[13px] font-sans font-medium transition-colors truncate ${
                      isOpen
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  >
                    {cat.label}
                  </span>
                </div>

                {/* Lado derecho: Pastilla Cóncava Neumórfica con Contador */}
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors shrink-0 ${
                    isOpen
                      ? 'glass-concave-panel text-blue-600 dark:text-blue-400 font-bold'
                      : 'glass-concave-panel text-slate-500 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}
                >
                  {loading ? '—' : count}
                </span>
              </button>

              {/* Panel Desplegable: Compartimento Cóncavo Neumórfico Hendido */}
              {isOpen && (
                <div className="p-3.5 mt-1.5 mb-1 space-y-2 rounded-2xl glass-concave-panel border border-black/5 dark:border-white/5 animate-fadeIn">
                  {loading && categoryPosts.length === 0 ? (
                    <div className="space-y-1.5 py-1 animate-pulse">
                      <div className="h-3 w-4/5 bg-black/5 dark:bg-white/5 rounded" />
                      <div className="h-3 w-3/5 bg-black/5 dark:bg-white/5 rounded" />
                    </div>
                  ) : displayedPosts.length > 0 ? (
                    <>
                      <div className="space-y-1">
                        {displayedPosts.map((post) => (
                          <Link
                            key={post.id || post.href}
                            href={post.href}
                            className="group/item block py-1 px-2 -mx-1 rounded-lg text-xs font-sans text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/[0.035] dark:hover:bg-white/[0.035] transition-colors"
                          >
                            <span className="line-clamp-2 leading-snug">
                              {post.title}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Enlace para ver todo el catálogo de esta especialidad */}
                      <div className="pt-1.5 border-t border-black/5 dark:border-white/5">
                        <Link
                          href={cat.href}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                        >
                          <span>
                            {hasMorePosts
                              ? tNav('viewAllInCategory', { category: cat.label })
                              : `${tNav('all')} (${count}) →`}
                          </span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="py-1 text-xs font-mono text-slate-400 dark:text-zinc-500 space-y-1">
                      <p>{tNav('noPostsInCategory')}</p>
                      <Link
                        href={cat.href}
                        className="text-blue-600 dark:text-blue-400 hover:underline inline-block font-semibold"
                      >
                        {cat.label} →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
