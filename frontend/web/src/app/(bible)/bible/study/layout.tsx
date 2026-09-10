'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PanelLeft, PanelRight } from 'lucide-react';
import { BiblePassageProvider, useBiblePassageSafe } from '../../context/BiblePassageContext';
import { BibleHeaderNav } from '../../components/BibleHeaderNav';
import { BibleNavigationSidebar } from '../../components/BibleNavigationSidebar';
import { BibleExegesisInspector } from '../../components/BibleExegesisInspector';
import { DraggableEdgeTab } from '../../components/DraggableEdgeTab';

function BibleStudyWorkspace({ children }: { children: React.ReactNode }) {
  const passageContext = useBiblePassageSafe();
  const t = useTranslations('StudyLayout');
  const tStudio = useTranslations('Studio');

  const isLeftOpen = passageContext?.isLeftSidebarOpen ?? false;
  const isRightOpen = passageContext?.isRightInspectorOpen ?? false;
  const isHeaderVisible = passageContext?.isHeaderVisible ?? true;
  const setIsHeaderVisible = passageContext?.setIsHeaderVisible;

  const mainRef = React.useRef<HTMLElement>(null);
  const lastScrollTopRef = React.useRef(0);
  const accumulatedDeltaRef = React.useRef(0);
  const scrollDirectionRef = React.useRef<'up' | 'down'>('up');

  const REPOSE_ZONE_PX = 200; // Zona de reposo superior: primeros 200px inamovibles
  const SCROLL_DOWN_HIDE_INTENT_PX = 80; // Intención sostenida de lectura continua hacia abajo
  const SCROLL_UP_REVEAL_INTENT_PX = 25; // Reaparición inmediata y sensible al subir

  const handleMainScroll = () => {
    const mainEl = mainRef.current;
    if (!mainEl || !setIsHeaderVisible) return;

    const currentScrollTop = Math.max(0, mainEl.scrollTop);
    const delta = currentScrollTop - lastScrollTopRef.current;

    // Ignorar micro-vibraciones (< 2px)
    if (Math.abs(delta) < 2) return;

    // 1. Zona de reposo superior: la cabecera permanece fija y serena
    if (currentScrollTop <= REPOSE_ZONE_PX) {
      setIsHeaderVisible(true);
      accumulatedDeltaRef.current = 0;
      scrollDirectionRef.current = 'up';
    } else if (delta > 0) {
      // Desplazamiento hacia abajo más allá de la zona de reposo
      if (scrollDirectionRef.current !== 'down') {
        scrollDirectionRef.current = 'down';
        accumulatedDeltaRef.current = 0;
      }

      const effectiveDelta =
        lastScrollTopRef.current <= REPOSE_ZONE_PX
          ? currentScrollTop - REPOSE_ZONE_PX
          : delta;

      if (effectiveDelta > 0) {
        accumulatedDeltaRef.current += effectiveDelta;
      }

      // Ocultar únicamente tras una intención de lectura sostenida y deliberada
      if (accumulatedDeltaRef.current >= SCROLL_DOWN_HIDE_INTENT_PX) {
        setIsHeaderVisible(false);
      }
    } else if (delta < 0) {
      // Desplazamiento hacia arriba
      if (scrollDirectionRef.current !== 'up') {
        scrollDirectionRef.current = 'up';
        accumulatedDeltaRef.current = 0;
      }
      accumulatedDeltaRef.current += Math.abs(delta);

      // Reaparecer con intención de navegación hacia arriba ágil
      if (accumulatedDeltaRef.current >= SCROLL_UP_REVEAL_INTENT_PX) {
        setIsHeaderVisible(true);
      }
    }

    lastScrollTopRef.current = currentScrollTop;
  };

  return (
    <div className="h-screen bg-zinc-50/60 dark:bg-black text-foreground flex flex-col overflow-hidden selection:bg-primary/10">
      {/* Header Superior con Auto-Hide Inteligente y Suave */}
      <BibleHeaderNav isVisible={isHeaderVisible} />

      {/* Pestaña Flotante Movible Izquierda (Aparece cuando el sidebar está oculto) */}
      <DraggableEdgeTab
        side="left"
        isOpen={isLeftOpen}
        onOpen={() => passageContext?.toggleLeftSidebar()}
        icon={PanelLeft}
        storageKey="bible_drag_tab_left_y"
        defaultTop={200}
        title={tStudio('toggleSidebar') || 'Mostrar libros y capítulos'}
      />

      {/* Pestaña Flotante Movible Derecha (Aparece cuando el inspector está oculto) */}
      <DraggableEdgeTab
        side="right"
        isOpen={isRightOpen}
        onOpen={() => passageContext?.toggleRightInspector()}
        icon={PanelRight}
        storageKey="bible_drag_tab_right_y"
        defaultTop={260}
        title={tStudio('toggleInspector') || 'Mostrar panel de estudio'}
      />

      {/* Workspace Studio FSD: Panel Izquierdo + Canvas Central + Inspector Derecho */}
      <div className="flex-1 flex flex-row w-full min-h-0 overflow-hidden relative">
        {/* Panel Lateral Izquierdo: Libros y Capítulos */}
        <BibleNavigationSidebar />

        {/* Canvas Central de Contenido y Suites de Estudio con Scroll Independiente */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          className="flex-1 min-w-0 h-full overflow-y-auto px-3 sm:px-6 lg:px-8 pt-2 pb-16 space-y-4 overflow-x-hidden print:p-0 print:m-0 print:pb-0"
        >
          {children}

          {/* Footer Editorial al final del Canvas de Lectura */}
          <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 w-full py-6 mt-12 bg-transparent print:hidden">
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              <div>{t('title', { year: new Date().getFullYear().toString() })}</div>
              <div className="flex gap-4">
                <Link href="/bible" className="hover:text-foreground transition-colors duration-150">
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

        {/* Panel Lateral Derecho: Ficha Morfológica Strong y Versiones Paralelas */}
        <BibleExegesisInspector />
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
        <BibleStudyWorkspace>{children}</BibleStudyWorkspace>
      </BiblePassageProvider>
    </Suspense>
  );
}
