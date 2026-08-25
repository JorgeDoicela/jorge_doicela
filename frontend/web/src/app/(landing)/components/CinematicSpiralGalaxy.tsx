'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePerformanceTier } from '../context/PerformanceContext';

interface CosmicParticle {
    armIndex: number;
    distance: number;
    angle: number;
    speed: number;
    size: number;
    baseAlpha: number;
    pulseSpeed: number;
    pulseOffset: number;
    color: { r: number; g: number; b: number };
}

interface NebulaCloud {
    radius: number;
    angle: number;
    distance: number;
    speed: number;
    alpha: number;
    color: { r: number; g: number; b: number };
}

interface CoronalRay {
    angle: number;
    length: number;
    width: number;
    baseAlpha: number;
    speed: number;
}

/**
 * CinematicSpiralGalaxy Component (Adaptive Multi-Tier Engine)
 * 
 * - Tier 'high': Experiencia cinemática completa (1,600 partículas, 48 nebulosas, 16 rayos, arrastre interactivo).
 * - Tier 'mid': Versión ultraligera optimizada (350 partículas, 12 nebulosas, 6 rayos suaves, 60 FPS estables).
 * - Tier 'low' / Brave / Modo Claro: Desmontado (0% de impacto en CPU/GPU).
 */
export default function CinematicSpiralGalaxy() {
    const { tier } = usePerformanceTier();
    const [isLight, setIsLight] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        // En modo 'low' o Modo Claro se desmonta para 0% consumo
        if (tier === 'low' || isLight) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number | null = null;
        let width = 0;
        let height = 0;
        let galaxyRotation = 0;

        const isHigh = tier === 'high';

        // Parámetros calibrados por nivel de rendimiento
        const NUM_PARTICLES = isHigh ? 1600 : 350;
        const NUM_CLOUDS = isHigh ? 48 : 12;
        const NUM_RAYS = isHigh ? 16 : 6;
        const GALAXY_SCALE = isHigh ? 0.58 : 0.45;

        const galaxyPos = {
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            defaultX: 0,
            defaultY: 0,
            isDragging: false,
        };

        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        const NUM_ARMS = 2;

        const PALETTE = [
            { r: 255, g: 255, b: 255 }, // Blanco estelar
            { r: 168, g: 130, b: 255 }, // Lavanda cósmica
            { r: 99, g: 140, b: 248 },  // Zafiro / Índigo
            { r: 56, g: 189, b: 248 },  // Cian glaciar
            { r: 251, g: 210, b: 120 }, // Oro solar
        ];

        let particles: CosmicParticle[] = [];
        let nebulaClouds: NebulaCloud[] = [];
        let coronalRays: CoronalRay[] = [];

        const initScene = () => {
            const maxRadius = Math.min(width, height) * GALAXY_SCALE;
            particles = [];
            nebulaClouds = [];
            coronalRays = [];

            // 1. Rayos Volumétricos
            for (let i = 0; i < NUM_RAYS; i++) {
                coronalRays.push({
                    angle: (i * 2 * Math.PI) / NUM_RAYS + (Math.random() - 0.5) * 0.2,
                    length: maxRadius * (0.55 + Math.random() * 0.4),
                    width: 0.05 + Math.random() * 0.07,
                    baseAlpha: (isHigh ? 0.06 : 0.04) + Math.random() * 0.05,
                    speed: (Math.random() * 0.00025 + 0.00008) * (Math.random() < 0.5 ? 1 : -1),
                });
            }

            // 2. Nubes de Gas Nebuloso
            for (let i = 0; i < NUM_CLOUDS; i++) {
                const armIndex = i % NUM_ARMS;
                const armOffset = armIndex * Math.PI;
                const distRatio = Math.pow(Math.random(), 1.4);
                const distance = distRatio * maxRadius * 0.85 + 20;
                const spiralAngle = Math.log(distance / 12 + 1) * 2.2 + armOffset;
                const spreadAngle = (Math.random() - 0.5) * 0.55;
                const angle = spiralAngle + spreadAngle;

                nebulaClouds.push({
                    radius: isHigh ? (30 + Math.random() * 50) : (20 + Math.random() * 30),
                    angle,
                    distance,
                    speed: 0.0003 + (1 - distRatio) * 0.0005,
                    alpha: 0.025 + Math.random() * 0.035,
                    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
                });
            }

            // 3. Polvo Estelar
            for (let i = 0; i < NUM_PARTICLES; i++) {
                const armIndex = i % NUM_ARMS;
                const armOffset = armIndex * Math.PI;
                const distRatio = Math.pow(Math.random(), 1.5);
                const distance = distRatio * maxRadius + 8;

                const spiralAngle = Math.log(distance / 12 + 1) * 2.2 + armOffset;
                const gaussianSpread = (Math.random() + Math.random() + Math.random() - 1.5) * (0.55 + distRatio * 0.75);
                const angle = spiralAngle + gaussianSpread;

                const speed = 0.00035 + (1 - distRatio) * 0.00065;
                const isBrightStar = Math.random() < (isHigh ? 0.06 : 0.04);
                const size = isBrightStar ? Math.random() * 1.8 + 0.9 : Math.random() * 0.8 + 0.25;
                const baseAlpha = isBrightStar ? Math.random() * 0.6 + 0.3 : Math.random() * 0.4 + 0.1;
                const pulseSpeed = Math.random() * 0.03 + 0.01;
                const pulseOffset = Math.random() * Math.PI * 2;

                const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

                particles.push({
                    armIndex,
                    distance,
                    angle,
                    speed,
                    size,
                    baseAlpha,
                    pulseSpeed,
                    pulseOffset,
                    color,
                });
            }
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            
            const isMobile = width < 768;
            
            // En móvil, anclar con precisión milimétrica detrás del titular del nombre
            const h1Element = document.querySelector('h1');
            if (isMobile && h1Element) {
                const rect = h1Element.getBoundingClientRect();
                galaxyPos.defaultX = rect.left + rect.width * 0.5;
                galaxyPos.defaultY = rect.top + rect.height * 0.5;
            } else {
                galaxyPos.defaultX = width * 0.5;
                galaxyPos.defaultY = isMobile ? height * 0.385 : height * 0.48;
            }

            galaxyPos.currentX = galaxyPos.targetX = galaxyPos.defaultX;
            galaxyPos.currentY = galaxyPos.targetY = galaxyPos.defaultY;

            initScene();
        };

        const pointerState = {
            startX: 0,
            startY: 0,
            isDown: false,
            isInsideCard: false,
        };

        const handlePointerDown = (e: PointerEvent) => {
            if (!isHigh) return;
            // Ignorar clics en botones, enlaces o controles nativos
            if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) return;

            pointerState.isDown = true;
            pointerState.startX = e.clientX;
            pointerState.startY = e.clientY;

            // Detectar si el clic se dio dentro de una tarjeta o cuadro de contenido
            const cardElement = (e.target as HTMLElement).closest('.bg-card, article, [role="region"], #highlights, #details');
            pointerState.isInsideCard = Boolean(cardElement);

            // Si se hace clic en el fondo libre, reposicionar de inmediato
            if (!pointerState.isInsideCard) {
                galaxyPos.isDragging = true;
                galaxyPos.targetX = e.clientX;
                galaxyPos.targetY = e.clientY;
            }
        };

        const handlePointerMove = (e: PointerEvent) => {
            mouse.targetX = (e.clientX / width - 0.5) * 45;
            mouse.targetY = (e.clientY / height - 0.5) * 45;

            if (!isHigh || !pointerState.isDown) return;

            // Si el clic empezó dentro de un cuadro, solo activar movimiento al arrastrar (> 8px)
            const moveDistance = Math.hypot(e.clientX - pointerState.startX, e.clientY - pointerState.startY);
            if (pointerState.isInsideCard && moveDistance > 8) {
                galaxyPos.isDragging = true;
            }

            if (galaxyPos.isDragging) {
                galaxyPos.targetX = e.clientX;
                galaxyPos.targetY = e.clientY;
            }
        };

        const handlePointerUp = () => {
            pointerState.isDown = false;
            pointerState.isInsideCard = false;
            galaxyPos.isDragging = false;
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            galaxyPos.currentX += (galaxyPos.targetX - galaxyPos.currentX) * 0.055;
            galaxyPos.currentY += (galaxyPos.targetY - galaxyPos.currentY) * 0.055;

            mouse.x += (mouse.targetX - mouse.x) * 0.04;
            mouse.y += (mouse.targetY - mouse.y) * 0.04;

            galaxyRotation += 0.00028;
            const now = Date.now();
            const maxRadius = Math.min(width, height) * GALAXY_SCALE;

            const renderCenterX = galaxyPos.currentX + mouse.x * (isHigh ? 0.5 : 0.2);
            const renderCenterY = galaxyPos.currentY + mouse.y * (isHigh ? 0.5 : 0.2);

            ctx.save();
            ctx.translate(renderCenterX, renderCenterY);

            const tiltScaleY = 0.54 + (mouse.y / 280);
            ctx.scale(1, Math.max(0.35, tiltScaleY));
            ctx.rotate(0.24 + mouse.x * 0.0035);

            ctx.globalCompositeOperation = 'lighter';

            // 1. Rayos Volumétricos
            for (let i = 0; i < coronalRays.length; i++) {
                const ray = coronalRays[i];
                ray.angle += ray.speed;

                const rayAlpha = ray.baseAlpha * (0.8 + 0.2 * Math.sin(now * 0.0012 + i));
                const rayGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, ray.length);
                rayGradient.addColorStop(0, `rgba(255, 245, 210, ${(rayAlpha * 0.9).toFixed(3)})`);
                rayGradient.addColorStop(0.3, `rgba(129, 140, 248, ${(rayAlpha * 0.4).toFixed(3)})`);
                rayGradient.addColorStop(0.7, `rgba(168, 85, 247, ${(rayAlpha * 0.1).toFixed(3)})`);
                rayGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.save();
                ctx.rotate(ray.angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, ray.length, -ray.width, ray.width);
                ctx.closePath();
                ctx.fillStyle = rayGradient;
                ctx.fill();
                ctx.restore();
            }

            // 2. Nubes de Gas Nebuloso
            for (let i = 0; i < nebulaClouds.length; i++) {
                const cloud = nebulaClouds[i];
                cloud.angle += cloud.speed;

                const currentAngle = cloud.angle + galaxyRotation;
                const cx = Math.cos(currentAngle) * cloud.distance;
                const cy = Math.sin(currentAngle) * cloud.distance;

                const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloud.radius);
                cloudGrad.addColorStop(0, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${(cloud.alpha * 0.5).toFixed(3)})`);
                cloudGrad.addColorStop(0.5, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${(cloud.alpha * 0.15).toFixed(3)})`);
                cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.beginPath();
                ctx.arc(cx, cy, cloud.radius, 0, Math.PI * 2);
                ctx.fillStyle = cloudGrad;
                ctx.fill();
            }

            // 3. Núcleo Solar
            const sunPulse = 1 + Math.sin(now * 0.0018) * 0.04;
            const coreRadius = maxRadius * (isHigh ? 0.38 : 0.28) * sunPulse;
            const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, coreRadius);
            coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.70)');
            coreGrad.addColorStop(0.06, 'rgba(254, 240, 138, 0.45)');
            coreGrad.addColorStop(0.22, 'rgba(129, 140, 248, 0.24)');
            coreGrad.addColorStop(0.55, 'rgba(168, 85, 247, 0.08)');
            coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.arc(0, 0, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();

            // 4. Destello Anamórfico
            const flareW = maxRadius * 1.35;
            const flareGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, flareW);
            flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
            flareGrad.addColorStop(0.15, 'rgba(56, 189, 248, 0.25)');
            flareGrad.addColorStop(0.50, 'rgba(129, 140, 248, 0.06)');
            flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.save();
            ctx.scale(1, 0.07);
            ctx.beginPath();
            ctx.arc(0, 0, flareW, 0, Math.PI * 2);
            ctx.fillStyle = flareGrad;
            ctx.fill();
            ctx.restore();

            // 5. Polvo Cósmico
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.angle += p.speed;

                const currentAngle = p.angle + galaxyRotation;
                const x = Math.cos(currentAngle) * p.distance;
                const y = Math.sin(currentAngle) * p.distance;

                const pulse = Math.sin(now * p.pulseSpeed * 0.05 + p.pulseOffset) * 0.3 + 0.7;
                const alpha = p.baseAlpha * pulse;

                if (isHigh && p.size > 0.9) {
                    const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, p.size * 2.8);
                    haloGrad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(alpha * 0.35).toFixed(3)})`);
                    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    ctx.beginPath();
                    ctx.arc(x, y, p.size * 2.8, 0, Math.PI * 2);
                    ctx.fillStyle = haloGrad;
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
                ctx.fill();
            }

            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        window.addEventListener('resize', resize, { passive: true });
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        if (isHigh) {
            window.addEventListener('pointerdown', handlePointerDown);
            window.addEventListener('pointerup', handlePointerUp);
            window.addEventListener('pointercancel', handlePointerUp);
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        resize();
        animationFrameId = requestAnimationFrame(render);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            if (isHigh) {
                window.removeEventListener('pointerdown', handlePointerDown);
                window.removeEventListener('pointerup', handlePointerUp);
                window.removeEventListener('pointercancel', handlePointerUp);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [tier, isLight]);

    if (tier === 'low' || isLight) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-8 pointer-events-none select-none block opacity-90"
            aria-hidden="true"
        />
    );
}
