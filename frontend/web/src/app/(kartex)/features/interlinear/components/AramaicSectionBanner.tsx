'use client';

import React from 'react';

interface AramaicSectionBannerProps {
  contextNote?: string;
}

export const AramaicSectionBanner: React.FC<AramaicSectionBannerProps> = ({
  contextNote,
}) => {
  return (
    <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-foreground space-y-2 mb-6">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-black">
          Arameo Bíblico (Imperial Aramaic)
        </span>
        <span className="text-xs font-semibold text-amber-500 dark:text-amber-400">
          Porción Canónica en Lengua Aramea
        </span>
      </div>

      <p className="text-xs text-accents-5 leading-relaxed">
        {contextNote ||
          'Este pasaje está redactado en Arameo Imperial, la lengua franca del Antiguo Oriente Próximo. Las formas verbales (Pe’al, Pa’el, Af’el) y la determinación mediante el estado enfático (-ā’) difieren del hebreo clásico.'}
      </p>
    </div>
  );
};
