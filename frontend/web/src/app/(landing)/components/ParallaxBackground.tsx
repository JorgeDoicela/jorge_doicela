'use client';

import { useEffect, useRef } from 'react';

/**
 * ParallaxBackground Component (Real Cosmic Nebulae Engine)
 * 
 * Renderiza nubes de nebulosas espaciales envolventes en 3D:
 * - Capas orgánicas con degradados radiales multinivel (Púrpura Galáctico, Magenta Espacial,
 *   Índigo Interestelar, Cian Estelar y Polvo Dorado).
 * - Movimiento Parallax independiente por capas según scroll y ratón/giroscopio.
 * - En Modo Claro mantiene auroras pastel ultra-limpias estilo Apple/Stripe.
 */
export default function ParallaxBackground() {
    const cloud1Ref = useRef<HTMLDivElement>(null);
    const cloud2Ref = useRef<HTMLDivElement>(null);
    const cloud3Ref = useRef<HTMLDivElement>(null);
    const cloud4Ref = useRef<HTMLDivElement>(null);
    const cloud5Ref = useRef<HTMLDivElement>(null);

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
            current.x += (target.x - current.x) * 0.04;
            current.y += (target.y - current.y) * 0.04;

            // Capa 1: Nebulosa Violeta-Magenta (Arriba Izquierda, scroll 0.12x)
            if (cloud1Ref.current) {
                const x1 = current.x * 50;
                const y1 = current.y * 50 + scrollY * 0.12;
                cloud1Ref.current.style.transform = `translate3d(${x1.toFixed(2)}px, ${y1.toFixed(2)}px, 0px)`;
            }

            // Capa 2: Corriente Índigo Profundo (Abajo Derecha, scroll 0.25x)
            if (cloud2Ref.current) {
                const x2 = -current.x * 40;
                const y2 = -current.y * 40 + scrollY * 0.25;
                cloud2Ref.current.style.transform = `translate3d(${x2.toFixed(2)}px, ${y2.toFixed(2)}px, 0px)`;
            }

            // Capa 3: Polvo Cian Estelar (Centro Izquierda, scroll 0.18x)
            if (cloud3Ref.current) {
                const x3 = current.x * 30;
                const y3 = current.y * 30 + scrollY * 0.18;
                cloud3Ref.current.style.transform = `translate3d(${x3.toFixed(2)}px, ${y3.toFixed(2)}px, 0px)`;
            }

            // Capa 4: Núcleo Galáctico Rosado/Púrpura (Arriba Derecha, scroll 0.09x)
            if (cloud4Ref.current) {
                const x4 = -current.x * 25;
                const y4 = -current.y * 25 + scrollY * 0.09;
                cloud4Ref.current.style.transform = `translate3d(${x4.toFixed(2)}px, ${y4.toFixed(2)}px, 0px)`;
            }

            // Capa 5: Polvo Solar Dorado (Abajo Izquierda, scroll 0.20x)
            if (cloud5Ref.current) {
                const x5 = current.x * 35;
                const y5 = current.y * 35 + scrollY * 0.20;
                cloud5Ref.current.style.transform = `translate3d(${x5.toFixed(2)}px, ${y5.toFixed(2)}px, 0px)`;
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
            {/* Nube 1: Nebulosa Violeta / Magenta Cósmica */}
            <div
                ref={cloud1Ref}
                className="absolute top-[-15%] left-[-15%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-[40%_60%_70%_30%/50%_30%_70%_50%] opacity-80 dark:opacity-100 blur-[140px] transition-colors duration-500 will-change-transform"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.28) 0%, rgba(217, 70, 239, 0.16) 45%, transparent 75%)'
                }}
            />

            {/* Nube 2: Corriente Interestelar Índigo Profunda */}
            <div
                ref={cloud2Ref}
                className="absolute bottom-[-15%] right-[-15%] w-[85vw] h-[85vw] max-w-[950px] max-h-[950px] rounded-[60%_40%_30%_70%/40%_60%_40%_60%] opacity-80 dark:opacity-100 blur-[150px] transition-colors duration-500 will-change-transform"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.30) 0%, rgba(79, 70, 229, 0.18) 50%, transparent 80%)'
                }}
            />

            {/* Nube 3: Polvo Celestial Cian & Sky */}
            <div
                ref={cloud3Ref}
                className="absolute top-[25%] left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-[50%_50%_40%_60%/60%_40%_60%_40%] opacity-70 dark:opacity-100 blur-[130px] transition-colors duration-500 will-change-transform"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.24) 0%, rgba(14, 165, 233, 0.12) 50%, transparent 75%)'
                }}
            />

            {/* Nube 4: Núcleo Galáctico Rosado / Púrpura */}
            <div
                ref={cloud4Ref}
                className="absolute top-[10%] right-[5%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-[45%_55%_60%_40%/50%_50%_40%_60%] opacity-70 dark:opacity-100 blur-[140px] transition-colors duration-500 will-change-transform"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.22) 0%, rgba(147, 51, 234, 0.14) 50%, transparent 80%)'
                }}
            />

            {/* Nube 5: Destellos de Polvo Solar Ámbar */}
            <div
                ref={cloud5Ref}
                className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-[60%_40%_50%_50%/40%_50%_60%_50%] opacity-60 dark:opacity-100 blur-[120px] transition-colors duration-500 will-change-transform"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.14) 0%, rgba(245, 158, 11, 0.05) 55%, transparent 75%)'
                }}
            />
        </div>
    );
}
