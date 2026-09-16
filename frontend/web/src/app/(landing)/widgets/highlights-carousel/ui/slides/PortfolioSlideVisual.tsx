import React from 'react';

interface SlideVisualProps {
  isEs: boolean;
}

export const PortfolioSlideVisual: React.FC<SlideVisualProps> = ({ isEs }) => {
  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* 3 Pilares Separados por Líneas Sutiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-4 border-t border-card-border">
        <div className="flex flex-col gap-1 sm:pr-6 pb-3 sm:pb-0">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'Arquitectura Limpia' : 'Clean Architecture'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Next.js 16, NestJS 11, TypeScript estricto y persistencia atómica aislada.'
              : 'Next.js 16, NestJS 11, strict TypeScript, and isolated persistence.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:px-6 py-3 sm:py-0">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'Alto Rendimiento' : 'High Performance'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Optimización de recursos en 1 GB de RAM, WebSockets en tiempo real y cero latencia.'
              : 'Resource optimization on 1 GB RAM, real-time WebSockets, and zero latency.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:pl-6 pt-3 sm:pt-0">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
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
