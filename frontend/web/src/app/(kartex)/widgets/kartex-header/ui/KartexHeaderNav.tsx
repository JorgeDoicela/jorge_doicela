'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { KartexLogo, BackToKartexButton } from '../../../shared/ui';
import { ThemeToggle } from '../../../features/theme-toggle';
import { LanguageToggle } from '../../../features/language-toggle';
import { useKartexPassageSafe } from '../../../entities/passage';
import { KartexAudioControlsPopover } from '../../../features/verses';
import { ChevronDown, Check, Volume2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NavTabItem {
  path: string;
  key: string;
}

const NAV_TABS: NavTabItem[] = [
  { path: '/study/standard', key: 'standard' },
  { path: '/study/parallel', key: 'parallel' },
  { path: '/study/interlinear', key: 'interlinear' },
  { path: '/study/word-study', key: 'wordStudy' },
  { path: '/study/commentaries', key: 'commentaries' },
  { path: '/study/dictionaries', key: 'dictionaries' },
  { path: '/study/atlas', key: 'atlas' },
  { path: '/study/timeline', key: 'timeline' },
  { path: '/study/archaeology', key: 'archaeology' },
  { path: '/study/evangelism', key: 'evangelism' },
];

interface KartexHeaderNavProps {
  isVisible?: boolean;
}

export const KartexHeaderNav: React.FC<KartexHeaderNavProps> = ({ isVisible = true }) => {
  const t = useTranslations('Nav');
  const pathname = usePathname() || '';
  const passageContext = useKartexPassageSafe();

  const searchParams = useSearchParams();
  const queryString = React.useMemo(() => {
    if (passageContext?.selectedBookId && passageContext?.selectedChapter) {
      const trans = passageContext.selectedTranslationId ? `&trans=${passageContext.selectedTranslationId}` : '';
      return `?book=${passageContext.selectedBookId}&chapter=${passageContext.selectedChapter}${trans}`;
    }
    return searchParams?.toString() ? `?${searchParams.toString()}` : '';
  }, [passageContext?.selectedBookId, passageContext?.selectedChapter, passageContext?.selectedTranslationId, searchParams]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [audioSheetOpen, setAudioSheetOpen] = useState(false);
  const audioNavRef = useRef<HTMLDivElement>(null);
  const [homeUrl, setHomeUrl] = useState('/');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      const isSubdomain = hostname.startsWith('kartex.');
      setHomeUrl(isSubdomain ? '/' : '/kartex');
    }
  }, []);

  const isCurrentTab = (tabPath: string) => {
    if (tabPath === '/study/standard') {
      return (
        pathname === '/study/standard' ||
        pathname === '/study' ||
        pathname === '/kartex/study/standard' ||
        pathname === '/kartex/study' ||
        pathname.startsWith('/study/standard/') ||
        pathname.startsWith('/kartex/study/standard/')
      );
    }
    const clean = tabPath;
    const kartexPrefixed = `/kartex${tabPath}`;

    return (
      pathname === clean ||
      pathname.startsWith(`${clean}/`) ||
      pathname === kartexPrefixed ||
      pathname.startsWith(`${kartexPrefixed}/`)
    );
  };

  const activeTab = NAV_TABS.find((tab) => isCurrentTab(tab.path)) || NAV_TABS[0];

  // Cerrar menús flotantes al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (audioNavRef.current && !audioNavRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement | null;
        if (target && target.closest('[data-kartex-audio-modal]')) {
          return;
        }
        setAudioSheetOpen(false);
      }
    };
    if (mobileMenuOpen || audioSheetOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [mobileMenuOpen, audioSheetOpen]);

  // Si la cabecera se oculta, cerrar menús desplegables
  useEffect(() => {
    if (!isVisible) {
      setMobileMenuOpen(false);
      setAudioSheetOpen(false);
    }
  }, [isVisible]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 h-14 border-b border-border/80 bg-background/90 dark:bg-card-bg/95 backdrop-blur-xl shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] print:hidden select-none ${
        isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none lg:translate-y-0 lg:pointer-events-auto'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">

        {/* Izquierda: Retorno al Inicio de la Biblia y Logotipo */}
        <div className="shrink-0 flex items-center gap-2 sm:gap-2.5">
          <BackToKartexButton />
          <Link
            href={homeUrl}
            className="shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity p-0.5 rounded-md hover:bg-accents-1 group"
            title={t('landing')}
            aria-label={t('landing')}
          >
            <KartexLogo size={20} className="group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        {/* Móvil: Menú Desplegable Flotante Elegante (< md) Centrado Simétricamente */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-inner-card/90 text-foreground text-xs font-medium cursor-pointer shadow-2xs active:scale-95 transition-all"
            aria-expanded={mobileMenuOpen}
            aria-label={t('studyMode')}
          >
            <span className="truncate max-w-[140px]">{t(activeTab.key as any)}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-accents-4 shrink-0 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menú Flotante Móvil Centrado */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-60 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-border bg-card-bg shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-mono uppercase tracking-wider text-accents-4 px-2 py-1">
                {t('studyMode')}
              </div>
              <div className="flex flex-col gap-0.5">
                {NAV_TABS.map((tab) => {
                  const active = isCurrentTab(tab.path);
                  return (
                    <Link
                      key={tab.path}
                      href={`${tab.path}${queryString}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        active
                          ? 'bg-foreground text-background font-medium'
                          : 'text-accents-5 hover:text-foreground hover:bg-accents-1'
                      }`}
                    >
                      <span>{t(tab.key as any)}</span>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Pestañas de Navegación Geist Planas (Centrado Geométrico Absoluto en Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center h-full select-none pointer-events-auto">
          <nav className="flex items-center h-full gap-0.5">
            {NAV_TABS.map((tab) => {
              const active = isCurrentTab(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={`${tab.path}${queryString}`}
                  className={`relative flex items-center h-full px-3 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0 ${
                    active
                      ? 'text-foreground font-semibold'
                      : 'text-accents-5 hover:text-foreground'
                  }`}
                >
                  <span>{t(tab.key as any)}</span>
                  {active && (
                    <span className="absolute -bottom-[1px] inset-x-1.5 h-[2px] bg-foreground rounded-t-sm z-10" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tablet (< lg y >= md): Fallback elástico para pantallas intermedias sin desborde */}
        <div className="hidden md:flex lg:hidden flex-1 justify-center items-center h-full min-w-0 px-2 select-none">
          <nav className="flex items-center h-full gap-0.5 overflow-x-auto scrollbar-none">
            {NAV_TABS.map((tab) => {
              const active = isCurrentTab(tab.path);
              return (
                <Link
                  key={tab.path}
                  href={`${tab.path}${queryString}`}
                  className={`relative flex items-center h-full px-2 text-xs font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer shrink-0 ${
                    active
                      ? 'text-foreground font-semibold'
                      : 'text-accents-5 hover:text-foreground'
                  }`}
                >
                  <span>{t(tab.key as any)}</span>
                  {active && (
                    <span className="absolute -bottom-[1px] inset-x-1 h-[2px] bg-foreground rounded-t-sm z-10" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Derecha: Audio Bíblico, Selector de Idioma y Tema */}
        <div className="shrink-0 flex items-center gap-1 sm:gap-2 pl-1">
          {passageContext && (
            <div className={`relative ${audioSheetOpen ? 'z-50' : ''}`} ref={audioNavRef}>
              <button
                type="button"
                onClick={() => setAudioSheetOpen((prev) => !prev)}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1 active:scale-95 ${
                  audioSheetOpen || passageContext.isPlayingAudio
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
                title="Audio Bíblico"
                aria-label="Controles de audio bíblico"
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                {passageContext.isPlayingAudio && (
                  <span className="font-semibold text-[11px] font-mono hidden xs:inline">
                    {passageContext.currentAudioVerse ? `v.${passageContext.currentAudioVerse}` : 'Audio'}
                  </span>
                )}
              </button>

              <KartexAudioControlsPopover
                isOpen={audioSheetOpen}
                onClose={() => setAudioSheetOpen(false)}
                align="right"
              />
            </div>
          )}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
