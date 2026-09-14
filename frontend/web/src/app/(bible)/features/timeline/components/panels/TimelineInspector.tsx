'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Clock,
  Crown,
  ScrollText,
  Globe,
  Sparkles,
  BookOpen,
  Landmark,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';
import { useBiblicalTimeline } from '../../hooks/useBiblicalTimeline';

export const TimelineInspector: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const timeline = useBiblicalTimeline();
  const tStudio = useTranslations('Studio');

  const isOpen = passageContext?.isRightInspectorOpen ?? true;
  const handleClose = passageContext?.closeInspector ?? (() => {});

  if (!isOpen) return null;

  const item = timeline.selectedItem;

  const itemTitle = item
    ? item.type === 'monarch'
      ? item.data.name
      : item.type === 'prophet'
      ? item.data.name
      : item.type === 'empire'
      ? item.data.rulerName
      : item.data.title
    : '';

  const itemYears = item
    ? item.type === 'milestone'
      ? `${item.data.yearBC} ${item.data.isAD ? 'd.C.' : 'a.C.'}`
      : `${item.data.startYearBC} - ${item.data.endYearBC} a.C.`
    : '';

  const originalName = item
    ? item.type === 'monarch' || item.type === 'prophet'
      ? item.data.originalName
      : undefined
    : undefined;

  const references: string[] = item
    ? item.type === 'monarch' || item.type === 'empire'
      ? item.data.biblicalReferences
      : item.type === 'prophet'
      ? item.data.keyPassages
      : item.data.biblicalReference
      ? [item.data.biblicalReference]
      : []
    : [];

  return (
    <>
      {/* Backdrop en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Inspector de la Cronología Sincrónica"
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
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Ficha Cronológica
            </span>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {item ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase border border-amber-500/20">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {itemYears}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {itemTitle}
                </h3>
                {originalName?.hebrew && (
                  <div className="text-xs font-serif text-zinc-500 dark:text-zinc-400">
                    {originalName.hebrew} {originalName.meaning ? `("${originalName.meaning}")` : ''}
                  </div>
                )}
              </div>

              {/* Detalles Específicos por Tipo */}
              {item.type === 'monarch' && (
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Reino:</span>
                    <span className="font-semibold uppercase text-zinc-700 dark:text-zinc-300">{item.data.kingdom}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Evaluación:</span>
                    <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">{item.data.evaluation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Duración:</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{item.data.reignDurationYears} años</span>
                  </div>
                  {item.data.archaeologicalCorroboration && (
                    <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                        Corroboración Arqueológica
                      </span>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {item.data.archaeologicalCorroboration}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {item.type === 'prophet' && (
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Audiencia:</span>
                    <span className="font-semibold capitalize text-zinc-700 dark:text-zinc-300">{item.data.audience}</span>
                  </div>
                  {item.data.biblicalBook && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Libro Canónico:</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.data.biblicalBook}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                      Mensaje Central
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {item.data.keyMessage}
                    </p>
                  </div>
                </div>
              )}

              {item.type === 'empire' && (
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Imperio:</span>
                    <span className="font-semibold uppercase text-zinc-700 dark:text-zinc-300">{item.data.empire}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                      Interacción Bíblica
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {item.data.interactionWithBiblicalHistory}
                    </p>
                  </div>
                </div>
              )}

              {item.type === 'milestone' && (
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Ubicación:</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.data.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Museo / Custodia:</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.data.museumLocation}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                      Significado Histórico
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      {item.data.significance}
                    </p>
                  </div>
                </div>
              )}

              {/* Referencias Bíblicas */}
              {references.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-1">
                    Citas y Pasajes Bíblicos
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {references.map((ref, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
              <Clock className="w-8 h-8 text-amber-500/60 mx-auto" />
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Ningún evento seleccionado
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Haz clic sobre cualquier monarca, profeta o imperio en la cinta horizontal para examinar su sincronismo histórico y referencias bíblicas.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
