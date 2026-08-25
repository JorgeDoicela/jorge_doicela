'use client';

import { useEffect, useRef, useState } from 'react';
import { usePerformanceTier } from '../context/PerformanceContext';

/**
 * ParallaxBackground Component (Adaptive Multi-Tier Deep Cosmos Engine)
 * 
 * - Modo Claro: Atmósfera etérea monocromática / duotono sutil (Apple & Linear style)
 *   con degradados translúcidos en azul e índigo suave, sin saturación multicolor.
 * - Modo Oscuro: Cosmos profundo con las 6 nebulosas galácticas envolventes.
 * - Tier 'low' / Brave: Animación CSS GPU (.animate-cosmic-float) con 0% de sobrecarga de JS/CPU.
 * - Tier 'mid': Parallax reactivo con reposo inteligente (Idle Sleep).
 * - Tier 'high': Parallax cinematográfico 3D multicapa a 144Hz con inercia física (lerp) y giroscopio.
 */
export default function ParallaxBackground() {
    const { tier } = usePerformanceTier();
    const [isLight, setIsLight] = useState(false);

    const cloud1Ref = useRef<HTMLDivElement>(null);
    const cloud2Ref = useRef<HTMLDivElement>(null);
    const cloud3Ref = useRef<HTMLDivElement>(null);
    const cloud4Ref = useRef<HTMLDivElement>(null);
    const cloud5Ref = useRef<HTMLDivElement>(null);
    const coreGlowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateTheme = () => {
            setIsLight(document.documentElement.classList.contains('light'));
        };
        updateTheme();
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // En nivel 'low', la animación se delega 100% al compositor CSS de la GPU
        if (tier === 'low') return;

        let animationFrameId: number | null = null;
        let isRunning = false;

        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        let scrollY = window.scrollY;

        const lerpFactor = tier === 'high' ? 0.045 : 0.035;

        const renderFrame = () => {
            const dx = target.x - current.x;
            const dy = target.y - current.y;

            current.x += dx * lerpFactor;
            current.y += dy * lerpFactor;

            // Capa 1: Atmósfera Superior Izquierda
            if (cloud1Ref.current) {
                const x1 = current.x * (tier === 'high' ? 42 : 28);
                const y1 = current.y * (tier === 'high' ? 42 : 28) - scrollY * 0.04;
                cloud1Ref.current.style.transform = `translate3d(${x1.toFixed(2)}px, ${y1.toFixed(2)}px, 0px)`;
            }

            // Capa 2: Atmósfera Inferior Derecha
            if (cloud2Ref.current) {
                const x2 = -current.x * (tier === 'high' ? 36 : 24);
                const y2 = -current.y * (tier === 'high' ? 36 : 24) - scrollY * 0.06;
                cloud2Ref.current.style.transform = `translate3d(${x2.toFixed(2)}px, ${y2.toFixed(2)}px, 0px)`;
            }

            // Capa 3: Atmósfera Central / Vía Láctea
            if (cloud3Ref.current) {
                const x3 = current.x * (tier === 'high' ? 26 : 18);
                const y3 = current.y * (tier === 'high' ? 26 : 18) - scrollY * 0.05;
                cloud3Ref.current.style.transform = `translate3d(${x3.toFixed(2)}px, ${y3.toFixed(2)}px, 0px)`;
            }

            // Capa 4: Atmósfera Superior Derecha
            if (cloud4Ref.current) {
                const x4 = -current.x * (tier === 'high' ? 20 : 14);
                const y4 = -current.y * (tier === 'high' ? 20 : 14) - scrollY * 0.03;
                cloud4Ref.current.style.transform = `translate3d(${x4.toFixed(2)}px, ${y4.toFixed(2)}px, 0px)`;
            }

            // Capa 5: Atmósfera Inferior Izquierda
            if (cloud5Ref.current) {
                const x5 = current.x * (tier === 'high' ? 30 : 20);
                const y5 = current.y * (tier === 'high' ? 30 : 20) - scrollY * 0.05;
                cloud5Ref.current.style.transform = `translate3d(${x5.toFixed(2)}px, ${y5.toFixed(2)}px, 0px)`;
            }

            // Núcleo Central
            if (coreGlowRef.current) {
                const xCore = current.x * (tier === 'high' ? 12 : 8);
                const yCore = current.y * (tier === 'high' ? 12 : 8) - scrollY * 0.02;
                coreGlowRef.current.style.transform = `translate3d(${xCore.toFixed(2)}px, ${yCore.toFixed(2)}px, 0px)`;
            }

            // Reposo Inteligente (Idle Sleep)
            if (Math.abs(dx) > 0.0008 || Math.abs(dy) > 0.0008) {
                animationFrameId = requestAnimationFrame(renderFrame);
            } else {
                isRunning = false;
                animationFrameId = null;
            }
        };

        const startAnimation = () => {
            if (!isRunning) {
                isRunning = true;
                animationFrameId = requestAnimationFrame(renderFrame);
            }
        };

        const handleScroll = () => {
            scrollY = window.scrollY;
            startAnimation();
        };

        const handleMouseMove = (e: MouseEvent) => {
            target.x = (e.clientX / window.innerWidth - 0.5) * 2;
            target.y = (e.clientY / window.innerHeight - 0.5) * 2;
            startAnimation();
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma !== null && e.beta !== null) {
                const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
                target.x = clamp(e.gamma / 45, -1, 1);
                target.y = clamp((e.beta - 45) / 45, -1, 1);
                startAnimation();
            }
        };

        const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

        if (isTouchDevice && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
            const DeviceOrientationTyped = DeviceOrientationEvent as unknown as {
                requestPermission?: () => Promise<'granted' | 'denied'>;
            };

            if (typeof DeviceOrientationTyped.requestPermission === 'function') {
                DeviceOrientationTyped.requestPermission()
                    .then((permissionState) => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        }
                    })
                    .catch(() => {});
            } else {
                window.addEventListener('deviceorientation', handleOrientation);
            }
        } else {
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        startAnimation();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [tier]);

    const isLow = tier === 'low';
    const layerClass = isLow
        ? 'absolute inset-[-40%] w-[180%] h-[180%] animate-cosmic-float pointer-events-none'
        : 'absolute inset-[-40%] w-[180%] h-[180%] will-change-transform pointer-events-none';

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
            {/* 1. Núcleo Central de Profundidad */}
            <div
                ref={coreGlowRef}
                className={`${layerClass} ${isLight ? 'opacity-60' : 'opacity-70'}`}
                style={{
                    background: isLight
                        ? 'radial-gradient(ellipse 65% 65% at 50% 35%, rgba(168, 85, 247, 0.07) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)'
                        : 'radial-gradient(ellipse 65% 65% at 45% 40%, rgba(129, 140, 248, 0.22) 0%, rgba(99, 102, 241, 0.12) 28%, rgba(67, 56, 202, 0.04) 55%, transparent 75%)'
                }}
            />

            {/* 2. Atmósfera Superior Izquierda (Cian Celestial & Cielo) */}
            <div
                ref={cloud1Ref}
                className={`${layerClass} ${isLight ? 'opacity-70' : 'opacity-80'}`}
                style={{
                    background: isLight
                        ? 'radial-gradient(ellipse 70% 65% at 15% 15%, rgba(56, 189, 248, 0.11) 0%, rgba(99, 102, 241, 0.05) 35%, transparent 70%)'
                        : 'radial-gradient(ellipse 70% 65% at 15% 15%, rgba(168, 85, 247, 0.28) 0%, rgba(217, 70, 239, 0.16) 25%, rgba(147, 51, 234, 0.05) 55%, transparent 75%)'
                }}
            />

            {/* 3. Atmósfera Superior Derecha (Magenta & Lavanda Eetérea) */}
            <div
                ref={cloud4Ref}
                className={`${layerClass} ${isLight ? 'opacity-65' : 'opacity-75'}`}
                style={{
                    background: isLight
                        ? 'radial-gradient(ellipse 65% 60% at 85% 20%, rgba(217, 70, 239, 0.08) 0%, rgba(168, 85, 247, 0.04) 35%, transparent 70%)'
                        : 'radial-gradient(ellipse 60% 55% at 80% 20%, rgba(236, 72, 153, 0.24) 0%, rgba(192, 38, 211, 0.12) 28%, transparent 70%)'
                }}
            />

            {/* 4. Resplandor Central (Índigo & Vía Láctea) */}
            <div
                ref={cloud3Ref}
                className={`${layerClass} ${isLight ? 'opacity-60' : 'opacity-75'}`}
                style={{
                    background: isLight
                        ? 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(99, 102, 241, 0.08) 0%, rgba(56, 189, 248, 0.03) 40%, transparent 68%)'
                        : 'radial-gradient(ellipse 60% 55% at 20% 55%, rgba(56, 189, 248, 0.24) 0%, rgba(14, 165, 233, 0.12) 28%, rgba(30, 27, 75, 0.03) 55%, transparent 75%)'
                }}
            />

            {/* 5. Atmósfera Inferior Izquierda (Destellos de Polvo Solar Ámbar) */}
            <div
                ref={cloud5Ref}
                className={`${layerClass} ${isLight ? 'opacity-55' : 'opacity-65'}`}
                style={{
                    background: isLight
                        ? 'radial-gradient(ellipse 55% 50% at 25% 85%, rgba(251, 191, 36, 0.06) 0%, rgba(245, 158, 11, 0.02) 35%, transparent 65%)'
                        : 'radial-gradient(ellipse 55% 50% at 30% 85%, rgba(251, 191, 36, 0.16) 0%, rgba(245, 158, 11, 0.06) 28%, transparent 65%)'
                }}
            />

            {/* 6. Atmósfera Inferior Derecha (Profundidad Índigo / Zafiro) */}
            <div
                ref={cloud2Ref}
                className={`${layerClass} ${isLight ? 'opacity-60' : 'opacity-80'}`}
                style={{
                    background: isLight
                        ? 'radial-gradient(ellipse 75% 70% at 85% 85%, rgba(129, 140, 248, 0.07) 0%, rgba(99, 102, 241, 0.03) 35%, transparent 65%)'
                        : 'radial-gradient(ellipse 75% 70% at 85% 85%, rgba(99, 102, 241, 0.30) 0%, rgba(79, 70, 229, 0.16) 30%, rgba(30, 27, 75, 0.05) 60%, transparent 80%)'
                }}
            />
        </div>
    );
}
