import { API_URL } from '../../../shared';
import type { PortfolioProfileData } from '../types';

/**
 * Obtiene el perfil biográfico y filosofía de ingeniería desde NestJS API (portfolio.sqlite).
 */
export async function getPortfolioProfile(
  locale: string,
): Promise<PortfolioProfileData> {
  const params = new URLSearchParams({ lang: locale });
  const res = await fetch(`${API_URL}/portfolio/profile?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Error al obtener perfil del portafolio desde la API (status: ${res.status})`,
    );
  }

  const json = await res.json();
  return (json.data ?? json) as PortfolioProfileData;
}
