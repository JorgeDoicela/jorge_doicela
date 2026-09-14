'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  X,
  MapPin,
  Sparkles,
  Compass,
  Globe,
  BookOpen,
  ArrowRight,
  Landmark,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';
import { useAtlasContextSafe } from '../../context/AtlasContext';
import { BookHistoricalProfile } from '../../../../components/BookHistoricalProfile';

export const HistoricalInspector: React.FC = () => {
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
        aria-label="Inspector Arqueológico y Geográfico"
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
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Ficha Arqueológica
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
              <Landmark className="w-3.5 h-3.5 text-amber-500" />
              <span>{place ? 'Registro del Lugar Bíblico' : 'Contexto del Libro Activo'}</span>
            </div>
            {place && (
              <button
                type="button"
                onClick={() => atlas?.setSelectedPlaceId(null)}
                className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                Limpiar selección
              </button>
            )}
          </div>
        </div>

        {/* Contenido Contextual del Inspector */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {place ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Tarjeta Principal del Lugar */}
              <div className="p-4 rounded-xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {place.category}
                  </span>
                  {place.country && (
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      {place.country}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                  {place.name}
                </h3>

                {place.modernName && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                    Nombre moderno: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{place.modernName}</span>
                  </p>
                )}
              </div>

              {/* Telemetría y Coordenadas Georreferenciadas WGS84 */}
              <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-black/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Georreferenciación WGS84</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="bg-white/60 dark:bg-zinc-900/60 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400 block">Latitud</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {typeof place.coordinates === 'object' && place.coordinates && 'lat' in place.coordinates
                        ? `${(place.coordinates as any).lat}°`
                        : '31.7767° N'}
                    </span>
                  </div>
                  <div className="bg-white/60 dark:bg-zinc-900/60 p-2 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60">
                    <span className="text-[10px] text-zinc-400 block">Longitud</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {typeof place.coordinates === 'object' && place.coordinates && 'lng' in place.coordinates
                        ? `${(place.coordinates as any).lng}°`
                        : '35.2345° E'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Época Bíblica */}
              {place.era && place.era.length > 0 && (
                <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                    <span>Presencia en Épocas Bíblicas</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {place.era.map((e) => (
                      <span
                        key={e}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de Enlace al Lector Bíblico */}
              <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
                <Link
                  href={`/study/standard?book=GEN&chapter=1`}
                  className="w-full py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Consultar pasajes relacionados en el Lector</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/40 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Exploración Interactiva</span>
                </div>
                <p>
                  Haz clic en cualquier punto del mapa cartográfico o selecciona una ciudad en el panel izquierdo para ver su ficha arqueológica completa.
                </p>
              </div>

              {/* Ficha Histórica del Libro Canónico como alternativa enriquecedora */}
              <BookHistoricalProfile />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
