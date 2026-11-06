import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverGet } from '../../../shared/lib/serverFetch';
import { DoiceladevPageLayout } from '../../../widgets/page-layout';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';
import type { CategoryArticlesResponse, CategoryArticleItem } from '../../../entities/categories/types';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('CategoriesHub');

  const res = await serverGet<CategoryArticlesResponse>(
    `/doiceladev/categories/${encodeURIComponent(slug)}?lang=${locale}`,
  ).catch(() => null);

  if (!res || !res.category) {
    return { title: `Categoría | DoicelaDev — Jorge Doicela` };
  }

  return {
    title: `${res.category.label} | ${t('allCategories')} — DoicelaDev`,
    description: t('hubSubtitle', { category: res.category.label }),
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/categories/${slug}`,
    },
  };
}

export default async function CategoryHubPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('CategoriesHub');
  const tNav = await getTranslations('Nav');

  const res = await serverGet<CategoryArticlesResponse>(
    `/doiceladev/categories/${encodeURIComponent(slug)}?lang=${locale}&limit=50`,
  ).catch(() => null);

  if (!res || !res.category) {
    notFound();
  }

  const { category, articles } = res;

  return (
    <DoiceladevPageLayout
      activeCategory="categories"
      backHref="/categories"
      backLabel="← Categorías"
    >
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-concave-panel text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            <span>{tNav('all')}</span>
            <span>•</span>
            <span>{category.label}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {category.label}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal dark:font-light leading-relaxed">
            {t('hubSubtitle', { category: category.label })}
          </p>

          <div className="pt-1">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold glass-concave-panel text-slate-700 dark:text-zinc-300">
              {t('articlesCount', { count: category.totalCount })}
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
              {articles.map((item: CategoryArticleItem) => (
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
