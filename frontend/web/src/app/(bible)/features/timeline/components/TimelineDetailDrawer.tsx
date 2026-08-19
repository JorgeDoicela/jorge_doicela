'use client';

import React from 'react';
import { TimelineSelectedItem } from '../types';

interface TimelineDetailDrawerProps {
  selectedItem: TimelineSelectedItem | null;
  onClose: () => void;
}

export const TimelineDetailDrawer: React.FC<TimelineDetailDrawerProps> = ({
  selectedItem,
  onClose,
}) => {
  if (!selectedItem) return null;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-92 max-w-[calc(100%-2rem)] bg-background/95 backdrop-blur-md border border-accents-2 rounded-xl shadow-2xl p-5 overflow-y-auto z-30 flex flex-col space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Cabecera */}
      <div className="flex items-start justify-between border-b border-accents-2 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest font-semibold block mb-0.5 text-blue-500">
            {selectedItem.type === 'monarch'
              ? selectedItem.data.kingdom === 'united'
                ? 'Monarquía Unida de Israel'
                : selectedItem.data.kingdom === 'judah'
                ? 'Reino de Judá (Sur)'
                : 'Reino de Israel (Norte)'
              : selectedItem.type === 'prophet'
              ? 'Profeta de Yahvé'
              : selectedItem.type === 'empire'
              ? 'Potencia / Imperio Contemporáneo'
              : 'Hito Arqueológico Fechado'}
          </span>
          <h3 className="text-lg font-bold text-foreground leading-tight">
            {selectedItem.type === 'monarch'
              ? selectedItem.data.name
              : selectedItem.type === 'prophet'
              ? selectedItem.data.name
              : selectedItem.type === 'empire'
              ? selectedItem.data.rulerName
              : selectedItem.data.title}
          </h3>
          <p className="text-xs text-accents-5 font-mono">
            {selectedItem.type === 'monarch'
              ? `${selectedItem.data.startYearBC} - ${selectedItem.data.endYearBC} a.C. (${selectedItem.data.reignDurationYears} años)`
              : selectedItem.type === 'prophet'
              ? `${selectedItem.data.startYearBC} - ${selectedItem.data.endYearBC} a.C.`
              : selectedItem.type === 'empire'
              ? `${selectedItem.data.startYearBC} - ${selectedItem.data.endYearBC} a.C.`
              : `${selectedItem.data.yearBC} ${selectedItem.data.isAD ? 'd.C.' : 'a.C.'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer"
          title="Cerrar ficha"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Caso: Monarca */}
      {selectedItem.type === 'monarch' && (
        <div className="space-y-3 text-xs">
          {/* Nombre Original y Evaluación Moral */}
          <div className="p-3 rounded-lg bg-accents-1/60 border border-accents-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-accents-5 font-mono">Hebreo:</span>
              <span className="font-serif text-sm font-bold text-amber-500">
                {selectedItem.data.originalName.hebrew}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-accents-5 font-mono">Significado:</span>
              <span className="italic text-foreground">"{selectedItem.data.originalName.meaning}"</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-accents-2">
              <span className="text-accents-5 font-mono">Evaluación Bíblica:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                  selectedItem.data.evaluation === 'good'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : selectedItem.data.evaluation === 'bad'
                    ? 'bg-red-950 text-red-400 border border-red-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}
              >
                {selectedItem.data.evaluation === 'good'
                  ? 'Hizo lo recto ante Yahvé'
                  : selectedItem.data.evaluation === 'bad'
                  ? 'Hizo lo malo ante los ojos de Yahvé'
                  : 'Reinado Mixto / Desvío final'}
              </span>
            </div>
          </div>

          {/* Hechos Relevantes */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
              Acontecimientos del Reinado
            </h4>
            <ul className="space-y-1">
              {selectedItem.data.keyEvents.map((evt, i) => (
                <li key={i} className="text-foreground/90 flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>{evt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sincronismo y Profetas Contemporáneos */}
          {selectedItem.data.prophetsContemporary.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
                Profetas Contemporáneos
              </h4>
              <div className="flex flex-wrap gap-1">
                {selectedItem.data.prophetsContemporary.map((prof, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]"
                  >
                    {prof}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Corroboración Arqueológica */}
          {selectedItem.data.archaeologicalCorroboration && (
            <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">
                Evidencia Epigráfica / Arqueológica:
              </span>
              <p className="text-foreground/90 text-[11px]">
                {selectedItem.data.archaeologicalCorroboration}
              </p>
            </div>
          )}

          {/* Citas Bíblicas */}
          <div className="space-y-1 pt-1 border-t border-accents-2">
            <span className="text-[10px] font-mono uppercase text-accents-4 block">
              Registros en el Canon:
            </span>
            <div className="flex flex-wrap gap-1">
              {selectedItem.data.biblicalReferences.map((ref, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-background border border-accents-2 text-[10px] font-mono text-blue-400"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Caso: Profeta */}
      {selectedItem.type === 'prophet' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-accents-1/60 border border-accents-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-accents-5 font-mono">Hebreo:</span>
              <span className="font-serif text-sm font-bold text-emerald-400">
                {selectedItem.data.originalName.hebrew}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-accents-5 font-mono">Significado:</span>
              <span className="italic text-foreground">"{selectedItem.data.originalName.meaning}"</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-accents-2">
              <span className="text-accents-5 font-mono">Destinatario:</span>
              <span className="font-mono text-foreground uppercase font-semibold text-[10px]">
                {selectedItem.data.audience === 'judah'
                  ? 'Reino de Judá'
                  : selectedItem.data.audience === 'israel'
                  ? 'Reino de Israel'
                  : selectedItem.data.audience === 'nineveh'
                  ? 'Imperio Asirio / Nínive'
                  : selectedItem.data.audience === 'babylon'
                  ? 'Cautivos en Babilonia'
                  : 'Comunidad del Retorno'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
              Mensaje Central del Oráculo
            </h4>
            <p className="text-foreground/90 leading-relaxed">{selectedItem.data.keyMessage}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
              Pasajes Bíblicos Clave
            </h4>
            <div className="space-y-1">
              {selectedItem.data.keyPassages.map((p, i) => (
                <div key={i} className="p-1.5 rounded border border-accents-2 bg-background font-mono text-[11px] text-emerald-400">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Caso: Imperio */}
      {selectedItem.type === 'empire' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-accents-1/60 border border-accents-2 space-y-1">
            <span className="text-purple-400 font-mono text-[10px] uppercase block font-semibold">
              {selectedItem.data.name}
            </span>
            <p className="text-foreground text-sm font-bold">{selectedItem.data.rulerName}</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
              Interacción con la Historia Bíblica
            </h4>
            <p className="text-foreground/90 leading-relaxed">
              {selectedItem.data.interactionWithBiblicalHistory}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
              Hallazgos Arqueológicos
            </h4>
            <ul className="space-y-1">
              {selectedItem.data.archaeologicalArtifacts.map((art, i) => (
                <li key={i} className="text-foreground/80 flex items-start gap-1.5">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{art}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Caso: Hito Arqueológico */}
      {selectedItem.type === 'milestone' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
            <span className="text-amber-400 font-mono text-[10px] uppercase block font-semibold">
              {selectedItem.data.historicalEra} • {selectedItem.data.location}
            </span>
            <p className="text-foreground text-sm font-bold">{selectedItem.data.artifactFound}</p>
            <p className="text-accents-4 text-[11px] font-mono">
              Ubicación actual: {selectedItem.data.museumLocation}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4">
              Importancia para la Veracidad Bíblica
            </h4>
            <p className="text-foreground/90 leading-relaxed">{selectedItem.data.significance}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-accents-1 border border-accents-2">
            <span className="text-[10px] font-mono uppercase text-accents-4 block mb-0.5">
              Cita Bíblica Vinculada:
            </span>
            <span className="text-xs font-mono font-bold text-blue-400">
              {selectedItem.data.biblicalReference}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
