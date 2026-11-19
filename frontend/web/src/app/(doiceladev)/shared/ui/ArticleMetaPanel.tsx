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

export function ArticleMetaPanel({
  title,
  rows = [],
  badges,
  links = [],
  placement = 'header',
}: ArticleMetaPanelProps) {
  const validRows = rows.filter((r) => Boolean(r.value?.trim()));
  const validBadges = badges?.items.filter(Boolean) || [];
  const validLinks = links.filter((l) => Boolean(l.href?.trim()));

  if (
    validRows.length === 0 &&
    validBadges.length === 0 &&
    validLinks.length === 0
  ) {
    return null;
  }

  const spacingClass = placement === 'footer' ? 'mt-8' : 'mb-8';

  return (
    <section
      className={`${spacingClass} p-5 sm:p-6 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] space-y-4`}
    >
      {title && (
        <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          {title}
        </h2>
      )}

      {validRows.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
          {validRows.map((row) => (
            <div key={row.label} className="space-y-0.5">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                {row.label}
              </dt>
              <dd className="text-slate-800 dark:text-zinc-200 leading-relaxed break-words">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {validBadges.length > 0 && badges && (
        <div className="space-y-2 pt-1">
          <div className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            {badges.label}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {validBadges.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.07] text-[11px] font-mono text-slate-700 dark:text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {validLinks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {validLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-btn-neumorphic text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
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
