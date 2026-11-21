'use client';

import React from 'react';
import { CategoryFilterBar } from './CategoryFilterBar';
import {
  DoiceladevSearchInput,
  type SearchAccentColor,
} from './DoiceladevSearchInput';
import type { FilterOption } from '../types/filter';

export interface ModuleFilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  loading?: boolean;
  accentColor?: SearchAccentColor;
  showCount?: boolean;
  className?: string;
}

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
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 pt-2 w-full ${className}`}
    >
      {/* 1. Buscador Neumórfico Siempre Centrado Arriba */}
      <DoiceladevSearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        accentColor={accentColor}
      />

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
