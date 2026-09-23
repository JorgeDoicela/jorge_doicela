'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  MapPin,
  Compass,
  Search,
  X,
  Sparkles,
  Mountain,
  Waves,
  Landmark,
  Layers,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useAtlasContextSafe } from '../../context/AtlasContext';
import { HistoricalEra, PlaceCategory } from '../../types';
import { StudySidePanel } from '../../../../shared/ui';

export const AtlasSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const atlas = useAtlasContextSafe();
  const tStudio = useTranslations('Studio');
  const tAtlas = useTranslations('Atlas');

  const [activeTab, setActiveTab] = useState<'places' | 'eras' | 'categories'>('places');

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
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  return (
    <StudySidePanel
      side="left"
      title="Atlas Bíblico WGS84"
      icon={<Compass className="w-4 h-4 text-rose-500" />}
      storageKey="bible_atlas_sidebar_w"
      defaultWidth={340}
      collapseTitle={tStudio('closeSidebar') || 'Ocultar panel'}
    >
      {/* Barra de Sub-Pestañas del Atlas */}
      <StudySidePanel.Toolbar className="space-y-2.5">
          <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('places')}
              className={`py-1.5 px-2 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
                activeTab === 'places'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <span>Lugares</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('eras')}
              className={`py-1.5 px-2 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
                activeTab === 'eras'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <span>Épocas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`py-1.5 px-2 rounded-md transition-all cursor-pointer font-medium flex items-center justify-center ${
                activeTab === 'categories'
                  ? 'bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <span>Tipos</span>
            </button>
          </div>

          {/* Buscador reactivo rápido */}
          {activeTab === 'places' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={atlas?.searchQuery || ''}
                onChange={(e) => atlas?.setSearchQuery(e.target.value)}
                placeholder="Buscar lugar bíblico o moderno..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-rose-500 transition-colors"
              />
              {atlas?.searchQuery && (
                <button
                  type="button"
                  onClick={() => atlas?.setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll de la Pestaña Activa */}
      <StudySidePanel.Body className="p-3 space-y-2">
          {/* SUB-PESTAÑA 1: LUGARES BÍBLICOS */}
          {activeTab === 'places' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                <span>{places.length} ubicaciones</span>
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
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
