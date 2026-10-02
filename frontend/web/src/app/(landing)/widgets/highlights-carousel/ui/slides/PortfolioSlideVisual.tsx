import React from 'react';
import { useTranslations } from 'next-intl';

export const PortfolioSlideVisual: React.FC = () => {
  const t = useTranslations('Landing');

  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* 3 Pilares con Espaciado de Lectura Ergonómico en Móvil y Jerarquía Editorial en Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-card-border -mt-0 sm:-mt-3 md:-mt-5">
        <div className="flex flex-col gap-1 sm:gap-2 sm:pr-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {t('portfolioPillar1Title')}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {t('portfolioPillar1Desc')}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 sm:px-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {t('portfolioPillar2Title')}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {t('portfolioPillar2Desc')}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 sm:pl-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {t('portfolioPillar3Title')}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {t('portfolioPillar3Desc')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSlideVisual;
