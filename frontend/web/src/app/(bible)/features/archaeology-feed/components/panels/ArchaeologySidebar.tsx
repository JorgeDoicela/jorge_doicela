'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Scroll,
  X,
  Layers,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { ArticleCategory, GeographicRegion } from '../../types';
import { useArchaeologyContextSafe } from '../../context/ArchaeologyContext';
import { StudySidePanel } from '../../../../shared/ui';

interface ArchaeologySidebarProps {
  selectedCategory?: ArticleCategory | 'all';
  onSelectCategory?: (category: ArticleCategory | 'all') => void;
  selectedRegion?: GeographicRegion;
  onSelectRegion?: (region: GeographicRegion) => void;
}

export const ArchaeologySidebar: React.FC<ArchaeologySidebarProps> = ({
  selectedCategory: propCategory,
  onSelectCategory: propOnSelectCategory,
  selectedRegion: propRegion,
  onSelectRegion: propOnSelectRegion,
}) => {
  const passageContext = useBiblePassageSafe();
  const archContext = useArchaeologyContextSafe();
  const tStudio = useTranslations('Studio');

  const selectedCategory = propCategory ?? archContext?.selectedCategory ?? 'all';
  const onSelectCategory = propOnSelectCategory ?? archContext?.setSelectedCategory ?? (() => {});
  const selectedRegion = propRegion ?? archContext?.selectedRegion ?? 'all';
  const onSelectRegion = propOnSelectRegion ?? archContext?.setSelectedRegion ?? (() => {});
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  const [activeTab, setActiveTab] = useState<'categories' | 'regions'>('categories');

  const categories: { id: ArticleCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }>; count: string }[] = [
    { id: 'all', label: 'Todos los Registros', icon: Layers, count: 'Total' },
    { id: 'recent_discoveries', label: 'Excavaciones Recientes', icon: Compass, count: 'Nuevos' },
    { id: 'manuscripts_epigraphy', label: 'Manuscritos y Epigrafía', icon: Scroll, count: 'Rollos' },
    { id: 'apologetics_reliability', label: 'Confiabilidad Histórica', icon: ShieldCheck, count: 'Defensa' },
  ];

  const regions: { id: GeographicRegion; label: string; location: string }[] = [
    { id: 'all', label: 'Todas las Regiones', location: 'Creciente Fértil' },
    { id: 'jerusalem_judea', label: 'Jerusalén y Judea', location: 'Ciudad de David, Ofel' },
    { id: 'galilee_samaria', label: 'Galilea y Samaria', location: 'Hazor, Meguido, Capernaúm' },
    { id: 'jordan_dead_sea', label: 'Jordán y Mar Muerto', location: 'Qumrán, Masada' },
    { id: 'egypt_sinai', label: 'Egipto y Sinaí', location: 'Delta, Tell el-Daba' },
    { id: 'turkey_asia_minor', label: 'Turquía y Asia Menor', location: 'Éfeso, Pérgamo, Antioquía' },
    { id: 'greece_rome', label: 'Grecia y Roma', location: 'Corinto, Atenas, Catacumbas' },
  ];

  return (
    <StudySidePanel
      side="left"
      title="Arqueología y Evidencias"
      icon={<Compass className="w-4 h-4 text-emerald-500" />}
      storageKey="bible_archaeology_sidebar_w"
      defaultWidth={320}
      collapseTitle={tStudio('closeSidebar') || 'Ocultar panel'}
    >
      {/* Barra de Pestañas del Panel de Arqueología */}
      <StudySidePanel.Toolbar>
        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
              activeTab === 'categories'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span>Categorías</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('regions')}
            className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
              activeTab === 'regions'
                ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <span>Regiones</span>
          </button>
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll */}
      <StudySidePanel.Body className="p-3 space-y-2">
          {activeTab === 'categories' && (
            <div className="space-y-1.5">
              <div className="px-1 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Filtrar por Tipo de Hallazgo
                </span>
              </div>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory?.(cat.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        handleClose();
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400 dark:hover:border-emerald-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : 'text-zinc-400 group-hover:text-emerald-500'} transition-colors`} />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'regions' && (
            <div className="space-y-1.5">
              <div className="px-1 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Filtrar por Cuenca y Región Geográfica
                </span>
              </div>
              {regions.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      onSelectRegion?.(reg.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        handleClose();
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 group ${
                      isSelected
                        ? 'border-blue-500/80 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-blue-400 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        {reg.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 pl-4.5">
                      {reg.location}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
