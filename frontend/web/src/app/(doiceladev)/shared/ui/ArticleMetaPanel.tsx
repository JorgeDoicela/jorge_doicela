import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface ArticleMetaRow {
  label: string;
  value: string;
}

export interface ArticleMetaLink {
  label: string;
  href: string;
}

interface ArticleMetaPanelProps {
  title?: string;
  rows?: ArticleMetaRow[];
  badges?: {
    label: string;
    items: string[];
  };
  links?: ArticleMetaLink[];
  placement?: 'header' | 'footer';
}

const SAFE_EXTERNAL_URL_RE = /^https?:\/\//i;

export function ArticleMetaPanel({
  title,
  rows = [],
  badges,
  links = [],
  placement = 'header',
}: ArticleMetaPanelProps) {
  const validRows = rows.filter((r) => Boolean(r.value?.trim()));
  const validBadges = Array.from(
    new Set((badges?.items || []).map((item) => item.trim()).filter(Boolean)),
  );
  const validLinks = links.filter((l) => {
    const href = l.href?.trim();
    return Boolean(href && SAFE_EXTERNAL_URL_RE.test(href));
  });

  if (
    validRows.length === 0 &&
    validBadges.length === 0 &&
    validLinks.length === 0
  ) {
    return null;
  }

  const spacingClass = placement === 'footer' ? 'mt-8' : 'mb-6';
  const hasLongRows = validRows.some((r) => r.value.trim().length > 60);
  const isCompactRows =
    validRows.length >= 2 &&
    validRows.length <= 3 &&
    validRows.every((r) => r.value.trim().length <= 40);
  
  // Opción B: Si son datos concisos (como en Proyectos, IA, Tutoriales o Foro), centrar todo armónicamente.
  // Si tiene párrafos largos o muchas especificaciones (como Ciberseguridad o Infraestructura), mantener alineación izquierda.
  const isCentered = !hasLongRows && validRows.length <= 3;

  const rowsLayoutClass = isCentered
    ? 'flex flex-wrap items-center justify-center gap-x-10 gap-y-3'
    : isCompactRows
      ? 'flex flex-wrap items-start gap-x-10 gap-y-3'
      : validRows.length === 1
        ? 'grid grid-cols-1 gap-y-3'
        : 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4';
  const hasRows = validRows.length > 0;
  const hasBadges = validBadges.length > 0 && Boolean(badges);

  return (
    <section
      aria-label={title || undefined}
      className={`${spacingClass} px-5 py-4 sm:px-6 sm:py-5 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] space-y-4 ${
        isCentered ? 'text-center' : ''
      }`}
    >
      {title && (
        <h2 className="text-center text-[11px] font-mono font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-zinc-200">
          {title}
        </h2>
      )}

      {hasRows && (
        <dl className={rowsLayoutClass}>
          {validRows.map((row, index) => (
            <div key={`${row.label}-${index}`} className={`space-y-1 min-w-0 ${isCentered ? 'text-center' : 'text-left'}`}>
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-zinc-400">
                {row.label}
              </dt>
              <dd className="text-[13px] sm:text-sm font-medium text-slate-900 dark:text-zinc-100 leading-relaxed break-words">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {hasBadges && badges && (
        <div className={`space-y-2 ${isCentered ? 'text-center' : 'text-left'} ${hasRows ? 'pt-1' : ''}`}>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-zinc-400">
            {badges.label}
          </div>
          <ul className={`flex flex-wrap items-center ${isCentered ? 'justify-center' : ''} gap-y-1.5 list-none p-0 m-0 text-xs sm:text-[13px] font-mono font-medium text-slate-800 dark:text-zinc-200`}>
            {validBadges.map((item, index) => (
              <li key={item} className="inline-flex items-center">
                <span>{item}</span>
                {index < validBadges.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mx-2 text-slate-300 dark:text-zinc-600 select-none font-normal"
                  >
                    •
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validLinks.length > 0 && (
        <div
          className={`flex flex-wrap items-center ${isCentered ? 'justify-center' : ''} gap-2.5 ${
            hasRows || hasBadges ? 'pt-1' : ''
          }`}
        >
          {validLinks.map((link, index) => (
            <a
              key={`${link.href}-${index}`}
              href={link.href.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <span>{link.label}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
