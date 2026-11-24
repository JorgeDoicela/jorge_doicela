import { API_URL, normalizeStringArray } from '../../../shared';
import type { PortfolioProject } from '../types';

interface RawProjectApiItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  role: string;
  technologies: string[] | string;
  language: string;
  repoUrl?: string;
  demoUrl?: string;
  featured: boolean;
  overview?: string;
  challenge?: string;
  architectureHighlights?: string[];
  metrics?: { label: string; value: string }[];
  media?: { type: 'image' | 'video'; url: string; caption?: string }[];
}

/**
 * Obtiene el catálogo de proyectos del portafolio desde NestJS API (portfolio.sqlite).
 */
export async function getPortfolioProjects(
  locale: string,
  options?: { featured?: boolean },
): Promise<PortfolioProject[]> {
  const params = new URLSearchParams({ lang: locale });
  if (options?.featured !== undefined) {
    params.set('featured', String(options.featured));
  }

  const res = await fetch(`${API_URL}/portfolio/projects?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Error al obtener proyectos del portafolio desde la API (status: ${res.status})`,
    );
  }

  const json = await res.json();
  const rawProjects: RawProjectApiItem[] = Array.isArray(json) ? json : json.data || [];

  return rawProjects.map((p) => ({
    ...p,
    technologies: normalizeStringArray(p.technologies),
  }));
}
