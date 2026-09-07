'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BibleLogo } from './BibleLogo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { BackToPortalButton } from './BackToPortalButton';
import { ChevronDown, Check, PanelLeft, PanelRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useBiblePassageSafe } from '../context/BiblePassageContext';

interface NavTabItem {
  path: string;
  key: string;
}

const NAV_TABS: NavTabItem[] = [
  { path: '/bible/study/standard', key: 'standard' },
  { path: '/bible/study/parallel', key: 'parallel' },
  { path: '/bible/study/interlinear', key: 'interlinear' },
  { path: '/bible/study/word-study', key: 'wordStudy' },
  { path: '/bible/study/literary', key: 'literary' },
  { path: '/bible/study/historical-context', key: 'historical' },
];

export const BibleHeaderNav: React.FC = () => {
  const t = useTranslations('Nav');
  const tStudio = useTranslations('Studio');
  const passageContext = useBiblePassageSafe();
  const pathname = usePathname() || '';

  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : '';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isCurrentTab = (tabPath: string) => {
    if (tabPath === '/bible/study/standard') {
      return pathname === '/bible/study/standard' || pathname === '/bible/study' || pathname === '/study';
    }
    const segment = tabPath.replace('/bible', '');
    return pathname.startsWith(tabPath) || pathname.startsWith(segment);
  };

  const activeTab = NAV_TABS.find((t) => isCurrentTab(t.path)) || NAV_TABS[0];

  // Cerrar el menú móvil al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md print:hidden">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">

        {/* Izquierda: Retorno al Portal + Logotipo e Identidad */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-3">
          <BackToPortalButton />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block select-none" />
          <Link
            href="/bible"
            className="shrink-0 flex items-center gap-1.5 sm:gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            title={t('landing')}
          >
            <BibleLogo />
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-900 dark:text-zinc-100 hidden sm:inline-block">
              {t('modularBible')}
            </span>
          </Link>

          {/* Botón Toggle Panel Izquierdo (Navegación Canónica) */}
          {passageContext && (
            <>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 select-none" />
              <button
                type="button"
                onClick={passageContext.toggleLeftSidebar}
                title={tStudio('toggleSidebar')}
                aria-label={tStudio('toggleSidebar')}
                className={`p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                  passageContext.isLeftSidebarOpen
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Móvil: Menú Desplegable Flotante Elegante (< md) */}
        <div className="relative md:hidden shrink min-w-0" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100 text-xs font-medium cursor-pointer shadow-xs active:scale-95 transition-all max-w-[170px] sm:max-w-none"
            aria-expanded={mobileMenuOpen}
            aria-label={t('selectSuite')}
          >
            <span className="truncate">{t(activeTab.key as any)}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Flotante Móvil */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-60 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-1">
                {t('studySuites')}
              </div>
              <div className="flex flex-col gap-0.5">
                {NAV_TABS.map((tab) => {
                  const active = isCurrentTab(tab.path);
                  return (
                    <Link
                      key={tab.path}
                      href={`${tab.path}${queryString}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium'
                          : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <span>{t(tab.key as any)}</span>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Pestañas de Navegación Geist (Estilo Vercel puro) */}
        <nav className="hidden md:flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1 scrollbar-none select-none px-2">
          {NAV_TABS.map((tab) => {
            const active = isCurrentTab(tab.path);
            return (
              <Link
                key={tab.path}
                href={`${tab.path}${queryString}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 ${
                  active
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
                }`}
              >
                <span>{t(tab.key as any)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Derecha: Toggle Inspector + Selector de Idioma y Tema */}
        <div className="shrink-0 flex items-center gap-2 pl-1">
          {passageContext && (
            <button
              type="button"
              onClick={passageContext.toggleRightInspector}
              title={tStudio('toggleInspector')}
              aria-label={tStudio('toggleInspector')}
              className={`p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                passageContext.isRightInspectorOpen
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <PanelRight className="w-4 h-4" />
            </button>
          )}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
