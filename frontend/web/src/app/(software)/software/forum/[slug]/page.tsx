import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { ForumTopic, ForumReply  } from '../../../entities/forum';
import { ForumReplyForm } from '../../../features/forum-reply';;
import { serverGet } from '../../../shared/lib/serverFetch';
import { SoftwareArticleLayout } from '../../../widgets/article-layout';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tCommon = await getTranslations('Common');
  const topic = await serverGet<ForumTopic>(`/software/forum/${slug}?lang=${locale}`);

  if (!topic) {
    return { title: `${tCommon('notFound')} | Software — Jorge Doicela` };
  }

  return {
    title: `${topic.title} | ${tNav('forum')} — Jorge Doicela`,
    description: topic.content.slice(0, 160),
    openGraph: {
      title: topic.title,
      description: topic.content.slice(0, 160),
      type: 'article',
      authors: [topic.author || 'Jorge Doicela'],
    },
    alternates: {
      canonical: `https://software.jorgedoicela.com/forum/${slug}`,
    },
  };
}

export default async function ForumTopicDetailPage({ params }: Params) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations('Nav');
  const tDetail = await getTranslations('Detail');

  const topic = await serverGet<ForumTopic>(`/software/forum/${slug}?lang=${locale}`);

  if (!topic) notFound();

  const formattedDate = new Date(topic.createdAt).toLocaleDateString(
    locale === 'es' ? 'es-ES' : 'en-US',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SoftwareArticleLayout
      category="forum"
      categoryLabel={tNav('forum')}
      categoryHref="/forum"
      title={topic.title}
      date={formattedDate}
      author={topic.author || 'Jorge Doicela'}
    >
      {/* Contenido del Hilo Principal — Server */}
      <MarkdownRenderer content={topic.content} />

      {/* Sección de Respuestas — Server */}
      <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-mono">
          {tDetail('communityReplies', { count: topic.replies?.length ?? 0 })}
        </h3>

        {topic.replies && topic.replies.length > 0 ? (
          <div className="space-y-4">
            {topic.replies.map((reply: ForumReply) => (
              <div
                key={reply.id}
                className="p-5 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/80 dark:border-white/5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{reply.author}</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-500">
                    {new Date(reply.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                  </span>
                </div>
                <div className="pt-1 text-xs sm:text-sm leading-relaxed">
                  <MarkdownRenderer content={reply.content} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass-concave-panel text-center text-xs font-mono text-zinc-500">
            {tDetail('noRepliesYet')}
          </div>
        )}

        {/* Formulario de Respuesta — Client Component aislado */}
        <ForumReplyForm topic={topic} locale={locale} />
      </div>
    </SoftwareArticleLayout>
  );
}
