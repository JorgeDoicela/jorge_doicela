'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const tNav = useTranslations('Nav');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center transition-colors duration-400 pt-6 md:pt-10 pb-0">
      <div className="w-full max-w-[1490px] 2xl:max-w-[1620px] px-6 sm:px-6 lg:px-8 flex-1 pb-16 md:pb-24 space-y-6 sm:space-y-8">
        
        {/* Cabecera Editorial Reutilizable */}
        <SoftwareHeaderNav
          activeCategory={category}
          compact={false}
          backHref={categoryHref}
          backLabel={categoryLabel}
        />

        {/* Cuadrícula Principal (8 cols contenido unificado + 4 cols barra lateral) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Contenedor Editorial Unificado Continuo (Estilo MalwareTech) */}
          <article className="lg:col-span-8 p-6 sm:p-10 md:p-12 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-8 shadow-xl">
            
            {/* Cabecera del Artículo */}
            <header className="space-y-5">
              
              {/* Barra Jerárquica y Metadatos Contextuales (Propuesta 1: Integración Editorial) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs select-none">
                {/* Migas de Pan (Breadcrumbs) Embebidas */}
                <nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5 font-sans font-medium text-slate-500 dark:text-zinc-400">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-slate-500 dark:text-zinc-400 hover:text-[var(--foreground)] transition-colors py-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    title={tNav('home')}
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" aria-hidden="true" />
                    <span>{tNav('home')}</span>
                  </Link>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 shrink-0" aria-hidden="true" />

                  <Link
                    href={categoryHref}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors py-0.5 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  >
                    {categoryLabel}
                  </Link>

                  {breadcrumbs?.map((bc, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 shrink-0" aria-hidden="true" />
                      {bc.href ? (
                        <Link href={bc.href} className="hover:text-[var(--foreground)] transition-colors py-0.5">
                          {bc.label}
                        </Link>
                      ) : (
                        <span className="text-slate-700 dark:text-zinc-300 font-medium">{bc.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>

                {/* Separador de Metadatos y Fecha */}
                {date && (
                  <>
                    <span className="text-slate-300 dark:text-zinc-700" aria-hidden="true">•</span>
                    <time dateTime={date} className="font-mono text-slate-500 dark:text-zinc-400">
                      {date}
                    </time>
                  </>
                )}

                {/* Badge contextual opcional */}
                {badge && (
                  <div className="ml-auto">
                    {badge}
                  </div>
                )}
              </div>

              {/* Título Principal H1 */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] leading-[1.15] tracking-tight">
                {title}
              </h1>

              {/* Subtítulo / Extracto Destacado */}
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-normal dark:font-light leading-relaxed">
                  {subtitle}
                </p>
              )}

              {/* Firma del Autor solo texto (sin foto redundante) */}
              {author && (
                <div className="text-xs font-mono text-slate-500 dark:text-zinc-400 pt-1">
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
            <div className="leading-relaxed">
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
