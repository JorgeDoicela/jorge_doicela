'use client';

import { useEffect, useRef } from 'react';

/**
 * ParallaxBackground Component (Deep Galactic Cosmos & Nebula Engine)
 * 
 * Renderiza nubes de nebulosas cósmicas envolventes con respiración armónica:
 * - Capas orgánicas de emisión gaseosa galáctica (Púrpura Interestelar, Magenta Andrómeda,
 *   Cian de Vía Láctea, Polvo Cósmico Dorado y Azul Abisal).
 * - Movimiento Parallax independiente por capas según scroll y ratón/giroscopio.
 * - En Modo Claro mantiene un ambiente limpio y translúcido.
 */
export default function ParallaxBackground() {
    const cloud1Ref = useRef<HTMLDivElement>(null);
    const cloud2Ref = useRef<HTMLDivElement>(null);
    const cloud3Ref = useRef<HTMLDivElement>(null);
    const cloud4Ref = useRef<HTMLDivElement>(null);
    const cloud5Ref = useRef<HTMLDivElement>(null);
    const coreGlowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let animationFrameId: number;

        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };

        let scrollY = window.scrollY;

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        const handleMouseMove = (e: MouseEvent) => {
            target.x = (e.clientX / window.innerWidth - 0.5) * 2;
            target.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (e.gamma !== null && e.beta !== null) {
                const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
                target.x = clamp(e.gamma / 45, -1, 1);
                target.y = clamp((e.beta - 45) / 45, -1, 1);
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
            window.addEventListener('mousemove', handleMouseMove);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        const animate = () => {
            current.x += (target.x - current.x) * 0.035;
            current.y += (target.y - current.y) * 0.035;

            // Capa 1: Nebulosa Violeta / Magenta Cósmica (Arriba Izquierda, scroll 0.12x)
            if (cloud1Ref.current) {
                const x1 = current.x * 45;
                const y1 = current.y * 45 + scrollY * 0.12;
                cloud1Ref.current.style.transform = `translate3d(${x1.toFixed(2)}px, ${y1.toFixed(2)}px, 0px)`;
            }

            // Capa 2: Corriente Interestelar Índigo Profunda (Abajo Derecha, scroll 0.22x)
            if (cloud2Ref.current) {
                const x2 = -current.x * 40;
                const y2 = -current.y * 40 + scrollY * 0.22;
                cloud2Ref.current.style.transform = `translate3d(${x2.toFixed(2)}px, ${y2.toFixed(2)}px, 0px)`;
            }

            // Capa 3: Polvo Celestial Cian & Vía Láctea (Centro Izquierda, scroll 0.16x)
            if (cloud3Ref.current) {
                const x3 = current.x * 30;
                const y3 = current.y * 30 + scrollY * 0.16;
                cloud3Ref.current.style.transform = `translate3d(${x3.toFixed(2)}px, ${y3.toFixed(2)}px, 0px)`;
            }

            // Capa 4: Núcleo Galáctico Rosado / Púrpura (Arriba Derecha, scroll 0.08x)
            if (cloud4Ref.current) {
                const x4 = -current.x * 25;
                const y4 = -current.y * 25 + scrollY * 0.08;
                cloud4Ref.current.style.transform = `translate3d(${x4.toFixed(2)}px, ${y4.toFixed(2)}px, 0px)`;
            }

            // Capa 5: Destellos de Polvo Solar Ámbar (Abajo Izquierda, scroll 0.18x)
            if (cloud5Ref.current) {
                const x5 = current.x * 35;
                const y5 = current.y * 35 + scrollY * 0.18;
                cloud5Ref.current.style.transform = `translate3d(${x5.toFixed(2)}px, ${y5.toFixed(2)}px, 0px)`;
            }

            // Núcleo galáctico central sutil
            if (coreGlowRef.current) {
                const xCore = current.x * 15;
                const yCore = current.y * 15 + scrollY * 0.05;
                coreGlowRef.current.style.transform = `translate3d(${xCore.toFixed(2)}px, ${yCore.toFixed(2)}px, 0px)`;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
            {/* Núcleo Central Galáctico Suave */}
            <div
                ref={coreGlowRef}
                className="absolute top-[20%] left-[20%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full opacity-60 will-change-transform pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(129, 140, 248, 0.22) 0%, rgba(99, 102, 241, 0.12) 30%, rgba(67, 56, 202, 0.04) 60%, transparent 75%)'
                }}
            />

            {/* Nube 1: Nebulosa Violeta / Magenta Cósmica */}
            <div
                ref={cloud1Ref}
                className="absolute top-[-10%] left-[-10%] w-[85vw] h-[85vw] max-w-[950px] max-h-[950px] rounded-full opacity-70 will-change-transform pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.26) 0%, rgba(217, 70, 239, 0.14) 30%, rgba(147, 51, 234, 0.05) 55%, transparent 75%)'
                }}
            />

            {/* Nube 2: Corriente Interestelar Índigo Profunda */}
            <div
                ref={cloud2Ref}
                className="absolute bottom-[-10%] right-[-10%] w-[90vw] h-[90vw] max-w-[1000px] max-h-[1000px] rounded-full opacity-70 will-change-transform pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.28) 0%, rgba(79, 70, 229, 0.14) 35%, rgba(30, 27, 75, 0.05) 65%, transparent 80%)'
                }}
            />

            {/* Nube 3: Polvo Celestial Cian & Vía Láctea */}
            <div
                ref={cloud3Ref}
                className="absolute top-[30%] left-[5%] w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full opacity-60 will-change-transform pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.22) 0%, rgba(14, 165, 233, 0.10) 35%, rgba(6, 78, 59, 0.03) 60%, transparent 75%)'
                }}
            />

            {/* Nube 4: Núcleo Galáctico Rosado Andrómeda */}
            <div
                ref={cloud4Ref}
                className="absolute top-[8%] right-[8%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-60 will-change-transform pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.22) 0%, rgba(192, 38, 211, 0.10) 35%, transparent 70%)'
                }}
            />

            {/* Nube 5: Destellos de Polvo Solar Ámbar */}
            <div
                ref={cloud5Ref}
                className="absolute bottom-[12%] left-[18%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full opacity-50 will-change-transform pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.05) 40%, transparent 70%)'
                }}
            />
        </div>
    );
}
