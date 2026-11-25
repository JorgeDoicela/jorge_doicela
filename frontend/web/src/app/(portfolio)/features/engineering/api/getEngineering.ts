import { API_URL, normalizeStringArray } from '../../../shared';
import type {
  EngineeringDomainType,
  PortfolioEngineeringPillar,
} from '../types';

/**
 * Obtiene los pilares de ingeniería, arquitectura, seguridad e IA desde NestJS API (portfolio.sqlite).
 */
export async function getPortfolioEngineering(
  locale: string,
  options?: { featured?: boolean; domain?: EngineeringDomainType },
): Promise<PortfolioEngineeringPillar[]> {
  const params = new URLSearchParams({ lang: locale });
  if (options?.featured !== undefined) {
    params.set('featured', String(options.featured));
  }
  if (options?.domain) {
    params.set('domain', options.domain);
  }

  const res = await fetch(
    `${API_URL}/portfolio/engineering?${params.toString()}`,
    { next: { revalidate: 60 } },
  );

  if (!res.ok) {
    throw new Error(
      `Error al obtener pilares de ingeniería desde la API (status: ${res.status})`,
    );
  }

  const json = await res.json();
  const rawItems: PortfolioEngineeringPillar[] = Array.isArray(json)
    ? json
    : json.data || [];

  return rawItems.map((item) => ({
    ...item,
    details: item.details ? normalizeStringArray(item.details) : undefined,
    technologies: item.technologies
      ? normalizeStringArray(item.technologies)
      : undefined,
  }));
}
