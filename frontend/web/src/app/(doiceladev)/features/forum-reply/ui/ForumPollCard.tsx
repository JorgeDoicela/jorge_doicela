'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ForumPollOption } from '../../../entities/forum/types';
import { API_URL } from '../../../shared/lib/api';

interface ForumPollCardProps {
  topicId: number;
  question?: string;
  initialOptions: ForumPollOption[];
}

export function ForumPollCard({
  topicId,
  question,
  initialOptions,
}: ForumPollCardProps) {
  const tDetail = useTranslations('Detail');
  const [options, setOptions] = useState<ForumPollOption[]>(initialOptions);
  const [votedOptionId, setVotedOptionId] = useState<number | null>(null);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `doicela_forum_poll_${topicId}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = Number(saved);
        if (!Number.isNaN(parsed) && parsed > 0) {
          setVotedOptionId(parsed);
        }
      }
    } catch {
      // Silencioso en modos de privacidad estrictos
    }
  }, [storageKey]);

  if (!options || options.length === 0) return null;

  const totalVotes = options.reduce((acc, opt) => acc + (opt.votes || 0), 0);

  const handleVote = async (optionId: number) => {
    if (submittingId !== null) return;
    setSubmittingId(optionId);
    setError(null);

    const isUnvoting = votedOptionId === optionId;
    const previousOptionId = votedOptionId;
    const previousOptions = options;

    // Actualización optimista inmediata para respuesta visual instantánea
    const optimisticOptions = options.map((opt) => {
      if (isUnvoting && opt.id === optionId) {
        return { ...opt, votes: Math.max(0, opt.votes - 1) };
      }
      if (!isUnvoting && opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      if (!isUnvoting && previousOptionId && opt.id === previousOptionId) {
        return { ...opt, votes: Math.max(0, opt.votes - 1) };
      }
      return opt;
    });

    setOptions(optimisticOptions);
    if (isUnvoting) {
      setVotedOptionId(null);
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Silencioso
      }
    } else {
      setVotedOptionId(optionId);
      try {
        window.localStorage.setItem(storageKey, String(optionId));
      } catch {
        // Silencioso
      }
    }

    try {
      const endpoint = isUnvoting
        ? `${API_URL}/doiceladev/forum/${topicId}/poll/${optionId}/unvote`
        : `${API_URL}/doiceladev/forum/${topicId}/poll/${optionId}/vote`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: isUnvoting
          ? undefined
          : JSON.stringify({ previousOptionId: previousOptionId ?? undefined }),
      });

      if (!res.ok) {
        throw new Error(tDetail('pollVoteError'));
      }

      const data = (await res.json()) as
        | { data?: ForumPollOption[] }
        | ForumPollOption[];
      const updated = Array.isArray(data) ? data : data.data;
      if (Array.isArray(updated) && updated.length > 0) {
        setOptions(updated);
      }
    } catch (err: unknown) {
      setOptions(previousOptions);
      setVotedOptionId(previousOptionId);
      try {
        if (previousOptionId) {
          window.localStorage.setItem(storageKey, String(previousOptionId));
        } else {
          window.localStorage.removeItem(storageKey);
        }
      } catch {
        // Silencioso
      }
      setError(
        err instanceof Error ? err.message : tDetail('pollVoteError'),
      );
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <section className="my-8 px-5 py-4 sm:px-6 sm:py-5 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-100">
          {tDetail('pollTitle')}
        </h2>
        <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
          {tDetail('pollTotalVotes', { count: totalVotes })}
        </span>
      </div>

      {question && (
        <p className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-zinc-200 leading-relaxed">
          {question}
        </p>
      )}

      <div className="space-y-2.5 pt-0.5">
        {options.map((opt) => {
          const pct =
            totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = votedOptionId === opt.id;
          const showResults = votedOptionId !== null;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleVote(opt.id)}
              disabled={submittingId !== null}
              aria-pressed={isSelected}
              className={`group relative w-full text-left overflow-hidden rounded-xl px-4 py-2.5 transition-all cursor-pointer glass-btn-neumorphic ${
                isSelected ? 'shadow-[var(--btn-shadow-hover)]' : ''
              }`}
            >
              <div className="relative w-full flex items-center justify-between gap-3 text-xs sm:text-[13px]">
                <span
                  className={`flex items-center gap-3 transition-colors ${
                    isSelected
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'font-normal dark:font-light text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-slate-800 dark:bg-zinc-100'
                        : 'border border-slate-300 dark:border-zinc-600 bg-transparent group-hover:border-0 group-hover:bg-slate-400 dark:group-hover:bg-zinc-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{opt.label}</span>
                </span>

                {showResults && (
                  <span
                    className={`font-mono text-[11px] shrink-0 ${
                      isSelected
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'font-normal text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    {pct}% ({opt.votes})
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-mono text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
    </section>
  );
}
