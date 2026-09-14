'use client';

import React from 'react';
import { SecurityPost } from '../types';
import { SoftwareCard } from '../../../components/SoftwareCard';

interface SecurityCardProps {
  post: SecurityPost;
}

export function SecurityCard({ post }: SecurityCardProps) {
  const metaText = `${post.severity} • ${post.postType} • ${post.affectedSystems || 'Linux / Web'}`;

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
