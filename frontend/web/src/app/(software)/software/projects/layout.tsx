import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Projects');

  return {
    title: `${t('title')} | Software — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://software.jorgedoicela.com/projects',
    },
    openGraph: {
      title: `${t('title')} | Software — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://software.jorgedoicela.com/projects',
    },
  };
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
