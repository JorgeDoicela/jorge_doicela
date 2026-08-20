'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BibleLogo } from './BibleLogo';
import { ThemeToggle } from './ThemeToggle';
import { ChevronDown, Check } from 'lucide-react';

interface NavTabItem {
  path: string;
  label: string;
  dotColor?: string;
}

const NAV_TABS: NavTabItem[] = [
  { path: '/bible/study/standard', label: 'Estándar' },
  { path: '/bible/study/parallel', label: 'Paralelo', dotColor: 'bg-blue-500' },
  { path: '/bible/study/interlinear', label: 'Interlineal', dotColor: 'bg-amber-500' },
  { path: '/bible/study/word-study', label: 'Análisis de Palabra', dotColor: 'bg-purple-500' },
  { path: '/bible/study/literary', label: 'Estructura & Quiasmos', dotColor: 'bg-emerald-500' },
  { path: '/bible/study/historical-context', label: 'Contexto Histórico', dotColor: 'bg-rose-500' },
];

export const BibleHeaderNav: React.FC = () => {
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
    <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Izquierda: Logotipo e Identidad (Link a Landing) */}
        <Link
          href="/bible"
          className="shrink-0 flex items-center gap-1.5 sm:gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          title="Volver a la Presentación"
        >
          <BibleLogo size={18} />
          <span className="text-accents-2 font-mono select-none">/</span>
          <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-foreground">
            Bible
          </span>
        </Link>

        {/* Móvil: Selector desplegable de Suite de Estudio (< md) */}
        <div className="relative flex-1 md:hidden max-w-[220px]" ref={mobileMenuRef}>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border border-accents-2 bg-accents-1 hover:bg-accents-2 text-foreground text-xs font-medium transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              {activeTab.dotColor ? (
                <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${activeTab.dotColor}`} />
              ) : (
                <span className="inline-block w-2 h-2 rounded-full shrink-0 bg-foreground" />
              )}
              <span className="truncate">{activeTab.label}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-accents-4 shrink-0 transition-transform duration-150 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Flotante Móvil */}
          {mobileMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl border border-accents-2 bg-background shadow-xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 px-2 py-1 border-b border-accents-2 mb-1">
                Suites de Estudio
              </div>
              <div className="space-y-0.5">
                {NAV_TABS.map((tab) => {
                  const active = isCurrentTab(tab.path);
                  return (
                    <Link
                      key={tab.path}
                      href={`${tab.path}${queryString}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                        active
                          ? 'bg-foreground text-background font-bold shadow-xs'
                          : 'text-foreground hover:bg-accents-1'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.dotColor ? (
                          <span
                            className={`inline-block w-2 h-2 rounded-full shrink-0 ${tab.dotColor} ${
                              active ? 'ring-1 ring-background' : ''
                            }`}
                          />
                        ) : (
                          <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${active ? 'bg-background' : 'bg-foreground'}`} />
                        )}
                        <span>{tab.label}</span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Pestañas de Navegación URL-Driven completas (>= md) */}
        <nav className="hidden md:flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-1 scrollbar-none select-none px-1">
          {NAV_TABS.map((tab) => {
            const active = isCurrentTab(tab.path);
            return (
              <Link
                key={tab.path}
                href={`${tab.path}${queryString}`}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  active
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'text-accents-5 hover:text-foreground hover:bg-accents-1'
                }`}
              >
                {tab.dotColor && (
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${tab.dotColor} ${
                      active ? 'ring-1 ring-background' : ''
                    }`}
                  />
                )}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Derecha: Selector de Tema */}
        <div className="shrink-0 flex items-center pl-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
