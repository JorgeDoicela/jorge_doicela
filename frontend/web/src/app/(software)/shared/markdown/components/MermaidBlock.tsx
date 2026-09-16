'use client';

import React, { useEffect, useState, useId, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import {
  Copy,
  Check,
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
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const diagramCategory = useMemo(() => detectDiagramType(chart), [chart]);
  const DiagramIcon = useMemo(() => getDiagramIcon(diagramCategory), [diagramCategory]);

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

  // Manejo de teclado para cerrar el visor a pantalla completa
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
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
              onClick={() => setIsExpanded(true)}
              className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 shrink-0"
              title={t('clickToExpand')}
              aria-label={t('expand')}
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Botón Copiar (Solo Icono) */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 shrink-0"
              title={t('copyDiagramAria')}
              aria-label={t('copyDiagramAria')}
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
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
              onClick={() => setIsExpanded(true)}
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

      {/* Visor Inmersivo a Pantalla Completa: Cierre directo al presionar afuera */}
      {mounted &&
        isExpanded &&
        svgContent &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[999999] backdrop-blur-xl bg-black/20 dark:bg-black/40 overflow-auto p-4 sm:p-8 md:p-12 flex items-center justify-center cursor-zoom-out scrollbar-thin animate-in fade-in duration-200"
            onClick={() => setIsExpanded(false)}
          >
            <div
              className="bg-white dark:bg-[#12161f] p-4 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 max-w-none transition-all flex justify-center items-center cursor-default [&_svg]:w-full [&_svg]:h-auto [&_svg]:max-w-none m-auto"
              style={{
                width: `${Math.max(dimensions?.width || 800, 720)}px`,
              }}
              onClick={(e) => e.stopPropagation()}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
