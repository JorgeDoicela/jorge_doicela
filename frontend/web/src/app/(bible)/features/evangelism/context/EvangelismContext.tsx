'use client';

import React, { createContext, useContext } from 'react';
import { useEvangelism } from '../hooks/useEvangelism';
import {
  EvangelismPathway,
  EvangelismObjection,
  EvangelismTract,
  EvangelismSubSuite,
} from '../types';

export type EvangelismContextValue = ReturnType<typeof useEvangelism>;

const EvangelismContext = createContext<EvangelismContextValue | undefined>(undefined);

export const EvangelismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const evangelismState = useEvangelism();

  return (
    <EvangelismContext.Provider value={evangelismState}>
      {children}
    </EvangelismContext.Provider>
  );
};

export function useEvangelismContext(): EvangelismContextValue {
  const context = useContext(EvangelismContext);
  if (!context) {
    throw new Error('useEvangelismContext debe ser utilizado dentro de un EvangelismProvider');
  }
  return context;
}

export function useEvangelismContextSafe(): EvangelismContextValue | null {
  return useContext(EvangelismContext) || null;
}
