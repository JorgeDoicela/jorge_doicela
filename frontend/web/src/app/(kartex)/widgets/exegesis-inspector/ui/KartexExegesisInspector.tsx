'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import {
  useKartexPassageSafe,
  InspectedWordData,
  InspectedVerseData,
  InspectorTab,
  VerseExegesisCard,
} from '../../../entities/passage';
import { Translation } from '../../../entities/translations';
import { StudySidePanel } from '../../../shared/ui';

export interface KartexExegesisInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeTab?: InspectorTab;
  onTabChange?: (tab: InspectorTab) => void;
  word?: InspectedWordData | null;
  verse?: InspectedVerseData | null;
  translations?: Translation[];
  className?: string;
}

export const KartexExegesisInspector: React.FC<KartexExegesisInspectorProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  verse: propVerse,
  translations: propTranslations,
  className = '',
}) => {
  const tStudio = useTranslations('Studio');
  const passageContext = useKartexPassageSafe();

  // Soporte Dual: Props controladas con Fallback seguro a KartexPassageContext
  const isOpen = propIsOpen !== undefined ? propIsOpen : passageContext?.isRightInspectorOpen ?? false;
  const handleClose = propOnClose ?? passageContext?.closeInspector ?? (() => {});

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

  return (
    <StudySidePanel
      side="right"
      title={tStudio('verseExegesisTitle')}
      icon={<Languages className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
      ariaLabel={tStudio('verseExegesisTitle')}
      isOpen={isOpen}
      onClose={handleClose}
      width={rightInspectorWidth}
      onResize={setRightInspectorWidth}
      onReset={resetRightInspectorWidth}
      collapseTitle={tStudio('closeInspector')}
      className={className}
    >
      {/* Contenido continuo en Ficha Exegética Unificada */}
      <StudySidePanel.Body className="p-4 space-y-4 text-sm overflow-y-auto kartex-scrollbar-slim">
        <VerseExegesisCard
          verse={targetVerse}
          translations={translations}
          onSelectPassage={(bookId, chapter, verseNumber) => {
            passageContext?.setPassage(bookId, chapter);
            if (verseNumber && passageContext?.openInspectorWithVerse) {
              const bookMeta = passageContext.books?.find((b) => b.id === bookId);
              passageContext.openInspectorWithVerse({
                bookId,
                bookName: bookMeta?.name || 'Libro',
                chapter,
                verseNumber,
                text: '',
              });
            }
          }}
        />
      </StudySidePanel.Body>
    </StudySidePanel>
  );
};
