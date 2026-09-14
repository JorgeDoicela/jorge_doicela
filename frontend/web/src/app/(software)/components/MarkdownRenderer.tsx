'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock, InlineCode, TableBlock, CalloutBlock } from './markdown';

interface MarkdownRendererProps {
  content: string;
}

/**
 * Normaliza defensivamente sintaxis pseudo-LaTeX o flechas matemáticas a Markdown / Unicode limpio.
 * Evita introducir dependencias pesadas de renderizado matemático (KaTeX/MathJax) en el VPS de 1 GB de RAM.
 */
function normalizeMarkdownContent(raw: string): string {
  if (!raw) return '';

  return (
    raw
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
      .replace(/\\text\{([^}]+)\}/g, '$1')
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const sanitizedContent = useMemo(() => normalizeMarkdownContent(content), [content]);

  if (!sanitizedContent) return null;

  return (
    <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-normal dark:font-light leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight pt-6 pb-2"
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
          p: ({ node: _node, ...props }) => (
            <p className="text-slate-700 dark:text-zinc-300 leading-relaxed my-3" {...props} />
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
              {children}
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

