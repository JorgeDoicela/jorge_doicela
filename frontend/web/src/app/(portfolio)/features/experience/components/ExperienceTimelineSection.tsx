'use client';

import React, { useEffect, useId, useMemo, useRef } from 'react';
import { ArrowUpRight, Briefcase, GraduationCap } from 'lucide-react';
import {
  useHelicalTimeline,
  type TimelineDomBindings,
} from '../hooks/useHelicalTimeline';
import type { PortfolioExperienceItem } from '../types';

const CURVE_SVG_WIDTH = 120;
const CURVE_CENTER_X = CURVE_SVG_WIDTH / 2; // 60
const CURVE_AMPLITUDE = 28;

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
  reducedMotion: boolean;
  activePathRef: React.RefObject<SVGPathElement | null>;
  headGroupRef: React.RefObject<SVGGElement | null>;
  totalPathLengthRef: React.RefObject<number>;
}

function OrganicCurveSpine({
  nodeYs,
  trackHeight,
  reducedMotion,
  activePathRef,
  headGroupRef,
  totalPathLengthRef,
}: OrganicCurveSpineProps) {
  const gradientId = useId();
  const pathD = useMemo(() => buildOrganicCurvePath(nodeYs), [nodeYs]);

  useEffect(() => {
    const pathEl = activePathRef.current;
    if (!pathEl || !pathD) {
      totalPathLengthRef.current = 0;
      return;
    }
    totalPathLengthRef.current = pathEl.getTotalLength();
  }, [pathD, activePathRef, totalPathLengthRef]);

  if (!pathD || trackHeight <= 0) return null;

  return (
    <svg
      width={CURVE_SVG_WIDTH}
      height={trackHeight}
      viewBox={`0 0 ${CURVE_SVG_WIDTH} ${trackHeight}`}
      className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-0 overflow-visible"
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

      {/* Curva dorada activa (actualizada directo en DOM por rAF) */}
      <path
        ref={activePathRef}
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.25"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={reducedMotion ? 0 : 1}
      />

      {/* Punta luminosa recorriendo la curva (posicionada directo en DOM por rAF) */}
      <g ref={headGroupRef} style={{ opacity: 0 }}>
        <circle cx={0} cy={0} r="6.5" fill="var(--glow-gold-strong)" />
        <circle cx={0} cy={0} r="3" fill="var(--gold-300)" />
      </g>
    </svg>
  );
}

interface HelicalCardProps {
  item: PortfolioExperienceItem;
  index: number;
  isDesktop: boolean;
  reducedMotion: boolean;
  workBadgeLabel: string;
  eduBadgeLabel: string;
  highlightsLabel?: string;
  stackUsedLabel?: string;
  registerArticleRef: (el: HTMLElement | null) => void;
  registerCardRef: (el: HTMLDivElement | null) => void;
  registerNodeRef: (el: HTMLDivElement | null) => void;
  registerConnectorRef: (el: HTMLDivElement | null) => void;
  onHoverChange: (index: number | null) => void;
}

