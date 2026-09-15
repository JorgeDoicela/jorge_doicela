import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Forum');

  return {
    title: `${t('title')} | Software — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://software.jorgedoicela.com/forum',
    },
    openGraph: {
      title: `${t('title')} | Software — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://software.jorgedoicela.com/forum',
    },
  };
}

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
