'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PORTFOLIO_NAV_GROUPS } from '../config/navItems';
import { usePortfolioNavigation } from '../hooks/usePortfolioNavigation';
import { NavIcon } from './NavIcon';
import { BackToPortalButton } from '../../../components/BackToPortalButton';
import { PortfolioPreferences } from '../../../components/PortfolioPreferences';

export function PortfolioSideNav() {
  const t = useTranslations('SideNav');
  const {
    items,
    activeId,
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    closeMobile,
    navigateTo,
  } = usePortfolioNavigation();

  const renderNavItem = (item: (typeof items)[number], buttonHeight: string) => {
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
          className={`group relative w-full ${buttonHeight} flex items-center gap-2.5 pl-3 pr-3 border-l text-left transition-all duration-200 cursor-pointer outline-none focus-visible:text-gold-300 ${
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
  };

  // Renderizado compartido del árbol de navegación para escritorio y drawer móvil
  const renderNavLinks = (buttonHeight = 'h-[38px]') => (
    <nav
      aria-label={t('sectionsAria')}
      className="flex-1 overflow-y-auto px-3 pt-8 pb-5 custom-scrollbar"
    >
      <div className="w-fit max-w-full mx-auto flex flex-col gap-8">
        {PORTFOLIO_NAV_GROUPS.map((group) => {
          const groupItems = items.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;

          return (
            <div key={group} className="flex flex-col gap-2.5">
              <span className="text-center text-[9.5px] font-mono tracking-[0.26em] uppercase text-gold-400/80">
                {t(`groups.${group}`)}
              </span>

              <ul className="flex flex-col gap-0.5">
                {groupItems.map((item) => renderNavItem(item, buttonHeight))}
              </ul>
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* Zona reactiva en el extremo izquierdo de la pantalla cuando está colapsado (Desktop) */}
      {isCollapsed && (
        <div
          onClick={toggleCollapsed}
          title={t('expand')}
          className="group fixed left-0 top-0 bottom-0 w-3 z-50 hidden lg:block cursor-col-resize select-none"
        >
          <div className="w-[1.5px] h-full transition-colors duration-200 group-hover:bg-gold-300/60" />
        </div>
      )}

      {/* Sidebar Lateral Editorial Dark/Light Luxury (Escritorio lg+) */}
      <aside
        aria-label={t('ariaLabel')}
        className={`fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col bg-background/95 backdrop-blur-md border-r border-border/40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none w-[184px] ${
          isCollapsed ? '-translate-x-full pointer-events-none' : 'translate-x-0 pointer-events-auto'
        }`}
      >
        {/* Divisor interactivo en el borde derecho */}
        <div
          onClick={toggleCollapsed}
          title={t('collapse')}
          className="group absolute top-0 bottom-0 -right-1.5 w-3 cursor-col-resize z-50 select-none"
        >
          <div className="w-[1.5px] h-full mx-auto transition-colors duration-200 group-hover:bg-gold-300/60" />
        </div>

        {/* Cabecera superior del Sidebar */}
        <div className="py-2.5 px-4 flex items-center justify-center shrink-0 border-b border-border/40">
          <BackToPortalButton id="portfolio-sidenav-back-to-portal" />
        </div>

        {/* Navegación Desktop */}
        {renderNavLinks('h-[38px]')}

        {/* Pie del Sidebar: Preferencias */}
        <div className="py-2 px-4 flex items-center justify-center shrink-0 border-t border-border/40">
          <PortfolioPreferences prefixId="portfolio-sidenav" />
        </div>
      </aside>

      {/* Drawer Móvil Deslizable (< lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop con desenfoque suave */}
          <div
            onClick={closeMobile}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity cursor-pointer animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Panel lateral del Drawer móvil: ancho calibrado a 220px para holgura táctil equilibrada */}
          <aside
            aria-label={t('ariaLabel')}
            className="fixed top-0 bottom-0 left-0 z-50 w-[220px] max-w-[75vw] bg-background/98 backdrop-blur-md border-r border-border/40 shadow-2xl flex flex-col select-none animate-in slide-in-from-left duration-300"
          >
            {/* Cabecera del Drawer móvil: Misma tipografía, tamaño y tracking que el modo PC */}
            <div className="py-2.5 px-4 flex items-center justify-center shrink-0 border-b border-border/40">
              <span className="text-xs font-mono tracking-wider uppercase text-foreground/75 text-center select-none">
                JORGE DOICELA
              </span>
            </div>

            {/* Navegación móvil homologada al ritmo y dimensiones de PC */}
            {renderNavLinks('h-[38px]')}

            {/* Pie del Drawer móvil: Preferencias homologado al modo PC */}
            <div className="py-2 px-4 flex items-center justify-center shrink-0 border-t border-border/40">
              <PortfolioPreferences prefixId="portfolio-mobile-drawer" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
