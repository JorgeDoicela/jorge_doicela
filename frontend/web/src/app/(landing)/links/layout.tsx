import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Links');

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: 'https://jorgedoicela.com/links',
      languages: {
        'es-EC': 'https://jorgedoicela.com/links?lang=es',
        'en-US': 'https://jorgedoicela.com/links?lang=en',
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: 'https://jorgedoicela.com/links',
      siteName: 'Jorge Doicela',
      type: 'profile',
      images: [
        {
          url: 'https://jorgedoicela.com/landing/logo/logo_fondo_color.png',
          width: 1200,
          height: 630,
          alt: 'Jorge Doicela — Software Developer & AI Engineer',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
      images: ['https://jorgedoicela.com/landing/logo/logo_fondo_color.png'],
    },
  };
}

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
