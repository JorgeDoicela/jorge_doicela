import React from 'react';

interface SlideVisualProps {
  isEs: boolean;
}

export const PortfolioSlideVisual: React.FC<SlideVisualProps> = ({ isEs }) => {
  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* 3 Pilares con Espaciado de Lectura Ergonómico en Móvil y Jerarquía Editorial en Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-card-border -mt-0 sm:-mt-3 md:-mt-5">
        <div className="flex flex-col gap-1 sm:gap-2 sm:pr-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {isEs ? 'Arquitectura Limpia' : 'Clean Architecture'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Next.js 16, NestJS 11, TypeScript estricto y persistencia atómica aislada.'
              : 'Next.js 16, NestJS 11, strict TypeScript, and isolated persistence.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 sm:px-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {isEs ? 'Alto Rendimiento' : 'High Performance'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Optimización avanzada de recursos, WebSockets en tiempo real y baja latencia.'
              : 'Advanced resource optimization, real-time WebSockets, and low latency.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 sm:pl-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {isEs ? 'Soluciones End-to-End' : 'End-to-End Delivery'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Diseño de experiencia UX/UI, desarrollo full stack y despliegue continuo con CI/CD.'
              : 'UX/UI experience design, full stack development, and continuous CI/CD deployment.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSlideVisual;
