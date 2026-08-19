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
  const [cursorYearBC, setCursorYearBC] = useState<number | null>(701);
  const [selectedItem, setSelectedItem] = useState<TimelineSelectedItem | null>(null);

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

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.3, 3.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.5));
  }, []);

  const handleJumpToEra = useCallback((shortcut: TimelineEraShortcut) => {
    setCenterYearBC(shortcut.yearBC);
    setCursorYearBC(shortcut.yearBC);
    setZoomLevel(shortcut.zoom);
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

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    centerYearBC,
    setCenterYearBC,
    zoomLevel,
    cursorYearBC,
    setCursorYearBC,
    selectedItem,
    setSelectedItem,
    isDragging,
    visibleTracks,
    toggleTrack,
    shortcuts: TIMELINE_ERA_SHORTCUTS,
    handleZoomIn,
    handleZoomOut,
    handleJumpToEra,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
