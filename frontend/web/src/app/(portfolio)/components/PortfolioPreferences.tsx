'use client';

import React from 'react';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

export interface PortfolioPreferencesProps {
  className?: string;
  prefixId?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * PortfolioPreferences
 * Componente modular y reutilizable de alto nivel que encapsula los controles
 * de preferencias globales de la interfaz (selector de idioma y cambio de tema claro/oscuro).
 * Garantiza consistencia visual, accesibilidad semántica e IDs desacoplados en cualquier contenedor.
 */
export function PortfolioPreferences({
  className = '',
  prefixId = 'pref',
  orientation = 'horizontal',
}: PortfolioPreferencesProps) {
  return (
    <div
      className={`flex items-center ${
        orientation === 'vertical' ? 'flex-col gap-2' : 'gap-1.5 sm:gap-2'
      } ${className}`}
      role="group"
      aria-label="Preferencias de interfaz"
    >
      <LanguageToggle id={`${prefixId}-language-toggle`} />
      <ThemeToggle id={`${prefixId}-theme-toggle`} />
    </div>
  );
}
