'use client';

import { useMemo } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';

export interface UseFuzzyFilterOptions<T> {
  category?: string;
  categoryKey?: keyof T | ((item: T) => string | undefined);
  search?: string;
  fuseOptions?: IFuseOptions<T>;
  searchKeys?: Array<{ name: string; weight: number }>;
}

/**
 * Hook universal de filtrado en cliente y búsqueda difusa (Fuse.js)
 * homologado con el algoritmo del buscador general (Spotlight).
 *
 * Elimina parpadeos, layout-shifts y peticiones HTTP redundantes en cada pulsación,
 * proporcionando tolerancia a errores tipográficos y ponderación por campos.
 */
export function useFuzzyFilter<T>(
  items: T[],
  options: UseFuzzyFilterOptions<T> = {},
): T[] {
  const {
    category,
    categoryKey = 'category' as keyof T,
    search = '',
    searchKeys,
    fuseOptions,
  } = options;

  // 1. Filtrado síncrono por categoría (Nivel 2) en memoria
  const categoryFiltered = useMemo(() => {
    if (!category || category === 'all') return items;
    const catLower = category.trim().toLowerCase();

    return items.filter((item) => {
      const val =
        typeof categoryKey === 'function'
          ? categoryKey(item)
          : (item[categoryKey] as unknown);

      if (!val) return false;
      return String(val).trim().toLowerCase() === catLower;
    });
  }, [items, category, categoryKey]);

  // 2. Opciones de Fuse.js configuradas con ponderación de relevancia
  const effectiveFuseOptions = useMemo<IFuseOptions<T>>(() => {
    if (fuseOptions) return fuseOptions;

    return {
      keys: searchKeys || [
        { name: 'title', weight: 2.5 },
        { name: 'name', weight: 2.5 },
        { name: 'label', weight: 2.5 },
        { name: 'tags', weight: 1.8 },
        { name: 'techStack', weight: 1.8 },
        { name: 'category', weight: 1.2 },
        { name: 'subtitle', weight: 1.0 },
        { name: 'excerpt', weight: 0.8 },
        { name: 'description', weight: 0.8 },
        { name: 'architectureOverview', weight: 0.8 },
        { name: 'content', weight: 0.6 },
      ],
      threshold: 0.35,
      distance: 100,
      ignoreLocation: true,
      minMatchCharLength: 1,
      shouldSort: true,
    };
  }, [fuseOptions, searchKeys]);

  // 3. Instancia de Fuse.js indexada sobre los elementos de la categoría activa
  const fuse = useMemo(() => {
    return new Fuse(categoryFiltered, effectiveFuseOptions);
  }, [categoryFiltered, effectiveFuseOptions]);

  // 4. Búsqueda difusa en memoria
  return useMemo(() => {
    const raw = search.trim();
    if (!raw) return categoryFiltered;

    const cleanQuery = raw.startsWith('#') ? raw.slice(1).trim() : raw;
    if (!cleanQuery) return categoryFiltered;

    const results = fuse.search(cleanQuery);
    return results.map((res) => res.item);
  }, [categoryFiltered, search, fuse]);
}

