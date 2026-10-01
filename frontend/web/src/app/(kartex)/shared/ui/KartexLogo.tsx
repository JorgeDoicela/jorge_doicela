'use client';

import React from 'react';
import Image from 'next/image';

export interface KartexLogoProps {
  size?: number;
  className?: string;
}

export const KartexLogo: React.FC<KartexLogoProps> = ({ size = 20, className = '' }) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Modo Claro: logo_negro.png */}
      <Image
        src="/kartex/logo/logo_negro.png"
        alt="Logo KARTEX"
        width={size}
        height={size}
        className="w-full h-full object-contain block dark:hidden"
        unoptimized
      />
      {/* Modo Oscuro: logo_blanco.png */}
      <Image
        src="/kartex/logo/logo_blanco.png"
        alt="Logo KARTEX"
        width={size}
        height={size}
        className="w-full h-full object-contain hidden dark:block"
        unoptimized
      />
    </div>
  );
};
