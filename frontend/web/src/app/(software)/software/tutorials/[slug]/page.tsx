import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Tutorial } from '../../../features/tutorials/types';
import { serverGet } from '../../../utils/serverFetch';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tutorial = await serverGet<Tutorial>(`/software/tutorials/${slug}?lang=${locale}`);

  if (!tutorial) {
    return { title: 'Tutorial no encontrado | Software — Jorge Doicela' };
  }

  return {
    title: `${tutorial.title} | Tutoriales — Jorge Doicela`,
    description: tutorial.excerpt,
    openGraph: {
      title: tutorial.title,
      description: tutorial.excerpt,
      type: 'article',
      authors: [tutorial.author || 'Jorge Doicela'],
      ...(tutorial.coverImage ? { images: [{ url: tutorial.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/tutorials/${slug}`,
    },
  };
}

export default async function TutorialDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const tutorial = await serverGet<Tutorial>(`/software/tutorials/${slug}?lang=${locale}`);

  if (!tutorial) notFound();

  const formattedDate = new Date(tutorial.publishedAt || tutorial.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="tutorials"
      categoryLabel={tNav('tutorials')}
      categoryHref="/tutorials"
      title={tutorial.title}
      subtitle={tutorial.excerpt}
      date={formattedDate}
      author={tutorial.author || 'Jorge Doicela'}
    >
      <MarkdownRenderer content={tutorial.description} />
    </SoftwareArticleLayout>
  );
}
