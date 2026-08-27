'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
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
  onSelectRegion?: (region: 'all' | 'holyland' | 'greece_asia' | 'egypt_sinai') => void;
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
  onSelectRegion,
  zoomLevel,
}) => {
  const t = useTranslations('HistoricalContext');

  return (
    <div className="flex flex-col gap-3 p-3.5 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md">
      {/* Fila 1: Buscador, Presets de Región y Selector de Capas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Buscador de Lugares */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
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
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-accents-4 hover:text-foreground text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Enfoque Rapido por Regiones Biblicas */}
        {onSelectRegion && (
          <div className="flex items-center gap-1 p-1 bg-accents-1 border border-accents-2 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => onSelectRegion('all')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-accents-5 hover:text-foreground hover:bg-background transition-all cursor-pointer"
            >
              {t('allWorld')}
            </button>
            <button
              type="button"
              onClick={() => onSelectRegion('holyland')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-accents-5 hover:text-foreground hover:bg-background transition-all cursor-pointer"
            >
              {t('holyLand')}
            </button>
            <button
              type="button"
              onClick={() => onSelectRegion('greece_asia')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-accents-5 hover:text-foreground hover:bg-background transition-all cursor-pointer"
            >
              {t('greeceAsia')}
            </button>
            <button
              type="button"
              onClick={() => onSelectRegion('egypt_sinai')}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium text-accents-5 hover:text-foreground hover:bg-background transition-all cursor-pointer"
            >
              {t('egyptSinai')}
            </button>
          </div>
        )}

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
            {t('papyrusLayer')}
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
            {t('topographicLayer')}
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
            {t('satelliteLayer')}
          </button>
        </div>

        {/* Controles de Zoom */}
        <div className="flex items-center gap-1 bg-accents-1 border border-accents-2 p-1 rounded-lg">
          <button
            type="button"
            onClick={onZoomOut}
            className="w-7 h-7 flex items-center justify-center rounded text-accents-5 hover:text-foreground hover:bg-background transition-colors text-sm font-bold cursor-pointer"
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
          >
            +
          </button>
          <button
            type="button"
            onClick={onResetView}
            className="px-2 h-7 flex items-center justify-center rounded text-[10px] font-mono text-accents-5 hover:text-foreground hover:bg-background transition-colors cursor-pointer"
          >
            {t('reset')}
          </button>
        </div>
      </div>

      {/* Fila 2: Filtros por Período Histórico y Categoría */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-accents-2/70 text-xs">
        {/* Período Bíblico */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[11px] text-accents-4 font-mono mr-1">{t('era')}</span>
          {(
            [
              { id: 'all', label: t('allEras') },
              { id: 'patriarchs', label: t('patriarchs') },
              { id: 'exodus_conquest', label: t('exodusJoshua') },
              { id: 'monarchy', label: t('monarchy') },
              { id: 'second_temple', label: t('gospels') },
              { id: 'apostolic', label: t('apostolic') },
            ] as const
          ).map((era) => (
            <button
              key={era.id}
              type="button"
              onClick={() => onChangeEra(era.id as HistoricalEra)}
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
          <span className="text-[11px] text-accents-4 font-mono mr-1">{t('type')}</span>
          {(
            [
              { id: 'all', label: t('allTypes') },
              { id: 'city', label: t('cities') },
              { id: 'mountain', label: t('mountains') },
              { id: 'water', label: t('waters') },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChangeCategory(cat.id as PlaceCategory | 'all')}
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
