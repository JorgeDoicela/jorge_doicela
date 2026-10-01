'use client';

import React, { createContext, useContext } from 'react';
import { useBiblicalTimeline } from '../hooks/useBiblicalTimeline';

export type TimelineContextValue = ReturnType<typeof useBiblicalTimeline>;

const TimelineContext = createContext<TimelineContextValue | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useBiblicalTimeline();

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
};

export function useTimelineContext(): TimelineContextValue {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimelineContext debe ser utilizado dentro de un TimelineProvider');
  }
  return context;
}

export function useTimelineContextSafe(): TimelineContextValue | null {
  return useContext(TimelineContext) || null;
}
