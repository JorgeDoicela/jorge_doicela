import React from 'react';

interface SlideVisualProps {
  isEs: boolean;
}

export const SoftwareSlideVisual: React.FC<SlideVisualProps> = ({ isEs }) => {
  return (
    <div className="w-full flex flex-col justify-center text-left py-1">
      {/* Columnas Separadas por Línea Sutil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-4 border-t border-card-border">
        <div className="flex flex-col gap-1.5 sm:pr-8 pb-4 sm:pb-0">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'IA Generativa & Modelos de Razonamiento' : 'Generative AI & Reasoning Models'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Arquitecturas de inferencia, evaluación de benchmarks, agentes autónomos y técnicas avanzadas de prompting y RAG.'
              : 'Inference architectures, benchmark evaluations, autonomous agents, and advanced prompting and RAG techniques.'}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:pl-8 pt-4 sm:pt-0">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {isEs ? 'Ciberseguridad & Defensa Activa' : 'Cybersecurity & Active Defense'}
          </span>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {isEs
              ? 'Análisis de vulnerabilidades, auditorías de dependencias, protección de APIs y políticas de seguridad zero-trust.'
              : 'Vulnerability analysis, dependency audits, API protection, and zero-trust security policies.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoftwareSlideVisual;
