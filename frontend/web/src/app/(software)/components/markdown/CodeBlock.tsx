'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check } from 'lucide-react';
import { MermaidBlock } from './MermaidBlock';
import Prism from 'prismjs';

// Gramáticas comunes de Prism
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-ini';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  tsx: 'TSX',
  bash: 'Bash',
  sh: 'Bash',
  zsh: 'Shell',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  sql: 'SQL',
  nginx: 'Nginx',
  docker: 'Docker',
  dockerfile: 'Dockerfile',
  python: 'Python',
  py: 'Python',
  md: 'Markdown',
  markdown: 'Markdown',
  ini: 'INI Config',
  text: 'Texto Plano',
  plaintext: 'Texto Plano',
};

export function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const t = useTranslations('Markdown');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanCode = code ? code.replace(/\n$/, '') : '';
  const normalizedLang = language.toLowerCase().trim();

  // Si el bloque es Mermaid, delegamos directamente a MermaidBlock
  if (normalizedLang === 'mermaid') {
    return <MermaidBlock chart={cleanCode} />;
  }

  const displayLabel = LANGUAGE_LABELS[normalizedLang] || normalizedLang.toUpperCase();

  // Resaltado de sintaxis con Prism
  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[normalizedLang] || Prism.languages.javascript || Prism.languages.plain;
      if (grammar) {
        return Prism.highlight(cleanCode, grammar, normalizedLang);
      }
    } catch {
      // Fallback seguro
    }
    return null;
  }, [cleanCode, normalizedLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-6 rounded-2xl bg-[#f6f8fa] dark:bg-[#12161f] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden text-xs font-mono select-text transition-all duration-300">
      {/* Barra superior de control estilo macOS / Apple */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/[0.025] dark:bg-white/[0.025] border-b border-black/[0.06] dark:border-white/[0.06] select-none">
        {/* Lado izquierdo: Botones de control de ventana macOS (Traffic Lights) + Badge */}
        <div className="flex items-center gap-3">
          {/* Semáforo de ventana macOS */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs" />
          </div>

          {/* Badge del Lenguaje */}
          <div className="flex items-center text-[11px] font-mono tracking-wider font-semibold uppercase text-slate-600 dark:text-zinc-400 pl-2 border-l border-black/10 dark:border-white/10">
            <span>{displayLabel}</span>
          </div>
        </div>

        {/* Lado derecho: Botón Copiar estilo Apple */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-sans font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
          title={t('copyCodeAria')}
          aria-label={t('copyCodeAria')}
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

      {/* Contenedor del código adaptado a modo claro y oscuro */}
      <pre className="p-4 sm:p-5 overflow-x-auto text-[#1d1d1f] dark:text-[#f0f6fc] leading-relaxed font-mono text-[13px] scrollbar-thin selection:bg-blue-500/20 dark:selection:bg-blue-500/30">
        {highlightedHtml ? (
          <code
            className={`language-${normalizedLang}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code className={`language-${normalizedLang}`}>{cleanCode}</code>
        )}
      </pre>
    </div>
  );
}

/**
 * Componente para código en línea (`inline code`) estilo Apple
 */
export function InlineCode({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className="px-1.5 py-0.5 rounded-md bg-black/[0.05] dark:bg-white/[0.08] text-slate-900 dark:text-zinc-100 font-mono text-[12px] border border-black/[0.08] dark:border-white/[0.1] font-medium select-text"
      {...props}
    >
      {children}
    </code>
  );
}
