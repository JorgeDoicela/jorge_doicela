'use client';

import { useState, useCallback, useMemo } from 'react';
import { ANCIENT_STRUCTURES_3D } from '../data/archaeological3DData';
import { AncientStructureId, AncientStructure3D, StructureHotspot } from '../types';

export function use3DOrbitControls() {
  const [selectedStructureId, setSelectedStructureId] = useState<AncientStructureId>('tabernacle');
  const [yaw, setYaw] = useState<number>(35); // Ángulo horizontal (grados)
  const [pitch, setPitch] = useState<number>(25); // Ángulo vertical (grados)
  const [zoom, setZoom] = useState<number>(1);
  const [isCrossSection, setIsCrossSection] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  // Arrastre con mouse/touch
  const [isOrbiting, setIsOrbiting] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeStructure: AncientStructure3D = useMemo(() => {
    return ANCIENT_STRUCTURES_3D.find((s) => s.id === selectedStructureId) || ANCIENT_STRUCTURES_3D[0];
  }, [selectedStructureId]);

  const activeHotspot: StructureHotspot | null = useMemo(() => {
    if (!selectedHotspotId) return null;
    return activeStructure.hotspots.find((h) => h.id === selectedHotspotId) || null;
  }, [activeStructure, selectedHotspotId]);

  const handleSelectStructure = useCallback((id: AncientStructureId) => {
    setSelectedStructureId(id);
    setSelectedHotspotId(null);
    setYaw(35);
    setPitch(25);
    setZoom(1);
    setIsCrossSection(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsOrbiting(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isOrbiting) return;
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      setYaw((prev) => (prev + deltaX * 0.5) % 360);
      setPitch((prev) => Math.max(5, Math.min(80, prev + deltaY * 0.4)));
      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isOrbiting, lastMousePos],
  );

  const handleMouseUp = useCallback(() => {
    setIsOrbiting(false);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.2, 2.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.2, 0.6));
  }, []);

  const handleResetCamera = useCallback(() => {
    setYaw(35);
    setPitch(25);
    setZoom(1);
  }, []);

  const handleSetPresetView = useCallback((viewType: 'isometric' | 'top' | 'front' | 'side') => {
    switch (viewType) {
      case 'isometric':
        setYaw(45);
        setPitch(30);
        break;
      case 'top':
        setYaw(0);
        setPitch(80);
        break;
      case 'front':
        setYaw(0);
        setPitch(15);
        break;
      case 'side':
        setYaw(90);
        setPitch(15);
        break;
    }
  }, []);

  return {
    structures: ANCIENT_STRUCTURES_3D,
    selectedStructureId,
    activeStructure,
    activeHotspot,
    selectedHotspotId,
    setSelectedHotspotId,
    yaw,
    pitch,
    zoom,
    isCrossSection,
    setIsCrossSection,
    autoRotate,
    setAutoRotate,
    isOrbiting,
    handleSelectStructure,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleResetCamera,
    handleSetPresetView,
  };
}
