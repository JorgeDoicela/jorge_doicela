'use client';

import React from 'react';
import { AiResource } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface AiCardProps {
  resource: AiResource;
}

export function AiCard({ resource }: AiCardProps) {
  const typeLabels: Record<string, string> = {
    llm: 'LLM Reasoning',
    agent: 'Agentic Framework',
    mcp_server: 'MCP_SERVER',
    framework: 'Framework',
    tool: 'AI Tool',
  };

  const typeLabel = typeLabels[resource.type] || resource.type.toUpperCase();
  const metaText = `${resource.provider} — ${typeLabel}`;

  return (
    <SoftwareCard
      href={`/ai/${resource.slug}`}
      title={resource.name}
      category="ai"
      coverImage={resource.coverImage}
      tag={typeLabel}
      categoryMeta={metaText}
      excerpt={resource.description}
      accentHoverColor="group-hover:text-purple-300"
    />
  );
}
