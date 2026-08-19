'use client';

import React from 'react';
import { useBiblicalTimeline } from '../hooks/useBiblicalTimeline';
import { TimelineControls } from './TimelineControls';
import { TimelineCanvas } from './TimelineCanvas';
import { SynchronousComparisonView } from './SynchronousComparisonView';
import { TimelineDetailDrawer } from './TimelineDetailDrawer';

export const TimelineDashboard: React.FC = () => {
  const {
    centerYearBC,
    zoomLevel,
    cursorYearBC,
    setCursorYearBC,
    selectedItem,
    setSelectedItem,
    isDragging,
    visibleTracks,
    toggleTrack,
    shortcuts,
    handleZoomIn,
    handleZoomOut,
    handleJumpToEra,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useBiblicalTimeline();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Controles de Eras y Filtro de Pistas */}
      <TimelineControls
        shortcuts={shortcuts}
        onSelectShortcut={handleJumpToEra}
        visibleTracks={visibleTracks}
        onToggleTrack={toggleTrack}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoomLevel={zoomLevel}
      />

      {/* Contenedor del Canvas y Ficha Lateral */}
      <div className="relative">
        <TimelineCanvas
          centerYearBC={centerYearBC}
          zoomLevel={zoomLevel}
          cursorYearBC={cursorYearBC}
          onSetCursorYearBC={setCursorYearBC}
          onSelectItem={setSelectedItem}
          visibleTracks={visibleTracks}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />

        <TimelineDetailDrawer
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>

      {/* Vista de Comparación Sincrónica en Tiempo Real */}
      <SynchronousComparisonView
        cursorYearBC={cursorYearBC}
        onSelectItem={setSelectedItem}
      />
    </div>
  );
};
