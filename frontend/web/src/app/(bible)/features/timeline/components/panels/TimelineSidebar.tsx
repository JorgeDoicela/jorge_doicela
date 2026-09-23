'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Clock,
  Crown,
  ScrollText,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useTimelineContextSafe } from '../../context/TimelineContext';
import { useBiblicalTimeline } from '../../hooks/useBiblicalTimeline';
import { StudySidePanel } from '../../../../shared/ui';

export const TimelineSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const timelineContext = useTimelineContextSafe();
  const localTimeline = useBiblicalTimeline();
  const timeline = timelineContext || localTimeline;
  const tStudio = useTranslations('Studio');

  const [activeTab, setActiveTab] = useState<'eras' | 'tracks'>('eras');

  const eras = [
    { id: 'all', label: 'Toda la Cronología', range: 'c. 2000 a.C. - 100 d.C.', year: 1000 },
    { id: 'patriarchs', label: 'Patriarcas y Orígenes', range: 'c. 2000 - 1500 a.C.', year: 1800 },
    { id: 'exodus', label: 'Éxodo y Conquista', range: 'c. 1445 - 1375 a.C.', year: 1400 },
    { id: 'monarchy_united', label: 'Monarquía Unida (Saúl, David, Salomón)', range: 'c. 1050 - 930 a.C.', year: 1000 },
    { id: 'monarchy_divided', label: 'Monarquía Dividida (Judá e Israel)', range: 'c. 930 - 586 a.C.', year: 750 },
    { id: 'exile', label: 'Exilio en Babilonia', range: 'c. 586 - 538 a.C.', year: 560 },
    { id: 'second_temple', label: 'Segundo Templo y Período Intertestamentario', range: 'c. 538 - 4 a.C.', year: 400 },
    { id: 'new_testament', label: 'Ministerio de Jesús y Época Apostólica', range: 'c. 4 a.C. - 100 d.C.', year: 30 },
  ];

  const tracks = [
    { id: 'judah' as const, label: 'Reyes de Judá', icon: Crown, color: 'text-amber-500' },
    { id: 'israel' as const, label: 'Reyes de Israel', icon: Crown, color: 'text-blue-500' },
    { id: 'prophets' as const, label: 'Profetas Bíblicos', icon: ScrollText, color: 'text-emerald-500' },
    { id: 'empires' as const, label: 'Imperios Mundiales', icon: Globe, color: 'text-purple-500' },
    { id: 'milestones' as const, label: 'Hitos Arqueológicos', icon: Sparkles, color: 'text-rose-500' },
  ];

  return (
    <StudySidePanel
      side="left"
      title="Cronología Sincrónica"
      icon={<Clock className="w-4 h-4 text-amber-500" />}
      storageKey="bible_timeline_sidebar_w"
      defaultWidth={340}
      collapseTitle={tStudio('closeSidebar') || 'Ocultar panel'}
    >
      {/* Barra de Pestañas del Panel de Cronología */}
      <StudySidePanel.Toolbar>
        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('eras')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
              activeTab === 'eras'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span>Épocas Bíblicas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracks')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
              activeTab === 'tracks'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span>Líneas Históricas</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll */}
      <StudySidePanel.Body className="p-3 space-y-2">
        {activeTab === 'eras' && (
          <div className="space-y-1.5">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Saltar a Época Histórica en la Cinta
              </span>
            </div>
            {eras.map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => {
                  timeline.handleJumpToEra(era.year);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    passageContext?.toggleLeftSidebar();
                  }
                }}
                className="w-full text-left p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer flex flex-col gap-0.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    {era.label}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {era.year > 0 ? `${era.year} a.C.` : `${Math.abs(era.year)} d.C.`}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                  {era.range}
                </span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="space-y-1.5">
            <div className="px-1 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Líneas de Tiempo Visibles
              </span>
            </div>
            {tracks.map((track) => {
              const Icon = track.icon;
              const isVisible = Boolean(timeline.visibleTracks[track.id]);
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => timeline.toggleTrack(track.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isVisible
                      ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-zinc-100 shadow-xs'
                      : 'border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-400 dark:text-zinc-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${track.color}`} />
                    <span className="text-xs">{track.label}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${isVisible ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                </button>
              );
            })}
          </div>
        )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
