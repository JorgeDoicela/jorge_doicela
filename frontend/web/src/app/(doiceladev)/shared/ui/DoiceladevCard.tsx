'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArticleCover, DoiceladevArticleCategory } from './ArticleCover';
import { DoiceladevCardSkeleton } from './DoiceladevCardSkeleton';
import { stripMarkdown } from '../lib/stripMarkdown';

export { DoiceladevCardSkeleton };

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
  category?: DoiceladevArticleCategory;
  topicCategory?: string;
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

export const CANONICAL_CATEGORY_MAP: Record<string, string> = {
  // CVE
  cve_analysis: 'cve_analysis',
  analisis_de_cve: 'cve_analysis',
  análisis_de_cve: 'cve_analysis',
  // Hardening
  hardening_guide: 'hardening_guide',
  guias_de_bastionado: 'hardening_guide',
  guías_de_bastionado: 'hardening_guide',
  // Advisory
  advisory: 'advisory',
  avisos_de_seguridad: 'advisory',
  // Writeup
  writeup: 'writeup',
  writeups_tecnicos: 'writeup',
  writeups_técnicos: 'writeup',
  // Pentest
  pentest: 'pentest',
  pruebas_de_intrusion: 'pentest',
  pruebas_de_intrusión: 'pentest',
  // Infrastructure
  servers: 'servers',
  servidores_linux: 'servers',
  servidores_y_linux: 'servers',
  'servidores_&_linux': 'servers',
  ci_cd: 'ci_cd',
  ci_cd_despliegues: 'ci_cd',
  'ci_cd_&_despliegues': 'ci_cd',
  containers: 'containers',
  contenedores_docker: 'containers',
  'contenedores_&_docker': 'containers',
  // Web & Frameworks
  web: 'web',
  ecosistema_web: 'web',
  frameworks: 'frameworks',
  frameworks_web: 'frameworks',
  'frameworks_&_web': 'frameworks',
  // AI
  mcp_server: 'mcp_server',
  servidores_mcp: 'mcp_server',
  llm: 'llm',
  modelos_llm: 'llm',
  agent: 'agent',
  frameworks_agenticos: 'agent',
  frameworks_agénticos: 'agent',
  // Development
  backend: 'backend',
  backend_apis: 'backend',
  'backend_&_apis': 'backend',
  frontend: 'frontend',
  frontend_ui: 'frontend',
  'frontend_&_ui': 'frontend',
  mobile: 'mobile',
  movil_multiplataforma: 'mobile',
  móvil_multiplataforma: 'mobile',
  'móvil_&_multiplataforma': 'mobile',
  architecture: 'architecture',
  arquitectura_de_software: 'architecture',
  clean_code: 'clean_code',
  codigo_limpio: 'clean_code',
  código_limpio: 'clean_code',
  devops: 'devops',
  cloud_devops: 'devops',
  'cloud_&_devops': 'devops',
  hardening: 'hardening',
  seguridad_bastionado: 'hardening',
  'seguridad_&_bastionado': 'hardening',
  // Blog Personal & Extras
  lessons: 'lessons',
  lecciones_aprendidas: 'lessons',
  lessons_learned: 'lessons',
  postmortems: 'postmortems',
  errores_postmortems: 'postmortems',
  errores_post_mortems: 'postmortems',
  failures_post_mortems: 'postmortems',
  opinion: 'opinion',
  ensayos_opinion: 'opinion',
  essays_opinion: 'opinion',
  career: 'career',
  carrera_tecnica: 'career',
  engineering_career: 'career',
  journal: 'journal',
  bitacora_de_ingenieria: 'journal',
  engineering_log: 'journal',
  help: 'help',
  soporte_dudas: 'help',
  monitoring: 'monitoring',
  monitoreo_telemetria: 'monitoring',
  zero_ram: 'zero_ram',
  optimizacion_de_recursos: 'zero_ram',
};

/**
 * DoiceladevCardMeta - Nivel 1 (Módulo) y Nivel 2 (Categoría) desacoplados.
 * Nivel 1 es navegable hacia el módulo correspondiente (/${category}).
 * Mantiene 100% la estética original (tipografía mono sobria).
 */
