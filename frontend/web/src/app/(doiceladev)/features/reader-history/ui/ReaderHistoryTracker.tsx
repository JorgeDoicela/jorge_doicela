'use client';

import { useEffect } from 'react';

export interface ReaderHistoryTrackerProps {
  slug?: string;
}

export function ReaderHistoryTracker({ slug }: ReaderHistoryTrackerProps) {
  useEffect(() => {
    if (!slug || typeof document === 'undefined') return;

    try {
      // 1. Obtener la cookie existente 'doicela_read_history'
      const match = document.cookie.match(/(?:^|; )doicela_read_history=([^;]*)/);
      const raw = match ? decodeURIComponent(match[1]) : '';
      const list = raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      // 2. Insertar el slug actual al frente (FIFO) evitando duplicados continuos
      const cleanSlug = slug.trim().toLowerCase();
      const updated = [cleanSlug, ...list.filter((s) => s !== cleanSlug)].slice(0, 10);

      // 3. Escribir la cookie con duración de 30 días, SameSite=Lax, path=/
      const maxAge = 60 * 60 * 24 * 30; // 30 días
      document.cookie = `doicela_read_history=${encodeURIComponent(
        updated.join(','),
      )}; path=/; max-age=${maxAge}; SameSite=Lax`;
    } catch {
      // Manejo defensivo en caso de restricciones de privacidad estrictas
    }
  }, [slug]);

  return null;
}

