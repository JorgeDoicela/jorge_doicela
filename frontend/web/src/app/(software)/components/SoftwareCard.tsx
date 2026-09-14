'use client';

import React from 'react';
import Link from 'next/link';
import { ArticleCover, SoftwareArticleCategory } from './ArticleCover';

export interface SoftwareCardProps {
  href: string;
  title: string;
  category: SoftwareArticleCategory;
  categoryMeta: React.ReactNode;
  excerpt?: string | null;
  coverImage?: string;
  tag?: string;
  subCategory?: string;
  priority?: boolean;
  accentHoverColor?: string;
}

/**
 * SoftwareCard - Componente de presentación normalizado para tarjetas de contenido técnico.
 * 
 * Estandariza la jerarquía visual de acuerdo con el sistema de diseño de Software:
 * - Sección 1: Metadatos en 1 sola línea (11px font-mono text-zinc-400)
 * - Sección 2: Título en negrita (16px font-bold leading-snug line-clamp-2)
 * - Sección 3: Extracto descriptivo (12px text-xs line-clamp-2 leading-relaxed)
 * - Cero footers, cero divisores extras y contenedor simétrico con elevación neumórfica
 */
export function SoftwareCard({
  href,
  title,
  category,
  categoryMeta,
  excerpt,
  coverImage,
  tag,
  subCategory,
  priority = false,
  accentHoverColor = 'group-hover:text-cyan-300',
}: SoftwareCardProps) {
  return (
    <Link
      href={href}
      className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#16202c]/80 hover:bg-white dark:hover:bg-[#1c2938] border border-slate-200/80 dark:border-white/[0.07] hover:border-blue-500/30 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] dark:shadow-none cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={title}
          category={category}
          coverImage={coverImage}
          tag={tag}
          subCategory={subCategory}
          priority={priority}
        />

        <div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 capitalize truncate font-medium">
            {categoryMeta}
          </p>

          <h3 className={`text-base font-bold text-slate-900 dark:text-[var(--header-title)] group-hover:text-blue-600 dark:${accentHoverColor} transition-colors leading-snug line-clamp-2 mt-1.5`}>
            {title}
          </h3>

          {excerpt && (
            <p className="text-xs text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
