'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AiResource } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface AiCardProps {
  resource: AiResource;
}

export function AiCard({ resource }: AiCardProps) {
  const tCard = useTranslations('CardActions');

  const typeLabels: Record<string, { label: string; color: string }> = {
    llm: { label: 'LLM Reasoning', color: 'text-purple-400' },
    agent: { label: 'Agentic Framework', color: 'text-cyan-400' },
    mcp_server: { label: 'MCP Server', color: 'text-emerald-400' },
    framework: { label: 'Framework', color: 'text-indigo-400' },
    tool: { label: 'AI Tool', color: 'text-blue-400' },
  };

  const badge = typeLabels[resource.type] || typeLabels.tool;

  return (
    <Link
      href={`/software/ai/${resource.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={resource.name}
          category="ai"
          coverImage={resource.coverImage}
          tag={badge.label}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[11px] font-mono font-bold tracking-wide ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">{resource.provider}</span>
          </div>

          <h3 className="text-base font-bold text-[var(--header-title)] group-hover:text-purple-300 transition-colors leading-snug line-clamp-2">
            {resource.name}
          </h3>

          <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
            {resource.description}
          </p>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-500">
          <span>{resource.license}</span>
          <span>•</span>
          <span>{tCard('viewsCount', { count: resource.views })}</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
          {tCard('viewSpecs')}
        </span>
      </div>
    </Link>
  );
}
