'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, CornerDownRight, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ForumReply, ForumTopic } from '../../../entities/forum/types';
import { MarkdownRenderer } from '../../../shared/markdown/MarkdownRenderer';
import { API_URL } from '../../../shared/lib/api';
import { ForumPollCard } from './ForumPollCard';
import { ForumReplyForm } from './ForumReplyForm';

interface ForumDiscussionSectionProps {
  topic: ForumTopic;
  locale: string;
}

const VOTED_REPLIES_KEY = 'doicela_forum_reply_votes';
const MY_REPLIES_KEY = 'doicela_my_replies';

export function ForumDiscussionSection({
  topic,
  locale,
}: ForumDiscussionSectionProps) {
  const tDetail = useTranslations('Detail');
  const [replies, setReplies] = useState<ForumReply[]>(topic.replies || []);

  useEffect(() => {
    if (topic.replies) {
      setReplies(topic.replies);
    }
  }, [topic.replies]);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());
  const [myReplyIds, setMyReplyIds] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [votingId, setVotingId] = useState<number | null>(null);
  const [replyTarget, setReplyTarget] = useState<{
    id: number;
    author: string;
  } | null>(null);
  const formAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VOTED_REPLIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (Array.isArray(parsed)) {
          setVotedIds(
            new Set(
              parsed.map((n) => Number(n)).filter((n) => !Number.isNaN(n)),
            ),
          );
        }
      }

      const mySaved = window.localStorage.getItem(MY_REPLIES_KEY);
      if (mySaved) {
        const parsedMy = JSON.parse(mySaved) as unknown;
        if (Array.isArray(parsedMy)) {
          setMyReplyIds(
            new Set(
              parsedMy.map((n) => Number(n)).filter((n) => !Number.isNaN(n)),
            ),
          );
        }
      }
    } catch {
      // Silencioso
    }
  }, []);

  const { rootReplies, childrenByParent } = useMemo(() => {
    const map = new Map<number, ForumReply[]>();
    const roots: ForumReply[] = [];

    for (const r of replies) {
      if (r.parentId) {
        const list = map.get(r.parentId) || [];
        list.push(r);
        map.set(r.parentId, list);
      } else {
        roots.push(r);
      }
    }

    return { rootReplies: roots, childrenByParent: map };
  }, [replies]);

  const isClosed = Boolean(topic.isClosed);

  const handleVoteReply = async (replyId: number) => {
    if (isClosed || votingId !== null) return;
    setVotingId(replyId);

    const isUnvoting = votedIds.has(replyId);
    const previousLikes = replies.find((r) => r.id === replyId)?.likes;
    const previousVotedIds = new Set(votedIds);

    // Actualización optimista inmediata (0 ms)
    setReplies((prev) =>
      prev.map((r) => {
        if (r.id !== replyId) return r;
        return {
          ...r,
          likes: isUnvoting ? Math.max(0, r.likes - 1) : r.likes + 1,
        };
      }),
    );

    const nextVotedIds = new Set(votedIds);
    if (isUnvoting) {
      nextVotedIds.delete(replyId);
    } else {
      nextVotedIds.add(replyId);
    }
    setVotedIds(nextVotedIds);

    try {
      window.localStorage.setItem(
        VOTED_REPLIES_KEY,
        JSON.stringify(Array.from(nextVotedIds)),
      );
    } catch {
      // Silencioso
    }

    try {
      const endpoint = isUnvoting
        ? `${API_URL}/doiceladev/forum/replies/${replyId}/unvote`
        : `${API_URL}/doiceladev/forum/replies/${replyId}/vote`;

      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Vote request failed');
      }

      const data = (await res.json()) as { data?: ForumReply } | ForumReply;
      const updated = (data as { data?: ForumReply }).data ?? (data as ForumReply);
      if (updated && typeof updated.likes === 'number') {
        setReplies((prev) =>
          prev.map((r) => (r.id === replyId ? { ...r, likes: updated.likes } : r)),
        );
      }
    } catch {
      if (typeof previousLikes === 'number') {
        setReplies((prev) =>
          prev.map((r) =>
            r.id === replyId ? { ...r, likes: previousLikes } : r,
          ),
        );
      }
      setVotedIds(previousVotedIds);
      try {
        window.localStorage.setItem(
          VOTED_REPLIES_KEY,
          JSON.stringify(Array.from(previousVotedIds)),
        );
      } catch {
        // Silencioso
      }
    } finally {
      setVotingId(null);
    }
  };

  const handleSelectReplyTarget = (reply: ForumReply) => {
    setReplyTarget({ id: reply.id, author: reply.author });
    formAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleReplyCreated = (created: ForumReply) => {
    setReplies((prev) => {
      if (prev.some((r) => r.id === created.id)) return prev;
      return [...prev, created];
    });
    setMyReplyIds((prev) => {
      const next = new Set(prev);
      next.add(created.id);
      try {
        window.localStorage.setItem(
          MY_REPLIES_KEY,
          JSON.stringify(Array.from(next)),
        );
      } catch {
        // Silencioso
      }
      return next;
    });
  };

  const handleDeleteReply = async (replyId: number) => {
    if (deletingId !== null) return;
    setDeletingId(replyId);
    setConfirmDeleteId(null);
    const previousReplies = replies;

    // Conteo recursivo de dependientes para actualización optimista
    const idsToDelete = new Set<number>([replyId]);
    let added = true;
    while (added) {
      added = false;
      for (const r of replies) {
        if (r.parentId && idsToDelete.has(r.parentId) && !idsToDelete.has(r.id)) {
          idsToDelete.add(r.id);
          added = true;
        }
      }
    }

    setReplies((prev) => prev.filter((r) => !idsToDelete.has(r.id)));

    try {
      const res = await fetch(`${API_URL}/doiceladev/forum/replies/${replyId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Delete failed');
      }

      setMyReplyIds((prev) => {
        const next = new Set(prev);
        for (const id of idsToDelete) {
          next.delete(id);
        }
        try {
          window.localStorage.setItem(
            MY_REPLIES_KEY,
            JSON.stringify(Array.from(next)),
          );
        } catch {
          // Silencioso
        }
        return next;
      });
    } catch {
      setReplies(previousReplies);
    } finally {
      setDeletingId(null);
    }
  };

  const renderReply = (reply: ForumReply, depth: number = 0) => {
    const childReplies = childrenByParent.get(reply.id) || [];
    const hasVoted = votedIds.has(reply.id);
    const isMyReply = myReplyIds.has(reply.id);

    return (
      <div
        key={reply.id}
        className={
          depth > 0
            ? 'ml-4 sm:ml-8 pl-4 border-l border-slate-200 dark:border-white/10 space-y-3'
            : 'space-y-3'
        }
      >
        <article className="px-5 py-4 sm:px-6 sm:py-5 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-zinc-100">
                {reply.author}
              </span>
              {reply.isAcceptedAnswer && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400">
                  <span>•</span>
                  <span>{tDetail('acceptedAnswer')}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
              {new Date(reply.createdAt).toLocaleDateString(
                locale === 'es' ? 'es-ES' : 'en-US',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                },
              )}
            </span>
          </div>

          <div>
            <MarkdownRenderer content={reply.content} variant="compact" />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleVoteReply(reply.id)}
              disabled={isClosed || votingId === reply.id}
              aria-pressed={hasVoted}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all ${
                isClosed
                  ? 'cursor-default opacity-85'
                  : 'cursor-pointer glass-btn-neumorphic'
              } ${
                hasVoted
                  ? 'font-bold text-slate-900 dark:text-white shadow-[var(--btn-shadow-hover)]'
                  : 'font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-label={tDetail('upvoteReply')}
            >
              <ArrowUp
                className={`w-3.5 h-3.5 ${hasVoted ? 'stroke-[2.5]' : ''}`}
                aria-hidden="true"
              />
              <span>{reply.likes}</span>
            </button>

            {!isClosed && depth < 2 && (
              <button
                type="button"
                onClick={() => handleSelectReplyTarget(reply)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-btn-neumorphic text-[11px] font-mono font-medium text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              >
                <CornerDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tDetail('replyAction')}</span>
              </button>
            )}

            {!isClosed && isMyReply && (
              <div className="flex items-center">
                {confirmDeleteId === reply.id ? (
                  <div className="inline-flex items-center overflow-hidden rounded-xl glass-concave-panel border border-rose-500/30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => handleDeleteReply(reply.id)}
                      disabled={deletingId === reply.id}
                      className="inline-flex items-center px-3 py-1.5 text-rose-600 dark:text-rose-400 font-mono text-[11px] font-semibold hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {tDetail('confirmDelete')}
                    </button>
                    <span className="w-px h-3.5 bg-black/10 dark:bg-white/10" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="inline-flex items-center px-2.5 py-1.5 text-[11px] font-mono font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {tDetail('cancel')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(reply.id)}
                    disabled={deletingId === reply.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-btn-neumorphic text-[11px] font-mono font-medium text-rose-500/80 hover:text-rose-600 dark:text-rose-400/80 dark:hover:text-rose-300 transition-all cursor-pointer disabled:opacity-40"
                    aria-label={tDetail('deleteReply')}
                    title={tDetail('deleteReply')}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">{tDetail('deleteReply')}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </article>

        {childReplies.length > 0 && (
          <div className="space-y-3">
            {childReplies.map((child) => renderReply(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {topic.pollOptions && topic.pollOptions.length > 0 && (
        <ForumPollCard
          topicId={topic.id}
          question={topic.pollQuestion}
          initialOptions={topic.pollOptions}
          isClosed={isClosed}
        />
      )}

      <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-5">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100">
          {tDetail('communityReplies', { count: replies.length })}
        </h3>

        {rootReplies.length > 0 ? (
          <div className="space-y-4">
            {rootReplies.map((reply) => renderReply(reply, 0))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass-concave-panel text-center text-xs font-mono text-zinc-500">
            {tDetail('noRepliesYet')}
          </div>
        )}

        {isClosed ? (
          <div className="p-5 sm:p-6 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] text-center space-y-1.5 select-none">
            <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-zinc-100 block">
              {tDetail('topicClosedTitle')}
            </span>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">
              {tDetail('topicClosedDesc')}
            </p>
          </div>
        ) : (
          <div ref={formAnchorRef}>
            <ForumReplyForm
              topic={topic}
              locale={locale}
              parentId={replyTarget?.id ?? null}
              replyingToAuthor={replyTarget?.author ?? null}
              onCancelReply={() => setReplyTarget(null)}
              onReplySent={handleReplyCreated}
            />
          </div>
        )}
      </div>
    </div>
  );
}
