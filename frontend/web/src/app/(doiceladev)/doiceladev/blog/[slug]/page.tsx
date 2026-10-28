import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BlogPost } from '../../../entities/blog';
import type { GlossaryTerm } from '../../../entities/glossary/types';
import type { RecommendationCard } from '../../../entities/portal/types';
import { serverGet } from '../../../shared/lib/serverFetch';
import { DoiceladevArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const post = await serverGet<BlogPost>(`/doiceladev/blog/${slug}?lang=${locale}`);

  if (!post) {
    return { title: `${tCommon('notFound')} | DoicelaDev — Jorge Doicela` };
  }

  return {
    title: `${post.title} | ${tNav('blog')} — Jorge Doicela`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author],
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');

  const cookieStore = await cookies();
  const readHistory = cookieStore.get('doicela_read_history')?.value || '';

  const [post, glossary, recommendations] = await Promise.all([
    serverGet<BlogPost>(`/doiceladev/blog/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/doiceladev/glossary?lang=${locale}`).catch(() => [] as GlossaryTerm[]),
    serverGet<RecommendationCard[]>(
      `/doiceladev/recommendations?module=blog&slug=${slug}&lang=${locale}${
        readHistory ? `&exclude=${encodeURIComponent(readHistory)}` : ''
      }`,
    ).catch(() => [] as RecommendationCard[]),
  ]);

  if (!post) notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <DoiceladevArticleLayout
      slug={slug}
      category="blog"
      categoryLabel={tNav('blog')}
      categoryHref="/blog"
      title={post.title}
      subtitle={post.subtitle || post.excerpt}
      date={formattedDate}
      author={post.author}
      tags={post.tags}
      recommendations={recommendations || []}
    >
      <MarkdownRenderer content={post.contentMarkdown} glossaryTerms={glossary || []} />
    </DoiceladevArticleLayout>
  );
}
