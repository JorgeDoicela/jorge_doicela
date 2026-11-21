'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, CornerDownRight, AlertCircle } from 'lucide-react';
import { ForumTopic, ForumReply } from '../../../entities/forum/types';
import { API_URL } from '../../../shared';
import { DoiceladevTextarea } from '../../../shared/ui';

interface ForumReplyFormProps {
  topic: ForumTopic;
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
  const tDetail = useTranslations('Detail');
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [contentTooltip, setContentTooltip] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-cierre del mensaje de éxito tras 4 segundos
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = replyContent.trim();
    if (!trimmed) {
      setContentTooltip(tDetail('replyRequired'));
      return;
    }
    if (trimmed.length < 3) {
      setContentTooltip(tDetail('replyMinLength'));
      return;
    }

    setSubmitting(true);
    setContentTooltip(null);
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
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : tDetail('replyError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePostReply} noValidate className="mt-6 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100">
          {tDetail('joinDiscussion')}
        </h4>

        {parentId && replyingToAuthor && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] text-[11px] font-mono select-none">
            <CornerDownRight className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
            <span className="text-slate-600 dark:text-zinc-300">
              {tDetail('replyingTo', { author: replyingToAuthor })}
            </span>
            {onCancelReply && (
              <button
                type="button"
                onClick={onCancelReply}
                aria-label={tDetail('cancelReply')}
                title={tDetail('cancelReply')}
                className="w-4 h-4 rounded-full inline-flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {/* Campo 1: Nombre o Alias en su propio panel cóncavo */}
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder={tDetail('namePlaceholder')}
          maxLength={60}
          className="w-full px-4 py-3 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] outline-none text-xs sm:text-[13px] font-medium text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-colors focus:border-blue-500/40 dark:focus:border-cyan-400/40 block"
        />

        {/* Campo 2: Área de escritura con globo neumórfico reusable */}
        <DoiceladevTextarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={tDetail('replyPlaceholder')}
          rows={4}
          maxLength={4000}
          errorTooltip={contentTooltip}
          onClearError={() => setContentTooltip(null)}
        />
      </div>

      {/* Barra inferior con estado neumórfico y botón */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="min-h-7 flex items-center">
          {errorMsg ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl glass-concave-panel border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-mono animate-in fade-in zoom-in-95 duration-150">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          ) : successMsg ? (
            <div className="inline-flex items-center px-3 py-1 rounded-xl glass-concave-panel border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono animate-in fade-in zoom-in-95 duration-150">
              <span>{successMsg}</span>
            </div>
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
