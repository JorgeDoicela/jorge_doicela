'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ShareProfileButton() {
  const t = useTranslations('Links');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Jorge Doicela — Enlaces & Proyectos de Software',
      text: 'Explora el portafolio, proyectos y plataformas de Jorge Doicela.',
      url: typeof window !== 'undefined' ? window.location.href : 'https://jorgedoicela.com/links',
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Si el usuario cancela la hoja nativa, no hacemos fallback
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-8 flex justify-center">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 border border-card-border hover:border-card-hover-border text-text-muted hover:text-foreground text-xs font-mono font-medium shadow-md backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={t('shareProfile')}
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold">{t('linkCopied')}</span>
          </>
        ) : (
          <>
            <Share2 size={14} />
            <span>{t('shareProfile')}</span>
          </>
        )}
      </button>
    </div>
  );
}
