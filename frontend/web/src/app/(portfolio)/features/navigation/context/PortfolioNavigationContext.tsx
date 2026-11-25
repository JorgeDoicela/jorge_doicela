'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PORTFOLIO_NAV_ITEMS, SIDENAV_STORAGE_KEY } from '../config/navItems';
import {
  getPortfolioHomeHref,
  isPortfolioHomePath,
  resolvePortfolioHref,
} from '../../../shared';
import type { PortfolioNavItem } from '../types';

interface PortfolioNavigationContextValue {
  items: readonly PortfolioNavItem[];
  activeId: string;
  isCollapsed: boolean;
  isHydrated: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
  navigateTo: (item: PortfolioNavItem) => void;
}

const PortfolioNavigationContext = createContext<PortfolioNavigationContextValue | null>(null);

function resolveActiveIdFromPath(pathname: string): string {
  if (isPortfolioHomePath(pathname)) {
    return 'home';
  }
  const matchedRoute = PORTFOLIO_NAV_ITEMS.find(
    (item) =>
      item.kind === 'route' &&
      item.href !== '/' &&
      (pathname === item.href ||
        pathname.startsWith(`${item.href}/`) ||
        pathname === `/portfolio${item.href}` ||
        pathname.startsWith(`/portfolio${item.href}/`))
  );
  return matchedRoute ? matchedRoute.id : '';
}

export function PortfolioNavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = isPortfolioHomePath(pathname);
  const routeActiveId = resolveActiveIdFromPath(pathname);

  const [scrollSpyId, setScrollSpyId] = useState<string | null>(null);
  const activeId = isHome ? (scrollSpyId ?? routeActiveId) : routeActiveId;
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Hidratar preferencia de colapso desde localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SIDENAV_STORAGE_KEY);
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    } catch {
      // Ignorar entornos restringidos
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sincronizar data-portfolio-nav en <html> para que CSS anime el desplazamiento
  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.dataset.portfolioNav = isCollapsed ? 'collapsed' : 'expanded';
    return () => {
      delete document.documentElement.dataset.portfolioNav;
    };
  }, [isCollapsed, isHydrated]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(SIDENAV_STORAGE_KEY, String(next));
      } catch {
        // Ignorar entornos restringidos
      }
      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Bloquear scroll en body cuando el drawer móvil está abierto y permitir cierre con Escape
  useEffect(() => {
    if (!isMobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileOpen]);

  // Cerrar drawer móvil automáticamente al cambiar de ruta
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Sincronización opcional por scroll-spy cuando existan anclas kind: 'section' en Home
  useEffect(() => {
    setScrollSpyId(null);
    if (!isHome) return;

    const sectionItems = PORTFOLIO_NAV_ITEMS.filter(
      (item): item is Extract<PortfolioNavItem, { kind: 'section' }> => item.kind === 'section'
    );

    const elements = sectionItems
      .map((item) => document.getElementById(item.anchor))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const visibleMap = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleMap.set(entry.target.id, entry);
        }

        const visibleEntries = Array.from(visibleMap.values())
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length > 0) {
          setScrollSpyId(visibleEntries[0].target.id);
        } else {
          setScrollSpyId('home');
        }
      },
      {
        rootMargin: '-18% 0px -62% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    const handleScrollEdge = () => {
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 48) {
        const lastSection = sectionItems[sectionItems.length - 1];
        if (lastSection) setScrollSpyId(lastSection.id);
      } else if (window.scrollY < 80) {
        setScrollSpyId('home');
      }
    };

    window.addEventListener('scroll', handleScrollEdge, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollEdge);
    };
  }, [isHome, pathname]);

  const navigateTo = useCallback(
    (item: PortfolioNavItem) => {
      setIsMobileOpen(false);
      if (item.kind === 'route') {
        setScrollSpyId(null);
        router.push(resolvePortfolioHref(pathname, item.href));
        return;
      }

      if (isHome) {
        const target = document.getElementById(item.anchor);
        if (target) {
          setScrollSpyId(item.id);
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.replaceState(null, '', `#${item.anchor}`);
        }
        return;
      }

      const homeHref = getPortfolioHomeHref(pathname);
      router.push(`${homeHref}#${item.anchor}`);
    },
    [isHome, pathname, router]
  );

  return (
    <PortfolioNavigationContext.Provider
      value={{
        items: PORTFOLIO_NAV_ITEMS,
        activeId,
        isCollapsed,
        isHydrated,
        isMobileOpen,
        toggleCollapsed,
        toggleMobile,
        closeMobile,
        navigateTo,
      }}
    >
      {children}
    </PortfolioNavigationContext.Provider>
  );
}

export function usePortfolioNavigation(): PortfolioNavigationContextValue {
  const context = useContext(PortfolioNavigationContext);
  if (!context) {
    throw new Error('usePortfolioNavigation must be used within a PortfolioNavigationProvider');
  }
  return context;
}
