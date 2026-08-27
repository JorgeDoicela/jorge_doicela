import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // Comprobar si viene el query param ?lang= para sincronizar cookie
  const langParam = url.searchParams.get('lang');
  let response: NextResponse | null = null;

  // Obtener el nombre del host en minúsculas y sin el puerto
  const hostname = host.split(':')[0].toLowerCase();

  // Redirección interna para el subdominio 'portfolio'
  if (hostname.startsWith('portfolio.')) {
    if (!url.pathname.startsWith('/portfolio')) {
      url.pathname = `/portfolio${url.pathname}`;
      response = NextResponse.rewrite(url);
    }
  } else if (hostname.startsWith('bible.')) {
    // Redirección interna para el subdominio 'bible'
    if (!url.pathname.startsWith('/bible')) {
      url.pathname = `/bible${url.pathname}`;
      response = NextResponse.rewrite(url);
    }
  } else if (hostname.startsWith('software.')) {
    // Redirección interna para el subdominio 'software'
    if (!url.pathname.startsWith('/software')) {
      url.pathname = `/software${url.pathname}`;
      response = NextResponse.rewrite(url);
    }
  }

  if (!response) {
    response = NextResponse.next();
  }

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

