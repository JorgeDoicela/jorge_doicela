import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { SecurityPost } from '../../../entities/cybersecurity';
import { serverGet } from '../../../shared/lib/serverFetch';
import { SoftwareArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const post = await serverGet<SecurityPost>(`/software/cybersecurity/${slug}?lang=${locale}`);

  if (!post) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
  }

  const severityLabel = post.cveId ? `[${post.cveId}] ` : '';
  return {
    title: `${severityLabel}${post.title} | ${tNav('cybersecurity')} — Jorge Doicela`,
    description: post.excerpt,
    openGraph: {
      title: `${severityLabel}${post.title}`,
      description: post.excerpt,
      type: 'article',
      authors: [post.author || 'Jorge Doicela'],
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/cybersecurity/${slug}`,
    },
  };
}

export default async function CybersecurityDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const post = await serverGet<SecurityPost>(`/software/cybersecurity/${slug}?lang=${locale}`);

  if (!post) notFound();

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="cybersecurity"
      categoryLabel={tNav('cybersecurity')}
      categoryHref="/cybersecurity"
      title={post.title}
      subtitle={post.excerpt}
      date={formattedDate}
      author={post.author || 'Jorge Doicela'}
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
