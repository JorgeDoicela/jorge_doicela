import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  const savedLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const acceptLanguage = headersList.get('accept-language');
  const host = headersList.get('host') || '';

  let locale: Locale = defaultLocale;

  if (savedLocale && locales.includes(savedLocale as Locale)) {
    locale = savedLocale as Locale;
  } else if (acceptLanguage && acceptLanguage.toLowerCase().startsWith('en')) {
    locale = 'en';
  }

  // Resolver subdominio para cargar exclusivamente su diccionario local
  let subdomain = 'landing';
  if (host.includes('portfolio.') || host.startsWith('portfolio')) {
    subdomain = 'portfolio';
  } else if (host.includes('software.') || host.startsWith('software')) {
    subdomain = 'software';
  } else if (host.includes('bible.') || host.startsWith('bible')) {
    subdomain = 'bible';
  }

  let messages: Record<string, any>;
  try {
    messages = (await import(`../app/(${subdomain})/messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../app/(landing)/messages/${locale}.json`)).default;
  }

  return {
    locale,
    messages,
  };
});
