'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { BackToPortalButton } from './BackToPortalButton';
import { CategoryNav, SoftwareSection } from '../features/navigation/components/CategoryNav';
import { LanguageToggle } from '../features/navigation/components/LanguageToggle';

interface SoftwareHeaderNavProps {
  activeCategory?: SoftwareSection;
  onSelectCategory?: (cat: SoftwareSection) => void;
  onOpenSpotlight?: () => void;
  compact?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function SoftwareHeaderNav({
  activeCategory = 'all',
  onSelectCategory,
  onOpenSpotlight,
  compact = false,
  backHref,
  backLabel,
}: SoftwareHeaderNavProps) {
  const tSpotlight = useTranslations('Spotlight');
  const [softwareUrl, setSoftwareUrl] = useState('/software');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      const port = window.location.port ? `:${window.location.port}` : '';
      const protocol = window.location.protocol;
      if (isLocal) {
        setSoftwareUrl(`${protocol}//software.localhost${port}/software`);
      } else {
        setSoftwareUrl('https://software.jorgedoicela.com');
      }
    }
  }, []);
  return (
    <header className="flex flex-col items-center justify-center pt-6 sm:pt-2 pb-4 text-center w-full">
      {/* Título semántico accesible para SEO */}
      <h1 className="sr-only">Software | Jorge Doicela - Especialista en DevSecOps</h1>

      {/* Logotipo Central Compuesto Ampliado (Linkeado determinísticamente al subdominio de Software) */}
      <Link
        href={softwareUrl}
        onClick={() => {
          if (onSelectCategory) {
            onSelectCategory('all');
          }
        }}
        className="flex items-center justify-center gap-3 sm:gap-4.5 select-none hover:opacity-90 transition-opacity max-w-full px-2 sm:px-0"
      >
        <div className={`${compact ? 'h-15 sm:h-16' : 'h-23 sm:h-22 md:h-25 lg:h-28'} w-auto flex items-center justify-center shrink-0`}>
          <Image
            src="/software/logo/logo_blanco.png"
            alt="Logo Jorge Doicela"
            width={128}
            height={128}
            className="h-full w-auto object-contain"
            unoptimized
            priority
          />
        </div>
        <div className={`${compact ? 'h-10 sm:h-10' : 'h-14 sm:h-13 md:h-16 lg:h-[72px]'} w-auto flex items-center justify-center`}>
          <Image
            src="/software/logo/nombre_rol.png"
            alt="Jorge Doicela - Especialista en DevSecOps"
            width={340}
            height={80}
            className="h-full w-auto object-contain"
            unoptimized
            priority
          />
        </div>
      </Link>

      {/* Fila de Redes Sociales Libres y Limpias en Blanco (Pegadas al imagotipo) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 mb-3 sm:mt-1.5 sm:mb-0 flex-wrap px-2 sm:px-0">
        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/jorgedoicela"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="LinkedIn"
          aria-label="LinkedIn"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/JorgeDoicela"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="GitHub"
          aria-label="GitHub"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        {/* X (Twitter) */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="X (Twitter)"
          aria-label="X (Twitter)"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* Instagram */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="Instagram"
          aria-label="Instagram"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="Facebook"
          aria-label="Facebook"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@jorge.doicela"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="YouTube"
          aria-label="YouTube"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>

        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@jorge.doicela"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="TikTok"
          aria-label="TikTok"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.6c3.5 0 6.34-2.84 6.34-6.33V8.86c1.33.95 2.94 1.5 4.68 1.55v-3.48c-.26-.01-.52-.09-.77-.24z" />
          </svg>
        </a>

        {/* Email */}
        <a
          href="mailto:jorge.doicela.m@gmail.com"
          className="text-white hover:text-zinc-300 transition-all duration-200 hover:scale-110 p-1 sm:p-0.5 rounded-lg hover:bg-white/5"
          title="Email"
          aria-label="Email"
        >
          <svg className="w-[21px] h-[21px] sm:w-[22px] sm:h-[22px] fill-none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>

      {/* Barra de Navegación Unificada en Cápsula Cóncava a Ancho Completo */}
      <div className="mt-8 sm:mt-10 w-full py-2.5 sm:py-3 px-3 sm:px-4 min-h-[54px] sm:min-h-[58px] rounded-2xl glass-concave-panel flex items-center justify-between gap-2.5 sm:gap-3">
        <div className="shrink-0 min-w-[90px] sm:min-w-[110px] flex items-center justify-start">
          <BackToPortalButton href={backHref} label={backLabel} />
        </div>
        <div className="flex-1 flex justify-center min-w-0 overflow-x-auto scrollbar-none">
          <CategoryNav
            selectedCategory={activeCategory}
            onSelectCategory={onSelectCategory}
            bare={true}
          />
        </div>
        <div className="shrink-0 min-w-[90px] sm:min-w-[110px] flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              if (onOpenSpotlight) {
                onOpenSpotlight();
              } else if (typeof window !== 'undefined') {
                window.location.href = '/software?spotlight=true';
              }
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-zinc-400 hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            title={tSpotlight('searchTitle')}
            aria-label={tSpotlight('searchAria')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
