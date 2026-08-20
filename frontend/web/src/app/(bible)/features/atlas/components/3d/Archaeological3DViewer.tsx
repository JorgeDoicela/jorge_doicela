'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { use3DOrbitControls } from '../../hooks/use3DOrbitControls';
import { AncientStructureId } from '../../types';

export const Archaeological3DViewer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const {
    structures,
    selectedStructureId,
    activeStructure,
    activeHotspot,
    selectedHotspotId,
    setSelectedHotspotId,
    yaw,
    pitch,
    zoom,
    isCrossSection,
    setIsCrossSection,
    isOrbiting,
    handleSelectStructure,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleResetCamera,
    handleSetPresetView,
  } = use3DOrbitControls();

  // Proyección 3D matemática simple a 2D para renderizado en SVG
  const project3D = (x: number, y: number, z: number) => {
    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    // Rotación Yaw (alrededor del eje Y)
    const x1 = x * Math.cos(radYaw) + z * Math.sin(radYaw);
    const y1 = y;
    const z1 = -x * Math.sin(radYaw) + z * Math.cos(radYaw);

    // Rotación Pitch (alrededor del eje X)
    const x2 = x1;
    const y2 = y1 * Math.cos(radPitch) - z1 * Math.sin(radPitch);
    const z2 = y1 * Math.sin(radPitch) + z1 * Math.cos(radPitch);

    // Proyección en perspectiva y escala
    const centerX = 500;
    const centerY = 320;
    const scale = 220 * zoom;

    return {
      x: centerX + x2 * scale,
      y: centerY - y2 * scale,
      depth: z2,
    };
  };

  const floorGlowCenter = isDark ? '#1e293b' : '#e2e8f0';
  const floorGlowOuter = isDark ? '#070b14' : '#ffffff';
  const gridLineColor = isDark ? '#334155' : '#cbd5e1';

  if (!activeStructure) {
    return (
      <div className="p-12 text-center rounded-2xl border border-accents-2 bg-accents-1/30 space-y-2">
        <div className="text-sm font-semibold text-foreground">Visualizador 3D Arqueológico</div>
        <p className="text-xs text-accents-4 max-w-md mx-auto">
          Modelos arquitectónicos tridimensionales del Tabernáculo en el Desierto, el Templo de Salomón y el Templo de Herodes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selector de Estructuras Arqueológicas 3D */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {structures.map((struct) => {
          const isSelected = struct.id === selectedStructureId;
          return (
            <button
              key={struct.id}
              type="button"
              onClick={() => handleSelectStructure(struct.id as AncientStructureId)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-foreground bg-accents-1 shadow-xs'
                  : 'border-accents-2 bg-background/50 hover:bg-accents-1 hover:border-accents-3 text-accents-5'
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-accents-4 block mb-0.5">
                {struct.historicalPeriod.split('(')[0]}
              </span>
              <h4 className="text-xs font-bold text-foreground truncate">{struct.title.split('(')[0]}</h4>
            </button>
          );
        })}
      </div>

      {/* Grid: Visor 3D Interactivo + Panel de Ficha Técnica */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visor 3D Interactivo Canvas SVG Adaptable */}
        <div
          className={`lg:col-span-8 relative h-[520px] rounded-xl border border-accents-2 overflow-hidden select-none shadow-2xl transition-colors duration-200 ${
            isDark ? 'bg-[#070b14]' : 'bg-[#ffffff]'
          } ${isOrbiting ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg viewBox="0 0 1000 640" className="w-full h-full">
            <defs>
              <radialGradient id="floorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={floorGlowCenter} stopOpacity="0.8" />
                <stop offset="100%" stopColor={floorGlowOuter} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
              <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Plataforma base / Suelo */}
            <ellipse cx="500" cy="460" rx="360" ry="120" fill="url(#floorGlow)" />

            {/* Cuadrícula isométrica de referencia arquitectónica */}
            <g stroke={gridLineColor} strokeWidth="0.6" strokeDasharray="3,3" opacity="0.7">
              {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((val, i) => {
                const p1 = project3D(val, 0, -1.5);
                const p2 = project3D(val, 0, 1.5);
                return <line key={`gx-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
              })}
              {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((val, i) => {
                const p1 = project3D(-1.5, 0, val);
                const p2 = project3D(1.5, 0, val);
                return <line key={`gz-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
              })}
            </g>

            {/* Renderizado 3D de la Estructura Seleccionada */}
            {selectedStructureId === 'tabernacle' && (
              <g>
                {/* Atrio exterior (Cortinas de lino) */}
                {(() => {
                  const c1 = project3D(-0.9, 0, 1.5);
                  const c2 = project3D(0.9, 0, 1.5);
                  const c3 = project3D(0.9, 0, -1.5);
                  const c4 = project3D(-0.9, 0, -1.5);

                  const h1 = project3D(-0.9, 0.25, 1.5);
                  const h2 = project3D(0.9, 0.25, 1.5);
                  const h3 = project3D(0.9, 0.25, -1.5);
                  const h4 = project3D(-0.9, 0.25, -1.5);

                  return (
                    <g>
                      {/* Valla perimetral de lino */}
                      <polygon
                        points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`}
                        fill="#1e293b"
                        fillOpacity="0.4"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                      />
                      {/* Cortinas transparentadas */}
                      <polygon
                        points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${h2.x},${h2.y} ${h1.x},${h1.y}`}
                        fill="#f8fafc"
                        fillOpacity="0.15"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                      <polygon
                        points={`${c2.x},${c2.y} ${c3.x},${c3.y} ${h3.x},${h3.y} ${h2.x},${h2.y}`}
                        fill="#f8fafc"
                        fillOpacity="0.15"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })()}

                {/* Altar de Bronce */}
                {(() => {
                  const b1 = project3D(-0.15, 0, 0.85);
                  const b2 = project3D(0.15, 0, 0.85);
                  const b3 = project3D(0.15, 0, 0.55);
                  const b4 = project3D(-0.15, 0, 0.55);

                  const t1 = project3D(-0.15, 0.2, 0.85);
                  const t2 = project3D(0.15, 0.2, 0.85);
                  const t3 = project3D(0.15, 0.2, 0.55);
                  const t4 = project3D(-0.15, 0.2, 0.55);

                  return (
                    <g>
                      <polygon
                        points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${t2.x},${t2.y} ${t1.x},${t1.y}`}
                        fill="url(#bronzeGradient)"
                        stroke="#451a03"
                      />
                      <polygon
                        points={`${b2.x},${b2.y} ${b3.x},${b3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                        fill="#7c2d12"
                        stroke="#451a03"
                      />
                      <polygon
                        points={`${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                        fill="#b45309"
                        stroke="#451a03"
                      />
                    </g>
                  );
                })()}

                {/* Lavacro de Bronce */}
                {(() => {
                  const p = project3D(0, 0.12, 0.3);
                  return (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="12"
                      fill="#38bdf8"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />
                  );
                })()}

                {/* Tienda del Tabernáculo (Lugar Santo y Santísimo) */}
                {(() => {
                  const s1 = project3D(-0.4, 0, 0.0);
                  const s2 = project3D(0.4, 0, 0.0);
                  const s3 = project3D(0.4, 0, -1.0);
                  const s4 = project3D(-0.4, 0, -1.0);

                  const st1 = project3D(-0.4, 0.45, 0.0);
                  const st2 = project3D(0.4, 0.45, 0.0);
                  const st3 = project3D(0.4, 0.45, -1.0);
                  const st4 = project3D(-0.4, 0.45, -1.0);

                  return (
                    <g>
                      {/* Paredes laterales de oro */}
                      <polygon
                        points={`${s1.x},${s1.y} ${s2.x},${s2.y} ${st2.x},${st2.y} ${st1.x},${st1.y}`}
                        fill={isCrossSection ? 'none' : 'url(#goldGradient)'}
                        fillOpacity={isCrossSection ? 0 : 0.8}
                        stroke="#d97706"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${s2.x},${s2.y} ${s3.x},${s3.y} ${st3.x},${st3.y} ${st2.x},${st2.y}`}
                        fill="url(#goldGradient)"
                        fillOpacity={isCrossSection ? 0.3 : 0.9}
                        stroke="#d97706"
                        strokeWidth="1.5"
                      />
                      <polygon
                        points={`${st1.x},${st1.y} ${st2.x},${st2.y} ${st3.x},${st3.y} ${st4.x},${st4.y}`}
                        fill={isCrossSection ? 'none' : '#7f1d1d'}
                        fillOpacity={isCrossSection ? 0 : 0.7}
                        stroke="#991b1b"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Renderizado para Templo de Salomón */}
            {selectedStructureId === 'solomon_temple' && (
              <g>
                {/* Gran Santuario de Salomón */}
                {(() => {
                  const b1 = project3D(-0.4, 0, 0.6);
                  const b2 = project3D(0.4, 0, 0.6);
                  const b3 = project3D(0.4, 0, -0.9);
                  const b4 = project3D(-0.4, 0, -0.9);

                  const t1 = project3D(-0.4, 0.6, 0.6);
                  const t2 = project3D(0.4, 0.6, 0.6);
                  const t3 = project3D(0.4, 0.6, -0.9);
                  const t4 = project3D(-0.4, 0.6, -0.9);

                  return (
                    <g>
                      <polygon
                        points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${t2.x},${t2.y} ${t1.x},${t1.y}`}
                        fill={isCrossSection ? 'none' : 'url(#stoneGradient)'}
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${b2.x},${b2.y} ${b3.x},${b3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                        fill="url(#stoneGradient)"
                        fillOpacity={isCrossSection ? 0.3 : 0.9}
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                        fill="url(#goldGradient)"
                        stroke="#d97706"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })()}

                {/* Columnas Jaquín y Boaz */}
                {(() => {
                  const j = project3D(-0.25, 0.25, 0.75);
                  const b = project3D(0.25, 0.25, 0.75);
                  return (
                    <g>
                      <line
                        x1={j.x}
                        y1={j.y + 35}
                        x2={j.x}
                        y2={j.y - 35}
                        stroke="url(#bronzeGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <line
                        x1={b.x}
                        y1={b.y + 35}
                        x2={b.x}
                        y2={b.y - 35}
                        stroke="url(#bronzeGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Renderizado para Templo de Herodes */}
            {selectedStructureId === 'herod_temple' && (
              <g>
                {/* Gran Explanada Herodiana */}
                {(() => {
                  const p1 = project3D(-1.2, 0, 1.3);
                  const p2 = project3D(1.2, 0, 1.3);
                  const p3 = project3D(1.2, 0, -1.3);
                  const p4 = project3D(-1.2, 0, -1.3);

                  return (
                    <polygon
                      points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
                      fill="#334155"
                      fillOpacity="0.6"
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                  );
                })()}

                {/* Templo Monumental Blanco y Oro */}
                {(() => {
                  const t1 = project3D(-0.4, 0.7, -0.3);
                  const t2 = project3D(0.4, 0.7, -0.3);
                  const t3 = project3D(0.4, 0.7, -0.8);
                  const t4 = project3D(-0.4, 0.7, -0.8);

                  const b1 = project3D(-0.4, 0, -0.3);
                  const b2 = project3D(0.4, 0, -0.3);
                  const b3 = project3D(0.4, 0, -0.8);

                  return (
                    <g>
                      <polygon
                        points={`${b1.x},${b1.y} ${b2.x},${b2.y} ${t2.x},${t2.y} ${t1.x},${t1.y}`}
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${b2.x},${b2.y} ${b3.x},${b3.y} ${t3.x},${t3.y} ${t2.x},${t2.y}`}
                        fill="#cbd5e1"
                        stroke="#94a3b8"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y} ${t4.x},${t4.y}`}
                        fill="url(#goldGradient)"
                        stroke="#d97706"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })()}
              </g>
            )}

            {/* Renderizado para Jerusalén Siglo I */}
            {selectedStructureId === 'jerusalem_1st_century' && (
              <g>
                {/* Colinas y murallas esquemáticas */}
                {(() => {
                  const w1 = project3D(-1.0, 0.3, 0.8);
                  const w2 = project3D(0.8, 0.3, 0.8);
                  const w3 = project3D(0.8, 0.3, -1.0);
                  const w4 = project3D(-1.0, 0.3, -1.0);

                  return (
                    <polygon
                      points={`${w1.x},${w1.y} ${w2.x},${w2.y} ${w3.x},${w3.y} ${w4.x},${w4.y}`}
                      fill="#1e293b"
                      fillOpacity="0.5"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4,3"
                    />
                  );
                })()}
              </g>
            )}

            {/* Hotspots Interactivos Proyectados en 3D */}
            {activeStructure.hotspots.map((hotspot) => {
              const [hx, hy, hz] = hotspot.position3D;
              const pt = project3D(hx, hy, hz);
              const isSelected = hotspot.id === selectedHotspotId;

              return (
                <g
                  key={hotspot.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspotId(hotspot.id);
                  }}
                >
                  {isSelected && (
                    <circle
                      r="18"
                      fill="#38bdf8"
                      fillOpacity="0.3"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      className="animate-ping"
                    />
                  )}

                  <circle
                    r={isSelected ? '9' : '7'}
                    fill={isSelected ? '#38bdf8' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-transform duration-150"
                  />

                  {/* Etiqueta flotante */}
                  <text
                    x="12"
                    y="4"
                    fontSize={isSelected ? '11' : '9.5'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fill={isSelected ? '#38bdf8' : '#f1f5f9'}
                    className="select-none font-sans drop-shadow-lg"
                  >
                    {hotspot.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Barra de Controles de Cámara 3D */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-md border border-accents-2 text-xs">
            {/* Vistas Predefinidas */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleSetPresetView('isometric')}
                className="px-2 py-1 rounded bg-accents-1 hover:bg-accents-2 text-accents-5 hover:text-foreground font-mono text-[11px] cursor-pointer"
              >
                Isométrica
              </button>
              <button
                type="button"
                onClick={() => handleSetPresetView('top')}
                className="px-2 py-1 rounded bg-accents-1 hover:bg-accents-2 text-accents-5 hover:text-foreground font-mono text-[11px] cursor-pointer"
              >
                Cenital
              </button>
              <button
                type="button"
                onClick={() => handleSetPresetView('front')}
                className="px-2 py-1 rounded bg-accents-1 hover:bg-accents-2 text-accents-5 hover:text-foreground font-mono text-[11px] cursor-pointer"
              >
                Frontal
              </button>
            </div>

            {/* Alternar Corte Transversal */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCrossSection(!isCrossSection)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  isCrossSection
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-accents-1 text-accents-5 hover:text-foreground'
                }`}
              >
                Corte Transversal
              </button>

              {/* Controles de Zoom y Reset */}
              <div className="flex items-center gap-1 bg-accents-1 border border-accents-2 p-0.5 rounded-md">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="w-6 h-6 flex items-center justify-center text-accents-5 hover:text-foreground cursor-pointer font-bold"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="w-6 h-6 flex items-center justify-center text-accents-5 hover:text-foreground cursor-pointer font-bold"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleResetCamera}
                  className="px-1.5 h-6 flex items-center justify-center text-[10px] font-mono text-accents-4 hover:text-foreground cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral: Ficha Arqueológica y Detalle de Hotspot */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Ficha General de la Estructura */}
          <div className="p-4 rounded-xl border border-accents-2 bg-background space-y-3 shadow-xs">
            <div className="border-b border-accents-2 pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-semibold block">
                {activeStructure.approximateDate}
              </span>
              <h3 className="text-base font-bold text-foreground leading-tight">
                {activeStructure.title}
              </h3>
              <p className="text-xs text-accents-4 font-serif">{activeStructure.originalName}</p>
            </div>

            <p className="text-xs text-foreground/90 leading-relaxed">
              {activeStructure.description}
            </p>

            <div className="p-2.5 rounded-lg bg-accents-1/60 border border-accents-2 text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase text-accents-4 block">
                Dimensiones y Escala Bíblica:
              </span>
              <p className="text-foreground font-mono text-[11px]">
                {activeStructure.dimensionsOverview}
              </p>
            </div>

            <div className="text-xs space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-accents-4 block">
                Significado Tipológico:
              </span>
              <p className="text-accents-5 italic text-[11px]">"{activeStructure.keySignificance}"</p>
            </div>
          </div>

          {/* Ficha del Hotspot Seleccionado */}
          {activeHotspot ? (
            <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-400">{activeHotspot.label}</h4>
                {activeHotspot.originalName && (
                  <span className="text-[10px] font-mono text-amber-400 font-serif">
                    {activeHotspot.originalName}
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/90 leading-snug">{activeHotspot.description}</p>
              {activeHotspot.dimensionsCubits && (
                <div className="text-[11px] font-mono text-accents-4">
                  Medidas: <span className="text-foreground">{activeHotspot.dimensionsCubits}</span>
                </div>
              )}
              {activeHotspot.materials && (
                <div className="text-[11px] font-mono text-accents-4">
                  Materiales:{' '}
                  <span className="text-foreground">{activeHotspot.materials.join(', ')}</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-accents-2">
                <span className="text-[10px] font-mono text-accents-4 block mb-0.5">
                  Pasajes Bíblicos:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeHotspot.scriptureReferences.map((ref, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-background border border-accents-2 text-[10px] font-mono text-blue-400"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-accents-2 text-center text-xs text-accents-4">
              Haz clic en cualquier punto de interés del modelo 3D para examinar su descripción
              arquitectónica y base bíblica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
