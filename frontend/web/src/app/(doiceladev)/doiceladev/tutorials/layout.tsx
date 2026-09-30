import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Tutorials');

  return {
    title: `${t('title')} | DoicelaDev — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://doiceladev.jorgedoicela.com/tutorials',
    },
    openGraph: {
      title: `${t('title')} | DoicelaDev — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://doiceladev.jorgedoicela.com/tutorials',
    },
  };
}

export default function TutorialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
