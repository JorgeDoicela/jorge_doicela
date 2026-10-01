'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DoiceladevSelect, type SelectOption } from '../../../shared/ui';

export type DoiceladevSection =
    | 'all'
    | 'tutorials'
    | 'news'
    | 'ai'
    | 'cybersecurity'
    | 'infrastructure'
    | 'projects'
    | 'blog'
    | 'forum';

interface CategoryNavProps {
    selectedCategory: DoiceladevSection;
    onSelectCategory?: (cat: DoiceladevSection) => void;
    bare?: boolean;
}

export const CATEGORY_ROUTES: Record<DoiceladevSection, string> = {
    all: '/',
    tutorials: '/tutorials',
    news: '/news',
    ai: '/ai',
    cybersecurity: '/cybersecurity',
    infrastructure: '/infrastructure',
    projects: '/projects',
    blog: '/blog',
    forum: '/forum',
};

export const DOICELADEV_CATEGORY_KEYS: { id: DoiceladevSection; key: DoiceladevSection }[] = [
    { id: 'all', key: 'all' },
    { id: 'tutorials', key: 'tutorials' },
    { id: 'news', key: 'news' },
    { id: 'ai', key: 'ai' },
    { id: 'cybersecurity', key: 'cybersecurity' },
    { id: 'infrastructure', key: 'infrastructure' },
    { id: 'projects', key: 'projects' },
    { id: 'blog', key: 'blog' },
    { id: 'forum', key: 'forum' },
];

export function CategoryNav({
    selectedCategory,
    onSelectCategory,
    bare = false,
}: CategoryNavProps) {
    const t = useTranslations('Nav');
    const router = useRouter();

    const categoryOptions: SelectOption<DoiceladevSection>[] = React.useMemo(() => {
        return DOICELADEV_CATEGORY_KEYS.map((cat) => ({
            value: cat.id,
            label: t(cat.key),
        }));
    }, [t]);

    const handleSelectCategory = (nextCat: DoiceladevSection) => {
        if (onSelectCategory) {
            onSelectCategory(nextCat);
        } else {
            router.push(CATEGORY_ROUTES[nextCat]);
        }
    };

    return (
        <nav aria-label={t('all')} className={bare ? 'w-full' : 'w-fit max-w-full'}>
            {/* 1. Selector Dropdown Táctil Reutilizable (Exclusivo para Móvil: visible en < sm, oculto en sm y superior) */}
            <div className="sm:hidden w-full max-w-[185px] mx-auto flex justify-center">
                <DoiceladevSelect<DoiceladevSection>
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={handleSelectCategory}
                    ariaLabel={t('all')}
                    align="center"
                    className="w-full"
                />
            </div>

            {/* 2. Pestañas Horizontales Estándar (Exclusivo para Escritorio / PC: oculto en móvil, visible en sm:) */}
            <div
                className={`hidden sm:flex items-center gap-1.5 overflow-x-auto scrollbar-none ${bare
                        ? 'w-full justify-center py-0.5'
                        : 'p-1.5 rounded-2xl glass-concave-panel w-fit max-w-full'
                    }`}
            >
                {DOICELADEV_CATEGORY_KEYS.map((cat) => {
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
                            <span>{t(cat.key)}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
