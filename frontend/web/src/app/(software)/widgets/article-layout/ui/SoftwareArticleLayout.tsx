'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SoftwareHeaderNav } from '../../software-header/ui/SoftwareHeaderNav';
import { SoftwareFooter } from '../../software-footer/ui/SoftwareFooter';
import { AuthorSidebarCard } from './AuthorSidebarCard';
import { StayInformedCard } from './StayInformedCard';
import { FeaturedPostsSidebarCard } from './FeaturedPostsSidebarCard';
import { ExploreTopicsSidebarCard } from './ExploreTopicsSidebarCard';
import { SoftwareSection } from '../../category-nav/ui/CategoryNav';

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
  authorImage?: string;
  badge?: React.ReactNode;
  callout?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}

export function SoftwareArticleLayout({
  category,
  categoryLabel,
  categoryHref,
  title,
  subtitle,
  date,
  author,
  authorImage = '/software/logo/perfil.jpg',
  badge,
  callout,
  breadcrumbs,
  children,
}: SoftwareArticleLayoutProps) {
  const tNav = useTranslations('Nav');
  const tArticle = useTranslations('ArticleLayout');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

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

        {/* Cuadrícula Principal (8 cols contenido unificado + 4 cols barra lateral, o 12 cols expandido) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Contenedor Editorial Unificado Continuo (Estilo MalwareTech) */}
          <article
            className={`relative p-6 sm:p-10 md:p-12 rounded-3xl glass-convex-panel border border-black/5 dark:border-white/5 space-y-8 shadow-xl transition-all duration-300 ${
              isSidebarCollapsed ? 'lg:col-span-12' : 'lg:col-span-8'
            }`}
          >
            {/* Borde interactivo derecho sutil (cursor col-resize para alternar barra lateral) */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="hidden lg:block absolute top-0 -right-2 w-4 h-full cursor-col-resize z-20 focus:outline-none select-none"
              title={isSidebarCollapsed ? tArticle('restoreSidebar') : tArticle('expandReading')}
              aria-label={isSidebarCollapsed ? tArticle('restoreSidebar') : tArticle('expandReading')}
            />
            
            {/* Cabecera Editorial del Artículo (Hero Centrado con Divisor) */}
            <header className="space-y-6 text-center border-b border-black/5 dark:border-white/5 pb-8">
              
              {/* Barra Jerárquica de Navegación Centrada */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs select-none">
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

                {/* Badge contextual opcional */}
                {badge && (
                  <div className="inline-flex items-center ml-1">
                    {badge}
                  </div>
                )}
              </div>

              {/* Título Principal H1 Centrado */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[var(--header-title)] leading-[1.15] tracking-tight max-w-4xl mx-auto">
                {title}
              </h1>

              {/* Subtítulo / Extracto Destacado Centrado */}
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-normal dark:font-light leading-relaxed max-w-2xl mx-auto">
                  {subtitle}
                </p>
              )}

              {/* Byline Editorial Centrado: Autor, Avatar y Fecha */}
              {(author || date) && (
                <div className="flex items-center justify-center gap-3 pt-1 text-xs select-none">
                  {author && (
                    <div className="inline-flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden relative shrink-0 ring-1 ring-black/10 dark:ring-white/10 shadow-sm bg-black/5 dark:bg-white/10">
                        <Image
                          src={authorImage}
                          alt={author}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-900 dark:text-zinc-200">
                        {author}
                      </span>
                    </div>
                  )}

                  {author && date && (
                    <span className="text-slate-300 dark:text-zinc-700" aria-hidden="true">•</span>
                  )}

                  {date && (
                    <time dateTime={date} className="font-mono text-slate-500 dark:text-zinc-400">
                      {date}
                    </time>
                  )}
                </div>
              )}

              {/* Callout opcional (Avisos de seguridad, notas, CVE) */}
              {callout && (
                <div className="pt-2 text-left">
                  {callout}
                </div>
              )}
            </header>

            {/* Cuerpo del Artículo (Renderizado Fluido) */}
            <div className="leading-relaxed">
              {children}
            </div>
          </article>

          {/* Columna Derecha: Barra Lateral Fija (Sidebar con Jerarquía Editorial MalwareTech) */}
          {!isSidebarCollapsed && (
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 animate-in fade-in duration-300">
              {/* 1. Perfil y Biografía de Jorge Doicela */}
              <AuthorSidebarCard />

              {/* 2. Publicaciones Destacadas con Miniaturas (Inspiración MalwareTech) */}
              <FeaturedPostsSidebarCard />

              {/* 3. Explorador de Especialidades Técnicas con Contadores (Inspiración MalwareTech) */}
              <ExploreTopicsSidebarCard />

              {/* 4. Boletín / Mantente Informado */}
              <StayInformedCard />
            </aside>
          )}

        </div>

      </div>

      {/* Pie de Página de Ancho Completo */}
      <SoftwareFooter />
    </div>
  );
}
