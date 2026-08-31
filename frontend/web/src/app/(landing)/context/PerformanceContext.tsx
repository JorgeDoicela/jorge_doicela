'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PerformanceTier = 'low' | 'mid' | 'high';

interface BraveNavigator extends Navigator {
    brave?: {
        isBrave?: () => Promise<boolean>;
    };
    deviceMemory?: number;
    connection?: {
        saveData?: boolean;
    };
}

interface PerformanceContextType {
    tier: PerformanceTier;
    isBrave: boolean;
    isMobile: boolean;
}

const DEFAULT_CAPABILITIES: PerformanceContextType = {
    tier: 'high',
    isBrave: false,
    isMobile: false,
};

const PerformanceContext = createContext<PerformanceContextType>(DEFAULT_CAPABILITIES);

export const usePerformanceTier = () => useContext(PerformanceContext);

/**
 * Evaluación de capacidades del navegador ejecutada tras la hidratación
 */
function evaluateClientCapabilities(): { tier: PerformanceTier; isBrave: boolean; isMobile: boolean } {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return DEFAULT_CAPABILITIES;
    }

    const nav = navigator as BraveNavigator;
    const isBraveSync = Boolean(nav?.brave);
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData = nav?.connection?.saveData === true;
    const cores = nav?.hardwareConcurrency || 4;
    const memory = nav?.deviceMemory || 8;

    if (isBraveSync || prefersReducedMotion || isSaveData || cores <= 4 || memory < 4) {
        return { tier: 'low', isBrave: isBraveSync, isMobile };
    }

    if (cores <= 6 || isMobile || memory <= 4) {
        return { tier: 'mid', isBrave: false, isMobile };
    }

    return { tier: 'high', isBrave: false, isMobile };
}

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Inicialización idéntica entre servidor y cliente para evitar Hydration Mismatch
    const [capabilities, setCapabilities] = useState<PerformanceContextType>(DEFAULT_CAPABILITIES);

    useEffect(() => {
        const clientCap = evaluateClientCapabilities();
        setCapabilities(clientCap);
        document.documentElement.setAttribute('data-tier', clientCap.tier);

        // Verificación asíncrona oficial de la API de Brave Browser
        const nav = typeof navigator !== 'undefined' ? (navigator as BraveNavigator) : null;
        if (nav?.brave?.isBrave && typeof nav.brave.isBrave === 'function') {
            nav.brave.isBrave().then((isBraveConfirmed) => {
                if (isBraveConfirmed) {
                    setCapabilities((prev) => {
                        const updated = { ...prev, isBrave: true, tier: 'low' as PerformanceTier };
                        document.documentElement.setAttribute('data-tier', 'low');
                        return updated;
                    });
                }
            }).catch(() => {});
        }

        // Listener reactivo para preferencias de accesibilidad del sistema operativo
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setCapabilities((prev) => ({ ...prev, tier: 'low' }));
                document.documentElement.setAttribute('data-tier', 'low');
            }
        };

        motionMediaQuery.addEventListener?.('change', handleMotionChange);
        return () => {
            motionMediaQuery.removeEventListener?.('change', handleMotionChange);
        };
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-tier', capabilities.tier);
    }, [capabilities.tier]);

    return (
        <PerformanceContext.Provider value={{ tier: capabilities.tier, isBrave: capabilities.isBrave, isMobile: capabilities.isMobile }}>
            {children}
        </PerformanceContext.Provider>
    );
};
