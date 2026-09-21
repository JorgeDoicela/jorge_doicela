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
import { useBiblePassageSafe } from '../../../../shared/context';
import { useTimelineContextSafe } from '../../context/TimelineContext';
import { useBiblicalTimeline } from '../../hooks/useBiblicalTimeline';
import { StudySidePanel } from '../../../../shared/ui';

export const TimelineInspector: React.FC = () => {
  const timelineContext = useTimelineContextSafe();
  const localTimeline = useBiblicalTimeline();
  const timeline = timelineContext || localTimeline;
  const tStudio = useTranslations('Studio');

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
    <StudySidePanel
      side="right"
      title="Ficha Cronológica"
      icon={<Clock className="w-4 h-4 text-amber-500" />}
      storageKey="bible_timeline_inspector_w"
      defaultWidth={360}
      collapseTitle={tStudio('closeInspector') || 'Ocultar inspector'}
    >
      <StudySidePanel.Body className="space-y-4">
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
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
