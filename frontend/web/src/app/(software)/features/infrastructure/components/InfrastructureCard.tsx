'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { InfrastructurePost } from '../types';
import { ArticleCover } from '../../../components/ArticleCover';

interface InfrastructureCardProps {
  post: InfrastructurePost;
}

export function InfrastructureCard({ post }: InfrastructureCardProps) {
  const tCard = useTranslations('CardActions');
  const tInfra = useTranslations('Infrastructure');

  const envBadges: Record<string, { color: string; label: string }> = {
    production: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'PROD' },
    edge: { color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', label: 'EDGE' },
    hybrid: { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'HYBRID' },
    vps: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'VPS' },
    bare_metal: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', label: 'BARE-METAL' },
  };

  const currentEnv = envBadges[post.environment] || envBadges.production;

  let parsedSpecs: Record<string, string> = {};
  if (post.specs) {
    try {
      parsedSpecs = JSON.parse(post.specs);
    } catch {
      // Ignorar error si no es JSON válido
    }
  }

  return (
    <Link
      href={`/software/infrastructure/${post.slug}`}
      className="p-4 sm:p-5 rounded-2xl bg-black/20 dark:bg-[#16202c]/80 hover:bg-black/30 dark:hover:bg-[#1c2938] border border-black/5 dark:border-white/[0.07] hover:border-black/10 dark:hover:border-white/15 transition-all duration-200 flex flex-col justify-between h-full group shadow-sm cursor-pointer"
    >
      <div className="space-y-3.5">
        <ArticleCover
          title={post.title}
          category="infrastructure"
          tag={post.category.toUpperCase()}
        />

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${currentEnv.color}`}>
                {currentEnv.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 uppercase">
                {post.difficulty}
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 capitalize">
              {post.category}
            </span>
          </div>

          <h3 className="text-base font-bold text-[var(--header-title)] group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>

          {post.subtitle && (
            <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed mt-1.5">
              {post.subtitle}
            </p>
          )}

          {/* Telemetría rápida de especificaciones de servidor */}
          {Object.keys(parsedSpecs).length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
              {parsedSpecs.ram && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/5">
                  RAM: <strong className="text-zinc-200">{parsedSpecs.ram}</strong>
                </span>
              )}
              {parsedSpecs.cpu && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/5">
                  CPU: <strong className="text-zinc-200">{parsedSpecs.cpu}</strong>
                </span>
              )}
              {parsedSpecs.os && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/5">
                  {parsedSpecs.os}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span className="truncate max-w-[150px]">{post.techStack}</span>
        <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-semibold">
          {tCard('viewDetail')}
        </span>
      </div>
    </Link>
  );
}
