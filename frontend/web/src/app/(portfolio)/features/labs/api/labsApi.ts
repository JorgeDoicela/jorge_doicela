import { API_URL, getApiUrl } from '../../../shared';
import type { PortfolioLabChallenge, VerifyFlagResponse } from '../types';

/**
 * Obtiene los retos CTF/laboratorio activos desde NestJS API (sin hashes de flags).
 */
export async function getPortfolioLabs(
  locale: string,
): Promise<PortfolioLabChallenge[]> {
  const params = new URLSearchParams({ lang: locale });
  const res = await fetch(`${API_URL}/portfolio/labs?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(
      `Error al obtener retos CTF desde la API (status: ${res.status})`,
    );
  }

  const json = await res.json();
  return (Array.isArray(json) ? json : json.data || []) as PortfolioLabChallenge[];
}

/**
 * Valida una flag enviada por el usuario en el servidor (SHA-256 en tiempo constante).
 */
export async function verifyLabFlag(
  slug: string,
  flag: string,
): Promise<VerifyFlagResponse> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/portfolio/labs/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, flag: flag.trim() }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    throw new Error(errBody?.message || `HTTP ${res.status}`);
  }

  const json = await res.json();
  return (json.data ?? json) as VerifyFlagResponse;
}
