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

  // Obtener el nombre del host en minúsculas y sin el puerto
  const hostname = host.split(':')[0].toLowerCase();

  // Redirección interna para el subdominio 'portfolio'
  if (hostname.startsWith('portfolio.')) {
    if (!url.pathname.startsWith('/portfolio')) {
      url.pathname = `/portfolio${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Redirección interna para el subdominio 'bible'
  if (hostname.startsWith('bible.')) {
    if (!url.pathname.startsWith('/bible')) {
      url.pathname = `/bible${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Redirección interna para el subdominio 'software'
  if (hostname.startsWith('software.')) {
    if (!url.pathname.startsWith('/software')) {
      url.pathname = `/software${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Por defecto (landing page principal jorgedoicela.com), se sirve la raíz
  return NextResponse.next();
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
