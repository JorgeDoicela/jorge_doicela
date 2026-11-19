'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
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
    if (votedOptionId !== null || submittingId !== null) return;
    setSubmittingId(optionId);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/doiceladev/forum/${topicId}/poll/${optionId}/vote`,
        { method: 'POST' },
      );

      if (!res.ok) {
        throw new Error(tDetail('pollVoteError'));
      }

      const data = (await res.json()) as
        | { data?: ForumPollOption[] }
        | ForumPollOption[];
      const updated = Array.isArray(data) ? data : data.data;
      if (Array.isArray(updated) && updated.length > 0) {
        setOptions(updated);
      } else {
        setOptions((prev) =>
          prev.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt,
          ),
        );
      }

      setVotedOptionId(optionId);
      try {
        window.localStorage.setItem(storageKey, String(optionId));
      } catch {
        // Silencioso
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : tDetail('pollVoteError'),
      );
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <section className="my-8 p-5 sm:p-6 rounded-2xl glass-concave-panel border border-slate-200/80 dark:border-white/[0.06] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          {tDetail('pollTitle')}
        </span>
        <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
          {tDetail('pollTotalVotes', { count: totalVotes })}
        </span>
      </div>

      {question && (
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {question}
        </h3>
      )}

      <div className="space-y-2.5">
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
              disabled={showResults || submittingId !== null}
              className={`relative w-full text-left overflow-hidden rounded-xl border px-4 py-3 transition-all ${
                isSelected
                  ? 'border-blue-500/60 bg-blue-500/10 dark:bg-blue-500/15'
                  : 'border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-black/25 hover:border-blue-500/40'
              } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {showResults && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                    isSelected
                      ? 'bg-blue-500/20 dark:bg-blue-500/25'
                      : 'bg-slate-200/60 dark:bg-white/[0.06]'
                  }`}
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-800 dark:text-zinc-100">
                  {isSelected && (
                    <Check
                      className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>{opt.label}</span>
                </span>

                {showResults && (
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-zinc-300 shrink-0">
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
