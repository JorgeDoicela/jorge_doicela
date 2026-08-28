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
//   ELIMINAR el bloque correspondiente de este middleware y en el nuevo
//   servidor usar un middleware.ts mínimo o eliminarlo completamente.
//
//   ┌─────────────────────────────────────────────────────────────┐
//   │  Al extraer PORTFOLIO: eliminar el bloque "PORTFOLIO" (L28) │
//   │  Al extraer BIBLE:     eliminar el bloque "BIBLE"     (L36) │
//   │  Al extraer SOFTWARE:  eliminar el bloque "SOFTWARE"  (L44) │
//   └─────────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

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

    // ── PORTFOLIO ─────────────────────────────────────────────────────────────
    // Al migrar portfolio a servidor propio: eliminar este bloque completo.
    // El nuevo servidor Next.js servirá directamente src/app/(portfolio)/.
    if (hostname.startsWith('portfolio.')) {
        if (!url.pathname.startsWith('/portfolio')) {
            url.pathname = `/portfolio${url.pathname}`;
            response = NextResponse.rewrite(url);
        }

    // ── BIBLE ─────────────────────────────────────────────────────────────────
    // Al migrar bible a servidor propio: eliminar este bloque completo.
    // El nuevo servidor Next.js servirá directamente src/app/(bible)/.
    } else if (hostname.startsWith('bible.')) {
        if (!url.pathname.startsWith('/bible')) {
            url.pathname = `/bible${url.pathname}`;
            response = NextResponse.rewrite(url);
        }

    // ── SOFTWARE ──────────────────────────────────────────────────────────────
    // Al migrar software a servidor propio: eliminar este bloque completo.
    // El nuevo servidor Next.js servirá directamente src/app/(software)/.
    } else if (hostname.startsWith('software.')) {
        if (!url.pathname.startsWith('/software')) {
            url.pathname = `/software${url.pathname}`;
            response = NextResponse.rewrite(url);
        }
    }

    // ── LANDING ───────────────────────────────────────────────────────────────
    // (jorgedoicela.com) — No requiere rewrite; es la ruta raíz por defecto.
    // Al migrar el resto de proyectos, este queda como el único servidor.

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
