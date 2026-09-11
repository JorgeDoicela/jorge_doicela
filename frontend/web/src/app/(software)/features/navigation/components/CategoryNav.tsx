'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export type SoftwareSection =
    | 'all'
    | 'news'
    | 'blog'
    | 'forum'
    | 'ai'
    | 'cybersecurity'
    | 'tutorials'
    | 'projects'
    | 'infrastructure';

interface CategoryNavProps {
    selectedCategory: SoftwareSection;
    onSelectCategory?: (cat: SoftwareSection) => void;
    bare?: boolean;
}

export const CATEGORY_ROUTES: Record<SoftwareSection, string> = {
    all: '/software',
    news: '/software/news',
    blog: '/software/blog',
    ai: '/software/ai',
    cybersecurity: '/software/cybersecurity',
    tutorials: '/software/tutorials',
    forum: '/software/forum',
    projects: '/software/projects',
    infrastructure: '/software/infrastructure',
};

export const SOFTWARE_CATEGORY_KEYS: { id: SoftwareSection; key: string }[] = [
    { id: 'all', key: 'all' },
    { id: 'news', key: 'news' },
    { id: 'blog', key: 'blog' },
    { id: 'ai', key: 'ai' },
    { id: 'cybersecurity', key: 'cybersecurity' },
    { id: 'tutorials', key: 'tutorials' },
    { id: 'forum', key: 'forum' },
    { id: 'projects', key: 'projects' },
    { id: 'infrastructure', key: 'infrastructure' },
];

export function CategoryNav({
    selectedCategory,
    onSelectCategory,
    bare = false,
}: CategoryNavProps) {
    const t = useTranslations('Nav');

    return (
        <nav aria-label={t('all')} className={bare ? 'w-full' : 'w-fit max-w-full'}>
            <div
                className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none ${bare
                        ? 'w-full justify-center py-0.5'
                        : 'p-1.5 rounded-2xl glass-concave-panel w-fit max-w-full'
                    }`}
            >
                {SOFTWARE_CATEGORY_KEYS.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const href = CATEGORY_ROUTES[cat.id];

                    return (
                        <Link
                            key={cat.id}
                            href={href}
                            onClick={(e) => {
                                if (onSelectCategory) {
                                    e.preventDefault();
                                    onSelectCategory(cat.id);
                                }
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${isSelected
                                    ? 'glass-convex-panel text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                        >
                            <span>{t(cat.key as any)}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

