'use client';

import React, { createContext, useContext } from 'react';

/**
 * Contrato agnóstico de estado para paneles laterales en FSD.
 * Ubicado en la capa shared/ui para desacoplar el componente de UI
 * de la entidad KartexPassageContext mediante Inversión de Control (DIP).
 */
export interface StudyPanelState {
    isOpen: boolean;
    onClose: () => void;
    width?: number;
    onResize?: (width: number) => void;
    onReset?: () => void;
}

export interface StudySidePanelContextValue {
    left: StudyPanelState;
    right: StudyPanelState;
}

export const StudySidePanelContext = createContext<StudySidePanelContextValue | null>(null);

export const StudySidePanelContextProvider = StudySidePanelContext.Provider;

export function useStudySidePanelState(side: 'left' | 'right'): StudyPanelState | null {
    const ctx = useContext(StudySidePanelContext);
    return ctx ? ctx[side] : null;
}
