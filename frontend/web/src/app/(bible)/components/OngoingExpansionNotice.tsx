'use client';

import React from 'react';

interface OngoingExpansionNoticeProps {
  contextTitle?: string;
  contextDescription?: string;
  onExploreAvailable?: () => void;
  availableChapterText?: string;
  activeItemsSummary?: string;
  className?: string;
}

export const OngoingExpansionNotice: React.FC<OngoingExpansionNoticeProps> = ({
  contextTitle,
  contextDescription,
  onExploreAvailable,
  availableChapterText = 'Explorar Génesis 1',
  activeItemsSummary = 'Capítulos activos listos para estudiar: Génesis 1, 2 y 3 en 7 traducciones.',
  className = '',
}) => {
  return (
    <div
      className={`w-full p-6 sm:p-8 rounded-2xl border border-accents-2 bg-background shadow-xs text-center space-y-5 animate-in fade-in duration-200 ${className}`}
    >
      {/* Título de Contexto */}
      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
          {contextTitle || 'Un proyecto que está dando sus primeros pasos'}
        </h3>
        <p className="text-xs sm:text-sm text-accents-5 leading-relaxed max-w-2xl mx-auto">
          {contextDescription ||
            'Esta plataforma es totalmente nueva y por eso aún no tiene muchas cosas. La estoy construyendo poco a poco, con mucha dedicación y cuidado en cada detalle.'}
        </p>
      </div>

      {/* Mensaje Cálido de Amor, Ánimo y Caminar con Dios */}
      <div className="p-5 sm:p-6 rounded-2xl bg-accents-1/40 border border-accents-2 text-left space-y-3.5 shadow-xs">
        <h4 className="text-sm font-bold text-foreground tracking-tight">
          Un abrazo de ánimo: Sigue adelante con tu vida y de la mano de Dios
        </h4>

        <p className="text-xs sm:text-[13px] text-foreground/90 leading-relaxed">
          Quiero animarte con todo el corazón a seguir adelante en tu vida, en tus proyectos y en tu crecimiento espiritual. Sin importar las dificultades o el cansancio que puedas sentir hoy, recuerda que Dios te ama profundamente, que Su gracia te sostiene y que cada día es una nueva oportunidad para caminar en Su paz y renovar tus fuerzas.
        </p>

        <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
          Eres muy bienvenido a este espacio. Siéntete libre de disfrutar lo que ya está listo y vuelve cuando gustes; con el tiempo y con la ayuda de Dios iré sumando muchos más libros y herramientas para ti.
        </p>

        <div className="pt-2.5 flex items-center justify-between text-[11px] font-mono text-accents-5 border-t border-accents-2">
          <span className="italic">«Con amor eterno te he amado; por tanto, te prolongué mi misericordia»</span>
          <span className="font-bold text-foreground shrink-0 ml-2">Jeremías 31:3</span>
        </div>
      </div>

      {/* Invitación a seguir navegando */}
      <div className="space-y-3 pt-1">
        <p className="text-xs text-accents-4">
          Te invito a seguir recorriendo la plataforma con tranquilidad y volver frecuentemente, ya que iré sumando más contenido con el tiempo.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {onExploreAvailable && (
            <button
              type="button"
              onClick={onExploreAvailable}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>{availableChapterText}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}

          {activeItemsSummary && (
            <div className="text-[11px] font-mono text-accents-4 w-full">
              {activeItemsSummary}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
