'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNewsletterSubscription } from '../../../features/newsletter-subscription';

interface StayInformedCardProps {
  source?: string;
  className?: string;
}

export function StayInformedCard({ source = 'article_footer', className = '' }: StayInformedCardProps) {
  const t = useTranslations('Newsletter');
  const locale = useLocale();
  const [email, setEmail] = useState('');

  const { status, errorMessage, subscribe, reset } = useNewsletterSubscription({
    source,
    language: locale,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    const ok = await subscribe(email);
    if (ok) {
      setEmail('');
    }
  };

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div
      className={`p-6 rounded-3xl glass-convex-panel border border-slate-200/80 dark:border-white/5 space-y-3.5 shadow-xl transition-all duration-300 ${className}`}
      aria-live="polite"
    >
      <h4 className="text-base sm:text-lg font-bold text-[var(--header-title)] tracking-tight">
        {t('title')}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
        {t('description')}
      </p>

      {isSuccess ? (
        <div className="flex items-center justify-center gap-2 p-3.5 rounded-2xl glass-concave-panel text-xs text-emerald-600 dark:text-emerald-400 font-mono text-center border border-emerald-500/20 bg-emerald-500/5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
          <span>{t('success')}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2 pt-1" noValidate={false}>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isError) reset();
              }}
              placeholder={t('placeholder')}
              required
              disabled={isLoading}
              aria-label={t('placeholder')}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-xs font-sans outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-xs font-mono transition-all duration-150 shrink-0 cursor-pointer shadow-md hover:shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>{t('subscribing')}</span>
                </>
              ) : (
                <span>{t('subscribe')}</span>
              )}
            </button>
          </div>

          {isError && (
            <div className="flex items-center gap-1.5 px-2 text-[11px] text-rose-500 dark:text-rose-400 font-sans animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errorMessage || t('errorGeneric')}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
