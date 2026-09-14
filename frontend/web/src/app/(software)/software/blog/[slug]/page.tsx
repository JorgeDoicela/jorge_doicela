import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { BlogPost } from '../../../features/blog/types';
import { serverGet } from '../../../utils/serverFetch';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await serverGet<BlogPost>(`/software/blog/${slug}?lang=${locale}`);

  if (!post) {
    return { title: 'Artículo no encontrado | Software — Jorge Doicela' };
  }

  return {
    title: `${post.title} | Blog — Jorge Doicela`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      authors: [post.author || 'Jorge Doicela'],
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tBlog = await getTranslations('Blog');

  const post = await serverGet<BlogPost>(`/software/blog/${slug}?lang=${locale}`);

  if (!post) notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="blog"
      categoryLabel={tNav('blog')}
      categoryHref="/blog"
      title={post.title}
      subtitle={post.subtitle || post.excerpt}
      date={formattedDate}
      author={post.author || 'Jorge Doicela'}
    >
      <MarkdownRenderer content={post.contentMarkdown} />
    </SoftwareArticleLayout>
  );
}
