'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 min-w-0 bible-scrollbar-slim ${className}`}>
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

  // Sincronizar limpiamente si cambia el ancho base por defecto del módulo (cambio de ruta o props)
  useEffect(() => {
    setIndependentWidth(initialWidth);
  }, [initialWidth]);

  // Resolución de Visibilidad
  const isOpen =
    propIsOpen !== undefined
      ? propIsOpen
      : isLeft
      ? passageContext?.isLeftSidebarOpen ?? false
      : passageContext?.isRightInspectorOpen ?? false;

  const panelRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    // Desenfocar elementos activos dentro del panel antes de ocultarlo para cumplir W3C WAI-ARIA
    if (panelRef.current && typeof document !== 'undefined' && panelRef.current.contains(document.activeElement)) {
      (document.activeElement as HTMLElement)?.blur();
    }
    const closeFn =
      propOnClose ??
      (isLeft ? passageContext?.toggleLeftSidebar : passageContext?.closeInspector);
    closeFn?.();
  }, [propOnClose, isLeft, passageContext]);

  // Si el panel se cierra por cualquier vía externa, asegurar que ningún elemento hijo retenga el foco
  useEffect(() => {
    if (!isOpen && panelRef.current && typeof document !== 'undefined' && panelRef.current.contains(document.activeElement)) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }, [isOpen]);

  // Patrón estándar de React: Controlado vs Autónomo (Controlled vs Uncontrolled)
  const isControlledWidth = propWidth !== undefined;
  const currentWidth = isControlledWidth ? propWidth : independentWidth;

  const handleResize = useCallback(
    (newW: number) => {
      const max = isLeft ? MAX_LEFT_SIDEBAR_WIDTH : MAX_RIGHT_INSPECTOR_WIDTH;
      const clamped = Math.min(max, Math.max(120, newW));
      if (!isControlledWidth) {
        setIndependentWidth(clamped);
      }
      propOnResize?.(clamped);
    },
    [isLeft, isControlledWidth, propOnResize],
  );

  const handleReset = useCallback(() => {
    if (!isControlledWidth) {
      setIndependentWidth(initialWidth);
    }
    propOnReset?.();
  }, [isControlledWidth, initialWidth, propOnReset]);

  const [isDragging, setIsDragging] = useState(false);

  const cssVar = isLeft ? '--sidebar-w' : '--inspector-w';
  const borderClass = isLeft ? 'border-r left-0' : 'border-l right-0';

  const effectiveAriaLabel = ariaLabel || title || (isLeft ? 'Panel lateral' : 'Inspector');

  // Transición: En móvil deslizamiento físico completo de Drawer (300ms con inercia Geist); en PC micro-slide + fade Linear (250ms)
  const transitionClass = isDragging
    ? 'transition-none'
    : 'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:transition-[width,opacity,border-color] lg:duration-250 lg:ease-[cubic-bezier(0.16,1,0.3,1)]';

  // Difuminado progresivo elegante cuando el usuario arrastra hacia el borde de colapso en escritorio (< 190px)
  const dragOpacity = isDragging && currentWidth < 190
    ? Math.max(0.2, Math.min(1, (currentWidth - 100) / 90))
    : undefined;

  return (
    <>
      {/* Cortina oscura backdrop en Móviles (< lg) con transición gradual suave */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] z-30 lg:hidden print:hidden transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        ref={panelRef}
        id={isLeft ? 'bible-study-left-sidebar' : 'bible-study-right-inspector'}
        aria-label={effectiveAriaLabel}
        aria-hidden={!isOpen ? true : undefined}
        inert={!isOpen ? true : undefined}
        style={
          {
            [cssVar]: `${currentWidth}px`,
            '--active-panel-w': isOpen ? `${currentWidth}px` : '0px',
            opacity: dragOpacity,
          } as React.CSSProperties
        }
        className={`absolute inset-y-0 ${borderClass} z-40 h-full lg:relative lg:inset-auto lg:z-20 w-[88vw] max-w-[380px] sm:max-w-[420px] lg:w-[var(--active-panel-w)] lg:max-w-none flex-shrink-0 flex flex-col print:hidden bg-white dark:bg-[#121214] border-zinc-200 dark:border-zinc-800 lg:shadow-none overflow-hidden ${transitionClass} ${
          isOpen
            ? 'pointer-events-auto lg:overflow-visible translate-x-0 opacity-100 visible shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_60px_rgba(0,0,0,0.7)]'
            : isLeft
            ? '-translate-x-full lg:translate-x-0 pointer-events-none opacity-0 invisible lg:visible shadow-none lg:border-transparent'
            : 'translate-x-full lg:translate-x-0 pointer-events-none opacity-0 invisible lg:visible shadow-none lg:border-transparent'
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

        {/* Contenedor Interior: En desktop mantiene el micro-slide de 16px con fade; en móvil permanece al 100% */}
        <div
          style={{ width: undefined }}
          className={`h-full w-full lg:w-[var(--sidebar-w,340px)] min-w-0 flex flex-col overflow-hidden shrink-0 lg:transition-[transform,opacity] lg:duration-250 lg:ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen
              ? 'opacity-100 translate-x-0'
              : isLeft
              ? 'lg:opacity-0 lg:-translate-x-4'
              : 'lg:opacity-0 lg:translate-x-4'
          }`}
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
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 active:scale-95"
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
