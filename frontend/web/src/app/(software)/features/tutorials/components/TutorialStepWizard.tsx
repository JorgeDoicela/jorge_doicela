'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { TutorialStep } from '../types';
import { MarkdownRenderer } from '../../../components/MarkdownRenderer';
import { CodeBlock } from '../../../components/markdown';

interface TutorialStepWizardProps {
  steps: TutorialStep[];
}

export function TutorialStepWizard({ steps }: TutorialStepWizardProps) {
  const tDetail = useTranslations('Detail');
  const [activeStep, setActiveStep] = useState(0);

  if (!steps || steps.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-zinc-500 font-mono">{tDetail('noSteps')}</p>
      </div>
    );
  }

  const currentStep = steps[activeStep] || steps[0];

  return (
    <div className="space-y-6">
      {/* Selector de Pasos en Pills Horizontales */}
      {steps.length > 1 && (
        <nav
          aria-label={tDetail('stepsIndex', { count: steps.length })}
          className="flex flex-wrap items-center gap-2 pb-2"
        >
          {steps.map((st, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={st.id || idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'glass-concave-panel text-blue-600 dark:text-cyan-400 font-bold border border-blue-500/30 dark:border-cyan-500/30 shadow-xs'
                    : 'glass-convex-panel text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-black/5 dark:border-white/5'
                }`}
              >
                <span className="opacity-60 text-[10px]">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span className="truncate max-w-[180px]">{st.title}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Encabezado del Paso Activo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5 dark:border-white/5">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {tDetail('stepLabel', { step: activeStep + 1, title: currentStep.title })}
        </h3>
        <span className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-semibold self-start sm:self-auto">
          {tDetail('stepOf', { current: activeStep + 1, total: steps.length })}
        </span>
      </div>

      {/* Imagen del paso si existe */}
      {currentStep.imageUrl && (
        <div className="relative w-full aspect-[16/9] max-h-80 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 shadow-inner bg-black/5 dark:bg-white/5">
          <Image
            src={currentStep.imageUrl}
            alt={currentStep.title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      {/* Contenido Markdown del paso */}
      {currentStep.contentMarkdown && (
        <div className="py-2">
          <MarkdownRenderer content={currentStep.contentMarkdown} />
        </div>
      )}

      {/* Bloque de Código del paso */}
      {currentStep.codeSnippet && (
        <div className="pt-2">
          <CodeBlock
            code={currentStep.codeSnippet}
            language={currentStep.codeLanguage || 'bash'}
          />
        </div>
      )}

      {/* Botones de Navegación entre Pasos */}
      {steps.length > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 rounded-xl glass-concave-panel text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {tDetail('prevStep')}
          </button>
          <button
            type="button"
            onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={activeStep === steps.length - 1}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-md hover:shadow-blue-500/25"
          >
            {tDetail('nextStep')}
          </button>
        </div>
      )}
    </div>
  );
}
