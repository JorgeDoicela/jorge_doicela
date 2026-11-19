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

export type ElementAlign = 'left' | 'center' | 'right';

export interface ArticleMetaAlignConfig {
  title?: ElementAlign;
  labels?: ElementAlign;
  values?: ElementAlign;
  badges?: ElementAlign;
  links?: ElementAlign;
}

export type ArticleMetaAlign = ElementAlign | ArticleMetaAlignConfig;

interface ArticleMetaPanelProps {
  title?: string;
  rows?: ArticleMetaRow[];
  badges?: {
    label: string;
    items: string[];
  };
  links?: ArticleMetaLink[];
  placement?: 'header' | 'footer';
  align?: ArticleMetaAlign | string;
}

const SAFE_EXTERNAL_URL_RE = /^https?:\/\//i;

function toTextAlignClass(align: ElementAlign): string {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
}

function toJustifyClass(align: ElementAlign): string {
  if (align === 'center') return 'justify-center';
  if (align === 'right') return 'justify-end';
  return 'justify-start';
}

export function resolveAlignConfig(
  align?: ArticleMetaAlign | string,
): Required<ArticleMetaAlignConfig> {
  const defaults: Required<ArticleMetaAlignConfig> = {
    title: 'left',
    labels: 'left',
    values: 'left',
    badges: 'left',
    links: 'left',
  };

  if (!align) return defaults;

  if (align === 'left' || align === 'center' || align === 'right') {
    return {
      title: align,
      labels: align,
      values: align,
      badges: align,
      links: align,
    };
  }

  if (typeof align === 'object' && align !== null) {
    return {
      title: align.title || 'left',
      labels: align.labels || 'left',
      values: align.values || 'left',
      badges: align.badges || 'left',
      links: align.links || 'left',
    };
  }

  if (typeof align === 'string') {
    try {
      const parsed = JSON.parse(align);
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          title: parsed.title || 'left',
          labels: parsed.labels || 'left',
          values: parsed.values || 'left',
          badges: parsed.badges || 'left',
          links: parsed.links || 'left',
        };
      }
    } catch {
      // String no JSON: fallback seguro
    }
  }

  return defaults;
}

export function ArticleMetaPanel({
  title,
  rows = [],
  badges,
  links = [],
  placement = 'header',
  align = 'left',
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

  const config = resolveAlignConfig(align);
  const titleTextClass = toTextAlignClass(config.title);
  const labelsTextClass = toTextAlignClass(config.labels);
  const valuesTextClass = toTextAlignClass(config.values);
  const badgesJustifyClass = toJustifyClass(config.badges);
  const linksJustifyClass = toJustifyClass(config.links);

  const spacingClass = placement === 'footer' ? 'mt-8' : 'mb-6';
  const isCompactRows =
    validRows.length >= 2 &&
    validRows.length <= 3 &&
    validRows.every((r) => r.value.trim().length <= 40);

  const isRowsCentered =
    config.labels === 'center' && config.values === 'center';

  const rowsLayoutClass = isRowsCentered
    ? 'flex flex-wrap items-center justify-center gap-x-10 gap-y-3'
    : isCompactRows
      ? 'flex flex-wrap items-start justify-start gap-x-10 gap-y-3'
      : validRows.length === 1
        ? 'grid grid-cols-1 gap-y-3'
        : 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4';
  const hasRows = validRows.length > 0;
  const hasBadges = validBadges.length > 0 && Boolean(badges);

  return (
    <section
      aria-label={title || undefined}
      className={`${spacingClass} px-5 py-4 sm:px-6 sm:py-5 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] space-y-4`}
    >
      {title && (
        <h2
          className={`${titleTextClass} text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100`}
        >
          {title}
        </h2>
      )}

      {hasRows && (
        <dl className={rowsLayoutClass}>
          {validRows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              className="space-y-1.5 min-w-0"
            >
              <dt
                className={`${labelsTextClass} text-xs font-semibold text-slate-700 dark:text-zinc-200`}
              >
                {row.label}
              </dt>
              <dd
                className={`${valuesTextClass} text-xs sm:text-[13px] text-slate-600 dark:text-zinc-400 font-normal dark:font-light leading-relaxed break-words`}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {hasBadges && badges && (
        <div className={`space-y-2 ${hasRows ? 'pt-1' : ''}`}>
          <div
            className={`${labelsTextClass} text-xs font-semibold text-slate-700 dark:text-zinc-200`}
          >
            {badges.label}
          </div>
          <ul
            className={`flex flex-wrap items-center ${badgesJustifyClass} gap-y-1.5 list-none p-0 m-0 text-xs sm:text-[13px] font-mono font-normal dark:font-light text-slate-600 dark:text-zinc-400`}
          >
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
          className={`flex flex-wrap items-center ${linksJustifyClass} gap-2.5 ${
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
