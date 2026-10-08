'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { BookOpen } from 'lucide-react';
import { StudySidePanel } from '../../../shared/ui';
import { useKartexPassageSafe } from '../../../entities/passage';
import { CommentariesPassageNavigator } from './CommentariesPassageNavigator';

export const CommentariesSidebar: React.FC = () => {
  const tStudio = useTranslations('Studio');
  const passageContext = useKartexPassageSafe();
  const handleClose = passageContext?.toggleLeftSidebar ?? (() => {});

  const leftSidebarWidth = passageContext?.leftSidebarWidth ?? 280;
  const setLeftSidebarWidth = passageContext?.setLeftSidebarWidth ?? (() => {});
  const resetLeftSidebarWidth = passageContext?.resetLeftSidebarWidth ?? (() => {});

  return (
    <StudySidePanel
      side="left"
      title={tStudio('toggleSidebar')}
      icon={<BookOpen className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />}
      ariaLabel={tStudio('toggleSidebar')}
      isOpen={passageContext?.isLeftSidebarOpen ?? false}
      onClose={handleClose}
      width={leftSidebarWidth}
      onResize={setLeftSidebarWidth}
      onReset={resetLeftSidebarWidth}
      collapseTitle={tStudio('collapseSidebar') || 'Ocultar panel'}
    >
      <CommentariesPassageNavigator
        onChapterSelect={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            handleClose();
          }
        }}
      />
    </StudySidePanel>
  );
};
