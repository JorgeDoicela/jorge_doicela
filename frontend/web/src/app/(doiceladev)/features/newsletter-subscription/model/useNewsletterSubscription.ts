'use client';

import { useState, useCallback } from 'react';
import { API_URL } from '../../../shared';

export type NewsletterStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'already_subscribed'
  | 'error';

export interface UseNewsletterOptions {
  source?: string;
  language?: string;
}

export interface UseNewsletterReturn {
  status: NewsletterStatus;
  errorMessage: string | null;
  subscribe: (email: string) => Promise<boolean>;
  reset: () => void;
}

const STORAGE_KEY = 'doicela_newsletter_subscribed';

export function useNewsletterSubscription(options: UseNewsletterOptions = {}): UseNewsletterReturn {
  const [status, setStatus] = useState<NewsletterStatus>(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignorar si localStorage está bloqueado
      }
    }
    return 'idle';
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  const subscribe = useCallback(
    async (email: string): Promise<boolean> => {
      const trimmed = email.trim();
      if (!trimmed) return false;

      setStatus('loading');
      setErrorMessage(null);

      try {
        const response = await fetch(`${API_URL}/doiceladev/newsletter/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: trimmed,
            source: options.source || 'article_footer',
            language: options.language || 'es',
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const message =
            payload && typeof payload.message === 'string'
              ? payload.message
              : Array.isArray(payload?.message)
              ? payload.message.join(', ')
              : 'Error al procesar la suscripción';
          throw new Error(message);
        }

        const resultStatus = payload?.data?.status ?? payload?.status;
        if (resultStatus === 'already_active') {
          setStatus('already_subscribed');
          return false;
        }

        setStatus('success');
        return true;
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Error inesperado');
        return false;
      }
    },
    [options.source, options.language]
  );

  return {
    status,
    errorMessage,
    subscribe,
    reset,
  };
}

export interface UnsubscribePayload {
  token?: string;
  email?: string;
}

export interface UseNewsletterUnsubscribeReturn {
  status: NewsletterStatus;
  errorMessage: string | null;
  unsubscribe: (payload: UnsubscribePayload) => Promise<boolean>;
  reset: () => void;
}

export function useNewsletterUnsubscribe(): UseNewsletterUnsubscribeReturn {
  const [status, setStatus] = useState<NewsletterStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  const unsubscribe = useCallback(async (payload: UnsubscribePayload): Promise<boolean> => {
    const cleanToken = payload.token?.trim();
    const cleanEmail = payload.email?.trim();
    if (!cleanToken && !cleanEmail) return false;

    setStatus('loading');
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_URL}/doiceladev/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          cleanToken ? { token: cleanToken } : { email: cleanEmail }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData && typeof errorData.message === 'string'
            ? errorData.message
            : Array.isArray(errorData?.message)
            ? errorData.message.join(', ')
            : 'Error al procesar la baja';
        throw new Error(message);
      }

      setStatus('success');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Fallback silencioso si localStorage está bloqueado
      }
      return true;
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Error inesperado');
      return false;
    }
  }, []);

  return {
    status,
    errorMessage,
    unsubscribe,
    reset,
  };
}

