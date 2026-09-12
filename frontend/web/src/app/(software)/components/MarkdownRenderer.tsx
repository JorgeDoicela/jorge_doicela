'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight pt-6 pb-2 border-b border-slate-200 dark:border-white/10"
              {...props}
            />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-5 pb-2 border-b border-slate-200 dark:border-white/10"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight pt-4 pb-1"
              {...props}
            />
          ),
          h4: ({ node: _node, ...props }) => (
            <h4
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight pt-3 pb-1"
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
          hr: ({ node: _node, ...props }) => (
            <hr className="my-8 border-t border-slate-200 dark:border-white/10" {...props} />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="my-4 p-4 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/20 border-l-4 border-cyan-600 dark:border-cyan-400 text-xs sm:text-sm text-cyan-950 dark:text-cyan-200/90 leading-relaxed font-normal shadow-sm"
              {...props}
            />
          ),
          ul: ({ node: _node, ...props }) => (
            <ul className="my-3 space-y-2 pl-5 list-disc text-cyan-600 dark:text-cyan-400" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="my-3 space-y-2 pl-5 list-decimal text-cyan-600 dark:text-cyan-400 font-mono font-medium" {...props} />
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
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-500 dark:hover:text-cyan-300 underline font-medium transition-colors"
              {...props}
            />
          ),
          table: ({ node: _node, ...props }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm font-sans border-collapse" {...props} />
            </div>
          ),
          thead: ({ node: _node, ...props }) => (
            <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10" {...props} />
          ),
          th: ({ node: _node, ...props }) => (
            <th className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-zinc-200 uppercase text-[11px] tracking-wider" {...props} />
          ),
          tbody: ({ node: _node, ...props }) => (
            <tbody className="divide-y divide-slate-200 dark:divide-white/5" {...props} />
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
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-black/40 text-cyan-800 dark:text-cyan-300 font-mono text-[12px] border border-slate-300/70 dark:border-white/10 font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-5 rounded-2xl bg-[#090e17] border border-black/10 dark:border-white/10 overflow-hidden shadow-inner font-mono text-xs">
                {match && (
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-[11px] text-zinc-400 uppercase tracking-wider">
                    <span>{match[1]}</span>
                  </div>
                )}
                <pre className="p-4 overflow-x-auto text-cyan-300 leading-relaxed scrollbar-none">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
