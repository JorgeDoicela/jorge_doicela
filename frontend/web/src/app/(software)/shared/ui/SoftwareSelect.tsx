'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SoftwareSelectProps<T extends string | number = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md';
}

export function SoftwareSelect<T extends string | number = string>({
  options,
  value,
  onChange,
  placeholder,
  ariaLabel,
  disabled = false,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  align = 'center',
  size = 'md',
}: SoftwareSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  // Medir posición exacta en el viewport para rendering inmutable vía Portal
  const updateCoords = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  // Seguimiento activo de posición al abrir, scrollear o redimensionar
  useEffect(() => {
    if (!isOpen) return;
    updateCoords();

    const handleScrollOrResize = () => {
      updateCoords();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updateCoords]);

  // Cerrar al hacer clic afuera (protegiendo tanto el disparador como el portal)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Sincronizar índice resaltado al abrir
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

  const handleSelect = useCallback(
    (optionValue: T) => {
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange]
  );

  // Navegación por teclado (Accesibilidad WCAG AA)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const opt = options[highlightedIndex];
            if (!opt.disabled) handleSelect(opt.value);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next]?.disabled) {
              next++;
            }
            return next < options.length ? next : prev;
          });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next]?.disabled) {
              next--;
            }
            return next >= 0 ? next : prev;
          });
        }
        break;

      case 'Escape':
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;

      case 'Home':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;

      case 'End':
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;

      default:
        break;
    }
  };

  const alignClasses = {
    left: 'left-0 origin-top-left',
    center: 'left-1/2 -translate-x-1/2 origin-top',
    right: 'right-0 origin-top-right',
  }[align];

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 rounded-lg',
    md: 'text-xs font-semibold py-2 pl-3 pr-2.5 rounded-xl',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Botón Disparador (Trigger) con Relieve Neumórfico y Reflejo Glass */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
        className={`w-full flex items-center justify-between gap-2 text-blue-600 dark:text-blue-400 bg-white/85 dark:bg-black/40 border border-slate-300/80 dark:border-white/10 glass-convex-panel shadow-sm hover:shadow hover:border-blue-500/40 dark:hover:border-blue-400/40 active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${buttonClassName}`}
      >
        <span className="truncate flex items-center gap-1.5 tracking-tight">
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span>{selectedOption ? selectedOption.label : placeholder || '...'}</span>
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-blue-500/80 shrink-0 transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Menú Desplegable Flotante Inmune a Clipping (Portal a document.body) */}
      {mounted &&
        isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left:
                align === 'center'
                  ? `${coords.left + coords.width / 2}px`
                  : align === 'right'
                  ? `${coords.left + coords.width}px`
                  : `${coords.left}px`,
              transform:
                align === 'center'
                  ? 'translateX(-50%)'
                  : align === 'right'
                  ? 'translateX(-100%)'
                  : undefined,
              minWidth: `${Math.max(coords.width, 185)}px`,
            }}
            className={`z-[999999] max-h-72 overflow-y-auto scrollbar-none p-1.5 rounded-2xl bg-white/95 dark:bg-[#12161f]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl shadow-black/30 dark:shadow-black/70 animate-in fade-in zoom-in-95 duration-150 select-none ${menuClassName}`}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;
              const isHighlighted = idx === highlightedIndex;

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 my-0.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-400/15 font-bold shadow-xs'
                      : isHighlighted
                      ? 'text-slate-900 dark:text-white bg-black/5 dark:bg-white/10'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                  } ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && (
                      <span className="shrink-0 text-current">{option.icon}</span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    {option.badge !== undefined && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-black/5 dark:bg-white/10 text-slate-500 dark:text-zinc-400">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
