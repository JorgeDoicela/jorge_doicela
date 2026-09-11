'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EvangelismPathway } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PathwayViewerProps {
  pathways: EvangelismPathway[];
  selectedPathway: EvangelismPathway | null;
  onSelectPathway: (id: string) => void;
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  isLoading: boolean;
}

export const PathwayViewer: React.FC<PathwayViewerProps> = ({
  pathways,
  selectedPathway,
  onSelectPathway,
  activeStepIndex,
  onSelectStep,
  onNextStep,
  onPrevStep,
  isLoading,
}) => {
  const t = useTranslations('Evangelism');
  const [viewMode, setViewMode] = useState<'stepper' | 'full'>('stepper');

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-accents-2/60 rounded-xl w-72" />
        <div className="h-64 bg-accents-2/40 rounded-2xl" />
      </div>
    );
  }

  if (!selectedPathway) {
    return (
      <div className="p-8 text-center border border-accents-2 rounded-xl text-accents-4">
        {t('noPathways')}
      </div>
    );
  }

  const steps = selectedPathway.steps || [];
  const currentStep = steps[activeStepIndex] || steps[0];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Selector de Rutas Evangelísticas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-accents-2 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {pathways.map((pathway) => {
            const isSelected = pathway.id === selectedPathway.id;
            return (
              <button
                key={pathway.id}
                type="button"
                onClick={() => onSelectPathway(pathway.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'bg-accents-1 text-accents-5 hover:text-foreground hover:bg-accents-2 border border-accents-2'
                }`}
              >
                {pathway.title}
              </button>
            );
          })}
        </div>

        {/* Alternador de Modo de Vista */}
        <div className="flex items-center gap-1 border border-accents-2 rounded-lg p-0.5 bg-accents-1">
          <button
            type="button"
            onClick={() => setViewMode('stepper')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              viewMode === 'stepper'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            <span>{t('stepByStep')}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              viewMode === 'full'
                ? 'bg-background text-foreground shadow-2xs font-semibold'
                : 'text-accents-4 hover:text-foreground'
            }`}
          >
            <span>{t('fullView')}</span>
          </button>
        </div>
      </div>

      {/* Encabezado y Descripción de la Ruta */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4 font-semibold">
            {selectedPathway.theologicalFocus || t('pathwayBadge')}
          </span>
          <span className="text-accents-3 select-none">•</span>
          <span className="text-xs text-accents-4 font-mono">
            {steps.length} {t('stepsCount')}
          </span>
        </div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          {selectedPathway.title}
        </h2>
        {selectedPathway.subtitle && (
          <p className="text-xs text-accents-5 font-serif italic">
            {selectedPathway.subtitle}
          </p>
        )}
        <p className="text-xs text-accents-5 leading-relaxed pt-1">
          {selectedPathway.description}
        </p>
      </div>

      {/* Vista Paso a Paso (Interactivo con barra de progresión) */}
      {viewMode === 'stepper' && currentStep && (
        <div className="space-y-4">
          {/* Barra de Pasos / Progreso */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {steps.map((step, idx) => {
              const isCurrent = idx === activeStepIndex;
              const isDone = idx < activeStepIndex;
              return (
                <button
                  key={step.order}
                  type="button"
                  onClick={() => onSelectStep(idx)}
                  className={`flex-1 min-w-[60px] h-7 rounded border text-xs font-mono transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-foreground bg-foreground text-background font-bold'
                      : isDone
                      ? 'border-accents-2 bg-background text-foreground font-medium'
                      : 'border-accents-2 bg-transparent text-accents-4 hover:border-accents-3'
                  }`}
                >
                  #{step.order} <span className="truncate hidden sm:inline text-[11px] font-normal">{step.reference.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Tarjeta de Paso Exegético Activo */}
          <div className="p-5 sm:p-6 rounded-xl border border-accents-2 bg-background space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-accents-2 pb-3.5">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
                  {t('step')} {currentStep.order} {t('of')} {steps.length}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {currentStep.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-foreground shrink-0">
                {currentStep.reference}
              </span>
            </div>

            {/* Versículo Bíblico Clave */}
            <blockquote className="border-l-2 border-foreground pl-4 py-1 font-serif text-base sm:text-lg text-foreground italic leading-relaxed">
              "{currentStep.verseText}"
            </blockquote>

            {/* Exposición Teológica */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-accents-4 font-semibold">
                {t('expositionTitle')}
              </h4>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {currentStep.exposition}
              </p>
            </div>

            {/* Pregunta de Reflexión */}
            {currentStep.reflectionQuestion && (
              <div className="space-y-1 pt-3 border-t border-accents-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accents-4 font-semibold block">
                  {t('reflectionTitle')}
                </span>
                <p className="text-xs sm:text-sm text-foreground italic">
                  "{currentStep.reflectionQuestion}"
                </p>
              </div>
            )}

            {/* Llamado a la Acción */}
            {currentStep.actionCall && (
              <div className="space-y-1 pt-3 border-t border-accents-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accents-4 font-semibold block">
                  {t('actionCallTitle')}
                </span>
                <p className="text-xs sm:text-sm text-foreground font-medium">
                  {currentStep.actionCall}
                </p>
              </div>
            )}

            {/* Controles de Navegación de Pasos */}
            <div className="flex items-center justify-between pt-3 border-t border-accents-2">
              <button
                type="button"
                onClick={onPrevStep}
                disabled={isFirstStep}
                className="h-8 px-3 rounded-lg border border-accents-2 bg-background hover:bg-accents-1 text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('previous')}</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectStep(0)}
                className="text-xs font-mono text-accents-4 hover:text-foreground transition-colors cursor-pointer"
              >
                {t('reset')}
              </button>

              <button
                type="button"
                onClick={onNextStep}
                disabled={isLastStep}
                className="h-8 px-4 rounded-lg bg-foreground text-background hover:opacity-90 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <span>{isLastStep ? t('finished') : t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista Completa Editorial (Vertical sin interrupciones) */}
      {viewMode === 'full' && (
        <div className="space-y-6 pt-2">
          {steps.map((step) => (
            <div
              key={step.order}
              className="p-5 sm:p-6 rounded-xl border border-accents-2 bg-background space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2 border-b border-accents-2 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-accents-4 font-semibold">
                    #{step.order}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {step.title}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {step.reference}
                </span>
              </div>

              <blockquote className="border-l-2 border-foreground pl-3 py-0.5 font-serif text-sm text-foreground italic leading-relaxed">
                "{step.verseText}"
              </blockquote>

              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {step.exposition}
              </p>

              {step.actionCall && (
                <div className="pt-2 border-t border-accents-2/60">
                  <span className="font-mono text-[10px] uppercase font-semibold text-accents-4 block mb-0.5">
                    {t('actionCallTitle')}:
                  </span>
                  <p className="text-xs text-foreground font-medium">
                    {step.actionCall}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
