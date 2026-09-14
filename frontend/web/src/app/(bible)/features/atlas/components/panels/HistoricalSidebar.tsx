'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Clock,
  Compass,
  Search,
  X,
  Sparkles,
  Mountain,
  Waves,
  Landmark,
  Layers,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../context/BiblePassageContext';
import { useAtlasContextSafe } from '../../context/AtlasContext';
import { HistoricalEra, PlaceCategory } from '../../types';

export const HistoricalSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const atlas = useAtlasContextSafe();
  const searchParams = useSearchParams();
  const tStudio = useTranslations('Studio');
  const tAtlas = useTranslations('Atlas');

  const urlSubTab = searchParams?.get('tab');
  const getInitialTab = (): 'places' | 'eras' | 'categories' => {
    if (urlSubTab === 'timeline') return 'eras';
    if (urlSubTab === 'archaeology') return 'categories';
    return 'places';
  };

  const [activeTab, setActiveTab] = useState<'places' | 'eras' | 'categories'>(getInitialTab);

  useEffect(() => {
    if (urlSubTab === 'timeline') {
      setActiveTab('eras');
    } else if (urlSubTab === 'archaeology') {
      setActiveTab('categories');
    }
  }, [urlSubTab]);

  const isOpen = passageContext?.isLeftSidebarOpen ?? true;
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  if (!isOpen) return null;

  const eras: { id: HistoricalEra; label: string; range: string }[] = [
    { id: 'all', label: 'Todas las Épocas', range: 'Cánon Completo' },
    { id: 'patriarchs', label: 'Patriarcas', range: 'c. 2000 - 1500 a.C.' },
    { id: 'exodus_conquest', label: 'Éxodo & Conquista', range: 'c. 1445 - 1375 a.C.' },
    { id: 'monarchy', label: 'Monarquía de Israel', range: 'c. 1050 - 586 a.C.' },
    { id: 'exile_restoration', label: 'Exilio & Restauración', range: 'c. 586 - 400 a.C.' },
    { id: 'second_temple', label: 'Segundo Templo & Evangelios', range: 'c. 4 a.C. - 30 d.C.' },
    { id: 'apostolic', label: 'Época Apostólica', range: 'c. 30 - 100 d.C.' },
  ];

  const categories: { id: PlaceCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'Todos los Lugares', icon: Layers },
    { id: 'city', label: 'Ciudades', icon: Landmark },
    { id: 'mountain', label: 'Montes & Cerros', icon: Mountain },
    { id: 'water', label: 'Ríos & Mares', icon: Waves },
    { id: 'archaeological_site', label: 'Yacimientos', icon: MapPin },
  ];

  const places = atlas?.filteredPlaces || [];

  return (
    <>
      {/* Backdrop en Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Panel de Exploración Histórica y Geográfica"
        className="fixed inset-y-0 left-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-72 sm:w-80 flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden"
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio estilo DIITRA */}
        <div
          className="hidden lg:flex absolute top-0 -right-3 w-6 h-full cursor-pointer z-30 group/border items-center justify-center select-none"
          onClick={handleClose}
          title={tStudio('collapseSidebar') || 'Ocultar panel'}
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
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              Atlas & Arqueología
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Pestañas Geist */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100/80 dark:bg-zinc-900/80">
            <button
              type="button"
              onClick={() => setActiveTab('places')}
              className={`py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'places'
                  ? 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Lugares</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('eras')}
              className={`py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'eras'
                  ? 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Épocas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Tipos</span>
            </button>
          </div>
        </div>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* SUB-PESTAÑA 1: LUGARES BÍBLICOS */}
          {activeTab === 'places' && (
            <div className="space-y-2">
              {/* Buscador de Lugares */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={atlas?.searchQuery || ''}
                  onChange={(e) => atlas?.setSearchQuery(e.target.value)}
                  placeholder="Buscar lugar (ej. Jerusalén)..."
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                />
                {atlas?.searchQuery && (
                  <button
                    type="button"
                    onClick={() => atlas?.setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Conteo de Lugares */}
              <div className="px-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>{places.length} lugares encontrados</span>
                {atlas?.activeEra !== 'all' && (
                  <span className="text-amber-500 font-semibold">Filtro de época activo</span>
                )}
              </div>

              {/* Lista de Lugares */}
              <div className="space-y-1">
                {places.map((p) => {
                  const isSelected = atlas?.selectedPlaceId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        atlas?.focusOnPlace(p);
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                          handleClose();
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                          : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate leading-tight">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                          {p.modernName || p.country || 'Oriente Próximo'}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono shrink-0 px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase">
                        {p.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUB-PESTAÑA 2: ÉPOCAS BÍBLICAS */}
          {activeTab === 'eras' && (
            <div className="space-y-1.5">
              <div className="px-1 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Filtrar Mapa por Época Histórica
                </span>
              </div>
              {eras.map((era) => {
                const isSelected = (atlas?.activeEra || 'all') === era.id;
                return (
                  <button
                    key={era.id}
                    type="button"
                    onClick={() => atlas?.setActiveEra(era.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{era.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {era.range}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* SUB-PESTAÑA 3: TIPOS Y CATEGORÍAS */}
          {activeTab === 'categories' && (
            <div className="space-y-1.5">
              <div className="px-1 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Filtrar por Tipo Geográfico
                </span>
              </div>
              {categories.map((cat) => {
                const isSelected = (atlas?.selectedCategory || 'all') === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => atlas?.setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      <span className="text-xs font-medium">{cat.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
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
