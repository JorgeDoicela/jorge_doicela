import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { NewsArticle } from '../../../features/news/types';
import { serverGet } from '../../../utils/serverFetch';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const article = await serverGet<NewsArticle>(`/software/news/${slug}?lang=${locale}`);

  if (!article) {
    return { title: 'Noticia no encontrada | Software — Jorge Doicela' };
  }

  return {
    title: `${article.title} | Noticias — Jorge Doicela`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      authors: [article.author || 'Jorge Doicela'],
      ...(article.coverImage ? { images: [{ url: article.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/news/${slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const article = await serverGet<NewsArticle>(`/software/news/${slug}?lang=${locale}`);

  if (!article) notFound();

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="news"
      categoryLabel={tNav('news')}
      categoryHref="/news"
      title={article.title}
      subtitle={article.excerpt}
      date={formattedDate}
      author={article.author || 'Jorge Doicela'}
    >
      <MarkdownRenderer content={article.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
