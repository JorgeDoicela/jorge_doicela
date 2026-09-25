'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SpotlightModal } from '../ui/SpotlightModal';
import { useSoftwareHub } from '../../../entities/hub/api/useSoftwareHub';

interface SpotlightContextValue {
  isOpen: boolean;
  openSpotlight: (initialQuery?: string) => void;
  closeSpotlight: () => void;
}

const SpotlightContext = createContext<SpotlightContextValue | null>(null);

export function useSpotlight(): SpotlightContextValue {
  const context = useContext(SpotlightContext);
  if (!context) {
    throw new Error('useSpotlight must be used within a SpotlightProvider');
  }
  return context;
}

interface SpotlightProviderProps {
  children: React.ReactNode;
}

export function SpotlightProvider({ children }: SpotlightProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { spotlightData } = useSoftwareHub();

  const openSpotlight = useCallback((initialQuery: string = '') => {
    setSearchQuery(initialQuery);
    setIsOpen(true);
  }, []);

  const closeSpotlight = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  // Atajo global Cmd+K o Ctrl+K disponible en todo el subdominio de Software
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sincronización reactiva con parámetros de URL (?spotlight=true, ?search=..., ?q=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isSpotlightRequested = params.get('spotlight') === 'true';
      const searchParam = params.get('q') || params.get('search');

      if (isSpotlightRequested || searchParam) {
        openSpotlight(searchParam || '');
      }
    }
  }, [openSpotlight]);

  return (
    <SpotlightContext.Provider value={{ isOpen, openSpotlight, closeSpotlight }}>
      {children}
      <SpotlightModal
        isOpen={isOpen}
        initialQuery={searchQuery}
        onClose={closeSpotlight}
        news={spotlightData.news}
        posts={spotlightData.posts}
        topics={spotlightData.topics}
        aiResources={spotlightData.aiResources}
        secPosts={spotlightData.secPosts}
        tutorials={spotlightData.tutorials}
        projects={spotlightData.projects}
        infraPosts={spotlightData.infraPosts}
      />
    </SpotlightContext.Provider>
  );
}
