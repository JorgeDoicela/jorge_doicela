'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  X,
  BookOpen,
  Sparkles,
  Shield,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useEvangelismContextSafe } from '../../context/EvangelismContext';

export const EvangelismInspector: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const evangelism = useEvangelismContextSafe();
  const tStudio = useTranslations('Studio');

  const isOpen = passageContext?.isRightInspectorOpen ?? true;
  const handleClose = passageContext?.closeInspector ?? (() => {});

  if (!isOpen) return null;

  const activeTab = evangelism?.activeTab ?? 'pathways';
  const pathway = evangelism?.selectedPathway;
  const activeStep = pathway?.steps[evangelism?.activeStepIndex || 0];
  const totalSteps = pathway?.steps.length || 0;
  const currentStepNum = (evangelism?.activeStepIndex || 0) + 1;

  const tract = evangelism?.selectedTract;

  return (
    <>
      {/* Backdrop en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Inspector de Evangelización"
        className="fixed inset-y-0 right-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-88 xl:w-96 flex-shrink-0 border-l border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden"
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio Izquierdo (Estilo DIITRA) */}
        <div
          className="hidden lg:flex absolute top-0 -left-3 w-6 h-full cursor-pointer z-30 group/border items-center justify-center select-none"
          onClick={handleClose}
          title={tStudio('closeInspector') || 'Ocultar inspector'}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover/border:bg-zinc-400 dark:group-hover/border:bg-zinc-500 transition-colors duration-150" />
          <div className="relative z-10 w-6 h-7 rounded-md bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-700 shadow-sm opacity-0 group-hover/border:opacity-100 hover:scale-110 hover:border-zinc-500 dark:hover:border-zinc-400 transition-all duration-150 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <svg
              className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="2" x2="8" y2="14" />
              <polyline points="4 6 1 8 4 10" />
              <polyline points="12 6 15 8 12 10" />
            </svg>
          </div>
        </div>

        {/* Cabecera Móvil */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Asistente de Evangelismo
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cabecera del Inspector Especializado */}
        <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {activeTab === 'pathways' && 'Guía de la Ruta Activa'}
                {activeTab === 'objections' && 'Defensa de la Fe (1 Pe 3:15)'}
                {activeTab === 'tracts' && 'Bosquejo del Tratado'}
              </span>
            </div>
            {activeTab === 'pathways' && totalSteps > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                Paso {currentStepNum} de {totalSteps}
              </span>
            )}
          </div>
        </div>

        {/* Contenido Contextual del Asistente */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {/* CASO 1: MODO RUTAS DE EVANGELISMO */}
          {activeTab === 'pathways' && activeStep && (
            <div className="space-y-4">
              {/* Tarjeta del Paso Activo */}
              <div className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xs space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                  Cita Bíblica Central
                </span>
                <div className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  {activeStep.reference}
                </div>
                <blockquote className="border-l-2 border-emerald-500 pl-3 italic text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  «{activeStep.verseText}»
                </blockquote>
              </div>

              {/* Exposición Teológica del Paso */}
              <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-black/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>Exposición Teológica</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {activeStep.exposition}
                </p>
              </div>

              {/* Pregunta para el Diálogo */}
              <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Pregunta de Reflexión</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                  {activeStep.reflectionQuestion}
                </p>
              </div>

              {/* Desafío o Llamado a la Acción */}
              {activeStep.actionCall && (
                <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Llamado a la Fe</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                    {activeStep.actionCall}
                  </p>
                </div>
              )}

              {/* Stepper de Navegación Rápida entre Pasos */}
              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={evangelism?.prevStep}
                  disabled={(evangelism?.activeStepIndex || 0) === 0}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={evangelism?.nextStep}
                  disabled={(evangelism?.activeStepIndex || 0) === totalSteps - 1}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* CASO 2: MODO OBJECIONES APOLOGÉTICAS */}
          {activeTab === 'objections' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                  Regla de Oro de la Apologética
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  «El objetivo nunca es ganar una discusión intelectual humillando a la persona, sino derribar fortalezas mentales y guiar cautivo todo pensamiento a la obediencia a Cristo con mansedumbre.»
                </p>
              </div>

              <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-black/60 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  <span>Método Socrático de Jesús</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Cuando te hagan una objeción agresiva, responde primero con una pregunta aclaratoria: «¿Por qué es importante eso para ti?» o «¿Qué quieres decir exactamente con esa palabra?». Esto desarma la hostilidad y toca el corazón.
                </p>
              </div>
            </div>
          )}

          {/* CASO 3: MODO TRATADOS */}
          {activeTab === 'tracts' && tract && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-900/60 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">
                  Folleto Seleccionado
                </span>
                <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {tract.title}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {tract.summary}
                </p>
              </div>

              {tract.prayerOfFaith && (
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                    Oración de Entrega y Arrepentimiento
                  </span>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                    «{tract.prayerOfFaith}»
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
