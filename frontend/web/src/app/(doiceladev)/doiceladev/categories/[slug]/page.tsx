import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
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
      backLabel={tNav('categories')}
    >
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4">
          {/* Miga de Pan (Breadcrumb) Adaptada */}
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-1.5 font-sans font-medium text-slate-500 dark:text-zinc-400 text-xs sm:text-sm select-none"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors py-0.5 rounded focus:outline-none"
              title={tNav('home')}
            >
              <Home className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" aria-hidden="true" />
              <span>{tNav('home')}</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 shrink-0" aria-hidden="true" />

            <Link
              href="/categories"
              className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold transition-colors py-0.5"
            >
              {tNav('categories')}
            </Link>
          </nav>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {category.label}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal dark:font-light leading-relaxed">
            {t('hubSubtitle', { category: category.label })}
          </p>
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
