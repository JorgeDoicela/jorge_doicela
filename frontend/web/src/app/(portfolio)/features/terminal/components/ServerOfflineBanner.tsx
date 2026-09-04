'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Cpu,
  Send,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { API_URL } from '../../../../config';

interface ServerOfflineBannerProps {
  onRetry?: () => void;
  isFullscreen?: boolean;
}

export const ServerOfflineBanner: React.FC<ServerOfflineBannerProps> = ({
  onRetry,
  isFullscreen = false,
}) => {
  const t = useTranslations('SandboxWakeRequest');

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cargar estado de aviso previo para prevenir spam y bucles
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('portfolio_wake_requested');
      if (saved === 'true') {
        setIsSubmitted(true);
      }
    } catch {
      // Ignorar si storage no está disponible
    }
  }, []);

  const handleSendWakeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${API_URL}/portfolio/sandbox/wake-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          contact: contact.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            'No se pudo registrar la solicitud. Por favor intenta más tarde.',
        );
      }

      setIsSubmitted(true);
      try {
        sessionStorage.setItem('portfolio_wake_requested', 'true');
      } catch {
        // Ignorar si storage está bloqueado o deshabilitado en el navegador
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Error al conectar con el servidor.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (isRetrying) return;
    setIsRetrying(true);
    if (onRetry) {
      onRetry();
    }
    setTimeout(() => {
      setIsRetrying(false);
    }, 3500);
  };

  return (
    <div
      className={`relative w-full rounded-xl border border-border-gold bg-surface/95 backdrop-blur-md overflow-hidden flex flex-col transition-all shadow-2xl ${
        isFullscreen ? 'max-w-2xl mx-auto my-auto p-6 sm:p-8' : 'p-5 sm:p-7'
      }`}
    >
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header con Badge alineado (sin botón redundante arriba) */}
      <div className="flex items-center justify-between gap-3 mb-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-raised border border-border-gold flex items-center justify-center text-gold-300 shadow-sm">
            <Cpu className="w-4 h-4 text-gold-300" />
          </div>
          <span className="text-gold-300 font-mono text-[11px] font-semibold tracking-wider uppercase">
            {isSubmitted ? 'AVISO ENTREGADO' : t('serverOfflineBadge')}
          </span>
        </div>
      </div>

      {isSubmitted ? (
        /* ── ESTADO CONFIRMADO: ALINEACIÓN DIRECTA Y LIMPIA (SIN CAJAS ANIDADAS) ── */
        <div className="space-y-4 animate-fade-in text-left">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-medium text-foreground font-mono tracking-tight">
              {t('successTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
              {t('successDesc')}
            </p>
          </div>

          <div className="pt-3 border-t border-border-gold flex items-center justify-end">
            {onRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-background font-semibold text-xs font-mono transition-all shadow-md hover:scale-105 disabled:opacity-75 cursor-pointer"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Comprobando...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('retryCheck')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── ESTADO INICIAL: FORMULARIO Y EXPLICACIÓN CON ALINEACIÓN PERFECTA ── */
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-medium text-foreground font-mono tracking-tight">
              {t('serverOfflineTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
              {t('serverOfflineDesc')}
            </p>
          </div>

          <form onSubmit={handleSendWakeRequest} className="space-y-3.5">
            {/* Toggle de campos opcionales */}
            <div>
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-200 font-mono transition-colors cursor-pointer py-1"
              >
                {showOptionalFields ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {showOptionalFields
                    ? 'Ocultar campos adicionales'
                    : 'Añadir tu nombre o nota (opcional)'}
                </span>
              </button>

              {showOptionalFields && (
                <div className="mt-2.5 space-y-2.5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('optionalName')}
                        maxLength={100}
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-md bg-background border border-border-gold text-foreground placeholder:text-muted focus:border-gold-400 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={t('optionalContact')}
                        maxLength={150}
                        className="w-full text-xs font-mono px-3.5 py-2.5 rounded-md bg-background border border-border-gold text-foreground placeholder:text-muted focus:border-gold-400 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={t('optionalNote')}
                      maxLength={500}
                      rows={2}
                      className="w-full text-xs font-mono px-3.5 py-2.5 rounded-md bg-background border border-border-gold text-foreground placeholder:text-muted focus:border-gold-400 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje de error si falla */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-raised border border-red-500/40 text-red-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Botón principal de solicitud alineado */}
            <div className="pt-2 border-t border-border-gold flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-300 text-background font-semibold text-xs font-mono transition-all shadow-lg hover:shadow-gold-400/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('buttonSending')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('buttonRequestWake')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
