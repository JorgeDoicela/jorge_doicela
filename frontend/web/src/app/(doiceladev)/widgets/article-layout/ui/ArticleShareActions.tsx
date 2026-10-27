'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';

interface ArticleShareActionsProps {
  title: string;
  url?: string;
  className?: string;
}

export function ArticleShareActions({ title, url, className = '' }: ArticleShareActionsProps) {
  const t = useTranslations('ArticleLayout');
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleCopyLink = async () => {
    const fullUrl = getFullUrl();
    if (!fullUrl) return;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback manual si clipboard API no estuviera disponible
      const input = document.createElement('input');
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShareX = () => {
    const fullUrl = getFullUrl();
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(fullUrl)}&via=jorgedoicela`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleShareLinkedIn = () => {
    const fullUrl = getFullUrl();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=550');
  };

  return (
    <div
      className={`pt-6 mt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 select-none ${className}`}
      aria-label={t('shareTitle')}
    >
      <div className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-zinc-400">
        <span>{t('shareTitle')}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Botón: Copiar Enlace con feedback reactivo */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
              : 'glass-concave-panel border-black/5 dark:border-white/5 text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30'
          }`}
          title={copied ? t('linkCopied') : t('copyLink')}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
          ) : (
            <Copy className="w-3.5 h-3.5 shrink-0 text-slate-400 dark:text-zinc-500" aria-hidden="true" />
          )}
          <span>{copied ? t('linkCopied') : t('copyLink')}</span>
        </button>

        {/* Botón: Compartir en X */}
        <button
          type="button"
          onClick={handleShareX}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-concave-panel border border-black/5 dark:border-white/5 text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
          title={t('shareOnX')}
        >
          {/* Logo oficial minimalista de X */}
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>X</span>
        </button>

        {/* Botón: Compartir en LinkedIn */}
        <button
          type="button"
          onClick={handleShareLinkedIn}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-concave-panel border border-black/5 dark:border-white/5 text-xs font-mono text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
          title={t('shareOnLinkedIn')}
        >
          {/* Logo de LinkedIn */}
          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
          <span>LinkedIn</span>
        </button>
      </div>
    </div>
  );
}
