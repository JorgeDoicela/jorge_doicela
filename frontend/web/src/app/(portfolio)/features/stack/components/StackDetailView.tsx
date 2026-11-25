'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { PortfolioStackItem, StackCategoryType } from '../types';

interface StackDetailViewProps {
  items: PortfolioStackItem[];
}

const CATEGORY_ORDER: StackCategoryType[] = [
  'frontend',
  'backend',
  'data_devops',
  'ai_security',
  'tools',
];

export function StackDetailView({ items }: StackDetailViewProps) {
  const t = useTranslations('Stack');
  const [activeCategory, setActiveCategory] = useState<'all' | StackCategoryType>('all');

  const categoryLabels: Record<StackCategoryType, string> = {
    frontend: t('client'),
    backend: t('server'),
    data_devops: t('data'),
    ai_security: t('aiSecurity'),
    tools: t('toolsCategory'),
  };

  const visibleCategories = useMemo(() => {
    const targetList =
      activeCategory === 'all' ? CATEGORY_ORDER : [activeCategory];
    return targetList
      .map((cat) => ({
        category: cat,
        label: categoryLabels[cat],
        items: items.filter((i) => i.category === cat),
      }))
      .filter((group) => group.items.length > 0);
  }, [activeCategory, items, t]);

  return (
    <div className="flex flex-col gap-10">
      {/* Filtros por categoría */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-surface border border-gold-300/80 text-foreground font-semibold shadow-sm'
              : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-border/40'
          }`}
        >
          {t('filterAll')}
        </button>

        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-surface border border-gold-300/80 text-foreground font-semibold shadow-sm'
                : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-border/40'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Grupos de Tecnologías y Entorno */}
      <div className="flex flex-col gap-12">
        {visibleCategories.map((group) => (
          <section key={group.category} className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-gold-400 font-semibold">
                {group.label}
              </h2>
              <span className="text-[11px] font-mono text-muted">
                {group.items.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <article
                  key={item.id}
                  className="p-5 rounded-xl border border-border/60 bg-surface/40 hover:bg-surface hover:border-gold-300/40 transition-all duration-200 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-mono text-foreground font-semibold">
                      {item.name}
                    </h3>
                    {item.level && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border-gold/40 text-gold-300/90 bg-background/40 shrink-0">
                        {item.level}
                      </span>
                    )}
                  </div>
                  {item.summary && (
                    <p className="text-xs text-muted font-light leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
