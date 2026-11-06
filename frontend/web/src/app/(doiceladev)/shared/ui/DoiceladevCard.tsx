'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArticleCover, DoiceladevArticleCategory } from './ArticleCover';
import { DoiceladevHoverPreview } from './DoiceladevHoverPreview';

export interface DoiceladevCardProps {
  href: string;
  title: string;
  category: DoiceladevArticleCategory;
  categoryMeta: React.ReactNode;
  excerpt?: string | null;
  coverImage?: string;
  topicCategory?: string;
  priority?: boolean;
  accentHoverColor?: string;
}

export interface DoiceladevCardMetaProps {
  categoryMeta: React.ReactNode;
  className?: string;
}

export interface DoiceladevCardTitleProps {
  title: string;
  accentHoverColor?: string;
  className?: string;
}

export interface DoiceladevCardExcerptProps {
  excerpt?: string | null;
  className?: string;
}

/**
 * DoiceladevCardMeta - Nivel 1 (Módulo) y Nivel 2 (Categoría)
 * Mantiene 100% la estética original (tipografía mono sobria sin pastillas invasivas)
 * con soporte para inspección completa en hover si el texto se recorta.
 */
export function DoiceladevCardMeta({
  categoryMeta,
  className = '',
}: DoiceladevCardMetaProps) {
  const tFilters = useTranslations('Filters');

  const formatSegment = React.useCallback(
    (segment: string): string => {
      const trimmed = segment.trim();
      if (!trimmed) return '';
      const lower = trimmed.toLowerCase();
      if (tFilters.has(lower as any)) {
        return tFilters(lower as any).toUpperCase();
      }
      if (tFilters.has(trimmed as any)) {
        return tFilters(trimmed as any).toUpperCase();
      }
      return trimmed.replace(/_/g, ' ');
    },
    [tFilters]
  );

  const formattedCategoryMeta = React.useMemo(() => {
    if (typeof categoryMeta === 'string') {
      return categoryMeta
        .split('•')
        .map((part) => formatSegment(part))
        .join(' • ');
    }
    return categoryMeta;
  }, [categoryMeta, formatSegment]);

  const metaString = typeof formattedCategoryMeta === 'string' ? formattedCategoryMeta.toUpperCase() : '';

  return (
    <DoiceladevHoverPreview
      enabled={metaString.length > 38}
      content={
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-semibold">
            Jerarquía Técnica
          </p>
          <p className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
            {metaString}
          </p>
        </div>
      }
      delayMs={150}
      maxWidth={380}
      className="w-full min-w-0"
    >
      <p className={`text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider truncate font-medium ${className}`}>
        {formattedCategoryMeta}
      </p>
    </DoiceladevHoverPreview>
  );
}

/**
 * DoiceladevCardTitle - Titular editorial con inspección en hover si supera las dos líneas.
 */
export function DoiceladevCardTitle({
  title,
  accentHoverColor = 'group-hover:text-cyan-300',
  className = '',
}: DoiceladevCardTitleProps) {
  return (
    <DoiceladevHoverPreview
      enabled={title.length > 65}
      content={
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Titular Completo
          </p>
          <h4 className="text-xs sm:text-sm font-bold leading-snug text-slate-900 dark:text-white">
            {title}
          </h4>
        </div>
      }
      delayMs={220}
      maxWidth={460}
      className="w-full"
    >
      <h3
        title={title}
        className={`text-base font-bold text-slate-900 dark:text-[var(--header-title)] group-hover:text-blue-600 dark:${accentHoverColor} transition-colors leading-snug line-clamp-2 mt-1.5 ${className}`}
      >
        {title}
      </h3>
    </DoiceladevHoverPreview>
  );
}

/**
 * DoiceladevCardExcerpt - Sinopsis / extracto con previsualización completa en hover.
 */
export function DoiceladevCardExcerpt({
  excerpt,
  className = '',
}: DoiceladevCardExcerptProps) {
  if (!excerpt) return null;

  return (
    <DoiceladevHoverPreview
      content={
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 border-b border-black/5 dark:border-white/10 pb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
              Resumen Técnico Completo
            </span>
          </div>
          <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-zinc-200 font-normal">
            {excerpt}
          </p>
        </div>
      }
      delayMs={200}
      maxWidth={500}
      className="w-full"
    >
      <p className={`text-xs text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5 ${className}`}>
        {excerpt}
      </p>
    </DoiceladevHoverPreview>
  );
}

/**
 * DoiceladevCard - Componente compuesto para tarjetas de contenido técnico.
 * Mantiene 100% el diseño visual y estandarizado previo.
 */
export function DoiceladevCard({
  href,
  title,
  category,
  categoryMeta,
  excerpt,
  coverImage,
  topicCategory,
  priority = false,
  accentHoverColor = 'group-hover:text-cyan-300',
}: DoiceladevCardProps) {
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
          topicCategory={topicCategory}
          priority={priority}
        />

        <div>
          <DoiceladevCardMeta categoryMeta={categoryMeta} />
          <DoiceladevCardTitle title={title} accentHoverColor={accentHoverColor} />
          <DoiceladevCardExcerpt excerpt={excerpt} />
        </div>
      </div>
    </Link>
  );
}

// Vinculación de subcomponentes para composición desacoplada
DoiceladevCard.Meta = DoiceladevCardMeta;
DoiceladevCard.Title = DoiceladevCardTitle;
DoiceladevCard.Excerpt = DoiceladevCardExcerpt;
