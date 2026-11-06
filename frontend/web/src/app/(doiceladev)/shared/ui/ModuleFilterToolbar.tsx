'use client';

import React from 'react';
import { CategoryFilterBar } from './CategoryFilterBar';
import type { FilterOption } from '../types/filter';

export interface ModuleFilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  accentColor?: 'cyan' | 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';
  showCount?: boolean;
  className?: string;
}

const RING_ACCENT_CLASSES: Record<
  NonNullable<ModuleFilterToolbarProps['accentColor']>,
  string
> = {
  cyan: 'focus:ring-cyan-500/50',
  blue: 'focus:ring-blue-500/50',
  purple: 'focus:ring-purple-500/50',
  amber: 'focus:ring-amber-500/50',
  emerald: 'focus:ring-emerald-500/50',
  rose: 'focus:ring-rose-500/50',
};

/**
 * ModuleFilterToolbar
 * Barra de controles unificada para los módulos de DoicelaDev.
 * 
 * Regla de Diseño y Ergonomía Permanente:
 * - Siempre mantiene el buscador ARRIBA centrado (max-w-md).
 * - Siempre mantiene la barra de filtros/pastillas ABAJO centrada (w-fit max-w-full mx-auto).
 * Garantiza total simetría visual con los títulos y previene colisiones o separaciones excesivas.
 */
export function ModuleFilterToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  options,
  selectedId,
  onSelect,
  loading = false,
  accentColor = 'cyan',
  showCount = false,
  className = '',
}: ModuleFilterToolbarProps) {
  const ringClass = RING_ACCENT_CLASSES[accentColor] || RING_ACCENT_CLASSES.cyan;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 pt-2 w-full ${className}`}
    >
      {/* 1. Buscador Neumórfico Siempre Centrado Arriba */}
      <div className="relative w-full max-w-md shrink-0">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full px-5 py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 ${ringClass} shadow-inner transition-all duration-200`}
        />
      </div>

      {/* 2. Barra de Pastillas Neumórficas Siempre Centradas Abajo */}
      <div className="w-full max-w-full min-w-0 flex justify-center">
        <CategoryFilterBar
          options={options}
          selectedId={selectedId}
          onSelect={onSelect}
          loading={loading}
          accentColor={accentColor}
          showCount={showCount}
        />
      </div>
    </div>
  );
}
