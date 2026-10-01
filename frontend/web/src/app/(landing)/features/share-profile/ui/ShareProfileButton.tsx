'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface ShareProfileButtonProps {
  size?: number;
  className?: string;
}

export function ShareProfileButton({
  size = 22,
  className = '',
}: ShareProfileButtonProps) {
  const t = useTranslations('Links');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Jorge Doicela — Enlaces & Proyectos',
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
    <button
      onClick={handleShare}
      className={`text-text-muted hover:text-foreground p-2 sm:p-2.5 rounded-xl hover:bg-foreground/5 active:scale-95 transition-all duration-200 cursor-pointer ${className}`.trim()}
      aria-label={copied ? t('linkCopied') : t('shareProfile')}
      title={copied ? t('linkCopied') : t('shareProfile')}
    >
      {copied ? (
        <Check size={size} className="text-emerald-400 stroke-[2.2]" />
      ) : (
        <Share2 size={size} className="stroke-[2]" />
      )}
    </button>
  );
}
