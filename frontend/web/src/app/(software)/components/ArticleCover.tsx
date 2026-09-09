'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ArticleCoverProps {
  title: string;
  category: 'news' | 'blog' | 'ai' | 'cybersecurity' | 'tutorials' | 'forum' | 'projects';
  coverImage?: string;
  tag?: string;
}

export function ArticleCover({ title, category, coverImage }: ArticleCoverProps) {
  const [imageError, setImageError] = useState(false);

  // Paletas y gradientes temáticos para fallback procedural
  const getThemeDetails = () => {
    switch (category) {
      case 'news':
        return {
          gradient: 'from-cyan-950/60 via-slate-900/80 to-blue-950/70',
          accentBorder: 'border-cyan-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-cyan-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        };
      case 'blog':
        return {
          gradient: 'from-blue-950/60 via-slate-900/80 to-indigo-950/70',
          accentBorder: 'border-blue-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-blue-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        };
      case 'ai':
        return {
          gradient: 'from-indigo-950/60 via-slate-900/80 to-violet-950/70',
          accentBorder: 'border-indigo-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-indigo-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
        };
      case 'cybersecurity':
        return {
          gradient: 'from-rose-950/60 via-slate-900/80 to-red-950/70',
          accentBorder: 'border-rose-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-rose-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
        };
      case 'tutorials':
        return {
          gradient: 'from-slate-950/60 via-slate-900/80 to-zinc-900/70',
          accentBorder: 'border-slate-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-slate-300/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
        };
      case 'forum':
        return {
          gradient: 'from-blue-950/60 via-slate-900/80 to-cyan-950/70',
          accentBorder: 'border-blue-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-blue-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          ),
        };
      case 'projects':
      default:
        return {
          gradient: 'from-sky-950/60 via-slate-900/80 to-blue-950/70',
          accentBorder: 'border-sky-500/20',
          iconSvg: (
            <svg className="w-12 h-12 text-sky-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <div className={`w-full aspect-[16/9] rounded-2xl overflow-hidden relative border ${theme.accentBorder} bg-slate-950/90 group-hover:border-white/20 transition-all duration-300`}>
      {coverImage && !imageError ? (
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        /* Banner Procedural Temático Limpio en Neumorphism + Glassmorphism */
        <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} tech-grid-bg relative flex items-center justify-center select-none overflow-hidden`}>
          {/* Brillo de refracción vítrea */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

          {/* Centro: Icono flotante libre sin contenedor */}
          <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300 z-10 drop-shadow-lg">
            {theme.iconSvg}
          </div>
        </div>
      )}
    </div>
  );
}
