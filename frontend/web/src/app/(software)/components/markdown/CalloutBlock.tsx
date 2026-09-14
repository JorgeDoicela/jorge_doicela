'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Info, Lightbulb, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';

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
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }
> = {
  note: {
    translationKey: 'calloutNote',
    icon: Info,
    accentColor: 'text-blue-600 dark:text-blue-400',
  },
  tip: {
    translationKey: 'calloutTip',
    icon: Lightbulb,
    accentColor: 'text-emerald-600 dark:text-emerald-400',
  },
  important: {
    translationKey: 'calloutImportant',
    icon: AlertCircle,
    accentColor: 'text-indigo-600 dark:text-indigo-400',
  },
  warning: {
    translationKey: 'calloutWarning',
    icon: AlertTriangle,
    accentColor: 'text-amber-600 dark:text-amber-400',
  },
  caution: {
    translationKey: 'calloutCaution',
    icon: ShieldAlert,
    accentColor: 'text-rose-600 dark:text-rose-400',
  },
};

/**
 * Extrae recursivamente el texto inicial para detectar la directiva [!TIPO]
 */
function extractCalloutInfo(children: React.ReactNode): { type: NormalizedCalloutType | null; content: React.ReactNode } {
  if (!children) return { type: null, content: children };

  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length === 0) return { type: null, content: children };

  const firstChild = childrenArray[0];

  // Si el primer hijo es un elemento <p>
  if (React.isValidElement(firstChild)) {
    const pChildren = React.Children.toArray((firstChild.props as { children?: React.ReactNode }).children);
    if (pChildren.length > 0 && typeof pChildren[0] === 'string') {
      const text = pChildren[0];
      const match = text.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
      if (match) {
        const type = match[1].toLowerCase() as NormalizedCalloutType;
        const remainingText = match[2];

        // Reconstruimos los hijos del <p> sin la etiqueta de directiva
        const newPChildren = remainingText ? [remainingText, ...pChildren.slice(1)] : pChildren.slice(1);

        const newFirstChild = newPChildren.length > 0 ? (
          React.cloneElement(firstChild, {}, ...newPChildren)
        ) : null;

        const newRemaining = newFirstChild
          ? [newFirstChild, ...childrenArray.slice(1)]
          : childrenArray.slice(1);

        return { type, content: newRemaining };
      }
    }
  }

  // Si el primer hijo es un string directo
  if (typeof firstChild === 'string') {
    const match = firstChild.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i);
    if (match) {
      const type = match[1].toLowerCase() as NormalizedCalloutType;
      const remainingText = match[2];
      const newRemaining = remainingText
        ? [remainingText, ...childrenArray.slice(1)]
        : childrenArray.slice(1);
      return { type, content: newRemaining };
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

  // Si no es un callout especial [!TIPO] ni tiene tipo explícito, renderiza un blockquote editorial elegante con riel sutil
  if (!type) {
    return (
      <blockquote className="my-6 p-4 sm:p-5 rounded-r-2xl border-l-4 border-blue-500/80 bg-black/[0.02] dark:bg-white/[0.02] border-y border-r border-black/5 dark:border-white/5 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 italic leading-relaxed">
        {children}
      </blockquote>
    );
  }

  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;
  const displayTitle = explicitTitle || t(config.translationKey);

  return (
    <aside
      className="my-6 p-5 sm:p-6 rounded-2xl glass-convex-panel border border-black/10 dark:border-white/10 space-y-2.5 select-text shadow-md transition-all bg-gradient-to-br from-black/[0.015] via-transparent to-black/[0.025] dark:from-white/[0.02] dark:via-transparent dark:to-white/[0.03]"
      role="note"
      aria-label={displayTitle}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${config.accentColor} shrink-0`} />
        <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${config.accentColor}`}>
          {displayTitle}
        </span>
      </div>
      <div className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed font-normal">
        {content}
      </div>
    </aside>
  );
}
