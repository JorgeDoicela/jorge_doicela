'use client';

import React from 'react';
import Link from 'next/link';
import { AiResource } from '../types';

interface AiCardProps {
  resource: AiResource;
}

export function AiCard({ resource }: AiCardProps) {
  const typeLabels: Record<string, { label: string; color: string }> = {
    llm: { label: 'LLM Reasoning', color: 'text-purple-500 dark:text-purple-400' },
    agent: { label: 'Agentic Framework', color: 'text-cyan-500 dark:text-cyan-400' },
    mcp_server: { label: 'MCP Server', color: 'text-emerald-500 dark:text-emerald-400' },
    framework: { label: 'Framework', color: 'text-indigo-500 dark:text-indigo-400' },
    tool: { label: 'AI Tool', color: 'text-blue-500 dark:text-blue-400' },
  };

  const badge = typeLabels[resource.type] || typeLabels.tool;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-3xl glass-convex-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-mono font-bold tracking-wide ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-xs text-zinc-500 font-mono">{resource.provider}</span>
        </div>

        <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-purple-400 transition-colors leading-snug mb-2">
          {resource.name}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-3 mb-4 leading-relaxed font-light">
          {resource.description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="px-2 py-0.5 rounded bg-zinc-800/60 font-mono">{resource.license}</span>
          <span>•</span>
          <span>{resource.views} vistas</span>
        </div>

        <Link
          href={`/software/ai/${resource.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
        >
          Ficha técnica →
        </Link>
      </div>
    </div>
  );
}
