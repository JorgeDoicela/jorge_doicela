/**
 * serverFetch
 * Utilidad de infraestructura exclusiva para Server Components del dominio Software.
 * Se ejecuta en el servidor de Next.js y se comunica directamente con el backend NestJS.
 * No depende de window ni de variables de entorno del cliente.
 */

const getBackendUrl = (): string => {
  const rawUrl =
    process.env.INTERNAL_API_URL ||
    (process.env.NODE_ENV === 'production' && process.env.BACKEND_URL
      ? process.env.BACKEND_URL
      : 'http://127.0.0.1:3000');

  const clean = rawUrl.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const BACKEND_URL = getBackendUrl();

/**
 * Realiza una petición GET al backend NestJS desde el servidor.
 * Devuelve null si el recurso no existe (404) o en caso de error de red.
 */
export async function serverGet<T>(path: string): Promise<T | null> {
  const url = `${BACKEND_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      // Next.js cache: no-store para datos dinámicos editoriales
      cache: 'no-store',
    });

    if (res.status === 404) return null;

    if (!res.ok) {
      console.error(`[serverFetch] Error ${res.status} en ${url}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error(`[serverFetch] Respuesta no-JSON de ${url}`);
      return null;
    }

    const json = (await res.json()) as { data?: T } | T;
    // Normaliza la respuesta: acepta tanto { data: T } como T directamente
    return (json as { data?: T }).data ?? (json as T);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[serverFetch] Error de red en ${url}: ${msg}`);
    return null;
  }
}
