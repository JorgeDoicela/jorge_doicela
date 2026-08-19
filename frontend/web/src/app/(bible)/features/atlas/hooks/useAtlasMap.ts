'use client';

import { useState, useMemo, useCallback } from 'react';
import { ANCIENT_PLACES } from '../data/ancientPlaces';
import { AncientPlace, HistoricalEra, MapLayerType, PlaceCategory } from '../types';

// Límites geográficos del Oriente Próximo y Mediterráneo Bíblico
export const MAP_BOUNDS = {
  minLat: 26.5, // Sur del Sinaí y Egipto
  maxLat: 43.5, // Norte de Roma y Macedonia
  minLng: 11.5, // Oeste de Roma
  maxLng: 44.5, // Este del Éufrates y Mesopotamia
};

/**
 * Convierte coordenadas lat/lng en coordenadas normalizadas en pantalla (0 a 1000)
 */
export function projectGeoToCanvas(
  lat: number,
  lng: number,
  viewWidth = 1000,
  viewHeight = 650,
): { x: number; y: number } {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * viewWidth;
  // Mercator simplificado para la latitud
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * viewHeight;
  return { x, y };
}

export function useAtlasMap() {
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('historical');
  const [activeEra, setActiveEra] = useState<HistoricalEra>('all');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtrado de lugares según criterios activos
  const filteredPlaces = useMemo(() => {
    return ANCIENT_PLACES.filter((place) => {
      // Filtro por época
      if (activeEra !== 'all' && !place.era.includes(activeEra)) {
        return false;
      }
      // Filtro por categoría
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }
      // Filtro por búsqueda textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = place.name.toLowerCase().includes(query);
        const matchesModern = place.modernName.toLowerCase().includes(query);
        const matchesMeaning = place.originalName.meaning.toLowerCase().includes(query);
        const matchesRef = place.biblicalReferences.some(
          (r) => r.reference.toLowerCase().includes(query) || r.context.toLowerCase().includes(query),
        );
        return matchesName || matchesModern || matchesMeaning || matchesRef;
      }
      return true;
    });
  }, [activeEra, selectedCategory, searchQuery]);

  const selectedPlace = useMemo(() => {
    return ANCIENT_PLACES.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId]);

  // Controles de navegación de zoom
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  }, []);

  const handleResetView = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Control de arrastre del mapa
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    },
    [panOffset],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Centrar el mapa en un lugar específico
  const focusOnPlace = useCallback((place: AncientPlace) => {
    const coords = projectGeoToCanvas(place.coordinates.lat, place.coordinates.lng);
    const canvasCenterX = 500;
    const canvasCenterY = 325;
    setPanOffset({
      x: (canvasCenterX - coords.x) * 1.5,
      y: (canvasCenterY - coords.y) * 1.5,
    });
    setZoomLevel(1.8);
    setSelectedPlaceId(place.id);
  }, []);

  return {
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
    allPlaces: ANCIENT_PLACES,
    zoomLevel,
    panOffset,
    isDragging,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    focusOnPlace,
  };
}
