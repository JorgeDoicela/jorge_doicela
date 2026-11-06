import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverGet } from '../../../shared/lib/serverFetch';
import { DoiceladevPageLayout } from '../../../widgets/page-layout';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';
import type { TagArticlesResponse, TagArticleItem } from '../../../entities/tags/types';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('TagsHub');

  const res = await serverGet<TagArticlesResponse>(
    `/doiceladev/tags/${encodeURIComponent(slug)}?lang=${locale}`,
  ).catch(() => null);

  const label = res?.tag?.label || slug;

  return {
    title: `#${label} | ${t('allTags')} — DoicelaDev`,
    description: t('hubSubtitle', { tag: label }),
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/tags/${slug}`,
    },
  };
}

export default async function TagHubPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('TagsHub');
  const tNav = await getTranslations('Nav');

  const res = await serverGet<TagArticlesResponse>(
    `/doiceladev/tags/${encodeURIComponent(slug)}?lang=${locale}&limit=50`,
  ).catch(() => null);

  if (!res || !res.tag) {
    notFound();
  }

  const { tag, articles } = res;

  return (
    <DoiceladevPageLayout
      activeCategory="tags"
      backHref="/tags"
      backLabel="← Etiquetas"
    >
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-concave-panel text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <span>{tNav('all')}</span>
            <span>•</span>
            <span>#{tag.label}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            #{tag.label}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal dark:font-light leading-relaxed">
            {t('hubSubtitle', { tag: tag.label })}
          </p>

          <div className="pt-1">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold glass-concave-panel text-slate-700 dark:text-zinc-300">
              {t('articlesCount', { count: tag.totalCount })}
            </span>
          </div>
        </header>

        <main>
          {articles.length === 0 ? (
            <div className="py-20 text-center text-slate-500 dark:text-zinc-400 font-mono text-sm">
              {t('noArticles')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((item: TagArticleItem) => (
                <div key={item.id} className="h-full">
                  <DoiceladevCard
                    href={item.href}
                    title={item.title}
                    category={item.category}
                    coverImage={item.coverImage}
                    categoryMeta={item.categoryMeta}
                    excerpt={item.excerpt}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </DoiceladevPageLayout>
  );
}
