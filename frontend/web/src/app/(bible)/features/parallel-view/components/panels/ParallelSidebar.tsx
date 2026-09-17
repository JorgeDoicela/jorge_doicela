'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Columns3,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  ChevronRight,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useParallelContextSafe, PARALLEL_PRESETS } from '../../context/ParallelContext';

export const ParallelSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const parallel = useParallelContextSafe();
  const tStudio = useTranslations('Studio');
  const tParallel = useTranslations('Parallel');

  const isOpen = passageContext?.isLeftSidebarOpen ?? true;
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  if (!isOpen) return null;

  const translations = passageContext?.translations ?? [];
  const selectedBook = passageContext?.selectedBook;
  const selectedChapter = passageContext?.selectedChapter ?? 1;

  const activeColumns = parallel?.columns ?? [];
  const activeTranslationIds = new Set(activeColumns.map((c) => c.translationId));

  const availableToAdd = translations.filter((t) => !activeTranslationIds.has(t.id));

  return (
    <>
      {/* Backdrop en Pantallas Pequeñas (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Panel Lateral de Vista Paralela"
        className="fixed inset-y-0 left-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-88 xl:w-96 flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden"
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio Derecho (Estilo DIITRA) */}
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

        {/* Cabecera del Panel Especializado */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-foreground">
              <Columns3 className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Cotejo Paralelo
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {activeColumns.length} columnas sincronizadas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenido con Scroll Independiente */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* SECCIÓN 1: PRESETS RÁPIDOS DE COTEJO */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Presets de Comparación
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {PARALLEL_PRESETS.map((preset) => {
                const isActive = parallel?.activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => parallel?.applyPreset(preset.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-100/90 dark:bg-zinc-900/90 border-zinc-400 dark:border-zinc-600 shadow-xs'
                        : 'bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        {preset.name}
                        {isActive && <Check className="w-3.5 h-3.5 text-foreground" />}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
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
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Columnas en el Lienzo ({activeColumns.length}/4)
              </span>
            </div>

            <div className="space-y-2">
              {activeColumns.map((col, index) => {
                const trans = translations.find((t) => t.id === col.translationId);
                return (
                  <div
                    key={col.id}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-500 font-bold shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold font-mono text-foreground">
                            {trans?.abbreviation || `ID ${col.translationId}`}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">
                            ({trans?.language || 'es'})
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {trans?.name || 'Traducción'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {activeColumns.length > 2 && (
                        <button
                          type="button"
                          onClick={() => parallel?.removeColumn(col.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Remover columna"
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
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  Añadir al lienzo:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableToAdd.map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => parallel?.addColumn(tr.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-foreground bg-zinc-50 dark:bg-zinc-900/60 text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-zinc-400" />
                      <span>{tr.abbreviation}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN 3: PASAJE ACTIVO Y NAVEGACIÓN RÁPIDA */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Pasaje Sincronizado
            </span>

            <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {selectedBook?.name || 'Génesis'} {selectedChapter}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {selectedBook?.testament === 'NT' ? 'Nuevo Testamento' : 'Antiguo Testamento'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => passageContext?.prevChapter()}
                  disabled={selectedChapter <= 1}
                  className="flex-1 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-40 transition-colors cursor-pointer text-center"
                >
                  ← Cap. Anterior
                </button>
                <button
                  type="button"
                  onClick={() => passageContext?.nextChapter()}
                  className="flex-1 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-center"
                >
                  Cap. Siguiente →
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
