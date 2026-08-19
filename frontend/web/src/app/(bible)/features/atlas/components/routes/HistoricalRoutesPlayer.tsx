'use client';

import React from 'react';
import { useRoutePlayer } from '../../hooks/useRoutePlayer';
import { projectGeoToCanvas } from '../../hooks/useAtlasMap';

export const HistoricalRoutesPlayer: React.FC = () => {
  const {
    allRoutes,
    selectedRouteId,
    activeRoute,
    currentStopIndex,
    currentStop,
    isPlaying,
    playbackSpeedMs,
    setPlaybackSpeedMs,
    handleSelectRoute,
    handleNextStop,
    handlePrevStop,
    handleSelectStopIndex,
    handleTogglePlay,
  } = useRoutePlayer();

  // Generación de puntos SVG para el trazado de la ruta
  const routePoints = activeRoute.stops.map((stop) => {
    return projectGeoToCanvas(stop.coordinates.lat, stop.coordinates.lng);
  });

  const pathD = routePoints.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
  }, '');

  return (
    <div className="space-y-4">
      {/* Selector de Ruta Histórica */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-accents-2 bg-background/60">
        {allRoutes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => handleSelectRoute(route.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-foreground text-background font-semibold shadow-sm'
                  : 'text-accents-5 hover:text-foreground bg-accents-1/50 hover:bg-accents-1'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: route.color }}
              />
              <span>{route.title}</span>
            </button>
          );
        })}
      </div>

      {/* Grid: Canvas de la Ruta + Panel de Parada Activa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Canvas de Trazado de Ruta */}
        <div className="lg:col-span-8 relative h-[480px] bg-[#14120e] rounded-xl border border-accents-2 overflow-hidden shadow-inner flex flex-col justify-between">
          <svg viewBox="0 0 1000 650" className="w-full h-full">
            <defs>
              <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeRoute.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={activeRoute.color} stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Mar y fondo cartográfico tenue */}
            <rect width="1000" height="650" fill="#1e2633" />

            {/* Tierra firme */}
            <g fill="#2d2820" stroke="#3d372e" strokeWidth="0.8" opacity="0.85">
              <path d="M 30,50 Q 80,110 120,200 L 140,230 L 100,260 L 70,210 Z" />
              <path d="M 280,60 L 370,80 L 390,140 L 340,190 L 350,230 L 310,240 L 290,180 Z" />
              <path d="M 330,300 L 410,295 L 420,310 L 340,315 Z" />
              <path d="M 420,70 L 680,60 L 740,120 L 730,220 L 640,240 L 460,220 L 420,160 Z" />
              <path d="M 640,270 L 710,260 L 715,280 L 650,290 Z" />
              <path d="M 730,170 L 820,180 L 890,260 L 980,300 L 980,650 L 520,650 L 520,440 L 600,430 L 680,480 L 710,480 L 735,390 L 725,270 Z" />
            </g>

            {/* Trazado completo de la ruta con línea discontinua */}
            <path
              d={pathD}
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeDasharray="4,4"
              opacity="0.45"
            />

            {/* Trazado activo recorrido hasta el paso actual */}
            {currentStopIndex > 0 && (
              <path
                d={routePoints.slice(0, currentStopIndex + 1).reduce((acc, point, index) => {
                  return index === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
                }, '')}
                fill="none"
                stroke={activeRoute.color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />
            )}

            {/* Marcadores de Paradas */}
            {activeRoute.stops.map((stop, idx) => {
              const pt = projectGeoToCanvas(stop.coordinates.lat, stop.coordinates.lng);
              const isActive = idx === currentStopIndex;
              const isPast = idx <= currentStopIndex;

              return (
                <g
                  key={stop.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer"
                  onClick={() => handleSelectStopIndex(idx)}
                >
                  {/* Halo activo pulsante */}
                  {isActive && (
                    <circle
                      r="16"
                      fill={activeRoute.color}
                      fillOpacity="0.3"
                      stroke={activeRoute.color}
                      strokeWidth="1.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Círculo de la parada */}
                  <circle
                    r={isActive ? '9' : '6.5'}
                    fill={isActive ? activeRoute.color : isPast ? '#334155' : '#1e293b'}
                    stroke={isActive ? '#ffffff' : activeRoute.color}
                    strokeWidth={isActive ? '2' : '1.2'}
                    className="transition-all duration-200"
                  />

                  {/* Número de parada */}
                  <text
                    x="0"
                    y="3.5"
                    fontSize={isActive ? '9' : '7.5'}
                    fontWeight="bold"
                    fill="#ffffff"
                    textAnchor="middle"
                    className="select-none font-mono"
                  >
                    {stop.stepNumber}
                  </text>

                  {/* Etiqueta de nombre */}
                  {(isActive || idx === 0 || idx === activeRoute.stops.length - 1) && (
                    <text
                      x="0"
                      y={isActive ? '-13' : '16'}
                      fontSize={isActive ? '11' : '9'}
                      fontWeight={isActive ? 'bold' : 'normal'}
                      fill={isActive ? '#ffffff' : '#94a3b8'}
                      textAnchor="middle"
                      className="select-none font-sans drop-shadow-md"
                    >
                      {stop.placeName}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Barra de Controles Multimedia Inferior */}
          <div className="p-3 bg-background/90 backdrop-blur-md border-t border-accents-2 flex flex-wrap items-center justify-between gap-3 z-10">
            {/* Controles Play / Prev / Next */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevStop}
                className="w-8 h-8 rounded-lg border border-accents-2 bg-accents-1 hover:bg-accents-2 text-foreground flex items-center justify-center transition-colors cursor-pointer"
                title="Estación anterior"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleTogglePlay}
                className={`px-4 h-8 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isPlaying
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'bg-foreground text-background font-semibold'
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Reproducir Itinerario</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextStop}
                className="w-8 h-8 rounded-lg border border-accents-2 bg-accents-1 hover:bg-accents-2 text-foreground flex items-center justify-center transition-colors cursor-pointer"
                title="Siguiente estación"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* Progreso de Paradas */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-accents-4">
                Estación <strong className="text-foreground">{currentStopIndex + 1}</strong> de{' '}
                {activeRoute.stops.length}
              </span>

              {/* Selector de Velocidad */}
              <div className="flex items-center gap-1 bg-accents-1 border border-accents-2 p-0.5 rounded-md text-[10px] font-mono">
                {[
                  { label: '1x', ms: 4500 },
                  { label: '2x', ms: 2500 },
                  { label: '3x', ms: 1200 },
                ].map((speed) => (
                  <button
                    key={speed.label}
                    type="button"
                    onClick={() => setPlaybackSpeedMs(speed.ms)}
                    className={`px-1.5 py-0.5 rounded ${
                      playbackSpeedMs === speed.ms
                        ? 'bg-background text-foreground font-bold shadow-xs'
                        : 'text-accents-4 hover:text-foreground'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral de Detalle de la Estación y Lista de Paradas */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Ficha de la Parada Activa */}
          <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-accents-2 pb-2">
              <span
                className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded font-semibold text-white"
                style={{ backgroundColor: activeRoute.color }}
              >
                Estación {currentStop.stepNumber}
              </span>
              {currentStop.durationOrYear && (
                <span className="text-[10px] font-mono text-accents-4">
                  {currentStop.durationOrYear}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground">{currentStop.placeName}</h3>
              <p className="text-xs text-foreground/90 mt-1 leading-relaxed">
                {currentStop.eventDescription}
              </p>
            </div>

            {/* Referencia Bíblica */}
            <div className="p-2.5 rounded-lg bg-accents-1/70 border border-accents-2 space-y-1">
              <span className="text-[10px] font-mono uppercase text-accents-4 block">
                Cita de la Sagrada Escritura:
              </span>
              <span className="text-xs font-semibold text-blue-500 font-mono block">
                {currentStop.biblicalReference}
              </span>
            </div>

            {/* Importancia Teológica / Histórica */}
            <div className="text-xs space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-accents-4 block">
                Trascendencia:
              </span>
              <p className="text-accents-5 italic text-[11px]">"{currentStop.significance}"</p>
            </div>
          </div>

          {/* Lista de Estaciones Cronológicas */}
          <div className="p-3 rounded-xl border border-accents-2 bg-background/50 flex-1 max-h-[180px] overflow-y-auto space-y-1">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-accents-4 mb-2">
              Itinerario Cronológico Completo ({activeRoute.totalDistanceKm} km aprox.)
            </h4>
            {activeRoute.stops.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStopIndex(idx)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between cursor-pointer ${
                  idx === currentStopIndex
                    ? 'bg-accents-2 text-foreground font-semibold'
                    : 'text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] font-mono text-accents-4 w-4">
                    {s.stepNumber}.
                  </span>
                  <span className="truncate">{s.placeName}</span>
                </div>
                <span className="text-[10px] font-mono text-blue-500 shrink-0 ml-2">
                  {s.biblicalReference.split(';')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
