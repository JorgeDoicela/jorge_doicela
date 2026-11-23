'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PORTFOLIO_NAV_GROUPS } from '../config/navItems';
import { usePortfolioNavigation } from '../hooks/usePortfolioNavigation';
import { NavIcon } from './NavIcon';

export function PortfolioSideNav() {
  const t = useTranslations('SideNav');
  const { items, activeId, isCollapsed, toggleCollapsed, navigateTo } = usePortfolioNavigation();

  return (
    <>
      {/* Zona reactiva en el extremo izquierdo de la pantalla cuando está colapsado:
          invisible, solo cambia el cursor a cursor-col-resize para reabrir */}
      {isCollapsed && (
        <div
          onClick={toggleCollapsed}
          title={t('expand')}
          className="fixed left-0 top-0 bottom-0 w-3.5 z-50 hidden lg:block cursor-col-resize select-none"
        />
      )}

      {/* Sidebar Lateral Editorial Dark/Light Luxury */}
      <aside
        aria-label={t('ariaLabel')}
        className={`fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col bg-background/95 backdrop-blur-md border-r border-border/40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none w-52 ${
          isCollapsed ? '-translate-x-full pointer-events-none' : 'translate-x-0 pointer-events-auto'
        }`}
      >
        {/* Divisor interactivo en el borde derecho: solo cambia el cursor y oculta al hacer clic */}
        <div
          onClick={toggleCollapsed}
          title={t('collapse')}
          className="absolute top-0 bottom-0 -right-1.5 w-3 cursor-col-resize z-50 select-none hover:bg-gold-300/15 transition-colors"
        />

        {/* Identidad superior alineada horizontalmente con PortfolioHeader */}
        <div className="pt-6 md:pt-7 pb-6 px-6 flex items-center gap-2.5 shrink-0">
          <div className="w-[22px] h-[22px] shrink-0 relative flex items-center justify-center opacity-90">
            <Image
              src="/portfolio/logo/logo_blanco.webp"
              alt="Jorge Doicela"
              width={22}
              height={22}
              className="w-full h-full object-contain hidden dark:block"
              unoptimized
            />
            <Image
              src="/portfolio/logo/logo_negro.webp"
              alt="Jorge Doicela"
              width={22}
              height={22}
              className="w-full h-full object-contain block dark:hidden"
              unoptimized
            />
          </div>
          <span className="text-[10.5px] font-mono tracking-[0.24em] uppercase text-gold-300 truncate">
            {t('brandLabel')}
          </span>
        </div>

        {/* Navegación Editorial sin cajas ni bordes pesados */}
        <nav
          aria-label={t('sectionsAria')}
          className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-8"
        >
          {PORTFOLIO_NAV_GROUPS.map((group) => {
            const groupItems = items.filter((item) => item.group === group);
            if (groupItems.length === 0) return null;

            return (
              <div key={group} className="flex flex-col gap-2.5">
                <span className="pl-3 text-[9.5px] font-mono tracking-[0.26em] uppercase text-gold-400/80">
                  {t(`groups.${group}`)}
                </span>

                <ul className="flex flex-col gap-0.5">
                  {groupItems.map((item) => {
                    const isActive = activeId === item.id;
                    const label = t(`items.${item.labelKey}`);

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => navigateTo(item)}
                          aria-current={
                            isActive ? (item.kind === 'route' ? 'page' : 'location') : undefined
                          }
                          className={`group relative w-full h-[38px] flex items-center gap-2.5 pl-3.5 pr-2 border-l text-left transition-all duration-200 cursor-pointer outline-none focus-visible:text-gold-300 ${
                            isActive
                              ? 'border-gold-300 text-foreground'
                              : 'border-transparent text-muted/85 hover:text-foreground'
                          }`}
                        >
                          <NavIcon
                            name={item.icon}
                            className={`w-[15px] h-[15px] shrink-0 transition-colors duration-200 ${
                              isActive
                                ? 'text-gold-300'
                                : 'text-muted/55 group-hover:text-gold-400'
                            }`}
                          />

                          <span
                            className={`font-mono text-[11.5px] tracking-[0.08em] truncate transition-all duration-200 ${
                              isActive
                                ? 'text-foreground font-medium translate-x-0.5'
                                : 'text-muted group-hover:text-foreground group-hover:translate-x-0.5'
                            }`}
                          >
                            {label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
