'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { AncientPlace, HistoricalEra, MapLayerType, PlaceCategory } from '../types';
import { fetchAtlasPlaces } from '../services/atlasApiService';

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
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * viewHeight;
  return { x, y };
}

export function useAtlasMap() {
  const [places, setPlaces] = useState<AncientPlace[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    let active = true;
    const loadPlaces = async () => {
      setLoading(true);
      try {
        const data = await fetchAtlasPlaces(selectedCategory, searchQuery);
        if (active) setPlaces(data);
      } catch {
        if (active) setPlaces([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadPlaces();
    return () => {
      active = false;
    };
  }, [selectedCategory, searchQuery]);

  // Filtrado de lugares según criterios activos
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      if (activeEra !== 'all' && place.era && !place.era.includes(activeEra)) {
        return false;
      }
      return true;
    });
  }, [places, activeEra]);

  const selectedPlace = useMemo(() => {
    return places.find((p) => p.id === selectedPlaceId) || null;
  }, [places, selectedPlaceId]);

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

  // Presets de enfoque por regiones bíblicas
  const focusOnRegion = useCallback((region: 'all' | 'holyland' | 'greece_asia' | 'egypt_sinai') => {
    switch (region) {
      case 'holyland':
        setZoomLevel(2.4);
        setPanOffset({ x: -660, y: -260 });
        break;
      case 'greece_asia':
        setZoomLevel(1.8);
        setPanOffset({ x: 40, y: 140 });
        break;
      case 'egypt_sinai':
        setZoomLevel(1.9);
        setPanOffset({ x: -280, y: -360 });
        break;
      case 'all':
      default:
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
        break;
    }
    setSelectedPlaceId(null);
  }, []);

  // Manejo de gestos táctiles para móviles en el mapa
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(1);

  const handleZoomDelta = useCallback((delta: number) => {
    setZoomLevel((prev) => {
      const next = Number((prev + delta).toFixed(2));
      return Math.min(Math.max(next, 0.8), 3.5);
    });
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({ x: e.touches[0].clientX - panOffset.x, y: e.touches[0].clientY - panOffset.y });
        setTouchStartDistance(null);
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        setTouchStartDistance(dist);
        setInitialZoom(zoomLevel);
      }
    },
    [panOffset, zoomLevel],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        setPanOffset({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      } else if (e.touches.length === 2 && touchStartDistance !== null) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const ratio = currentDist / touchStartDistance;
        const newZoom = Number((initialZoom * ratio).toFixed(2));
        setZoomLevel(Math.min(Math.max(newZoom, 0.8), 3.5));
      }
    },
    [isDragging, dragStart, touchStartDistance, initialZoom],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStartDistance(null);
  }, []);

  return {
    loading,
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
    allPlaces: places,
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
    focusOnRegion,
  };
}
