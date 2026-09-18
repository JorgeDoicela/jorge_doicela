import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { NewsArticle } from '../../../entities/news';
import type { GlossaryTerm } from '../../../entities/glossary/types';
import { serverGet } from '../../../shared/lib/serverFetch';
import { SoftwareArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const article = await serverGet<NewsArticle>(`/software/news/${slug}?lang=${locale}`);

  if (!article) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
  }

  return {
    title: `${article.title} | ${tNav('news')} — Jorge Doicela`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      authors: [article.author],
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

  const [article, glossary] = await Promise.all([
    serverGet<NewsArticle>(`/software/news/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/software/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
  ]);

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
      author={article.author}
    >
      <MarkdownRenderer content={article.contentMarkdown} glossaryTerms={glossary || []} />
    </SoftwareArticleLayout>
  );
}
