'use client';

import React from 'react';
import Image from 'next/image';

interface BibleLogoProps {
  size?: number;
  className?: string;
}

export const BibleLogo: React.FC<BibleLogoProps> = ({ size = 20, className = '' }) => {
  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Modo Claro: logo_negro.png */}
      <Image
        src="/bible/logo/logo_negro.png"
        alt="Logo Biblia"
        width={size}
        height={size}
        className="w-full h-full object-contain block dark:hidden"
        priority
      />
      {/* Modo Oscuro: logo_blanco.png */}
      <Image
        src="/bible/logo/logo_blanco.png"
        alt="Logo Biblia"
        width={size}
        height={size}
        className="w-full h-full object-contain hidden dark:block"
        priority
      />
    </div>
  );
};
