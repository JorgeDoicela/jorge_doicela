'use client';

import React, { useEffect } from 'react';
import { AncientPlace } from '../../types';

interface PlaceDetailsDrawerProps {
  place: AncientPlace | null;
  onClose: () => void;
}

export const PlaceDetailsDrawer: React.FC<PlaceDetailsDrawerProps> = ({ place, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!place) return null;

  return (
    <div className="absolute inset-x-3 bottom-3 max-h-[82%] sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-4 sm:w-88 sm:max-w-[calc(100%-2rem)] sm:max-h-none bg-background/95 backdrop-blur-md border border-accents-2 rounded-2xl sm:rounded-xl shadow-2xl p-4 sm:p-5 overflow-y-auto z-30 flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-200">
      {/* Cabecera */}
      <div className="flex items-start justify-between border-b border-accents-2 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-500 font-semibold">
            {place.category === 'city'
              ? 'Ciudad Bíblica'
              : place.category === 'mountain'
              ? 'Monte Sagrado'
              : place.category === 'water'
              ? 'Masa de Agua'
              : 'Sitio Arqueológico'}
          </span>
          <h3 className="text-lg font-bold text-foreground leading-tight">{place.name}</h3>
          <p className="text-xs text-accents-5 font-mono">
            {place.modernName} • {place.country}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer"
          title="Cerrar detalles"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Datos lingüísticos y etimología */}
      <div className="p-3 rounded-lg bg-accents-1/60 border border-accents-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-accents-5 font-mono">Original:</span>
          <span className="font-serif text-sm font-bold text-amber-500">
            {place.originalName.hebrew || place.originalName.greek}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-accents-5 font-mono">Transliteración:</span>
          <span className="font-mono text-foreground">{place.originalName.transliteration}</span>
        </div>
        <div className="text-xs pt-1 border-t border-accents-2">
          <span className="text-accents-4">Significado: </span>
          <span className="text-foreground italic font-medium">"{place.originalName.meaning}"</span>
        </div>
        {place.elevationMeters !== undefined && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-accents-2">
            <span className="text-accents-5 font-mono">Elevación:</span>
            <span className="font-mono text-foreground font-semibold">
              {place.elevationMeters > 0 ? `+${place.elevationMeters} m` : `${place.elevationMeters} m b.n.m.`}
            </span>
          </div>
        )}
      </div>

      {/* Descripción histórica */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-accents-5">
          Significado Teológico & Histórico
        </h4>
        <p className="text-xs text-foreground/90 leading-relaxed">{place.description}</p>
      </div>

      {/* Referencias Bíblicas Clave */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase text-accents-4 block mb-1">
          Pasajes Bíblicos Clave:
        </span>
        <div className="space-y-1.5">
          {place.biblicalReferences.map((ref, i) => (
            <div key={i} className="p-2 rounded-md border border-accents-2 bg-background text-xs space-y-0.5">
              <span className="font-semibold text-blue-500 font-mono text-[11px] block">{ref.reference}</span>
              <p className="text-accents-5 text-[11px] leading-snug">{ref.context}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Arqueología */}
      {place.archaeologicalNotes && (
        <div className="space-y-2 pt-2 border-t border-accents-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Evidencia Arqueológica
            </h4>
          </div>
          <p className="text-[11px] text-accents-4 font-mono">{place.archaeologicalNotes.excavationStatus}</p>
          <ul className="space-y-1">
            {place.archaeologicalNotes.discoveries.map((disc, idx) => (
              <li key={idx} className="text-[11px] text-foreground/80 flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{disc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
