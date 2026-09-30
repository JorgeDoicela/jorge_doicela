import React from 'react';

interface SlideVisualProps {
  isEs: boolean;
}

export const SoftwareSlideVisual: React.FC<SlideVisualProps> = ({ isEs }) => {
  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* 3 Columnas con Espaciado de Lectura Ergonómico en Móvil y Jerarquía Editorial en Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-card-border -mt-0 sm:-mt-3 md:-mt-5">
        <div className="flex flex-col gap-1 sm:gap-2 sm:pr-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {isEs ? 'IA & Razonamiento' : 'AI & Reasoning'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Modelos LLM, inferencia, agentes autónomos y técnicas avanzadas de RAG.'
              : 'LLM models, inference, autonomous agents, and advanced RAG techniques.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 sm:px-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
            {isEs ? 'Ciberseguridad' : 'Cybersecurity'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Análisis de vulnerabilidades CVE, bastionado de servidores y zero-trust.'
              : 'CVE vulnerability analysis, server hardening, and zero-trust policies.'}
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 sm:pl-6">
          <span className="text-xs sm:text-base md:text-[17px] font-semibold text-foreground uppercase sm:normal-case tracking-wider sm:tracking-tight">
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
