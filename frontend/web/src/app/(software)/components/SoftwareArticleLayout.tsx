'use client';

import React from 'react';
import Link from 'next/link';
import { SoftwareHeaderNav } from './SoftwareHeaderNav';
import { SoftwareFooter } from './SoftwareFooter';
import { AuthorSidebarCard } from './AuthorSidebarCard';
import { StayInformedCard } from './StayInformedCard';
import { SoftwareSection } from '../features/navigation/components/CategoryNav';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SoftwareArticleLayoutProps {
  category: SoftwareSection;
  categoryLabel: string;
  categoryHref: string;
  title: string;
  subtitle?: string;
  date?: string;
  author?: string;
  badge?: React.ReactNode;
  callout?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  extraSidebarCard?: React.ReactNode;
  children: React.ReactNode;
}

export function SoftwareArticleLayout({
  category,
  categoryLabel,
  categoryHref,
  title,
  subtitle,
  date,
  author = 'Jorge Doicela',
  badge,
  callout,
  breadcrumbs,
  extraSidebarCard,
  children,
}: SoftwareArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] px-6 sm:px-6 lg:px-8 2xl:px-12 flex-1 pb-16 md:pb-24 space-y-6 sm:space-y-8">
        
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory={category}
          compact={false}
          backHref={categoryHref}
          backLabel={categoryLabel}
        />

        {/* Migas de Pan (Breadcrumbs) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-500 overflow-x-auto scrollbar-none py-1">
          <Link href="/software" className="hover:text-[var(--foreground)] transition-colors">
            Software
          </Link>
          <span>/</span>
          <Link href={categoryHref} className="hover:text-[var(--foreground)] transition-colors">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-[240px] sm:max-w-md">{title}</span>
        </nav>

        {/* Cuadrícula Principal (8 cols contenido unificado + 4 cols barra lateral) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Contenedor Editorial Unificado Continuo (Estilo MalwareTech) */}
          <article className="lg:col-span-8 p-6 sm:p-10 md:p-12 rounded-3xl glass-convex-panel border border-white/5 space-y-8 shadow-2xl">
            
            {/* Cabecera del Artículo */}
            <header className="space-y-4 pb-6 border-b border-black/5 dark:border-white/5">
              {/* Fecha superior limpia */}
              {date && (
                <div className="text-xs font-mono text-zinc-400">
                  <time>{date}</time>
                </div>
              )}

              {/* Título Principal H1 */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] leading-[1.15] tracking-tight">
                {title}
              </h1>

              {/* Subtítulo / Extracto Destacado */}
              {subtitle && (
                <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Firma del Autor solo texto (sin foto redundante) */}
              {author && (
                <div className="text-xs font-mono text-zinc-400 pt-1">
                  <span>{author}</span>
                </div>
              )}

              {/* Callout opcional (Avisos de seguridad, notas, CVE) */}
              {callout && (
                <div className="pt-2">
                  {callout}
                </div>
              )}
            </header>

            {/* Cuerpo del Artículo (Renderizado Fluido) */}
            <div className="pt-2 leading-relaxed">
              {children}
            </div>
          </article>

          {/* Columna Derecha: Barra Lateral Fija (Sidebar) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Tarjeta 1: Stay Informed / Boletín de Suscripción */}
            <StayInformedCard />

            {/* Tarjeta 2: Perfil y Biografía de Jorge Doicela */}
            <AuthorSidebarCard />

            {/* Tarjeta 3: Ficha Técnica Opcional (Específica de cada categoría) */}
            {extraSidebarCard}
          </aside>

        </div>

      </div>

      {/* Pie de Página de Ancho Completo */}
      <SoftwareFooter />
    </div>
  );
}
