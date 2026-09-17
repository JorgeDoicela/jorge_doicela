'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Languages,
  Scroll,
  Sliders,
  Type,
  Eye,
  Check,
  Sparkles,
  BookOpen,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useBiblePassageSafe } from '../../../../shared/context';
import { useInterlinearContextSafe } from '../../context/InterlinearContext';
import { InterlinearViewLayout } from '../../types';

interface CanonicalGroup {
  id: string;
  name: string;
  canon: 'OT' | 'NT';
  books: { id: number; abbr: string; name: string; isAramaic?: boolean }[];
}

const CANONICAL_GROUPS: CanonicalGroup[] = [
  // ANTIGUO TESTAMENTO (HEBREO / ARAMEO)
  {
    id: 'torah',
    name: 'Torá (Ley Masorética)',
    canon: 'OT',
    books: [
      { id: 1, abbr: 'GEN', name: 'Génesis' },
      { id: 2, abbr: 'EXO', name: 'Éxodo' },
      { id: 3, abbr: 'LEV', name: 'Levítico' },
      { id: 4, abbr: 'NUM', name: 'Números' },
      { id: 5, abbr: 'DEU', name: 'Deuteronomio' },
    ],
  },
  {
    id: 'prophets',
    name: 'Nevi’im (Profetas)',
    canon: 'OT',
    books: [
      { id: 6, abbr: 'JOS', name: 'Josué' },
      { id: 7, abbr: 'JUE', name: 'Jueces' },
      { id: 9, abbr: '1SA', name: '1 Samuel' },
      { id: 10, abbr: '2SA', name: '2 Samuel' },
      { id: 11, abbr: '1RE', name: '1 Reyes' },
      { id: 12, abbr: '2RE', name: '2 Reyes' },
      { id: 23, abbr: 'ISA', name: 'Isaías' },
      { id: 24, abbr: 'JER', name: 'Jeremías' },
      { id: 26, abbr: 'EZE', name: 'Ezequiel' },
      { id: 27, abbr: 'DAN', name: 'Daniel', isAramaic: true },
    ],
  },
  {
    id: 'writings',
    name: 'Ketuvim (Escritos & Poesía)',
    canon: 'OT',
    books: [
      { id: 19, abbr: 'SAL', name: 'Salmos' },
      { id: 20, abbr: 'PRO', name: 'Proverbios' },
      { id: 18, abbr: 'JOB', name: 'Job' },
      { id: 21, abbr: 'ECC', name: 'Eclesiastés' },
      { id: 22, abbr: 'CNT', name: 'Cantares' },
      { id: 15, abbr: 'ESD', name: 'Esdras', isAramaic: true },
      { id: 16, abbr: 'NEH', name: 'Nehemías' },
      { id: 13, abbr: '1CR', name: '1 Crónicas' },
      { id: 14, abbr: '2CR', name: '2 Crónicas' },
    ],
  },
  // NUEVO TESTAMENTO (GRIEGO KOINÉ)
  {
    id: 'gospels',
    name: 'Evangelios & Hechos',
    canon: 'NT',
    books: [
      { id: 40, abbr: 'MAT', name: 'Mateo' },
      { id: 41, abbr: 'MAR', name: 'Marcos' },
      { id: 42, abbr: 'LUC', name: 'Lucas' },
      { id: 43, abbr: 'JUA', name: 'Juan' },
      { id: 44, abbr: 'HEC', name: 'Hechos' },
    ],
  },
  {
    id: 'epistles',
    name: 'Corpus Paulino & Epístolas',
    canon: 'NT',
    books: [
      { id: 45, abbr: 'ROM', name: 'Romanos' },
      { id: 46, abbr: '1CO', name: '1 Corintios' },
      { id: 47, abbr: '2CO', name: '2 Corintios' },
      { id: 48, abbr: 'GAL', name: 'Gálatas' },
      { id: 49, abbr: 'EFE', name: 'Efesios' },
      { id: 50, abbr: 'FIL', name: 'Filipenses' },
      { id: 51, abbr: 'COL', name: 'Colosenses' },
      { id: 58, abbr: 'HEB', name: 'Hebreos' },
      { id: 59, abbr: 'SNT', name: 'Santiago' },
      { id: 60, abbr: '1PE', name: '1 Pedro' },
      { id: 66, abbr: 'APO', name: 'Apocalipsis' },
    ],
  },
];

