'use client';

import React, { useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock, InlineCode, TableBlock, CalloutBlock, GlossaryTermPopover } from './components';
import type { GlossaryTerm } from '../../entities/glossary/types';
import {
  buildGlossaryMatchers,
  enrichWithGlossary,
  matchInlineCodeGlossary,
} from './lib/glossary-matcher';

interface MarkdownRendererProps {
  content: string;
  glossaryTerms?: GlossaryTerm[];
}

/**
 * Normaliza defensivamente sintaxis pseudo-LaTeX o flechas matemáticas a Markdown / Unicode limpio,
 * protegiendo de forma estricta los bloques de código cercados (```...```) e inline (`...`)
 * para jamás corromper snippets de código fuente ni sintaxis de diagramas Mermaid.
 */
function normalizeMarkdownContent(raw: string): string {
  if (!raw) return '';

  // 1. Extraer y proteger bloques de código y diagramas con placeholders seguros
  const codePlaceholders: string[] = [];
  const protectedContent = raw.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    codePlaceholders.push(match);
    return `__MD_CODE_BLOCK_SLOT_${codePlaceholders.length - 1}__`;
  });

  // 2. Normalizar únicamente el texto plano / editorial exterior
  const normalized = protectedContent
    // Flechas LaTeX a Unicode estándar
    .replace(/\$(?:\\rightarrow|\\to)\$/g, '→')
    .replace(/\\rightarrow\b/g, '→')
    .replace(/\$(?:\\leftarrow|\\gets)\$/g, '←')
    .replace(/\\leftarrow\b/g, '←')
    .replace(/\$\\leftrightarrow\$/g, '↔')
    .replace(/\\leftrightarrow\b/g, '↔')
    // Desempaqueta bloques display pseudo-LaTeX: $$\text{...}$$ -> `...`
    .replace(/\$\$([\s\S]*?)\$\$/g, (_match, inner) => {
      const cleaned = inner.replace(/\\text\{([^}]+)\}/g, '$1').trim();
      return `\`${cleaned}\``;
    })
    // Desempaqueta inline math con \text{...} -> `...`
    .replace(/\$([^\n$]*\\text\{[^}]+\}[^\n$]*)\$/g, (_match, inner) => {
      const cleaned = inner.replace(/\\text\{([^}]+)\}/g, '$1').trim();
      return `\`${cleaned}\``;
    })
    // Elimina cualquier comando \text{...} residual fuera de bloques
    .replace(/\\text\{([^}]+)\}/g, '$1');

  // 3. Restaurar exactamente los bloques de código y diagramas sin alteraciones
  return normalized.replace(
    /__MD_CODE_BLOCK_SLOT_(\d+)__/g,
    (_match, index) => codePlaceholders[Number(index)] ?? '',
  );
}

export function MarkdownRenderer({ content, glossaryTerms = [] }: MarkdownRendererProps) {
  const sanitizedContent = useMemo(() => normalizeMarkdownContent(content), [content]);

  // Precompila matchers de expresiones regulares con límites de palabra para alto rendimiento
  const matchers = useMemo(() => buildGlossaryMatchers(glossaryTerms), [glossaryTerms]);

  // Rastrear términos vistos por cada pasada de renderizado para aplicar la regla de primera mención
  const seenSlugsRef = useRef<Set<string>>(new Set());
  seenSlugsRef.current.clear();

  if (!sanitizedContent) return null;

  return (
    <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-normal dark:font-light leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Defensa en profundidad: La cabecera editorial (SoftwareArticleLayout) es el único H1 del documento.
          // Cualquier H1 dentro del cuerpo Markdown se degrada a H2 semántico para cumplir con WCAG 2.1 y Google SEO.
          h1: ({ node: _node, ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-8 pb-1.5"
              {...props}
            />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-8 pb-1.5"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight pt-5 pb-1"
              {...props}
            />
          ),
          h4: ({ node: _node, ...props }) => (
            <h4
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight pt-4 pb-1"
              {...props}
            />
          ),
          p: ({ node: _node, children, ...props }) => (
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed my-3" {...props}>
              {enrichWithGlossary(children, matchers, seenSlugsRef.current)}
            </p>
          ),
          strong: ({ node: _node, ...props }) => (
            <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
          ),
          em: ({ node: _node, ...props }) => (
            <em className="italic text-slate-800 dark:text-zinc-200" {...props} />
          ),
          hr: () => null,
          blockquote: ({ node: _node, children }) => (
            <CalloutBlock>{children}</CalloutBlock>
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="my-3 space-y-2 pl-5 list-disc text-blue-600 dark:text-blue-400" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="my-3 space-y-2 pl-5 list-decimal text-blue-600 dark:text-blue-400 font-mono font-medium" {...props} />
          ),
          li: ({ node: _node, children, ...props }) => (
            <li className="text-slate-700 dark:text-zinc-300 font-sans font-normal leading-relaxed" {...props}>
              {enrichWithGlossary(children, matchers, seenSlugsRef.current)}
            </li>
          ),
          a: ({ node: _node, ...props }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline font-medium transition-colors"
              {...props}
            />
          ),
          table: ({ node: _node, children, ...props }) => (
            <TableBlock {...props}>{children}</TableBlock>
          ),
          thead: ({ node: _node, ...props }) => (
            <thead className="bg-slate-100/90 dark:bg-zinc-800/80 backdrop-blur-md border-b-2 border-blue-500/30 select-none" {...props} />
          ),
          th: ({ node: _node, ...props }) => (
            <th className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-zinc-100 uppercase text-[11px] tracking-wider" {...props} />
          ),
          tbody: ({ node: _node, ...props }) => (
            <tbody className="divide-y divide-black/5 dark:divide-white/5" {...props} />
          ),
          tr: ({ node: _node, ...props }) => (
            <tr className="hover:bg-blue-500/[0.035] dark:hover:bg-blue-400/[0.04] transition-colors" {...props} />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="px-5 py-4 text-slate-700 dark:text-zinc-300 font-normal leading-relaxed align-top first:font-mono first:font-semibold first:text-slate-900 dark:first:text-zinc-100 first:bg-black/[0.015] dark:first:bg-white/[0.015] first:w-[28%] first:border-r first:border-black/5 dark:first:border-white/5" {...props} />
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ node: _node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children);
            const isInline = !match && !rawContent.includes('\n');

            if (isInline) {
              const matchedTerm = matchInlineCodeGlossary(rawContent, matchers, seenSlugsRef.current);
              if (matchedTerm) {
                return (
                  <GlossaryTermPopover
                    displayText={rawContent}
                    termData={matchedTerm}
                    isCode
                  />
                );
              }
              return <InlineCode {...props}>{children}</InlineCode>;
            }

            const language = match ? match[1] : 'text';
            return <CodeBlock code={rawContent} language={language} className={className} />;
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}

