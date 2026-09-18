import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { InfrastructurePost } from '../../../entities/infrastructure';
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
  const post = await serverGet<InfrastructurePost>(`/software/infrastructure/${slug}?lang=${locale}`);

  if (!post) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
  }

  return {
    title: `${post.title} | ${tNav('infrastructure')} — Jorge Doicela`,
    description: post.subtitle || post.title,
    openGraph: {
      title: post.title,
      description: post.subtitle || post.title,
      type: 'article',
      authors: [post.author],
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/infrastructure/${slug}`,
    },
  };
}

export default async function InfrastructureDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const [post, glossary] = await Promise.all([
    serverGet<InfrastructurePost>(`/software/infrastructure/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/software/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
  ]);

  if (!post) notFound();

  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="infrastructure"
      categoryLabel={tNav('infrastructure')}
      categoryHref="/infrastructure"
      title={post.title}
      subtitle={post.subtitle}
      date={formattedDate}
      author={post.author}
    >
      <MarkdownRenderer content={post.contentMarkdown} glossaryTerms={glossary || []} />
    </SoftwareArticleLayout>
  );
}
