import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Blog');

  return {
    title: `${t('title')} | Software — Jorge Doicela`,
    description: t('subtitle'),
    alternates: {
      canonical: 'https://software.jorgedoicela.com/blog',
    },
    openGraph: {
      title: `${t('title')} | Software — Jorge Doicela`,
      description: t('subtitle'),
      url: 'https://software.jorgedoicela.com/blog',
    },
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
