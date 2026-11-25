'use client';

import React from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExperienceTimelineSection } from './ExperienceTimelineSection';
import type { PortfolioExperienceItem } from '../types';

interface ExperienceDetailViewProps {
  items: PortfolioExperienceItem[];
}

export function ExperienceDetailView({ items }: ExperienceDetailViewProps) {
  const tExp = useTranslations('Experience');

  const workItems = items.filter((item) => item.type === 'work');
  const eduItems = items.filter((item) => item.type === 'education');

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      <ExperienceTimelineSection
        title={tExp('title')}
        icon={<Briefcase className="w-4 h-4 text-gold-400" />}
        items={workItems}
        highlightsLabel={tExp('highlightsLabel')}
        stackUsedLabel={tExp('stackUsedLabel')}
      />

      <ExperienceTimelineSection
        title={tExp('eduTitle')}
        icon={<GraduationCap className="w-4 h-4 text-gold-400" />}
        items={eduItems}
        stackUsedLabel={tExp('stackUsedLabel')}
      />
    </div>
  );
}
