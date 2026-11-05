'use client';

import React from 'react';

export interface SmartSidebarProps {
  children: React.ReactNode;
  className?: string;
}

const DESKTOP_BREAKPOINT = 1024;
const TOP_VIEWPORT_MARGIN = 24;
const LINE_HEIGHT_PX = 33;

/**
 * Sidebar editorial inteligente con sincronización de frame atómica.
 *
 * Mantiene el anclaje al fondo (lg:sticky lg:bottom-8 lg:self-end) y permite
 * revelar las tarjetas superiores con la rueda del ratón paso a paso.
 *
 * Cuando el cursor está sobre el panel y se alcanza el límite superior o inferior,
 * el desplazamiento de la ventana (`window.scrollBy`) y el ajuste de `transform`
 * se ejecutan de forma 100% síncrona en el mismo ciclo de pintado, eliminando
 * cualquier desfase de 1 frame entre el compositor del navegador y `window.scroll`.
 */
export function SmartSidebar({ children, className = '' }: SmartSidebarProps) {
  const asideRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const offsetYRef = React.useRef(0);
  const isPinnedToTopRef = React.useRef(false);
  const wheelTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const aside = asideRef.current;
    const content = contentRef.current;
    if (!aside || !content) return;

    const getMaxOffset = (): number => {
      const grid = aside.parentElement;
      const gridTop = grid ? grid.getBoundingClientRect().top : TOP_VIEWPORT_MARGIN;
      const targetTop = Math.max(TOP_VIEWPORT_MARGIN, gridTop);
      const asideTop = aside.getBoundingClientRect().top;
      return Math.max(0, targetTop - asideTop);
    };

    const applyOffset = (newOffset: number, withTransition: boolean): void => {
      offsetYRef.current = newOffset;
      content.style.transition = withTransition
        ? 'transform 60ms cubic-bezier(0.25, 1, 0.5, 1)'
        : 'none';
      content.style.transform = newOffset > 0.5 ? `translate3d(0, ${newOffset}px, 0)` : '';
      content.style.willChange = newOffset > 0.5 ? 'transform' : '';
    };

    const normalizeWheelDelta = (e: WheelEvent): number => {
      if (e.deltaMode === 1) return e.deltaY * LINE_HEIGHT_PX;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
      return e.deltaY;
    };

    const scheduleTransitionReset = (): void => {
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'none';
        }
      }, 70);
    };

    const handleWheel = (e: WheelEvent): void => {
      // Respetar el zoom nativo del navegador (Ctrl/Cmd + Rueda) y vistas móviles/tablet
      if (e.ctrlKey || e.metaKey || window.innerWidth < DESKTOP_BREAKPOINT) return;

      const deltaY = normalizeWheelDelta(e);
      if (deltaY === 0) return;

      const maxOffset = getMaxOffset();
      const currentOffset = offsetYRef.current;

      if (deltaY < 0) {
        // Rueda hacia arriba: desplazar el sidebar hacia abajo para revelar tarjetas superiores
        e.preventDefault();

        const step = Math.max(16, Math.abs(deltaY) * 0.85);

        if (currentOffset + step < maxOffset - 0.5) {
          isPinnedToTopRef.current = false;
          applyOffset(currentOffset + step, true);
          scheduleTransitionReset();
        } else {
          isPinnedToTopRef.current = true;
          if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);

          const remainingSidebarMove = Math.max(0, maxOffset - currentOffset);
          const pageScrollDelta = deltaY + remainingSidebarMove;

          if (pageScrollDelta < 0 && window.scrollY > 0) {
            window.scrollBy({ top: pageScrollDelta, behavior: 'instant' });
          }

          applyOffset(getMaxOffset(), false);
        }
      } else {
        // Rueda hacia abajo: regresar el sidebar hacia su anclaje inferior natural
        isPinnedToTopRef.current = false;

        if (currentOffset > 0.5) {
          e.preventDefault();

          const step = Math.max(16, deltaY * 0.85);

          if (currentOffset - step > 0.5) {
            applyOffset(Math.min(maxOffset, currentOffset - step), true);
            scheduleTransitionReset();
          } else {
            if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);

            const pageScrollDelta = deltaY - currentOffset;
            applyOffset(0, false);

            if (pageScrollDelta > 0) {
              window.scrollBy({ top: pageScrollDelta, behavior: 'instant' });
            }
          }
        } else if (currentOffset !== 0) {
          applyOffset(0, false);
        }
      }
    };

    const handleWindowScroll = (): void => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      if (offsetYRef.current <= 0) return;

      const maxOffset = getMaxOffset();

      // Si el sidebar ya había alcanzado el tope, sincronizar continuamente su transform con el
      // movimiento del contenedor para evitar saltos o despegues hacia abajo al subir la página.
      const isAtTop = isPinnedToTopRef.current || Math.abs(offsetYRef.current - maxOffset) < 2;

      if (isAtTop) {
        isPinnedToTopRef.current = true;
        applyOffset(maxOffset, false);
      } else if (offsetYRef.current > maxOffset) {
        applyOffset(maxOffset, false);
      }
    };

    const handleWindowWheel = (e: WheelEvent): void => {
      // Aplicar el mismo mecanismo atómico del commit 7f68e35c a toda la pantalla:
      if (e.ctrlKey || e.metaKey || window.innerWidth < DESKTOP_BREAKPOINT) return;
      if (offsetYRef.current <= 0) return;
      if (aside.contains(e.target as Node)) return; // Ya lo atiende handleWheel

      const deltaY = normalizeWheelDelta(e);
      if (deltaY >= 0) return; // Solo hacia arriba cuando el sidebar ya está en el tope

      const maxOffset = getMaxOffset();
      const isAtTop = isPinnedToTopRef.current || Math.abs(offsetYRef.current - maxOffset) < 3;

      if (isAtTop && window.scrollY > 0) {
        // Bloquear el scroll desacoplado del navegador y sincronizar síncronamente en el mismo frame
        e.preventDefault();
        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);

        isPinnedToTopRef.current = true;
        window.scrollBy({ top: deltaY, behavior: 'instant' });
        applyOffset(getMaxOffset(), false);
      }
    };

    const handleResize = (): void => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        isPinnedToTopRef.current = false;
        if (offsetYRef.current !== 0) {
          applyOffset(0, false);
        }
        return;
      }
      handleWindowScroll();
    };

    aside.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('wheel', handleWindowWheel, { passive: false });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      aside.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', handleWindowWheel);
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleResize);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      content.style.transition = '';
      content.style.transform = '';
      content.style.willChange = '';
    };
  }, []);

  return (
    <aside ref={asideRef} className={className}>
      <div ref={contentRef} className="space-y-6">
        {children}
      </div>
    </aside>
  );
}