function HelicalCard({
  item,
  index,
  isDesktop,
  reducedMotion,
  workBadgeLabel,
  eduBadgeLabel,
  highlightsLabel,
  stackUsedLabel,
  registerArticleRef,
  registerCardRef,
  registerNodeRef,
  registerConnectorRef,
  onHoverChange,
}: HelicalCardProps) {
  const isLeft = index % 2 === 0;
  const isPrimary = index === 0;
  const isEducation = item.type === 'education';
  const typeLabel = isEducation ? eduBadgeLabel : workBadgeLabel;
  const NodeIcon = isEducation ? GraduationCap : Briefcase;

  const registerCardRefTarget = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    onHoverChange(index);
    const cardEl = registerCardRefTarget.current;
    if (cardEl) {
      cardEl.style.transform = '';
      cardEl.style.opacity = '1';
      cardEl.dataset.active = 'true';
    }
  };

  const handleMouseLeave = () => {
    onHoverChange(null);
  };

  return (
    <article
      ref={registerArticleRef}
      className="group relative z-10 grid grid-cols-1 md:grid-cols-2 items-start gap-4 md:gap-0 pl-9 md:pl-0"
      style={isDesktop && !reducedMotion ? { perspective: '980px' } : undefined}
    >
      {/* Nodo Móvil (< md) */}
      <div
        className="md:hidden absolute left-[11px] -translate-x-1/2 top-6 z-20 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="w-6 h-6 rounded-full border border-gold-300/80 bg-background flex items-center justify-center shadow-[0_0_10px_var(--glow-gold)]">
          <NodeIcon className="w-3 h-3 text-gold-300" />
        </div>
      </div>

      {/* Nodo Desktop sobre el vértice exacto de la curva S */}
      <div
        ref={registerNodeRef}
        data-lit={isPrimary ? 'true' : 'false'}
        className="hidden md:flex absolute left-1/2 top-[24px] z-20 items-center justify-center group/node"
        style={{
          transform: `translateX(calc(-50% + ${isLeft ? -CURVE_AMPLITUDE : CURVE_AMPLITUDE}px))`,
        }}
        aria-hidden="true"
      >
        <div className="w-7 h-7 rounded-full border bg-background flex items-center justify-center transition-all duration-300 border-border-gold scale-100 [[data-lit='true']_&]:border-gold-300 [[data-lit='true']_&]:shadow-[0_4px_14px_rgba(0,0,0,0.22),0_0_16px_var(--glow-gold-strong)] [[data-lit='true']_&]:scale-105">
          <NodeIcon className="w-3.5 h-3.5 transition-colors duration-300 text-muted [[data-lit='true']_&]:text-gold-300" />
        </div>
      </div>

      {/* Conector limpio del nodo a la tarjeta (Desktop md+) */}
      <div
        ref={registerConnectorRef}
        data-lit={isPrimary ? 'true' : 'false'}
        className="hidden md:block absolute left-1/2 top-[38px] h-px w-[18px] z-10 transition-colors duration-300 bg-border-gold/45 data-[lit=true]:bg-gold-300/65"
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

      {/* Tarjeta Orbital 3D (transform y opacity manejados directo por rAF sin transition-transform) */}
      <div
        className={`${isLeft ? 'md:order-1 md:pr-[60px]' : 'md:order-2 md:pl-[60px]'}`}
      >
        <div
          ref={(el) => {
            registerCardRefTarget.current = el;
            registerCardRef(el);
          }}
          data-active={isPrimary ? 'true' : 'false'}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transformOrigin: isLeft ? 'right 38px' : 'left 38px',
          }}
          className="relative overflow-hidden p-6 sm:p-7 rounded-xl border border-border/65 bg-surface/90 shadow-[0_12px_26px_-16px_rgba(0,0,0,0.22)] data-[active=true]:border-gold-300/60 data-[active=true]:shadow-[0_22px_44px_-18px_rgba(0,0,0,0.34),0_0_26px_var(--glow-gold)] flex flex-col gap-4 transition-[border-color,box-shadow] duration-200"
        >
          {/* Bisel Superior Iluminado */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent"
            aria-hidden="true"
          />

          {/* Cabecera */}
          <div className="relative flex flex-col gap-1.5">
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
            <div className="relative pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-foreground/75">
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
  const activePathRef = useRef<SVGPathElement | null>(null);
  const headGroupRef = useRef<SVGGElement | null>(null);
  const mobileRailRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoveredIndexRef = useRef<number | null>(null);
  const totalPathLengthRef = useRef<number>(0);
  const requestSyncRef = useRef<(() => void) | null>(null);

  itemRefs.current.length = items.length;
  cardRefs.current.length = items.length;
  nodeWrapRefs.current.length = items.length;
  connectorRefs.current.length = items.length;

  const bindings = useMemo<TimelineDomBindings>(
    () => ({
      activePathRef,
      headGroupRef,
      mobileRailRef,
      cardRefs,
      nodeWrapRefs,
      connectorRefs,
      hoveredIndexRef,
      totalPathLengthRef,
      requestSyncRef,
    }),
    []
  );

  const { nodeYs, trackHeight, isDesktop, reducedMotion } = useHelicalTimeline(
    trackRef,
    itemRefs,
    items.length,
    bindings
  );

  if (items.length === 0) return null;

  return (
    <div ref={trackRef} className="relative flex flex-col gap-12 md:gap-20 py-4">
      {/* Riel compacto exclusivo para móvil (< md) */}
      <div
        className="md:hidden absolute left-[10px] top-6 bottom-6 w-[2px] rounded-full bg-border-gold/35 pointer-events-none"
        aria-hidden="true"
      />
      <div
        ref={mobileRailRef}
        className="md:hidden absolute left-[10px] top-6 bottom-6 w-[2px] rounded-full origin-top bg-gradient-to-b from-gold-400 via-gold-300 to-gold-100 pointer-events-none"
        style={{ transform: 'scaleY(0)' }}
        aria-hidden="true"
      />

      {/* Curva S orgánica limpia de nodo a nodo (Desktop md+) */}
      <OrganicCurveSpine
        nodeYs={nodeYs}
        trackHeight={trackHeight}
        reducedMotion={reducedMotion}
        activePathRef={activePathRef}
        headGroupRef={headGroupRef}
        totalPathLengthRef={totalPathLengthRef}
      />

      {items.map((item, idx) => (
        <HelicalCard
          key={item.id}
          item={item}
          index={idx}
          isDesktop={isDesktop}
          reducedMotion={reducedMotion}
          workBadgeLabel={workBadgeLabel}
          eduBadgeLabel={eduBadgeLabel}
          highlightsLabel={item.type === 'work' ? highlightsLabel : undefined}
          stackUsedLabel={stackUsedLabel}
          registerArticleRef={(el) => {
            itemRefs.current[idx] = el;
          }}
          registerCardRef={(el) => {
            cardRefs.current[idx] = el;
          }}
          registerNodeRef={(el) => {
            nodeWrapRefs.current[idx] = el;
          }}
          registerConnectorRef={(el) => {
            connectorRefs.current[idx] = el;
          }}
          onHoverChange={(hoveredIdx) => {
            hoveredIndexRef.current = hoveredIdx;
            requestSyncRef.current?.();
          }}
        />
      ))}
    </div>
  );
}
