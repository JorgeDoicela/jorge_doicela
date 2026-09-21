'use client';

import React, { createContext, useContext } from 'react';
import { useArchaeologyFeed } from '../hooks/useArchaeologyFeed';

export type ArchaeologyContextValue = ReturnType<typeof useArchaeologyFeed>;

const ArchaeologyContext = createContext<ArchaeologyContextValue | undefined>(undefined);

export const ArchaeologyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useArchaeologyFeed();

  return (
    <ArchaeologyContext.Provider value={value}>
      {children}
    </ArchaeologyContext.Provider>
  );
};

export function useArchaeologyContext(): ArchaeologyContextValue {
  const context = useContext(ArchaeologyContext);
  if (!context) {
    throw new Error('useArchaeologyContext debe ser utilizado dentro de un ArchaeologyProvider');
  }
  return context;
}

export function useArchaeologyContextSafe(): ArchaeologyContextValue | null {
  return useContext(ArchaeologyContext) || null;
}
