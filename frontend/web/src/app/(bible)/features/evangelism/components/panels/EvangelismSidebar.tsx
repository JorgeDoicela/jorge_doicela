'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Compass,
  ShieldAlert,
  FileText,
  Search,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useEvangelismContextSafe } from '../../context/EvangelismContext';
import { EvangelismTab } from '../../types';
import { StudySidePanel } from '../../../../shared/ui';

export const EvangelismSidebar: React.FC = () => {
  const pathname = usePathname() || '';
  const evangelism = useEvangelismContextSafe();
  const t = useTranslations('Evangelism');
  const tStudio = useTranslations('Studio');

  const activeTab = evangelism?.activeTab ?? 'pathways';
  const setActiveTab = evangelism?.setActiveTab ?? (() => {});

  React.useEffect(() => {
    if (pathname.includes('/objections')) {
      setActiveTab('objections');
    } else if (pathname.includes('/tracts')) {
      setActiveTab('tracts');
    } else if (pathname.includes('/pathways')) {
      setActiveTab('pathways');
    }
  }, [pathname, setActiveTab]);

  const tabs: { key: EvangelismTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'pathways', label: 'Rutas', icon: Compass },
    { key: 'objections', label: 'Objeciones', icon: ShieldAlert },
    { key: 'tracts', label: 'Tratados', icon: FileText },
  ];

  return (
    <StudySidePanel
      side="left"
      title="Ministerio & Apologética"
      icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
      storageKey="bible_evangelism_sidebar_w"
      defaultWidth={320}
      collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
    >
      {/* Selector de Pestañas Geist Segmented Control */}
      <StudySidePanel.Toolbar>
        <div className="grid grid-cols-3 rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100/80 dark:bg-zinc-900/80">
          {tabs.map((t) => {
            const active = activeTab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-semibold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido Dinámico según la Pestaña Activa */}
      <StudySidePanel.Body className="p-3 space-y-2">
          {/* Herramienta 1: Rutas de Evangelismo */}
          {activeTab === 'pathways' && (
            <div className="space-y-1.5">
              <div className="px-1 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Rutas Bíblicas Secuenciales ({evangelism?.pathways.length || 0})
                </span>
              </div>
              {evangelism?.pathways.map((pathway) => {
                const isSelected = pathway.id === evangelism.selectedPathway?.id;
                return (
                  <button
                    key={pathway.id}
                    type="button"
                    onClick={() => evangelism.setSelectedPathwayId(pathway.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold leading-tight line-clamp-1">
                        {pathway.title}
                      </span>
                      <span className="text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {pathway.steps.length} pasos
                      </span>
                    </div>
                    {pathway.theologicalFocus && (
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 font-mono">
                        {pathway.theologicalFocus}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Herramienta 2: Objeciones Apologéticas */}
          {activeTab === 'objections' && (
            <div className="space-y-3">
              {/* Buscador de Objeciones */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={evangelism?.searchQuery || ''}
                  onChange={(e) => evangelism?.setSearchQuery(e.target.value)}
                  placeholder="Buscar objeción o duda..."
                  className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                />
                {evangelism?.searchQuery && (
                  <button
                    type="button"
                    onClick={() => evangelism?.setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Lista de Categorías */}
              <div className="space-y-1">
                {['all', 'existencia_de_dios', 'confiabilidad_biblia', 'sufrimiento_y_mal', 'exclusividad_cristo'].map((cat) => {
                  const isSelected = (evangelism?.selectedCategory || 'all') === cat;
                  const catLabels: Record<string, string> = {
                    all: 'Todas las Objeciones',
                    existencia_de_dios: 'Existencia de Dios',
                    confiabilidad_biblia: 'Confiabilidad Bíblica',
                    sufrimiento_y_mal: 'El Problema del Mal',
                    exclusividad_cristo: 'Exclusividad de Cristo',
                  };
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => evangelism?.setSelectedCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900'
                      }`}
                    >
                      <span className="truncate">{catLabels[cat] || cat}</span>
                      <ChevronRight className="w-3 h-3 text-zinc-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Herramienta 3: Tratados & Bosquejos */}
          {activeTab === 'tracts' && (
            <div className="space-y-1.5">
              <div className="px-1 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Tratados para Compartir ({evangelism?.tracts.length || 0})
                </span>
              </div>
              {evangelism?.tracts.map((tract) => {
                const isSelected = tract.id === evangelism.selectedTract?.id;
                return (
                  <button
                    key={tract.id}
                    type="button"
                    onClick={() => evangelism.setSelectedTractId(tract.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold leading-tight line-clamp-1">
                        {tract.title}
                      </span>
                    </div>
                    {tract.targetAudience && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                        Audiencia: {tract.targetAudience}
                      </span>
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
