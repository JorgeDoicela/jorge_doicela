'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  ArrowRightLeft,
  Clock,
  AlertCircle,
  Play,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import type { SandboxStatus, RejectInfo } from '../hooks/useSandboxTerminal';

interface SandboxSecurityModalProps {
  status: SandboxStatus;
  cooldownSeconds?: number;
  rejectInfo?: RejectInfo | null;
  onTransfer: () => void;
  onRetry: () => void;
  isFullscreen?: boolean;
}

export const SandboxSecurityModal: React.FC<SandboxSecurityModalProps> = ({
  status,
  cooldownSeconds = 0,
  onTransfer,
  onRetry,
  isFullscreen = false,
}) => {
  const t = useTranslations('SandboxSecurityModal');

  // Configuración de contenido según el estado de seguridad
  const getContent = () => {
    switch (status) {
      case 'concurrency_limit':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-gold-300" />,
          badge: t('concurrencyBadge'),
          title: t('concurrencyTitle'),
          desc: t('concurrencyDesc'),
          actionLabel: t('concurrencyAction'),
          onAction: onTransfer,
          actionIcon: <Play className="w-3.5 h-3.5 fill-current" />,
          showAction: true,
          disabled: false,
        };

      case 'replaced':
        return {
          icon: <ArrowRightLeft className="w-4 h-4 text-gold-300" />,
          badge: t('replacedBadge'),
          title: t('replacedTitle'),
          desc: t('replacedDesc'),
          actionLabel: t('replacedAction'),
          onAction: onTransfer,
          actionIcon: <Play className="w-3.5 h-3.5 fill-current" />,
          showAction: true,
          disabled: false,
        };

      case 'cooldown': {
        const isWaiting = cooldownSeconds > 0;
        return {
          icon: <Clock className="w-4 h-4 text-gold-300" />,
          badge: t('cooldownBadge'),
          title: t('cooldownTitle'),
          desc: t('cooldownDesc'),
          actionLabel: isWaiting
            ? t('cooldownAction', { seconds: cooldownSeconds })
            : t('cooldownReady'),
          onAction: onRetry,
          actionIcon: isWaiting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          ),
          showAction: true,
          disabled: isWaiting,
        };
      }

      case 'rate_limited':
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
          badge: t('rateLimitBadge'),
          title: t('rateLimitTitle'),
          desc: t('rateLimitDesc'),
          actionLabel: '',
          onAction: () => {},
          actionIcon: null,
          showAction: false,
          disabled: true,
        };

      case 'blocked':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-400" />,
          badge: t('blockedBadge'),
          title: t('blockedTitle'),
          desc: t('blockedDesc'),
          actionLabel: '',
          onAction: () => {},
          actionIcon: null,
          showAction: false,
          disabled: true,
        };

      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div
      className={`relative w-full rounded-xl border border-border-gold bg-surface/95 backdrop-blur-md overflow-hidden flex flex-col transition-all shadow-2xl animate-fade-in ${
        isFullscreen ? 'max-w-xl mx-auto my-auto p-6 sm:p-8' : 'p-5 sm:p-7'
      }`}
    >
      {/* Luz ambiental sutil estilo Dark Luxury */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header con Badge alineado */}
      <div className="flex items-center justify-between gap-3 mb-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-gold flex items-center justify-center text-gold-300 shadow-sm">
            {content.icon}
          </div>
          <span className="text-gold-300 font-mono text-[11px] font-semibold tracking-wider uppercase">
            {content.badge}
          </span>
        </div>

        {status === 'cooldown' && cooldownSeconds > 0 && (
          <span className="px-2.5 py-0.5 rounded-full bg-surface-raised border border-gold-400/40 text-gold-300 font-mono text-xs tabular-nums font-semibold">
            00:{cooldownSeconds.toString().padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Título y Explicación Clara */}
      <div className="space-y-4 text-left">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium text-foreground font-mono tracking-tight">
            {content.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* Barra de Acciones */}
        <div className="pt-4 border-t border-border-gold flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                if (window.opener && !window.opener.closed) {
                  try {
                    window.opener.focus();
                  } catch {
                    // Ignorar restricciones entre contextos
                  }
                  window.close();
                  return;
                }
                window.close();
                setTimeout(() => {
                  window.location.href = '/';
                }, 150);
              }
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-border-gold/60 hover:border-gold-400/60 text-muted hover:text-foreground text-xs font-mono transition-all cursor-pointer text-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('backToPortfolio')}</span>
          </button>

          {content.showAction && (
            <button
              onClick={content.onAction}
              disabled={content.disabled}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 disabled:bg-surface-raised disabled:border disabled:border-border-gold/60 disabled:text-muted disabled:hover:scale-100 disabled:cursor-not-allowed text-background font-semibold text-xs font-mono transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              {content.actionIcon}
              <span>{content.actionLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
