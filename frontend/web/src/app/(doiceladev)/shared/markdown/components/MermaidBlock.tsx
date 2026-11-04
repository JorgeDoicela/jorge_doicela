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
  RotateCcw,
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

  // viewBox="0 0 800 1200" o con comas intermedias
  const viewBoxMatch = svgString.match(
    /viewBox=["']\s*([0-9.-]+)[,\s]+([0-9.-]+)[,\s]+([0-9.-]+)[,\s]+([0-9.-]+)\s*["']/i
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
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const startClickPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<number>(scale);
  const positionRef = useRef<{ x: number; y: number }>(position);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const diagramCategory = useMemo(() => detectDiagramType(chart), [chart]);
  const DiagramIcon = useMemo(() => getDiagramIcon(diagramCategory), [diagramCategory]);

  /**
   * Cálculo determinista del "Fit to Screen" (Ajuste a pantalla completo).
   * Evalúa las dimensiones intrínsecas del diagrama contra el viewport actual,
   * asegurando que diagramas largos (verticales) o anchos (horizontales) queden
   * 100% visibles de extremo a extremo sin recortes al abrir el visor.
   */
  const calculateFitScale = useCallback(
    (dims?: { width: number; height: number } | null) => {
      if (typeof window === 'undefined') return 1;

      const w = dims?.width || dimensions?.width || 800;
      const h = dims?.height || dimensions?.height || 600;

      const vWidth = window.innerWidth;
      const vHeight = window.innerHeight;

      // Márgenes de respiración del viewport (espacio para la barra de herramientas superior en desktop/mobile)
      const marginX = vWidth < 640 ? 24 : 80;
      const marginY = vHeight < 640 ? 80 : 120;

      // Padding interno de la tarjeta (p-6 a p-10)
      const cardPaddingX = vWidth < 640 ? 48 : 80;
      const cardPaddingY = vWidth < 640 ? 48 : 80;

      const totalCardWidth = Math.max(w, 360) + cardPaddingX;
      const totalCardHeight = h + cardPaddingY;

      const availableWidth = Math.max(vWidth - marginX, 200);
      const availableHeight = Math.max(vHeight - marginY, 200);

      const scaleX = availableWidth / totalCardWidth;
      const scaleY = availableHeight / totalCardHeight;

      // Escala que garantiza que el 100% del card quepa en pantalla (ambos ejes)
      const fit = Math.min(scaleX, scaleY);

      // Si el diagrama cabe naturalmente en escala 1.0, respetamos 1.0 como escala inicial;
      // si excede la pantalla, aplicamos el factor de reducción óptimo (mínimo 0.15)
      return Math.min(1.0, Math.max(0.15, Number(fit.toFixed(2))));
    },
    [dimensions]
  );

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(5, Number((prev * 1.25).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.15, Number((prev * 0.8).toFixed(2))));
  }, []);

  const handleFitToScreen = useCallback(() => {
    const fit = calculateFitScale(dimensions);
    setScale(fit);
    setPosition({ x: 0, y: 0 });
  }, [calculateFitScale, dimensions]);

  const handleToggleFit = useCallback(() => {
    const fit = calculateFitScale(dimensions);
    // Si la escala actual está cercana al fit óptimo, expandir al 100% (1:1)
    if (Math.abs(scale - fit) < 0.05 && scale < 0.95) {
      setScale(1.0);
    } else {
      // Si está en 1.0 o en otro nivel de zoom, reajustar a pantalla completa
      setScale(fit);
      setPosition({ x: 0, y: 0 });
    }
  }, [calculateFitScale, dimensions, scale]);

  const openModal = useCallback(() => {
    const initialFit = calculateFitScale(dimensions);
    setScale(initialFit);
    setPosition({ x: 0, y: 0 });
    hasMovedRef.current = false;
    setIsExpanded(true);
  }, [calculateFitScale, dimensions]);

  const closeModal = useCallback(() => {
    setIsExpanded(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Recalcular el ajuste a pantalla si la ventana cambia de tamaño mientras el visor está abierto
  useEffect(() => {
    if (!isExpanded) return;

    const handleResize = () => {
      if (!hasMovedRef.current) {
        const fit = calculateFitScale(dimensions);
        setScale(fit);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded, calculateFitScale, dimensions]);

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

        // Configuración universal calibrada para Mermaid 12
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
        return Math.min(5, Math.max(0.15, Number(next.toFixed(2))));
      });
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [isExpanded]);

  // Manejo de teclado (Escape, +, -, 0, f, 1) y bloqueo absoluto del scroll del documento
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0' || e.key.toLowerCase() === 'f') {
        handleFitToScreen();
      } else if (e.key === '1') {
        setScale(1.0);
        setPosition({ x: 0, y: 0 });
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
  }, [isExpanded, closeModal, handleZoomIn, handleZoomOut, handleFitToScreen]);

  // Manejadores de arrastre con ratón (Pan en Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsInteracting(true);
    hasMovedRef.current = false;
    startClickPosRef.current = { x: e.clientX, y: e.clientY };
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isInteracting) return;
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
    setIsInteracting(false);
  };

  // Manejadores táctiles nativos con passive: false para smartphones y tablets
  useEffect(() => {
    if (!isExpanded) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    let touchGesture = {
      mode: 'none' as 'none' | 'pan' | 'pinch',
      startDist: 0,
      baseScale: 1,
      startMidX: 0,
      startMidY: 0,
      basePosX: 0,
      basePosY: 0,
      lastTouchX: 0,
      lastTouchY: 0,
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        hasMovedRef.current = false;
        startClickPosRef.current = { x: t.clientX, y: t.clientY };
        touchGesture = {
          mode: 'pan',
          startDist: 0,
          baseScale: scaleRef.current,
          startMidX: t.clientX,
          startMidY: t.clientY,
          basePosX: positionRef.current.x,
          basePosY: positionRef.current.y,
          lastTouchX: t.clientX,
          lastTouchY: t.clientY,
        };
        setIsInteracting(true);
      } else if (e.touches.length === 2) {
        hasMovedRef.current = true;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        touchGesture = {
          mode: 'pinch',
          startDist: Math.max(dist, 1),
          baseScale: scaleRef.current,
          startMidX: midX,
          startMidY: midY,
          basePosX: positionRef.current.x,
          basePosY: positionRef.current.y,
          lastTouchX: midX,
          lastTouchY: midY,
        };
        setIsInteracting(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }

      if (e.touches.length === 1 && touchGesture.mode === 'pan') {
        const t = e.touches[0];
        const distFromStart = Math.hypot(
          t.clientX - startClickPosRef.current.x,
          t.clientY - startClickPosRef.current.y
        );
        if (distFromStart > 5) {
          hasMovedRef.current = true;
        }
        const deltaX = t.clientX - touchGesture.lastTouchX;
        const deltaY = t.clientY - touchGesture.lastTouchY;
        touchGesture.lastTouchX = t.clientX;
        touchGesture.lastTouchY = t.clientY;
        setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      } else if (e.touches.length === 2) {
        hasMovedRef.current = true;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        if (touchGesture.mode !== 'pinch') {
          touchGesture = {
            mode: 'pinch',
            startDist: Math.max(dist, 1),
            baseScale: scaleRef.current,
            startMidX: midX,
            startMidY: midY,
            basePosX: positionRef.current.x,
            basePosY: positionRef.current.y,
            lastTouchX: midX,
            lastTouchY: midY,
          };
        } else {
          const factor = dist / touchGesture.startDist;
          const nextScale = Math.min(5, Math.max(0.15, touchGesture.baseScale * factor));
          setScale(nextScale);

          const deltaMidX = midX - touchGesture.startMidX;
          const deltaMidY = midY - touchGesture.startMidY;
          setPosition({
            x: touchGesture.basePosX + deltaMidX,
            y: touchGesture.basePosY + deltaMidY,
          });
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        touchGesture = {
          mode: 'pan',
          startDist: 0,
          baseScale: scaleRef.current,
          startMidX: t.clientX,
          startMidY: t.clientY,
          basePosX: positionRef.current.x,
          basePosY: positionRef.current.y,
          lastTouchX: t.clientX,
          lastTouchY: t.clientY,
        };
        startClickPosRef.current = { x: t.clientX, y: t.clientY };
      } else if (e.touches.length === 0) {
        touchGesture.mode = 'none';
        setIsInteracting(false);
      }
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: false });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: false });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isExpanded]);

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
  const naturalWidth = dimensions?.width || 680;
  const targetInlineWidth = Math.min(Math.round(naturalWidth), 1020);

  // En el modal inmersivo:
  // Respetamos el ancho intrínseco natural del SVG (mínimo 360px) sin forzar ensanchamientos artificiales
  // que distorsionen la altura de los diagramas verticales.
  const modalTargetWidth = dimensions?.width ? Math.max(dimensions.width, 360) : 800;

  return (
    <>
      <div className="my-6 rounded-2xl bg-white dark:bg-[#12161f] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden transition-all duration-300">
        {/* Cabecera Técnica Minimalista */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/[0.06] dark:border-white/[0.06] select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <DiagramIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs sm:text-sm font-sans font-semibold text-slate-800 dark:text-zinc-200 truncate">
              {diagramTitle}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Botón Expandir */}
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
                  onClick={handleToggleFit}
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

                <button
                  type="button"
                  onClick={handleFitToScreen}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none"
                  title={t('fitToScreen')}
                  aria-label={t('fitToScreen')}
                >
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              onDoubleClick={handleToggleFit}
              className={`w-full h-full flex items-center justify-center overflow-hidden touch-none select-none ${
                isInteracting ? 'cursor-grabbing' : 'cursor-default'
              }`}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: `${modalTargetWidth}px`,
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
                  transformOrigin: 'center center',
                  transition: isInteracting ? 'none' : 'transform 180ms cubic-bezier(0, 0, 0.2, 1)',
                }}
                className={`inline-block p-6 sm:p-10 md:p-12 rounded-3xl bg-white dark:bg-[#12161f] shadow-2xl border border-black/10 dark:border-white/10 select-none pointer-events-auto touch-none ${
                  isInteracting ? 'cursor-grabbing' : 'cursor-grab'
                } [&_*]:cursor-inherit [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-none [&_svg]:block [&_svg]:pointer-events-none [&_svg_*]:pointer-events-none`}
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
