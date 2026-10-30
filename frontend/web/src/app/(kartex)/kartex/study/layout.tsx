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
  Library,
  BookMarked,
  BookCheck,
  BookOpenCheck,
} from 'lucide-react';
import { KartexPassageProvider, useKartexPassageSafe } from '../../entities/passage';
import { KartexHeaderNav } from '../../widgets/kartex-header';
import { KartexNavigationSidebar } from '../../widgets/kartex-sidebar';
import { KartexExegesisInspector } from '../../widgets/exegesis-inspector';
import { KartexMobileStudyDock } from '../../widgets/kartex-mobile-dock';
import { DraggableEdgeTab } from '../../shared/ui';
import { AtlasProvider, AtlasSidebar, AtlasInspector } from '../../features/atlas';
import { TimelineProvider, TimelineSidebar, TimelineInspector } from '../../features/timeline';
import { ArchaeologyProvider, ArchaeologySidebar, ArchaeologyInspector } from '../../features/archaeology-feed';
import { EvangelismProvider, EvangelismSidebar, EvangelismInspector } from '../../features/evangelism';
import { ParallelProvider, ParallelSidebar, ParallelDiffInspector } from '../../features/parallel-view';
import { InterlinearProvider, InterlinearSidebar, InterlinearInspector } from '../../features/interlinear';
import { LexiconProvider, WordStudySidebar, WordStudyInspector } from '../../features/lexicons';
import {
  CommentariesProvider,
  CommentariesSidebar,
  CommentariesInspector,
} from '../../features/commentaries';
import {
  DictionariesProvider,
  DictionariesSidebar,
  DictionariesInspector,
} from '../../features/dictionaries';
import { useTouchSwipe, useHeaderScrollBehavior, useScreenWakeLock } from '../../shared/hooks';

function ScopedModuleProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  if (pathname.includes('/dictionaries')) {
    return <DictionariesProvider>{children}</DictionariesProvider>;
  }

  if (pathname.includes('/commentaries')) {
    return <CommentariesProvider>{children}</CommentariesProvider>;
  }

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

function KartexStudyWorkspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isParallel = pathname.includes('/parallel');
  const isInterlinear = pathname.includes('/interlinear');
  const isWordStudy = pathname.includes('/word-study');
  const isAtlas = pathname.includes('/atlas');
  const isTimeline = pathname.includes('/timeline');
  const isArchaeology = pathname.includes('/archaeology');
  const isCommentaries = pathname.includes('/commentaries');
  const isDictionaries = pathname.includes('/dictionaries');
  const isEvangelism =
    pathname.includes('/evangelism') ||
    pathname.includes('/pathways') ||
    pathname.includes('/objections') ||
    pathname.includes('/tracts');

  const passageContext = useKartexPassageSafe();
  const t = useTranslations('StudyLayout');
  const tStudio = useTranslations('Studio');

  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const isRightOpen = passageContext?.isRightInspectorOpen ?? false;
  const isHeaderVisible = passageContext?.isHeaderVisible ?? true;
  const setIsHeaderVisible = passageContext?.setIsHeaderVisible;
  const selectedBookId = passageContext?.selectedBookId;
  const selectedChapter = passageContext?.selectedChapter;

  const { mainRef, handleMainScroll } = useHeaderScrollBehavior(setIsHeaderVisible, {
    disabled: isAtlas,
  });

  // Mantener la pantalla activa (Screen Wake Lock) durante la lectura y estudio analítico
  useScreenWakeLock({ enabled: true });

  // Asegurar que las barras reaparezcan de inmediato y el scroll regrese al inicio al cambiar de pasaje
  useEffect(() => {
    setIsHeaderVisible?.(true);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedBookId, selectedChapter, setIsHeaderVisible, mainRef]);

  // Si se abre cualquier panel lateral en móvil o escritorio, mantener visible la cabecera
  useEffect(() => {
    if (isLeftOpen || isRightOpen) {
      setIsHeaderVisible?.(true);
    }
  }, [isLeftOpen, isRightOpen, setIsHeaderVisible]);

  // Gestos táctiles horizontales (swipe) para avanzar o retroceder de capítulo en móvil
  const swipeHandlers = useTouchSwipe({
    onSwipeLeft: () => passageContext?.nextChapter(),
    onSwipeRight: () => passageContext?.prevChapter(),
    disabled: isAtlas, // Deshabilitar en Atlas para navegación panorámica en mapas
  });

  const leftTabTitle = isAtlas
    ? tStudio('toggleAtlasSidebar')
    : isTimeline
    ? tStudio('toggleTimelineSidebar')
    : isArchaeology
    ? tStudio('toggleArchaeologySidebar')
    : isCommentaries
    ? tStudio('toggleCommentariesSidebar')
    : isDictionaries
    ? tStudio('toggleDictionariesSidebar')
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
    : isCommentaries
    ? Library
    : isDictionaries
    ? BookMarked
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
    : isCommentaries
    ? tStudio('toggleCommentariesInspector')
    : isDictionaries
    ? tStudio('toggleDictionariesInspector')
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
    : isCommentaries
    ? ScrollText
    : isDictionaries
    ? BookCheck
    : isEvangelism
    ? Sparkles
    : isParallel
    ? GitCompare
    : isInterlinear
    ? Languages
    : isWordStudy
    ? BarChart3
    : BookOpenCheck;

  const isReaderView =
    !isAtlas &&
    !isTimeline &&
    !isArchaeology &&
    !isCommentaries &&
    !isDictionaries &&
    !isEvangelism &&
    !isParallel &&
    !isInterlinear &&
    !isWordStudy;

  const mobileLeftLabel = isAtlas
    ? 'Lugares'
    : isTimeline
    ? 'Épocas'
    : isArchaeology
    ? 'Hallazgos'
    : isCommentaries
    ? 'Comentarios'
    : isDictionaries
    ? 'Artículos'
    : isEvangelism
    ? 'Guías'
    : isParallel
    ? 'Versiones'
    : isInterlinear
    ? 'Original'
    : isWordStudy
    ? 'Términos'
    : undefined;

  const mobileRightLabel = isAtlas
    ? 'Ficha'
    : isTimeline
    ? 'Detalles'
    : isArchaeology
    ? 'Ficha'
    : isCommentaries
    ? 'Detalles'
    : isDictionaries
    ? 'Definición'
    : isEvangelism
    ? 'Recursos'
    : isParallel
    ? 'Diferencias'
    : isInterlinear
    ? 'Morfología'
    : isWordStudy
    ? 'Concordancia'
    : undefined;

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden selection:bg-primary/10">
      {/* Header Superior Fijo y Deslizable con Auto-Hide por GPU */}
      <KartexHeaderNav isVisible={isHeaderVisible} />

      {/* Pestaña Lateral Izquierda Discreta en Borde (Aparece al colapsar el selector de libros) */}
      <DraggableEdgeTab
        side="left"
        isOpen={isLeftOpen}
        onOpen={() => passageContext?.setLeftSidebarOpen(true)}
        icon={leftTabIcon}
        storageKey="kartex_drag_tab_left_y"
        defaultTop={200}
        title={leftTabTitle}
      />

      {/* Pestaña Lateral Derecha Discreta en Borde (Aparece al colapsar el inspector exegético) */}
      <DraggableEdgeTab
        side="right"
        isOpen={isRightOpen}
        onOpen={() => passageContext?.setRightInspectorOpen(true)}
        icon={rightTabIcon}
        storageKey="kartex_drag_tab_right_y"
        defaultTop={260}
        title={rightTabTitle}
      />

      {/* Workspace Studio FSD: Panel Izquierdo + Canvas Central + Inspector Derecho */}
      <div className="flex-1 flex flex-row w-full h-full min-h-0 overflow-hidden relative lg:pt-14">
        {/* Panel Lateral Izquierdo Especializado por Módulo */}
        {isAtlas ? (
          <AtlasSidebar />
        ) : isTimeline ? (
          <TimelineSidebar />
        ) : isArchaeology ? (
          <ArchaeologySidebar />
        ) : isCommentaries ? (
          <CommentariesSidebar />
        ) : isDictionaries ? (
          <DictionariesSidebar />
        ) : isEvangelism ? (
          <EvangelismSidebar />
        ) : isParallel ? (
          <ParallelSidebar />
        ) : isInterlinear ? (
          <InterlinearSidebar />
        ) : isWordStudy ? (
          <WordStudySidebar />
        ) : (
          <KartexNavigationSidebar />
        )}

        {/* Canvas Central de Contenido y Herramientas de Estudio con Scroll Fluido y Centrado Simétrico */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          {...swipeHandlers}
          className="flex-1 min-w-0 lg:min-w-[440px] h-full overflow-y-auto pt-16 pb-36 sm:pb-28 lg:pt-4 lg:pb-16 space-y-4 overflow-x-hidden px-3 sm:px-6 lg:px-8 print:p-0 print:m-0 print:pb-0 kartex-scrollbar-slim"
        >
          <div className="w-full max-w-[1780px] mx-auto space-y-4">
            {children}
          </div>

          {/* Footer Editorial al final del Canvas de Lectura */}
          <footer className="border-t border-border/80 w-full py-6 mt-12 bg-transparent print:hidden max-w-[1780px] mx-auto">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-5">
              <div>{t('title', { year: new Date().getFullYear().toString() })}</div>
              <div className="flex gap-4">
                <Link href="/" className="hover:text-foreground transition-colors duration-150">
                  {t('presentation')}
                </Link>
                <span className="text-accents-3">|</span>
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
        ) : isCommentaries ? (
          <CommentariesInspector />
        ) : isDictionaries ? (
          <DictionariesInspector />
        ) : isEvangelism ? (
          <EvangelismInspector />
        ) : isParallel ? (
          <ParallelDiffInspector />
        ) : isInterlinear ? (
          <InterlinearInspector />
        ) : isWordStudy ? (
          <WordStudyInspector />
        ) : (
          <KartexExegesisInspector />
        )}
      </div>

      {/* Dock Inferior Ergonómico para Dispositivos Móviles (Estilo Geist / Vercel Style) */}
      <KartexMobileStudyDock
        isVisible={isHeaderVisible}
        leftIcon={leftTabIcon}
        rightIcon={rightTabIcon}
        leftTitle={leftTabTitle}
        rightTitle={rightTabTitle}
        leftLabel={mobileLeftLabel}
        rightLabel={mobileRightLabel}
        isReaderView={isReaderView}
      />
    </div>
  );
}

export default function KartexStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <KartexPassageProvider>
        <ScopedModuleProviders>
          <KartexStudyWorkspace>{children}</KartexStudyWorkspace>
        </ScopedModuleProviders>
      </KartexPassageProvider>
    </Suspense>
  );
}
