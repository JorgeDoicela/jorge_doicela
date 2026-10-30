'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScreenWakeLockOptions {
  enabled?: boolean;
}

export function useScreenWakeLock({ enabled = true }: UseScreenWakeLockOptions = {}) {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  const requestLock = useCallback(async () => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    if (sentinelRef.current && !sentinelRef.current.released) {
      return;
    }

    try {
      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      setIsActive(true);

      sentinel.addEventListener('release', () => {
        setIsActive(false);
      });
    } catch {
      setIsActive(false);
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (sentinelRef.current && !sentinelRef.current.released) {
      try {
        await sentinelRef.current.release();
      } catch {
        // Silencioso ante fallos al liberar
      } finally {
        sentinelRef.current = null;
        setIsActive(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'wakeLock' in navigator;
    setIsSupported(supported);

    if (!supported || !enabled) {
      releaseLock();
      return;
    }

    requestLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseLock();
    };
  }, [enabled, requestLock, releaseLock]);

  return {
    isSupported,
    isActive,
    requestLock,
    releaseLock,
  };
}

