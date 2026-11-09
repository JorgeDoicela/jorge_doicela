'use client';

import React from 'react';

interface KartexToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const KartexToggleSwitch: React.FC<KartexToggleSwitchProps> = ({
  checked,
  onChange,
  id,
  label,
  disabled = false,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const trackClasses = isSm ? 'w-8 h-4.5' : 'w-9 h-5';
  const thumbClasses = isSm ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const thumbTranslate = isSm ? 'translate-x-3.5' : 'translate-x-4';

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex ${trackClasses} shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer active:scale-95 disabled:opacity-40 disabled:pointer-events-none focus:outline-none select-none ${
        checked
          ? 'bg-foreground'
          : 'bg-accents-2 border border-border/80'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block ${thumbClasses} rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
          checked
            ? `${thumbTranslate} bg-background`
            : 'translate-x-0 bg-accents-4'
        }`}
      />
    </button>
  );
};

