import { API_URL } from '../../../shared';
import type { PortfolioStackItem, StackCategoryType } from '../types';

/**
 * Obtiene el catálogo de tecnologías y entorno desde NestJS API (portfolio.sqlite).
 */
export async function getPortfolioStack(
  locale: string,
  options?: { featured?: boolean; category?: StackCategoryType },
): Promise<PortfolioStackItem[]> {
  const params = new URLSearchParams({ lang: locale });
  if (options?.featured !== undefined) {
    params.set('featured', String(options.featured));
  }
  if (options?.category) {
    params.set('category', options.category);
  }

  const res = await fetch(`${API_URL}/portfolio/stack?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Error al obtener stack del portafolio desde la API (status: ${res.status})`,
    );
  }

  const json = await res.json();
  return (Array.isArray(json) ? json : json.data || []) as PortfolioStackItem[];
}
