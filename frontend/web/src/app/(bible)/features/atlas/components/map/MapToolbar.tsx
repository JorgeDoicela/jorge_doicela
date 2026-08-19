'use client';

import React from 'react';
import { HistoricalEra, MapLayerType, PlaceCategory } from '../../types';

interface MapToolbarProps {
  activeLayer: MapLayerType;
  onChangeLayer: (layer: MapLayerType) => void;
  activeEra: HistoricalEra;
  onChangeEra: (era: HistoricalEra) => void;
  selectedCategory: PlaceCategory | 'all';
  onChangeCategory: (category: PlaceCategory | 'all') => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  zoomLevel: number;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({
  activeLayer,
  onChangeLayer,
  activeEra,
  onChangeEra,
  selectedCategory,
  onChangeCategory,
  searchQuery,
  onChangeSearchQuery,
  onZoomIn,
  onZoomOut,
  onResetView,
  zoomLevel,
}) => {
  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md">
      {/* Fila 1: Buscador y Selector de Capas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Buscador de Lugares */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder="Buscar ciudad, monte, río o pasaje..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-accents-2 rounded-lg text-foreground placeholder:text-accents-4 focus:outline-none focus:border-foreground transition-all"
          />
          <svg
            className="w-3.5 h-3.5 text-accents-4 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onChangeSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-accents-4 hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Selector de Capas del Mapa */}
        <div className="flex items-center gap-1 p-1 bg-accents-1 border border-accents-2 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => onChangeLayer('historical')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeLayer === 'historical'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            Papiro Histórico
          </button>
          <button
            type="button"
            onClick={() => onChangeLayer('topographic')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeLayer === 'topographic'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            Topográfico
          </button>
          <button
            type="button"
            onClick={() => onChangeLayer('satellite')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            Satelital Híbrido
          </button>
        </div>

        {/* Controles de Zoom */}
        <div className="flex items-center gap-1 bg-accents-1 border border-accents-2 p-1 rounded-lg">
          <button
            type="button"
            onClick={onZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer"
            title="Alejar mapa"
          >
            −
          </button>
          <span className="text-[10px] font-mono text-accents-4 px-1.5 select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={onZoomIn}
            className="w-7 h-7 flex items-center justify-center rounded text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer"
            title="Acercar mapa"
          >
            +
          </button>
          <button
            type="button"
            onClick={onResetView}
            className="px-2 h-7 flex items-center justify-center rounded text-[10px] font-mono text-accents-5 hover:text-foreground hover:bg-background transition-colors cursor-pointer"
            title="Restablecer vista centrada"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Fila 2: Filtros por Período Histórico y Categoría */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-accents-2/70 text-xs">
        {/* Período Bíblico */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] text-accents-4 font-mono mr-1">Época:</span>
          {(
            [
              { id: 'all', label: 'Todas' },
              { id: 'patriarchs', label: 'Patriarcas' },
              { id: 'exodus_conquest', label: 'Éxodo & Josué' },
              { id: 'monarchy', label: 'Monarquía' },
              { id: 'second_temple', label: 'Evangelios' },
              { id: 'apostolic', label: 'Apostólica' },
            ] as const
          ).map((era) => (
            <button
              key={era.id}
              type="button"
              onClick={() => onChangeEra(era.id)}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                activeEra === era.id
                  ? 'bg-foreground text-background font-semibold'
                  : 'text-accents-5 hover:text-foreground bg-accents-1/60 hover:bg-accents-1'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>

        {/* Filtro por Categoría de Accidente / Lugar */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-accents-4 font-mono mr-1">Tipo:</span>
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'city', label: 'Ciudades' },
              { id: 'mountain', label: 'Montes' },
              { id: 'water', label: 'Masa de Agua' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChangeCategory(cat.id)}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-accents-5 hover:text-foreground bg-accents-1/40 hover:bg-accents-1'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
