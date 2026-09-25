'use client';

import React from 'react';
import { SecurityPost } from '../types';
import { SoftwareCard } from '../../../shared/ui/SoftwareCard';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const module = 'SEGURIDAD';
  const sub = post.category?.toUpperCase() || post.severity || '';
  const metaText = sub ? `${module} • ${sub}` : module;

  return (
    <SoftwareCard
      href={`/cybersecurity/${post.slug}`}
      title={post.title}
      category="cybersecurity"
      coverImage={post.coverImage}
      tag={post.cveId || post.severity}
      categoryMeta={metaText}
      excerpt={post.excerpt}
      accentHoverColor="group-hover:text-rose-300"
    />
  );
}
