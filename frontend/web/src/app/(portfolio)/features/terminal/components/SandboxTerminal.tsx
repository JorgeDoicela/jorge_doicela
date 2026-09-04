'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Play,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  X,
  Copy,
  ClipboardPaste,
  Check,
} from 'lucide-react';
import { useSandboxTerminal } from '../hooks/useSandboxTerminal';
import { ServerOfflineBanner } from './ServerOfflineBanner';
import { LanguageToggle } from '../../../components/LanguageToggle';
import { ThemeToggle } from '../../../components/ThemeToggle';
import '@xterm/xterm/css/xterm.css';

interface SandboxTerminalProps {
  isFullscreen?: boolean;
  targetMode?: 'vps' | 'tunnel';
}

export const SandboxTerminal: React.FC<SandboxTerminalProps> = ({
  isFullscreen = false,
  targetMode = 'vps',
}) => {
  const t = useTranslations('SandboxTerminal');
  const tStandalone = useTranslations('SandboxStandalone');
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);
  const [pastedFeedback, setPastedFeedback] = useState<boolean>(false);

  const {
    terminalRef,
    initTerminal,
    status,
    errorMessage,
    remainingSeconds,
    sandboxMode,
    startSession,
    endSession,
    focusTerminal,
    copySelection,
    pasteToTerminal,
  } = useSandboxTerminal({ autoStart: isFullscreen, targetMode });

  // Inicializar xterm en modo standalone / fullscreen
  useEffect(() => {
    if (isFullscreen && terminalRef.current) {
      initTerminal(terminalRef.current);
    }
  }, [isFullscreen, initTerminal, terminalRef]);

  // Formato de tiempo restante mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Apertura de ventana emergente dedicada y centrada (Look & Feel AWS CloudShell)
  const openCloudShell = () => {
    const width = Math.min(1080, window.screen.availWidth - 40);
    const height = Math.min(680, window.screen.availHeight - 60);
    const left = Math.max(0, Math.round((window.screen.availWidth - width) / 2));
    const top = Math.max(0, Math.round((window.screen.availHeight - height) / 2));
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,noopener,noreferrer`;
    window.open(`/sandbox?mode=${targetMode}`, 'JorgeDoicelaCloudShell', features);
  };

  // Acción de copiar selección con feedback visual
  const handleCopySelection = () => {
    const success = copySelection();
    if (success) {
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  };

  // Acción de pegar texto en terminal con feedback visual
  const handlePaste = async () => {
    const success = await pasteToTerminal();
    if (success) {
      setPastedFeedback(true);
      setTimeout(() => setPastedFeedback(false), 1500);
    }
  };

  // ── 1. VISTA EMBEBIDA EN EL PORTAFOLIO: TARJETA DE LANZAMIENTO ESTILO AWS ──
  if (!isFullscreen) {
    const title = targetMode === 'tunnel' ? t('readyTitleTunnel') : t('readyTitleVps');
    const description = targetMode === 'tunnel' ? t('readyDescTunnel') : t('readyDescVps');
    const buttonLabel = targetMode === 'tunnel' ? t('launchButtonTunnel') : t('launchButtonVps');
    const badgeLabel = targetMode === 'tunnel' ? t('badgeTunnel') : t('badgeVps');

    return (
      <div className="relative w-full rounded-xl border border-border-gold/60 bg-surface/90 backdrop-blur-md min-h-[380px] sm:min-h-[460px] h-[480px] sm:h-[520px] overflow-hidden flex flex-col">
        {/* Barra superior minimalista */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-gold bg-surface-raised text-xs select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0 pr-1 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400/70 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold-500/40 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-foreground/20 inline-block" />
            </div>

            <span className="px-2 py-0.5 rounded bg-surface border border-border text-gold-300 font-semibold font-mono text-[11px]">
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Tarjeta de bienvenida interactiva */}
        <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 bg-surface/95 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-raised border border-border-gold flex items-center justify-center mb-3 sm:mb-4 shadow-xl luxury-glow">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300 fill-current ml-0.5" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-foreground font-mono mb-2">
            {title}
          </h3>
          <p className="text-xs text-muted max-w-md sm:max-w-lg mb-5 sm:mb-6 font-light leading-relaxed">
            {description}
          </p>
          <button
            onClick={openCloudShell}
            className="flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-gold-400 hover:bg-gold-300 text-background font-semibold text-xs font-mono transition-all shadow-xl hover:scale-105 cursor-pointer group"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{buttonLabel}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    );
  }

  // ── 2. VISTA STANDALONE / FULLSCREEN (/sandbox): TERMINAL ARRIBA + FOOTER ABAJO ──
  const standaloneBadge =
    (sandboxMode || targetMode) === 'tunnel'
      ? t('badgeTunnel')
      : t('badgeVps');

  const isTunnelOffline = status === 'error' && targetMode === 'tunnel';

  return (
    <div className="relative w-full h-full flex-1 min-h-0 rounded-none border-none shadow-none bg-[#080705] overflow-hidden flex flex-col">
      {/* Mensaje de Error en modo VPS */}
      {status === 'error' && errorMessage && targetMode !== 'tunnel' && (
        <div className="px-4 py-2 bg-red-950/60 border-b border-red-500/40 flex items-center gap-2 text-red-300 text-xs font-mono shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Si el servidor físico está apagado, mostrar el banner Dark Luxury interactivo */}
      {isTunnelOffline ? (
        <div className="flex-1 w-full min-h-0 p-4 sm:p-8 bg-[#080705] overflow-y-auto flex items-center justify-center">
          <ServerOfflineBanner
            isFullscreen={true}
            onRetry={startSession}
          />
        </div>
      ) : (
        /* 1. Canvas Xterm.js que arranca limpio desde la parte superior */
        <div className="flex-1 w-full min-h-0 px-4 pt-3 pb-2 bg-[#080705] overflow-hidden flex flex-col">
          <div
            ref={terminalRef}
            onClick={focusTerminal}
            className="w-full h-full flex-1 cursor-text overflow-hidden"
          />
        </div>
      )}

      {/* 2. Barra de Herramientas y Estado Inferior (Footer Consolidado estilo AWS) */}
      <footer className="flex items-center justify-between gap-3 px-4 py-2 border-t border-border-gold bg-surface-raised text-xs select-none shrink-0 min-h-[48px] z-10">
        {/* Lado izquierdo: Botón Retorno, Luces de Estado, Badge e Identidad de Instancia */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              if (window.opener && !window.opener.closed) {
                window.close();
              } else {
                window.location.href = '/';
              }
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-muted hover:text-gold-200 transition-colors cursor-pointer group pr-1 shrink-0"
            title={tStandalone('backToPortfolio')}
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline font-mono">{tStandalone('backToPortfolio')}</span>
          </button>

          <div className="h-4 w-px bg-border-gold/60 hidden sm:block shrink-0" />

          {/* Badge del Modo */}
          <span className="px-2 py-0.5 rounded bg-surface border border-border-gold/60 text-gold-300 font-semibold font-mono text-[11px] flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3 h-3 text-gold-400" />
            <span>{standaloneBadge}</span>
          </span>
        </div>

        {/* Lado derecho: Herramientas Copiar/Pegar, Temporizador, Botón Finalizar y Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botón Copiar Selección */}
          <button
            onClick={handleCopySelection}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border-gold/60 hover:border-gold-400/60 text-foreground/85 hover:text-gold-200 text-[11px] font-mono font-medium transition-all cursor-pointer"
            title={t('copyFromTerminal')}
          >
            {copiedFeedback ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-gold-400" />
                <span>{t('copyFromTerminal')}</span>
              </>
            )}
          </button>

          {/* Botón Pegar en Terminal */}
          <button
            onClick={handlePaste}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border-gold/60 hover:border-gold-400/60 text-foreground/85 hover:text-gold-200 text-[11px] font-mono font-medium transition-all cursor-pointer"
            title={t('pasteIntoTerminal')}
          >
            {pastedFeedback ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-mono">{t('pasted')}</span>
              </>
            ) : (
              <>
                <ClipboardPaste className="w-3 h-3 text-gold-400" />
                <span>{t('pasteIntoTerminal')}</span>
              </>
            )}
          </button>

          {/* Temporizador de Sesión */}
          {(status === 'connected' || status === 'warning') && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] border transition-colors ${
                status === 'warning'
                  ? 'bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-300 animate-pulse'
                  : 'bg-surface border-border-gold/60 text-foreground/80'
              }`}
              title="Tiempo restante de la sesión"
            >
              <Clock className="w-3 h-3 text-gold-500 dark:text-gold-300" />
              <span className="tabular-nums font-medium">{formatTime(remainingSeconds)}</span>
            </div>
          )}

          {/* Botón Finalizar Sesión / Reconectar */}
          {status === 'connected' || status === 'connecting' ? (
            <button
              onClick={endSession}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface border border-border-gold/60 hover:border-red-500/60 text-foreground/80 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5 dark:hover:bg-red-500/10 text-xs font-mono font-medium transition-all cursor-pointer"
              title={t('stopSession')}
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('stop')}</span>
            </button>
          ) : (
            <button
              onClick={startSession}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gold-400 hover:bg-gold-300 text-background font-semibold text-xs font-mono transition-all shadow-sm cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{t('reconnect')}</span>
            </button>
          )}

          <div className="h-4 w-px bg-border-gold/60" />

          {/* Toggles de Idioma y Tema */}
          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
};

