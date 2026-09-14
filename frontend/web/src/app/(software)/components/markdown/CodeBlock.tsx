'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check, Terminal, Code2, FileCode } from 'lucide-react';
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

export interface CodeBlockProps {
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
  text: 'logs / output',
  plaintext: 'logs / output',
};

/**
 * Extrae defensivamente un posible nombre de archivo o ruta de la primera línea de código
 */
function extractFilename(code: string): string | null {
  if (!code) return null;
  const firstLine = code.split('\n')[0].trim();
  const match = firstLine.match(/^(?:\/\/|#|\/\*)\s*(?:[A-Za-z0-9_./-]+\/)?([A-Za-z0-9_.-]+\.[A-Za-z0-9]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const t = useTranslations('Markdown');
  const [copied, setCopied] = useState<boolean>(false);

  const cleanCode = code ? code.replace(/\n$/, '') : '';
  const normalizedLang = language.toLowerCase().trim();

  // Si el bloque es Mermaid, delegamos directamente a MermaidBlock
  if (normalizedLang === 'mermaid') {
    return <MermaidBlock chart={cleanCode} />;
  }

  const isBashOrShell =
    normalizedLang === 'bash' ||
    normalizedLang === 'sh' ||
    normalizedLang === 'zsh' ||
    normalizedLang === 'shell';
  const isLogOrText =
    normalizedLang === 'text' || normalizedLang === 'plaintext' || !normalizedLang;
  const displayLabel = LANGUAGE_LABELS[normalizedLang] || normalizedLang;
  const detectedFilename = extractFilename(cleanCode);

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
      {/* Cabecera Inteligente y Localizada: Contexto de Archivo / Terminal / Código */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/[0.025] dark:bg-white/[0.025] border-b border-black/[0.06] dark:border-white/[0.06] select-none">
        <div className="flex items-center gap-2 min-w-0">
          {detectedFilename ? (
            <>
              <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[12px] font-mono font-semibold text-slate-800 dark:text-zinc-200 truncate">
                {detectedFilename}
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-zinc-400 uppercase px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 shrink-0">
                {displayLabel}
              </span>
            </>
          ) : isBashOrShell ? (
            <>
              <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-zinc-300">
                {displayLabel}
              </span>
            </>
          ) : isLogOrText ? (
            <>
              <Terminal className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
              <span className="text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-300">
                {t('terminal')}
              </span>
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-[11px] font-mono font-semibold text-slate-700 dark:text-zinc-300">
                {displayLabel}
              </span>
            </>
          )}
        </div>

        {/* Botón Copiar con confirmación (Solo icono) */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded-md text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 shrink-0"
          title={copied ? t('copied') : t('copyCodeAria')}
          aria-label={t('copyCodeAria')}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Cuerpo del código */}
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
