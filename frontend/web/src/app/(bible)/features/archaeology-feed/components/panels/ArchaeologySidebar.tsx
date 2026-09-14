'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Compass,
  FileText,
  MapPin,
  ShieldCheck,
  Sparkles,
  Scroll,
  X,
  Layers,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';
import { ArticleCategory, GeographicRegion } from '../../types';

interface ArchaeologySidebarProps {
  selectedCategory?: ArticleCategory | 'all';
  onSelectCategory?: (category: ArticleCategory | 'all') => void;
  selectedRegion?: GeographicRegion;
  onSelectRegion?: (region: GeographicRegion) => void;
}

export const ArchaeologySidebar: React.FC<ArchaeologySidebarProps> = ({
  selectedCategory = 'all',
  onSelectCategory,
  selectedRegion = 'all',
  onSelectRegion,
}) => {
  const passageContext = useBiblePassageSafe();
  const tStudio = useTranslations('Studio');

  const [activeTab, setActiveTab] = useState<'categories' | 'regions'>('categories');

  const isOpen = passageContext?.isLeftSidebarOpen ?? true;
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Todos los Registros', icon: Layers, count: 'Total' },
    { id: 'recent_discoveries', label: 'Excavaciones Recientes', icon: Compass, count: 'Nuevos' },
    { id: 'manuscripts_epigraphy', label: 'Manuscritos y Epigrafía', icon: Scroll, count: 'Rollos' },
    { id: 'apologetics_reliability', label: 'Confiabilidad Histórica', icon: ShieldCheck, count: 'Defensa' },
  ] as const;

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
    <>
      {/* Cortina oscura en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Filtros de Arqueología Bíblica"
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
            <Compass className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Arqueología y Evidencias
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Pestañas del Panel de Arqueología */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
                activeTab === 'categories'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Categorías</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('regions')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center gap-1.5 ${
                activeTab === 'regions'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Regiones</span>
            </button>
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                      onSelectCategory?.(cat.id as any);
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
        </div>
      </aside>
    </>
  );
};
