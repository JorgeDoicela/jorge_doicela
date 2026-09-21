'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { X, Languages, BookMarked } from 'lucide-react';
import {
  useBiblePassageSafe,
  InspectedWordData,
  InspectedVerseData,
  InspectorTab,
} from '../../../shared/context';
import { StrongMorphologyInspector } from './StrongMorphologyInspector';
import { ParallelVerseInspector } from './ParallelVerseInspector';
import { Translation } from '../../../entities/translations';
import { ResizeBorderHandle } from '../../../shared/ui';

export interface BibleExegesisInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: InspectorTab;
  onTabChange?: (tab: InspectorTab) => void;
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

  const [internalTab, setInternalTab] = useState<InspectorTab>('versions');

  const activeTab = propActiveTab ?? passageContext?.activeInspectorTab ?? internalTab;
  const handleTabChange = (tab: InspectorTab) => {
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

  const rightInspectorWidth = passageContext?.rightInspectorWidth ?? 360;
  const setRightInspectorWidth = passageContext?.setRightInspectorWidth ?? (() => {});
  const resetRightInspectorWidth = passageContext?.resetRightInspectorWidth ?? (() => {});

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop en Pantallas Móviles (< lg) */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
        aria-hidden="true"
      />
      <aside
        id="bible-exegesis-inspector"
        aria-label={tStudio('inspectorTitle')}
        style={{ '--inspector-w': `${rightInspectorWidth}px` } as React.CSSProperties}
        className={`fixed inset-y-0 right-0 z-50 h-screen lg:h-full lg:relative lg:z-20 w-80 sm:w-88 lg:w-[var(--inspector-w)] flex-shrink-0 border-l border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md flex flex-col shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible print:hidden ${className}`}
      >
        {/* Tirador Redimensionable Interactivo con Arrastre y Colapso (Estilo Geist / DIITRA) */}
        <ResizeBorderHandle
          side="right"
          currentWidth={rightInspectorWidth}
          onResize={setRightInspectorWidth}
          onReset={resetRightInspectorWidth}
          onCollapse={handleClose}
          collapseTitle={tStudio('closeInspector')}
        />

        {/* Cabecera del Inspector */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
              {tStudio('inspectorTitle')}
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

        {/* Pestañas de Inspección Exegética (Geist Style) */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="grid grid-cols-2 rounded-lg border border-zinc-200 dark:border-zinc-800 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
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
