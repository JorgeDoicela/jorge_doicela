import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverGet } from '../../../shared/lib/serverFetch';
import { DoiceladevPageLayout } from '../../../widgets/page-layout';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';
import type {
  CategoryArticlesResponse,
  CategoryArticleItem,
} from '../../../entities/categories/types';

type Params = { params: Promise<{ slug: string }> };

function resolveCategoryLabel(
  slug: string,
  tFilters: Awaited<ReturnType<typeof getTranslations<'Filters'>>>,
  allLabel: string,
): string {
  const key = slug.trim().toLowerCase();
  if (key === 'all') return allLabel;
  if (tFilters.has(key as never)) {
    return tFilters(key as never);
  }
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // Mantener slug original si el encoding es inválido
  }
  const locale = await getLocale();
  const [t, tFilters, tCommon, res] = await Promise.all([
    getTranslations('CategoriesDirectory'),
    getTranslations('Filters'),
    getTranslations('Common'),
    serverGet<CategoryArticlesResponse>(
      `/doiceladev/categories/${encodeURIComponent(decodedSlug)}?lang=${locale}`,
    ).catch(() => null),
  ]);

  if (!res || !res.category) {
    return { title: `${tCommon('notFound')} | DoicelaDev — Jorge Doicela` };
  }

  const label = resolveCategoryLabel(
    res.category.slug,
    tFilters,
    t('allCategories'),
  );

  const title = `${label} | ${t('allCategories')} — DoicelaDev`;
  const description = t('detailSubtitle', { category: label });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/categories/${res.category.slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: Params) {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // Mantener slug original si el encoding es inválido
  }
  const locale = await getLocale();
  const [t, tNav, tFilters, tLayout, res] = await Promise.all([
    getTranslations('CategoriesDirectory'),
    getTranslations('Nav'),
    getTranslations('Filters'),
    getTranslations('ArticleLayout'),
    serverGet<CategoryArticlesResponse>(
      `/doiceladev/categories/${encodeURIComponent(decodedSlug)}?lang=${locale}&limit=50`,
    ).catch(() => null),
  ]);

  if (!res || !res.category) {
    notFound();
  }

  const { category, articles } = res;
  const displayLabel = resolveCategoryLabel(
    category.slug,
    tFilters,
    t('allCategories'),
  );

  return (
    <DoiceladevPageLayout
      activeCategory="categories"
      backHref="/categories"
      backLabel={tNav('categories')}
    >
      <div className="p-6 sm:p-10 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 shadow-2xl space-y-8">
        <header className="text-center space-y-4">
          <nav
            aria-label={tLayout('breadcrumb')}
            className="inline-flex items-center gap-1.5 font-sans font-medium text-slate-500 dark:text-zinc-400 text-xs sm:text-sm select-none"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-500 dark:text-zinc-400 hover:text-[var(--foreground)] transition-colors py-0.5 rounded focus:outline-none"
              title={tNav('home')}
            >
              <Home
                className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500"
                aria-hidden="true"
              />
              <span>{tNav('home')}</span>
            </Link>

            <ChevronRight
              className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 shrink-0"
              aria-hidden="true"
            />

            <Link
              href="/categories"
              className="text-slate-500 dark:text-zinc-400 hover:text-[var(--foreground)] font-medium transition-colors py-0.5"
            >
              {tNav('categories')}
            </Link>

            <ChevronRight
              className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 shrink-0"
              aria-hidden="true"
            />
          </nav>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--header-title)]">
            {displayLabel}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-3xl mx-auto font-normal dark:font-light leading-relaxed">
            {t('detailSubtitle', { category: displayLabel })}
          </p>
        </header>

        <main>
          {articles.length === 0 ? (
            <div className="py-20 text-center text-slate-500 dark:text-zinc-400 font-mono text-sm">
              {t('noArticles')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((item: CategoryArticleItem, idx: number) => (
                <div key={item.id} className="h-full">
                  <DoiceladevCard
                    href={item.href}
                    title={item.title}
                    category={item.category}
                    coverImage={item.coverImage}
                    categoryMeta={item.categoryMeta}
                    excerpt={item.excerpt}
                    priority={idx < 3}
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
