'use client';

import React from 'react';
import { Compass } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const ValuesPhilosophySection: React.FC = () => {
  const t = useTranslations('Philosophy');


  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
      {/* Filosofía & Valores (Columna izquierda y central - 2 cols) */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gold-300">
          <Compass className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-widest uppercase">
            {t('title')}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
          {t('title')}
        </h2>
        <div className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light space-y-4">
          <div>
            <h3 className="text-sm font-mono text-gold-200 font-medium mb-1">{t('pillar1Title')}</h3>
            <p>{t('pillar1Desc')}</p>
          </div>
          <div>
            <h3 className="text-sm font-mono text-gold-200 font-medium mb-1">{t('pillar2Title')}</h3>
            <p>{t('pillar2Desc')}</p>
          </div>
          <div>
            <h3 className="text-sm font-mono text-gold-200 font-medium mb-1">{t('pillar3Title')}</h3>
            <p>{t('pillar3Desc')}</p>
          </div>
        </div>
      </div>

      {/* Fundamento Espiritual & Cita (Columna derecha - 1 col) */}
      <div className="flex flex-col gap-4 md:pl-6 md:border-l border-border/40 h-full justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono text-gold-300 tracking-widest uppercase mb-1">
            Colosenses 3:23
          </span>
          <blockquote className="text-xs md:text-sm text-foreground/90 font-light italic leading-relaxed border-l-2 border-gold-400/50 pl-3">
            {t('quote')}
          </blockquote>
          <p className="text-[10px] font-mono text-gold-400 mt-1 pl-3">
            — {t('verse')}
          </p>
        </div>
      </div>
    </section>
  );
};

