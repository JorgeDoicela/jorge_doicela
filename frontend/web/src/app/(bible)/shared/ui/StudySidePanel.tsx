'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useBiblePassageSafe } from '../context';
import { ResizeBorderHandle } from './ResizeBorderHandle';

export interface StudySidePanelProps {
  side: 'left' | 'right';
  ariaLabel?: string;
  title?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  showMobileHeader?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  width?: number;
  onResize?: (width: number) => void;
  onReset?: () => void;
  defaultWidth?: number;
  storageKey?: string;
  collapseTitle?: string;
  className?: string;
  children: React.ReactNode;
}

export interface StudySidePanelToolbarProps {
  className?: string;
  children: React.ReactNode;
}

export interface StudySidePanelBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface StudySidePanelFooterProps {
  className?: string;
  children: React.ReactNode;
}

const StudySidePanelToolbar: React.FC<StudySidePanelToolbarProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`p-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0 ${className}`}>
      {children}
    </div>
  );
};

const StudySidePanelBody: React.FC<StudySidePanelBodyProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-w-0 ${className}`}>
      {children}
    </div>
  );
};

const StudySidePanelFooter: React.FC<StudySidePanelFooterProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`p-3 border-t border-zinc-100 dark:border-zinc-800/80 shrink-0 ${className}`}>
      {children}
    </div>
  );
};

const MIN_LEFT_SIDEBAR_WIDTH = 200;
const MAX_LEFT_SIDEBAR_WIDTH = 480;
const MIN_RIGHT_INSPECTOR_WIDTH = 200;
const MAX_RIGHT_INSPECTOR_WIDTH = 480;

export const StudySidePanelRoot: React.FC<StudySidePanelProps> = ({
  side,
  ariaLabel,
  title,
  icon,
  badge,
  showMobileHeader = true,
  isOpen: propIsOpen,
  onClose: propOnClose,
  width: propWidth,
  onResize: propOnResize,
  onReset: propOnReset,
  defaultWidth,
  storageKey,
  collapseTitle,
  className = '',
  children,
}) => {
  const passageContext = useBiblePassageSafe();
  const isLeft = side === 'left';

  const defaultStandardWidth = isLeft ? 280 : 340;
  const initialWidth = defaultWidth ?? defaultStandardWidth;

  const [independentWidth, setIndependentWidth] = useState<number>(initialWidth);

  // Sincronización post-montaje con localStorage para evitar Hydration Mismatch en SSR
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = Number(saved);
          const min = isLeft ? MIN_LEFT_SIDEBAR_WIDTH : MIN_RIGHT_INSPECTOR_WIDTH;
          const max = isLeft ? MAX_LEFT_SIDEBAR_WIDTH : MAX_RIGHT_INSPECTOR_WIDTH;
          if (!isNaN(parsed) && parsed >= min) {
            setIndependentWidth(Math.min(max, parsed));
          }
        }
      } catch {
        // Fallback en modo privado
      }
    }
  }, [storageKey, isLeft]);

  const handleIndependentResize = useCallback(
    (newW: number) => {
      const min = isLeft ? MIN_LEFT_SIDEBAR_WIDTH : MIN_RIGHT_INSPECTOR_WIDTH;
      const max = isLeft ? MAX_LEFT_SIDEBAR_WIDTH : MAX_RIGHT_INSPECTOR_WIDTH;
      const clamped = Math.min(max, Math.max(120, newW));
      setIndependentWidth(clamped);
      if (storageKey && typeof window !== 'undefined') {
        try {
          if (clamped >= min) {
            localStorage.setItem(storageKey, String(clamped));
          }
        } catch {
          // Ignorar cuota o privacidad
        }
      }
      propOnResize?.(clamped);
    },
    [isLeft, storageKey, propOnResize],
  );

  const handleIndependentReset = useCallback(() => {
    setIndependentWidth(initialWidth);
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Ignorar
      }
    }
    propOnReset?.();
  }, [initialWidth, storageKey, propOnReset]);

  // Resolución de Visibilidad
  const isOpen =
    propIsOpen !== undefined
      ? propIsOpen
      : isLeft
      ? passageContext?.isLeftSidebarOpen ?? false
      : passageContext?.isRightInspectorOpen ?? false;

  const handleClose =
    propOnClose ??
    (isLeft ? passageContext?.toggleLeftSidebar : passageContext?.closeInspector) ??
    (() => {});

  // Resolución de Ancho y Handlers
  const currentWidth =
    propWidth ??
    (storageKey
      ? independentWidth
      : isLeft
      ? passageContext?.leftSidebarWidth ?? 280
      : passageContext?.rightInspectorWidth ?? 340);

  const handleResize = storageKey
    ? handleIndependentResize
    : propOnResize ??
      (isLeft
        ? passageContext?.setLeftSidebarWidth
        : passageContext?.setRightInspectorWidth) ??
      (() => {});

  const handleReset = storageKey
    ? handleIndependentReset
    : propOnReset ??
      (isLeft
        ? passageContext?.resetLeftSidebarWidth
        : passageContext?.resetRightInspectorWidth) ??
      (() => {});

  const [isDragging, setIsDragging] = useState(false);

  const cssVar = isLeft ? '--sidebar-w' : '--inspector-w';
  const borderClass = isLeft ? 'border-r left-0' : 'border-l right-0';

  const effectiveAriaLabel = ariaLabel || title || (isLeft ? 'Panel lateral' : 'Inspector');

  // Transición suave activada solo cuando no hay arrastre manual
  const transitionClass = isDragging
    ? 'transition-none'
    : 'transition-[width,opacity,border-color] duration-280 ease-[cubic-bezier(0.16,1,0.3,1)]';

  // Difuminado progresivo elegante cuando el usuario arrastra hacia el borde de colapso (< 190px)
  const dragOpacity = isDragging && currentWidth < 190
    ? Math.max(0.2, Math.min(1, (currentWidth - 100) / 90))
    : isOpen
    ? 1
    : 0;

  return (
    <>
      {/* Cortina oscura backdrop en Móviles (< lg) cuando está abierto */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-xs z-40 lg:hidden print:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        id={isLeft ? 'bible-study-left-sidebar' : 'bible-study-right-inspector'}
        aria-label={effectiveAriaLabel}
        aria-hidden={!isOpen}
        style={
          {
            [cssVar]: `${currentWidth}px`,
            width: isOpen ? `var(${cssVar})` : '0px',
            opacity: isOpen ? dragOpacity : 0,
          } as React.CSSProperties
        }
        className={`fixed inset-y-0 ${borderClass} z-50 h-screen lg:h-full lg:relative lg:z-20 flex-shrink-0 flex flex-col print:hidden ${transitionClass} ${
          isOpen
            ? 'border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-black backdrop-blur-md pointer-events-auto shadow-xl lg:shadow-none overflow-hidden lg:overflow-visible'
            : 'w-0 !min-w-0 !max-w-0 border-transparent pointer-events-none overflow-hidden'
        } ${
          // En móvil (< lg): deslizamiento translate si está cerrado
          !isOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        } ${className}`}
      >
        {/* Tirador Redimensionable Interactivo con Arrastre y Colapso (visible cuando está abierto) */}
        {isOpen && (
          <ResizeBorderHandle
            side={side}
            currentWidth={currentWidth}
            onResize={handleResize}
            onReset={handleReset}
            onCollapse={handleClose}
            onDragStateChange={setIsDragging}
            collapseTitle={collapseTitle}
          />
        )}

        {/* Contenedor Interior Desacoplado para Cortina Visual Cero-Jitter (Curtain Reveal) */}
        <div
          style={{ width: `${currentWidth}px` }}
          className="h-full min-w-0 flex flex-col overflow-hidden shrink-0"
        >
          {/* Cabecera Móvil Unificada (si se define title y showMobileHeader está activo) */}
          {title && showMobileHeader && (
            <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {icon && <span className="shrink-0">{icon}</span>}
                <span className="font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400 truncate">
                  {title}
                </span>
                {badge}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={collapseTitle || 'Cerrar panel'}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {children}
        </div>
      </aside>
    </>
  );
};

// Asignación de Compound Components
export const StudySidePanel = Object.assign(StudySidePanelRoot, {
  Toolbar: StudySidePanelToolbar,
  Body: StudySidePanelBody,
  Footer: StudySidePanelFooter,
});
