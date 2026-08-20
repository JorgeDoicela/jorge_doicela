'use client';

import { useState, useCallback, useMemo } from 'react';
import { TimelineSelectedItem } from '../types';

export interface TimelineEraShortcut {
  id: string;
  label: string;
  yearBC: number;
  zoom: number;
  description: string;
}

export const TIMELINE_ERA_SHORTCUTS: TimelineEraShortcut[] = [
  {
    id: 'united_monarchy',
    label: 'Monarquía Unida',
    yearBC: 1000,
    zoom: 1.6,
    description: 'Saúl, David y el Templo de Salomón (1050 - 931 a.C.)',
  },
  {
    id: 'divided_kingdom',
    label: 'Monarquía Dividida',
    yearBC: 850,
    zoom: 1.4,
    description: 'Reyes de Judá e Israel, Elías, Eliseo y Acab (931 - 722 a.C.)',
  },
  {
    id: 'hezekiah_isaiah',
    label: 'Asedio de Senaquerib',
    yearBC: 701,
    zoom: 2.2,
    description: 'Ezequías, Isaías y la invasión asiria (715 - 686 a.C.)',
  },
  {
    id: 'babylonian_exile',
    label: 'Cautiverio Babilónico',
    yearBC: 586,
    zoom: 1.8,
    description: 'Jeremías, Ezequiel, Daniel y destrucción de Jerusalén (605 - 538 a.C.)',
  },
  {
    id: 'persian_return',
    label: 'Retorno y Reconstrucción',
    yearBC: 520,
    zoom: 1.6,
    description: 'Decreto de Ciro, Segundo Templo, Zorobabel, Esdras y Nehemías (538 - 400 a.C.)',
  },
  {
    id: 'first_century',
    label: 'Siglo I & Jesucristo',
    yearBC: 30, // 30 d.C.
    zoom: 2.0,
    description: 'Imperio Romano, Tiberio, Poncio Pilato, Jesús y los Apóstoles (4 a.C. - 70 d.C.)',
  },
];

export function useBiblicalTimeline() {
  // Año central visible en a.C. (ej. 850)
  const [centerYearBC, setCenterYearBC] = useState<number>(850);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [pinnedYearBC, setPinnedYearBC] = useState<number>(701);
  const [hoverYearBC, setHoverYearBC] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<TimelineSelectedItem | null>(null);

  // El año efectivo para la sincronización es el del hover si el cursor está sobre el lienzo, o el fijado si se retira
  const cursorYearBC = hoverYearBC ?? pinnedYearBC;

  // Arrastre horizontal
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [initialCenterYear, setInitialCenterYear] = useState<number>(850);

  // Filtros de pistas activas
  const [visibleTracks, setVisibleTracks] = useState<{
    judah: boolean;
    israel: boolean;
    prophets: boolean;
    empires: boolean;
    milestones: boolean;
  }>({
    judah: true,
    israel: true,
    prophets: true,
    empires: true,
    milestones: true,
  });

  const toggleTrack = useCallback((trackKey: keyof typeof visibleTracks) => {
    setVisibleTracks((prev) => ({ ...prev, [trackKey]: !prev[trackKey] }));
  }, []);

  const setPresetMode = useCallback((mode: 'kings_prophets' | 'bible_archaeology' | 'all') => {
    switch (mode) {
      case 'kings_prophets':
        setVisibleTracks({
          judah: true,
          israel: true,
          prophets: true,
          empires: false,
          milestones: false,
        });
        break;
      case 'bible_archaeology':
        setVisibleTracks({
          judah: true,
          israel: false,
          prophets: false,
          empires: true,
          milestones: true,
        });
        break;
      case 'all':
      default:
        setVisibleTracks({
          judah: true,
          israel: true,
          prophets: true,
          empires: true,
          milestones: true,
        });
        break;
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(Number((prev + 0.4).toFixed(2)), 12.0));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(Number((prev - 0.4).toFixed(2)), 0.4));
  }, []);

  const handleJumpToEra = useCallback((shortcut: TimelineEraShortcut) => {
    setCenterYearBC(shortcut.yearBC);
    setPinnedYearBC(shortcut.yearBC);
    setHoverYearBC(null);
    setZoomLevel(shortcut.zoom);
  }, []);

  const handlePinYear = useCallback((year: number) => {
    setPinnedYearBC(year);
    setHoverYearBC(null);
  }, []);

  const handleSetHoverYear = useCallback((year: number | null) => {
    setHoverYearBC(year);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setInitialCenterYear(centerYearBC);
    },
    [centerYearBC],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      // Convertir desplazamiento de píxeles a años (a mayor zoom, menor cambio de años por px)
      const yearsShift = deltaX / (zoomLevel * 3.5);
      setCenterYearBC(Math.round(initialCenterYear + yearsShift));
    },
    [isDragging, dragStartX, initialCenterYear, zoomLevel],
  );

  // Manejo de gestos táctiles para móviles (1 dedo: arrastre, 2 dedos: pinch-to-zoom)
  const [touchStartDistance, setTouchStartDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number>(1.2);

  const handleZoomDelta = useCallback((delta: number) => {
    setZoomLevel((prev) => {
      const next = Number((prev + delta).toFixed(2));
      return Math.min(Math.max(next, 0.4), 12.0);
    });
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStartX(e.touches[0].clientX);
        setInitialCenterYear(centerYearBC);
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
    [centerYearBC, zoomLevel],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - dragStartX;
        const yearsShift = deltaX / (zoomLevel * 3.5);
        setCenterYearBC(Math.round(initialCenterYear + yearsShift));
      } else if (e.touches.length === 2 && touchStartDistance !== null) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const ratio = currentDist / touchStartDistance;
        const newZoom = Number((initialZoom * ratio).toFixed(2));
        setZoomLevel(Math.min(Math.max(newZoom, 0.5), 3.5));
      }
    },
    [isDragging, dragStartX, initialCenterYear, zoomLevel, touchStartDistance, initialZoom],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStartDistance(null);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    centerYearBC,
    setCenterYearBC,
    zoomLevel,
    setZoomLevel,
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
    shortcuts: TIMELINE_ERA_SHORTCUTS,
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
  };
}
