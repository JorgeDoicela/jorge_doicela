'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, CornerDownRight } from 'lucide-react';
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

export function ForumDiscussionSection({
  topic,
  locale,
}: ForumDiscussionSectionProps) {
  const tDetail = useTranslations('Detail');
  const [replies, setReplies] = useState<ForumReply[]>(topic.replies || []);
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set());
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

  const handleVoteReply = async (replyId: number) => {
    if (votedIds.has(replyId) || votingId !== null) return;
    setVotingId(replyId);

    try {
      const res = await fetch(
        `${API_URL}/doiceladev/forum/replies/${replyId}/vote`,
        { method: 'POST' },
      );
      if (!res.ok) return;

      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)),
      );

      setVotedIds((prev) => {
        const next = new Set(prev);
        next.add(replyId);
        try {
          window.localStorage.setItem(
            VOTED_REPLIES_KEY,
            JSON.stringify(Array.from(next)),
          );
        } catch {
          // Silencioso
        }
        return next;
      });
    } finally {
      setVotingId(null);
    }
  };

  const handleSelectReplyTarget = (reply: ForumReply) => {
    setReplyTarget({ id: reply.id, author: reply.author });
    formAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleReplyCreated = (created: ForumReply) => {
    setReplies((prev) => [...prev, created]);
  };

  const renderReply = (reply: ForumReply, depth: number = 0) => {
    const childReplies = childrenByParent.get(reply.id) || [];
    const hasVoted = votedIds.has(reply.id);

    return (
      <div
        key={reply.id}
        className={
          depth > 0
            ? 'ml-4 sm:ml-8 pl-4 border-l-2 border-blue-500/20 space-y-3'
            : 'space-y-3'
        }
      >
        <article className="p-5 rounded-2xl bg-white/70 dark:bg-black/20 border border-slate-200/80 dark:border-white/5 space-y-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {reply.author}
              </span>
              {reply.isAcceptedAnswer && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span>•</span>
                  <span>{tDetail('acceptedAnswer')}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500">
              {new Date(reply.createdAt).toLocaleDateString(
                locale === 'es' ? 'es-ES' : 'en-US',
              )}
            </span>
          </div>

          <div className="pt-1 text-xs sm:text-sm leading-relaxed">
            <MarkdownRenderer content={reply.content} />
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={() => handleVoteReply(reply.id)}
              disabled={hasVoted || votingId === reply.id}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                hasVoted
                  ? 'bg-blue-500/15 text-blue-600 dark:text-cyan-400 border border-blue-500/30 cursor-default'
                  : 'glass-concave-panel text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer'
              }`}
              aria-label={tDetail('upvoteReply')}
            >
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{reply.likes}</span>
            </button>

            {depth < 2 && (
              <button
                type="button"
                onClick={() => handleSelectReplyTarget(reply)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <CornerDownRight className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{tDetail('replyAction')}</span>
              </button>
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
        />
      )}

      <div className="mt-10 pt-8 border-t border-black/5 dark:border-white/5 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-mono">
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
      </div>
    </div>
  );
}
