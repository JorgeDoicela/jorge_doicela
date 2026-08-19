'use client';

import React from 'react';
import { useSyncFilter } from '../hooks/useSyncFilter';
import { TimelineSelectedItem } from '../types';

interface SynchronousComparisonViewProps {
  cursorYearBC: number | null;
  onSelectItem: (item: TimelineSelectedItem) => void;
}

export const SynchronousComparisonView: React.FC<SynchronousComparisonViewProps> = ({
  cursorYearBC,
  onSelectItem,
}) => {
  const { judahMonarchs, israelMonarchs, activeProphets, activeEmpires, nearbyMilestones } =
    useSyncFilter(cursorYearBC);

  if (cursorYearBC === null) return null;

  return (
    <div className="h-[162px] min-h-[162px] max-h-[162px] shrink-0 p-3 sm:p-4 rounded-2xl border border-accents-2 bg-background flex flex-col justify-between shadow-xs select-none">
      <div className="flex items-center justify-between border-b border-accents-2 pb-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Sincronismo Bíblico e Histórico en el Año{' '}
            <span className="text-rose-500 font-mono text-xs sm:text-sm">{cursorYearBC} a.C.</span>
          </h3>
        </div>
        <span className="text-[10px] font-mono text-accents-4 hidden sm:inline">
          Haz clic en la línea de tiempo para fijar el año · Clic en entidad para ver su ficha
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 shrink-0">
        {/* Reyes de Judá Activos */}
        <div className="h-[102px] min-h-[102px] max-h-[102px] p-2.5 rounded-xl border border-accents-2 bg-accents-1/40 flex flex-col justify-start overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-[11px] font-bold text-foreground truncate tracking-tight">
              Trono de Judá (Sur)
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {judahMonarchs.length > 0 ? (
              judahMonarchs.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectItem({ type: 'monarch', data: m })}
                  className="w-full h-7 px-2 rounded bg-background border border-accents-2 hover:border-foreground/40 text-[11px] text-foreground font-semibold flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                >
                  <span className="truncate">{m.name}</span>
                  <span className="text-[10px] font-serif font-bold text-accents-5 shrink-0 ml-1">
                    {m.originalName.hebrew}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-[10.5px] text-accents-4 italic pt-1.5">Sin monarca o en cautiverio</p>
            )}
          </div>
        </div>

        {/* Reyes de Israel Activos */}
        <div className="h-[102px] min-h-[102px] max-h-[102px] p-2.5 rounded-xl border border-accents-2 bg-accents-1/40 flex flex-col justify-start overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span className="text-[11px] font-bold text-foreground truncate tracking-tight">
              Trono de Israel (Norte)
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {israelMonarchs.length > 0 ? (
              israelMonarchs.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectItem({ type: 'monarch', data: m })}
                  className="w-full h-7 px-2 rounded bg-background border border-accents-2 hover:border-foreground/40 text-[11px] text-foreground font-semibold flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                >
                  <span className="truncate">{m.name}</span>
                  <span className="text-[10px] font-serif font-bold text-accents-5 shrink-0 ml-1">
                    {m.originalName.hebrew}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-[10.5px] text-accents-4 italic pt-1.5">
                {cursorYearBC < 722 ? 'Reino disuelto tras Samaria' : 'Antes de la división'}
              </p>
            )}
          </div>
        </div>

        {/* Profetas Activos */}
        <div className="h-[102px] min-h-[102px] max-h-[102px] p-2.5 rounded-xl border border-accents-2 bg-accents-1/40 flex flex-col justify-start overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] font-bold text-foreground truncate tracking-tight">
              Profetas Contemporáneos
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {activeProphets.length > 0 ? (
              activeProphets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectItem({ type: 'prophet', data: p })}
                  className="w-full h-7 px-2 rounded bg-background border border-accents-2 hover:border-foreground/40 text-[11px] text-foreground font-semibold flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-1">
                    {p.startYearBC}-{p.endYearBC}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-[10.5px] text-accents-4 italic pt-1.5">Silencio o profetas orales</p>
            )}
          </div>
        </div>

        {/* Imperios Mundiales */}
        <div className="h-[102px] min-h-[102px] max-h-[102px] p-2.5 rounded-xl border border-accents-2 bg-accents-1/40 flex flex-col justify-start overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            <span className="text-[11px] font-bold text-foreground truncate tracking-tight">
              Potencia Mundial
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {activeEmpires.length > 0 ? (
              activeEmpires.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onSelectItem({ type: 'empire', data: e })}
                  className="w-full h-7 px-2 rounded bg-background border border-accents-2 hover:border-foreground/40 text-[11px] text-foreground font-semibold flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                >
                  <span className="truncate">{e.rulerName}</span>
                  <span className="text-[9.5px] font-mono text-accents-5 font-medium truncate shrink-0 ml-1">
                    {e.name.split('(')[0]}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-[10.5px] text-accents-4 italic pt-1.5">Poderes regionales locales</p>
            )}
          </div>
        </div>

        {/* Hitos Arqueológicos */}
        <div className="h-[102px] min-h-[102px] max-h-[102px] p-2.5 rounded-xl border border-accents-2 bg-accents-1/40 flex flex-col justify-start overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span className="text-[11px] font-bold text-foreground truncate tracking-tight">
              Hito Arqueológico
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {nearbyMilestones.length > 0 ? (
              nearbyMilestones.slice(0, 2).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onSelectItem({ type: 'milestone', data: m })}
                  className="w-full h-7 px-2 rounded bg-background border border-accents-2 hover:border-foreground/40 text-[11px] text-foreground font-semibold truncate cursor-pointer transition-all shadow-2xs"
                  title={m.title}
                >
                  <span className="truncate block">{m.title}</span>
                  <span className="text-[9.5px] font-mono text-amber-600 dark:text-amber-400 font-bold shrink-0 ml-1">
                    {m.yearBC} {m.isAD ? 'd.C.' : 'a.C.'}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-[10.5px] text-accents-4 italic pt-1.5">Sin inscripción exacta</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
