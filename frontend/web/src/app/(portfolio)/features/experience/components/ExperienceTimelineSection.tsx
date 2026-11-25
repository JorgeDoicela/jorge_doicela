'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Briefcase, GraduationCap } from 'lucide-react';
import { useHelicalTimeline } from '../hooks/useHelicalTimeline';
import type { PortfolioExperienceItem } from '../types';

const CURVE_SVG_WIDTH = 120;
const CURVE_CENTER_X = CURVE_SVG_WIDTH / 2; // 60
const CURVE_AMPLITUDE = 28; // Desplazamiento horizontal de cada nodo respecto al centro

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

/**
 * Construye una curva Bézier cúbica suave en S desde el centro del primer nodo
 * hasta el centro del último nodo, sin colas ni ganchos sueltos en los extremos.
 */
function buildOrganicCurvePath(nodeYs: number[]): string {
    if (nodeYs.length < 2) return '';

    const points = nodeYs.map((y, idx) => ({
        x: idx % 2 === 0 ? CURVE_CENTER_X - CURVE_AMPLITUDE : CURVE_CENTER_X + CURVE_AMPLITUDE,
        y,
    }));

    const segments: string[] = [`M ${points[0].x} ${points[0].y.toFixed(1)}`];

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const midY = (p1.y + p2.y) / 2;
        segments.push(
            `C ${p1.x} ${midY.toFixed(1)}, ${p2.x} ${midY.toFixed(1)}, ${p2.x} ${p2.y.toFixed(1)}`
        );
    }

    return segments.join(' ');
}

interface OrganicCurveSpineProps {
    nodeYs: number[];
    trackHeight: number;
    progress: number;
    reducedMotion: boolean;
}

function OrganicCurveSpine({
    nodeYs,
    trackHeight,
    progress,
    reducedMotion,
}: OrganicCurveSpineProps) {
    const gradientId = useId();
    const pathRef = useRef<SVGPathElement | null>(null);
    const [headPoint, setHeadPoint] = useState<{ x: number; y: number } | null>(null);

    const pathD = useMemo(() => buildOrganicCurvePath(nodeYs), [nodeYs]);

    useEffect(() => {
        const pathEl = pathRef.current;
        if (!pathEl || !pathD || reducedMotion) {
            setHeadPoint(null);
            return;
        }

        const totalLen = pathEl.getTotalLength();
        if (totalLen <= 0) return;

        const pt = pathEl.getPointAtLength(progress * totalLen);
        setHeadPoint({ x: pt.x, y: pt.y });
    }, [pathD, progress, reducedMotion]);

    if (!pathD || trackHeight <= 0) return null;

    return (
        <svg
            width={CURVE_SVG_WIDTH}
            height={trackHeight}
            viewBox={`0 0 ${CURVE_SVG_WIDTH} ${trackHeight}`}
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-10 overflow-visible"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold-400)" />
                    <stop offset="55%" stopColor="var(--gold-300)" />
                    <stop offset="100%" stopColor="var(--gold-200)" />
                </linearGradient>
            </defs>

            {/* Curva base sutil */}
            <path
                d={pathD}
                fill="none"
                stroke="var(--border-gold)"
                strokeOpacity="0.4"
                strokeWidth="1.75"
                strokeLinecap="round"
            />

            {/* Curva dorada activa animada por scroll */}
            <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2.25"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={reducedMotion ? 0 : 1 - progress}
            />

            {/* Punta luminosa recorriendo la curva */}
            {headPoint && progress > 0.02 && progress < 0.98 && (
                <g>
                    <circle
                        cx={headPoint.x}
                        cy={headPoint.y}
                        r="6.5"
                        fill="var(--glow-gold-strong)"
                    />
                    <circle
                        cx={headPoint.x}
                        cy={headPoint.y}
                        r="3"
                        fill="var(--gold-300)"
                    />
                </g>
            )}
        </svg>
    );
}

