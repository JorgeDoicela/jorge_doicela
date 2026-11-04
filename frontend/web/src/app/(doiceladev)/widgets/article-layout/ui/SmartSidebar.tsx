'use client';

import React from 'react';

interface SmartSidebarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Sidebar editorial inteligente de alto rendimiento con sincronización directa al DOM.
 *
 * Mantiene intacto el anclaje estético al fondo (lg:sticky lg:bottom-8 lg:self-end)
 * sin barras de scroll visibles ni contenedores rígidos con overflow.
 *
 * Elimina cualquier rebote, temblor o desfase visual al coordinar directamente
 * los estilos transform con el ciclo de refresco del navegador (sin la latencia
 * de re-renderizado asíncrono de React y sin transiciones CSS compitiendo con el
 * scroll nativo de la página).
 */
export function SmartSidebar({ children, className = '' }: SmartSidebarProps) {
  const asideRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const offsetYRef = React.useRef(0);
  const wheelTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const aside = asideRef.current;
    const content = contentRef.current;
    if (!aside || !content) return;

    const TARGET_TOP = 24;

    const applyOffset = (newOffset: number, withTransition: boolean) => {
      offsetYRef.current = newOffset;
      content.style.transition = withTransition ? 'transform 70ms ease-out' : 'none';
      content.style.transform = newOffset > 0 ? `translate3d(0, ${newOffset}px, 0)` : '';
      content.style.willChange = newOffset > 0 ? 'transform' : '';
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;

      const asideTop = aside.getBoundingClientRect().top;
      const maxOffset = Math.max(0, TARGET_TOP - asideTop);
      const currentOffset = offsetYRef.current;

      if (e.deltaY < 0) {
        // Rueda hacia arriba: desplazar hacia abajo para revelar tarjetas superiores
        if (currentOffset < maxOffset - 0.5) {
          e.preventDefault();
          const nextOffset = Math.min(maxOffset, currentOffset + Math.abs(e.deltaY) * 0.85);
          applyOffset(nextOffset, true);

          if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
          wheelTimeoutRef.current = setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = 'none';
            }
          }, 80);
        }
      } else if (e.deltaY > 0) {
        // Rueda hacia abajo: retroceder hacia la posición inferior natural
        if (currentOffset > 0.5) {
          e.preventDefault();
          const nextOffset = Math.max(0, Math.min(maxOffset, currentOffset - e.deltaY * 0.85));
          applyOffset(nextOffset, true);

          if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
          wheelTimeoutRef.current = setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = 'none';
            }
          }, 80);
        }
      }
    };

    // Al scrollear la página principal, bloquear cualquier transición y fijar al píxel exacto
    const handleWindowScroll = () => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      if (offsetYRef.current <= 0) return;

      const asideTop = aside.getBoundingClientRect().top;
      const maxOffset = Math.max(0, TARGET_TOP - asideTop);

      if (offsetYRef.current > maxOffset) {
        applyOffset(maxOffset, false);
      }
    };

    aside.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    window.addEventListener('resize', handleWindowScroll, { passive: true });

    return () => {
      aside.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleWindowScroll);
      window.removeEventListener('resize', handleWindowScroll);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
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
