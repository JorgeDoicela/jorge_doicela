'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    baseAlpha: number;
    alpha: number;
    twinklePhase: number;
    twinkleSpeed: number;
    colorType: number;
    isBrightStar: boolean;
}

interface BurstParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: { r: number; g: number; b: number };
    life: number;
    decay: number;
    hasFlare: boolean;
    trail: { x: number; y: number }[];
}

interface SupernovaFlash {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    color: { r: number; g: number; b: number };
}

/**
 * Componente InteractiveParticles (Edición Astrofísica Hiperrealista)
 * 
 * 1. MODO OSCURO ("COSMOS HIPERREALISTA"):
 *    - Estrellas con destellos de difracción óptica (Rayos estelares en cruz `+` tipo telescopio espacial James Webb / Hubble).
 *    - **ESTALLIDO DE SUPERNOVA EN CLICK/TAP**: Al hacer clic o tocar la pantalla, se genera un destello
 *      central focal (Supernova Flash) seguido de micro-estrellas con estelas de polvo estelar (Motion Trails)
 *      y rayos de luz óptica realistas que flotan y se frenan suavemente en el espacio.
 * 
 * 2. MODO CLARO:
 *    Desactivado para mantener el minimalismo impoluto.
 */
export default function InteractiveParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let animationFrameId: number;

        const pointer = {
            x: -1000,
            y: -1000,
            isActive: false,
            radius: 140
        };

        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles: Particle[] = [];
        const burstParticles: BurstParticle[] = [];
        const supernovaFlashes: SupernovaFlash[] = [];
        let isLight = false;

        // Paleta Estelar Galáctica
        const DARK_COSMOS_PALETTE = [
            { r: 255, g: 255, b: 255 }, // Blanco Diamante Puro
            { r: 186, g: 230, b: 253 }, // Cian Estelar Eléctrico
            { r: 199, g: 210, b: 254 }, // Índigo/Violeta Estelar
            { r: 232, g: 121, b: 249 }, // Magenta/Fuchsia Espacial
            { r: 252, g: 211, b: 77  }, // Oro / Ámbar Solar
        ];

        const checkTheme = () => {
            isLight = document.documentElement.classList.contains('light');
        };

        checkTheme();
        const observer = new MutationObserver(() => {
            checkTheme();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const resizeCanvas = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);

            initParticles();
        };

        const initParticles = () => {
            const isMobile = width < 768;
            const count = isMobile ? 35 : 85;
            particles = [];

            for (let i = 0; i < count; i++) {
                const isBrightStar = Math.random() < 0.14;
                const size = isBrightStar 
                    ? Math.random() * 1.5 + 2.0 
                    : Math.random() * 1.2 + 0.5;

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    size,
                    baseAlpha: isBrightStar ? Math.random() * 0.35 + 0.45 : Math.random() * 0.35 + 0.18,
                    alpha: Math.random() * 0.4 + 0.2,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.02 + 0.006,
                    colorType: Math.floor(Math.random() * DARK_COSMOS_PALETTE.length),
                    isBrightStar
                });
            }
        };

        // Función para dibujar los rayos de difracción óptica (Cruces de luz de telescopio espacial)
        const drawStarFlare = (x: number, y: number, rayLength: number, alpha: number, colorRgb: string) => {
            ctx.save();
            ctx.strokeStyle = colorRgb;
            ctx.lineWidth = 0.7;
            ctx.globalAlpha = alpha;

            ctx.beginPath();
            // Rayo vertical
            ctx.moveTo(x, y - rayLength);
            ctx.lineTo(x, y + rayLength);
            // Rayo horizontal
            ctx.moveTo(x - rayLength, y);
            ctx.lineTo(x + rayLength, y);
            ctx.stroke();

            ctx.restore();
        };

        // Generar estallido hiperrealista (Flash central + estrellas con estelas)
        const spawnSupernovaBurst = (clickX: number, clickY: number) => {
            if (isLight) return;

            const isMobile = width < 768;
            const burstCount = isMobile ? 12 : 20;
            const primaryColor = DARK_COSMOS_PALETTE[Math.floor(Math.random() * DARK_COSMOS_PALETTE.length)];

            // 1. Destello central focal de supernova
            supernovaFlashes.push({
                x: clickX,
                y: clickY,
                radius: 4,
                maxRadius: isMobile ? 35 : 55,
                alpha: 0.9,
                color: primaryColor
            });

            // 2. Fragmentos estelares expedidos en 360°
            for (let i = 0; i < burstCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4.8 + 1.5;
                const color = DARK_COSMOS_PALETTE[Math.floor(Math.random() * DARK_COSMOS_PALETTE.length)];

                burstParticles.push({
                    x: clickX,
                    y: clickY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 2.4 + 1.2,
                    color,
                    life: 1.0,
                    decay: Math.random() * 0.022 + 0.012,
                    hasFlare: Math.random() < 0.45,
                    trail: []
                });
            }
        };

        const handlePointerDown = (e: PointerEvent) => {
            spawnSupernovaBurst(e.clientX, e.clientY);
        };

        const handleMouseMove = (e: MouseEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.isActive = true;
        };

        const handleMouseLeave = () => {
            pointer.isActive = false;
            pointer.x = -1000;
            pointer.y = -1000;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                pointer.x = e.touches[0].clientX;
                pointer.y = e.touches[0].clientY;
                pointer.isActive = true;
            }
        };

        const handleTouchEnd = () => {
            pointer.isActive = false;
            pointer.x = -1000;
            pointer.y = -1000;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchstart', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd);

        resizeCanvas();

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            if (isLight) {
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // 1. DIBUJAR ESTRELLAS AMBIENTALES FLOTANTES CON TITILACIÓN
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                p.twinklePhase += p.twinkleSpeed;
                const twinkleFactor = Math.sin(p.twinklePhase) * 0.22;

                let currentAlpha = Math.max(0.08, Math.min(1, p.baseAlpha + twinkleFactor));

                if (pointer.isActive) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < pointer.radius) {
                        const force = (pointer.radius - dist) / pointer.radius;
                        const angle = Math.atan2(dy, dx);

                        p.x += Math.cos(angle) * force * 2.2;
                        p.y += Math.sin(angle) * force * 2.2;

                        currentAlpha = Math.min(1, currentAlpha + force * 0.4);
                    }
                }

                const color = DARK_COSMOS_PALETTE[p.colorType];
                const rgbaStr = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentAlpha.toFixed(3)})`;

                // Halo y Destello óptico en cruz para estrellas brillantes
                if (p.isBrightStar && currentAlpha > 0.3) {
                    const glowRadius = p.size * 2.8;
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${(currentAlpha * 0.4).toFixed(3)})`);
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    // Cruz de difracción óptica
                    drawStarFlare(p.x, p.y, p.size * 2.5, currentAlpha * 0.5, rgbaStr);
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = rgbaStr;
                ctx.fill();
            }

            // 2. DIBUJAR FLASHES DE SUPERNOVA CENTRALES (Onda expansiva de luz)
            for (let i = supernovaFlashes.length - 1; i >= 0; i--) {
                const flash = supernovaFlashes[i];
                flash.radius += (flash.maxRadius - flash.radius) * 0.15;
                flash.alpha -= 0.04;

                if (flash.alpha <= 0 || flash.radius >= flash.maxRadius - 1) {
                    supernovaFlashes.splice(i, 1);
                    continue;
                }

                const gradient = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.radius);
                gradient.addColorStop(0, `rgba(${flash.color.r}, ${flash.color.g}, ${flash.color.b}, ${flash.alpha.toFixed(3)})`);
                gradient.addColorStop(0.5, `rgba(${flash.color.r}, ${flash.color.g}, ${flash.color.b}, ${(flash.alpha * 0.3).toFixed(3)})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // 3. DIBUJAR ESTRELLAS HIPERREALISTAS DE ESTALLIDO CON ESTELAS (BURST PARTICLES)
            for (let i = burstParticles.length - 1; i >= 0; i--) {
                const bp = burstParticles[i];

                // Guardar historial de posición para la estela de movimiento
                bp.trail.push({ x: bp.x, y: bp.y });
                if (bp.trail.length > 4) bp.trail.shift();

                bp.x += bp.vx;
                bp.y += bp.vy;
                bp.vx *= 0.92; // Fricción espacial
                bp.vy *= 0.92;
                bp.life -= bp.decay;

                if (bp.life <= 0) {
                    burstParticles.splice(i, 1);
                    continue;
                }

                const rgbaStr = `rgba(${bp.color.r}, ${bp.color.g}, ${bp.color.b}, ${bp.life.toFixed(3)})`;

                // Dibujar Estela de Polvo Estelar (Trail)
                if (bp.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(bp.trail[0].x, bp.trail[0].y);
                    for (let t = 1; t < bp.trail.length; t++) {
                        ctx.lineTo(bp.trail[t].x, bp.trail[t].y);
                    }
                    ctx.strokeStyle = `rgba(${bp.color.r}, ${bp.color.g}, ${bp.color.b}, ${(bp.life * 0.35).toFixed(3)})`;
                    ctx.lineWidth = bp.size * 0.6;
                    ctx.stroke();
                }

                // Halo de luz radial
                const glowRadius = bp.size * 3 * bp.life;
                const gradient = ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, Math.max(0.1, glowRadius));
                gradient.addColorStop(0, `rgba(${bp.color.r}, ${bp.color.g}, ${bp.color.b}, ${(bp.life * 0.5).toFixed(3)})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(bp.x, bp.y, Math.max(0.1, glowRadius), 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Rayos de difracción en cruz (`+`) para estrellas del estallido
                if (bp.hasFlare && bp.life > 0.4) {
                    drawStarFlare(bp.x, bp.y, bp.size * 2.8 * bp.life, bp.life * 0.6, rgbaStr);
                }

                // Núcleo de la estrella
                ctx.beginPath();
                ctx.arc(bp.x, bp.y, bp.size * bp.life, 0, Math.PI * 2);
                ctx.fillStyle = rgbaStr;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchstart', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-5 pointer-events-none select-none block"
            aria-hidden="true"
        />
    );
}
