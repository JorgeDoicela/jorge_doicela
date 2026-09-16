import React from 'react';
import { useTranslations } from 'next-intl';

export interface ProjectActionsProps {
  liveUrl?: string;
  repoUrl?: string;
  className?: string;
}

export function ProjectActions({ liveUrl, repoUrl, className = '' }: ProjectActionsProps) {
  const tCard = useTranslations('CardActions');

  if (!liveUrl && !repoUrl) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-3 pb-6 border-b border-black/5 dark:border-white/5 ${className}`}
      role="group"
      aria-label={tCard('projectLinks')}
    >
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <span>{tCard('openLiveApp')}</span>
          <span aria-hidden="true" className="select-none font-sans text-[11px] leading-none">
            ↗
          </span>
        </a>
      )}
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl glass-concave-panel text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <span>{tCard('viewGithub')}</span>
          <span aria-hidden="true" className="select-none font-sans text-[11px] leading-none">
            ↗
          </span>
        </a>
      )}
    </div>
  );
}
