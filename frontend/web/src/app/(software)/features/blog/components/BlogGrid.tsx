'use client';

import React from 'react';
import { BlogPost } from '../types';
import { BlogCard } from './BlogCard';

interface BlogGridProps {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export function BlogGrid({ posts, loading, error }: BlogGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-48 rounded-3xl glass-convex-panel bg-zinc-900/30" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl glass-concave-panel text-center text-rose-400">
        <p className="text-sm font-medium">Error al cargar artículos del blog: {error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
        <p className="text-base font-medium">No se encontraron artículos en el blog.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
