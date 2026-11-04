'use client';

import React from 'react';

interface SmartSidebarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Sidebar editorial inteligente con límites físicos estrictos y desplazamiento fluido.
 *
 * Mantiene intacta la posición estética original anclada al fondo:
 * (lg:sticky lg:bottom-8 lg:self-end) sin barras de scroll ni recortes de tarjetas.
 *
 * Al situar el cursor sobre el sidebar y usar la rueda del ratón hacia arriba,
 * desplaza el contenido suavemente hacia abajo para revelar las tarjetas superiores.
 * Se detiene con precisión milimétrica en el margen superior de lectura (16px),
 * eliminando cualquier espacio en blanco vacío y conservando la posición sin retornos bruscos.
 */
export function SmartSidebar({ children, className = '' }: SmartSidebarProps) {
  const asideRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = React.useState(0);
  const offsetYRef = React.useRef(0);

  offsetYRef.current = offsetY;

  React.useEffect(() => {
    const aside = asideRef.current;
    const content = contentRef.current;
    if (!aside || !content) return;

    // Margen superior exacto de lectura (16px para alinear con la cuadrícula sin espacio en blanco)
    const TARGET_TOP = 16;

    const handleWheel = (e: WheelEvent) => {
      // Activo exclusivamente en resoluciones de escritorio (lg: >= 1024px)
      if (window.innerWidth < 1024) return;

      const firstChild = content.firstElementChild as HTMLElement | null;
      if (!firstChild) return;

      const currentFirstTop = firstChild.getBoundingClientRect().top;
      const currentOffset = offsetYRef.current;

      if (e.deltaY < 0) {
        // Rueda hacia arriba: desplazar contenido para revelar tarjetas superiores
        const distanceToTop = TARGET_TOP - currentFirstTop;

        if (distanceToTop > 0.5) {
          e.preventDefault();
          const step = Math.min(distanceToTop, Math.max(12, Math.abs(e.deltaY) * 0.7));
          setOffsetY((prev) => prev + step);
        }
      } else if (e.deltaY > 0) {
        // Rueda hacia abajo: retroceder hacia la posición inferior original (fondo exacto)
        if (currentOffset > 0) {
          e.preventDefault();
          const step = Math.min(currentOffset, Math.max(12, e.deltaY * 0.7));
          setOffsetY((prev) => Math.max(0, prev - step));
        }
      }
    };

    aside.addEventListener('wheel', handleWheel, { passive: false });

    // Cuando el usuario realiza scroll en la página principal:
    // Solo si el artículo sube tanto que el aside natural ya está arriba del todo, normalizar
    const handleWindowScroll = () => {
      const asideTop = aside.getBoundingClientRect().top;
      if (asideTop >= TARGET_TOP && offsetYRef.current > 0) {
        setOffsetY(0);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      aside.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  return (
    <aside ref={asideRef} className={className}>
      <div
        ref={contentRef}
        style={{
          transform: offsetY > 0 ? `translateY(${offsetY}px)` : undefined,
          transition: 'transform 80ms ease-out',
          willChange: offsetY > 0 ? 'transform' : undefined,
        }}
        className="space-y-6"
      >
        {children}
      </div>
    </aside>
  );
}

