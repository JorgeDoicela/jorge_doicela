'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ForumTopic, ForumReply } from '../../../features/forum/types';
import { API_URL } from '../../../../config';
import { SoftwareArticleLayout } from '../../../components/SoftwareArticleLayout';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';

export default function ForumTopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const locale = useLocale();
  const tNav = useTranslations('Nav');
  const tForum = useTranslations('Forum');
  const tDetail = useTranslations('Detail');
  const tCard = useTranslations('CardActions');
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopic = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/software/forum/${slug}?lang=${locale}`);
      if (!res.ok) throw new Error(tDetail('topicNotFound'));
      const data = await res.json();
      setTopic(data.data || data);
    } catch (err: any) {
      setError(err.message || tDetail('topicNotFound'));
    } finally {
      setLoading(false);
    }
  }, [slug, locale, tDetail]);

  useEffect(() => {
    fetchTopic();
  }, [fetchTopic]);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !topic) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/software/forum/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          content: replyContent.trim(),
          author: authorName.trim() || (locale === 'es' ? 'Desarrollador Anónimo' : 'Anonymous Developer'),
        }),
      });

      if (!res.ok) throw new Error('Error al enviar respuesta');
      setReplyContent('');
      await fetchTopic();
    } catch (err: any) {
      alert(err.message || 'Error al publicar');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex justify-center items-center bg-[var(--background)]">
        <div className="p-8 rounded-3xl glass-convex-panel animate-pulse text-zinc-400 text-xs font-mono">
          {tDetail('loadingDiscussion')}
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen py-20 px-4 flex flex-col justify-center items-center gap-4 bg-[var(--background)]">
        <p className="text-rose-500 font-mono text-sm">{error || tDetail('topicNotFound')}</p>
        <Link href="/software/forum" className="px-5 py-2.5 rounded-xl glass-concave-panel text-xs font-mono text-blue-400 hover:text-white transition-all">
          {tForum('back')}
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(topic.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <SoftwareArticleLayout
      category="forum"
      categoryLabel={tNav('forum')}
      categoryHref="/software/forum"
      title={topic.title}
      date={formattedDate}
      author={topic.author || 'Jorge Doicela'}
      extraSidebarCard={
        <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 space-y-4 shadow-xl">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-white/5">
            {tDetail('forumStats')}
          </h5>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('category')}</span>
              <span className="font-bold text-white">{topic.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('replies')}</span>
              <span className="font-bold text-cyan-400">{topic.replies?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">{tDetail('status')}</span>
              <span className={topic.isSolved ? 'text-emerald-400 font-bold' : 'text-blue-400 font-bold'}>
                {topic.isSolved ? tCard('solved') : tCard('open')}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-white/5">
            <Link
              href="/software/forum"
              className="w-full py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-center block text-blue-400 hover:text-white transition-all"
            >
              {tDetail('allTopics')}
            </Link>
          </div>
        </div>
      }
    >
      {/* Contenido del Hilo Principal */}
      <MarkdownRenderer content={topic.content} />

      {/* Sección de Respuestas */}
      <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight font-mono">
            {tDetail('communityReplies', { count: topic.replies?.length || 0 })}
          </h3>
        </div>

        {topic.replies && topic.replies.length > 0 ? (
          <div className="space-y-4">
            {topic.replies.map((reply: ForumReply) => (
              <div
                key={reply.id}
                className="p-5 rounded-2xl bg-black/20 border border-white/5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="font-bold text-cyan-400">{reply.author}</span>
                  <span className="text-[11px] text-zinc-500">
                    {new Date(reply.createdAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                  {reply.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass-concave-panel text-center text-xs font-mono text-zinc-500">
            {tDetail('noRepliesYet')}
          </div>
        )}

        {/* Formulario de Respuesta Rápida */}
        <form onSubmit={handlePostReply} className="mt-8 p-6 rounded-2xl glass-concave-panel border border-white/5 space-y-4">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {tDetail('joinDiscussion')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={tDetail('namePlaceholder')}
              className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400"
            />
          </div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={tDetail('replyPlaceholder')}
            rows={4}
            required
            className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-white placeholder:text-zinc-500 outline-none focus:border-cyan-400 resize-none leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono disabled:opacity-40 transition-all cursor-pointer shadow-md hover:shadow-blue-500/25"
            >
              {submitting ? tDetail('publishing') : tDetail('postReplyBtn')}
            </button>
          </div>
        </form>
      </div>
    </SoftwareArticleLayout>
  );
}
