'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Sparkles,
  Compass,
  Globe,
  Landmark,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';
import { useAtlasContextSafe } from '../../context/AtlasContext';
import { BookHistoricalProfile } from '../../../../components/BookHistoricalProfile';

export const AtlasInspector: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const atlas = useAtlasContextSafe();
  const tStudio = useTranslations('Studio');

  const isOpen = passageContext?.isRightInspectorOpen ?? true;
  const handleClose = passageContext?.closeInspector ?? (() => {});

  if (!isOpen) return null;

  const place = atlas?.selectedPlace;

  return (
    <>
      {/* Backdrop en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Inspector del Atlas Bíblico"
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
            <Compass className="w-4 h-4 text-rose-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Telemetría WGS84
            </span>
          </div>
        </div>

        {/* Contenido con Scroll del Inspector */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {place ? (
            <div className="space-y-4">
              {/* Encabezado del Lugar */}
              <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold uppercase border border-rose-500/20">
                    {place.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {place.elevationMeters ? `${place.elevationMeters}m s.n.m.` : 'Georreferenciado'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {place.name}
                </h3>
                {place.originalName && (
                  <div className="text-xs font-serif text-zinc-500 dark:text-zinc-400 italic">
                    {place.originalName.hebrew || place.originalName.greek || place.originalName.transliteration}
                    {place.originalName.meaning ? ` ("${place.originalName.meaning}")` : ''}
                  </div>
                )}
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Telemetría WGS84 */}
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Coordenadas Geográficas WGS84</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-zinc-400 block text-[9px] uppercase">Latitud</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{place.coordinates.lat.toFixed(4)}° N</span>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-zinc-400 block text-[9px] uppercase">Longitud</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{place.coordinates.lng.toFixed(4)}° E</span>
                  </div>
                </div>
                {place.modernName && (
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>Nombre moderno: <strong className="text-zinc-700 dark:text-zinc-300">{place.modernName}</strong></span>
                  </div>
                )}
              </div>

              {/* Hallazgos Arqueológicos Locales */}
              {place.archaeologicalNotes && (
                <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Evidencia Arqueológica</span>
                    </div>
                    {place.archaeologicalNotes.verifiedByBiblicalArchaeology && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                        Verificado
                      </span>
                    )}
                  </div>
                  {place.archaeologicalNotes.excavationStatus && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-300">
                      <strong>Estado:</strong> {place.archaeologicalNotes.excavationStatus}
                    </p>
                  )}
                  {place.archaeologicalNotes.discoveries && place.archaeologicalNotes.discoveries.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                      {place.archaeologicalNotes.discoveries.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Referencias Bíblicas */}
              {place.biblicalReferences && place.biblicalReferences.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-1">
                    Referencias Bíblicas Clave
                  </span>
                  <div className="space-y-1.5">
                    {place.biblicalReferences.map((ref, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs space-y-0.5"
                      >
                        <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200">
                          {ref.reference}
                        </span>
                        {ref.context && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {ref.context}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                <Compass className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Ningún lugar seleccionado
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Haz clic en cualquier punto del mapa vectorial o en la lista lateral para inspeccionar su telemetría y contexto.
                </p>
              </div>

              {/* Perfil del Libro Activo como fallback informativo */}
              <BookHistoricalProfile />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
