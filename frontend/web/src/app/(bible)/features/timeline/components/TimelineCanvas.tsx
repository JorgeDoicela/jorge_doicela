'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MONARCHS_DATA } from '../data/kingsJudahIsrael';
import { BIBLICAL_PROPHETS } from '../data/biblicalProphets';
import { WORLD_EMPIRES } from '../data/worldEmpires';
import { ARCHAEOLOGICAL_MILESTONES } from '../data/archaeologicalMilestones';
import { TimelineSelectedItem } from '../types';

interface TimelineCanvasProps {
  centerYearBC: number;
  zoomLevel: number;
  cursorYearBC: number | null;
  onSetHoverYearBC: (year: number | null) => void;
  onPinYearBC: (year: number) => void;
  onSelectItem: (item: TimelineSelectedItem) => void;
  visibleTracks: {
    judah: boolean;
    israel: boolean;
    prophets: boolean;
    empires: boolean;
    milestones: boolean;
  };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onZoomDelta?: (delta: number) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  className?: string;
}

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  centerYearBC,
  zoomLevel,
  cursorYearBC,
  onSetHoverYearBC,
  onPinYearBC,
  onSelectItem,
  visibleTracks,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomDelta,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  className,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);

  // Listener no-pasivo nativo para prevenir el scroll de la página al usar la rueda del ratón
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onZoomDelta) return;

    const handleWheelNonPassive = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      onZoomDelta(delta);
    };

    el.addEventListener('wheel', handleWheelNonPassive, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelNonPassive);
    };
  }, [onZoomDelta]);

  // Ancho virtual de la vista y altura ampliada para sub-carriles sin solapamiento
  const canvasWidth = 1000;
  const canvasHeight = 500;
  const centerX = canvasWidth / 2;

  // Conversión de Año (a.C.) a Coordenada X
  // En a.C., años mayores están a la izquierda (pasado) y menores a la derecha (futuro)
  const yearToX = (yearBC: number) => {
    const pixelsPerYear = 1.8 * zoomLevel;
    const diffYears = centerYearBC - yearBC;
    return centerX + diffYears * pixelsPerYear;
  };

  // Conversión de Coordenada X a Año (a.C.)
  const xToYear = (x: number) => {
    const pixelsPerYear = 1.8 * zoomLevel;
    const diffPixels = x - centerX;
    return Math.round(centerYearBC - diffPixels / pixelsPerYear);
  };

  // Marcas de regla temporal reactivas al nivel de zoom
  const stepYears =
    zoomLevel > 4.0 ? 5 : zoomLevel > 2.2 ? 10 : zoomLevel > 1.4 ? 25 : zoomLevel > 0.8 ? 50 : 100;
  const startRulerYear = Math.ceil((centerYearBC + 600) / stepYears) * stepYears;
  const endRulerYear = Math.floor((centerYearBC - 600) / stepYears) * stepYears;

  const rulerMarks: number[] = [];
  for (let y = startRulerYear; y >= endRulerYear; y -= stepYears) {
    rulerMarks.push(y);
  }

  // Colores SVG adaptados
  const guideLineColor = isDark ? '#1e293b' : '#e2e8f0';
  const rulerLineColor = isDark ? '#334155' : '#cbd5e1';
  const rulerTextColor = isDark ? '#94a3b8' : '#475569';

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className || 'h-[500px]'} rounded-xl border border-accents-2 overflow-hidden select-none shadow-inner transition-colors duration-200 touch-none ${
        isDark ? 'bg-[#070b14]' : 'bg-[#ffffff]'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const svgX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
        const year = xToYear(svgX);
        if (year >= -100 && year <= 2000) {
          onPinYearBC(year);
        }
      }}
      onMouseMove={(e) => {
        onMouseMove(e);
        if (!isDragging && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const svgX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
          const year = xToYear(svgX);
          if (year >= -100 && year <= 2000) {
            onSetHoverYearBC(year);
          }
        }
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={() => {
        onMouseUp();
        onSetHoverYearBC(null);
      }}
    >
      <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="w-full h-full">
        <defs>
          <linearGradient id="judahGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="israelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="prophetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="empireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Fondo con líneas de guía verticales adaptables */}
        {rulerMarks.map((year) => {
          const x = yearToX(year);
          return (
            <g key={`mark-${year}`} opacity="0.85">
              <line
                x1={x}
                y1="35"
                x2={x}
                y2={canvasHeight}
                stroke={guideLineColor}
                strokeWidth="0.8"
                strokeDasharray="3,3"
              />
              <text
                x={x}
                y="22"
                fontSize="9.5"
                fill={rulerTextColor}
                textAnchor="middle"
                fontFamily="monospace"
                fontWeight="600"
              >
                {year > 0 ? `${year} a.C.` : `${Math.abs(year)} d.C.`}
              </text>
            </g>
          );
        })}

        {/* Regla temporal superior fija */}
        <line
          x1="0"
          y1="30"
          x2={canvasWidth}
          y2="30"
          stroke={rulerLineColor}
          strokeWidth="1.5"
        />

        {/* Pista 1: Reyes de Judá & Monarquía Unida */}
        {visibleTracks.judah && (
          <g transform="translate(0, 38)">
            <circle cx="16" cy="11" r="3.5" fill="#3b82f6" />
            <text
              x="26"
              y="14"
              fontSize="9"
              fontWeight="bold"
              fill={isDark ? '#f1f5f9' : '#0f172a'}
              fontFamily="monospace"
              className="select-none"
            >
              JUDÁ (SUR) & MONARQUÍA UNIDA
            </text>
            {MONARCHS_DATA.filter((m) => m.kingdom === 'judah' || m.kingdom === 'united').map((m, idx) => {
              const x1 = yearToX(m.startYearBC);
              const x2 = yearToX(m.endYearBC);
              const width = Math.max(x2 - x1, 16);
              // Escalonado suave si hay monarcas muy cercanos
              const yOffset = 18 + (idx % 2) * 18;

              return (
                <g
                  key={m.id}
                  transform={`translate(${x1}, ${yOffset})`}
                  className="cursor-pointer transition-opacity duration-100 hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'monarch', data: m });
                  }}
                >
                  <rect
                    width={width}
                    height="18"
                    rx="3.5"
                    fill={m.kingdom === 'united' ? '#2563eb' : 'url(#judahGrad)'}
                    stroke={m.evaluation === 'good' ? '#4ade80' : '#f87171'}
                    strokeWidth="1"
                    fillOpacity="0.9"
                  />
                  {width > 20 && (
                    <text
                      x={width / 2}
                      y="12"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                      className="select-none font-sans"
                    >
                      {m.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Pista 2: Reyes de Israel (10 Tribus del Norte) */}
        {visibleTracks.israel && (
          <g transform="translate(0, 102)">
            <circle cx="16" cy="11" r="3.5" fill="#ef4444" />
            <text
              x="26"
              y="14"
              fontSize="9"
              fontWeight="bold"
              fill={isDark ? '#f1f5f9' : '#0f172a'}
              fontFamily="monospace"
              className="select-none"
            >
              ISRAEL (NORTE - 10 TRIBUS)
            </text>
            {MONARCHS_DATA.filter((m) => m.kingdom === 'israel').map((m, idx) => {
              const x1 = yearToX(m.startYearBC);
              const x2 = yearToX(m.endYearBC);
              const width = Math.max(x2 - x1, 16);
              const yOffset = 18 + (idx % 2) * 18;

              return (
                <g
                  key={m.id}
                  transform={`translate(${x1}, ${yOffset})`}
                  className="cursor-pointer transition-opacity duration-100 hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'monarch', data: m });
                  }}
                >
                  <rect
                    width={width}
                    height="18"
                    rx="3.5"
                    fill="url(#israelGrad)"
                    stroke="#fca5a5"
                    strokeWidth="1"
                    fillOpacity="0.9"
                  />
                  {width > 20 && (
                    <text
                      x={width / 2}
                      y="12"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                      className="select-none font-sans"
                    >
                      {m.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Pista 3: Profetas Bíblicos (3 Sub-carriles Escalados) */}
        {visibleTracks.prophets && (
          <g transform="translate(0, 168)">
            <circle cx="16" cy="11" r="3.5" fill="#10b981" />
            <text
              x="26"
              y="14"
              fontSize="9"
              fontWeight="bold"
              fill={isDark ? '#f1f5f9' : '#0f172a'}
              fontFamily="monospace"
              className="select-none"
            >
              PROFETAS BÍBLICOS
            </text>
            {BIBLICAL_PROPHETS.map((p, idx) => {
              const x1 = yearToX(p.startYearBC);
              const x2 = yearToX(p.endYearBC);
              const width = Math.max(x2 - x1, 18);
              // Distribución en 3 sub-carriles para que profetas contemporáneos no choquen
              const yOffset = 18 + (idx % 3) * 20;

              return (
                <g
                  key={p.id}
                  transform={`translate(${x1}, ${yOffset})`}
                  className="cursor-pointer transition-opacity duration-100 hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'prophet', data: p });
                  }}
                >
                  <rect
                    width={width}
                    height="18"
                    rx="3.5"
                    fill="url(#prophetGrad)"
                    stroke="#6ee7b7"
                    strokeWidth="1"
                    fillOpacity="0.9"
                  />
                  {width > 20 && (
                    <text
                      x={width / 2}
                      y="12"
                      fontSize="8.5"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                      className="select-none font-sans"
                    >
                      {p.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Pista 4: Imperios Mundiales (2 Sub-carriles) */}
        {visibleTracks.empires && (
          <g transform="translate(0, 258)">
            <circle cx="16" cy="11" r="3.5" fill="#a855f7" />
            <text
              x="26"
              y="14"
              fontSize="9"
              fontWeight="bold"
              fill={isDark ? '#f1f5f9' : '#0f172a'}
              fontFamily="monospace"
              className="select-none"
            >
              IMPERIOS MUNDIALES (EGIPTO, ASIRIA, BABILONIA, PERSIA, ROMA)
            </text>
            {WORLD_EMPIRES.map((emp, idx) => {
              const x1 = yearToX(emp.startYearBC);
              const x2 = yearToX(emp.endYearBC);
              const width = Math.max(x2 - x1, 20);
              const yOffset = 18 + (idx % 2) * 20;

              return (
                <g
                  key={emp.id}
                  transform={`translate(${x1}, ${yOffset})`}
                  className="cursor-pointer transition-opacity duration-100 hover:opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'empire', data: emp });
                  }}
                >
                  <rect
                    width={width}
                    height="18"
                    rx="3.5"
                    fill="url(#empireGrad)"
                    stroke="#d8b4fe"
                    strokeWidth="1"
                    fillOpacity="0.9"
                  />
                  {width > 22 && (
                    <text
                      x={width / 2}
                      y="12"
                      fontSize="8.5"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                      className="select-none font-sans"
                    >
                      {emp.rulerName.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Pista 5: Hitos Arqueológicos Escalonados con Pines */}
        {visibleTracks.milestones && (
          <g transform="translate(0, 332)">
            <circle cx="16" cy="11" r="3.5" fill="#f59e0b" />
            <text
              x="26"
              y="14"
              fontSize="9"
              fontWeight="bold"
              fill={isDark ? '#f1f5f9' : '#0f172a'}
              fontFamily="monospace"
              className="select-none"
            >
              HITOS & EVIDENCIAS ARQUEOLÓGICAS FECHADAS
            </text>
            {ARCHAEOLOGICAL_MILESTONES.map((m, idx) => {
              const x = yearToX(m.yearBC);
              // 3 niveles de altura escalonada para que los títulos nunca colisionen
              const labelY = 22 + (idx % 3) * 20;

              return (
                <g
                  key={m.id}
                  transform={`translate(${x}, 0)`}
                  className="cursor-pointer transition-opacity duration-100 hover:opacity-75"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'milestone', data: m });
                  }}
                >
                  {/* Línea guía vertical hacia la etiqueta */}
                  <line
                    x1="0"
                    y1="18"
                    x2="0"
                    y2={labelY}
                    stroke="#f59e0b"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                    opacity="0.6"
                  />
                  {/* Pin indicador */}
                  <circle
                    cx="0"
                    cy={labelY}
                    r="4.5"
                    fill="#f59e0b"
                    stroke={isDark ? '#070b14' : '#ffffff'}
                    strokeWidth="1.2"
                  />
                  {/* Texto de alto contraste con halo */}
                  <text
                    x="8"
                    y={labelY + 3.5}
                    fontSize="8.5"
                    fontWeight="600"
                    fill={isDark ? '#f1f5f9' : '#0f172a'}
                    stroke={isDark ? '#070b14' : '#ffffff'}
                    strokeWidth={isDark ? '0.4' : '0.8'}
                    paintOrder="stroke fill"
                    className="select-none font-sans"
                  >
                    {m.title.split('(')[0]}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Cursor Vertical Sincronizado */}
        {cursorYearBC !== null && (
          <g transform={`translate(${yearToX(cursorYearBC)}, 0)`} className="pointer-events-none">
            <line x1="0" y1="20" x2="0" y2={canvasHeight} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,2" />
            <polygon points="-6,28 6,28 0,36" fill="#f43f5e" />
            <rect x="-35" y="0" width="70" height="18" rx="3" fill="#f43f5e" />
            <text x="0" y="12" fontSize="9.5" fontWeight="bold" fill="#ffffff" textAnchor="middle" fontFamily="monospace">
              {cursorYearBC > 0 ? `${cursorYearBC} a.C.` : `${Math.abs(cursorYearBC)} d.C.`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
