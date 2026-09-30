import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Cybersecurity');

  return {
    title: `${t('title')} | DoicelaDev — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://doiceladev.jorgedoicela.com/cybersecurity',
    },
    openGraph: {
      title: `${t('title')} | DoicelaDev — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://doiceladev.jorgedoicela.com/cybersecurity',
    },
  };
}

export default function CybersecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
