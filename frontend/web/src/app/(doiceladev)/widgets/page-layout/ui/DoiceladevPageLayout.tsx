'use client';

import React from 'react';
import { DoiceladevHeaderNav } from '../../doiceladev-header/ui/DoiceladevHeaderNav';
import { DoiceladevFooter } from '../../doiceladev-footer/ui/DoiceladevFooter';
import { DoiceladevSection } from '../../category-nav/ui/CategoryNav';

export interface DoiceladevPageLayoutProps {
  activeCategory?: DoiceladevSection;
  backHref?: string;
  backLabel?: string;
  compact?: boolean;
  onOpenSpotlight?: () => void;
  className?: string;
  children: React.ReactNode;
}


/**
 * Shell maestro unificado para todas las pantallas de DoicelaDev.
 * Garantiza consistencia en modo claro (Titanio) y oscuro (Obsidiana),
 * suministrando navegación, alternancia de tema, buscador, idioma y footer.
 */
export function DoiceladevPageLayout({
  activeCategory = 'all',
  backHref,
  backLabel,
  compact = false,
  onOpenSpotlight,
  className = '',
  children,
}: DoiceladevPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className={`w-full max-w-[1490px] 2xl:max-w-[1620px] px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10 flex-1 pb-16 md:pb-24 ${className}`}>
        {/* Cabecera Editorial Reutilizable */}
        <DoiceladevHeaderNav
          activeCategory={activeCategory}
          backHref={backHref}
          backLabel={backLabel}
          compact={compact}
          onOpenSpotlight={onOpenSpotlight}
        />

        {/* Contenido Dinámico de la Pantalla */}
        {children}
      </div>

      {/* Pie de Página Unificado */}
      <DoiceladevFooter />
    </div>
  );
}

