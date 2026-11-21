'use client';

import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type SearchAccentColor =
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'amber'
  | 'emerald'
  | 'rose';

export interface DoiceladevSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  accentColor?: SearchAccentColor;
  className?: string;
}

const RING_ACCENT_CLASSES: Record<SearchAccentColor, string> = {
  cyan: 'focus:ring-cyan-500/50',
  blue: 'focus:ring-blue-500/50',
  purple: 'focus:ring-purple-500/50',
  amber: 'focus:ring-amber-500/50',
  emerald: 'focus:ring-emerald-500/50',
  rose: 'focus:ring-rose-500/50',
};

export function DoiceladevSearchInput({
  value,
  onChange,
  placeholder,
  accentColor = 'cyan',
  className = '',
}: DoiceladevSearchInputProps) {
  const tSearch = useTranslations('Search');
  const inputRef = useRef<HTMLInputElement>(null);
  const ringClass = RING_ACCENT_CLASSES[accentColor] || RING_ACCENT_CLASSES.cyan;

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full max-w-md shrink-0 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`w-full pl-5 ${value ? 'pr-10' : 'pr-5'} py-2.5 rounded-2xl glass-concave-panel text-sm text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 ${ringClass} shadow-inner transition-all duration-200`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={tSearch('clearSearch')}
          title={tSearch('clearSearch')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
