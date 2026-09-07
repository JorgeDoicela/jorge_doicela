'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { X, Languages, BookMarked, Sparkles } from 'lucide-react';
import { useBiblePassageSafe, InspectedWordData, InspectedVerseData } from '../context/BiblePassageContext';
import { StrongMorphologyInspector } from './StrongMorphologyInspector';
import { ParallelVerseInspector } from './ParallelVerseInspector';
import { Translation } from '../features/translations';

export interface BibleExegesisInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: 'strong' | 'versions' | 'notes';
  onTabChange?: (tab: 'strong' | 'versions' | 'notes') => void;
  word?: InspectedWordData | null;
  verse?: InspectedVerseData | null;
  translations?: Translation[];
  className?: string;
}

export const BibleExegesisInspector: React.FC<BibleExegesisInspectorProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  activeTab: propActiveTab,
  onTabChange: propOnTabChange,
  word: propWord,
  verse: propVerse,
  translations: propTranslations,
  className = '',
}) => {
  const tStudio = useTranslations('Studio');
  const passageContext = useBiblePassageSafe();

  // Soporte Dual: Props controladas con Fallback seguro a BiblePassageContext
  const isOpen = propIsOpen !== undefined ? propIsOpen : passageContext?.isRightInspectorOpen ?? false;
  const handleClose = propOnClose ?? passageContext?.closeInspector ?? (() => {});

  const [internalTab, setInternalTab] = useState<'strong' | 'versions' | 'notes'>('strong');
  const activeTab = propActiveTab ?? passageContext?.activeInspectorTab ?? internalTab;
  const handleTabChange = (tab: 'strong' | 'versions' | 'notes') => {
    if (propOnTabChange) {
      propOnTabChange(tab);
    } else if (passageContext) {
      passageContext.setActiveInspectorTab(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const word = propWord !== undefined ? propWord : passageContext?.inspectedWord ?? null;

  const targetVerse: InspectedVerseData | null = useMemo(() => {
    if (propVerse !== undefined) return propVerse;
    if (passageContext?.inspectedVerse) return passageContext.inspectedVerse;
    if (passageContext) {
      return {
        bookId: passageContext.selectedBookId || 1,
        bookName: passageContext.selectedBook?.name || 'Génesis',
        chapter: passageContext.selectedChapter || 1,
        verseNumber: 1,
        text: '',
      };
    }
    return null;
  }, [
    propVerse,
    passageContext?.inspectedVerse,
    passageContext?.selectedBookId,
    passageContext?.selectedBook?.name,
    passageContext?.selectedChapter,
  ]);

  const fallbackTranslations = passageContext?.translations;
  const translations = useMemo(() => {
    return propTranslations ?? fallbackTranslations ?? [];
  }, [propTranslations, fallbackTranslations]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop en Móviles / Tablets (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />
      <aside
        id="bible-exegesis-inspector"
        aria-label={tStudio('toggleInspector')}
        className={`fixed inset-y-0 right-0 z-50 h-screen lg:h-[calc(100vh-3.5rem)] lg:sticky lg:top-14 w-80 sm:w-88 xl:w-96 flex-shrink-0 border-l border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col transition-all duration-200 shadow-xl lg:shadow-none overflow-visible print:hidden ${className}`}
      >
        {/* Handle de Colapso Interactivo en Borde Divisorio Izquierdo (Estilo DIITRA) */}
        <div
          className="hidden lg:flex absolute top-0 -left-2.5 w-5 h-full cursor-pointer z-30 group/border items-start justify-center pt-3 select-none"
          onClick={handleClose}
          title={tStudio('closeInspector') || 'Ocultar inspector'}
        >
          {/* Línea divisoria reactiva al hover */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-transparent group-hover/border:bg-zinc-400 dark:group-hover/border:bg-zinc-500 transition-colors duration-150" />

          {/* Botón Flotante con Símbolo DIITRA (←|→) */}
          <div
            className="relative z-10 w-5 h-6 rounded bg-white dark:bg-[#0a0a0a] border border-zinc-300 dark:border-zinc-800 shadow-xs opacity-0 group-hover/border:opacity-100 hover:scale-110 hover:border-zinc-900 dark:hover:border-zinc-600 transition-all duration-150 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
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

        {/* Cabecera del Inspector (visible solo en móvil como Drawer modal) */}
        <div className="flex lg:hidden items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              {tStudio('toggleInspector')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            title={tStudio('closeInspector')}
            aria-label={tStudio('closeInspector')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Pestañas de Inspección Geist Plano (Vercel Style) */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
            <button
              type="button"
              onClick={() => handleTabChange('strong')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'strong'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{tStudio('tabStrong')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('versions')}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'versions'
                  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>{tStudio('tabVersions')}</span>
            </button>
          </div>
        </div>

        {/* Contenido Modular con Scroll independiente */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {activeTab === 'strong' && (
            <StrongMorphologyInspector word={word} />
          )}

          {activeTab === 'versions' && (
            <ParallelVerseInspector
              verse={targetVerse}
              translations={translations}
            />
          )}
        </div>
      </aside>
    </>
  );
};

