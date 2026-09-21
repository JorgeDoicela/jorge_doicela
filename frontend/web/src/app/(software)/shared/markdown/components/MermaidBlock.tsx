'use client';

import React, { useEffect, useState, useId, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import {
  AlertCircle,
  Loader2,
  Workflow,
  ListOrdered,
  Layers,
  Activity,
  GitBranch,
  PieChart,
  Network,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';

interface MermaidBlockProps {
  chart: string;
}

export type DiagramCategory =
  | 'sequence'
  | 'flowchart'
  | 'class'
  | 'er'
  | 'state'
  | 'git'
  | 'architecture'
  | 'c4'
  | 'mindmap'
  | 'pie'
  | 'generic';

/**
 * Detecta robustamente el tipo de diagrama ignorando comentarios (%%) y frontmatter YAML (---)
 */
function detectDiagramType(chart: string): DiagramCategory {
  if (!chart) return 'generic';

  // Eliminar directivas YAML frontmatter si existen
  const withoutFrontmatter = chart.replace(/^---[\s\S]*?---\s*/, '');

  // Filtrar líneas vacías y comentarios de Mermaid
  const lines = withoutFrontmatter
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('%%'));

  const firstLine = lines[0] || '';
  const token = firstLine.toLowerCase().split(/[\s;{]/)[0];

  if (token === 'sequencediagram') return 'sequence';
  if (token === 'flowchart' || token === 'graph') return 'flowchart';
  if (token === 'classdiagram') return 'class';
  if (token === 'erdiagram') return 'er';
  if (token.startsWith('statediagram')) return 'state';
  if (token === 'gitgraph') return 'git';
  if (token.startsWith('architecture')) return 'architecture';
  if (token.startsWith('c4')) return 'c4';
  if (token === 'mindmap') return 'mindmap';
  if (token === 'pie') return 'pie';

  return 'generic';
}

/**
 * Extrae las dimensiones intrínsecas (width y height) del atributo viewBox o width/height del SVG generado por Mermaid
 */
function extractSvgDimensions(svgString: string): { width: number; height: number } | null {
  if (!svgString) return null;

  const viewBoxMatch = svgString.match(
    /viewBox=["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i
  );
  if (viewBoxMatch && viewBoxMatch[3] && viewBoxMatch[4]) {
    const width = parseFloat(viewBoxMatch[3]);
    const height = parseFloat(viewBoxMatch[4]);
    if (!Number.isNaN(width) && !Number.isNaN(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }

  const widthMatch = svgString.match(/width=["']\s*([0-9.-]+)(?:px)?\s*["']/i);
  const heightMatch = svgString.match(/height=["']\s*([0-9.-]+)(?:px)?\s*["']/i);
  if (widthMatch && heightMatch && widthMatch[1] && heightMatch[1]) {
    const width = parseFloat(widthMatch[1]);
    const height = parseFloat(heightMatch[1]);
    if (!Number.isNaN(width) && !Number.isNaN(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }

  return null;
}

/**
 * Selecciona el icono semántico ideal según la familia de diagrama
 */
function getDiagramIcon(category: DiagramCategory): React.ComponentType<{ className?: string }> {
  switch (category) {
    case 'sequence':
      return ListOrdered;
    case 'git':
      return GitBranch;
    case 'class':
    case 'er':
    case 'c4':
      return Layers;
    case 'state':
      return Activity;
    case 'pie':
      return PieChart;
    case 'mindmap':
      return Network;
    case 'flowchart':
    case 'architecture':
    default:
      return Workflow;
  }
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const t = useTranslations('Markdown');
  const { resolvedTheme } = useTheme();
  const rawId = useId();
  const cleanId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [mounted, setMounted] = useState<boolean>(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const startClickPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; dist?: number }>({ x: 0, y: 0 });

  const diagramCategory = useMemo(() => detectDiagramType(chart), [chart]);
  const DiagramIcon = useMemo(() => getDiagramIcon(diagramCategory), [diagramCategory]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(5, Number((prev * 1.25).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.3, Number((prev * 0.8).toFixed(2))));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const openModal = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsExpanded(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsExpanded(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      if (!chart.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = resolvedTheme === 'dark';

        // Configuración universal calibrada para Mermaid 12 (Commit aa831c0204b697c5ca00c78a984f7c1a3345cd20)
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          look: 'neo',
          theme: isDark ? 'redux-dark-color' : 'redux-color',
          fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, sans-serif',
          fontSize: 13,
          themeVariables: {
            fontFamily: 'var(--font-sans), Inter, system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            actorFontSize: '14px',
            messageFontSize: '13px',
            noteFontSize: '12px',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            useMaxWidth: true,
            padding: 12,
            nodeSpacing: 40,
            rankSpacing: 40,
          },
          sequence: {
            showSequenceNumbers: true,
            actorFontSize: 14,
            actorFontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
            actorFontWeight: 600,
            noteFontSize: 12,
            noteFontFamily: 'var(--font-mono), monospace',
            noteFontWeight: 500,
            messageFontSize: 13,
            messageFontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
            messageFontWeight: 500,
            mirrorActors: true,
            actorMargin: 45,
            messageMargin: 35,
            width: 140,
            height: 48,
            rightAngles: false,
            useMaxWidth: true,
          },
          class: {
            useMaxWidth: true,
            htmlLabels: true,
          },
          state: {
            useMaxWidth: true,
          },
          er: {
            useMaxWidth: true,
          },
          gantt: {
            useMaxWidth: true,
          },
        });

        // Generar SVG con ID único garantizado por ejecución
        const renderId = `${cleanId}-${Math.random().toString(36).substring(2, 7)}`;
        const { svg } = await mermaid.render(renderId, chart.trim());

        if (isMounted) {
          const dims = extractSvgDimensions(svg);
          setDimensions(dims);
          setSvgContent(svg);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : t('diagramError');
          setError(message);
          setLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, resolvedTheme, cleanId, t]);

  // Zoom interactivo con la rueda del ratón y aislamiento total del scroll del fondo
  useEffect(() => {
    if (!isExpanded) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const factor = e.deltaY < 0 ? 1.15 : 0.87;
      setScale((prev) => {
        const next = prev * factor;
        return Math.min(5, Math.max(0.3, Number(next.toFixed(2))));
      });
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [isExpanded]);

  // Manejo de teclado (Escape, +, -, 0) y bloqueo absoluto del scroll del documento
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleReset();
      }
    };

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, closeModal, handleZoomIn, handleZoomOut, handleReset]);

  // Manejadores de arrastre con ratón (Pan)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    startClickPosRef.current = { x: e.clientX, y: e.clientY };
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dist = Math.hypot(
      e.clientX - startClickPosRef.current.x,
      e.clientY - startClickPosRef.current.y
    );
    if (dist > 5) {
      hasMovedRef.current = true;
    }
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manejadores táctiles para smartphones y tablets (Touch Pan & Pinch Zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      hasMovedRef.current = false;
      startClickPosRef.current = { x: touch.clientX, y: touch.clientY };
      touchStartRef.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      };
    } else if (e.touches.length === 2) {
      hasMovedRef.current = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartRef.current.dist = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dist = Math.hypot(
        touch.clientX - startClickPosRef.current.x,
        touch.clientY - startClickPosRef.current.y
      );
      if (dist > 8) {
        hasMovedRef.current = true;
      }
      setPosition({
        x: touch.clientX - touchStartRef.current.x,
        y: touch.clientY - touchStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchStartRef.current.dist) {
      hasMovedRef.current = true;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / touchStartRef.current.dist;
      touchStartRef.current.dist = dist;
      setScale((prev) => Math.min(5, Math.max(0.3, Number((prev * factor).toFixed(2)))));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = undefined;
  };

  // Cierre limpio al hacer clic afuera del diagrama (en el fondo)
  const handleBackdropClick = () => {
    if (hasMovedRef.current) return;
    closeModal();
  };

  // Título localizado del tipo específico de diagrama
  const diagramTitle = useMemo(() => {
    try {
      const typeKey = `diagramTypes.${diagramCategory}` as Parameters<typeof t>[0];
      return t(typeKey);
    } catch {
      return t('diagram');
    }
  }, [diagramCategory, t]);

  // En la vista del artículo:
  // Se respeta el ancho natural del diagrama (tope 1020px en desktop) y max-width 100%.
  // En móvil se adapta de forma fluida para verse COMPLETO de inicio a fin sin cortes laterales.
  const naturalWidth = dimensions?.width || 680;
  const targetInlineWidth = Math.min(Math.round(naturalWidth), 1020);

  return (
    <>
      <div className="my-6 rounded-2xl bg-white dark:bg-[#12161f] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden transition-all duration-300">
        {/* Cabecera Técnica Minimalista: Solo Iconos de Acción */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/[0.06] dark:border-white/[0.06] select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <DiagramIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-semibold text-slate-800 dark:text-zinc-200 truncate">
              {diagramTitle}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Botón Expandir (Solo Icono) */}
            <button
              onClick={openModal}
              className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 shrink-0"
              title={t('clickToExpand')}
              aria-label={t('expand')}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenedor del Diagrama: Ajuste Proporcional Fluido en el Artículo */}
        <div className="p-3 sm:p-5 md:p-6 overflow-hidden flex justify-center items-center">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400 dark:text-zinc-500 text-xs font-mono animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500/60" />
              <span>{t('generatingDiagram')}</span>
            </div>
          )}

          {error && (
            <div className="space-y-3 py-2 w-full max-w-xl mx-auto">
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t('diagramError')}</span>
              </div>
              <pre
                tabIndex={0}
                suppressHydrationWarning
                className="p-3 rounded-xl bg-black/40 text-zinc-300 text-xs font-mono overflow-x-auto"
              >
                <code>{chart}</code>
              </pre>
            </div>
          )}

          {!loading && !error && svgContent && (
            <div
              className="w-full flex justify-center items-center cursor-zoom-in group"
              onClick={openModal}
              title={t('clickToExpand')}
            >
              <div
                className="transition-all duration-300 mx-auto flex justify-center items-center [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-full [&_svg]:block [&_svg]:mx-auto group-hover:opacity-95"
                style={{
                  width: `${targetInlineWidth}px`,
                  maxWidth: '100%',
                }}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Visor Inmersivo a Pantalla Completa con Pan & Zoom Interactivo */}
      {mounted &&
        isExpanded &&
        svgContent &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={diagramTitle}
            className="fixed inset-0 z-[999999] backdrop-blur-2xl bg-slate-100/85 dark:bg-black/85 overflow-hidden select-none animate-in fade-in duration-200"
          >
            {/* Barra Superior Unificada en la Esquina Superior Derecha */}
            <div className="fixed top-3 right-3 sm:top-5 sm:right-5 z-20 pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl">
              {/* Título e Icono del Diagrama */}
              <div className="flex items-center gap-2 px-2.5 py-1 text-slate-800 dark:text-zinc-200">
                <DiagramIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm font-sans font-semibold truncate max-w-[130px] sm:max-w-[240px]">
                  {diagramTitle}
                </span>
              </div>

              <span className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />

              {/* Controles de Zoom */}
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none"
                  title={t('zoomOut')}
                  aria-label={t('zoomOut')}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2 sm:px-2.5 py-1 text-xs font-mono font-bold text-slate-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  title={t('resetZoom')}
                >
                  {Math.round(scale * 100)}%
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none"
                  title={t('zoomIn')}
                  aria-label={t('zoomIn')}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <span className="w-px h-4 bg-black/10 dark:bg-white/10 mx-0.5" />

              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                aria-label={t('close')}
                title={t('close')}
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>

            {/* Canvas de Interacción (Pan & Zoom con Mouse / Touch) */}
            <div
              ref={viewportRef}
              onClick={handleBackdropClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleReset}
              className={`w-full h-full flex items-center justify-center overflow-hidden ${
                isDragging ? 'cursor-grabbing' : 'cursor-default'
              }`}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: `${Math.max(dimensions?.width || 800, 720)}px`,
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 120ms cubic-bezier(0, 0, 0.2, 1)',
                }}
                className={`inline-block p-6 sm:p-10 md:p-12 rounded-3xl bg-white dark:bg-[#12161f] shadow-2xl border border-black/10 dark:border-white/10 select-none pointer-events-auto ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                } [&_*]:cursor-inherit [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-none [&_svg]:block`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
