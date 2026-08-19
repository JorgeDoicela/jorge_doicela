'use client';

import React, { useState } from 'react';
import { AtlasSubTab } from '../types';
import { useAtlasMap } from '../hooks/useAtlasMap';
import { MapToolbar } from './map/MapToolbar';
import { InteractiveMapCanvas } from './map/InteractiveMapCanvas';
import { PlaceDetailsDrawer } from './map/PlaceDetailsDrawer';
import { HistoricalRoutesPlayer } from './routes/HistoricalRoutesPlayer';
import { Archaeological3DViewer } from './3d/Archaeological3DViewer';

export const AtlasDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AtlasSubTab>('map');

  const {
    activeLayer,
    setActiveLayer,
    activeEra,
    setActiveEra,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedPlaceId,
    setSelectedPlaceId,
    selectedPlace,
    filteredPlaces,
    zoomLevel,
    panOffset,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleZoomDelta,
    handleResetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    focusOnPlace,
  } = useAtlasMap();

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Barra de Navegación de Sub-Módulos del Atlas */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-accents-2 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-1.5 bg-accents-1 border border-accents-2 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span>Atlas Vectorial Georreferenciado</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('routes')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'routes'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span>Rutas Históricas Trazadas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('3d')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === '3d'
                ? 'bg-background text-foreground font-semibold shadow-xs'
                : 'text-accents-5 hover:text-foreground'
            }`}
          >
            <span>Visualizador 3D Arqueológico</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-accents-4 hidden sm:block">
          {activeTab === 'map'
            ? `${filteredPlaces.length} ubicaciones bíblicas georreferenciadas`
            : activeTab === 'routes'
            ? '7 itinerarios bíblicos con navegación paso a paso'
            : '4 santuarios y ciudades sagradas en 3D'}
        </div>
      </div>

      {/* Contenido de la Sub-Pestaña Activa */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <MapToolbar
            activeLayer={activeLayer}
            onChangeLayer={setActiveLayer}
            activeEra={activeEra}
            onChangeEra={setActiveEra}
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onChangeSearchQuery={setSearchQuery}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
            zoomLevel={zoomLevel}
          />

          <div className="relative">
            <InteractiveMapCanvas
              places={filteredPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={(place) => focusOnPlace(place)}
              activeLayer={activeLayer}
              zoomLevel={zoomLevel}
              panOffset={panOffset}
              isDragging={isDragging}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onZoomDelta={handleZoomDelta}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            <PlaceDetailsDrawer
              place={selectedPlace}
              onClose={() => setSelectedPlaceId(null)}
            />
          </div>
        </div>
      )}

      {activeTab === 'routes' && <HistoricalRoutesPlayer />}

      {activeTab === '3d' && <Archaeological3DViewer />}
    </div>
  );
};
