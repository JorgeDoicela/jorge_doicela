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
import { StudySidePanel } from '../../../shared/ui';

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

  const rightInspectorWidth = passageContext?.rightInspectorWidth ?? 340;
  const setRightInspectorWidth = passageContext?.setRightInspectorWidth ?? (() => {});
  const resetRightInspectorWidth = passageContext?.resetRightInspectorWidth ?? (() => {});

  return (
    <StudySidePanel
      side="right"
      title={tStudio('inspectorTitle')}
      icon={<Languages className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
      ariaLabel={tStudio('inspectorTitle')}
      isOpen={isOpen}
      onClose={handleClose}
      width={rightInspectorWidth}
      onResize={setRightInspectorWidth}
      onReset={resetRightInspectorWidth}
      collapseTitle={tStudio('closeInspector')}
      className={className}
    >
      <StudySidePanel.Toolbar>
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
      </StudySidePanel.Toolbar>

      {/* Contenido Modular con Scroll independiente */}
      <StudySidePanel.Body className="p-4 space-y-4 text-sm">
        {activeTab === 'strong' && (
          <StrongMorphologyInspector word={word} />
        )}

        {activeTab === 'versions' && (
          <ParallelVerseInspector
            verse={targetVerse}
            translations={translations}
          />
        )}
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
