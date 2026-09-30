import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Projects');

  return {
    title: `${t('title')} | DoicelaDev — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://doiceladev.jorgedoicela.com/projects',
    },
    openGraph: {
      title: `${t('title')} | DoicelaDev — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://doiceladev.jorgedoicela.com/projects',
    },
  };
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
