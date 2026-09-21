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
import { ResizeBorderHandle } from '../../../../shared/ui';

interface CanonicalGroup {
  id: string;
  name: string;
  canon: 'OT' | 'NT';
  sub: string;
  books: { id: number; abbr: string; name: string; lang: 'hebrew' | 'greek'; isAramaic?: boolean }[];
}

const CANONICAL_GROUPS: CanonicalGroup[] = [
  {
    id: 'tora',
    name: 'Torá Masorética (Pentateuco)',
    canon: 'OT',
    sub: 'Hebreo Masorético con Nikkud y Cantilación Tiberiana',
    books: [
      { id: 1, abbr: 'GEN', name: 'Génesis (Bereshit)', lang: 'hebrew' },
      { id: 2, abbr: 'EXO', name: 'Éxodo (Shemot)', lang: 'hebrew' },
      { id: 3, abbr: 'LEV', name: 'Levítico (Vayikra)', lang: 'hebrew' },
      { id: 4, abbr: 'NUM', name: 'Números (Bamidbar)', lang: 'hebrew' },
      { id: 5, abbr: 'DEU', name: 'Deuteronomio (Devarim)', lang: 'hebrew' },
    ],
  },
  {
    id: 'neviim',
    name: 'Nevi\'im (Profetas Anteriores y Posteriores)',
    canon: 'OT',
    sub: 'Hebreo Bíblico Clásico',
    books: [
      { id: 6, abbr: 'JOS', name: 'Josué (Yehoshua)', lang: 'hebrew' },
      { id: 7, abbr: 'JUE', name: 'Jueces (Shoftim)', lang: 'hebrew' },
      { id: 9, abbr: '1SA', name: '1 Samuel (Shemuel Alef)', lang: 'hebrew' },
      { id: 11, abbr: '1RE', name: '1 Reyes (Melajim Alef)', lang: 'hebrew' },
      { id: 23, abbr: 'ISA', name: 'Isaías (Yeshayahu)', lang: 'hebrew' },
      { id: 24, abbr: 'JER', name: 'Jeremías (Yirmeyahu)', lang: 'hebrew' },
      { id: 26, abbr: 'EZE', name: 'Ezequiel (Yejezkel)', lang: 'hebrew' },
    ],
  },
  {
    id: 'ketuvim',
    name: 'Ketuvim (Escritos & Secciones Arameas)',
    canon: 'OT',
    sub: 'Hebreo y Arameo Imperial (Daniel/Esdras)',
    books: [
      { id: 19, abbr: 'SAL', name: 'Salmos (Tehilim)', lang: 'hebrew' },
      { id: 20, abbr: 'PRO', name: 'Proverbios (Mishlei)', lang: 'hebrew' },
      { id: 27, abbr: 'DAN', name: 'Daniel (Arameo/Hebreo)', lang: 'hebrew', isAramaic: true },
      { id: 15, abbr: 'ESD', name: 'Esdras (Ezra)', lang: 'hebrew', isAramaic: true },
      { id: 18, abbr: 'JOB', name: 'Job (Iyyov)', lang: 'hebrew' },
    ],
  },
  {
    id: 'evangelios',
    name: 'Evangelios Sinópticos y Juan',
    canon: 'NT',
    sub: 'Griego Koiné Alejandrino (NA28 / UBS5)',
    books: [
      { id: 40, abbr: 'MAT', name: 'Mateo (Kata Matthaion)', lang: 'greek' },
      { id: 41, abbr: 'MAR', name: 'Marcos (Kata Markon)', lang: 'greek' },
      { id: 42, abbr: 'LUC', name: 'Lucas (Kata Loukan)', lang: 'greek' },
      { id: 43, abbr: 'JUA', name: 'Juan (Kata Ioannen)', lang: 'greek' },
      { id: 44, abbr: 'HEC', name: 'Hechos de los Apóstoles (Praxeis)', lang: 'greek' },
    ],
  },
  {
    id: 'epistolas',
    name: 'Corpus Paulino & Epístolas Generales',
    canon: 'NT',
    sub: 'Griego Koiné Epistolar y Apocalipsis',
    books: [
      { id: 45, abbr: 'ROM', name: 'Romanos (Pros Romaious)', lang: 'greek' },
      { id: 46, abbr: '1CO', name: '1 Corintios (Pros Korinthious A)', lang: 'greek' },
      { id: 48, abbr: 'GAL', name: 'Gálatas (Pros Galatas)', lang: 'greek' },
      { id: 49, abbr: 'EFE', name: 'Efesios (Pros Ephesious)', lang: 'greek' },
      { id: 58, abbr: 'HEB', name: 'Hebreos (Pros Hebraious)', lang: 'greek' },
      { id: 66, abbr: 'APO', name: 'Apocalipsis (Apokalypsis)', lang: 'greek' },
    ],
  },
];

export const InterlinearSidebar: React.FC = () => {
  const passageContext = useBiblePassageSafe();
  const interlinear = useInterlinearContextSafe();
  const tStudio = useTranslations('Studio');

  const leftSidebarWidth = passageContext?.leftSidebarWidth ?? 320;
  const setLeftSidebarWidth = passageContext?.setLeftSidebarWidth ?? (() => {});
  const resetLeftSidebarWidth = passageContext?.resetLeftSidebarWidth ?? (() => {});

  const [activeSubTab, setActiveSubTab] = useState<'corpus' | 'layers'>('corpus');

  const isOpen = passageContext?.isLeftSidebarOpen ?? false;
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
        style={{ '--sidebar-w': `${leftSidebarWidth}px` } as React.CSSProperties}
        className={`fixed inset-y-0 left-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-88 lg:w-[var(--sidebar-w)] flex-shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden`}
      >
        {/* Tirador Redimensionable Interactivo con Arrastre y Colapso (Estilo Geist / DIITRA) */}
        <ResizeBorderHandle
          side="left"
          currentWidth={leftSidebarWidth}
          onResize={setLeftSidebarWidth}
          onReset={resetLeftSidebarWidth}
          onCollapse={handleClose}
          collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
        />

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
