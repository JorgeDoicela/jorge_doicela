'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BookOpen, Columns2, Languages } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ViewMode {
  id: 'standard' | 'parallel' | 'interlinear';
  path: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VIEW_MODES: ViewMode[] = [
  { id: 'standard', path: '/study/standard', labelKey: 'standard', icon: BookOpen },
  { id: 'parallel', path: '/study/parallel', labelKey: 'parallel', icon: Columns2 },
  { id: 'interlinear', path: '/study/interlinear', labelKey: 'interlinear', icon: Languages },
];

export const BibleViewModeSwitcher: React.FC = () => {
  const t = useTranslations('Nav');
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  // Preservar query params al cambiar de modo de vista (libro, capítulo, etc.)
  const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : '';

  const isActive = (targetPath: string) => {
    return (
      pathname === targetPath ||
      pathname === `/bible${targetPath}` ||
      (targetPath === '/study/standard' && (pathname === '/study' || pathname === '/bible/study'))
    );
  };

  return (
    <nav
      aria-label={t('studyMode')}
      className="inline-flex items-center rounded-lg border border-zinc-200/90 dark:border-zinc-800/90 p-0.5 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xs"
    >
      {VIEW_MODES.map(({ id, path, labelKey, icon: Icon }) => {
        const active = isActive(path);
        return (
          <Link
            key={id}
            href={`${path}${queryString}`}
            className={`px-2.5 py-1 text-xs rounded-md transition-all flex items-center gap-1.5 font-medium cursor-pointer select-none ${
              active
                ? 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs border border-zinc-200/50 dark:border-zinc-800/50'
                : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40'
            }`}
            title={t(labelKey as any)}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t(labelKey as any)}</span>
          </Link>
        );
      })}
    </nav>
  );
};
