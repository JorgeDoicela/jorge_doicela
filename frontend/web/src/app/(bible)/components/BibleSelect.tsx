'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface BibleSelectOption<T extends string | number = string | number> {
  value: T;
  label: string;
  badge?: string;
  description?: string;
  disabled?: boolean;
}

export interface BibleSelectProps<T extends string | number = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: BibleSelectOption<T>[];
  placeholder?: string;
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  size?: 'xs' | 'sm' | 'md';
  align?: 'left' | 'right';
  icon?: React.ReactNode;
}

export function BibleSelect<T extends string | number = string | number>({
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
}: BibleSelectProps<T>) {
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
    xs: 'px-2 py-1 text-[11px] h-7',
    sm: 'px-2.5 sm:px-3 py-1.5 text-xs h-8',
    md: 'px-3.5 py-2 text-sm h-10',
  }[size];

  const chevronSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative block w-full text-left select-none ${className}`}
      title={title}
    >
      {/* Botón Trigger con Estética Geist Vercel OLED */}
      <button
        type="button"
        id={`bible-select-trigger-${id}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || title || selectedOption?.label || placeholder}
        className={`w-full flex items-center justify-between gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer text-left
          bg-white dark:bg-[#0a0a0a]
          border border-zinc-200/90 dark:border-zinc-800/90
          text-zinc-900 dark:text-zinc-100
          hover:border-zinc-300 dark:hover:border-zinc-700
          hover:bg-zinc-50 dark:hover:bg-zinc-900/60
          focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-zinc-400 dark:focus:border-zinc-600
          shadow-xs
          active:scale-[0.99]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${sizeClasses}`}
      >
        <span className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
          {icon && <span className="shrink-0 text-zinc-400 dark:text-zinc-500">{icon}</span>}
          {selectedOption ? (
            <>
              {selectedOption.badge && (
                <span className="shrink-0 px-1 py-0.2 font-mono text-[10px] font-semibold uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/70 dark:border-zinc-700/60">
                  {selectedOption.badge}
                </span>
              )}
              <span className="truncate block">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-500 truncate block">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`shrink-0 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ml-1 ${chevronSizes} ${
            isOpen ? 'rotate-180 text-zinc-900 dark:text-zinc-100' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>

      {/* Popover Menú Flotante con Diseño Minimalista Geist */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          id={`bible-select-menu-${id}`}
          aria-activedescendant={
            focusedIndex >= 0 ? `bible-select-opt-${id}-${focusedIndex}` : undefined
          }
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-1.5 z-50 w-max min-w-full max-w-[calc(100vw-2rem)] sm:max-w-xs max-h-64 overflow-y-auto overscroll-contain
            rounded-xl p-1
            bg-white dark:bg-[#0a0a0a]
            border border-zinc-200/90 dark:border-zinc-800/90
            shadow-2xl shadow-black/15 dark:shadow-black/70
            animate-in fade-in zoom-in-[0.98] duration-150
            scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800
            ${menuClassName}`}
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isFocused = idx === focusedIndex;

            return (
              <div
                key={String(option.value)}
                id={`bible-select-opt-${id}-${idx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                onMouseEnter={() => !option.disabled && setFocusedIndex(idx)}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer select-none
                  ${
                    option.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold'
                      : isFocused
                      ? 'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                  }`}
              >
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {option.badge && (
                    <span
                      className={`shrink-0 px-1 py-0.2 font-mono text-[10px] font-semibold uppercase rounded border ${
                        isSelected
                          ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700'
                          : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 border-zinc-200/70 dark:border-zinc-800'
                      }`}
                    >
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
