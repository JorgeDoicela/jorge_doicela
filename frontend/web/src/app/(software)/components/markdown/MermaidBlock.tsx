'use client';

import React, { useEffect, useState, useId } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

interface MermaidBlockProps {
  chart: string;
}

export function MermaidBlock({ chart }: MermaidBlockProps) {
  const t = useTranslations('Markdown');
  const { resolvedTheme } = useTheme();
  const rawId = useId();
  const cleanId = `mermaid-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

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

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: isDark ? 'dark' : 'neutral',
          fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
          themeVariables: isDark
            ? {
                darkMode: true,
                background: '#090e17',
                primaryColor: '#1e293b',
                primaryTextColor: '#f1f5f9',
                primaryBorderColor: '#3b82f6',
                lineColor: '#60a5fa',
                secondaryColor: '#0f172a',
                tertiaryColor: '#1e293b',
              }
            : {
                darkMode: false,
                background: '#ffffff',
                primaryColor: '#f1f5f9',
                primaryTextColor: '#090e17',
                primaryBorderColor: '#2563eb',
                lineColor: '#2563eb',
              },
        });

        // Generar SVG con ID único garantizado por ejecución
        const renderId = `${cleanId}-${Math.random().toString(36).substring(2, 7)}`;
        const { svg } = await mermaid.render(renderId, chart.trim());
        if (isMounted) {
          setSvgContent(svg);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Sintaxis de diagrama no válida';
          setError(message);
          setLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, resolvedTheme, cleanId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback si el portapapeles no está disponible
    }
  };

  return (
    <div className="my-6 rounded-2xl bg-[#f6f8fa] dark:bg-[#12161f] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden transition-all duration-300">
      {/* Barra superior de control estilo macOS / Apple */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/[0.025] dark:bg-white/[0.025] border-b border-black/[0.06] dark:border-white/[0.06] text-xs select-none">
        {/* Lado izquierdo: Botones de control de ventana macOS (Traffic Lights) + Título */}
        <div className="flex items-center gap-3">
          {/* Semáforo de ventana macOS */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" />
          </div>

          {/* Título del Diagrama */}
          <div className="flex items-center text-[11px] font-mono tracking-wider font-semibold uppercase text-slate-600 dark:text-zinc-400 pl-2 border-l border-black/10 dark:border-white/10">
            <span>{t('diagramTitle')}</span>
          </div>
        </div>

        {/* Lado derecho: Botón Copiar estilo Apple */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
          title={t('copyDiagramAria')}
          aria-label={t('copyDiagramAria')}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('copied')}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
              <span>{t('copy')}</span>
            </>
          )}
        </button>
      </div>

      {/* Contenido del diagrama */}
      <div className="p-4 sm:p-6 overflow-x-auto scrollbar-thin">
        {loading && (
          <div className="flex flex-col items-center justify-center py-10 space-y-2 text-slate-400 dark:text-zinc-500 text-xs font-mono animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500/50" />
            <span>{t('generatingDiagram')}</span>
          </div>
        )}

        {error && (
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t('diagramError')}</span>
            </div>
            <pre className="p-3 rounded-xl bg-black/40 text-zinc-300 text-xs font-mono overflow-x-auto">
              <code>{chart}</code>
            </pre>
          </div>
        )}

        {!loading && !error && svgContent && (
          <div
            className="flex justify-center items-center max-w-full [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
    </div>
  );
}
