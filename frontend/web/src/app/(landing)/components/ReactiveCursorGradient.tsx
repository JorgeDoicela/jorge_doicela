'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ReactiveCursorGradient Component (High-End Ambient Light Engine)
 * 
 * Renderiza un gradiente radial sutil que sigue la posición del ratón en tiempo real
 * con física de suavizado orgánico (Lerp).
 * - En viewports táctiles / móviles se desactiva por completo para proteger la GPU y batería.
 * - Desactivado si el usuario prefiere movimiento reducido.
 */
export default function ReactiveCursorGradient() {
    const gradientRef = useRef<HTMLDivElement>(null);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // Verificar si es un dispositivo táctil o si el usuario prefiere movimiento reducido
        const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isTouch || !hasFinePointer || prefersReducedMotion) {
            setEnabled(false);
            return;
        }

        setEnabled(true);

        let animationFrameId: number;
        const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        const handleMouseMove = (e: MouseEvent) => {
            target.x = e.clientX;
            target.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        const animate = () => {
            // Lerp para movimiento orgánico y sedoso (coeficiente 0.08)
            current.x += (target.x - current.x) * 0.08;
            current.y += (target.y - current.y) * 0.08;

            if (gradientRef.current) {
                gradientRef.current.style.transform = `translate3d(${current.x.toFixed(1)}px, ${current.y.toFixed(1)}px, 0px)`;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (!enabled) return null;

    return (
        <div 
            className="fixed top-0 left-0 -z-10 pointer-events-none select-none w-0 h-0"
            aria-hidden="true"
        >
            <div
                ref={gradientRef}
                className="absolute top-[-375px] left-[-375px] w-[750px] h-[750px] rounded-full blur-[25px] opacity-80 dark:opacity-95 transition-opacity duration-700 will-change-transform"
                style={{
                    background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.20) 0%, rgba(168, 85, 247, 0.08) 45%, transparent 75%)'
                }}
            />
        </div>
    );
}
