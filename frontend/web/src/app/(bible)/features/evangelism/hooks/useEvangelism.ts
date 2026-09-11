'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  EvangelismPathway,
  EvangelismObjection,
  EvangelismTract,
  EvangelismSubSuite,
} from '../types';
import {
  fetchEvangelismPathways,
  fetchEvangelismObjections,
  fetchEvangelismTracts,
} from '../services/evangelismApiService';

export function useEvangelism() {
  const locale = useLocale();

  const [subSuite, setSubSuite] = useState<EvangelismSubSuite>('pathways');
  const [pathways, setPathways] = useState<EvangelismPathway[]>([]);
  const [selectedPathwayId, setSelectedPathwayId] = useState<string>('romans-road');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const [objections, setObjections] = useState<EvangelismObjection[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [tracts, setTracts] = useState<EvangelismTract[]>([]);
  const [selectedTractId, setSelectedTractId] = useState<string>('the-great-exchange');

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar datos al cambiar de idioma
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetchEvangelismPathways(locale),
      fetchEvangelismObjections(undefined, undefined, locale),
      fetchEvangelismTracts(undefined, locale),
    ])
      .then(([pathwaysData, objectionsData, tractsData]) => {
        if (!isMounted) return;
        setPathways(pathwaysData);
        setObjections(objectionsData);
        setTracts(tractsData);

        // Si la ruta seleccionada no está disponible, seleccionar la primera
        if (pathwaysData.length > 0 && !pathwaysData.some((p) => p.id === selectedPathwayId)) {
          setSelectedPathwayId(pathwaysData[0].id);
        }
        if (tractsData.length > 0 && !tractsData.some((t) => t.id === selectedTractId)) {
          setSelectedTractId(tractsData[0].id);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  const selectedPathway = useMemo(() => {
    return pathways.find((p) => p.id === selectedPathwayId) || pathways[0] || null;
  }, [pathways, selectedPathwayId]);

  const selectedTract = useMemo(() => {
    return tracts.find((t) => t.id === selectedTractId) || tracts[0] || null;
  }, [tracts, selectedTractId]);

  const filteredObjections = useMemo(() => {
    return objections.filter((obj) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        obj.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        obj.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.biblicalAnswer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [objections, selectedCategory, searchQuery]);

  const handleSelectPathway = useCallback((id: string) => {
    setSelectedPathwayId(id);
    setActiveStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    if (!selectedPathway) return;
    setActiveStepIndex((prev) => Math.min(prev + 1, selectedPathway.steps.length - 1));
  }, [selectedPathway]);

  const prevStep = useCallback(() => {
    setActiveStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    subSuite,
    setSubSuite,
    pathways,
    selectedPathway,
    selectedPathwayId,
    setSelectedPathwayId: handleSelectPathway,
    activeStepIndex,
    setActiveStepIndex,
    nextStep,
    prevStep,
    objections: filteredObjections,
    allObjectionsCount: objections.length,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    tracts,
    selectedTract,
    selectedTractId,
    setSelectedTractId,
    isLoading,
  };
}
