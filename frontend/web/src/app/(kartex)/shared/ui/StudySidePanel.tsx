'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { ResizeBorderHandle } from './ResizeBorderHandle';
import { useStudySidePanelState } from './StudySidePanelContext';

export interface StudySidePanelProps {
    side: 'left' | 'right';
    mobileVariant?: 'drawer' | 'bottom-sheet';
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
    allowBackgroundInteraction?: boolean;
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
        <div className={`p-3 border-b border-border/60 shrink-0 ${className}`}>
            {children}
        </div>
    );
};

const StudySidePanelBody: React.FC<StudySidePanelBodyProps> = ({
    className = '',
    children,
}) => {
    return (
        <div className={`flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 min-w-0 kartex-scrollbar-slim pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] ${className}`}>
            {children}
        </div>
    );
};

const StudySidePanelFooter: React.FC<StudySidePanelFooterProps> = ({
    className = '',
    children,
}) => {
    return (
        <div className={`p-3 border-t border-border/60 shrink-0 ${className}`}>
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
    mobileVariant,
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
    allowBackgroundInteraction = true,
    className = '',
    children,
}) => {
    const isLeft = side === 'left';
    // Por defecto en móvil (< lg) todo panel (izquierdo y derecho) se abre como Bottom Sheet moderno nativo
    const variant = mobileVariant ?? 'bottom-sheet';
    const isBottomSheet = variant === 'bottom-sheet';
    const panelState = useStudySidePanelState(side);

    // Resolución reactiva del estado de apertura: prop explícita > panelState > true por defecto
    const isOpen = propIsOpen !== undefined
        ? propIsOpen
        : (panelState?.isOpen ?? true);

    const onClose = propOnClose ?? panelState?.onClose;

    const defaultStandardWidth = isLeft ? 280 : 340;
    const initialWidth = defaultWidth ?? defaultStandardWidth;

    const contextWidth = panelState?.width;
    const isControlledWidth = propWidth !== undefined || contextWidth !== undefined;
    const [independentWidth, setIndependentWidth] = useState<number>(initialWidth);

    const currentWidth = propWidth ?? (contextWidth !== undefined ? contextWidth : independentWidth);

    // Sincronizar limpiamente si cambia el ancho base por defecto del módulo (cambio de ruta o props)
    useEffect(() => {
        setIndependentWidth(initialWidth);
    }, [initialWidth]);

    const panelRef = useRef<HTMLElement | null>(null);

    // Soporte táctil y de puntero interactivo en tiempo real para Bottom Sheet en móvil
    const [sheetDragOffsetY, setSheetDragOffsetY] = useState(0);
    const [isSheetDragging, setIsSheetDragging] = useState(false);
    const [isSheetClosing, setIsSheetClosing] = useState(false);
    const sheetStartYRef = useRef<number | null>(null);

    const handleClose = useCallback(() => {
        // Desenfocar elementos activos dentro del panel antes de ocultarlo para cumplir W3C WAI-ARIA
        if (panelRef.current && typeof document !== 'undefined' && panelRef.current.contains(document.activeElement)) {
            (document.activeElement as HTMLElement)?.blur();
        }
        onClose?.();
    }, [onClose]);

    const triggerAnimatedSheetClose = useCallback(() => {
        setIsSheetClosing(true);
        setTimeout(() => {
            handleClose();
            setIsSheetClosing(false);
            setSheetDragOffsetY(0);
        }, 220);
    }, [handleClose]);

    const handleSheetDragStart = useCallback((clientY: number) => {
        sheetStartYRef.current = clientY;
        setIsSheetDragging(true);
    }, []);

    const handleSheetDragMove = useCallback((clientY: number) => {
        if (sheetStartYRef.current === null) return;
        const deltaY = clientY - sheetStartYRef.current;
        if (deltaY > 0) {
            setSheetDragOffsetY(deltaY);
        } else {
            setSheetDragOffsetY(deltaY * 0.2);
        }
    }, []);

    const handleSheetDragEnd = useCallback(() => {
        if (sheetStartYRef.current === null) return;
        setIsSheetDragging(false);
        sheetStartYRef.current = null;
        if (sheetDragOffsetY > 80) {
            triggerAnimatedSheetClose();
        } else {
            setSheetDragOffsetY(0);
        }
    }, [sheetDragOffsetY, triggerAnimatedSheetClose]);

    const handleSheetTouchStart = useCallback((e: React.TouchEvent) => {
        handleSheetDragStart(e.touches[0].clientY);
    }, [handleSheetDragStart]);

    const handleSheetTouchMove = useCallback((e: React.TouchEvent) => {
        handleSheetDragMove(e.touches[0].clientY);
    }, [handleSheetDragMove]);

    const handleSheetTouchEnd = useCallback(() => {
        handleSheetDragEnd();
    }, [handleSheetDragEnd]);

    const handleSheetPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        handleSheetDragStart(e.clientY);
    }, [handleSheetDragStart]);

    const handleSheetPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (isSheetDragging) {
            handleSheetDragMove(e.clientY);
        }
    }, [isSheetDragging, handleSheetDragMove]);

    const handleSheetPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        handleSheetDragEnd();
    }, [handleSheetDragEnd]);

    // Restablecer estados de arrastre al abrir
    useEffect(() => {
        if (isOpen) {
            setSheetDragOffsetY(0);
            setIsSheetDragging(false);
            setIsSheetClosing(false);
        }
    }, [isOpen]);

    // Bloqueo de scroll de la página de fondo en móvil (solo cuando allowBackgroundInteraction es false)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isOpen && isBottomSheet && window.innerWidth < 1024 && !allowBackgroundInteraction) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen, isBottomSheet, allowBackgroundInteraction]);

    // Interacción Inteligente de Fondo: Permite mover el texto detrás y cierra solo ante tap estático
    useEffect(() => {
        if (!isOpen || !isBottomSheet || !allowBackgroundInteraction || typeof window === 'undefined' || window.innerWidth >= 1024) {
            return;
        }

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

            // Si el usuario movió el dedo más de 10px o mantuvo presionado > 450ms,
            // fue un gesto de desplazamiento de lectura en el texto bíblico, NO un tap de cierre
            if (deltaX > 10 || deltaY > 10 || elapsed > 450) {
                return;
            }

            // Si fue un tap corto y estático fuera del Bottom Sheet
            const target = e.target as HTMLElement | null;
            if (panelRef.current && !panelRef.current.contains(target)) {
                if (target?.closest('[data-mobile-dock]') || target?.closest('[data-verse-item]')) {
                    return;
                }
                triggerAnimatedSheetClose();
            }
        };

        const handleDocMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (panelRef.current && !panelRef.current.contains(target)) {
                if (target?.closest('[data-mobile-dock]') || target?.closest('[data-verse-item]')) {
                    return;
                }
                triggerAnimatedSheetClose();
            }
        };

        document.addEventListener('touchstart', handleDocTouchStart, { passive: true });
        document.addEventListener('touchend', handleDocTouchEnd, { passive: true });
        document.addEventListener('mousedown', handleDocMouseDown);

        return () => {
            document.removeEventListener('touchstart', handleDocTouchStart);
            document.removeEventListener('touchend', handleDocTouchEnd);
            document.removeEventListener('mousedown', handleDocMouseDown);
        };
    }, [isOpen, isBottomSheet, allowBackgroundInteraction, triggerAnimatedSheetClose]);

    // Cierre accesible con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    // Si el panel se cierra por cualquier vía externa, asegurar que ningún elemento hijo retenga el foco
    useEffect(() => {
        if (!isOpen && panelRef.current && typeof document !== 'undefined' && panelRef.current.contains(document.activeElement)) {
            (document.activeElement as HTMLElement)?.blur();
        }
    }, [isOpen]);

    const handleResize = useCallback(
        (newW: number) => {
            const max = isLeft ? MAX_LEFT_SIDEBAR_WIDTH : MAX_RIGHT_INSPECTOR_WIDTH;
            const clamped = Math.min(max, Math.max(120, newW));
            if (!isControlledWidth) {
                setIndependentWidth(clamped);
            }
            if (propOnResize) {
                propOnResize(clamped);
            } else {
                panelState?.onResize?.(clamped);
            }
        },
        [isLeft, isControlledWidth, propOnResize, panelState],
    );

    const handleReset = useCallback(() => {
        if (!isControlledWidth) {
            setIndependentWidth(initialWidth);
        }
        if (propOnReset) {
            propOnReset();
        } else {
            panelState?.onReset?.();
        }
    }, [isControlledWidth, initialWidth, propOnReset, panelState]);

    const [isDragging, setIsDragging] = useState(false);

    const cssVar = isLeft ? '--sidebar-w' : '--inspector-w';

    const effectiveAriaLabel = ariaLabel || title || (isLeft ? 'Panel lateral' : 'Inspector');

    // Transición: En móvil deslizamiento físico completo; en PC micro-slide + fade Linear (250ms)
    const transitionClass = isDragging
        ? 'transition-none'
        : 'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:transition-[width,opacity,border-color] lg:duration-250 lg:ease-[cubic-bezier(0.16,1,0.3,1)]';

    // Difuminado progresivo elegante cuando el usuario arrastra hacia el borde de colapso en escritorio (< 190px)
    const dragOpacity = isDragging && currentWidth < 190
        ? Math.max(0.2, Math.min(1, (currentWidth - 100) / 90))
        : undefined;

    // Shell móvil (< lg): Bottom Sheet modal moderno (ancho completo, esquinas superiores redondeadas, sin sombra invasiva)
    const mobileLayoutClass = isBottomSheet
        ? 'fixed inset-x-0 bottom-0 top-auto z-50 w-full h-[85vh] max-h-[88vh] rounded-t-3xl sm:rounded-t-[28px] border-t border-border/80'
        : `absolute inset-y-0 ${isLeft ? 'border-r left-0' : 'border-l right-0'} z-40 h-full w-[88vw] max-w-[380px] sm:max-w-[420px] border-border`;

    const mobileStateClass = isBottomSheet
        ? (isOpen
            ? 'translate-y-0 opacity-100 visible pointer-events-auto'
            : 'translate-y-full opacity-0 invisible pointer-events-none')
        : (isOpen
            ? 'pointer-events-auto translate-x-0 opacity-100 visible shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_60px_rgba(0,0,0,0.7)]'
            : (isLeft
                ? '-translate-x-full pointer-events-none opacity-0 invisible'
                : 'translate-x-full pointer-events-none opacity-0 invisible'));

    // Shell de escritorio (>= lg): Workbench continuo de 100% de altura.
    // Anula esquinas redondeadas o bordes horizontales móviles y aplica la línea divisoria vertical canónica de 1px
    // (border-r a la derecha para el panel izquierdo, border-l a la izquierda para el inspector derecho).
    const desktopClasses = `lg:relative lg:inset-auto lg:z-20 lg:h-full lg:self-stretch lg:max-h-none lg:w-[var(--active-panel-w)] lg:max-w-none lg:translate-x-0 lg:translate-y-0 lg:opacity-100 lg:visible lg:shadow-none lg:rounded-none lg:border-t-0 lg:border-b-0 ${
        isLeft ? 'lg:border-r lg:border-l-0' : 'lg:border-l lg:border-r-0'
    } ${isOpen ? 'lg:border-border lg:overflow-visible' : 'lg:border-transparent'}`;

    return (
        <>
            {/* Cortina backdrop transparente en Móviles (< lg) sin sombra ni oscurecimiento */}
            <div
                data-study-panel-backdrop="true"
                onClick={!allowBackgroundInteraction || !isBottomSheet ? handleClose : undefined}
                aria-hidden="true"
                className={`fixed inset-0 bg-transparent z-40 lg:hidden print:hidden transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isOpen
                        ? isBottomSheet && allowBackgroundInteraction
                            ? 'opacity-100 pointer-events-none'
                            : 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />

            <aside
                ref={panelRef}
                data-study-panel="true"
                id={isLeft ? 'kartex-study-left-sidebar' : 'kartex-study-right-inspector'}
                aria-label={effectiveAriaLabel}
                aria-hidden={!isOpen ? true : undefined}
                inert={!isOpen ? true : undefined}
                style={
                    {
                        [cssVar]: `${currentWidth}px`,
                        '--active-panel-w': isOpen ? `${currentWidth}px` : '0px',
                        opacity: dragOpacity,
                        transform: isBottomSheet && isSheetClosing
                            ? 'translateY(100%)'
                            : isBottomSheet && isSheetDragging
                                ? `translateY(${Math.max(-20, sheetDragOffsetY)}px)`
                                : undefined,
                        transition: isBottomSheet && isSheetDragging
                            ? 'none'
                            : isBottomSheet && isSheetClosing
                                ? 'transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)'
                                : undefined,
                    } as React.CSSProperties
                }
                className={`${mobileLayoutClass} ${mobileStateClass} ${desktopClasses} flex-shrink-0 flex flex-col print:hidden bg-card-bg text-foreground overflow-hidden ${transitionClass} ${className}`}
            >
                {/* Tirador Redimensionable Interactivo en Escritorio (visible cuando está abierto) */}
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

                {/* Manija táctil de arrastre (Pill) exclusiva para Bottom Sheet en móvil */}
                {isBottomSheet && (
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Arrastrar para cerrar"
                        onPointerDown={handleSheetPointerDown}
                        onPointerMove={handleSheetPointerMove}
                        onPointerUp={handleSheetPointerUp}
                        onTouchStart={handleSheetTouchStart}
                        onTouchMove={handleSheetTouchMove}
                        onTouchEnd={handleSheetTouchEnd}
                        className="w-full pt-3 pb-2 flex justify-center items-center lg:hidden cursor-grab active:cursor-grabbing select-none shrink-0 touch-none group"
                        aria-hidden="true"
                    >
                        <div
                            className={`w-11 h-1.5 rounded-full transition-colors duration-150 ${
                                isSheetDragging
                                    ? 'bg-accents-4 scale-105'
                                    : 'bg-border/90 hover:bg-accents-3 dark:bg-zinc-700'
                            }`}
                        />
                    </div>
                )}

                {/* Contenedor Interior: En desktop mantiene el micro-slide de 16px con fade; en móvil permanece al 100% */}
                <div
                    style={{ width: undefined }}
                    className={`h-full w-full ${isLeft ? 'lg:w-[var(--sidebar-w,280px)]' : 'lg:w-[var(--inspector-w,340px)]'} min-w-0 flex flex-col overflow-hidden shrink-0 lg:transition-[transform,opacity] lg:duration-250 lg:ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen
                            ? 'opacity-100 translate-x-0'
                            : isLeft
                                ? 'lg:opacity-0 lg:-translate-x-4'
                                : 'lg:opacity-0 lg:translate-x-4'
                        }`}
                >
                    {/* Cabecera Móvil Unificada (si se define title y showMobileHeader está activo) */}
                    {title && showMobileHeader && (
                        <div
                            onPointerDown={isBottomSheet ? handleSheetPointerDown : undefined}
                            onPointerMove={isBottomSheet ? handleSheetPointerMove : undefined}
                            onPointerUp={isBottomSheet ? handleSheetPointerUp : undefined}
                            onTouchStart={isBottomSheet ? handleSheetTouchStart : undefined}
                            onTouchMove={isBottomSheet ? handleSheetTouchMove : undefined}
                            onTouchEnd={isBottomSheet ? handleSheetTouchEnd : undefined}
                            className={`flex lg:hidden items-center justify-between px-4 py-2.5 border-b border-border/60 shrink-0 select-none ${
                                isBottomSheet ? 'touch-none cursor-grab active:cursor-grabbing' : ''
                            }`}
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                {icon && <span className="shrink-0 text-foreground">{icon}</span>}
                                <span className="font-semibold text-xs tracking-wider uppercase text-foreground truncate">
                                    {title}
                                </span>
                                {badge}
                            </div>
                            {!isBottomSheet && (
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    aria-label={collapseTitle || 'Cerrar panel'}
                                    className="p-1.5 rounded-full text-accents-4 hover:text-foreground hover:bg-accents-1 transition-colors cursor-pointer shrink-0 active:scale-95"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
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
