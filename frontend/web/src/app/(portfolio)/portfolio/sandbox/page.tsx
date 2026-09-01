'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Terminal } from 'lucide-react';
import { SandboxTerminal } from '../../features/terminal/components/SandboxTerminal';
import { LanguageToggle } from '../../components/LanguageToggle';
import { ThemeToggle } from '../../components/ThemeToggle';

function SandboxStandaloneContent() {
  const t = useTranslations('SandboxStandalone');
  const searchParams = useSearchParams();
  const rawMode = searchParams.get('mode');
  const targetMode: 'vps' | 'tunnel' = rawMode === 'tunnel' ? 'tunnel' : 'vps';

  return (
    <main className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden select-none">
      {/* Barra de Navegación Superior CloudShell Dark Luxury */}
      <header className="h-12 border-b border-border-gold bg-surface-raised px-4 flex items-center justify-between shrink-0 z-20">
        {/* Lado izquierdo: Retorno y Título */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-gold-200 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">{t('backToPortfolio')}</span>
          </Link>

          <div className="h-4 w-px bg-border-gold hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-surface border border-border-gold flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-gold-300" />
            </div>
            <span className="text-xs font-medium font-mono text-foreground tracking-tight">
              {t('pageTitle')}
            </span>
          </div>
        </div>

        {/* Lado derecho: Toggles de Idioma y Tema */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Terminal Linux Sandbox a Pantalla Completa */}
      <div className="flex-1 w-full min-h-0 overflow-hidden bg-background flex flex-col">
        <SandboxTerminal isFullscreen={true} targetMode={targetMode} />
      </div>
    </main>
  );
}

export default function SandboxStandalonePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-background" />}>
      <SandboxStandaloneContent />
    </Suspense>
  );
}
