'use client';

import React, { createContext, useContext } from 'react';
import { useAtlasMap } from '../hooks/useAtlasMap';

export type AtlasContextValue = ReturnType<typeof useAtlasMap>;

const AtlasContext = createContext<AtlasContextValue | undefined>(undefined);

export const AtlasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const atlasState = useAtlasMap();

  return (
    <AtlasContext.Provider value={atlasState}>
      {children}
    </AtlasContext.Provider>
  );
};

export function useAtlasContext(): AtlasContextValue {
  const context = useContext(AtlasContext);
  if (!context) {
    throw new Error('useAtlasContext debe ser utilizado dentro de un AtlasProvider');
  }
  return context;
}

export function useAtlasContextSafe(): AtlasContextValue | null {
  return useContext(AtlasContext) || null;
}
