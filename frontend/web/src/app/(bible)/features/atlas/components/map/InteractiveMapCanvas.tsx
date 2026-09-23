'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { AncientPlace, MapLayerType } from '../../types';
import { projectGeoToCanvas } from '../../hooks/useAtlasMap';

interface InteractiveMapCanvasProps {
  places: AncientPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: AncientPlace) => void;
  activeLayer: MapLayerType;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onZoomDelta?: (delta: number) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
}

export const InteractiveMapCanvas: React.FC<InteractiveMapCanvasProps> = ({
  places,
  selectedPlaceId,
  onSelectPlace,
  activeLayer,
  zoomLevel,
  panOffset,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomDelta,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPlace, setHoveredPlace] = useState<AncientPlace | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Listener no-pasivo nativo para prevenir el scroll de la página al usar la rueda del ratón en el mapa
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

  // Colores dinámicos para elementos interactivos SVG sobre la cartografía
  const gridColor = isDark ? '#334155' : '#cbd5e1';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const textMutedColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[540px] rounded-xl overflow-hidden border border-accents-2 shadow-inner select-none transition-colors duration-200 touch-none bg-background ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseMove={(e) => {
        onMouseMove(e);
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <svg
        viewBox="0 0 1000 650"
        className="w-full h-full transform transition-transform duration-75"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Patrón de cuadrícula de coordenadas náuticas sutil */}
          <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke={gridColor}
              strokeWidth="0.6"
              strokeDasharray="2,4"
              opacity={isDark ? '0.35' : '0.45'}
            />
          </pattern>
        </defs>

        {/* Capa Cartográfica Realista de Alta Definición */}
        <image
          href={
            activeLayer === 'satellite'
              ? '/bible/images/atlas/map_satellite.jpg'
              : activeLayer === 'historical'
              ? '/bible/images/atlas/map_parchment.jpg'
              : isDark
              ? '/bible/images/atlas/map_satellite.jpg'
              : '/bible/images/atlas/map_parchment.jpg'
          }
          x="0"
          y="0"
          width="1000"
          height="650"
          preserveAspectRatio="none"
        />

        {/* Cuadrícula de coordenadas náuticas sutil */}
        <rect width="1000" height="650" fill="url(#gridPattern)" />

        {/* Regiones y Etiquetas Geográficas Bíblicas en Modo Oscuro / Satélite */}
        {(activeLayer === 'satellite' || isDark) && (
          <g fill={textMutedColor} opacity={0.7} fontSize="10" fontWeight="600" fontFamily="monospace" textAnchor="middle">
            <text x="280" y="360" transform="rotate(-15, 280, 360)">
              MARE INTERNUM (MEDITERRÁNEO)
            </text>
            <text x="540" y="180">ASIA MENOR</text>
            <text x="210" y="180">MACEDONIA & AQUEA</text>
            <text x="630" y="260">SIRIA</text>
            <text x="488" y="340">GALILEA</text>
            <text x="484" y="365">SAMARIA</text>
            <text x="480" y="405">JUDEA</text>
            <text x="458" y="555">PENÍNSULA DEL SINAÍ</text>
            <text x="360" y="520">EGIPTO (GOSÉN)</text>
            <text x="640" y="440">ARABIA / MOAB</text>
          </g>
        )}

        {/* Rosa de los Vientos Náutica Bíblica (visible en modo satélite / oscuro) */}
        {(activeLayer === 'satellite' || isDark) && (
          <g transform="translate(80, 560)" opacity={0.85}>
            <circle r="32" fill="none" stroke={textColor} strokeWidth="0.8" strokeDasharray="2,3" />
            <path d="M 0,-30 L 5,-8 L 0,0 L -5,-8 Z" fill="#ef4444" />
            <path d="M 0,30 L 5,8 L 0,0 L -5,8 Z" fill={textColor} />
            <path d="M -30,0 L -8,5 L 0,0 L -8,-5 Z" fill={textColor} />
            <path d="M 30,0 L 8,5 L 0,0 L 8,-5 Z" fill={textColor} />
            <text x="0" y="-34" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#ef4444">
              N
            </text>
            <text x="0" y="42" fontSize="8" fontWeight="bold" textAnchor="middle" fill={textColor}>
              S
            </text>
            <text x="38" y="3" fontSize="8" fontWeight="bold" textAnchor="middle" fill={textColor}>
              E
            </text>
            <text x="-38" y="3" fontSize="8" fontWeight="bold" textAnchor="middle" fill={textColor}>
              O
            </text>
          </g>
        )}

        {/* Renderizado de Lugares Bíblicos */}
        {places.map((place) => {
          const { x, y } = projectGeoToCanvas(place.coordinates.lat, place.coordinates.lng);
          const isSelected = place.id === selectedPlaceId;
          const isHovered = hoveredPlace?.id === place.id;

          const markerColor =
            place.category === 'city'
              ? '#2563eb' // Azul vibrante
              : place.category === 'mountain'
              ? '#d97706' // Ámbar intenso
              : place.category === 'water'
              ? '#0284c7' // Cian agua
              : '#059669'; // Verde esmeralda

          // Obtener nombre corto limpio para evitar saturar el lienzo
          const getCleanShortName = (rawName: string, id: string) => {
            if (id === 'jerusalem') return 'Jerusalén';
            if (id === 'sea_of_galilee') return 'Galilea';
            if (id === 'dead_sea') return 'Mar Muerto';
            if (id === 'jordan_river') return 'Río Jordán';
            if (id === 'mount_nebo') return 'Mte. Nebo';
            if (id === 'mount_sinai') return 'Mte. Sinaí';
            if (id === 'antioch_syria') return 'Antioquía';
            if (id === 'garden_of_eden') return 'Edén';
            if (id === 'babylon') return 'Babilonia';
            if (id === 'nineveh') return 'Nínive';
            return rawName.split('/')[0].trim();
          };

          const shortName = getCleanShortName(place.name, place.id);

          // Ciudades primarias que se muestran siempre en vista lejana
          const isPrimary = ['jerusalem', 'rome', 'athens', 'ephesus', 'antioch_syria', 'mount_sinai'].includes(
            place.id,
          );

          // Solo mostrar etiqueta si:
          // 1. Está seleccionado o con hover
          // 2. O el zoom es >= 1.3 (vista cercana)
          // 3. O es una ciudad primaria en vista panorámica
          const shouldShowLabel = isSelected || isHovered || zoomLevel >= 1.3 || isPrimary;

          // Desplazamiento inteligente para evitar que se pisen puntos vecinos
          let labelOffsetX = 7;
          let labelOffsetY = 3.5;
          let textAnchor: 'start' | 'end' | 'middle' = 'start';

          if (place.id === 'jerusalem') {
            labelOffsetX = -7;
            textAnchor = 'end';
          } else if (place.id === 'corinth') {
            labelOffsetX = -7;
            textAnchor = 'end';
          } else if (place.id === 'athens') {
            labelOffsetX = 7;
            textAnchor = 'start';
          } else if (place.id === 'sea_of_galilee') {
            labelOffsetY = -7;
            labelOffsetX = 0;
            textAnchor = 'middle';
          } else if (place.id === 'dead_sea') {
            labelOffsetY = 12;
            labelOffsetX = 0;
            textAnchor = 'middle';
          }

          return (
            <g
              key={place.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer transition-transform duration-150"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlace(place);
              }}
              onMouseEnter={() => setHoveredPlace(place)}
              onMouseLeave={() => setHoveredPlace(null)}
            >
              {/* Círculo de pulsación en lugar seleccionado */}
              {isSelected && (
                <circle
                  r="14"
                  fill={markerColor}
                  fillOpacity="0.25"
                  stroke={markerColor}
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              )}

              {/* Halo hover */}
              {isHovered && (
                <circle r="10" fill={markerColor} fillOpacity="0.3" stroke={markerColor} strokeWidth="1" />
              )}

              {/* Marcador central */}
              <circle
                r={isSelected ? '6' : isHovered ? '5' : '4'}
                fill={markerColor}
                stroke={isDark ? '#050c1a' : '#ffffff'}
                strokeWidth={isSelected ? '2' : '1.5'}
                className="transition-all"
              />

              {/* Etiqueta de texto limpia y no invasiva */}
              {shouldShowLabel && (
                <text
                  x={labelOffsetX}
                  y={labelOffsetY}
                  textAnchor={textAnchor}
                  fontSize={isSelected ? '10' : isHovered ? '9.5' : '8.5'}
                  fontWeight={isSelected || isHovered ? 'bold' : '600'}
                  fill={isSelected ? (isDark ? '#ffffff' : '#000000') : isHovered ? '#2563eb' : textColor}
                  stroke={isDark ? '#050c1a' : '#ffffff'}
                  strokeWidth={isDark ? '0.4' : '0.8'}
                  paintOrder="stroke fill"
                  className="select-none font-sans transition-opacity duration-150"
                >
                  {shortName}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip flotante interactivo */}
      {hoveredPlace && (
        <div
          className="absolute z-20 pointer-events-none p-2.5 rounded-lg bg-background/95 border border-accents-2 shadow-xl backdrop-blur-md max-w-xs space-y-1 transform -translate-x-1/2 -translate-y-full -mt-3"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-foreground">{hoveredPlace.name}</span>
            <span className="text-[10px] font-mono text-amber-500 font-serif">
              {hoveredPlace.originalName.hebrew || hoveredPlace.originalName.greek}
            </span>
          </div>
          <p className="text-[10px] text-accents-4 line-clamp-2">{hoveredPlace.description}</p>
          <div className="text-[9px] font-mono text-blue-400">
            {hoveredPlace.biblicalReferences[0]?.reference}
          </div>
        </div>
      )}

      {/* Leyenda en esquina inferior izquierda */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-accents-2 text-[10px] font-mono text-accents-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Ciudades
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Montes
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Aguas
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Yacimientos
        </span>
      </div>
    </div>
  );
};