export function DoiceladevCardMeta({
  categoryMeta,
  category,
  topicCategory,
  className = '',
}: DoiceladevCardMetaProps) {
  const tFilters = useTranslations('Filters');
  const tNav = useTranslations('Nav');

  const formatSegment = React.useCallback(
    (segment: string): string => {
      const trimmed = segment.trim();
      if (!trimmed) return '';
      const lower = trimmed.toLowerCase();
      const canonical = CANONICAL_CATEGORY_MAP[lower] || lower;
      if (tNav.has(canonical as any)) {
        return tNav(canonical as any);
      }
      if (tFilters.has(canonical as any)) {
        return tFilters(canonical as any);
      }
      if (tNav.has(lower as any)) {
        return tNav(lower as any);
      }
      if (tFilters.has(lower as any)) {
        return tFilters(lower as any);
      }
      if (tFilters.has(trimmed as any)) {
        return tFilters(trimmed as any);
      }
      return trimmed.replace(/_/g, ' ');
    },
    [tFilters, tNav]
  );

  const { moduleSegment, categorySegment, rawCategoryPart } = React.useMemo(() => {
    if (typeof categoryMeta === 'string') {
      const parts = categoryMeta.split('•');
      const mod = formatSegment(parts[0] || '');
      const rawCat = parts.length > 1 ? parts.slice(1).join('•').trim() : null;
      const cat = rawCat ? formatSegment(rawCat) : null;
      return { moduleSegment: mod, categorySegment: cat, rawCategoryPart: rawCat };
    }
    return { moduleSegment: null, categorySegment: null, rawCategoryPart: null };
  }, [categoryMeta, formatSegment]);

  const categoryHref = React.useMemo(() => {
    const raw = topicCategory || rawCategoryPart;
    if (!raw) return null;
    const cleaned = raw
      .toLowerCase()
      .trim()
      .replace(/[\s&/]+/g, '_')
      .replace(/_+/g, '_');

    const unaccented = cleaned.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const canonicalSlug =
      CANONICAL_CATEGORY_MAP[cleaned] ||
      CANONICAL_CATEGORY_MAP[unaccented] ||
      unaccented;

    return `/categories/${encodeURIComponent(canonicalSlug)}`;
  }, [topicCategory, rawCategoryPart]);

  if (!categoryMeta) return null;

  if (typeof categoryMeta !== 'string') {
    return (
      <p className={`text-[11px] font-mono text-slate-500 dark:text-zinc-400 tracking-wider truncate font-medium ${className}`}>
        {categoryMeta}
      </p>
    );
  }

  const moduleHref = category ? `/${category}` : null;

  return (
    <p className={`text-[11px] font-mono text-slate-500 dark:text-zinc-400 tracking-wider truncate font-medium ${className}`}>
      {moduleHref ? (
        <Link href={moduleHref} className="hover:no-underline">
          {moduleSegment}
        </Link>
      ) : (
        <span>{moduleSegment}</span>
      )}
      {categorySegment && (
        <>
          <span className="mx-1.5 opacity-60 select-none">•</span>
          {categoryHref ? (
            <Link href={categoryHref} className="hover:no-underline">
              {categorySegment}
            </Link>
          ) : (
            <span>{categorySegment}</span>
          )}
        </>
      )}
    </p>
  );
}

/**
 * DoiceladevCardTitle - Titular editorial con truncamiento en dos líneas.
 */
export function DoiceladevCardTitle({
  title,
  accentHoverColor = 'group-hover:text-cyan-300',
  className = '',
}: DoiceladevCardTitleProps) {
  return (
    <h3
      title={title}
      className={`text-base font-bold text-slate-900 dark:text-[var(--header-title)] group-hover:text-blue-600 dark:${accentHoverColor} transition-colors leading-snug line-clamp-2 mt-1.5 ${className}`}
    >
      {title}
    </h3>
  );
}

/**
 * DoiceladevCardExcerpt - Sinopsis / extracto con truncamiento en dos líneas.
 */
export function DoiceladevCardExcerpt({
  excerpt,
  className = '',
}: DoiceladevCardExcerptProps) {
  if (!excerpt) return null;

  const clean = stripMarkdown(excerpt);
  if (!clean) return null;

  return (
    <p
      title={clean}
      className={`text-xs text-slate-600 dark:text-zinc-400 font-normal dark:font-light line-clamp-2 leading-relaxed mt-1.5 ${className}`}
    >
      {clean}
    </p>
  );
}

/**
 * DoiceladevCard - Componente compuesto para tarjetas de contenido técnico.
 * Nivel 1 (Módulo) navega a la sección del módulo.
 * Título y Descripción forman un bloque unificado de enlace al artículo.
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
    <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#16202c]/80 hover:bg-white dark:hover:bg-[#1c2938] border border-slate-200/80 dark:border-white/[0.07] hover:border-slate-300 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] dark:shadow-none">
      <div className="space-y-3.5">
        <Link href={href} className="block overflow-hidden rounded-xl focus:outline-none" tabIndex={-1}>
          <ArticleCover
            title={title}
            category={category}
            coverImage={coverImage}
            topicCategory={topicCategory}
            priority={priority}
          />
        </Link>

        <div>
          <DoiceladevCardMeta
            categoryMeta={categoryMeta}
            category={category}
            topicCategory={topicCategory}
          />
          <Link href={href} className="block focus:outline-none">
            <DoiceladevCardTitle title={title} accentHoverColor={accentHoverColor} />
            <DoiceladevCardExcerpt excerpt={excerpt} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Vinculación de subcomponentes para composición desacoplada
DoiceladevCard.Meta = DoiceladevCardMeta;
DoiceladevCard.Title = DoiceladevCardTitle;
DoiceladevCard.Excerpt = DoiceladevCardExcerpt;
DoiceladevCard.Skeleton = DoiceladevCardSkeleton;
