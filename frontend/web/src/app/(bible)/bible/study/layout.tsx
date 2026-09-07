'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BiblePassageProvider } from '../../context/BiblePassageContext';
import { BibleHeaderNav } from '../../components/BibleHeaderNav';
import { BibleNavigationSidebar } from '../../components/BibleNavigationSidebar';
import { BibleExegesisInspector } from '../../components/BibleExegesisInspector';

export default function BibleStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('StudyLayout');

  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50/60 dark:bg-black" />}>
      <BiblePassageProvider>
        <div className="min-h-screen bg-zinc-50/60 dark:bg-black text-foreground flex flex-col selection:bg-primary/10">
          {/* Header Superior Fijo y Persistente */}
          <BibleHeaderNav />


          {/* Workspace Studio: Navegación Canónica + Canvas Central + Inspector Exegético */}
          <div className="flex-1 flex flex-row w-full min-h-[calc(100vh-3.5rem)] relative">
            {/* Panel Lateral Izquierdo: Libros y Capítulos */}
            <BibleNavigationSidebar />

            {/* Canvas Central de Contenido y Suites de Estudio */}
            <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-4 pb-20 space-y-4 overflow-x-hidden print:p-0 print:m-0 print:pb-0">
              {children}
            </main>

            {/* Panel Lateral Derecho: Ficha Morfológica Strong y Versiones Paralelas */}
            <BibleExegesisInspector />
          </div>

          {/* Footer Persistente a Pantalla Completa */}
          <footer className="border-t border-accents-2 w-full py-6 bg-background print:hidden">

            <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
              <div>{t('title', { year: new Date().getFullYear().toString() })}</div>
              <div className="flex gap-4">
                <Link href="/bible" className="hover:text-foreground transition-colors duration-150">
                  {t('presentation')}
                </Link>
                <span className="text-accents-2">|</span>
                <span className="hover:text-foreground transition-colors duration-150 cursor-default">
                  {t('holyScriptures')}
                </span>
              </div>
            </div>
          </footer>
        </div>
      </BiblePassageProvider>
    </Suspense>
  );
}
