'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FilterOption } from '../types/filter';
import { SoftwareSelect, type SelectOption } from './SoftwareSelect';

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
  showCount = false,
  className = '',
}) => {
  const t = useTranslations('Common');
  const tFilters = useTranslations('Filters');
  const styles = ACCENT_STYLES[accentColor] || ACCENT_STYLES.cyan;

  const getOptionLabel = React.useCallback(
    (opt: FilterOption): string => {
      const id = String(opt.id || '').trim();
      const label = String(opt.label || '').trim();

      // 1. Caso canónico de 'all'
      if (id.toLowerCase() === 'all') {
        if (tFilters.has('all' as any)) return tFilters('all' as any);
        if (t.has('all' as any)) return t('all' as any);
        return 'Todos';
      }

      // 2. Probar coincidencia exacta y en minúsculas por id
      if (tFilters.has(id as any)) {
        return tFilters(id as any);
      }
      const lowerId = id.toLowerCase();
      if (tFilters.has(lowerId as any)) {
        return tFilters(lowerId as any);
      }

      // 3. Probar coincidencia por label si difiere
      if (label && tFilters.has(label as any)) {
        return tFilters(label as any);
      }
      const lowerLabel = label.toLowerCase();
      if (lowerLabel && tFilters.has(lowerLabel as any)) {
        return tFilters(lowerLabel as any);
      }

      // 4. Fallback cosmético premium: nunca mostrar guiones bajos ni cadenas técnicas crudas
      const rawText = label || id;
      return rawText
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    [t, tFilters]
  );

  const selectOptions: SelectOption<string>[] = React.useMemo(() => {
    return options.map((opt) => ({
      value: opt.id,
      label: getOptionLabel(opt),
      badge: showCount && typeof opt.count === 'number' && opt.count > 0 ? opt.count : undefined,
    }));
  }, [options, showCount, getOptionLabel]);

  return (
    <div className={`w-full ${className}`}>
      {/* 1. Selector Dropdown Táctil Neumórfico (Exclusivo para Móvil: < sm) */}
      <div className="sm:hidden w-full max-w-xs mx-auto flex justify-center">
        {loading && options.length === 0 ? (
          <div className="w-full h-9 rounded-xl bg-slate-200/50 dark:bg-white/5 animate-pulse" />
        ) : (
          <SoftwareSelect
            options={selectOptions}
            value={selectedId}
            onChange={onSelect}
            disabled={loading}
            align="center"
            className="w-full"
          />
        )}
      </div>

      {/* 2. Pestañas Horizontales Neumórficas (Exclusivo para Escritorio: >= sm) */}
      <div
        role="tablist"
        aria-label={t('categoryFilterAria')}
        className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none min-h-[38px]"
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
                <span>{getOptionLabel(option)}</span>
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
    </div>
  );
};
