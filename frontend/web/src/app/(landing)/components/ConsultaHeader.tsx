'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from 'next-intl';

export function ConsultaHeader() {
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslations('Consulta');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('landing-theme') as 'dark' | 'light' | null;
    const initialTheme =
      savedTheme ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const updateQuitoTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat(language === 'es' ? 'es-EC' : 'en-US', {
        timeZone: 'America/Guayaquil',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setTime(formatted);
    };

    updateQuitoTime();
    const timer = setInterval(updateQuitoTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('landing-theme', nextTheme);
    const isLight = nextTheme === 'light';
    document.documentElement.classList.toggle('light', isLight);
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <header
      className="animate-fade-in-up fixed top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 md:top-7 md:left-10 md:right-10 z-50 flex items-center justify-between pointer-events-none"
      style={{ animationDelay: '0ms' }}
    >
      {/* Controles Izquierda */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Jorge Doicela - Inicio"
        >
          <Image
            src={theme === 'dark' ? '/landing/logo/logo_blanco.png' : '/landing/logo/logo_negro.png'}
            alt="Jorge Doicela"
            width={28}
            height={28}
            className="h-5 sm:h-6 w-auto object-contain"
            priority
          />
        </Link>

        <div className="w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />

        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-foreground/5 cursor-pointer active:scale-95"
          aria-label={t('backHome')}
        >
          <span>←</span>
          <span className="hidden sm:inline">{t('backHome')}</span>
          <span className="inline sm:hidden">{language === 'es' ? 'Volver' : 'Back'}</span>
        </Link>
      </div>

      {/* Controles Derecha */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Reloj Quito */}
        <div className="hidden sm:flex flex-col items-end text-right font-mono" aria-label={`Hora local en Quito: ${time || '--:--:--'}`}>
          <span className="text-xs text-text-muted font-normal tracking-wider tabular-nums">{time || '--:--:--'}</span>
          <span className="text-[8px] text-text-subtitle/70 uppercase tracking-widest">Quito, Ecuador</span>
        </div>

        <div className="hidden sm:block w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />

        {/* Selector de Idioma */}
        <button
          onClick={toggleLanguage}
          className="px-2 py-1 rounded-md text-text-muted hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-colors duration-200 cursor-pointer text-xs font-medium tracking-tight"
          aria-label="Cambiar idioma / Change language"
        >
          <span>{language.toUpperCase()}</span>
        </button>

        {/* Selector de Tema */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-text-muted hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            aria-label="Cambiar tema / Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 opacity-70 hover:opacity-100 hover:text-amber-400 transition-all duration-200" />
            ) : (
              <Moon className="w-3.5 h-3.5 opacity-70 hover:opacity-100 hover:text-foreground transition-all duration-200" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}


