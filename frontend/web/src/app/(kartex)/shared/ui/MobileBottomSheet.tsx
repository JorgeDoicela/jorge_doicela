'use client';

import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { mobileSheetCoordinator } from './mobileSheetCoordinator';

export type MobileSheetDismissMode = 'modal' | 'dismiss-on-tap' | 'interactive';

export interface MobileBottomSheetProps {
  dismissMode?: MobileSheetDismissMode;
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  headerRight?: React.ReactNode;
  showHeader?: boolean;
  showCloseButton?: boolean;
  closeAriaLabel?: string;
  heightClass?: string;
  allowBackgroundInteraction?: boolean;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

/**
 * MobileBottomSheet
 *
 * Primitivo modal reutilizable de alto nivel para interfaces móviles en KARTEX.
 * Se despliega desde la parte inferior con cinemática física interactiva en tiempo real:
 * - Arrastre interactivo que sigue el dedo/puntero del usuario a 120 FPS.
 * - Resistencia elástica (rubberband) si se intenta tirar hacia arriba.
 * - Animación elástica de retorno si no supera el umbral de cierre (80px).
 * - Animación suave de salida hacia abajo al soltar pasado el umbral.
 * - Navegación inteligente de fondo: permite mover y leer libremente el texto
 *   bíblico de fondo mientras el panel permanece abierto (allowBackgroundInteraction).
 * - Discriminación inteligente de gestos: distingue entre un desplazamiento (scroll)
 *   en el texto de fondo y un toque estático (tap) para cerrar.
 * - Cierre accesible por tecla Escape y atributos WAI-ARIA.
 * - Soporte nativo para áreas seguras (safe-area-inset-bottom).
 */
export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  id,
  isOpen,
  onClose,
  title,
  icon,
  badge,
  headerRight,
  showHeader = true,
  showCloseButton = false,
  closeAriaLabel = 'Cerrar panel',
  heightClass = 'max-h-[85vh]',
  dismissMode,
  allowBackgroundInteraction = true,
  className = '',
  bodyClassName = '',
  children,
}) => {
  const generatedId = useId();
  const sheetInstanceId = id || generatedId;
  const effectiveDismissMode: MobileSheetDismissMode =
    dismissMode ?? (allowBackgroundInteraction === false ? 'modal' : 'dismiss-on-tap');

  const [mounted, setMounted] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const startYRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Restablecer estados al abrir
  useEffect(() => {
    if (isOpen) {
      setDragOffsetY(0);
      setIsDragging(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Cierre animado ordenado hacia abajo (interacción del usuario: arrastre o tap fuera)
  const triggerAnimatedClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onCloseRef.current();
      setIsClosing(false);
      setDragOffsetY(0);
    }, 220);
  }, []);

  // Exclusión mutua estricta en pantallas móviles (< lg / 1024px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobileScreen = window.innerWidth < 1024;
    if (isMobileScreen && isOpen) {
      mobileSheetCoordinator.registerOpen(sheetInstanceId, () => {
        // Cierre sincrónico e inmediato cuando otra lámina solicita la pantalla
        onCloseRef.current();
      });
    } else {
      mobileSheetCoordinator.registerClose(sheetInstanceId);
    }
    return () => {
      mobileSheetCoordinator.registerClose(sheetInstanceId);
    };
  }, [isOpen, sheetInstanceId]);

  // Si allowBackgroundInteraction es false, bloquea el scroll de fondo de forma modal estricta
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen && effectiveDismissMode === 'modal') {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, allowBackgroundInteraction]);

  // Interacción Desacoplada según dismissMode ('modal' | 'dismiss-on-tap' | 'interactive')
  useEffect(() => {
    if (!isOpen || effectiveDismissMode === 'modal' || typeof window === 'undefined') return;

    let touchStartPos: { x: number; y: number; time: number } | null = null;

    const handleDocTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartPos = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    };

    const handleDocTouchEnd = (e: TouchEvent) => {
      if (!touchStartPos) return;
      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPos.x);
      const deltaY = Math.abs(touch.clientY - touchStartPos.y);
      const elapsed = Date.now() - touchStartPos.time;
      touchStartPos = null;

      // Desplazamiento de lectura en el fondo: no cerrar
      if (deltaX > 10 || deltaY > 10 || elapsed > 450) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (sheetRef.current && !sheetRef.current.contains(target)) {
        // En modo 'interactive' (ej. selección de versículos), toques sobre versículos se respetan para multi-selección
        if (effectiveDismissMode === 'interactive' && target?.closest('[data-verse-item]')) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
        triggerAnimatedClose();
      }
    };

    const handleCaptureClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (sheetRef.current && !sheetRef.current.contains(target)) {
        // En modo 'interactive', permitir que el evento click llegue al versículo
        if (effectiveDismissMode === 'interactive' && target?.closest('[data-verse-item]')) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();
        triggerAnimatedClose();
      }
    };

    document.addEventListener('touchstart', handleDocTouchStart, { passive: true });
    document.addEventListener('touchend', handleDocTouchEnd, { passive: false });
    document.addEventListener('click', handleCaptureClick, true);

    return () => {
      document.removeEventListener('touchstart', handleDocTouchStart);
      document.removeEventListener('touchend', handleDocTouchEnd);
      document.removeEventListener('click', handleCaptureClick, true);
    };
  }, [isOpen, effectiveDismissMode, triggerAnimatedClose]);

  // Cierre accesible con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerAnimatedClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, triggerAnimatedClose]);

  // Gestos de arrastre táctil / puntero en tiempo real (Direct Manipulation)
  const handleDragStart = (clientY: number) => {
    startYRef.current = clientY;
    setIsDragging(true);
  };

  const handleDragMove = (clientY: number) => {
    if (startYRef.current === null) return;
    const deltaY = clientY - startYRef.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    } else {
      setDragOffsetY(deltaY * 0.2);
    }
  };

  const handleDragEnd = () => {
    if (startYRef.current === null) return;
    setIsDragging(false);
    startYRef.current = null;

    if (dragOffsetY > 80) {
      triggerAnimatedClose();
    } else {
      setDragOffsetY(0);
    }
  };

  // Handlers para Touch Events (Móviles WebKit / Blink)
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Handlers para Pointer Events
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    handleDragStart(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleDragMove(e.clientY);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    handleDragEnd();
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    handleDragEnd();
  };

  if (!mounted || !isOpen) {
    return null;
  }

  const hasHeader = showHeader && (title || icon || headerRight);

  // Cálculo de transformación y transición en tiempo real
  let transformStyle: string;
  let transitionStyle: string;

  if (isClosing) {
    transformStyle = 'translateY(100%)';
    transitionStyle = 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)';
  } else if (isDragging) {
    transformStyle = `translateY(${Math.max(-20, dragOffsetY)}px)`;
    transitionStyle = 'none';
  } else if (dragOffsetY === 0) {
    transformStyle = 'translateY(0)';
    transitionStyle = 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)';
  } else {
    transformStyle = 'translateY(0)';
    transitionStyle = 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)';
  }

  return createPortal(
    <>
      {/* Backdrop transparente: Si allowBackgroundInteraction está activo, usa pointer-events-none para permitir mover el texto de atrás */}
      <div
        data-bottom-sheet-backdrop="true"
        onClick={effectiveDismissMode === 'modal' ? triggerAnimatedClose : undefined}
        aria-hidden="true"
        className={`fixed inset-0 bg-transparent z-[45] select-none ${
          effectiveDismissMode === 'modal' ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      />

      {/* Contenedor del Sheet inferior con arrastre interactivo */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal={!allowBackgroundInteraction ? 'true' : undefined}
        aria-label={typeof title === 'string' ? title : 'Panel inferior'}
        style={{
          transform: transformStyle,
          transition: transitionStyle,
          willChange: isDragging ? 'transform' : 'auto',
        }}
        className={`fixed inset-x-0 bottom-0 z-50 w-full flex flex-col rounded-t-3xl border-t border-border/80 bg-card-bg text-foreground animate-in slide-in-from-bottom duration-300 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] overflow-hidden ${heightClass} ${className}`}
      >
        {/* Zona Táctil del Tirador Superior (Drag Handle Pill) con feedback visual */}
        <div
          role="button"
          tabIndex={0}
          aria-label={closeAriaLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="w-full pt-3 pb-2 flex justify-center items-center cursor-grab active:cursor-grabbing shrink-0 select-none touch-none group"
        >
          <div
            className={`w-11 h-1.5 rounded-full transition-colors duration-150 ${
              isDragging
                ? 'bg-accents-4 scale-105'
                : 'bg-border/90 hover:bg-accents-3 dark:bg-zinc-700 dark:hover:bg-zinc-500'
            }`}
          />
        </div>

        {/* Cabecera unificada opcional con soporte de arrastre */}
        {hasHeader && (
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="flex items-center justify-between px-5 py-2.5 border-b border-border/60 shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon && <span className="shrink-0 text-foreground">{icon}</span>}
              {title && (
                <span className="font-semibold text-xs tracking-wider uppercase text-foreground truncate">
                  {title}
                </span>
              )}
              {badge}
            </div>

            {(headerRight || showCloseButton) && (
              <div className="flex items-center gap-2 shrink-0">
                {headerRight}
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={triggerAnimatedClose}
                    aria-label={closeAriaLabel}
                    className="p-1.5 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer shrink-0 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Cuerpo del Sheet con scroll vertical nativo fluido */}
        <div
          className={`flex-1 overflow-y-auto overscroll-contain kartex-scrollbar-slim ${bodyClassName}`}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  );
};
