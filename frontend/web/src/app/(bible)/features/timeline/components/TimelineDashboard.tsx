'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBiblicalTimeline } from '../hooks/useBiblicalTimeline';
import { TimelineControls } from './TimelineControls';
import { TimelineCanvas } from './TimelineCanvas';
import { SynchronousComparisonView } from './SynchronousComparisonView';
import { TimelineDetailDrawer } from './TimelineDetailDrawer';

export const TimelineDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    centerYearBC,
    zoomLevel,
    pinnedYearBC,
    hoverYearBC,
    cursorYearBC,
    handlePinYear,
    handleSetHoverYear,
    selectedItem,
    setSelectedItem,
    isDragging,
    visibleTracks,
    toggleTrack,
    setPresetMode,
    shortcuts,
    handleZoomIn,
    handleZoomOut,
    handleZoomDelta,
    handleJumpToEra,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useBiblicalTimeline();

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <div
      ref={containerRef}
      className={
        isExpanded
          ? 'fixed inset-0 z-[100] bg-background p-3 sm:p-5 flex flex-col justify-between overflow-hidden gap-3 shadow-2xl animate-in fade-in duration-200'
          : 'space-y-4 animate-in fade-in duration-200'
      }
    >
      {/* Controles de Eras y Filtro de Pistas */}
      <TimelineControls
        shortcuts={shortcuts}
        onSelectShortcut={handleJumpToEra}
        visibleTracks={visibleTracks}
        onToggleTrack={toggleTrack}
        onSetPresetMode={setPresetMode}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoomLevel={zoomLevel}
        isFullscreen={isExpanded}
        onToggleFullscreen={toggleExpanded}
      />

      {/* Contenedor del Canvas y Ficha Lateral */}
      <div className={`relative ${isExpanded ? 'flex-1 min-h-[380px] w-full overflow-hidden' : 'w-full'}`}>
        <TimelineCanvas
          centerYearBC={centerYearBC}
          zoomLevel={zoomLevel}
          cursorYearBC={cursorYearBC}
          onSetHoverYearBC={handleSetHoverYear}
          onPinYearBC={handlePinYear}
          onSelectItem={setSelectedItem}
          visibleTracks={visibleTracks}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onZoomDelta={handleZoomDelta}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={isExpanded ? 'h-full' : 'h-[460px]'}
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
