'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tutorial } from '../types';
import { TutorialCard } from './TutorialCard';
import { DoiceladevCardSkeleton } from '../../../shared/ui/DoiceladevCardSkeleton';

interface TutorialGridProps {
    tutorials: Tutorial[];
    loading: boolean;
    error: string | null;
}

export function TutorialGrid({ tutorials, loading, error }: TutorialGridProps) {
    const t = useTranslations('Tutorials');

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <DoiceladevCardSkeleton key={idx} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-8 rounded-3xl glass-concave-panel text-center text-rose-400">
                <p className="text-sm font-medium">{error}</p>
            </div>
        );
    }

    if (!tutorials || tutorials.length === 0) {
        return (
            <div className="w-full p-12 rounded-3xl glass-concave-panel text-center text-zinc-500">
                <p className="text-base font-medium">{t('empty')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {tutorials.map((tut, idx) => (
                <TutorialCard key={tut.id} tutorial={tut} priority={idx < 3} />
            ))}
        </div>
    );
}
