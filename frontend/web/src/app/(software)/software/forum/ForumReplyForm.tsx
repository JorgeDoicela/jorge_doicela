'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ForumTopic } from '../../features/forum/types';
import { API_URL } from '../../../config';

interface ForumReplyFormProps {
  topic: ForumTopic;
  locale: string;
  onReplySent?: (updated: ForumTopic) => void;
}

export function ForumReplyForm({ topic, locale, onReplySent }: ForumReplyFormProps) {
  const router = useRouter();
  const tDetail = useTranslations('Detail');
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/software/forum/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: topic.id,
          content: replyContent.trim(),
          author:
            authorName.trim() ||
            (locale === 'es' ? 'Desarrollador Anónimo' : 'Anonymous Developer'),
        }),
      });

      if (!res.ok) throw new Error('Error al enviar respuesta');

      const data = (await res.json()) as { data?: ForumTopic } | ForumTopic;
      const updated = (data as { data?: ForumTopic }).data ?? (data as ForumTopic);
      onReplySent?.(updated);
      setReplyContent('');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al publicar';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handlePostReply}
      className="mt-8 p-6 rounded-2xl glass-concave-panel border border-black/5 dark:border-white/5 space-y-4"
    >
      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
        {tDetail('joinDiscussion')}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder={tDetail('namePlaceholder')}
          className="px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm transition-colors"
        />
      </div>
      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder={tDetail('replyPlaceholder')}
        rows={4}
        required
        className="w-full p-3.5 rounded-xl bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-sans text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none leading-relaxed shadow-sm transition-colors"
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
  );
}
