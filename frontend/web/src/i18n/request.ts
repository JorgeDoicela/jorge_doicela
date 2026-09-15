import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

/**
 * Carga determinista y estática de diccionarios por proyecto e idioma.
 * Evita imports dinámicos con plantillas de strings `../app/(${subdomain})/messages/${locale}.json`
 * que fallan en Turbopack y Next.js Standalone al compilar en producción.
 */
async function loadProjectMessages(project: string, locale: Locale): Promise<Record<string, any>> {
  try {
    switch (project) {
      case 'portfolio':
        return locale === 'en'
          ? (await import('../app/(portfolio)/messages/en.json')).default
          : (await import('../app/(portfolio)/messages/es.json')).default;

      case 'software':
        return locale === 'en'
          ? (await import('../app/(software)/messages/en.json')).default
          : (await import('../app/(software)/messages/es.json')).default;

      case 'bible':
        return locale === 'en'
          ? (await import('../app/(bible)/messages/en.json')).default
          : (await import('../app/(bible)/messages/es.json')).default;

      case 'landing':
      default:
        return locale === 'en'
          ? (await import('../app/(landing)/messages/en.json')).default
          : (await import('../app/(landing)/messages/es.json')).default;
    }
  } catch (error) {
    console.error(`[i18n] Error crítico al cargar diccionario para [${project}] (${locale}):`, error);
    // Fallback garantizado a los mensajes de la Landing
    return locale === 'en'
      ? (await import('../app/(landing)/messages/en.json')).default
      : (await import('../app/(landing)/messages/es.json')).default;
  }
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const acceptLanguage = headersList.get('accept-language');
  const host = headersList.get('host') || '';

  let locale: Locale = defaultLocale;

  if (savedLocale && locales.includes(savedLocale as Locale)) {
    locale = savedLocale as Locale;
  } else if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((item) => item.split(';')[0].trim().toLowerCase());
    
    const enIndex = languages.findIndex((l) => l.startsWith('en'));
    const esIndex = languages.findIndex((l) => l.startsWith('es'));

    if (enIndex !== -1 && (esIndex === -1 || enIndex < esIndex)) {
      locale = 'en';
    }
  }

  // Resolver subdominio para cargar exclusivamente su diccionario local
  const projectHeader = headersList.get('x-project');
  let subdomain = projectHeader || 'landing';

  if (!projectHeader) {
    const normalizedHost = host.toLowerCase();
    if (normalizedHost.includes('portfolio.') || normalizedHost.startsWith('portfolio')) {
      subdomain = 'portfolio';
    } else if (normalizedHost.includes('software.') || normalizedHost.startsWith('software')) {
      subdomain = 'software';
    } else if (normalizedHost.includes('bible.') || normalizedHost.startsWith('bible')) {
      subdomain = 'bible';
    }
  }

  const messages = await loadProjectMessages(subdomain, locale);

  return {
    locale,
    messages,
  };
});
