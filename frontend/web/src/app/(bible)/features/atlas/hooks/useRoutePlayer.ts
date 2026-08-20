'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { HISTORICAL_ROUTES } from '../data/historicalRoutes';
import { HistoricalRoute, RouteStop } from '../types';

export function useRoutePlayer() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(HISTORICAL_ROUTES[0]?.id || '');
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeedMs, setPlaybackSpeedMs] = useState<number>(3500);

  const activeRoute: HistoricalRoute | null = useMemo(() => {
    if (HISTORICAL_ROUTES.length === 0) return null;
    return HISTORICAL_ROUTES.find((r) => r.id === selectedRouteId) || HISTORICAL_ROUTES[0] || null;
  }, [selectedRouteId]);

  const currentStop: RouteStop | null = useMemo(() => {
    if (!activeRoute || activeRoute.stops.length === 0) return null;
    return activeRoute.stops[currentStopIndex] || activeRoute.stops[0] || null;
  }, [activeRoute, currentStopIndex]);

  const handleSelectRoute = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
    setCurrentStopIndex(0);
    setIsPlaying(false);
  }, []);

  const handleNextStop = useCallback(() => {
    if (!activeRoute || activeRoute.stops.length === 0) return;
    setCurrentStopIndex((prev) => (prev < activeRoute.stops.length - 1 ? prev + 1 : 0));
  }, [activeRoute]);

  const handlePrevStop = useCallback(() => {
    if (!activeRoute || activeRoute.stops.length === 0) return;
    setCurrentStopIndex((prev) => (prev > 0 ? prev - 1 : activeRoute.stops.length - 1));
  }, [activeRoute]);

  const handleSelectStopIndex = useCallback((index: number) => {
    setCurrentStopIndex(index);
    setIsPlaying(false);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying || !activeRoute || activeRoute.stops.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStopIndex((prev) => {
        if (prev < activeRoute.stops.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, playbackSpeedMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeRoute, playbackSpeedMs]);

  return {
    allRoutes: HISTORICAL_ROUTES,
    selectedRouteId,
    activeRoute,
    currentStopIndex,
    currentStop,
    isPlaying,
    playbackSpeedMs,
    setPlaybackSpeedMs,
    handleSelectRoute,
    handleNextStop,
    handlePrevStop,
    handleSelectStopIndex,
    handleTogglePlay,
  };
}
