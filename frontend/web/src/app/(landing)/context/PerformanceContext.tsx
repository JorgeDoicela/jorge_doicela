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

const PerformanceContext = createContext<PerformanceContextType>({
    tier: 'high',
    isBrave: false,
    isMobile: false,
});

export const usePerformanceTier = () => useContext(PerformanceContext);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tier, setTier] = useState<PerformanceTier>('high');
    const [isBrave, setIsBrave] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const detectCapabilities = async () => {
            const nav = typeof navigator !== 'undefined' ? (navigator as BraveNavigator) : null;
            let detectedBrave = false;

            // 1. Detección de Brave Browser vía API oficial
            try {
                if (nav?.brave?.isBrave && typeof nav.brave.isBrave === 'function') {
                    detectedBrave = await nav.brave.isBrave();
                }
            } catch {
                detectedBrave = false;
            }

            setIsBrave(detectedBrave);

            // 2. Detección de Móvil / Pantalla Táctil
            const mobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);
            setIsMobile(mobile);

            // 3. Preferencias de Movimiento Reducido y Ahorro de Datos
            const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const isSaveData = nav?.connection?.saveData === true;

            if (prefersReducedMotion || isSaveData) {
                setTier('low');
                return;
            }

            // 4. En Brave, activar 'low' para evitar la sobrecarga del Canvas Farbling de los escudos
            if (detectedBrave) {
                setTier('low');
                return;
            }

            // 5. Categorización por Núcleos y Memoria
            const cores = nav?.hardwareConcurrency || 4;
            const memory = nav?.deviceMemory || 8;

            if (cores <= 4 || memory < 4) {
                setTier('low');
            } else if (cores <= 6 || mobile || memory <= 4) {
                setTier('mid');
            } else {
                setTier('high');
            }
        };

        detectCapabilities();
    }, []);

    return (
        <PerformanceContext.Provider value={{ tier, isBrave, isMobile }}>
            {children}
        </PerformanceContext.Provider>
    );
};
