'use client';

import { useState, useCallback } from 'react';
import { API_URL } from '../../../shared';

export type NewsletterStatus = 'idle' | 'loading' | 'success' | 'error';

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
        return localStorage.getItem(STORAGE_KEY) === 'true' ? 'success' : 'idle';
      } catch {
        return 'idle';
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

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message =
            errorData && typeof errorData.message === 'string'
              ? errorData.message
              : Array.isArray(errorData?.message)
              ? errorData.message.join(', ')
              : 'Error al procesar la suscripción';
          throw new Error(message);
        }

        setStatus('success');
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // Fallback silencioso si localStorage está bloqueado
        }
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

