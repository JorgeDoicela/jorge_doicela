'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface KartexSelectOption<T extends string | number = string | number> {
  value: T;
  label: string;
  badge?: string;
  description?: string;
  disabled?: boolean;
}

export interface KartexSelectProps<T extends string | number = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: KartexSelectOption<T>[];
  placeholder?: string;
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'right';
  icon?: React.ReactNode;
  hideLabelOnMobile?: boolean;
}

export function KartexSelect<T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  ariaLabel,
  title,
  disabled = false,
  className = '',
  menuClassName = '',
  size = 'sm',
  align = 'left',
  icon,
  hideLabelOnMobile = false,
}: KartexSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const id = useId();

  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Al abrir el menú, enfocar y asegurar que la opción seleccionada esté visible en el scroll interno
  useEffect(() => {
    if (isOpen) {
      const activeIdx = options.findIndex((opt) => opt.value === value);
      setFocusedIndex(activeIdx >= 0 ? activeIdx : 0);

      // Auto scroll interno en el contenedor del menú sin mover la ventana
      if (menuRef.current && activeIdx >= 0) {
        const activeElem = menuRef.current.children[activeIdx] as HTMLElement | undefined;
        if (activeElem) {
          const menu = menuRef.current;
          const elemTop = activeElem.offsetTop;
          const elemBottom = elemTop + activeElem.offsetHeight;
          if (elemTop < menu.scrollTop) {
            menu.scrollTop = elemTop;
          } else if (elemBottom > menu.scrollTop + menu.clientHeight) {
            menu.scrollTop = elemBottom - menu.clientHeight;
          }
        }
      }
    }
  }, [isOpen, value, options]);

  // Navegación accesible por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next].disabled) next++;
          return next < options.length ? next : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next].disabled) next--;
          return next >= 0 ? next : prev;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          const opt = options[focusedIndex];
          if (!opt.disabled) {
            onChange(opt.value);
            setIsOpen(false);
          }
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Calibración de tamaños
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-[11px] h-7',
    sm: 'px-3 sm:px-3.5 py-1.5 text-xs h-8',
    md: 'px-4 py-2 text-sm h-10',
  }[size];

  const chevronSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative text-left select-none ${isOpen ? 'z-50' : ''} ${className || 'w-full'}`}
      title={title}
    >
      {/* Botón Trigger con Estética Geist Vercel OLED */}
      <button
        type="button"
        id={`kartex-select-trigger-${id}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || title || selectedOption?.label || placeholder}
        className={`w-full flex items-center justify-between gap-1.5 sm:gap-2 rounded-full font-medium transition-colors cursor-pointer text-left
          border shadow-2xs
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]
          ${
            isOpen
              ? 'border-border bg-accents-2 text-foreground font-semibold shadow-xs'
              : 'border-border/80 bg-inner-card/90 text-foreground hover:border-accents-4 hover:bg-inner-card'
          }
          ${sizeClasses}`}
      >
        <span className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 overflow-hidden">
          {icon && <span className="shrink-0 text-accents-4">{icon}</span>}
          {selectedOption ? (
            <>
              {selectedOption.badge && (
                <span className="shrink-0 font-bold tracking-tight text-foreground">
                  {selectedOption.badge}
                </span>
              )}
              <span
                className={`truncate ${
                  hideLabelOnMobile && selectedOption.badge
                    ? 'hidden sm:inline text-accents-5 font-normal'
                    : 'block'
                }`}
              >
                {selectedOption.label}
              </span>
            </>
          ) : (
            <span className="text-accents-4 truncate block">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`shrink-0 text-accents-4 transition-transform duration-200 ml-0.5 sm:ml-1 ${chevronSizes} ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>

      {/* Popover Menú Flotante con Diseño Minimalista Geist */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          id={`kartex-select-menu-${id}`}
          aria-activedescendant={
            focusedIndex >= 0 ? `kartex-select-opt-${id}-${focusedIndex}` : undefined
          }
          className={`absolute left-1/2 -translate-x-1/2 sm:translate-x-0 ${
            align === 'right' ? 'sm:left-auto sm:right-0' : 'sm:left-0 sm:right-auto'
          } top-full mt-1.5 z-50 w-[290px] sm:w-80 max-w-[calc(100vw-1.5rem)] max-h-72 overflow-y-auto overscroll-contain
            rounded-xl p-1.5
            bg-card-bg
            border border-border
            shadow-2xl
            animate-in fade-in zoom-in-95 duration-100
            kartex-scrollbar-slim
            ${menuClassName}`}
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isFocused = idx === focusedIndex;

            return (
              <div
                key={String(option.value)}
                id={`kartex-select-opt-${id}-${idx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                onMouseEnter={() => !option.disabled && setFocusedIndex(idx)}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer select-none
                  ${
                    option.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-accents-2 text-foreground font-semibold'
                      : isFocused
                      ? 'bg-accents-1 text-foreground'
                      : 'text-accents-6 hover:text-foreground hover:bg-accents-1'
                  }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {option.badge && (
                    <span className="shrink-0 font-bold tracking-tight text-foreground font-mono text-xs w-9">
                      {option.badge}
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </div>

                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 shrink-0 text-zinc-900 dark:text-zinc-100 animate-in fade-in duration-150"
                    strokeWidth={2}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
