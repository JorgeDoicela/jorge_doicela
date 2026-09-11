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
  footer?: React.ReactNode;
}

/**
 * SoftwareCard - Componente de presentación normalizado para tarjetas de contenido técnico.
 * 
 * Estandariza la jerarquía visual de acuerdo con el sistema de diseño de Software:
 * - Metadatos: 11px font-mono text-zinc-400
 * - Título: 16px (text-base) font-bold con leading-snug y line-clamp-2
 * - Extracto: 12px (text-xs) font-light con line-clamp-2 y leading-relaxed
 * - Contenedor: p-4 sm:p-5 con elevación y transición neumórfica
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
  footer,
}: SoftwareCardProps) {
  return (
    <Link
      href={href}
      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm cursor-pointer"
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
          <p className="text-[11px] font-mono text-zinc-400 capitalize truncate">
            {categoryMeta}
          </p>

          <h3 className={`text-base font-bold text-[var(--header-title)] ${accentHoverColor} transition-colors leading-snug line-clamp-2 mt-1.5`}>
            {title}
          </h3>

          {excerpt && (
            <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
              {excerpt}
            </p>
          )}
        </div>
      </div>

      {footer && <div className="mt-4 pt-3 border-t border-white/5">{footer}</div>}
    </Link>
  );
}