export const InterlinearSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const interlinear = useInterlinearContextSafe();
  const tStudio = useTranslations('Studio');

  const [activeSubTab, setActiveSubTab] = useState<'corpus' | 'layers'>('corpus');

  const isOpen = passageContext?.isLeftSidebarOpen ?? true;
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  if (!isOpen) return null;

  const activeCanon = interlinear?.activeCanon ?? 'OT';
  const settings = interlinear?.settings;
  const updateSettings = interlinear?.updateSettings ?? (() => {});

  const selectedBookId = passageContext?.selectedBookId ?? 1;

  const currentGroups = CANONICAL_GROUPS.filter((g) => g.canon === activeCanon);

  return (
    <>
      {/* Backdrop móvil */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />

      <aside
        aria-label="Panel Lateral de Interlineal Inverso"
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

        {/* Cabecera del Panel */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-foreground">
                <Scroll className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Corpus Interlineal
                </h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {activeCanon === 'OT' ? 'Texto Masorético BHS' : 'Texto Griego NA28'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Selector de Tradición Lingüística (Hebreo AT vs Griego NT) */}
          <div className="grid grid-cols-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200/60 dark:border-zinc-800/60">
            <button
              type="button"
              onClick={() => interlinear?.setActiveCanon('OT')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCanon === 'OT'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-foreground'
              }`}
            >
              Hebreo / Arameo (AT)
            </button>
            <button
              type="button"
              onClick={() => interlinear?.setActiveCanon('NT')}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCanon === 'NT'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-zinc-500 hover:text-foreground'
              }`}
            >
              Griego Koiné (NT)
            </button>
          </div>

          {/* Subpestañas del Sidebar: Corpus Canónico vs Capas Morfológicas */}
          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
            <button
              type="button"
              onClick={() => setActiveSubTab('corpus')}
              className={`py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeSubTab === 'corpus'
                  ? 'text-foreground border-b-2 border-foreground font-semibold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Libros del Canon
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('layers')}
              className={`py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer text-center ${
                activeSubTab === 'layers'
                  ? 'text-foreground border-b-2 border-foreground font-semibold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              Capas & Ajustes
            </button>
          </div>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {activeSubTab === 'corpus' && (
            <div className="space-y-4">
              {currentGroups.map((group) => (
                <div key={group.id} className="space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    {group.name}
                  </span>

                  <div className="space-y-1">
                    {group.books.map((b) => {
                      const isSelected = selectedBookId === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            passageContext?.setPassage(b.id, 1);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-zinc-100/90 dark:bg-zinc-900/90 border-zinc-400 dark:border-zinc-600 shadow-2xs'
                              : 'bg-background border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-zinc-500">
                              {b.abbr}
                            </span>
                            <span className="text-xs font-semibold text-foreground">
                              {b.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {b.isAramaic && (
                              <span
                                className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                title="Contiene secciones en Arameo Imperial"
                              >
                                Arameo
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'layers' && settings && (
            <div className="space-y-5">
              {/* MODO DE DISPOSICIÓN */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  Modo de Estudio
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ layout: 'reverse_interlinear' })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      settings.layout === 'reverse_interlinear'
                        ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600 shadow-2xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-semibold block text-foreground">Inverso</span>
                    <span className="text-[10px] text-zinc-400">Lectura corrida fluida</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSettings({ layout: 'cards' })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      settings.layout === 'cards'
                        ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600 shadow-2xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-semibold block text-foreground">Cuadrícula</span>
                    <span className="text-[10px] text-zinc-400">Fichas morfológicas</span>
                  </button>
                </div>
              </div>

              {/* CAPAS DE VISUALIZACIÓN */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Sliders className="w-3 h-3" />
                  Capas Lingüísticas Visibles
                </span>

                <div className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2.5">
                  {[
                    { key: 'showNikkud', label: 'Puntos Vocálicos (Nikkud)', desc: 'Vocalización y cantilación masorética' },
                    { key: 'showTransliteration', label: 'Transliteración Fonética', desc: 'Representación latina pronunciable' },
                    { key: 'showGloss', label: 'Glosas en Español', desc: 'Traducción directa palabra por palabra' },
                    { key: 'showStrong', label: 'Códigos Strong (H/G)', desc: 'Identificador léxico unificado' },
                    { key: 'showMorphologyTag', label: 'Etiquetas Gramaticales', desc: 'Parsing morfológico sintético' },
                  ].map((layer) => {
                    const isChecked = settings[layer.key as keyof typeof settings] as boolean;
                    return (
                      <label
                        key={layer.key}
                        className="flex items-start justify-between gap-3 cursor-pointer select-none"
                      >
                        <div>
                          <span className="text-xs font-medium text-foreground block">
                            {layer.label}
                          </span>
                          <span className="text-[10px] text-zinc-400 block">
                            {layer.desc}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            updateSettings({ [layer.key]: e.target.checked })
                          }
                          className="mt-1 h-4 w-4 rounded border-zinc-300 text-foreground focus:ring-0 cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* TAMAÑO DE TIPOGRAFÍA */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <Type className="w-3 h-3" />
                  Tamaño de Caracteres Originales
                </span>

                <div className="grid grid-cols-4 gap-1.5">
                  {(['base', 'lg', 'xl', '2xl'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateSettings({ fontSize: size })}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        settings.fontSize === size
                          ? 'bg-foreground text-background font-bold border-foreground'
                          : 'border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
