'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock, InlineCode, TableBlock, CalloutBlock } from './markdown';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

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
            <thead className="bg-slate-100/90 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 select-none" {...props} />
          ),
          th: ({ node: _node, ...props }) => (
            <th className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase text-[11px] tracking-wider" {...props} />
          ),
          tbody: ({ node: _node, ...props }) => (
            <tbody className="divide-y divide-slate-200/80 dark:divide-white/5" {...props} />
          ),
          tr: ({ node: _node, ...props }) => (
            <tr className="hover:bg-slate-100/60 dark:hover:bg-white/[0.02] transition-colors" {...props} />
          ),
          td: ({ node: _node, ...props }) => (
            <td className="px-4 py-3 text-slate-700 dark:text-zinc-300 font-normal leading-relaxed align-top" {...props} />
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
