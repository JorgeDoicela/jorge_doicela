'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Square, RefreshCw, Clock, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { useSandboxTerminal } from '../hooks/useSandboxTerminal';
import { MobileTerminalBanner } from './MobileTerminalBanner';
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  const {
    terminalRef,
    initTerminal,
    status,
    errorMessage,
    remainingSeconds,
    sandboxMode,
    startSession,
    endSession,
    handleResize,
    focusTerminal,
  } = useSandboxTerminal({ autoStart: isFullscreen, targetMode });

  // Detección de viewport móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const openCloudShell = () => {
    window.open(`/sandbox?mode=${targetMode}`, '_blank', 'noopener,noreferrer');
  };

  if (isMobile && !isMobileExpanded) {
    return (
      <MobileTerminalBanner
        isMobileExpanded={isMobileExpanded}
        onToggleMobileExpand={() => setIsMobileExpanded(!isMobileExpanded)}
      />
    );
  }

  // ── 1. VISTA EMBEBIDA EN EL PORTAFOLIO: 1 SOLO BOTÓN DIRECTO SEGÚN EL MODO ────
  if (!isFullscreen) {
    const title = targetMode === 'tunnel' ? t('readyTitleTunnel') : t('readyTitleVps');
    const description = targetMode === 'tunnel' ? t('readyDescTunnel') : t('readyDescVps');
    const buttonLabel = targetMode === 'tunnel' ? t('launchButtonTunnel') : t('launchButtonVps');
    const badgeLabel = targetMode === 'tunnel' ? 'LIVE SANDBOX • CASERO' : 'LIVE SANDBOX • VPS';

    return (
      <div className="relative w-full rounded-xl border border-border-gold bg-surface/90 backdrop-blur-md shadow-2xl min-h-[460px] h-[520px] overflow-hidden flex flex-col">
        {/* Barra superior minimalista */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-gold bg-surface-raised text-xs select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 shrink-0 pr-1 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400/70 hover:opacity-100 transition-opacity inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold-500/40 hover:opacity-100 transition-opacity inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-foreground/20 hover:opacity-100 transition-opacity inline-block" />
            </div>

            <span className="px-2 py-0.5 rounded bg-surface border border-border text-gold-300 font-semibold font-mono text-[11px]">
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Tarjeta de bienvenida con 1 solo botón principal */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface/95 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-raised border border-border-gold flex items-center justify-center mb-4 shadow-xl luxury-glow">
            <Play className="w-6 h-6 text-gold-300 fill-current ml-0.5" />
          </div>
          <h3 className="text-lg font-medium text-foreground font-mono mb-2">
            {title}
          </h3>
          <p className="text-xs text-muted max-w-lg mb-6 font-light leading-relaxed">
            {description}
          </p>
          <button
            onClick={openCloudShell}
            className="flex items-center gap-2.5 px-6 py-3 rounded-lg bg-gold-400 hover:bg-gold-300 text-background font-semibold text-xs font-mono transition-all shadow-xl hover:scale-105 cursor-pointer group"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{buttonLabel}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    );
  }

  // ── 2. VISTA STANDALONE / FULLSCREEN (/sandbox): TERMINAL ACTIVA DIRECTA ───────
  const standaloneBadge =
    (sandboxMode || targetMode) === 'tunnel'
      ? 'LIVE SANDBOX • CASERO (TÚNEL)'
      : 'LIVE SANDBOX • VPS (AWS)';

  return (
    <div className="relative w-full h-full flex-1 min-h-0 rounded-none border-none shadow-none bg-background overflow-hidden flex flex-col">
      {/* Barra de Controles y Estado en /sandbox */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border-gold bg-surface-raised text-xs select-none shrink-0">
        {/* Lado izquierdo: Luces y Título */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 shrink-0 pr-1 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-gold-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/20 inline-block" />
          </div>

          <span className="px-2 py-0.5 rounded bg-surface border border-border text-gold-300 font-semibold font-mono text-[11px]">
            {standaloneBadge}
          </span>
        </div>

        {/* Lado derecho: Temporizador y Botón Único de Control */}
        <div className="flex items-center gap-2">
          {/* Temporizador TTL de Sesión */}
          {(status === 'connected' || status === 'warning') && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-[11px] border ${
                status === 'warning'
                  ? 'bg-red-950/40 border-red-500/60 text-red-300 animate-pulse'
                  : 'bg-surface border-border-gold text-gold-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>TTL: {formatTime(remainingSeconds)}</span>
            </div>
          )}

          {/* Botón Detener (si está conectado) o Reconectar (si finalizó) */}
          {status === 'connected' || status === 'connecting' ? (
            <button
              onClick={endSession}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-mono transition-colors cursor-pointer"
              title={t('stopSession')}
            >
              <Square className="w-3 h-3 fill-current" />
              <span>{t('stop')}</span>
            </button>
          ) : (
            <button
              onClick={startSession}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-gold-400 hover:bg-gold-300 text-background font-semibold text-xs font-mono transition-colors shadow-sm cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{t('reconnect')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mensaje de Error si ocurre */}
      {status === 'error' && errorMessage && (
        <div className="px-4 py-2 bg-red-950/40 border-b border-red-500/30 flex items-center gap-2 text-red-300 text-xs font-mono shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Canvas Xterm.js a pantalla completa con contenedor wrapper sin padding directo en el mount */}
      <div className="flex-1 w-full min-h-0 px-4 pt-2 pb-10 bg-[#080705] overflow-hidden flex flex-col">
        <div
          ref={terminalRef}
          onClick={focusTerminal}
          className="w-full h-full flex-1 cursor-text overflow-hidden"
        />
      </div>
    </div>
  );
};
