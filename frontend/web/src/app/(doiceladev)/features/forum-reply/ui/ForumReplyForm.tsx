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
    <form onSubmit={handlePostReply} className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100">
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

      <div className="space-y-1.5">
        {/* Campo 1 separado: Nombre o Alias en su propio panel cóncavo */}
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder={tDetail('namePlaceholder')}
          maxLength={60}
          className="w-full px-4 py-3 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] outline-none text-xs sm:text-[13px] font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors focus:border-blue-500/40 dark:focus:border-cyan-400/40 block"
        />

        {/* Campo 2 separado: Área de escritura en su propio panel cóncavo */}
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={tDetail('replyPlaceholder')}
          rows={4}
          required
          minLength={3}
          maxLength={4000}
          className="w-full px-4 py-3 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] outline-none text-xs sm:text-[13px] font-sans text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 resize-none leading-relaxed transition-colors focus:border-blue-500/40 dark:focus:border-cyan-400/40 block"
        />
      </div>

      {/* Barra inferior con estado y botón neumórfico */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="min-h-4 flex items-center">
          {errorMsg ? (
            <p className="text-xs font-mono text-rose-500 dark:text-rose-400">
              {errorMsg}
            </p>
          ) : successMsg ? (
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              {successMsg}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl glass-btn-neumorphic text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-cyan-400 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {submitting ? tDetail('publishing') : tDetail('postReplyBtn')}
        </button>
      </div>
    </form>
  );
}
