'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ForumTopic } from '../types';
import { DoiceladevCard } from '../../../shared/ui/DoiceladevCard';

export interface TopicCardProps {
    topic: ForumTopic;
    priority?: boolean;
}

export function TopicCard({ topic, priority = false }: TopicCardProps) {
    const tNav = useTranslations('Nav');
    const tFilters = useTranslations('Filters');

    const moduleLabel = tNav('forum');
    const catKey = topic.category?.toLowerCase() || '';
    const catLabel = catKey
        ? (tFilters.has(catKey as never) ? tFilters(catKey as never) : catKey.replace(/_/g, ' '))
        : '';
    const metaText = catLabel ? `${moduleLabel} • ${catLabel}` : moduleLabel;

    return (
        <DoiceladevCard
            href={`/forum/${topic.slug}`}
            title={topic.title}
            category="forum"
            coverImage={topic.coverImage}
            categoryMeta={metaText}
            topicCategory={topic.category}
            excerpt={topic.excerpt || topic.content}
            priority={priority}
            accentHoverColor="group-hover:text-purple-300"
        />
    );
}
