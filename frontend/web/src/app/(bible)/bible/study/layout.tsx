'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  Languages,
  Map,
  Compass,
  History,
  Clock,
  ScrollText,
  Landmark,
  Sparkles,
  Columns3,
  GitCompare,
  Scroll,
  BookA,
  BarChart3,
} from 'lucide-react';
import { BiblePassageProvider, useBiblePassageSafe } from '../../shared/context';
import { BibleHeaderNav } from '../../widgets/bible-header';
import { BibleNavigationSidebar } from '../../widgets/bible-sidebar';
import { BibleExegesisInspector } from '../../widgets/exegesis-inspector';
import { DraggableEdgeTab } from '../../shared/ui';
import { AtlasProvider, AtlasSidebar, AtlasInspector } from '../../features/atlas';
import { TimelineProvider, TimelineSidebar, TimelineInspector } from '../../features/timeline';
import { ArchaeologyProvider, ArchaeologySidebar, ArchaeologyInspector } from '../../features/archaeology-feed';
import { EvangelismProvider, EvangelismSidebar, EvangelismInspector } from '../../features/evangelism';
import { ParallelProvider, ParallelSidebar, ParallelDiffInspector } from '../../features/parallel-view';
import { InterlinearProvider, InterlinearSidebar, InterlinearInspector } from '../../features/interlinear';
import { LexiconProvider, WordStudySidebar, WordStudyInspector } from '../../features/lexicons';
import { useHeaderScrollBehavior } from '../../shared/hooks';

function ScopedModuleProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  if (pathname.includes('/atlas')) {
    return <AtlasProvider>{children}</AtlasProvider>;
  }

  if (
    pathname.includes('/evangelism') ||
    pathname.includes('/pathways') ||
    pathname.includes('/objections') ||
    pathname.includes('/tracts')
  ) {
    return <EvangelismProvider>{children}</EvangelismProvider>;
  }

  if (pathname.includes('/parallel')) {
    return <ParallelProvider>{children}</ParallelProvider>;
  }

  if (pathname.includes('/interlinear')) {
    return <InterlinearProvider>{children}</InterlinearProvider>;
  }

  if (pathname.includes('/word-study')) {
    return <LexiconProvider>{children}</LexiconProvider>;
  }

  if (pathname.includes('/timeline')) {
    return <TimelineProvider>{children}</TimelineProvider>;
  }

  if (pathname.includes('/archaeology')) {
    return <ArchaeologyProvider>{children}</ArchaeologyProvider>;
  }

  return <>{children}</>;
}

function BibleStudyWorkspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isParallel = pathname.includes('/parallel');
  const isInterlinear = pathname.includes('/interlinear');
  const isWordStudy = pathname.includes('/word-study');
  const isAtlas = pathname.includes('/atlas');
  const isTimeline = pathname.includes('/timeline');
  const isArchaeology = pathname.includes('/archaeology');
  const isEvangelism =
    pathname.includes('/evangelism') ||
    pathname.includes('/pathways') ||
    pathname.includes('/objections') ||
    pathname.includes('/tracts');

  const passageContext = useBiblePassageSafe();
  const t = useTranslations('StudyLayout');
  const tStudio = useTranslations('Studio');

  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const isRightOpen = passageContext?.isRightInspectorOpen ?? false;
  const isHeaderVisible = passageContext?.isHeaderVisible ?? true;
  const setIsHeaderVisible = passageContext?.setIsHeaderVisible;

  const { mainRef, handleMainScroll } = useHeaderScrollBehavior(setIsHeaderVisible);

  // Al abrir cualquiera de los paneles laterales en móvil o desktop, asegurar que la cabecera superior permanezca visible
  useEffect(() => {
    if (isLeftOpen || isRightOpen) {
      setIsHeaderVisible?.(true);
    }
  }, [isLeftOpen, isRightOpen, setIsHeaderVisible]);

  const leftTabTitle = isAtlas
    ? tStudio('toggleAtlasSidebar')
    : isTimeline
    ? tStudio('toggleTimelineSidebar')
    : isArchaeology
    ? tStudio('toggleArchaeologySidebar')
    : isEvangelism
    ? pathname.includes('/objections')
      ? tStudio('toggleObjectionsSidebar')
      : pathname.includes('/tracts')
      ? tStudio('toggleTractsSidebar')
      : tStudio('toggleEvangelismSidebar')
    : isParallel
    ? tStudio('toggleParallelSidebar')
    : isInterlinear
    ? tStudio('toggleInterlinearSidebar')
    : isWordStudy
    ? tStudio('toggleWordStudySidebar')
    : tStudio('toggleSidebar');

  const leftTabIcon = isAtlas
    ? Map
    : isTimeline
    ? History
    : isArchaeology
    ? ScrollText
    : isEvangelism
    ? Compass
    : isParallel
    ? Columns3
    : isInterlinear
    ? Scroll
    : isWordStudy
    ? BookA
    : BookOpen;

  const rightTabTitle = isAtlas
    ? tStudio('toggleAtlasInspector')
    : isTimeline
    ? tStudio('toggleTimelineInspector')
    : isArchaeology
    ? tStudio('toggleArchaeologyInspector')
    : isEvangelism
    ? pathname.includes('/objections')
      ? tStudio('toggleObjectionsInspector')
      : pathname.includes('/tracts')
      ? tStudio('toggleTractsInspector')
      : tStudio('toggleEvangelismInspector')
    : isParallel
    ? tStudio('toggleParallelInspector')
    : isInterlinear
    ? tStudio('toggleInterlinearInspector')
    : isWordStudy
    ? tStudio('toggleWordStudyInspector')
    : tStudio('toggleInspector');

  const rightTabIcon = isAtlas
    ? Compass
    : isTimeline
    ? Clock
    : isArchaeology
    ? Landmark
    : isEvangelism
    ? Sparkles
    : isParallel
    ? GitCompare
    : isInterlinear
    ? Languages
    : isWordStudy
    ? BarChart3
    : Languages;

  return (
    <div className="h-screen bg-zinc-50/60 dark:bg-black text-foreground flex flex-col overflow-hidden selection:bg-primary/10">
      {/* Header Superior con Auto-Hide Inteligente y Suave */}
      <BibleHeaderNav isVisible={isHeaderVisible} />

      {/* Pestaña Lateral Izquierda Discreta en Borde (Aparece al colapsar el selector de libros) */}
      <DraggableEdgeTab
        side="left"
        isOpen={isLeftOpen}
        onOpen={() => passageContext?.setLeftSidebarOpen(true)}
        icon={leftTabIcon}
        storageKey="bible_drag_tab_left_y"
        defaultTop={200}
        title={leftTabTitle}
      />

      {/* Pestaña Lateral Derecha Discreta en Borde (Aparece al colapsar el inspector exegético) */}
      <DraggableEdgeTab
        side="right"
        isOpen={isRightOpen}
        onOpen={() => passageContext?.setRightInspectorOpen(true)}
        icon={rightTabIcon}
        storageKey="bible_drag_tab_right_y"
        defaultTop={260}
        title={rightTabTitle}
      />

      {/* Workspace Studio FSD: Panel Izquierdo + Canvas Central + Inspector Derecho */}
      <div className="flex-1 flex flex-row w-full min-h-0 overflow-hidden relative">
        {/* Panel Lateral Izquierdo Especializado por Módulo */}
        {isAtlas ? (
          <AtlasSidebar />
        ) : isTimeline ? (
          <TimelineSidebar />
        ) : isArchaeology ? (
          <ArchaeologySidebar />
        ) : isEvangelism ? (
          <EvangelismSidebar />
        ) : isParallel ? (
          <ParallelSidebar />
        ) : isInterlinear ? (
          <InterlinearSidebar />
        ) : isWordStudy ? (
          <WordStudySidebar />
        ) : (
          <BibleNavigationSidebar />
        )}

        {/* Canvas Central de Contenido y Herramientas de Estudio con Scroll Independiente y Centrado Simétrico */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          className="flex-1 min-w-0 lg:min-w-[440px] h-full overflow-y-auto pt-2 pb-16 space-y-4 overflow-x-hidden px-3 sm:px-6 lg:px-8 print:p-0 print:m-0 print:pb-0 bible-scrollbar-slim"
        >
          <div className="w-full max-w-[1780px] mx-auto space-y-4">
            {children}

            {/* Footer Editorial al final del Canvas de Lectura */}
            <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 w-full py-6 mt-12 bg-transparent print:hidden">
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                <div>{t('title', { year: new Date().getFullYear().toString() })}</div>
                <div className="flex gap-4">
                  <Link href="/" className="hover:text-foreground transition-colors duration-150">
                    {t('presentation')}
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  <span className="hover:text-foreground transition-colors duration-150 cursor-default">
                    {t('holyScriptures')}
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </main>

        {/* Panel Lateral Derecho Especializado por Módulo */}
        {isAtlas ? (
          <AtlasInspector />
        ) : isTimeline ? (
          <TimelineInspector />
        ) : isArchaeology ? (
          <ArchaeologyInspector />
        ) : isEvangelism ? (
          <EvangelismInspector />
        ) : isParallel ? (
          <ParallelDiffInspector />
        ) : isInterlinear ? (
          <InterlinearInspector />
        ) : isWordStudy ? (
          <WordStudyInspector />
        ) : (
          <BibleExegesisInspector />
        )}
      </div>
    </div>
  );
}

export default function BibleStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50/60 dark:bg-black" />}>
      <BiblePassageProvider>
        <ScopedModuleProviders>
          <BibleStudyWorkspace>{children}</BibleStudyWorkspace>
        </ScopedModuleProviders>
      </BiblePassageProvider>
    </Suspense>
  );
}
