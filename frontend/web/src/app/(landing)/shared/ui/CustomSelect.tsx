'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Selecciona una opción...',
  className = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Botón Trigger del Selector */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 focus:bg-foreground/10 border border-card-border hover:border-card-hover-border focus:border-card-hover-border text-foreground transition-all duration-200 flex items-center justify-between text-base sm:text-sm cursor-pointer outline-none select-none text-left"
      >
        <span
          className={`truncate ${
            selectedOption ? 'text-foreground font-medium' : 'text-text-subtitle/60'
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={`text-[10px] text-text-subtitle transition-transform duration-200 ml-2 shrink-0 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {/* Menú Desplegable con Estilo Frosted Glass */}
      {isOpen && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-2 py-1.5 rounded-2xl bg-card border border-card-border backdrop-blur-2xl shadow-2xl overflow-hidden animate-fade-slide max-h-64 overflow-y-auto"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2.5 sm:py-3 text-xs sm:text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-foreground/15 text-foreground font-semibold'
                    : 'text-text-muted hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <span className="text-xs text-accent-light font-bold shrink-0 ml-2">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Input oculto para compatibilidad con serialización estándar de formularios */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
