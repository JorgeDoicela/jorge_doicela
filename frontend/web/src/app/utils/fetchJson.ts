/**
 * safeFetchJson
 * Helper de infraestructura frontend para realizar peticiones HTTP defensivas y seguras.
 * Garantiza la inclusión de cabeceras JSON, valida el Content-Type y maneja respuestas
 * HTML inesperadas (como errores 502/404 de Nginx/Next.js) sin romper el motor de React.
 */
export async function safeFetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...(options?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok || !contentType.includes('application/json')) {
    let errorMessage = `Error (${response.status}): ${response.statusText || 'Respuesta no válida del servidor'}`;

    if (contentType.includes('application/json')) {
      try {
        const errorJson = await response.json();
        if (errorJson && errorJson.message) {
          errorMessage = Array.isArray(errorJson.message)
            ? errorJson.message.join(', ')
            : String(errorJson.message);
        }
      } catch {
        // Si falla la decodificación JSON del cuerpo de error, se conserva el mensaje por omisión
      }
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
