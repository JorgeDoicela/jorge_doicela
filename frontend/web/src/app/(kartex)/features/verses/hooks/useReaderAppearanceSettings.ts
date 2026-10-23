'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ReaderSettings,
  ReaderLayoutMode,
  ReaderFontSize,
  ReaderFontFamily,
} from '../types';

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  layoutMode: 'continuous',
  fontSize: 'md',
  fontFamily: 'serif',
  showVerseNumbers: true,
  focusMode: false,
};

export function useReaderAppearanceSettings() {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_READER_SETTINGS;
    try {
      const saved = localStorage.getItem('kartex_reader_settings');
      if (saved) {
        return { ...DEFAULT_READER_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback a configuración por defecto
    }
    return DEFAULT_READER_SETTINGS;
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('kartex_reader_settings');
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<ReaderSettings>;
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // Fallback silencioso
      }
    };

    window.addEventListener('kartex_reader_settings_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('kartex_reader_settings_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const update = useCallback((partial: Partial<ReaderSettings>) => {
    // 1. Persistir limpiamente en localStorage
    try {
      const saved = localStorage.getItem('kartex_reader_settings');
      const current = saved ? JSON.parse(saved) : DEFAULT_READER_SETTINGS;
      const next = { ...current, ...partial };
      localStorage.setItem(
        'kartex_reader_settings',
        JSON.stringify({
          layoutMode: next.layoutMode,
          fontSize: next.fontSize,
          fontFamily: next.fontFamily,
          showVerseNumbers: next.showVerseNumbers,
        }),
      );
    } catch {
      // Fallback si almacenamiento no disponible
    }

    // 2. Función pura de actualización de estado local
    setSettings((prev) => ({ ...prev, ...partial }));

    // 3. Notificar a otros componentes de forma diferida en microtask para evitar setState durante render
    if (typeof window !== 'undefined') {
      queueMicrotask(() => {
        window.dispatchEvent(new Event('kartex_reader_settings_changed'));
      });
    }
  }, []);

  const setLayoutMode = useCallback(
    (layoutMode: ReaderLayoutMode) => update({ layoutMode }),
    [update],
  );

  const setFontSize = useCallback(
    (fontSize: ReaderFontSize) => update({ fontSize }),
    [update],
  );

  const setFontFamily = useCallback(
    (fontFamily: ReaderFontFamily) => update({ fontFamily }),
    [update],
  );

  const toggleVerseNumbers = useCallback(
    () => update({ showVerseNumbers: !settings.showVerseNumbers }),
    [update, settings.showVerseNumbers],
  );

  return {
    settings,
    setLayoutMode,
    setFontSize,
    setFontFamily,
    toggleVerseNumbers,
    update,
  };
}
