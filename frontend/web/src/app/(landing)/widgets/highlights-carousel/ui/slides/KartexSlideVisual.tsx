import React from 'react';
import { useTranslations } from 'next-intl';

export const KartexSlideVisual: React.FC = () => {
  const t = useTranslations('Landing');

  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* Cita Bíblica Principal KARTEX */}
      <div className="flex flex-col gap-1.5 -mt-3 sm:-mt-8 md:-mt-10 mb-6 sm:mb-10 md:mb-12">
        <p className="text-lg sm:text-2xl md:text-3xl font-light italic text-foreground leading-relaxed">
          &ldquo;{t('kartexQuote')}&rdquo;
        </p>
        <span className="text-xs sm:text-sm text-text-subtitle font-normal">
          {t('kartexRef')}
        </span>
      </div>

      {/* Desglose Morfológico KARTEX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-0 sm:divide-x divide-card-border">
        <div className="flex flex-col gap-0.5 sm:gap-1.5 sm:pr-6">
          <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-foreground">Niyr (Strong H5216)</span>
          <span className="text-[11px] sm:text-xs md:text-[13px] text-text-muted">{t('kartexStrong1')}</span>
        </div>

        <div className="flex flex-col gap-0.5 sm:gap-1.5 sm:px-6">
          <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-foreground">Dâbar (Strong H1697)</span>
          <span className="text-[11px] sm:text-xs md:text-[13px] text-text-muted">{t('kartexStrong2')}</span>
        </div>

        <div className="flex flex-col gap-0.5 sm:gap-1.5 sm:pl-6">
          <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-foreground">‘Ôwr (Strong H216)</span>
          <span className="text-[11px] sm:text-xs md:text-[13px] text-text-muted">{t('kartexStrong3')}</span>
        </div>
      </div>
    </div>
  );
};

export default KartexSlideVisual;
