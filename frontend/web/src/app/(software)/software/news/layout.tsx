import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('News');

  return {
    title: `${t('title')} | Software — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://software.jorgedoicela.com/news',
    },
    openGraph: {
      title: `${t('title')} | Software — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://software.jorgedoicela.com/news',
    },
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
