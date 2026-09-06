import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE DE ENRUTAMIENTO POR SUBDOMINIO
//
// Por qué existe este archivo:
//   El servidor consolidado (1 GB RAM) aloja 4 proyectos en un único proceso
//   Next.js (puerto 3001). Este middleware detecta el subdominio del host y
//   reescribe la URL internamente hacia el grupo de rutas correspondiente
//   (route groups: (landing), (portfolio), (software), (bible)).
//
// GUÍA DE MIGRACIÓN POR PROYECTO:
//   Al mover un proyecto a su propio servidor Next.js independiente,
//   simplemente remover su clave de SUBDOMAIN_TARGET_MAP.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tabla declarativa de enrutamiento por subdominio (Open/Closed Principle de SOLID).
 * Subdominio -> Prefijo canónico de ruta interna
 */
const SUBDOMAIN_TARGET_MAP: Record<string, string> = {
    portfolio: '/portfolio',
    bible: '/bible',
    software: '/software',
};

/**
 * Normaliza y resuelve la ruta canónica interna para un subdominio específico.
 * Es inmune a trailing slashes, rutas vacías y prefijos duplicados (RFC 3986).
 *
 * Ejemplos con targetPrefix = '/portfolio':
 *   '/'          -> '/portfolio'
 *   '//'         -> '/portfolio'
 *   '/sandbox'   -> '/portfolio/sandbox'
 *   '/sandbox/'  -> '/portfolio/sandbox'
 *   '/portfolio' -> '/portfolio'
 */
function resolveSubdomainPath(targetPrefix: string, pathname: string): string {
    const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
    const prefixWithoutSlash = targetPrefix.replace(/^\/+/, '');

    // Si la ruta ya incluye el prefijo del subdominio, no duplicarlo
    if (cleanPath === prefixWithoutSlash || cleanPath.startsWith(`${prefixWithoutSlash}/`)) {
        return `/${cleanPath}`;
    }

    return cleanPath.length > 0 ? `${targetPrefix}/${cleanPath}` : targetPrefix;
}

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const host = request.headers.get('host') || '';

    // Excluir llamadas internas de Next.js, APIs y archivos con extensión (imágenes, fuentes, etc.)
    if (
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/api') ||
        url.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Obtener el nombre del host en minúsculas y sin el puerto
    const hostname = host.split(':')[0].toLowerCase();

    // Comprobar si viene el query param ?lang= para sincronizar cookie
    const langParam = url.searchParams.get('lang');
    let response: NextResponse | null = null;

    // ── RESOLUCIÓN DECLARATIVA DE SUBDOMINIO ──────────────────────────────────
    const matchedSubdomain = Object.keys(SUBDOMAIN_TARGET_MAP).find((sub) =>
        hostname.startsWith(`${sub}.`),
    );

    if (matchedSubdomain) {
        const targetPrefix = SUBDOMAIN_TARGET_MAP[matchedSubdomain];
        const resolvedPath = resolveSubdomainPath(targetPrefix, url.pathname);

        if (url.pathname !== resolvedPath) {
            url.pathname = resolvedPath;
            response = NextResponse.rewrite(url);
        }
    }

    // ── LANDING / FALLBACK ───────────────────────────────────────────────────
    // (jorgedoicela.com) — No requiere rewrite; es la ruta raíz por defecto.
    if (!response) {
        response = NextResponse.next();
    }

    // Sincronizar cookie de idioma si viene el param ?lang=
    if (langParam === 'es' || langParam === 'en') {
        response.cookies.set('NEXT_LOCALE', langParam, {
            path: '/',
            maxAge: 31536000,
            sameSite: 'lax',
        });
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match todo excepto:
         * - api (rutas de la API)
         * - _next/static (archivos estáticos compilados)
         * - _next/image (optimización de imágenes)
         * - favicon.ico (icono de la pestaña)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
