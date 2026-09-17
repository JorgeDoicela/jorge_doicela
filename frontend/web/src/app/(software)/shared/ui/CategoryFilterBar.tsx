'use client';

import React from 'react';
import { FilterOption } from '../types/filter';

export interface CategoryFilterBarProps {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  accentColor?: 'cyan' | 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  showCount?: boolean;
  className?: string;
}

const ACCENT_STYLES: Record<
  NonNullable<CategoryFilterBarProps['accentColor']>,
  { active: string; badge: string }
> = {
  cyan: {
    active: 'glass-btn-neumorphic text-cyan-600 dark:text-cyan-400 font-bold shadow-sm',
    badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
  },
  blue: {
    active: 'glass-btn-neumorphic text-blue-600 dark:text-blue-400 font-bold shadow-sm',
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  },
  purple: {
    active: 'glass-btn-neumorphic text-purple-600 dark:text-purple-400 font-bold shadow-sm',
    badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
  },
  amber: {
    active: 'glass-btn-neumorphic text-amber-600 dark:text-amber-400 font-bold shadow-sm',
    badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  },
  emerald: {
    active: 'glass-btn-neumorphic text-emerald-600 dark:text-emerald-400 font-bold shadow-sm',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
  rose: {
    active: 'glass-btn-neumorphic text-rose-600 dark:text-rose-400 font-bold shadow-sm',
    badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  },
};

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  options,
  selectedId,
  onSelect,
  loading = false,
  accentColor = 'cyan',
  showCount = true,
  className = '',
}) => {
  const styles = ACCENT_STYLES[accentColor] || ACCENT_STYLES.cyan;

  return (
    <div
      role="tablist"
      aria-label="Filtro de categorías"
      className={`flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none min-h-[38px] ${className}`}
    >
      {loading && options.length === 0 ? (
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 rounded-xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="w-24 h-8 rounded-xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="w-20 h-8 rounded-xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
          <div className="w-28 h-8 rounded-xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
        </div>
      ) : (
        options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(option.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? styles.active
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <span>{option.label}</span>
              {showCount && typeof option.count === 'number' && option.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                    isSelected
                      ? styles.badge
                      : 'bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {option.count}
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
};
