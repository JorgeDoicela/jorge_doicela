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
    <div className="p-4 rounded-xl border border-accents-2 bg-background/90 backdrop-blur-md shadow-lg space-y-3">
      <div className="flex items-center justify-between border-b border-accents-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Sincronismo Bíblico e Histórico en el Año{' '}
            <span className="text-rose-500 font-mono text-sm">{cursorYearBC} a.C.</span>
          </h3>
        </div>
        <span className="text-[10px] font-mono text-accents-4">
          Haz clic en cualquier entidad para abrir su ficha completa
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Reyes de Judá Activos */}
        <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold block">
            Trono de Judá (Sur)
          </span>
          {judahMonarchs.length > 0 ? (
            judahMonarchs.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectItem({ type: 'monarch', data: m })}
                className="w-full text-left p-1.5 rounded bg-background/60 hover:bg-blue-900/40 text-xs text-foreground font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>{m.name}</span>
                <span className="text-[10px] font-serif text-amber-400">
                  {m.originalName.hebrew}
                </span>
              </button>
            ))
          ) : (
            <p className="text-[11px] text-accents-4 italic">Sin monarca o en cautiverio</p>
          )}
        </div>

        {/* Reyes de Israel Activos */}
        <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/30 space-y-1">
          <span className="text-[10px] font-mono text-red-400 uppercase font-semibold block">
            Trono de Israel (Norte)
          </span>
          {israelMonarchs.length > 0 ? (
            israelMonarchs.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectItem({ type: 'monarch', data: m })}
                className="w-full text-left p-1.5 rounded bg-background/60 hover:bg-red-900/40 text-xs text-foreground font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>{m.name}</span>
                <span className="text-[10px] font-serif text-amber-400">
                  {m.originalName.hebrew}
                </span>
              </button>
            ))
          ) : (
            <p className="text-[11px] text-accents-4 italic">
              {cursorYearBC < 722 ? 'Reino disuelto tras caída de Samaria' : 'Antes de la división del reino'}
            </p>
          )}
        </div>

        {/* Profetas Activos */}
        <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block">
            Profetas Contemporáneos
          </span>
          {activeProphets.length > 0 ? (
            activeProphets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectItem({ type: 'prophet', data: p })}
                className="w-full text-left p-1.5 rounded bg-background/60 hover:bg-emerald-900/40 text-xs text-foreground font-semibold flex items-center justify-between cursor-pointer"
              >
                <span>{p.name}</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {p.startYearBC}-{p.endYearBC}
                </span>
              </button>
            ))
          ) : (
            <p className="text-[11px] text-accents-4 italic">Período de silencio o profetas orales</p>
          )}
        </div>

        {/* Imperios Mundiales */}
        <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 space-y-1">
          <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold block">
            Potencia Mundial
          </span>
          {activeEmpires.length > 0 ? (
            activeEmpires.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onSelectItem({ type: 'empire', data: e })}
                className="w-full text-left p-1.5 rounded bg-background/60 hover:bg-purple-900/40 text-xs text-foreground font-semibold flex flex-col cursor-pointer"
              >
                <span>{e.rulerName}</span>
                <span className="text-[10px] font-mono text-purple-300">{e.name.split('(')[0]}</span>
              </button>
            ))
          ) : (
            <p className="text-[11px] text-accents-4 italic">Poderes regionales locales</p>
          )}
        </div>

        {/* Hitos Arqueológicos */}
        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block">
            Hito Arqueológico Fechado
          </span>
          {nearbyMilestones.length > 0 ? (
            nearbyMilestones.slice(0, 2).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectItem({ type: 'milestone', data: m })}
                className="w-full text-left p-1.5 rounded bg-background/60 hover:bg-amber-900/40 text-xs text-foreground font-semibold truncate cursor-pointer"
                title={m.title}
              >
                <span className="truncate block">{m.title}</span>
                <span className="text-[10px] font-mono text-amber-300">
                  {m.yearBC} {m.isAD ? 'd.C.' : 'a.C.'}
                </span>
              </button>
            ))
          ) : (
            <p className="text-[11px] text-accents-4 italic">Sin inscripción monumental exacta</p>
          )}
        </div>
      </div>
    </div>
  );
};
