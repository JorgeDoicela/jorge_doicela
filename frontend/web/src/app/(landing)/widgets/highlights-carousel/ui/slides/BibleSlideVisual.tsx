import React from 'react';

interface SlideVisualProps {
  isEs: boolean;
}

export const BibleSlideVisual: React.FC<SlideVisualProps> = ({ isEs }) => {
  return (
    <div className="w-full flex flex-col justify-center gap-5 sm:gap-6 text-left py-1">
      {/* Cita Bíblica Principal */}
      <div className="flex flex-col gap-1.5">
        <p className="text-lg sm:text-2xl md:text-3xl font-light italic text-foreground leading-relaxed">
          &ldquo;{isEs ? 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.' : 'Your word is a lamp to my feet and a light to my path.'}&rdquo;
        </p>
        <span className="text-xs sm:text-sm text-text-subtitle font-normal">
          Salmos 119:105 · {isEs ? 'Texto Masorético y Septuaginta' : 'Masoretic Text and Septuagint'}
        </span>
      </div>

      {/* Desglose Morfológico con Separadores Sutiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-4 border-t border-card-border">
        <div className="flex flex-col gap-0.5 sm:pr-6 pb-2.5 sm:pb-0">
          <span className="text-xs sm:text-sm font-semibold text-foreground">Niyr (Strong H5216)</span>
          <span className="text-[11px] sm:text-xs text-text-muted">{isEs ? 'Lámpara y luz resplandeciente' : 'Lamp and shining light'}</span>
        </div>

        <div className="flex flex-col gap-0.5 sm:px-6 py-2.5 sm:py-0">
          <span className="text-xs sm:text-sm font-semibold text-foreground">Dâbar (Strong H1697)</span>
          <span className="text-[11px] sm:text-xs text-text-muted">{isEs ? 'Palabra divina y mandato' : 'Divine word and command'}</span>
        </div>

        <div className="flex flex-col gap-0.5 sm:pl-6 pt-2.5 sm:pt-0">
          <span className="text-xs sm:text-sm font-semibold text-foreground">‘Ôwr (Strong H216)</span>
          <span className="text-[11px] sm:text-xs text-text-muted">{isEs ? 'Luz del alba y revelación' : 'Dawn light and revelation'}</span>
        </div>
      </div>
    </div>
  );
};

export default BibleSlideVisual;
