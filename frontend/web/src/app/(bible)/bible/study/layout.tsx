'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PanelLeft, PanelRight } from 'lucide-react';
import { BiblePassageProvider, useBiblePassageSafe } from '../../context/BiblePassageContext';
import { BibleHeaderNav } from '../../components/BibleHeaderNav';
import { BibleNavigationSidebar } from '../../components/BibleNavigationSidebar';
import { BibleExegesisInspector } from '../../components/BibleExegesisInspector';
import { DraggableEdgeTab } from '../../components/DraggableEdgeTab';
import { AtlasProvider, AtlasSidebar, AtlasInspector } from '../../features/atlas';
import { TimelineSidebar, TimelineInspector } from '../../features/timeline';
import { ArchaeologySidebar, ArchaeologyInspector } from '../../features/archaeology-feed';
import { EvangelismProvider, EvangelismSidebar, EvangelismInspector } from '../../features/evangelism';
import { ParallelProvider, ParallelSidebar, ParallelDiffInspector } from '../../features/parallel-view';
import { InterlinearProvider, InterlinearSidebar, InterlinearInspector } from '../../features/interlinear';
import { LexiconProvider, WordStudySidebar, WordStudyInspector } from '../../features/lexicons';
import { useHeaderScrollBehavior } from '../../hooks/useHeaderScrollBehavior';

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

  const leftTabTitle = isAtlas
    ? (tStudio('toggleAtlasSidebar') || 'Mostrar eras, lugares y rutas')
    : isTimeline
    ? 'Mostrar eras y sincronización histórica'
    : isArchaeology
    ? 'Mostrar regiones y filtros arqueológicos'
    : isEvangelism
    ? pathname.includes('/objections')
      ? 'Mostrar categorías de objeciones'
      : pathname.includes('/tracts')
      ? 'Mostrar catálogo de tratados y bosquejos'
      : (tStudio('toggleEvangelismSidebar') || 'Mostrar rutas y catálogo soteriológico')
    : isParallel
    ? 'Mostrar gestión de columnas y presets'
    : isInterlinear
    ? 'Mostrar corpus y capas morfológicas'
    : isWordStudy
    ? 'Mostrar léxico y términos teológicos'
    : (tStudio('toggleSidebar') || 'Mostrar libros y capítulos');

  const rightTabTitle = isAtlas
    ? (tStudio('toggleAtlasInspector') || 'Mostrar telemetría y ficha arqueológica')
    : isTimeline
    ? 'Mostrar ficha del evento cronológico'
    : isArchaeology
    ? 'Mostrar ficha técnica de la excavación'
    : isEvangelism
    ? pathname.includes('/objections')
      ? 'Mostrar argumentación y defensa bíblica'
      : pathname.includes('/tracts')
      ? 'Mostrar bosquejo homilético completo'
      : (tStudio('toggleEvangelismInspector') || 'Mostrar guía ministerial y pasajes')
    : isParallel
    ? 'Mostrar diff textual y variantes'
    : isInterlinear
    ? 'Mostrar ficha morfológica y léxica'
    : isWordStudy
    ? 'Mostrar concordancia y exégesis'
    : (tStudio('toggleInspector') || 'Mostrar panel de estudio');

  return (
    <div className="h-screen bg-zinc-50/60 dark:bg-black text-foreground flex flex-col overflow-hidden selection:bg-primary/10">
      {/* Header Superior con Auto-Hide Inteligente y Suave */}
      <BibleHeaderNav isVisible={isHeaderVisible} />

      {/* Pestaña Flotante Movible Izquierda (Aparece cuando el sidebar está colapsado) */}
      <DraggableEdgeTab
        side="left"
        isOpen={isLeftOpen}
        onOpen={() => passageContext?.toggleLeftSidebar()}
        icon={PanelLeft}
        storageKey="bible_drag_tab_left_y"
        defaultTop={200}
        title={leftTabTitle}
      />

      {/* Pestaña Flotante Movible Derecha (Aparece cuando el inspector está colapsado) */}
      <DraggableEdgeTab
        side="right"
        isOpen={isRightOpen}
        onOpen={() => passageContext?.toggleRightInspector()}
        icon={PanelRight}
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

        {/* Canvas Central de Contenido y Suites de Estudio con Scroll Independiente */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          className="flex-1 min-w-0 h-full overflow-y-auto pt-2 pb-16 space-y-4 overflow-x-hidden px-3 sm:px-6 lg:px-8 print:p-0 print:m-0 print:pb-0"
        >
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
        <AtlasProvider>
          <EvangelismProvider>
            <ParallelProvider>
              <InterlinearProvider>
                <LexiconProvider>
                  <BibleStudyWorkspace>{children}</BibleStudyWorkspace>
                </LexiconProvider>
              </InterlinearProvider>
            </ParallelProvider>
          </EvangelismProvider>
        </AtlasProvider>
      </BiblePassageProvider>
    </Suspense>
  );
}
