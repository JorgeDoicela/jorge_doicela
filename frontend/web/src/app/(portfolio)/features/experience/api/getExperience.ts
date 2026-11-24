import { API_URL, normalizeStringArray } from '../../../shared';
import type { PortfolioExperienceItem } from '../types';

/**
 * Obtiene la trayectoria laboral y formación académica desde NestJS API (portfolio.sqlite).
 */
export async function getPortfolioExperience(
  locale: string,
  options?: { featured?: boolean },
): Promise<PortfolioExperienceItem[]> {
  const params = new URLSearchParams({ lang: locale });
  if (options?.featured !== undefined) {
    params.set('featured', String(options.featured));
  }

  const res = await fetch(`${API_URL}/portfolio/experience?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Error al obtener experiencia del portafolio desde la API (status: ${res.status})`,
    );
  }

  const json = await res.json();
  const rawItems: PortfolioExperienceItem[] = Array.isArray(json) ? json : json.data || [];

  return rawItems.map((item) => ({
    ...item,
    highlights: item.highlights ? normalizeStringArray(item.highlights) : undefined,
    technologies: item.technologies ? normalizeStringArray(item.technologies) : undefined,
  }));
}
