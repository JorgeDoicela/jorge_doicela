'use client';

import React from 'react';
import { AiResource } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface AiCardProps {
  resource: AiResource;
}

export function AiCard({ resource }: AiCardProps) {
  const categoryLabels: Record<string, string> = {
    llm: 'LLM Reasoning',
    agent: 'Agentic Framework',
    mcp_server: 'MCP Server',
    framework: 'Framework',
    tool: 'AI Tool',
    dataset: 'Dataset',
    platform: 'Platform',
  };

  const categoryLabel = categoryLabels[resource.category] || resource.category.toUpperCase();
  const metaParts = [
    resource.provider,
    categoryLabel,
    resource.license,
  ].filter(Boolean);
  const metaText = metaParts.join(' • ');

  return (
    <SoftwareCard
      href={`/ai/${resource.slug}`}
      title={resource.name}
      category="ai"
      coverImage={resource.coverImage}
      tag={categoryLabel}
      categoryMeta={metaText}
      excerpt={resource.description}
      accentHoverColor="group-hover:text-purple-300"
    />
  );
}
