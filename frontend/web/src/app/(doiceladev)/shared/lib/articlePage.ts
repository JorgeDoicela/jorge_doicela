import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { serverGet } from './serverFetch';
import { stripMarkdown } from './stripMarkdown';
import type { GlossaryTerm } from '../types/glossary';
import type { RecommendationCard } from '../types/recommendation';

export interface BaseArticleRecord {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormattedArticleDates {
  formattedPublishedDate?: string;
  publishedAtIso?: string;
  formattedUpdatedDate?: string;
  updatedAtIso?: string;
}

export function formatArticleDates(
  publishedAt: string | undefined,
  createdAt: string | undefined,
  updatedAt: string | undefined,
  locale: string,
): FormattedArticleDates {
  const pubRaw = publishedAt || createdAt;
  const updRaw = updatedAt;
  const dateLocale = locale === 'es' ? 'es-ES' : 'en-US';
  const formatOpts: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const formattedPublishedDate = pubRaw
    ? new Date(pubRaw).toLocaleDateString(dateLocale, formatOpts)
    : undefined;

  const isMeaningfullyUpdated = Boolean(
    pubRaw &&
      updRaw &&
      new Date(updRaw).getTime() - new Date(pubRaw).getTime() >
        24 * 60 * 60 * 1000,
  );

  const formattedUpdatedDate =
    isMeaningfullyUpdated && updRaw
      ? new Date(updRaw).toLocaleDateString(dateLocale, formatOpts)
      : undefined;

  return {
    formattedPublishedDate,
    publishedAtIso: pubRaw ? new Date(pubRaw).toISOString() : undefined,
    formattedUpdatedDate,
    updatedAtIso:
      isMeaningfullyUpdated && updRaw
        ? new Date(updRaw).toISOString()
        : undefined,
  };
}

export function buildArticleMetadata(params: {
  record: BaseArticleRecord | null;
  modulePath: string;
  moduleLabel: string;
  notFoundLabel: string;
  slug: string;
}): Metadata {
  const { record, modulePath, moduleLabel, notFoundLabel, slug } = params;

  if (!record) {
    return { title: `${notFoundLabel} | DoicelaDev — Jorge Doicela` };
  }

  const cleanDescription = stripMarkdown(record.excerpt);

  return {
    title: `${record.title} | ${moduleLabel} — Jorge Doicela`,
    description: cleanDescription,
    openGraph: {
      title: record.title,
      description: cleanDescription,
      type: 'article',
      publishedTime: record.publishedAt || record.createdAt,
      ...(record.updatedAt ? { modifiedTime: record.updatedAt } : {}),
      authors: [record.author],
      ...(record.coverImage ? { images: [{ url: record.coverImage }] } : {}),
    },
    alternates: {
      canonical: `https://doiceladev.jorgedoicela.com/${modulePath}/${slug}`,
    },
  };
}

export async function fetchArticlePageContext<T>(
  module: string,
  slug: string,
  locale: string,
): Promise<{
  item: T | null;
  glossary: GlossaryTerm[];
  recommendations: RecommendationCard[];
}> {
  const cookieStore = await cookies();
  const readHistory = cookieStore.get('doicela_read_history')?.value || '';

  const [item, glossary, recommendations] = await Promise.all([
    serverGet<T>(`/doiceladev/${module}/${slug}?lang=${locale}`),
    serverGet<GlossaryTerm[]>(`/doiceladev/glossary?lang=${locale}`).catch(
      () => [] as GlossaryTerm[],
    ),
    serverGet<RecommendationCard[]>(
      `/doiceladev/recommendations?module=${module}&slug=${slug}&lang=${locale}${
        readHistory ? `&exclude=${encodeURIComponent(readHistory)}` : ''
      }`,
    ).catch(() => [] as RecommendationCard[]),
  ]);

  return {
    item,
    glossary: glossary || [],
    recommendations: recommendations || [],
  };
}

/**
 * Normaliza y deduplica una cadena de tecnologías separadas por coma.
 */
export function parseTechStack(techStack?: string): string[] {
  if (!techStack) return [];
  const items = techStack
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set(items));
}

/**
 * Determina la alineación visual de la ficha técnica (ArticleMetaPanel) para la publicación.
 * Por defecto aplica el estándar uniforme a la izquierda ('left').
 * Permite control individual por artículo si se incluye la directiva HTML comment:
 * <!-- meta: center --> o <!-- meta-align: center -->
 */
export function parseMetaAlign(contentMarkdown?: string): 'left' | 'center' {
  if (!contentMarkdown) return 'left';
  const match = contentMarkdown.match(
    /<!--\s*meta(?:-align)?:\s*(left|center)\s*-->/i,
  );
  if (match && match[1]) {
    return match[1].toLowerCase() as 'left' | 'center';
  }
  return 'left';
}
