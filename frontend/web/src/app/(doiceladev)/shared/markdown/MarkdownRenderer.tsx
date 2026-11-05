'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock, InlineCode, TableBlock, CalloutBlock, GlossaryTermPopover } from './components';
import type { GlossaryTerm } from '../types';
import { createRemarkGlossary } from './lib/glossary-matcher';

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

/**
 * Extrae recursivamente el texto plano de un nodo React para generar IDs de anclaje deterministas.
 */
function getNodeText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join('');
  if (React.isValidElement(node) && (node.props as { children?: React.ReactNode })) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

/**
 * Convierte un texto a slug limpio para navegación de anclas (#seccion-tecnica).
 */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
export function MarkdownRenderer({ content, glossaryTerms = [] }: MarkdownRendererProps) {
  const sanitizedContent = useMemo(() => normalizeMarkdownContent(content), [content]);

  // Mapa de búsqueda O(1) de términos por slug para renderizado determinista
  const termsMap = useMemo(
    () => new Map(glossaryTerms.map((t) => [t.slug, t])),
    [glossaryTerms],
  );

  // Plugin de Remark memoizado: enriquece el AST una sola vez de forma 100% pura y libre de Hydration Mismatches
  const glossaryPlugin = useMemo(
    () => createRemarkGlossary(glossaryTerms),
    [glossaryTerms],
  );

  if (!sanitizedContent) return null;

  return (
    <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-normal dark:font-light leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, glossaryPlugin]}
        components={{
          // Defensa en profundidad: La cabecera editorial (DoiceladevArticleLayout) es el único H1 del documento.
          // Cualquier H1 dentro del cuerpo Markdown se degrada a H2 semántico para cumplir con WCAG 2.1 y Google SEO.
          h1: ({ node: _node, children, ...props }) => {
            const text = getNodeText(children);
            const id = slugifyHeading(text);
            return (
              <h2
                id={id || undefined}
                className="scroll-mt-24 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-8 pb-1.5"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h2: ({ node: _node, children, ...props }) => {
            const text = getNodeText(children);
            const id = slugifyHeading(text);
            return (
              <h2
                id={id || undefined}
                className="scroll-mt-24 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-8 pb-1.5"
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ node: _node, children, ...props }) => {
            const text = getNodeText(children);
            const id = slugifyHeading(text);
            return (
              <h3
                id={id || undefined}
                className="scroll-mt-24 text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight pt-5 pb-1"
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ node: _node, ...props }) => (
            <h4
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight pt-4 pb-1"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed my-3" {...props} />
          ),
          span: ({ node: _node, ...props }) => {
            const slug = (props as any)['data-glossary-slug'];
            if (slug) {
              const term = termsMap.get(slug);
              const text = (props as any)['data-glossary-text'];
              const isCode = (props as any)['data-glossary-code'] === 'true';
              if (term) {
                return (
                  <GlossaryTermPopover
                    displayText={text || term.term}
                    termData={term}
                    isCode={isCode}
                  />
                );
              }
            }
            return <span {...props} />;
          },
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
          li: ({ node: _node, className, children, ...props }) => {
            const isTaskList = className?.includes('task-list-item');
            return (
              <li
                className={`text-slate-700 dark:text-zinc-300 font-sans font-normal leading-relaxed ${
                  isTaskList ? 'list-none -ml-5 my-1.5' : ''
                }`}
                {...props}
              >
                {children}
              </li>
            );
          },
          input: ({ node: _node, type, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  disabled
                  className="mr-2.5 h-4 w-4 rounded border-slate-300 dark:border-zinc-700 text-blue-600 dark:text-blue-500 accent-blue-600 dark:accent-blue-500 focus:ring-0 align-[-2px] cursor-default pointer-events-none inline-block"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
          img: ({ node: _node, src, alt, ...props }) => {
            if (!src) return null;
            return (
              <figure className="my-8 mx-auto max-w-full space-y-2.5 text-center">
                <div className="relative inline-block overflow-hidden rounded-2xl glass-convex-panel border border-black/[0.08] dark:border-white/[0.08] shadow-lg">
                  <img
                    src={src}
                    alt={alt || ''}
                    loading="lazy"
                    className="max-h-[560px] w-auto max-w-full rounded-2xl object-contain mx-auto"
                    {...props}
                  />
                </div>
                {alt && (
                  <figcaption className="text-center font-mono text-[12px] text-slate-500 dark:text-zinc-400 font-medium select-text">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
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
            <tr {...props} />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="px-5 py-4 text-slate-700 dark:text-zinc-300 font-normal leading-relaxed align-top first:font-mono first:font-semibold first:text-slate-900 dark:first:text-zinc-100 first:bg-black/[0.015] dark:first:bg-white/[0.015] first:w-[28%] first:border-r first:border-black/5 dark:first:border-white/5 first:[&_code]:bg-transparent first:[&_code]:p-0 first:[&_code]:text-inherit" {...props} />
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ node: _node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children);
            const isInline = !match && !rawContent.includes('\n');

            if (isInline) {
              return <InlineCode {...props}>{children}</InlineCode>;
            }

            const language = match ? match[1] : 'text';
            const meta =
              _node &&
              'data' in _node &&
              typeof _node.data === 'object' &&
              _node.data &&
              'meta' in _node.data &&
              typeof _node.data.meta === 'string'
                ? _node.data.meta
                : undefined;

            return (
              <CodeBlock
                code={rawContent}
                language={language}
                meta={meta}
                className={className}
              />
            );
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
}

