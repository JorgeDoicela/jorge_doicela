'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type PerformanceTier = 'low' | 'mid' | 'high';

export interface ExtendedNavigator extends Navigator {
    brave?: {
        isBrave?: () => Promise<boolean>;
    };
    deviceMemory?: number;
    connection?: {
        saveData?: boolean;
        effectiveType?: string;
    };
    getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (type: string, listener: EventListener) => void;
        removeEventListener: (type: string, listener: EventListener) => void;
    }>;
}

export interface PerformanceContextType {
    tier: PerformanceTier;
    isBrave: boolean;
    isMobile: boolean;
    setTier: (tier: PerformanceTier) => void;
}

const DEFAULT_CAPABILITIES: PerformanceContextType = {
    tier: 'high',
    isBrave: false,
    isMobile: false,
    setTier: () => {},
};

export const PerformanceContext = createContext<PerformanceContextType>(DEFAULT_CAPABILITIES);

export const usePerformanceTier = () => useContext(PerformanceContext);

/**
 * Evaluación estática inicial de capacidades del dispositivo tras hidratación en cliente.
 * Se apoya en estándares W3C Interaction Media Queries (evitando falsos positivos en laptops táctiles).
 */
function evaluateClientCapabilities(): { tier: PerformanceTier; isBrave: boolean; isMobile: boolean } {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return { tier: 'high', isBrave: false, isMobile: false };
    }

    const nav = navigator as ExtendedNavigator;
    const isBraveSync = Boolean(nav?.brave);

    // Detección precisa de móvil: viewport estrecho o dispositivo táctil puro (sin ratón de precisión)
    const isTouchOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
    const isSmallViewport = window.innerWidth < 768;
    const isMobile = isSmallViewport || isTouchOnly;

    // Accesibilidad y ahorro de datos mandatarios
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSaveData = nav?.connection?.saveData === true;
    const isSlowConnection = nav?.connection?.effectiveType === 'slow-2g' || nav?.connection?.effectiveType === '2g';

    const cores = nav?.hardwareConcurrency || 4;
    const memory = nav?.deviceMemory || 8;

    // Nivel 'low': Solicitud explícita de accesibilidad, ahorro de datos o hardware muy limitado (<= 2 núcleos / < 3 GB RAM)
    if (prefersReducedMotion || isSaveData || isSlowConnection || cores <= 2 || memory < 3) {
        return { tier: 'low', isBrave: isBraveSync, isMobile };
    }

    // Nivel 'mid': Teléfonos y tablets (optimización térmica/batería a 60 FPS con 350 partículas) o hardware modesto
    if (isMobile || cores <= 4 || memory <= 4) {
        return { tier: 'mid', isBrave: isBraveSync, isMobile };
    }

    // Nivel 'high': Desktops y laptops de alto rendimiento (experiencia cinemática completa a 120-144Hz)
    return { tier: 'high', isBrave: isBraveSync, isMobile };
}

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tier, setTierState] = useState<PerformanceTier>('high');
    const [isBrave, setIsBrave] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const setTier = useCallback((newTier: PerformanceTier) => {
        setTierState(newTier);
    }, []);

    // 1. Inicialización y sincronización determinista de hardware
    useEffect(() => {
        const clientCap = evaluateClientCapabilities();
        setTierState(clientCap.tier);
        setIsBrave(clientCap.isBrave);
        setIsMobile(clientCap.isMobile);

        // Verificación asíncrona oficial de la API de Brave Browser
        const nav = typeof navigator !== 'undefined' ? (navigator as ExtendedNavigator) : null;
        if (nav?.brave?.isBrave && typeof nav.brave.isBrave === 'function') {
            nav.brave.isBrave().then((isBraveConfirmed) => {
                if (isBraveConfirmed) {
                    setIsBrave(true);
                }
            }).catch(() => {});
        }

        // Listener reactivo para preferencias de accesibilidad del SO (prefers-reduced-motion)
        const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleMotionChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setTierState('low');
            } else {
                setTierState(evaluateClientCapabilities().tier);
            }
        };

        motionMediaQuery.addEventListener?.('change', handleMotionChange);

        // Listener reactivo ante cambio de tamaño de ventana (redimensionamiento desktop vs mobile)
        const handleResize = () => {
            const isTouch = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
            const isSmall = window.innerWidth < 768;
            setIsMobile(isTouch || isSmall);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        // 2. Integración con Battery Status API: escalar a 'mid' si la batería es crítica (< 20% desconectado)
        let batteryCleanup: (() => void) | undefined;
        if (nav?.getBattery && typeof nav.getBattery === 'function') {
            nav.getBattery().then((battery) => {
                const checkBattery = () => {
                    if (battery.level <= 0.20 && !battery.charging) {
                        setTierState((prev) => (prev === 'high' ? 'mid' : prev));
                    }
                };
                checkBattery();
                const onLevelChange = () => checkBattery();
                const onChargingChange = () => checkBattery();
                battery.addEventListener('levelchange', onLevelChange);
                battery.addEventListener('chargingchange', onChargingChange);
                batteryCleanup = () => {
                    battery.removeEventListener('levelchange', onLevelChange);
                    battery.removeEventListener('chargingchange', onChargingChange);
                };
            }).catch(() => {});
        }

        return () => {
            motionMediaQuery.removeEventListener?.('change', handleMotionChange);
            window.removeEventListener('resize', handleResize);
            if (batteryCleanup) batteryCleanup();
        };
    }, []);

    // 3. Sincronización atómica con el DOM para estilos CSS [data-tier="..."]
    useEffect(() => {
        document.documentElement.setAttribute('data-tier', tier);
    }, [tier]);

    return (
        <PerformanceContext.Provider value={{ tier, isBrave, isMobile, setTier }}>
            {children}
        </PerformanceContext.Provider>
    );
};
