'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

export function StayInformedCard() {
  const t = useTranslations('Newsletter');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 space-y-3.5 shadow-xl">
      <h4 className="text-base sm:text-lg font-bold text-[var(--header-title)] tracking-tight">
        {t('title')}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
        {t('description')}
      </p>

      {subscribed ? (
        <div className="p-3 rounded-xl glass-concave-panel text-xs text-cyan-400 font-mono text-center">
          {t('success')}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            required
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 text-xs font-sans outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider text-xs font-mono transition-all duration-150 shrink-0 cursor-pointer shadow-md hover:shadow-blue-500/25"
          >
            {t('subscribe')}
          </button>
        </form>
      )}
    </div>
  );
}
