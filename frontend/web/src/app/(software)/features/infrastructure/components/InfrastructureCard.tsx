'use client';

import React from 'react';
import { InfrastructurePost } from '../types';
import { SoftwareCard } from '../../../components/SoftwareCard';

interface InfrastructureCardProps {
  post: InfrastructurePost;
}

export function InfrastructureCard({ post }: InfrastructureCardProps) {
  return (
    <SoftwareCard
      href={`/infrastructure/${post.slug}`}
      title={post.title}
      category="infrastructure"
      coverImage={post.coverImage}
      subCategory={post.category}
      tag={post.environment.toUpperCase()}
      categoryMeta={`${post.category}, ${post.environment}`}
      excerpt={post.subtitle || post.architectureOverview}
      accentHoverColor="group-hover:text-cyan-300"
    />
  );
}
