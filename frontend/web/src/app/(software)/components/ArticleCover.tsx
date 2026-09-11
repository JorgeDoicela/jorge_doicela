'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export type SoftwareArticleCategory =
  | 'news'
  | 'blog'
  | 'ai'
  | 'cybersecurity'
  | 'tutorials'
  | 'forum'
  | 'projects'
  | 'infrastructure';

interface ArticleCoverProps {
  title: string;
  category: SoftwareArticleCategory;
  subCategory?: string;
  coverImage?: string;
  tag?: string;
  priority?: boolean;
}

export function ArticleCover({ title, category, subCategory, coverImage, priority = false }: ArticleCoverProps) {
  const [imageError, setImageError] = useState(false);

  // Paletas y gradientes temáticos para fallback procedural
  const getThemeDetails = () => {
    switch (category) {
      case 'infrastructure':
        switch (subCategory) {
          case 'networking':
            return {
              gradient: 'from-teal-950/70 via-slate-900/80 to-cyan-950/70',
              accentBorder: 'border-cyan-500/25',
              iconSvg: (
                <svg className="w-12 h-12 text-cyan-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ),
            };
          case 'containers':
            return {
              gradient: 'from-blue-950/70 via-slate-900/80 to-indigo-950/70',
              accentBorder: 'border-blue-500/25',
              iconSvg: (
                <svg className="w-12 h-12 text-blue-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ),
            };
          case 'ci_cd':
            return {
              gradient: 'from-purple-950/70 via-slate-900/80 to-pink-950/70',
              accentBorder: 'border-purple-500/25',
              iconSvg: (
                <svg className="w-12 h-12 text-purple-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ),
            };
          case 'hardening':
            return {
              gradient: 'from-amber-950/70 via-slate-900/80 to-rose-950/70',
              accentBorder: 'border-amber-500/25',
              iconSvg: (
                <svg className="w-12 h-12 text-amber-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
            };
          case 'cloud':
            return {
              gradient: 'from-sky-950/70 via-slate-900/80 to-cyan-950/70',
              accentBorder: 'border-sky-500/25',
              iconSvg: (
                <svg className="w-12 h-12 text-sky-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              ),
            };
          case 'servers':
          default:
            return {
              gradient: 'from-emerald-950/70 via-slate-900/80 to-teal-950/70',
              accentBorder: 'border-emerald-500/25',
              iconSvg: (
                <svg className="w-12 h-12 text-emerald-400/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              ),
            };
        }
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
          priority={priority}
          loading={priority ? 'eager' : undefined}
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
