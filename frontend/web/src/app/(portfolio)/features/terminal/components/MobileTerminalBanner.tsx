'use client';

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface MobileTerminalBannerProps {
  isMobileExpanded: boolean;
  onToggleMobileExpand: () => void;
}

export const MobileTerminalBanner: React.FC<MobileTerminalBannerProps> = ({
  isMobileExpanded,
  onToggleMobileExpand,
}) => {
  const t = useTranslations('Terminal');
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobileViewport) return null;

  return (
    <div className="w-full mb-4 p-4 rounded-xl border border-gold-400/30 bg-surface/90 backdrop-blur-md text-xs font-mono flex flex-col gap-3 shadow-lg animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-gold-400/10 text-gold-300 shrink-0">
          <Monitor className="w-4 h-4" />
        </div>
        <div className="flex-1 text-foreground/85 leading-relaxed">
          <span className="font-semibold text-gold-300 block mb-0.5">
            {t('mobileBannerTitle')}
          </span>
          {t('mobileBannerDesc')}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
        <button
          onClick={onToggleMobileExpand}
          className="flex items-center gap-1.5 text-gold-300 hover:text-gold-200 transition-colors font-medium cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isMobileExpanded ? t('mobileHide') : t('mobileShow')}</span>
          {isMobileExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};

