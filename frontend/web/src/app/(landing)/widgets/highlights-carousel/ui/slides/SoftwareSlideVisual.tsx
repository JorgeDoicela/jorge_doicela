import React from 'react';

interface SlideVisualProps {
  isEs: boolean;
}

export const SoftwareSlideVisual: React.FC<SlideVisualProps> = ({ isEs }) => {
  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* 3 Columnas Separadas por Línea Sutil en Desktop y Espaciado Limpio en Móvil */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-0 sm:divide-x divide-card-border pt-3 sm:pt-4 border-t border-card-border">
        <div className="flex flex-col gap-1 sm:pr-6">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'IA & Razonamiento' : 'AI & Reasoning'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Modelos LLM, inferencia, agentes autónomos y técnicas avanzadas de RAG.'
              : 'LLM models, inference, autonomous agents, and advanced RAG techniques.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:px-6">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'Ciberseguridad' : 'Cybersecurity'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Análisis de vulnerabilidades CVE, bastionado de servidores y zero-trust.'
              : 'CVE vulnerability analysis, server hardening, and zero-trust policies.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:pl-6">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'Tutoriales & Foros' : 'Tutorials & Community'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Guías paso a paso, noticias de vanguardia y debate técnico para desarrolladores.'
              : 'Step-by-step guides, cutting-edge news, and developer discussions.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoftwareSlideVisual;
