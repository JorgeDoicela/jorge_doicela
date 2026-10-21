'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Columns3,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { useKartexPassageSafe } from '../../../../entities/passage';
import { useParallelContextSafe, PARALLEL_PRESETS } from '../../context/ParallelContext';
import { StudySidePanel } from '../../../../shared/ui';

export const ParallelSidebar: React.FC = () => {
  const passageContext = useKartexPassageSafe();
  const parallel = useParallelContextSafe();
  const tStudio = useTranslations('Studio');
  const tParallel = useTranslations('Parallel');

  const translations = passageContext?.translations ?? [];
  const selectedBook = passageContext?.selectedBook;
  const selectedChapter = passageContext?.selectedChapter ?? 1;

  const activeColumns = parallel?.columns ?? [];
  const activeTranslationIds = new Set(activeColumns.map((c) => c.translationId));

  const availableToAdd = translations.filter((t) => !activeTranslationIds.has(t.id));

  return (
    <StudySidePanel
      side="left"
      title={tParallel('sidebarTitle') || 'Cotejo Paralelo'}
      icon={<Columns3 className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />}
      storageKey="kartex_parallel_sidebar_w"
      defaultWidth={340}
      collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
    >
      {/* Cabecera Desktop del Panel Especializado */}
      <StudySidePanel.Toolbar className="hidden lg:flex items-center justify-between p-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {tParallel('sidebarTitle') || 'Cotejo Paralelo'}
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {tParallel('columnsSynced', { count: activeColumns.length })}
          </p>
        </div>
      </StudySidePanel.Toolbar>

      {/* Contenido con Scroll Independiente */}
      <StudySidePanel.Body className="space-y-6">
          {/* SECCIÓN 1: PRESETS RÁPIDOS DE COTEJO */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {tParallel('presetsTitle')}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {PARALLEL_PRESETS.map((preset) => {
                const isActive = parallel?.activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => parallel?.applyPreset(preset.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accents-2 text-foreground font-semibold'
                        : 'text-accents-6 hover:bg-accents-1 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {preset.name}
                        {isActive && <Check className="w-3.5 h-3.5 text-foreground" />}
                      </span>
                      <span className="text-[10px] font-mono text-accents-4 font-medium">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-accents-5 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECCIÓN 2: GESTOR DE COLUMNAS ACTIVAS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
                {tParallel('columnsOnCanvas', { count: activeColumns.length })}
              </span>
            </div>

            <div className="space-y-1.5">
              {activeColumns.map((col, index) => {
                const trans = translations.find((t) => t.id === col.translationId);
                return (
                  <div
                    key={col.id}
                    className="p-2.5 rounded-xl border border-border bg-inner-card flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-accents-2 border border-border flex items-center justify-center text-[10px] font-mono text-foreground font-bold shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-foreground">
                            {trans?.abbreviation || `ID ${col.translationId}`}
                          </span>
                          <span className="text-[10px] text-accents-4 uppercase font-mono">
                            ({trans?.language || 'es'})
                          </span>
                        </div>
                        <p className="text-[11px] text-accents-5 truncate">
                          {trans?.name || tParallel('translationFallback')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {activeColumns.length > 2 && (
                        <button
                          type="button"
                          onClick={() => parallel?.removeColumn(col.id)}
                          className="p-1.5 rounded-lg text-accents-4 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title={tParallel('removeColumnTooltip')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AÑADIR NUEVA VERSIÓN */}
            {activeColumns.length < 4 && availableToAdd.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accents-4 block mb-2">
                  {tParallel('addToCanvas')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableToAdd.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => parallel?.addColumn(tr.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-border hover:border-accents-5 bg-inner-card text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-accents-4" />
                      <span>{tr.abbreviation}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 3: PASAJE ACTIVO Y NAVEGACIÓN RÁPIDA */}
          <div className="pt-2 border-t border-border space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-accents-4">
              {tParallel('syncedPassage')}
            </span>

            <div className="p-3 rounded-xl border border-border bg-inner-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {selectedBook?.name || tParallel('genesisFallback')} {selectedChapter}
                </span>
                <span className="text-[10px] font-mono text-accents-5">
                  {selectedBook?.testament === 'NT' ? tStudio('newTestament') : tStudio('oldTestament')}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => passageContext?.prevChapter()}
                  disabled={selectedChapter <= 1}
                  className="flex-1 py-1 text-xs font-medium rounded-lg border border-border bg-card-bg hover:bg-accents-1 disabled:opacity-40 transition-colors cursor-pointer text-center text-foreground"
                >
                  {tParallel('prevChapterShort')}
                </button>
                <button
                  type="button"
                  onClick={() => passageContext?.nextChapter()}
                  className="flex-1 py-1 text-xs font-medium rounded-lg border border-border bg-card-bg hover:bg-accents-1 transition-colors cursor-pointer text-center text-foreground"
                >
                  {tParallel('nextChapterShort')}
                </button>
              </div>
            </div>
          </div>
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
