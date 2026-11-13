'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AlertCircle, Loader2, ArrowLeft, MailX } from 'lucide-react';
import { DoiceladevPageLayout } from '../../widgets/page-layout/ui/DoiceladevPageLayout';
import { useNewsletterUnsubscribe } from '../../features/newsletter-subscription';

function UnsubscribeContent() {
  const t = useTranslations('Newsletter');
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token')?.trim() || '';
  const emailParam = searchParams.get('email')?.trim() || '';

  const [email, setEmail] = useState(emailParam);
  const { status, errorMessage, unsubscribe, reset } = useNewsletterUnsubscribe();

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';
  const isError = status === 'error';
  const hasToken = tokenParam.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await unsubscribe(hasToken ? { token: tokenParam } : { email });
  };

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <div className="p-8 sm:p-11 rounded-3xl glass-convex-panel space-y-7">
        <div className="space-y-2.5 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl glass-concave-panel flex items-center justify-center text-slate-600 dark:text-zinc-300">
            <MailX className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-[26px] font-black text-[var(--header-title)] tracking-tight">
            {t('unsubscribeTitle')}
          </h1>
          <p className="text-sm sm:text-[15px] text-[var(--header-p)] leading-relaxed max-w-md mx-auto">
            {hasToken ? t('unsubscribeTokenDetected') : t('unsubscribeDescription')}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-4 sm:p-5 rounded-2xl glass-concave-panel text-sm text-emerald-600 dark:text-emerald-400 font-mono text-center border border-emerald-500/20">
              <span>{t('unsubscribeSuccess')}</span>
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-btn-neumorphic text-xs sm:text-sm font-mono font-semibold"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{t('backToPortal')}</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!hasToken && (
              <div>
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
                  className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm sm:text-[15px] font-sans outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-colors disabled:opacity-60"
                />
              </div>
            )}

            {isError && (
              <div className="flex items-center gap-2 px-2 text-xs sm:text-sm text-rose-500 dark:text-rose-400 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage || t('unsubscribeError')}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
              <button
                type="submit"
                disabled={isLoading || (!hasToken && !email.trim())}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-xs sm:text-[13px] font-mono transition-all duration-150 cursor-pointer shadow-md hover:shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>{t('unsubscribing')}</span>
                  </>
                ) : (
                  <span>{t('unsubscribeButton')}</span>
                )}
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl glass-btn-neumorphic text-xs sm:text-[13px] font-mono font-semibold"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>{t('backToPortal')}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <DoiceladevPageLayout minimal>
      <Suspense fallback={null}>
        <UnsubscribeContent />
      </Suspense>
    </DoiceladevPageLayout>
  );
}

