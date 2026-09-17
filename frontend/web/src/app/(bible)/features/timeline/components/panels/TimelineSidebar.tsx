'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Clock,
  Crown,
  ScrollText,
  Globe,
  Sparkles,
  X,
  Calendar,
  Layers,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useBiblicalTimeline } from '../../hooks/useBiblicalTimeline';

export const TimelineSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const timeline = useBiblicalTimeline();
  const tStudio = useTranslations('Studio');

  const [activeTab, setActiveTab] = useState<'eras' | 'tracks'>('eras');

  const isOpen = passageContext?.isLeftSidebarOpen ?? true;
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  if (!isOpen) return null;

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
    { id: 'kings_judah', label: 'Reyes de Judá', icon: Crown, color: 'text-amber-500' },
    { id: 'kings_israel', label: 'Reyes de Israel', icon: Crown, color: 'text-blue-500' },
    { id: 'prophets', label: 'Profetas Bíblicos', icon: ScrollText, color: 'text-emerald-500' },
    { id: 'empires', label: 'Imperios Mundiales', icon: Globe, color: 'text-purple-500' },
    { id: 'milestones', label: 'Hitos Arqueológicos', icon: Sparkles, color: 'text-rose-500' },
  ] as const;

  return (
    <>
      {/* Cortina oscura en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Navegación de la Cronología Sincrónica"
        className="fixed inset-y-0 left-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-84 xl:w-92 flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden"
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio Derecho (Estilo DIITRA) */}
        <div
          className="hidden lg:flex absolute top-0 -right-3 w-6 h-full cursor-pointer z-30 group/border items-center justify-center select-none"
          onClick={handleClose}
          title={tStudio('closeSidebar') || 'Ocultar panel'}
        >
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover/border:bg-zinc-400 dark:group-hover/border:bg-zinc-500 transition-colors duration-150" />
          <div className="relative z-10 w-6 h-7 rounded-md bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-700 shadow-sm opacity-0 group-hover/border:opacity-100 hover:scale-110 hover:border-zinc-500 dark:hover:border-zinc-400 transition-all duration-150 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">
            <svg
              className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-200"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="2" x2="8" y2="14" />
              <polyline points="4 6 1 8 4 10" />
              <polyline points="12 6 15 8 12 10" />
            </svg>
          </div>
        </div>

        {/* Cabecera Móvil */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Cronología Sincrónica
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Pestañas del Panel de Cronología */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('eras')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
                activeTab === 'eras'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Épocas Bíblicas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tracks')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
                activeTab === 'tracks'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Líneas Históricas</span>
            </button>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                      handleClose();
                    }
                  }}
                  className="w-full text-left p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer flex flex-col gap-0.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
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
            <div className="space-y-2">
              <div className="px-1 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Alternar Carriles Sincrónicos
                </span>
              </div>
              {tracks.map((track) => {
                const isVisible = timeline.visibleTracks[track.id as keyof typeof timeline.visibleTracks];
                const Icon = track.icon;
                return (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => timeline.toggleTrack(track.id as any)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isVisible
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 opacity-60'
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
        </div>
      </aside>
    </>
  );
};
