'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { ForumTopic, ForumReply } from '../../../entities/forum/types';
import { API_URL } from '../../../shared';

interface ForumReplyFormProps {
  topic: ForumTopic;
  locale: string;
  parentId?: number | null;
  replyingToAuthor?: string | null;
  onCancelReply?: () => void;
  onReplySent?: (reply: ForumReply) => void;
}

export function ForumReplyForm({
  topic,
  parentId = null,
  replyingToAuthor = null,
  onCancelReply,
  onReplySent,
}: ForumReplyFormProps) {
  const router = useRouter();
  const tDetail = useTranslations('Detail');
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyContent.trim();
    if (trimmed.length < 3) {
      setErrorMsg(tDetail('replyMinLength'));
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload: {
        topicId: number;
        content: string;
        author: string;
        parentId?: number;
      } = {
        topicId: topic.id,
        content: trimmed,
        author: authorName.trim() || tDetail('anonymousDeveloper'),
      };
      if (parentId) {
        payload.parentId = parentId;
      }

      const res = await fetch(`${API_URL}/doiceladev/forum/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = (await res.json().catch(() => null)) as {
          message?: string | string[];
        } | null;
        const msg = Array.isArray(errBody?.message)
          ? errBody.message[0]
          : errBody?.message || tDetail('replyError');
        throw new Error(msg);
      }

      const data = (await res.json()) as { data?: ForumReply } | ForumReply;
      const createdReply =
        (data as { data?: ForumReply }).data ?? (data as ForumReply);
      onReplySent?.(createdReply);
      setReplyContent('');
      setSuccessMsg(tDetail('replySuccess'));
      onCancelReply?.();
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : tDetail('replyError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handlePostReply}
      className="mt-8 p-6 rounded-2xl glass-concave-panel border border-black/5 dark:border-white/5 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 min-h-6">
        <h4 className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white">
          {tDetail('joinDiscussion')}
        </h4>

        {parentId && replyingToAuthor && (
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-blue-600 dark:text-cyan-400">
            <span>{tDetail('replyingTo', { author: replyingToAuthor })}</span>
            {onCancelReply && (
              <button
                type="button"
                onClick={onCancelReply}
                aria-label={tDetail('cancelReply')}
                className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder={tDetail('namePlaceholder')}
          maxLength={60}
          className="px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 shadow-sm transition-colors"
        />
      </div>

      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder={tDetail('replyPlaceholder')}
        rows={4}
        required
        minLength={3}
        maxLength={4000}
        className="w-full p-3.5 rounded-xl bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-sans text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none leading-relaxed shadow-sm transition-colors"
      />

      {errorMsg && (
        <p className="text-xs font-mono text-rose-500 dark:text-rose-400">
          {errorMsg}
        </p>
      )}
      {successMsg && (
        <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
          {successMsg}
        </p>
      )}

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
