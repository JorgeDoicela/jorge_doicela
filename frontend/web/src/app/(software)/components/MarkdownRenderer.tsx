'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Separar bloques por párrafos dobles o bloques de código
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-4 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return (
            <div
              key={idx}
              className="my-5 rounded-2xl bg-[#090e17] border border-white/10 overflow-hidden shadow-inner font-mono text-xs"
            >
              {block.language && (
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-[11px] text-zinc-400 uppercase tracking-wider">
                  <span>{block.language}</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-cyan-300 leading-relaxed scrollbar-none">
                <code>{block.text}</code>
              </pre>
            </div>
          );
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={idx}
              className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-4 pb-1 border-b border-white/5"
            >
              {renderInline(block.text)}
            </h2>
          );
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={idx}
              className="text-lg sm:text-xl font-bold text-white tracking-tight pt-3 pb-1"
            >
              {renderInline(block.text)}
            </h3>
          );
        }

        if (block.type === 'callout') {
          return (
            <div
              key={idx}
              className="my-4 p-4 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 text-xs sm:text-sm text-cyan-200/90 leading-relaxed font-normal shadow-sm"
            >
              {renderInline(block.text)}
            </div>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={idx} className="my-3 space-y-2 pl-4 list-none">
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold shrink-0 mt-1">▪</span>
                  <span className="flex-1">{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="text-zinc-300/90 leading-relaxed">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

interface ParsedBlock {
  type: 'p' | 'h2' | 'h3' | 'callout' | 'list' | 'code';
  text: string;
  language?: string;
  items?: string[];
}

function parseMarkdownBlocks(raw: string): ParsedBlock[] {
  const lines = raw.split(/\r?\n/);
  const blocks: ParsedBlock[] = [];

  let inCode = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({
        type: 'list',
        text: '',
        items: [...listBuffer],
      });
      listBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Bloque de código ```
    if (trimmed.startsWith('```')) {
      if (inCode) {
        blocks.push({
          type: 'code',
          text: codeBuffer.join('\n'),
          language: codeLang,
        });
        codeBuffer = [];
        codeLang = '';
        inCode = false;
      } else {
        flushList();
        inCode = true;
        codeLang = trimmed.replace('```', '').trim();
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Líneas vacías separan párrafos
    if (!trimmed) {
      flushList();
      continue;
    }

    // Lista viñetas
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listBuffer.push(trimmed.slice(2).trim());
      continue;
    }

    flushList();

    // Headings
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4).trim() });
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3).trim() });
      continue;
    }

    // Callout tipo Note: o >
    if (trimmed.toLowerCase().startsWith('note:') || trimmed.startsWith('> ')) {
      blocks.push({
        type: 'callout',
        text: trimmed.replace(/^>\s*/, ''),
      });
      continue;
    }

    // Párrafo normal
    blocks.push({ type: 'p', text: trimmed });
  }

  flushList();

  return blocks;
}

// Renderizar negritas (**...**), código inline (`...`) y enlaces ([...](...))
function renderInline(text: string): React.ReactNode[] {
  // Regex para capturar enlaces [title](url), negritas **bold**, código `code`
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-black/40 text-cyan-300 font-mono text-xs border border-white/10"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <a
            key={index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            {match[1]}
          </a>
        );
      }
    }
    return <span key={index}>{part}</span>;
  });
}
