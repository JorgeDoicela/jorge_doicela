'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BibleLogo, BackToBibleButton } from '../../../shared/ui';
import { ThemeToggle } from '../../../features/theme-toggle';
import { LanguageToggle } from '../../../features/language-toggle';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NavTabItem {
  path: string;
  key: string;
}

const NAV_TABS: NavTabItem[] = [
  { path: '/study/standard', key: 'standard' },
  { path: '/study/parallel', key: 'parallel' },
  { path: '/study/interlinear', key: 'interlinear' },
  { path: '/study/word-study', key: 'wordStudy' },
  { path: '/study/atlas', key: 'atlas' },
  { path: '/study/timeline', key: 'timeline' },
  { path: '/study/archaeology', key: 'archaeology' },
  { path: '/study/evangelism', key: 'evangelism' },
];

interface BibleHeaderNavProps {
  isVisible?: boolean;
}

export const BibleHeaderNav: React.FC<BibleHeaderNavProps> = ({ isVisible = true }) => {
  const t = useTranslations('Nav');
  const pathname = usePathname() || '';

  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : '';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [homeUrl, setHomeUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      const isBibleSubdomain = hostname.startsWith('bible.');
      setHomeUrl(isBibleSubdomain ? '/' : '/bible');
    }
  }, []);

  const isCurrentTab = (tabPath: string) => {
    if (tabPath === '/study/standard') {
      return (
        pathname === '/study/standard' ||
        pathname === '/study' ||
        pathname === '/bible/study/standard' ||
        pathname === '/bible/study' ||
        pathname.startsWith('/study/standard/') ||
        pathname.startsWith('/bible/study/standard/')
      );
    }
    const clean = tabPath;
    const prefixed = `/bible${tabPath}`;

    return (
      pathname === clean ||
      pathname.startsWith(`${clean}/`) ||
      pathname === prefixed ||
      pathname.startsWith(`${prefixed}/`)
    );
  };

  const activeTab = NAV_TABS.find((tab) => isCurrentTab(tab.path)) || NAV_TABS[0];

  // Cerrar el menú flotante móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Si la cabecera se oculta por auto-hide, cerrar el menú flotante
  useEffect(() => {
    if (!isVisible) {
      setMobileMenuOpen(false);
    }
  }, [isVisible]);

  return (
    <header
      className={`relative shrink-0 w-full z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] print:hidden ${
        isVisible
          ? 'h-14 mb-0 opacity-100 translate-y-0 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#0a0a0a]/85 backdrop-blur-xl shadow-xs'
          : 'h-14 -mb-14 opacity-0 -translate-y-full pointer-events-none border-b border-transparent shadow-none'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">

        {/* Izquierda: Retorno al Inicio de la Biblia y Logotipo */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          <BackToBibleButton />
          <Link
            href={homeUrl}
            className="shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity p-0.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 group"
            title={t('landing')}
            aria-label={t('landing')}
          >
            <BibleLogo size={20} className="group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        {/* Móvil: Menú Desplegable Flotante Elegante (< md) Centrado Simétricamente */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 text-xs font-medium cursor-pointer shadow-xs active:scale-95 transition-all max-w-[170px] sm:max-w-none"
            aria-expanded={mobileMenuOpen}
            aria-label={t('studyMode')}
          >
            <span className="truncate">{t(activeTab.key as any)}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Flotante Móvil Centrado */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-60 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-1">
                {t('studyMode')}
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
                          : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
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

        {/* Desktop: Pestañas de Navegación Geist Planas (Centrado Geométrico Absoluto en Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center h-full select-none pointer-events-auto">
          <nav className="flex items-center h-full gap-0.5">
            {NAV_TABS.map((tab) => {
              const active = isCurrentTab(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={`${tab.path}${queryString}`}
                  className={`relative flex items-center h-full px-3 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0 ${
                    active
                      ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{t(tab.key as any)}</span>
                  {active && (
                    <span className="absolute -bottom-[1px] inset-x-1.5 h-[2px] bg-zinc-900 dark:bg-zinc-100 rounded-t-sm z-10" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tablet (< lg y >= md): Fallback elástico para pantallas intermedias sin desborde */}
        <div className="hidden md:flex lg:hidden flex-1 justify-center items-center h-full min-w-0 px-2 select-none">
          <nav className="flex items-center h-full gap-0.5 overflow-x-auto scrollbar-none">
            {NAV_TABS.map((tab) => {
              const active = isCurrentTab(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={`${tab.path}${queryString}`}
                  className={`relative flex items-center h-full px-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0 ${
                    active
                      ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{t(tab.key as any)}</span>
                  {active && (
                    <span className="absolute -bottom-[1px] inset-x-1 h-[2px] bg-zinc-900 dark:bg-zinc-100 rounded-t-sm z-10" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Derecha: Selector de Idioma y Tema */}
        <div className="shrink-0 flex items-center gap-2 pl-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
