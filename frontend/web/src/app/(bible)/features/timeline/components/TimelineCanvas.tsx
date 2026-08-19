'use client';

import React, { useRef } from 'react';
import { MONARCHS_DATA } from '../data/kingsJudahIsrael';
import { BIBLICAL_PROPHETS } from '../data/biblicalProphets';
import { WORLD_EMPIRES } from '../data/worldEmpires';
import { ARCHAEOLOGICAL_MILESTONES } from '../data/archaeologicalMilestones';
import { TimelineSelectedItem } from '../types';

interface TimelineCanvasProps {
  centerYearBC: number;
  zoomLevel: number;
  cursorYearBC: number | null;
  onSetCursorYearBC: (year: number) => void;
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
}

export const TimelineCanvas: React.FC<TimelineCanvasProps> = ({
  centerYearBC,
  zoomLevel,
  cursorYearBC,
  onSetCursorYearBC,
  onSelectItem,
  visibleTracks,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ancho virtual de la vista
  const canvasWidth = 1000;
  const canvasHeight = 440;
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

  // Generación de marcas de la regla de tiempo (cada 50 o 100 años según zoom)
  const stepYears = zoomLevel > 1.8 ? 25 : zoomLevel > 1.0 ? 50 : 100;
  const startRulerYear = Math.ceil((centerYearBC + 500) / stepYears) * stepYears;
  const endRulerYear = Math.floor((centerYearBC - 500) / stepYears) * stepYears;

  const rulerMarks: number[] = [];
  for (let y = startRulerYear; y >= endRulerYear; y -= stepYears) {
    rulerMarks.push(y);
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[460px] bg-[#0c1017] rounded-xl border border-accents-2 overflow-hidden select-none shadow-inner ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={onMouseDown}
      onMouseMove={(e) => {
        onMouseMove(e);
        if (!isDragging && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const svgX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
          const year = xToYear(svgX);
          if (year >= -100 && year <= 2000) {
            onSetCursorYearBC(year);
          }
        }
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="w-full h-full">
        <defs>
          <linearGradient id="judahGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="israelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="prophetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="empireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Fondo con líneas de guía verticales */}
        {rulerMarks.map((year) => {
          const x = yearToX(year);
          return (
            <g key={`mark-${year}`} opacity="0.3">
              <line x1={x} y1="35" x2={x} y2={canvasHeight} stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />
              <text x={x} y="22" fontSize="9.5" fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
                {year > 0 ? `${year} a.C.` : `${Math.abs(year)} d.C.`}
              </text>
            </g>
          );
        })}

        {/* Regla temporal superior fija */}
        <line x1="0" y1="30" x2={canvasWidth} y2="30" stroke="#475569" strokeWidth="1.5" />

        {/* Pista 1: Reyes de Judá (Y: 45 a 105) */}
        {visibleTracks.judah && (
          <g transform="translate(0, 45)">
            <text x="12" y="16" fontSize="9" fontWeight="bold" fill="#60a5fa" fontFamily="monospace">
              JUDÁ (SUR) & MONARQUÍA UNIDA
            </text>
            {MONARCHS_DATA.filter((m) => m.kingdom === 'judah' || m.kingdom === 'united').map((m) => {
              const x1 = yearToX(m.startYearBC);
              const x2 = yearToX(m.endYearBC);
              const width = Math.max(x2 - x1, 14);

              return (
                <g
                  key={m.id}
                  transform={`translate(${x1}, 24)`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'monarch', data: m });
                  }}
                >
                  <rect
                    width={width}
                    height="22"
                    rx="4"
                    fill={m.kingdom === 'united' ? '#2563eb' : 'url(#judahGrad)'}
                    stroke={m.evaluation === 'good' ? '#4ade80' : '#f87171'}
                    strokeWidth="1.2"
                    fillOpacity="0.85"
                  />
                  {width > 24 && (
                    <text
                      x={width / 2}
                      y="14"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                      className="select-none font-sans truncate"
                    >
                      {m.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Pista 2: Reyes de Israel (Y: 115 a 175) */}
        {visibleTracks.israel && (
          <g transform="translate(0, 115)">
            <text x="12" y="16" fontSize="9" fontWeight="bold" fill="#f87171" fontFamily="monospace">
              ISRAEL (NORTE - 10 TRIBUS)
            </text>
            {MONARCHS_DATA.filter((m) => m.kingdom === 'israel').map((m) => {
              const x1 = yearToX(m.startYearBC);
              const x2 = yearToX(m.endYearBC);
              const width = Math.max(x2 - x1, 14);

              return (
                <g
                  key={m.id}
                  transform={`translate(${x1}, 24)`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'monarch', data: m });
                  }}
                >
                  <rect
                    width={width}
                    height="22"
                    rx="4"
                    fill="url(#israelGrad)"
                    stroke="#fca5a5"
                    strokeWidth="1"
                    fillOpacity="0.85"
                  />
                  {width > 24 && (
                    <text
                      x={width / 2}
                      y="14"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill="#ffffff"
                      textAnchor="middle"
                      className="select-none font-sans"
                    >
                      {m.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Pista 3: Profetas Bíblicos (Y: 185 a 245) */}
        {visibleTracks.prophets && (
          <g transform="translate(0, 185)">
            <text x="12" y="16" fontSize="9" fontWeight="bold" fill="#34d399" fontFamily="monospace">
              PROFETAS BÍBLICOS
            </text>
            {BIBLICAL_PROPHETS.map((p) => {
              const x1 = yearToX(p.startYearBC);
              const x2 = yearToX(p.endYearBC);
              const width = Math.max(x2 - x1, 16);

              return (
                <g
                  key={p.id}
                  transform={`translate(${x1}, 24)`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'prophet', data: p });
                  }}
                >
                  <rect
                    width={width}
                    height="20"
                    rx="4"
                    fill="url(#prophetGrad)"
                    stroke="#6ee7b7"
                    strokeWidth="1"
                    fillOpacity="0.85"
                  />
                  {width > 20 && (
                    <text
                      x={width / 2}
                      y="13"
                      fontSize="9"
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

        {/* Pista 4: Imperios Contemporáneos (Y: 255 a 315) */}
        {visibleTracks.empires && (
          <g transform="translate(0, 255)">
            <text x="12" y="16" fontSize="9" fontWeight="bold" fill="#c084fc" fontFamily="monospace">
              IMPERIOS MUNDIALES (EGIPTO, ASIRIA, BABILONIA, PERSIA, ROMA)
            </text>
            {WORLD_EMPIRES.map((emp) => {
              const x1 = yearToX(emp.startYearBC);
              const x2 = yearToX(emp.endYearBC);
              const width = Math.max(x2 - x1, 18);

              return (
                <g
                  key={emp.id}
                  transform={`translate(${x1}, 24)`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'empire', data: emp });
                  }}
                >
                  <rect
                    width={width}
                    height="22"
                    rx="4"
                    fill="url(#empireGrad)"
                    stroke="#d8b4fe"
                    strokeWidth="1"
                    fillOpacity="0.85"
                  />
                  {width > 24 && (
                    <text
                      x={width / 2}
                      y="14"
                      fontSize="9"
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

        {/* Pista 5: Hitos Arqueológicos (Y: 335 a 405) */}
        {visibleTracks.milestones && (
          <g transform="translate(0, 335)">
            <text x="12" y="16" fontSize="9" fontWeight="bold" fill="#fbbf24" fontFamily="monospace">
              HITOS & EVIDENCIAS ARQUEOLÓGICAS FECHADAS
            </text>
            {ARCHAEOLOGICAL_MILESTONES.map((m) => {
              const x = yearToX(m.yearBC);
              return (
                <g
                  key={m.id}
                  transform={`translate(${x}, 32)`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem({ type: 'milestone', data: m });
                  }}
                >
                  <circle r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                  <text
                    x="9"
                    y="3"
                    fontSize="8.5"
                    fill="#fde68a"
                    className="select-none font-sans drop-shadow-md"
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
