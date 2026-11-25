'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Flag,
  HelpCircle,
  Loader2,
  Lock,
  Send,
  ShieldAlert,
  Trophy,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { verifyLabFlag } from '../api/labsApi';
import type { LabDifficultyType, PortfolioLabChallenge } from '../types';

interface LabsBoardProps {
  challenges: PortfolioLabChallenge[];
}

const STORAGE_KEY = 'portfolio_ctf_solved_v1';

export function LabsBoard({ challenges }: LabsBoardProps) {
  const t = useTranslations('Labs');
  const [solvedSlugs, setSolvedSlugs] = useState<string[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [submittingSlug, setSubmittingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    Record<string, { type: 'success' | 'error'; message: string }>
  >({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSolvedSlugs(parsed.filter((s): s is string => typeof s === 'string'));
        }
      }
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }, []);

  const persistSolved = (next: string[]) => {
    setSolvedSlugs(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignorar entornos restringidos
    }
  };

  const totalPoints = challenges.reduce((acc, c) => acc + c.points, 0);
  const earnedPoints = challenges
    .filter((c) => solvedSlugs.includes(c.slug))
    .reduce((acc, c) => acc + c.points, 0);

  const difficultyLabel = (diff: LabDifficultyType) => {
    if (diff === 'easy') return t('diffEasy');
    if (diff === 'medium') return t('diffMedium');
    return t('diffHard');
  };

  const handleSubmit = async (e: React.FormEvent, challenge: PortfolioLabChallenge) => {
    e.preventDefault();
    const flagValue = (inputs[challenge.slug] || '').trim();
    if (!flagValue || submittingSlug) return;

    setSubmittingSlug(challenge.slug);
    setFeedback((prev) => {
      const next = { ...prev };
      delete next[challenge.slug];
      return next;
    });

    try {
      const result = await verifyLabFlag(challenge.slug, flagValue);
      if (result.valid) {
        if (!solvedSlugs.includes(challenge.slug)) {
          persistSolved([...solvedSlugs, challenge.slug]);
        }
        setFeedback((prev) => ({
          ...prev,
          [challenge.slug]: {
            type: 'success',
            message: t('flagValid', { points: result.pointsAwarded }),
          },
        }));
      } else {
        setFeedback((prev) => ({
          ...prev,
          [challenge.slug]: {
            type: 'error',
            message: t('flagInvalid'),
          },
        }));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('verifyError');
      setFeedback((prev) => ({
        ...prev,
        [challenge.slug]: {
          type: 'error',
          message: msg,
        },
      }));
    } finally {
      setSubmittingSlug(null);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      {/* Cabecera del Tablero CTF + Marcador */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-gold-400">
            <Flag className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-widest font-semibold">
              {t('eyebrow')}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-light text-foreground">
            {t('title')}
          </h2>
          <p className="text-xs sm:text-sm text-muted font-light max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Marcador de Puntos */}
        <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl border border-border-gold/50 bg-surface/50 shrink-0 font-mono text-xs">
          <div className="flex items-center gap-2 text-gold-300">
            <Trophy className="w-4 h-4" />
            <span>
              {earnedPoints} / {totalPoints} pts
            </span>
          </div>
          <span className="text-border-gold">|</span>
          <span className="text-muted">
            {solvedSlugs.filter((s) => challenges.some((c) => c.slug === s)).length} / {challenges.length} {t('solvedLabel')}
          </span>
        </div>
      </div>

      {/* Grid de Retos CTF */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const isSolved = solvedSlugs.includes(challenge.slug);
          const isHintOpen = !!openHints[challenge.slug];
          const isBusy = submittingSlug === challenge.slug;
          const status = feedback[challenge.slug];

          return (
            <article
              key={challenge.id}
              className={`p-6 rounded-xl border transition-all duration-300 flex flex-col justify-between gap-5 ${
                isSolved
                  ? 'border-gold-300/60 bg-surface shadow-[0_0_24px_-8px_var(--glow-gold)]'
                  : 'border-border/60 bg-surface/40'
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gold-400/90">
                    {difficultyLabel(challenge.difficulty)} • {challenge.points} pts
                  </span>
                  {isSolved ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-gold-300 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('completedBadge')}</span>
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted/60" />
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-mono text-foreground font-semibold">
                  {challenge.title}
                </h3>

                <p className="text-xs text-muted font-light leading-relaxed">
                  {challenge.briefing}
                </p>

                {/* Pista Progresiva */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenHints((prev) => ({
                        ...prev,
                        [challenge.slug]: !prev[challenge.slug],
                      }))
                    }
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400/90 hover:text-gold-200 transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isHintOpen ? t('hideHint') : t('showHint')}</span>
                  </button>

                  {isHintOpen && (
                    <p className="mt-2 p-3 rounded-lg bg-background/60 border border-border/50 text-[11px] font-mono text-foreground/80 leading-relaxed">
                      {challenge.hint}
                    </p>
                  )}
                </div>
              </div>

              {/* Formulario de Validación de Flag */}
              <div className="flex flex-col gap-2.5 pt-1">
                <form
                  onSubmit={(e) => handleSubmit(e, challenge)}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputs[challenge.slug] || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [challenge.slug]: e.target.value,
                      }))
                    }
                    placeholder="FLAG{...}"
                    disabled={isSolved || isBusy}
                    spellCheck={false}
                    autoComplete="off"
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-background/80 border border-border-gold/60 text-xs font-mono text-foreground placeholder-muted/50 focus:outline-none focus:border-gold-300 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSolved || isBusy || !(inputs[challenge.slug] || '').trim()}
                    aria-label={t('submitFlag')}
                    className="px-3 py-2 rounded-lg border border-gold-400/50 bg-gold-400/10 hover:bg-gold-400/20 text-gold-300 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </form>

                {status && (
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-mono ${
                      status.type === 'success' ? 'text-gold-300' : 'text-red-400'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
