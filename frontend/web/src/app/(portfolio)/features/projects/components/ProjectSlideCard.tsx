'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ProjectSlide } from '../types';

interface ProjectSlideCardProps {
  slide: ProjectSlide;
  index: number;
  total: number;
  isActive: boolean;
}

/**
 * Componente de presentación polimórfico para cada tarjeta de la pasarela orbital 3D.
 * Soporta secciones editoriales de ingeniería (visión, desafío, arquitectura, stack/telemetría)
 * y galería multimedia (imágenes y videos) bajo el sistema de diseño Dark/Light Luxury.
 */
export function ProjectSlideCard({
  slide,
  index,
  total,
  isActive,
}: ProjectSlideCardProps) {
  const t = useTranslations('Projects');
  const stepNumber = String(index + 1).padStart(2, '0');
  const totalNumber = String(total).padStart(2, '0');

  return (
    <div
      className={`w-full h-full rounded-2xl bg-surface text-foreground border flex flex-col justify-between p-6 sm:p-8 overflow-hidden transition-colors duration-300 ${
        isActive
          ? 'border-border-gold shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65),0_0_28px_0_var(--glow-gold)]'
          : 'border-border/70 shadow-xl hover:border-gold-400/50'
      }`}
    >
      {/* Cabecera de la tarjeta */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-border/50 shrink-0">
        <h3 className="text-xs font-mono uppercase tracking-[0.14em] text-gold-300 font-semibold truncate">
          {slide.kind === 'media'
            ? `${t(slide.titleKey)} ${slide.mediaIndex}/${slide.mediaTotal}`
            : t(slide.titleKey)}
        </h3>

        <span className="text-[11px] font-mono tracking-widest text-muted shrink-0">
          {stepNumber} / {totalNumber}
        </span>
      </div>

      {/* Cuerpo polimórfico por tipo de sección */}
      <div className="flex-1 flex flex-col justify-center py-5 overflow-y-auto">
        {slide.kind === 'overview' && (
          <div className="space-y-5">
            <p className="text-base sm:text-lg text-foreground font-light leading-relaxed">
              {slide.content}
            </p>
            {slide.summary && slide.summary !== slide.content && (
              <p className="text-xs sm:text-sm text-muted font-light leading-relaxed border-l-2 border-border-gold/60 pl-4">
                {slide.summary}
              </p>
            )}
          </div>
        )}

        {slide.kind === 'challenge' && (
          <div className="p-5 sm:p-6 rounded-xl bg-surface-raised/45 border border-border-gold/30 space-y-3">
            <p className="text-sm sm:text-base text-foreground/90 font-light leading-relaxed">
              {slide.content}
            </p>
          </div>
        )}

        {slide.kind === 'architecture' && (
          <ul className="space-y-3.5">
            {slide.highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex items-start gap-3.5 text-xs sm:text-sm text-foreground/85 font-light leading-relaxed"
              >
                <span className="mt-0.5 text-[10px] font-mono text-gold-400 font-semibold shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {slide.kind === 'stack-telemetry' && (
          <div className="space-y-6">
            {slide.technologies.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted block">
                  {t('modalTechStack')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {slide.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono px-3 py-1 rounded-lg border border-border-gold/50 bg-background/60 text-foreground/90 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {slide.metrics.length > 0 && (
              <div className="p-4 sm:p-5 rounded-xl bg-surface-raised/35 border border-border/60 space-y-3">
                <div className="flex items-center justify-between border-b border-border-gold/25 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
                    {t('modalTelemetry')}
                  </span>
                  <span className="text-[9px] font-mono text-muted uppercase tracking-wider">
                    {t('modalVerifiedMetrics')}
                  </span>
                </div>
                <div className="space-y-2.5 font-mono text-xs">
                  {slide.metrics.map((metric, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-3">
                      <span className="text-foreground/75 shrink-0">{metric.label}</span>
                      <span className="grow border-b border-dotted border-border-gold/50 mb-1 opacity-60" />
                      <span className="text-foreground font-semibold shrink-0 tracking-wide">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {slide.kind === 'media' && (
          <div className="flex flex-col items-center justify-center gap-3 h-full">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border-gold/40 bg-background/60">
              {slide.media.type === 'video' ? (
                <video
                  src={slide.media.url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={slide.media.url}
                  alt={slide.media.caption || t('slideMediaShort')}
                  draggable={false}
                  className="w-full h-full object-cover select-none"
                />
              )}
            </div>
            {slide.media.caption && (
              <p className="text-xs font-mono text-muted text-center">
                {slide.media.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
