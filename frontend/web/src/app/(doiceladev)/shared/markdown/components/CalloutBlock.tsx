'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export interface CalloutBlockProps {
  type?: 'note' | 'tip' | 'important' | 'warning' | 'caution' | 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
  title?: string;
  children?: React.ReactNode;
}

export type CalloutType = 'note' | 'tip' | 'important' | 'warning' | 'caution' | 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';
export type NormalizedCalloutType = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const CALLOUT_CONFIG: Record<
  NormalizedCalloutType,
  {
    translationKey: 'calloutNote' | 'calloutTip' | 'calloutImportant' | 'calloutWarning' | 'calloutCaution';
    titleColor: string;
    containerStyle: string;
  }
> = {
  note: {
    translationKey: 'calloutNote',
    titleColor: 'text-blue-600 dark:text-blue-400',
    containerStyle:
      'border-blue-500/20 bg-gradient-to-br from-blue-950/15 via-black/[0.02] to-slate-900/20 dark:from-blue-950/30 dark:via-zinc-900/40 dark:to-slate-950/30',
  },
  tip: {
    translationKey: 'calloutTip',
    titleColor: 'text-emerald-600 dark:text-emerald-400',
    containerStyle:
      'border-emerald-500/20 bg-gradient-to-br from-emerald-950/15 via-black/[0.02] to-slate-900/20 dark:from-emerald-950/30 dark:via-zinc-900/40 dark:to-slate-950/30',
  },
  important: {
    translationKey: 'calloutImportant',
    titleColor: 'text-indigo-600 dark:text-indigo-400',
    containerStyle:
      'border-indigo-500/20 bg-gradient-to-br from-indigo-950/15 via-black/[0.02] to-slate-900/20 dark:from-indigo-950/30 dark:via-zinc-900/40 dark:to-slate-950/30',
  },
  warning: {
    translationKey: 'calloutWarning',
    titleColor: 'text-amber-600 dark:text-amber-400',
    containerStyle:
      'border-amber-500/20 bg-gradient-to-br from-amber-950/15 via-black/[0.02] to-slate-900/20 dark:from-amber-950/30 dark:via-zinc-900/40 dark:to-slate-950/30',
  },
  caution: {
    translationKey: 'calloutCaution',
    titleColor: 'text-rose-600 dark:text-rose-400',
    containerStyle:
      'border-rose-500/20 bg-gradient-to-br from-rose-950/15 via-black/[0.02] to-slate-900/20 dark:from-rose-950/30 dark:via-zinc-900/40 dark:to-slate-950/30',
  },
};

const CALLOUT_REGEX = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*[\r\n]|\s+)?([\s\S]*)$/i;

/**
 * Extrae recursivamente el texto inicial para detectar la directiva [!TIPO]
 * Maneja saltos de línea, párrafos y elementos JSX sin perder formato.
 */
function extractCalloutInfo(children: React.ReactNode): { type: NormalizedCalloutType | null; content: React.ReactNode } {
  if (!children) return { type: null, content: children };

  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length === 0) return { type: null, content: children };

  // Buscar el primer nodo significativo
  const firstIndex = childrenArray.findIndex(
    (c) => typeof c !== 'string' || c.trim().length > 0
  );
  if (firstIndex === -1) return { type: null, content: children };

  const firstChild = childrenArray[firstIndex];

  // Caso 1: el primer nodo es un contenedor <p>
  if (React.isValidElement(firstChild)) {
    const pChildren = React.Children.toArray((firstChild.props as { children?: React.ReactNode }).children);
    const pFirstIndex = pChildren.findIndex(
      (c) => typeof c !== 'string' || c.trim().length > 0
    );

    if (pFirstIndex !== -1 && typeof pChildren[pFirstIndex] === 'string') {
      const text = pChildren[pFirstIndex];
      const match = text.match(CALLOUT_REGEX);
      if (match) {
        const type = match[1].toLowerCase() as NormalizedCalloutType;
        const remainingText = match[2];

        const newPChildren = [...pChildren];
        if (remainingText && remainingText.trim().length > 0) {
          newPChildren[pFirstIndex] = remainingText;
        } else {
          newPChildren.splice(pFirstIndex, 1);
        }

        const newChildrenArray = [...childrenArray.slice(firstIndex)];
        if (newPChildren.length > 0) {
          newChildrenArray[0] = React.cloneElement(firstChild, {}, ...newPChildren);
        } else {
          newChildrenArray.shift();
        }

        return { type, content: newChildrenArray };
      }
    }
  }

  // Caso 2: el primer nodo es un string directo
  if (typeof firstChild === 'string') {
    const match = firstChild.match(CALLOUT_REGEX);
    if (match) {
      const type = match[1].toLowerCase() as NormalizedCalloutType;
      const remainingText = match[2];

      const newChildrenArray = [...childrenArray.slice(firstIndex)];
      if (remainingText && remainingText.trim().length > 0) {
        newChildrenArray[0] = remainingText;
      } else {
        newChildrenArray.shift();
      }

      return { type, content: newChildrenArray };
    }
  }

  return { type: null, content: children };
}

export function CalloutBlock({ type: explicitType, title: explicitTitle, children }: CalloutBlockProps) {
  const t = useTranslations('Markdown');
  const extracted = extractCalloutInfo(children);
  const normalizedExplicit = explicitType ? (explicitType.toLowerCase() as NormalizedCalloutType) : null;
  const type: NormalizedCalloutType | null = normalizedExplicit || extracted.type;
  const content = normalizedExplicit ? children : extracted.content;

  // Si no es un callout especial [!TIPO] ni tiene tipo explícito, renderiza un panel limpio y simétrico
  if (!type) {
    return (
      <div className="relative my-6 p-5 sm:p-6 rounded-2xl overflow-hidden glass-convex-panel border border-blue-500/20 bg-gradient-to-br from-blue-950/15 via-black/[0.02] to-slate-900/20 dark:from-blue-950/30 dark:via-zinc-900/40 dark:to-slate-950/30 space-y-2.5 shadow-md">
        {explicitTitle && (
          <h4 className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            {explicitTitle}
          </h4>
        )}
        <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 font-normal dark:font-light leading-relaxed [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
          {content}
        </div>
      </div>
    );
  }

  const config = CALLOUT_CONFIG[type];
  const displayTitle = explicitTitle || t(config.translationKey);

  return (
    <div
      className={`relative my-6 p-5 sm:p-6 rounded-2xl overflow-hidden glass-convex-panel border space-y-2.5 shadow-md select-text ${config.containerStyle}`}
      role="note"
      aria-label={displayTitle}
    >
      <h4 className={`text-[11px] font-mono font-bold tracking-wider uppercase ${config.titleColor}`}>
        {displayTitle}
      </h4>
      <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 font-normal dark:font-light leading-relaxed [&>p]:my-1.5 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {content}
      </div>
    </div>
  );
}

