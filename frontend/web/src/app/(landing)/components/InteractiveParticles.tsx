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
    layer: 'distant' | 'mid' | 'bright';
}

interface StardustEmber {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: { r: number; g: number; b: number };
    life: number;
    decay: number;
    twinklePhase: number;
    twinkleSpeed: number;
}

interface CosmicRipple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    color: { r: number; g: number; b: number };
}

interface NebulaBloom {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    alpha: number;
    color: { r: number; g: number; b: number };
}

interface ShootingStar {
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    alpha: number;
    decay: number;
    size: number;
    color: { r: number; g: number; b: number };
}

/**
 * Componente InteractiveParticles (Astrofísica Hiperrealista & Polvo Cósmico)
 * 
 * 1. CAMPO ESTELAR ORGÁNICO EN 3 CAPAS:
 *    - Capa 1: ~180 micro-estrellas distantes en titilación tenue.
 *    - Capa 2: ~70 estrellas intermedias con temperaturas estelares astronómicas.
 *    - Capa 3: ~14 estrellas brillantes con difracción óptica en cruz (`+`).
 *    - Meteoros / Estrellas fugaces periódicas con degradado de plasma.
 * 
 * 2. INTERACCIÓN CÓSMICA AL CLIC/TOQUE (Ondas Gravitacionales & Vórtice de Polvo Estelar):
 *    - Ondas de choque gravitacionales (Cosmic Shockwave Rings) que se expanden suavemente.
 *    - Nube de gas nebular efímero que ilumina el espacio local.
 *    - Micro-polvo estelar en espiral/vórtice (35-50 micro-puntos que flotan y se frenan con física de vacío).
 *    - CERO líneas rectas duras o fuegos artificiales artificiales.
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
        const stardustEmbers: StardustEmber[] = [];
        const cosmicRipples: CosmicRipple[] = [];
        const nebulaBlooms: NebulaBloom[] = [];
        const shootingStars: ShootingStar[] = [];
        let isLight = false;
        let lastMeteorTime = Date.now();

        // Espectro estelar real de radiación cósmica
        const COSMIC_PALETTE = [
            { r: 255, g: 255, b: 255 }, // Blanco Diamante Puro (O/A)
            { r: 224, g: 242, b: 254 }, // Azul Glaciar Caliente (B)
            { r: 186, g: 230, b: 253 }, // Cian Estelar Eléctrico
            { r: 254, g: 240, b: 138 }, // Amarillo/Dorado Estelar (G/K)
            { r: 253, g: 186, b: 116 }, // Ámbar / Gigante Roja (M)
            { r: 240, g: 171, b: 252 }, // Magenta Espacial Andrómeda
            { r: 199, g: 210, b: 254 }, // Violeta / Índigo Interestelar
        ];

        const checkTheme = () => {
            const wasLight = isLight;
            isLight = document.documentElement.classList.contains('light');
            if (isLight) {
                ctx.clearRect(0, 0, width, height);
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            } else if (wasLight && !isLight) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        checkTheme();
        const observer = new MutationObserver(() => {
            checkTheme();
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

        const resizeCanvas = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);

            initGalaxy();
        };

        const initGalaxy = () => {
            const isMobile = width < 768;
            particles = [];

            // 1. Capa de Micro-Polvo Estelar Lejano
            const distantCount = isMobile ? 90 : 190;
            for (let i = 0; i < distantCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.06,
                    vy: (Math.random() - 0.5) * 0.06,
                    size: Math.random() * 0.5 + 0.3,
                    baseAlpha: Math.random() * 0.35 + 0.15,
                    alpha: Math.random() * 0.3 + 0.1,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.015 + 0.005,
                    colorType: Math.floor(Math.random() * COSMIC_PALETTE.length),
                    layer: 'distant'
                });
            }

            // 2. Capa Media
            const midCount = isMobile ? 35 : 75;
            for (let i = 0; i < midCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.14,
                    vy: (Math.random() - 0.5) * 0.14,
                    size: Math.random() * 0.8 + 0.7,
                    baseAlpha: Math.random() * 0.4 + 0.28,
                    alpha: Math.random() * 0.4 + 0.25,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.022 + 0.008,
                    colorType: Math.floor(Math.random() * COSMIC_PALETTE.length),
                    layer: 'mid'
                });
            }

            // 3. Capa de Primer Plano (Estrellas con Difracción Óptica)
            const brightCount = isMobile ? 8 : 15;
            for (let i = 0; i < brightCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.18,
                    vy: (Math.random() - 0.5) * 0.18,
                    size: Math.random() * 1.0 + 1.6,
                    baseAlpha: Math.random() * 0.3 + 0.6,
                    alpha: Math.random() * 0.3 + 0.5,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.028 + 0.01,
                    colorType: Math.floor(Math.random() * 4),
                    layer: 'bright'
                });
            }
        };

        // Generar Estrella Fugaz / Meteoro
        const spawnShootingStar = () => {
            if (isLight) return;
            const startX = Math.random() * width * 0.85;
            const startY = Math.random() * height * 0.35;
            const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3;
            const speed = Math.random() * 8 + 11;

            shootingStars.push({
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                length: Math.random() * 80 + 60,
                alpha: 0.9,
                decay: Math.random() * 0.018 + 0.012,
                size: Math.random() * 1.0 + 0.9,
                color: COSMIC_PALETTE[Math.floor(Math.random() * 3)]
            });
        };

        // Rayos de difracción óptica en cruz (`+`)
        const drawStarFlare = (x: number, y: number, rayLength: number, alpha: number, colorRgb: string) => {
            ctx.save();
            ctx.strokeStyle = colorRgb;
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

            ctx.beginPath();
            ctx.moveTo(x, y - rayLength);
            ctx.lineTo(x, y + rayLength);
            ctx.moveTo(x - rayLength, y);
            ctx.lineTo(x + rayLength, y);
            ctx.stroke();

            ctx.restore();
        };

        // Disparar evento astronómico al hacer clic/toque: Ondas gravitacionales + Vórtice de Polvo Estelar
        const triggerCosmicDisturbance = (clickX: number, clickY: number) => {
            if (isLight) return;

            const isMobile = width < 768;
            const emberCount = isMobile ? 22 : 40;
            const primaryColor = COSMIC_PALETTE[Math.floor(Math.random() * COSMIC_PALETTE.length)];

            // 1. Nube de gas nebular efímero que ilumina el punto
            nebulaBlooms.push({
                x: clickX,
                y: clickY,
                radius: 10,
                maxRadius: isMobile ? 65 : 110,
                alpha: 0.55,
                color: primaryColor
            });

            // 2. Ondas de choque gravitacionales concéntricas
            cosmicRipples.push({
                x: clickX,
                y: clickY,
                radius: 4,
                maxRadius: isMobile ? 55 : 90,
                alpha: 0.75,
                color: primaryColor
            });

            // 3. Nube de micro-polvo estelar con movimiento en espiral / vórtice
            const baseSpin = (Math.random() - 0.5) * 1.5;
            for (let i = 0; i < emberCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.8 + 0.6;
                // Componente tangencial para simular vórtice/espiral galáctico
                const tangentialVx = -Math.sin(angle) * baseSpin * speed * 0.6;
                const tangentialVy = Math.cos(angle) * baseSpin * speed * 0.6;
                const radialVx = Math.cos(angle) * speed;
                const radialVy = Math.sin(angle) * speed;

                const color = COSMIC_PALETTE[Math.floor(Math.random() * COSMIC_PALETTE.length)];

                stardustEmbers.push({
                    x: clickX + (Math.random() - 0.5) * 8,
                    y: clickY + (Math.random() - 0.5) * 8,
                    vx: radialVx + tangentialVx,
                    vy: radialVy + tangentialVy,
                    size: Math.random() * 0.9 + 0.45,
                    color,
                    life: 1.0,
                    decay: Math.random() * 0.016 + 0.009,
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.05 + 0.02
                });
            }
        };

        const handlePointerDown = (e: PointerEvent) => {
            triggerCosmicDisturbance(e.clientX, e.clientY);
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
                return;
            }

            const now = Date.now();

            // Lanzar estrella fugaz periódicamente cada 9 a 14 segundos
            if (now - lastMeteorTime > 9500 && Math.random() < 0.008) {
                spawnShootingStar();
                lastMeteorTime = now;
            }

            // 1. RENDERIZAR NEBULOSAS EFÍMERAS DE FONDO (NEBULA BLOOMS)
            for (let i = nebulaBlooms.length - 1; i >= 0; i--) {
                const bloom = nebulaBlooms[i];
                bloom.radius += (bloom.maxRadius - bloom.radius) * 0.06;
                bloom.alpha -= 0.012;

                if (bloom.alpha <= 0 || bloom.radius >= bloom.maxRadius - 1) {
                    nebulaBlooms.splice(i, 1);
                    continue;
                }

                const gradient = ctx.createRadialGradient(bloom.x, bloom.y, 0, bloom.x, bloom.y, bloom.radius);
                gradient.addColorStop(0, `rgba(${bloom.color.r}, ${bloom.color.g}, ${bloom.color.b}, ${(bloom.alpha * 0.45).toFixed(3)})`);
                gradient.addColorStop(0.5, `rgba(${bloom.color.r}, ${bloom.color.g}, ${bloom.color.b}, ${(bloom.alpha * 0.15).toFixed(3)})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(bloom.x, bloom.y, bloom.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // 2. RENDERIZAR ONDAS DE CHOQUE GRAVITACIONALES (COSMIC RIPPLES)
            for (let i = cosmicRipples.length - 1; i >= 0; i--) {
                const ripple = cosmicRipples[i];
                ripple.radius += (ripple.maxRadius - ripple.radius) * 0.08;
                ripple.alpha -= 0.022;

                if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius - 1) {
                    cosmicRipples.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${ripple.color.r}, ${ripple.color.g}, ${ripple.color.b}, ${(ripple.alpha * 0.5).toFixed(3)})`;
                ctx.lineWidth = Math.max(0.5, (1 - ripple.radius / ripple.maxRadius) * 2.2);
                ctx.stroke();
                ctx.restore();
            }

            // 3. RENDERIZAR CAMPO ESTELAR AMBIENTAL (3 CAPAS)
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                p.twinklePhase += p.twinkleSpeed;
                const twinkleFactor = Math.sin(p.twinklePhase) * (p.layer === 'distant' ? 0.28 : 0.22);
                let currentAlpha = Math.max(0.06, Math.min(1, p.baseAlpha + twinkleFactor));

                // Micro-atracción gravitacional sutil
                if (pointer.isActive) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < pointer.radius) {
                        const force = (pointer.radius - dist) / pointer.radius;
                        const angle = Math.atan2(dy, dx);

                        p.x += Math.cos(angle) * force * (p.layer === 'distant' ? 0.4 : 1.2);
                        p.y += Math.sin(angle) * force * (p.layer === 'distant' ? 0.4 : 1.2);

                        currentAlpha = Math.min(1, currentAlpha + force * 0.3);
                    }
                }

                const color = COSMIC_PALETTE[p.colorType];
                const rgbaStr = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentAlpha.toFixed(3)})`;

                if (p.layer === 'bright' && currentAlpha > 0.25) {
                    const glowRadius = p.size * 3.0;
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
                    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${(currentAlpha * 0.45).toFixed(3)})`);
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    drawStarFlare(p.x, p.y, p.size * 2.5, currentAlpha * 0.55, rgbaStr);
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = rgbaStr;
                ctx.fill();
            }

            // 4. RENDERIZAR ESTRELLAS FUGACES (SHOOTING STARS)
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];

                s.x += s.vx;
                s.y += s.vy;
                s.alpha -= s.decay;

                if (s.alpha <= 0 || s.x > width + 100 || s.y > height + 100) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                const tailX = s.x - (s.vx / 14) * s.length;
                const tailY = s.y - (s.vy / 14) * s.length;

                const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                grad.addColorStop(0.7, `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${(s.alpha * 0.35).toFixed(3)})`);
                grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha.toFixed(3)})`);

                ctx.save();
                ctx.strokeStyle = grad;
                ctx.lineWidth = s.size;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();

                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(3)})`;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * 1.1, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }

            // 5. RENDERIZAR MICRO-POLVO ESTELAR EN VÓRTICE (STARDUST EMBERS)
            for (let i = stardustEmbers.length - 1; i >= 0; i--) {
                const ember = stardustEmbers[i];

                ember.x += ember.vx;
                ember.y += ember.vy;
                ember.vx *= 0.965; // Fricción suave en vacío espacial
                ember.vy *= 0.965;
                ember.life -= ember.decay;

                if (ember.life <= 0) {
                    stardustEmbers.splice(i, 1);
                    continue;
                }

                ember.twinklePhase += ember.twinkleSpeed;
                const twinkle = Math.sin(ember.twinklePhase) * 0.2;
                const effectiveAlpha = Math.max(0, Math.min(1, (ember.life + twinkle)));

                const color = ember.color;
                const glowRadius = ember.size * 2.8;

                // Micro-halo de gas estelar
                const gradient = ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, Math.max(0.1, glowRadius));
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${(effectiveAlpha * 0.6).toFixed(3)})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(ember.x, ember.y, Math.max(0.1, glowRadius), 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Núcleo del polvo estelar
                ctx.beginPath();
                ctx.arc(ember.x, ember.y, ember.size * effectiveAlpha, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${(effectiveAlpha * 0.9).toFixed(3)})`;
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