interface HelicalCardProps {
    item: PortfolioExperienceItem;
    index: number;
    delta: number;
    isReached: boolean;
    isDesktop: boolean;
    reducedMotion: boolean;
    workBadgeLabel: string;
    eduBadgeLabel: string;
    highlightsLabel?: string;
    stackUsedLabel?: string;
    registerRef: (el: HTMLElement | null) => void;
}

function HelicalCard({
    item,
    index,
    delta,
    isReached,
    isDesktop,
    reducedMotion,
    workBadgeLabel,
    eduBadgeLabel,
    highlightsLabel,
    stackUsedLabel,
    registerRef,
}: HelicalCardProps) {
    const [hoverGlow, setHoverGlow] = useState<{ x: number; y: number; active: boolean }>({
        x: 50,
        y: 50,
        active: false,
    });

    const isLeft = index % 2 === 0;
    const isPrimary = index === 0;
    const isEducation = item.type === 'education';
    const typeLabel = isEducation ? eduBadgeLabel : workBadgeLabel;
    const NodeIcon = isEducation ? GraduationCap : Briefcase;

    // Zona de lectura nítida al centro (|delta| < 0.22) o cuando el cursor está encima (0% borroso).
    // Fuera de esa zona, la tarjeta orbita en 3D (arco en X, profundidad en Z y giro Y/X) como cámara rodeando el eje.
    const absDelta = Math.abs(delta);
    const sign = delta >= 0 ? 1 : -1;
    const shouldAnimate3D = isDesktop && !reducedMotion && !hoverGlow.active;
    const orbitalAmount = shouldAnimate3D ? smoothstep(0.22, 1.0, absDelta) : 0;
    const signedOrbit = sign * orbitalAmount;

    const sideDir = isLeft ? 1 : -1;
    const rotateY = sideDir * signedOrbit * 36;
    const rotateX = -signedOrbit * 12;
    const translateZ = -orbitalAmount * 150;
    const translateX = -sideDir * orbitalAmount * 42;
    const translateY = signedOrbit * 18;
    const scale = 1 - orbitalAmount * 0.14;
    const opacity = reducedMotion || !isDesktop ? 1 : 1 - orbitalAmount * 0.45;

    const isFlatCrisp = orbitalAmount < 0.005;
    const isInFocus = absDelta < 0.34;
    const isNodeLit = isPrimary || isReached || isInFocus || hoverGlow.active;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverGlow({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
            active: true,
        });
    };

    const handleMouseLeave = () => {
        setHoverGlow((prev) => ({ ...prev, active: false }));
    };

    return (
        <article
            ref={registerRef}
            className="group relative grid grid-cols-1 md:grid-cols-2 items-start gap-4 md:gap-0 pl-9 md:pl-0"
            style={isDesktop && !reducedMotion ? { perspective: '980px' } : undefined}
        >
            {/* Nodo Móvil (< md) */}
            <div
                className="md:hidden absolute left-[11px] -translate-x-1/2 top-6 z-20 flex items-center justify-center"
                aria-hidden="true"
            >
                <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ${isNodeLit
                            ? 'border-gold-300 bg-background shadow-[0_0_12px_var(--glow-gold-strong)]'
                            : 'border-border-gold bg-background'
                        }`}
                >
                    <NodeIcon
                        className={`w-3 h-3 ${isPrimary || isInFocus
                                ? 'text-gold-300'
                                : isNodeLit
                                    ? 'text-gold-400'
                                    : 'text-muted'
                            }`}
                    />
                </div>
            </div>

            {/* Nodo Desktop sobre el vértice exacto de la curva S */}
            <div
                className="hidden md:flex absolute left-1/2 top-[24px] z-20 items-center justify-center"
                style={{
                    transform: `translateX(calc(-50% + ${isLeft ? -CURVE_AMPLITUDE : CURVE_AMPLITUDE}px))`,
                }}
                aria-hidden="true"
            >
                <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${isInFocus || isNodeLit
                            ? 'border-gold-300 bg-background shadow-[0_4px_14px_rgba(0,0,0,0.22),0_0_16px_var(--glow-gold-strong)] scale-105'
                            : 'border-border-gold bg-background scale-100'
                        }`}
                >
                    <NodeIcon
                        className={`w-3.5 h-3.5 transition-colors duration-300 ${isPrimary || isInFocus
                                ? 'text-gold-300'
                                : isNodeLit
                                    ? 'text-gold-400'
                                    : 'text-muted'
                            }`}
                    />
                </div>
            </div>

            {/* Conector limpio del nodo a la tarjeta (Desktop md+) */}
            <div
                className={`hidden md:block absolute left-1/2 top-[38px] h-px w-[18px] z-10 transition-colors duration-300 ${isInFocus || isNodeLit ? 'bg-gold-300/65' : 'bg-border-gold/45'
                    }`}
                style={{
                    transform: isLeft
                        ? `translateX(${-(CURVE_AMPLITUDE + 32)}px)`
                        : `translateX(${CURVE_AMPLITUDE + 14}px)`,
                }}
                aria-hidden="true"
            />

            {/* Espaciador opuesto para mantener alternancia limpia sobre la curva (Desktop md+) */}
            <div
                className={`hidden md:block ${isLeft ? 'md:order-2' : 'md:order-1'}`}
                aria-hidden="true"
            />

            {/* Tarjeta Orbital 3D con texto 100% nítido en foco y hover */}
            <div
                className={`${isLeft ? 'md:order-1 md:pr-[60px]' : 'md:order-2 md:pl-[60px]'}`}
                style={!isFlatCrisp ? { transformStyle: 'preserve-3d' } : undefined}
            >
                <div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transformOrigin: isLeft ? 'calc(100% + 44px) 38px' : '-44px 38px',
                        transform: isFlatCrisp
                            ? undefined
                            : `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
                        opacity,
                    }}
                    className={`relative overflow-hidden p-6 sm:p-7 rounded-xl border bg-surface/88 flex flex-col gap-4 transition-[border-color,box-shadow,transform,opacity] duration-300 ease-out ${isInFocus || hoverGlow.active
                            ? 'border-gold-300/60 shadow-[0_22px_44px_-18px_rgba(0,0,0,0.34),0_0_26px_var(--glow-gold)]'
                            : 'border-border/65 shadow-[0_12px_26px_-16px_rgba(0,0,0,0.24)]'
                        }`}
                >
                    {/* Reflejo Especular Dorado en Hover */}
                    <div
                        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                        style={{
                            opacity: hoverGlow.active ? 1 : 0,
                            background: `radial-gradient(340px circle at ${hoverGlow.x}% ${hoverGlow.y}%, var(--glow-gold-strong), transparent 65%)`,
                        }}
                        aria-hidden="true"
                    />

                    {/* Bisel Superior Iluminado */}
                    <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent"
                        aria-hidden="true"
                    />

                    {/* Cabecera */}
                    <div className="relative flex flex-col gap-2 border-b border-border/35 pb-4">
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gold-400/85">
                            {typeLabel}
                        </span>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-mono text-foreground font-semibold leading-snug">
                                {item.title}
                            </h3>
                            {item.companyUrl && (
                                <a
                                    href={item.companyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors"
                                >
                                    <span>{item.companyUrl.replace(/^https?:\/\//, '')}</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        {/* Subtítulo y periodo integrados dentro de la tarjeta (sin duplicar texto) */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
                            <span className={isPrimary ? 'text-gold-400 font-semibold' : 'text-foreground/75'}>
                                {item.subtitle}
                            </span>
                            {item.period &&
                                !item.subtitle.toLowerCase().includes(item.period.toLowerCase()) && (
                                    <>
                                        <span className="text-border-gold">•</span>
                                        <span className="text-muted">{item.period}</span>
                                    </>
                                )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <p className="relative text-xs sm:text-sm text-foreground/85 font-light leading-relaxed">
                        {item.description}
                    </p>

                    {/* Responsabilidades / Hitos */}
                    {item.highlights && item.highlights.length > 0 && (
                        <div className="relative space-y-2.5">
                            {highlightsLabel && (
                                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400/90 block">
                                    {highlightsLabel}
                                </span>
                            )}
                            <ul className="space-y-2">
                                {item.highlights.map((highlight, hIdx) => (
                                    <li
                                        key={hIdx}
                                        className="flex items-start gap-2.5 text-xs sm:text-sm text-muted font-light leading-relaxed"
                                    >
                                        <span className="text-gold-400/75 font-mono text-[10px] mt-1 shrink-0">
                                            0{hIdx + 1}
                                        </span>
                                        <span>{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Stack Tecnológico */}
                    {item.technologies && item.technologies.length > 0 && (
                        <div className="relative pt-3 border-t border-border/35 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-foreground/75">
                            {stackUsedLabel && (
                                <span className="text-[10px] uppercase tracking-wider text-muted mr-1">
                                    {stackUsedLabel}:
                                </span>
                            )}
                            {item.technologies.map((tech, tIdx) => (
                                <React.Fragment key={tIdx}>
                                    {tIdx > 0 && <span className="text-gold-400/50 select-none">•</span>}
                                    <span>{tech}</span>
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

interface ExperienceTimelineSectionProps {
    items: PortfolioExperienceItem[];
    workBadgeLabel: string;
    eduBadgeLabel: string;
    highlightsLabel?: string;
    stackUsedLabel?: string;
}

export function ExperienceTimelineSection({
    items,
    workBadgeLabel,
    eduBadgeLabel,
    highlightsLabel,
    stackUsedLabel,
}: ExperienceTimelineSectionProps) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLElement | null)[]>([]);

    itemRefs.current.length = items.length;

    const { scrollProgress, itemDeltas, nodeYs, trackHeight, isDesktop, reducedMotion } =
        useHelicalTimeline(trackRef, itemRefs, items.length);

    if (items.length === 0) return null;

    return (
        <div ref={trackRef} className="relative flex flex-col gap-12 md:gap-20 py-4">
            {/* Riel compacto exclusivo para móvil (< md) */}
            <div
                className="md:hidden absolute left-[10px] top-6 bottom-6 w-[2px] rounded-full bg-border-gold/35 pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="md:hidden absolute left-[10px] top-6 bottom-6 w-[2px] rounded-full origin-top bg-gradient-to-b from-gold-400 via-gold-300 to-gold-100 pointer-events-none"
                style={{ transform: `scaleY(${scrollProgress})` }}
                aria-hidden="true"
            />

            {/* Curva S orgánica limpia de nodo a nodo (Desktop md+) */}
            <OrganicCurveSpine
                nodeYs={nodeYs}
                trackHeight={trackHeight}
                progress={scrollProgress}
                reducedMotion={reducedMotion}
            />

            {items.map((item, idx) => {
                const threshold = items.length > 1 ? idx / (items.length - 1) : 0;
                const isReached = scrollProgress >= threshold - 0.05;

                return (
                    <HelicalCard
                        key={item.id}
                        item={item}
                        index={idx}
                        delta={itemDeltas[idx] ?? 0}
                        isReached={isReached}
                        isDesktop={isDesktop}
                        reducedMotion={reducedMotion}
                        workBadgeLabel={workBadgeLabel}
                        eduBadgeLabel={eduBadgeLabel}
                        highlightsLabel={item.type === 'work' ? highlightsLabel : undefined}
                        stackUsedLabel={stackUsedLabel}
                        registerRef={(el) => {
                            itemRefs.current[idx] = el;
                        }}
                    />
                );
            })}
        </div>
    );
}
